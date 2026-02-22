// ============================================================
// Banana Leclerc Challenge 2026 — Clasificación & Scoring Engine
// ============================================================

(function () {

  // --- Toast ---
  function showToast(msg) {
    const t = document.getElementById('toast');
    t.textContent = msg;
    t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 2500);
  }

  // ==================== SCORING ENGINE ====================

  function calculatePhaseDriverScore(predicted, actual, phaseId) {
    if (!predicted || !actual || predicted.length === 0 || actual.length === 0) return 0;
    const pointsTable = CONFIG.SCORING.drivers[phaseId];
    if (!pointsTable) return 0;

    let score = 0;
    const consolationUsed = new Set();

    // Exact position matches
    for (let i = 0; i < predicted.length && i < actual.length; i++) {
      if (predicted[i] === actual[i]) {
        score += pointsTable[i] || 0;
      }
    }

    // Consolation: driver in top 5 but wrong position (no double counting)
    for (let i = 0; i < predicted.length; i++) {
      if (predicted[i] !== actual[i] && actual.includes(predicted[i]) && !consolationUsed.has(predicted[i])) {
        score += CONFIG.SCORING.consolation;
        consolationUsed.add(predicted[i]);
      }
    }

    return score;
  }

  function calculatePhaseConstructorScore(predicted, actual, phaseId) {
    if (!predicted || !actual || predicted.length === 0 || actual.length === 0) return 0;
    const pointsTable = CONFIG.SCORING.constructors[phaseId];
    if (!pointsTable) return 0;

    let score = 0;
    for (let i = 0; i < predicted.length && i < actual.length; i++) {
      if (predicted[i] === actual[i]) {
        score += pointsTable[i] || 0;
      }
    }
    // Consolation for constructors in top 3 but wrong position
    for (let i = 0; i < predicted.length; i++) {
      if (predicted[i] !== actual[i] && actual.includes(predicted[i])) {
        score += CONFIG.SCORING.consolation;
      }
    }
    return score;
  }

  function calculateEventoScore(globalData, playerId, phaseId) {
    const phaseKey = `phase${phaseId}`;
    if (globalData.eventos && globalData.eventos[phaseKey] && globalData.eventos[phaseKey][playerId]) {
      return CONFIG.SCORING.evento;
    }
    return 0;
  }

  function calculateOrdagoScore(globalData, playerId) {
    if (globalData.ordagoVotes && globalData.ordagoVotes[playerId]) {
      const vote = globalData.ordagoVotes[playerId];
      return CONFIG.SCORING.ordago[vote] || 0;
    }
    return 0;
  }

  function calculateBonuses(globalData) {
    let collective = 0;
    const bonuses = globalData.bonuses || {};

    // Collective: Alonso + Sainz wins
    collective += (bonuses.alonso_wins || 0) * CONFIG.COLLECTIVE_BONUSES.alonso_win;
    collective += (bonuses.sainz_wins || 0) * CONFIG.COLLECTIVE_BONUSES.sainz_win;

    // Special bonuses (applied to all players equally)
    const maxWallCount = Array.isArray(bonuses.max_wall) ? bonuses.max_wall.length : (bonuses.max_wall || 0);
    const gaslyChefCount = Array.isArray(bonuses.gasly_chef) ? bonuses.gasly_chef.length : (bonuses.gasly_chef || 0);
    const yukiRadioCount = Array.isArray(bonuses.yuki_radio) ? bonuses.yuki_radio.length : (bonuses.yuki_radio || 0);

    const special = (maxWallCount * CONFIG.SPECIAL_BONUSES.max_wall) +
                    (yukiRadioCount * CONFIG.SPECIAL_BONUSES.yuki_radio);
    // Gasly chef = "double" — we'll treat as +5 per occurrence for simplicity
    const gaslyBonus = gaslyChefCount * 5;

    return { collective, special: special + gaslyBonus };
  }

  function calculatePenalties(globalData, playerId) {
    const penalties = globalData.penalties && globalData.penalties[playerId];
    if (!penalties || !Array.isArray(penalties)) return 0;

    const penaltyConfig = CONFIG.PENALTIES[playerId];
    if (!penaltyConfig) return 0;

    let total = 0;
    for (const p of penalties) {
      const count = p.count || 1;
      // Oscar has two penalty types
      if (playerId === 'oscar' && p.type === 'critica') {
        total += count * (-10);
      } else {
        total += count * penaltyConfig.points;
      }
    }
    return total;
  }

  function calculatePlayerTotal(playerData, globalData, playerId) {
    const breakdown = {
      phases: {},
      evento: 0,
      ordago: 0,
      bonuses: { collective: 0, special: 0 },
      penalties: 0,
      total: 0,
    };

    for (let phase = 1; phase <= 4; phase++) {
      const phaseKey = `phase${phase}`;
      const predictions = playerData[phaseKey] || {};
      const results = (globalData.results && globalData.results[phaseKey]) || {};

      const driverScore = calculatePhaseDriverScore(
        predictions.drivers || [], results.drivers || [], phase
      );
      const constructorScore = calculatePhaseConstructorScore(
        predictions.constructors || [], results.constructors || [], phase
      );
      const eventoScore = calculateEventoScore(globalData, playerId, phase);

      breakdown.phases[phase] = {
        drivers: driverScore,
        constructors: constructorScore,
        evento: eventoScore,
        subtotal: driverScore + constructorScore + eventoScore,
      };
      breakdown.evento += eventoScore;
    }

    breakdown.ordago = calculateOrdagoScore(globalData, playerId);
    breakdown.bonuses = calculateBonuses(globalData);
    breakdown.penalties = calculatePenalties(globalData, playerId);

    const phaseTotal = Object.values(breakdown.phases).reduce((s, p) => s + p.subtotal, 0);
    breakdown.total = phaseTotal + breakdown.ordago +
      breakdown.bonuses.collective + breakdown.bonuses.special + breakdown.penalties;

    return breakdown;
  }

  // ==================== RENDERING ====================

  let allPlayerData = {};
  let globalData = {};
  let scores = {};
  let selectedPlayerId = null;

  async function loadData() {
    try {
      await loadAvatars();
      [allPlayerData, globalData] = await Promise.all([
        Storage.getAllPlayerData(),
        Storage.getGlobalData(),
      ]);

      // Calculate scores for all players
      for (const p of CONFIG.PLAYERS) {
        scores[p.id] = calculatePlayerTotal(allPlayerData[p.id] || {}, globalData, p.id);
      }

      renderLeaderboard();
      renderPlayerTabs();
      renderBonusPenaltyLog();
      renderPredictionsReveal();
    } catch (e) {
      document.getElementById('leaderboard').innerHTML =
        `<p class="text-red">Error cargando datos: ${e.message}</p>`;
    }
  }

  function renderLeaderboard() {
    const sorted = CONFIG.PLAYERS.map(p => ({
      ...p,
      score: scores[p.id],
    })).sort((a, b) => b.score.total - a.score.total);

    const html = `
      <table class="leaderboard">
        <thead>
          <tr>
            <th>#</th>
            <th>Jugador</th>
            <th>Fases</th>
            <th>Evento</th>
            <th>Órdago</th>
            <th>Bonos</th>
            <th>Penal.</th>
            <th style="text-align:right">Total</th>
          </tr>
        </thead>
        <tbody>
          ${sorted.map((p, i) => {
            const s = p.score;
            const phaseTotal = Object.values(s.phases).reduce((sum, ph) => sum + ph.subtotal, 0);
            const bonusTotal = s.bonuses.collective + s.bonuses.special;
            return `
              <tr>
                <td class="rank rank-${i + 1}">${i + 1}</td>
                <td class="flex items-center gap-1">${renderAvatar(p.id, 'avatar-sm')} ${p.name}${renderPlayerStatus(p.id)}</td>
                <td>${phaseTotal}</td>
                <td>${s.evento}</td>
                <td>${s.ordago}</td>
                <td class="text-green">${bonusTotal > 0 ? '+' + bonusTotal : bonusTotal}</td>
                <td class="${s.penalties < 0 ? 'text-red' : ''}">${s.penalties}</td>
                <td class="points">${s.total}</td>
              </tr>
            `;
          }).join('')}
        </tbody>
      </table>
    `;

    document.getElementById('leaderboard').innerHTML = html;
  }

  function renderPlayerTabs() {
    const container = document.getElementById('playerTabs');
    if (!selectedPlayerId) selectedPlayerId = CONFIG.PLAYERS[0].id;

    container.innerHTML = CONFIG.PLAYERS.map(p => `
      <button class="phase-tab ${p.id === selectedPlayerId ? 'active' : ''}" data-player="${p.id}">
        ${renderAvatar(p.id, 'avatar-sm')} ${p.name}${renderPlayerStatus(p.id)}
      </button>
    `).join('');

    container.querySelectorAll('.phase-tab').forEach(btn => {
      btn.addEventListener('click', () => {
        selectedPlayerId = btn.dataset.player;
        renderPlayerTabs();
        renderPlayerBreakdown();
      });
    });

    renderPlayerBreakdown();
  }

  function renderPlayerBreakdown() {
    const s = scores[selectedPlayerId];
    if (!s) return;

    const player = CONFIG.PLAYERS.find(p => p.id === selectedPlayerId);

    // Total next to player name
    let html = `
      <div class="player-tab-header">
        <div>
          ${renderAvatar(selectedPlayerId, 'avatar-sm')} <span style="font-weight:700; font-size:0.9rem;">${player.name}</span>${renderPlayerStatus(selectedPlayerId)}
          <span class="player-tab-total-label" style="margin-left:0.5rem;">Total</span>
        </div>
        <div class="player-tab-total">${s.total} pts</div>
      </div>
    `;

    // Phases row
    html += `<div class="breakdown-phases">`;
    for (let phase = 1; phase <= 4; phase++) {
      const ps = s.phases[phase] || { drivers: 0, constructors: 0, evento: 0, subtotal: 0 };
      html += `
        <div class="breakdown-item">
          <div class="label">Fase ${phase}</div>
          <div class="value">${ps.subtotal}</div>
          <div class="text-muted" style="font-size:0.7rem">
            P: ${ps.drivers} · C: ${ps.constructors} · E: ${ps.evento}
          </div>
        </div>
      `;
    }
    html += `</div>`;

    // Extras row
    html += `<div class="breakdown-extras">
      <div class="breakdown-item">
        <div class="label">Órdago</div>
        <div class="value">${s.ordago}</div>
      </div>
      <div class="breakdown-item">
        <div class="label">Bonos</div>
        <div class="value">${s.bonuses.collective + s.bonuses.special}</div>
      </div>
      <div class="breakdown-item">
        <div class="label">Penaliz.</div>
        <div class="value ${s.penalties < 0 ? 'negative' : ''}">${s.penalties}</div>
      </div>
    </div>`;

    // Show predictions detail
    const pd = allPlayerData[selectedPlayerId];
    const currentUser = sessionStorage.getItem('blc_player');
    if (pd) {
      html += `<div class="mt-2" style="font-size:0.85rem">`;
      // Órdago: solo visible para el propio jugador
      if (selectedPlayerId === currentUser) {
        html += `<p><strong>Órdago:</strong> ${pd.ordago || '<em>No definido</em>'}</p>`;
      } else {
        html += `<p><strong>Órdago:</strong> <em class="text-muted">Secreto hasta final de temporada</em></p>`;
      }
      for (let phase = 1; phase <= 4; phase++) {
        const phaseData = pd[`phase${phase}`] || {};
        if (phaseData.drivers && phaseData.drivers.length > 0) {
          html += `<p class="mt-1"><strong>Fase ${phase}:</strong></p>`;
          html += `<p class="text-muted">Pilotos: ${phaseData.drivers.map(id => {
            const d = getDriver(id);
            return d ? d.name : id;
          }).join(', ')}</p>`;
          html += `<p class="text-muted">Constructores: ${(phaseData.constructors || []).map(id => {
            const t = getTeam(id);
            return t ? t.name : id;
          }).join(', ')}</p>`;
          html += `<p class="text-muted">Evento: ${phaseData.evento || '—'}</p>`;
        }
      }
      html += `</div>`;
    }

    document.getElementById('playerBreakdown').innerHTML = html;
  }

  function renderBonusPenaltyLog() {
    const bonuses = globalData.bonuses || {};
    const penalties = globalData.penalties || {};

    let html = '<ul class="log-list">';

    // Bonuses
    if (bonuses.alonso_wins > 0) {
      html += `<li>🇪🇸 <strong>Alonso</strong>: ${bonuses.alonso_wins} victoria(s) → <span class="text-green">+${bonuses.alonso_wins * CONFIG.COLLECTIVE_BONUSES.alonso_win} pts</span> a todos</li>`;
    }
    if (bonuses.sainz_wins > 0) {
      html += `<li>🇪🇸 <strong>Sainz</strong>: ${bonuses.sainz_wins} victoria(s) → <span class="text-green">+${bonuses.sainz_wins * CONFIG.COLLECTIVE_BONUSES.sainz_win} pts</span> a todos</li>`;
    }

    const maxWall = Array.isArray(bonuses.max_wall) ? bonuses.max_wall.length : (bonuses.max_wall || 0);
    if (maxWall > 0) {
      html += `<li>💥 <strong>Max muro</strong>: ${maxWall} vez(es) → <span class="text-green">+${maxWall * 2} pts</span></li>`;
    }

    const yukiRadio = Array.isArray(bonuses.yuki_radio) ? bonuses.yuki_radio.length : (bonuses.yuki_radio || 0);
    if (yukiRadio > 0) {
      html += `<li>📻 <strong>Yuki grita</strong>: ${yukiRadio} vez(es) → <span class="text-green">+${yukiRadio} pts</span></li>`;
    }

    // Penalties per player
    for (const p of CONFIG.PLAYERS) {
      const pens = penalties[p.id];
      if (pens && pens.length > 0) {
        const totalPen = calculatePenalties(globalData, p.id);
        html += `<li>⚠️ ${renderAvatar(p.id, 'avatar-sm')} <strong>${p.name}</strong>${renderPlayerStatus(p.id)}: ${pens.length} penalización(es) → <span class="text-red">${totalPen} pts</span></li>`;
      }
    }

    if (html === '<ul class="log-list">') {
      html += '<li class="text-muted">No hay bonos ni penalizaciones registrados aún.</li>';
    }

    html += '</ul>';
    document.getElementById('bonusPenaltyLog').innerHTML = html;
  }

  function renderPredictionsReveal() {
    // Only show predictions for phases whose deadline has passed
    const today = new Date().toISOString().slice(0, 10);
    let html = '';

    for (const phase of CONFIG.PHASES) {
      // In dev mode, show all; in prod, check deadline
      const shouldReveal = CONFIG.DEV_MODE || (phase.deadline && today >= phase.deadline);
      if (!shouldReveal) continue;

      html += `<h3 class="mt-2">${phase.label}</h3>`;
      for (const p of CONFIG.PLAYERS) {
        const pd = allPlayerData[p.id];
        const phaseData = pd ? pd[`phase${phase.id}`] : null;
        if (phaseData && phaseData.drivers && phaseData.drivers.length > 0) {
          html += `<p><strong>${renderAvatar(p.id, 'avatar-sm')} ${p.name}:</strong></p>`;
          html += `<p class="text-muted" style="font-size:0.8rem; margin-left:1rem;">
            Pilotos: ${phaseData.drivers.map(id => { const d = getDriver(id); return d ? d.name : id; }).join(' → ')}
            <br>Equipos: ${(phaseData.constructors || []).map(id => { const t = getTeam(id); return t ? t.name : id; }).join(' → ')}
            <br>Evento: ${phaseData.evento || '—'}
          </p>`;
        } else {
          html += `<p><strong>${renderAvatar(p.id, 'avatar-sm')} ${p.name}:</strong> <span class="text-muted">Sin predicción</span></p>`;
        }
      }
    }

    if (!html) {
      html = '<p class="text-muted">Aún no hay fases cerradas. Las predicciones se revelarán cuando pase el plazo.</p>';
    }

    document.getElementById('predictionsReveal').innerHTML = html;
  }

  // --- Init ---
  loadData();
})();

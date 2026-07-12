// ============================================================
// Banana Leclerc Challenge 2026 — Admin Panel
// ============================================================

(function () {
  let globalData = null;

  // --- Toast ---
  function showToast(msg) {
    const t = document.getElementById('toast');
    t.textContent = msg;
    t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 2500);
  }

  // --- PIN gate ---
  document.getElementById('btnPin').addEventListener('click', () => {
    const pin = document.getElementById('pinInput').value;
    if (pin === CONFIG.ADMIN_PIN) {
      document.getElementById('pinGate').classList.add('hidden');
      document.getElementById('adminContent').classList.remove('hidden');
      init();
    } else {
      document.getElementById('pinError').classList.remove('hidden');
    }
  });

  document.getElementById('pinInput').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') document.getElementById('btnPin').click();
  });

  // --- Phase results (Top 5 drivers / Top 3 constructors) ---
  let resultsPhase = 1;

  const F1_API = 'https://api.jolpi.ca/ergast/f1';
  // La API usa ids propios; estos son los que no se deducen del nuestro
  const API_TEAM_ALIASES = { rb: 'racing-bulls', kick_sauber: 'audi', sauber: 'audi' };

  function apiDriverToId(apiDriver) {
    const apiId = apiDriver.driverId || '';
    const familyName = apiDriver.familyName || '';
    for (const d of CONFIG.DRIVERS) {
      if (apiId === d.id || apiId.includes(d.id)) return d.id;
      if (familyName && d.name.toLowerCase().endsWith(familyName.toLowerCase())) return d.id;
    }
    return null;
  }

  function apiTeamToId(apiId) {
    if (API_TEAM_ALIASES[apiId]) return API_TEAM_ALIASES[apiId];
    for (const t of CONFIG.TEAMS) {
      const norm = t.id.replace(/-/g, '_');
      if (apiId === norm || apiId === t.id || apiId.includes(norm) || norm.includes(apiId)) return t.id;
      if (t.name.toLowerCase().replace(/\s/g, '') === apiId.replace(/_/g, '')) return t.id;
    }
    return null;
  }

  function lastRoundOfPhase(phaseId) {
    const races = CONFIG.RACES.filter(r => getPhaseForRound(r.round) === phaseId);
    return races.length ? races[races.length - 1].round : null;
  }

  function renderResultsPhaseTabs() {
    const container = document.getElementById('resultsPhaseTabs');
    container.innerHTML = CONFIG.PHASES.map(p => `
      <button class="phase-tab ${p.id === resultsPhase ? 'active' : ''}" data-phase="${p.id}">
        ${p.label}
      </button>
    `).join('');
    container.querySelectorAll('.phase-tab').forEach(btn => {
      btn.addEventListener('click', () => {
        resultsPhase = parseInt(btn.dataset.phase);
        renderResultsPhaseTabs();
        renderResultsSection();
      });
    });
  }

  function renderResultsSection() {
    const res = (globalData.results && globalData.results[`phase${resultsPhase}`]) || {};
    const drivers = res.drivers || [];
    const teams = res.constructors || [];

    const driverOptions = (selected) => `<option value="">— Sin definir —</option>` +
      CONFIG.DRIVERS.map(d =>
        `<option value="${d.id}" ${d.id === selected ? 'selected' : ''}>${d.name}</option>`
      ).join('');
    const teamOptions = (selected) => `<option value="">— Sin definir —</option>` +
      CONFIG.TEAMS.map(t =>
        `<option value="${t.id}" ${t.id === selected ? 'selected' : ''}>${t.name}</option>`
      ).join('');

    let html = '<p class="mb-1" style="font-size:0.85rem"><strong>Top 5 Pilotos</strong></p>';
    for (let i = 0; i < 5; i++) {
      html += `
        <div class="flex items-center gap-1 mb-1">
          <span style="width:1.5rem; text-align:right; font-size:0.85rem">${i + 1}.</span>
          <select id="resDriver_${i}" style="max-width:280px">${driverOptions(drivers[i])}</select>
        </div>
      `;
    }
    html += '<p class="mb-1 mt-2" style="font-size:0.85rem"><strong>Top 3 Constructores</strong></p>';
    for (let i = 0; i < 3; i++) {
      html += `
        <div class="flex items-center gap-1 mb-1">
          <span style="width:1.5rem; text-align:right; font-size:0.85rem">${i + 1}.</span>
          <select id="resTeam_${i}" style="max-width:280px">${teamOptions(teams[i])}</select>
        </div>
      `;
    }
    document.getElementById('resultsSection').innerHTML = html;
  }

  document.getElementById('btnSaveResults').addEventListener('click', async () => {
    const drivers = [];
    for (let i = 0; i < 5; i++) {
      const v = document.getElementById(`resDriver_${i}`).value;
      if (v) drivers.push(v);
    }
    const teams = [];
    for (let i = 0; i < 3; i++) {
      const v = document.getElementById(`resTeam_${i}`).value;
      if (v) teams.push(v);
    }

    if (new Set(drivers).size !== drivers.length || new Set(teams).size !== teams.length) {
      showToast('Hay repetidos, comisario. Revisa las posiciones.');
      return;
    }
    if ((drivers.length > 0 && drivers.length < 5) || (teams.length > 0 && teams.length < 3)) {
      showToast('Completa el Top 5 y el Top 3 (o déjalos vacíos para borrar).');
      return;
    }

    if (!globalData.results) globalData.results = {};
    globalData.results[`phase${resultsPhase}`] = { drivers, constructors: teams };

    try {
      await Storage.saveGlobalData(globalData, ['results']);
      showToast(`Resultados de Fase ${resultsPhase} guardados`);
    } catch (e) {
      showToast('Error: ' + e.message);
    }
  });

  document.getElementById('btnImportResults').addEventListener('click', async () => {
    const round = lastRoundOfPhase(resultsPhase);
    const btn = document.getElementById('btnImportResults');
    btn.disabled = true;
    btn.textContent = 'Importando...';
    try {
      const [dResp, cResp] = await Promise.all([
        fetch(`${F1_API}/2026/${round}/driverStandings.json`),
        fetch(`${F1_API}/2026/${round}/constructorStandings.json`),
      ]);
      if (!dResp.ok || !cResp.ok) throw new Error('la API de F1 no responde');
      const dLists = (await dResp.json()).MRData.StandingsTable.StandingsLists;
      const cLists = (await cResp.json()).MRData.StandingsTable.StandingsLists;
      if (!dLists.length || !cLists.length) {
        showToast(`La fase ${resultsPhase} aún no ha terminado en la API (ronda ${round})`);
        return;
      }

      const topDrivers = dLists[0].DriverStandings.slice(0, 5).map(s => apiDriverToId(s.Driver));
      const topTeams = cLists[0].ConstructorStandings.slice(0, 3).map(s => apiTeamToId(s.Constructor.constructorId));
      if (topDrivers.includes(null) || topTeams.includes(null)) {
        showToast('No he podido mapear algún piloto/equipo de la API. Rellena a mano.');
      }

      topDrivers.forEach((id, i) => { if (id) document.getElementById(`resDriver_${i}`).value = id; });
      topTeams.forEach((id, i) => { if (id) document.getElementById(`resTeam_${i}`).value = id; });
      showToast('Importado. Revisa y pulsa Guardar.');
    } catch (e) {
      showToast('Error importando: ' + e.message);
    } finally {
      btn.disabled = false;
      btn.textContent = '📡 Importar de la API';
    }
  });

  // --- Evento validation ---
  async function renderEventoValidation() {
    const allPlayerData = await Storage.getAllPlayerData();

    let html = '';
    for (let phase = 1; phase <= 4; phase++) {
      const phaseKey = `phase${phase}`;
      html += `<h3 class="mt-2">Fase ${phase}</h3>`;

      for (const p of CONFIG.PLAYERS) {
        const pd = allPlayerData[p.id];
        const evento = pd && pd[phaseKey] ? pd[phaseKey].evento : '';
        const isChecked = globalData.eventos &&
          globalData.eventos[phaseKey] &&
          globalData.eventos[phaseKey][p.id];

        html += `
          <div class="flex items-center gap-1 mb-1" style="font-size:0.85rem">
            <input type="checkbox" id="evento_${phase}_${p.id}"
              ${isChecked ? 'checked' : ''}
              data-phase="${phase}" data-player="${p.id}">
            <label for="evento_${phase}_${p.id}">
              ${renderAvatar(p.id, 'avatar-sm')} <strong>${p.name}</strong>${renderPlayerStatus(p.id)}: ${evento ? escapeHtml(evento) : '<em>Sin evento</em>'}
            </label>
          </div>
        `;
      }
    }

    document.getElementById('eventoValidation').innerHTML = html;
  }

  document.getElementById('btnSaveEventos').addEventListener('click', async () => {
    if (!globalData.eventos) globalData.eventos = {};

    for (let phase = 1; phase <= 4; phase++) {
      const phaseKey = `phase${phase}`;
      if (!globalData.eventos[phaseKey]) globalData.eventos[phaseKey] = {};

      for (const p of CONFIG.PLAYERS) {
        const cb = document.getElementById(`evento_${phase}_${p.id}`);
        globalData.eventos[phaseKey][p.id] = cb ? cb.checked : false;
      }
    }

    try {
      await Storage.saveGlobalData(globalData, ['eventos']);
      showToast('Eventos guardados');
    } catch (e) {
      showToast('Error: ' + e.message);
    }
  });

  // --- Órdago voting ---
  async function renderOrdagoVoting() {
    const allPlayerData = await Storage.getAllPlayerData();

    let html = '';
    const options = ['exact', 'partial', 'similar', 'fail'];
    const labels = {
      exact: 'Exacto (25 pts)',
      partial: 'Parcial (15 pts)',
      similar: 'Similar (5 pts)',
      fail: 'Fallido (0 pts)',
    };

    for (const p of CONFIG.PLAYERS) {
      const ordago = allPlayerData[p.id] ? allPlayerData[p.id].ordago : '';
      const currentVote = globalData.ordagoVotes && globalData.ordagoVotes[p.id];

      html += `
        <div class="mb-2">
          <p><strong>${renderAvatar(p.id, 'avatar-sm')} ${p.name}:</strong> ${ordago ? escapeHtml(ordago) : '<em>Sin órdago</em>'}</p>
          <select id="ordago_${p.id}" style="max-width:300px">
            <option value="">— Sin votar —</option>
            ${options.map(o => `
              <option value="${o}" ${currentVote === o ? 'selected' : ''}>${labels[o]}</option>
            `).join('')}
          </select>
        </div>
      `;
    }

    document.getElementById('ordagoVoting').innerHTML = html;
  }

  document.getElementById('btnSaveOrdago').addEventListener('click', async () => {
    if (!globalData.ordagoVotes) globalData.ordagoVotes = {};

    for (const p of CONFIG.PLAYERS) {
      const sel = document.getElementById(`ordago_${p.id}`);
      if (sel && sel.value) {
        globalData.ordagoVotes[p.id] = sel.value;
      }
    }

    try {
      await Storage.saveGlobalData(globalData, ['ordagoVotes']);
      showToast('Votos de órdago guardados');
    } catch (e) {
      showToast('Error: ' + e.message);
    }
  });

  // --- Bonuses ---
  function loadBonuses() {
    const b = globalData.bonuses || {};
    document.getElementById('alonsoWins').value = b.alonso_wins || 0;
    document.getElementById('sainzWins').value = b.sainz_wins || 0;

    const maxWall = Array.isArray(b.max_wall) ? b.max_wall.length : (b.max_wall || 0);
    const yukiRadio = Array.isArray(b.yuki_radio) ? b.yuki_radio.length : (b.yuki_radio || 0);

    document.getElementById('maxWall').value = maxWall;
    document.getElementById('yukiRadio').value = yukiRadio;

    const gaslyPhases = b.gasly_chef_phases || [];
    for (let phase = 1; phase <= 4; phase++) {
      document.getElementById(`gaslyPhase_${phase}`).checked = gaslyPhases.includes(phase);
    }
  }

  document.getElementById('btnSaveBonuses').addEventListener('click', async () => {
    if (!globalData.bonuses) globalData.bonuses = {};

    globalData.bonuses.alonso_wins = parseInt(document.getElementById('alonsoWins').value) || 0;
    globalData.bonuses.sainz_wins = parseInt(document.getElementById('sainzWins').value) || 0;
    globalData.bonuses.max_wall = parseInt(document.getElementById('maxWall').value) || 0;
    globalData.bonuses.yuki_radio = parseInt(document.getElementById('yukiRadio').value) || 0;

    const gaslyPhases = [];
    for (let phase = 1; phase <= 4; phase++) {
      if (document.getElementById(`gaslyPhase_${phase}`).checked) gaslyPhases.push(phase);
    }
    globalData.bonuses.gasly_chef_phases = gaslyPhases;

    try {
      await Storage.saveGlobalData(globalData, ['bonuses']);
      showToast('Bonos guardados');
    } catch (e) {
      showToast('Error: ' + e.message);
    }
  });

  // --- Penalties ---
  async function renderPenalties() {
    let html = '';

    for (const p of CONFIG.PLAYERS) {
      const penConfig = CONFIG.PENALTIES[p.id];
      const existing = (globalData.penalties && globalData.penalties[p.id]) || [];
      // Oscar tiene dos tipos: las de type 'critica' van a -10, el resto al precio base
      const criticaCount = existing.filter(e => e.type === 'critica').length;
      const baseCount = existing.length - criticaCount;

      html += `
        <div class="mb-2">
          <p><strong>${renderAvatar(p.id, 'avatar-sm')} ${p.name}</strong>
          <span class="text-muted" style="font-size:0.75rem">(${penConfig.desc}: ${penConfig.points} pts c/u)</span></p>
          <div class="flex items-center gap-1">
            <label>${p.id === 'oscar' ? 'Voto opuesto a mamá (-5):' : 'Cantidad:'}</label>
            <input type="number" id="penalty_${p.id}" min="0" max="50" value="${baseCount}" style="width:60px">
          </div>
          ${p.id === 'oscar' ? `
          <div class="flex items-center gap-1 mt-1">
            <label>Crítica a pilotos protegidos (-10):</label>
            <input type="number" id="penalty_oscar_critica" min="0" max="50" value="${criticaCount}" style="width:60px">
          </div>` : ''}
        </div>
      `;
    }

    document.getElementById('penaltySection').innerHTML = html;
  }

  document.getElementById('btnSavePenalties').addEventListener('click', async () => {
    if (!globalData.penalties) globalData.penalties = {};

    for (const p of CONFIG.PLAYERS) {
      const count = parseInt(document.getElementById(`penalty_${p.id}`).value) || 0;
      const arr = [];
      for (let i = 0; i < count; i++) {
        arr.push({ count: 1 });
      }
      if (p.id === 'oscar') {
        const criticas = parseInt(document.getElementById('penalty_oscar_critica').value) || 0;
        for (let i = 0; i < criticas; i++) {
          arr.push({ count: 1, type: 'critica' });
        }
      }
      globalData.penalties[p.id] = arr;
    }

    try {
      await Storage.saveGlobalData(globalData, ['penalties']);
      showToast('Penalizaciones guardadas');
    } catch (e) {
      showToast('Error: ' + e.message);
    }
  });

  // --- Unlock predictions ---
  function renderUnlocks() {
    if (!globalData.unlocks) globalData.unlocks = {};
    const today = new Date().toISOString().slice(0, 10);

    // Find closed phases
    const closedPhases = CONFIG.PHASES.filter(p => p.deadline && today >= p.deadline);

    if (closedPhases.length === 0) {
      document.getElementById('unlockSection').innerHTML =
        '<p class="text-muted" style="font-size:0.8rem">No hay fases cerradas todavía.</p>';
      return;
    }

    let html = '<div class="unlock-grid">';
    for (const p of CONFIG.PLAYERS) {
      html += `
        <div class="unlock-player">
          <div class="unlock-player-info">
            ${renderAvatar(p.id, 'avatar-sm')}
            <strong>${p.name}</strong>
          </div>
          <div class="unlock-phases">
      `;
      for (const phase of closedPhases) {
        const phaseKey = `phase${phase.id}`;
        const unlocked = (globalData.unlocks[phaseKey] || []).includes(p.id);
        html += `
            <label class="unlock-toggle ${unlocked ? 'active' : ''}">
              <input type="checkbox" id="unlock_${phase.id}_${p.id}"
                ${unlocked ? 'checked' : ''} style="display:none">
              <span>F${phase.id}</span>
            </label>
        `;
      }
      html += `</div></div>`;
    }
    html += '</div>';

    document.getElementById('unlockSection').innerHTML = html;

    // Toggle visual state on click
    document.querySelectorAll('.unlock-toggle').forEach(label => {
      label.addEventListener('click', () => {
        setTimeout(() => {
          const cb = label.querySelector('input');
          label.classList.toggle('active', cb.checked);
        }, 0);
      });
    });
  }

  document.getElementById('btnSaveUnlocks').addEventListener('click', async () => {
    if (!globalData.unlocks) globalData.unlocks = {};

    for (let phase = 1; phase <= 4; phase++) {
      const phaseKey = `phase${phase}`;
      const unlocked = [];

      for (const p of CONFIG.PLAYERS) {
        const cb = document.getElementById(`unlock_${phase}_${p.id}`);
        if (cb && cb.checked) {
          unlocked.push(p.id);
        }
      }

      globalData.unlocks[phaseKey] = unlocked;
    }

    try {
      await Storage.saveGlobalData(globalData, ['unlocks']);
      showToast('Desbloqueos guardados');
      renderUnlocks();
    } catch (e) {
      showToast('Error: ' + e.message);
    }
  });

  // --- Personal links ---
  function renderPersonalLinks() {
    const base = new URL('index.html', window.location.href).href;
    let html = '';
    for (const p of CONFIG.PLAYERS) {
      const link = `${base}?player=${p.id}`;
      html += `
        <div class="personal-link-row">
          <span class="personal-link-name">${renderAvatar(p.id, 'avatar-sm')} <strong>${p.name}</strong></span>
          <input type="text" readonly value="${link}" id="link_${p.id}">
          <button class="btn btn-secondary btn-small" data-link="${link}" data-input="link_${p.id}">Copiar</button>
        </div>
      `;
    }
    document.getElementById('personalLinks').innerHTML = html;

    document.querySelectorAll('#personalLinks button').forEach(btn => {
      btn.addEventListener('click', async () => {
        try {
          await navigator.clipboard.writeText(btn.dataset.link);
          showToast('Link copiado');
        } catch {
          // Fallback (http o navegadores viejos): seleccionar para copiar a mano
          const input = document.getElementById(btn.dataset.input);
          input.focus();
          input.select();
          showToast('Copia el link seleccionado');
        }
      });
    });
  }

  // --- Change player ---
  document.getElementById('btnChangePlayer').addEventListener('click', () => {
    clearSessionPlayer();
    window.location.href = 'index.html';
  });

  // --- Dev tools ---
  document.getElementById('btnResetAll').addEventListener('click', () => {
    if (confirm('¿Borrar TODOS los datos locales? Esto no se puede deshacer.')) {
      Storage.resetAll();
      showToast('Datos borrados');
      setTimeout(() => location.reload(), 500);
    }
  });

  // Hide dev tools if not in dev mode
  if (!CONFIG.DEV_MODE) {
    document.getElementById('devTools').classList.add('hidden');
  }

  // --- Init ---
  async function init() {
    await loadAvatars();
    try {
      globalData = await Storage.getGlobalData();
    } catch {
      globalData = (await Storage.load()).global;
    }

    renderResultsPhaseTabs();
    renderResultsSection();
    loadBonuses();
    renderEventoValidation();
    renderOrdagoVoting();
    renderPenalties();
    renderUnlocks();
    renderPersonalLinks();
  }
})();

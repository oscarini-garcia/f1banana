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
              ${renderAvatar(p.id, 'avatar-sm')} <strong>${p.name}</strong>${renderPlayerStatus(p.id)}: ${evento || '<em>Sin evento</em>'}
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
      await Storage.saveGlobalData(globalData);
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
          <p><strong>${renderAvatar(p.id, 'avatar-sm')} ${p.name}:</strong> ${ordago || '<em>Sin órdago</em>'}</p>
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
      await Storage.saveGlobalData(globalData);
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
    const gaslyChef = Array.isArray(b.gasly_chef) ? b.gasly_chef.length : (b.gasly_chef || 0);
    const yukiRadio = Array.isArray(b.yuki_radio) ? b.yuki_radio.length : (b.yuki_radio || 0);

    document.getElementById('maxWall').value = maxWall;
    document.getElementById('gaslyChef').value = gaslyChef;
    document.getElementById('yukiRadio').value = yukiRadio;
  }

  document.getElementById('btnSaveBonuses').addEventListener('click', async () => {
    if (!globalData.bonuses) globalData.bonuses = {};

    globalData.bonuses.alonso_wins = parseInt(document.getElementById('alonsoWins').value) || 0;
    globalData.bonuses.sainz_wins = parseInt(document.getElementById('sainzWins').value) || 0;
    globalData.bonuses.max_wall = parseInt(document.getElementById('maxWall').value) || 0;
    globalData.bonuses.gasly_chef = parseInt(document.getElementById('gaslyChef').value) || 0;
    globalData.bonuses.yuki_radio = parseInt(document.getElementById('yukiRadio').value) || 0;

    try {
      await Storage.saveGlobalData(globalData);
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

      html += `
        <div class="mb-2">
          <p><strong>${renderAvatar(p.id, 'avatar-sm')} ${p.name}</strong>
          <span class="text-muted" style="font-size:0.75rem">(${penConfig.desc}: ${penConfig.points} pts c/u)</span></p>
          <div class="flex items-center gap-1">
            <label>Cantidad:</label>
            <input type="number" id="penalty_${p.id}" min="0" max="50" value="${existing.length}" style="width:60px">
          </div>
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
      globalData.penalties[p.id] = arr;
    }

    try {
      await Storage.saveGlobalData(globalData);
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
      await Storage.saveGlobalData(globalData);
      showToast('Desbloqueos guardados');
      renderUnlocks();
    } catch (e) {
      showToast('Error: ' + e.message);
    }
  });

  // --- Force refresh ---
  document.getElementById('btnForceRefresh').addEventListener('click', () => {
    // Clear in-memory cache without deleting persisted state
    localStorage.removeItem('blc_last_reload');
    location.reload(true);
  });

  // --- Change player ---
  document.getElementById('btnChangePlayer').addEventListener('click', () => {
    sessionStorage.removeItem('blc_player');
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

    loadBonuses();
    renderEventoValidation();
    renderOrdagoVoting();
    renderPenalties();
    renderUnlocks();
  }
})();

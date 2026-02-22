// ============================================================
// Banana Leclerc Challenge 2026 — Predicciones (Custom dropdowns with logos)
// ============================================================

(function () {
  const playerId = getSessionPlayer();
  if (!playerId) {
    window.location.href = 'index.html';
    return;
  }

  const player = CONFIG.PLAYERS.find(p => p.id === playerId);
  document.getElementById('playerTitle').innerHTML = `${renderAvatar(playerId, 'avatar-sm')} ${player.name}${renderPlayerStatus(playerId)}`;

  let currentPhase = 1;
  let playerData = null;
  let selectedDrivers = [];
  let selectedTeams = [];
  let phaseLocked = false;

  function showToast(msg) {
    const t = document.getElementById('toast');
    t.textContent = msg;
    t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 2500);
  }

  // --- Phase tabs ---
  function renderPhaseTabs() {
    const container = document.getElementById('phaseTabs');
    container.innerHTML = CONFIG.PHASES.map(p => `
      <button class="phase-tab ${p.id === currentPhase ? 'active' : ''}" data-phase="${p.id}">
        ${p.label} (${p.races})
      </button>
    `).join('');
    container.querySelectorAll('.phase-tab').forEach(btn => {
      btn.addEventListener('click', () => {
        currentPhase = parseInt(btn.dataset.phase);
        loadPhaseData();
        renderPhaseTabs();
      });
    });
  }

  // --- Lock UI ---
  function updateLockState() {
    phaseLocked = isPhaseLocked(currentPhase, playerId);

    const btnSave = document.getElementById('btnSave');
    const eventoInput = document.getElementById('eventoInput');
    const lockBanner = document.getElementById('lockBanner');

    if (phaseLocked) {
      btnSave.disabled = true;
      btnSave.textContent = 'Fase cerrada';
      eventoInput.disabled = true;
      lockBanner.classList.remove('hidden');
    } else {
      btnSave.disabled = false;
      btnSave.textContent = 'Guardar predicciones';
      eventoInput.disabled = false;
      lockBanner.classList.add('hidden');
    }
  }

  // --- Custom dropdown for a single slot ---
  function buildCustomDropdown(containerId, idx, options, currentValue) {
    const usedValues = containerId === 'selectedDrivers'
      ? selectedDrivers.filter((v, i) => v && i !== idx)
      : selectedTeams.filter((v, i) => v && i !== idx);

    const current = options.find(o => o.id === currentValue);
    const teamBadge = current && current.teamId ? renderTeamBadge(current.teamId, 'sm') : '';

    // If locked, don't show clear button and trigger is not clickable
    const clearBtn = current && !phaseLocked
      ? `<button class="cdd-clear" data-idx="${idx}" data-target="${containerId}" type="button">✕</button>`
      : '';

    return `
      <div class="custom-dropdown ${phaseLocked ? 'cdd-locked' : ''}" data-idx="${idx}" data-target="${containerId}">
        <div class="dropdown-pos">${idx + 1}</div>
        <button class="custom-dropdown-trigger" type="button" ${phaseLocked ? 'disabled' : ''}>
          ${current
            ? `<span class="cdd-selected">${teamBadge} <span>${current.label}</span></span>`
            : `<span class="cdd-placeholder">Seleccionar...</span>`
          }
          <svg class="cdd-arrow" width="10" height="6" viewBox="0 0 10 6"><path d="M1 1l4 4 4-4" stroke="currentColor" stroke-width="1.5" fill="none"/></svg>
        </button>
        ${clearBtn}
      </div>
    `;
  }

  function openDropdownPanel(idx, containerId) {
    if (phaseLocked) return;
    closeAllPanels();
    const options = containerId === 'selectedDrivers'
      ? CONFIG.DRIVERS.map(d => {
          const team = getTeam(d.team);
          return { id: d.id, label: d.name, sublabel: team.name, teamId: d.team };
        })
      : CONFIG.TEAMS.map(t => ({ id: t.id, label: t.name, sublabel: '', teamId: t.id }));

    const usedValues = containerId === 'selectedDrivers'
      ? selectedDrivers.filter((v, i) => v && i !== idx)
      : selectedTeams.filter((v, i) => v && i !== idx);

    const currentValue = containerId === 'selectedDrivers' ? selectedDrivers[idx] : selectedTeams[idx];

    const panel = document.createElement('div');
    panel.className = 'cdd-panel';
    panel.innerHTML = options.map(o => {
      const used = usedValues.includes(o.id);
      const active = o.id === currentValue;
      return `
        <div class="cdd-option ${used ? 'cdd-disabled' : ''} ${active ? 'cdd-active' : ''}" data-id="${o.id}">
          ${renderTeamBadge(o.teamId, 'sm')}
          <div class="cdd-option-text">
            <span class="cdd-option-name">${o.label}</span>
            ${o.sublabel ? `<span class="cdd-option-sub">${o.sublabel}</span>` : ''}
          </div>
        </div>
      `;
    }).join('');

    const wrapper = document.querySelector(`.custom-dropdown[data-idx="${idx}"][data-target="${containerId}"]`);
    wrapper.appendChild(panel);
    wrapper.classList.add('cdd-open');

    panel.querySelectorAll('.cdd-option:not(.cdd-disabled)').forEach(opt => {
      opt.addEventListener('click', () => {
        if (containerId === 'selectedDrivers') {
          selectedDrivers[idx] = opt.dataset.id;
        } else {
          selectedTeams[idx] = opt.dataset.id;
        }
        closeAllPanels();
        renderAll();
      });
    });

    setTimeout(() => {
      document.addEventListener('click', closeOnOutside);
    }, 0);
  }

  function closeAllPanels() {
    document.querySelectorAll('.cdd-panel').forEach(p => p.remove());
    document.querySelectorAll('.cdd-open').forEach(el => el.classList.remove('cdd-open'));
    document.removeEventListener('click', closeOnOutside);
  }

  function closeOnOutside(e) {
    if (!e.target.closest('.custom-dropdown')) {
      closeAllPanels();
    }
  }

  // --- Render all dropdowns ---
  function renderAll() {
    renderDriverSelectors();
    renderTeamSelectors();
  }

  function renderDriverSelectors() {
    const container = document.getElementById('selectedDrivers');
    let html = '';
    for (let i = 0; i < 5; i++) {
      html += buildCustomDropdown('selectedDrivers', i,
        CONFIG.DRIVERS.map(d => ({ id: d.id, label: d.name, teamId: d.team })),
        selectedDrivers[i]);
    }
    container.innerHTML = html;
    if (!phaseLocked) attachDropdownEvents(container, 'selectedDrivers');
  }

  function renderTeamSelectors() {
    const container = document.getElementById('selectedConstructors');
    let html = '';
    for (let i = 0; i < 3; i++) {
      html += buildCustomDropdown('selectedConstructors', i,
        CONFIG.TEAMS.map(t => ({ id: t.id, label: t.name, teamId: t.id })),
        selectedTeams[i]);
    }
    container.innerHTML = html;
    if (!phaseLocked) attachDropdownEvents(container, 'selectedConstructors');
  }

  function attachDropdownEvents(container, targetId) {
    container.querySelectorAll('.custom-dropdown-trigger').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const wrapper = btn.closest('.custom-dropdown');
        const idx = parseInt(wrapper.dataset.idx);
        if (wrapper.classList.contains('cdd-open')) {
          closeAllPanels();
        } else {
          openDropdownPanel(idx, targetId);
        }
      });
    });

    container.querySelectorAll('.cdd-clear').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const idx = parseInt(btn.dataset.idx);
        if (targetId === 'selectedDrivers') {
          selectedDrivers[idx] = undefined;
          while (selectedDrivers.length > 0 && !selectedDrivers[selectedDrivers.length - 1]) selectedDrivers.pop();
        } else {
          selectedTeams[idx] = undefined;
          while (selectedTeams.length > 0 && !selectedTeams[selectedTeams.length - 1]) selectedTeams.pop();
        }
        renderAll();
      });
    });
  }

  // --- Órdago ---
  function updateOrdagoVisibility() {
    const card = document.getElementById('ordagoCard');
    const input = document.getElementById('ordagoInput');
    if (currentPhase === 1) {
      card.classList.remove('hidden');
      // Lock órdago if phase 1 deadline passed
      if (phaseLocked) {
        input.disabled = true;
      }
    } else {
      if (playerData && playerData.ordago) {
        card.classList.remove('hidden');
        input.value = playerData.ordago;
        input.disabled = true;
        card.querySelector('p').textContent = 'Tu órdago (no se puede cambiar):';
      } else {
        card.classList.add('hidden');
      }
    }
  }

  // --- Load phase data ---
  function loadPhaseData() {
    const phaseKey = `phase${currentPhase}`;
    if (playerData && playerData[phaseKey]) {
      selectedDrivers = [...(playerData[phaseKey].drivers || [])];
      selectedTeams = [...(playerData[phaseKey].constructors || [])];
      document.getElementById('eventoInput').value = playerData[phaseKey].evento || '';
    } else {
      selectedDrivers = [];
      selectedTeams = [];
      document.getElementById('eventoInput').value = '';
    }
    if (currentPhase === 1 && playerData) {
      document.getElementById('ordagoInput').value = playerData.ordago || '';
    }
    updateLockState();
    renderAll();
    updateOrdagoVisibility();
  }

  // --- Save ---
  async function save() {
    if (phaseLocked) { showToast('Esta fase está cerrada'); return; }

    const phaseKey = `phase${currentPhase}`;
    const drivers = selectedDrivers.filter(Boolean);
    const teams = selectedTeams.filter(Boolean);

    if (drivers.length < 5) { showToast('Necesitas 5 pilotos'); return; }
    if (teams.length < 3) { showToast('Necesitas 3 constructores'); return; }
    const evento = document.getElementById('eventoInput').value.trim();
    if (!evento) { showToast('Escribe un evento para la fase'); return; }

    playerData[phaseKey] = { drivers, constructors: teams, evento };

    if (currentPhase === 1) {
      const ordago = document.getElementById('ordagoInput').value.trim();
      if (!ordago) { showToast('Escribe tu órdago'); return; }
      playerData.ordago = ordago;
    }

    const btn = document.getElementById('btnSave');
    btn.disabled = true;
    btn.textContent = 'Guardando...';
    try {
      await Storage.savePlayerData(playerId, playerData);
      showToast('Predicciones guardadas');
      document.getElementById('saveStatus').textContent = `Guardado: ${new Date().toLocaleTimeString('es-ES')}`;
    } catch (e) {
      showToast('Error al guardar: ' + e.message);
    } finally {
      btn.disabled = false;
      btn.textContent = 'Guardar predicciones';
    }
  }

  document.getElementById('btnSave').addEventListener('click', save);

  async function init() {
    await loadAvatars();
    try { playerData = await Storage.getPlayerData(playerId); }
    catch { playerData = Storage.createEmptyPlayerData(); }
    renderPhaseTabs();
    loadPhaseData();
  }

  init();
})();

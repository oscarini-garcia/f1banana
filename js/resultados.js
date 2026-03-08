// ============================================================
// Banana Leclerc Challenge 2026 — Resultados (Results Page)
// ============================================================

(function () {

  let globalData = {};
  let allPlayerData = {};
  let selectedPhase = 1;

  // --- Init ---
  async function init() {
    await loadAvatars();
    const state = await Storage.load();
    globalData = state.global;
    allPlayerData = state.players;

    renderPhaseTabs();
    renderPhaseResults();
    renderPlayerCompTabs();
    renderPlayerComparison();
    renderChampionship();
  }

  // ==================== PHASE RESULTS ====================

  function renderPhaseTabs() {
    const container = document.getElementById('phaseTabs');
    container.innerHTML = CONFIG.PHASES.map(p => `
      <button class="phase-tab ${p.id === selectedPhase ? 'active' : ''}" data-phase="${p.id}">
        ${p.label}
      </button>
    `).join('');
    container.querySelectorAll('.phase-tab').forEach(btn => {
      btn.addEventListener('click', () => {
        selectedPhase = parseInt(btn.dataset.phase);
        renderPhaseTabs();
        renderPhaseResults();
        renderPlayerCompTabs();
        renderPlayerComparison();
      });
    });
  }

  function renderPhaseResults() {
    const phaseKey = `phase${selectedPhase}`;
    const results = (globalData.results && globalData.results[phaseKey]) || {};
    const drivers = results.drivers || [];
    const constructors = results.constructors || [];
    const el = document.getElementById('phaseResults');

    if (drivers.length === 0 && constructors.length === 0) {
      el.innerHTML = '<p class="text-muted">No hay resultados introducidos para esta fase todavia.</p>';
      return;
    }

    let html = '';

    // Drivers
    if (drivers.length > 0) {
      html += '<h3>Top 5 Pilotos</h3>';
      html += '<div class="results-list">';
      drivers.forEach((driverId, i) => {
        const driver = getDriver(driverId);
        if (!driver) return;
        const team = getTeam(driver.team);
        const imgUrl = getDriverImageUrl(driver);
        html += `
          <div class="result-row">
            <div class="result-pos" style="background: ${getTeamColor(driver.team)}">${i + 1}</div>
            ${imgUrl ? `<img src="${imgUrl}" class="result-driver-img" alt="${driver.name}">` : ''}
            <div class="result-info">
              <span class="result-name">${driver.name}</span>
              <span class="result-team" style="color: ${getTeamColor(driver.team)}">${team ? team.name : ''}</span>
            </div>
            ${team ? renderTeamBadge(team.id, 'sm') : ''}
          </div>
        `;
      });
      html += '</div>';
    }

    // Constructors
    if (constructors.length > 0) {
      html += '<h3 class="mt-2">Top 3 Constructores</h3>';
      html += '<div class="results-list">';
      constructors.forEach((teamId, i) => {
        const team = getTeam(teamId);
        if (!team) return;
        html += `
          <div class="result-row">
            <div class="result-pos" style="background: ${team.color}">${i + 1}</div>
            ${renderTeamBadge(team.id)}
            <div class="result-info">
              <span class="result-name">${team.name}</span>
            </div>
          </div>
        `;
      });
      html += '</div>';
    }

    el.innerHTML = html;
  }

  // ==================== PLAYER COMPARISON ====================

  let compPlayer = null;

  function renderPlayerCompTabs() {
    if (!compPlayer) compPlayer = CONFIG.PLAYERS[0].id;
    const container = document.getElementById('playerCompTabs');
    container.innerHTML = CONFIG.PLAYERS.map(p => `
      <button class="phase-tab ${p.id === compPlayer ? 'active' : ''}" data-player="${p.id}">
        ${p.name}
      </button>
    `).join('');
    container.querySelectorAll('.phase-tab').forEach(btn => {
      btn.addEventListener('click', () => {
        compPlayer = btn.dataset.player;
        renderPlayerCompTabs();
        renderPlayerComparison();
      });
    });
  }

  function renderPlayerComparison() {
    const phaseKey = `phase${selectedPhase}`;
    const results = (globalData.results && globalData.results[phaseKey]) || {};
    const actualDrivers = results.drivers || [];
    const actualConstructors = results.constructors || [];
    const pd = allPlayerData[compPlayer];
    const predictions = pd ? pd[phaseKey] : null;
    const el = document.getElementById('playerComparison');

    if (actualDrivers.length === 0) {
      el.innerHTML = '<p class="text-muted">No hay resultados para comparar en esta fase.</p>';
      return;
    }

    if (!predictions || !predictions.drivers || predictions.drivers.length === 0) {
      el.innerHTML = '<p class="text-muted">Este jugador no tiene predicciones para esta fase.</p>';
      return;
    }

    const pointsTable = CONFIG.SCORING.drivers[selectedPhase] || [];
    const consRate = CONFIG.SCORING.consolation;

    let html = '<h3>Pilotos</h3>';
    html += '<div class="comparison-list">';

    const predDrivers = predictions.drivers || [];
    for (let i = 0; i < Math.max(predDrivers.length, actualDrivers.length); i++) {
      const pred = predDrivers[i];
      const actual = actualDrivers[i];
      const predDriver = pred ? getDriver(pred) : null;
      const actualDriver = actual ? getDriver(actual) : null;

      let status = '';
      let statusClass = '';
      let pts = 0;

      if (pred && actual && pred === actual) {
        status = 'Exacto';
        statusClass = 'comp-exact';
        pts = pointsTable[i] || 0;
      } else if (pred && actualDrivers.includes(pred)) {
        status = 'Acertado';
        statusClass = 'comp-partial';
        pts = Math.round((pointsTable[i] || 0) * consRate);
      } else if (pred) {
        status = 'Fallido';
        statusClass = 'comp-miss';
      }

      html += `
        <div class="comparison-row ${statusClass}">
          <div class="comp-pos">${i + 1}</div>
          <div class="comp-pred">
            <span class="comp-label">Pred.</span>
            <span class="comp-name">${predDriver ? predDriver.name : '—'}</span>
          </div>
          <div class="comp-vs">vs</div>
          <div class="comp-actual">
            <span class="comp-label">Real</span>
            <span class="comp-name">${actualDriver ? actualDriver.name : '—'}</span>
          </div>
          <div class="comp-status">
            <span class="comp-badge">${status}</span>
            ${pts > 0 ? `<span class="comp-pts">+${pts}</span>` : ''}
          </div>
        </div>
      `;
    }
    html += '</div>';

    // Constructors
    const predConstructors = predictions.constructors || [];
    const constPointsTable = CONFIG.SCORING.constructors[selectedPhase] || [];

    if (actualConstructors.length > 0 && predConstructors.length > 0) {
      html += '<h3 class="mt-2">Constructores</h3>';
      html += '<div class="comparison-list">';

      for (let i = 0; i < Math.max(predConstructors.length, actualConstructors.length); i++) {
        const pred = predConstructors[i];
        const actual = actualConstructors[i];
        const predTeam = pred ? getTeam(pred) : null;
        const actualTeam = actual ? getTeam(actual) : null;

        let status = '';
        let statusClass = '';
        let pts = 0;

        if (pred && actual && pred === actual) {
          status = 'Exacto';
          statusClass = 'comp-exact';
          pts = constPointsTable[i] || 0;
        } else if (pred && actualConstructors.includes(pred)) {
          status = 'Acertado';
          statusClass = 'comp-partial';
          pts = Math.round((constPointsTable[i] || 0) * consRate);
        } else if (pred) {
          status = 'Fallido';
          statusClass = 'comp-miss';
        }

        html += `
          <div class="comparison-row ${statusClass}">
            <div class="comp-pos">${i + 1}</div>
            <div class="comp-pred">
              <span class="comp-label">Pred.</span>
              <span class="comp-name">${predTeam ? predTeam.name : '—'}</span>
            </div>
            <div class="comp-vs">vs</div>
            <div class="comp-actual">
              <span class="comp-label">Real</span>
              <span class="comp-name">${actualTeam ? actualTeam.name : '—'}</span>
            </div>
            <div class="comp-status">
              <span class="comp-badge">${status}</span>
              ${pts > 0 ? `<span class="comp-pts">+${pts}</span>` : ''}
            </div>
          </div>
        `;
      }
      html += '</div>';
    }

    el.innerHTML = html;
  }

  // ==================== CHAMPIONSHIP STANDINGS ====================

  function renderChampionship() {
    const el = document.getElementById('championship');

    // Aggregate driver appearances across all phases
    const driverPoints = {};
    const constPoints = {};
    let hasResults = false;

    for (let phase = 1; phase <= 4; phase++) {
      const phaseKey = `phase${phase}`;
      const results = (globalData.results && globalData.results[phaseKey]) || {};
      const drivers = results.drivers || [];
      const constructors = results.constructors || [];

      // Points per position in the actual F1 results (weighted by phase importance)
      const dPts = [25, 18, 15, 12, 10]; // F1-style points for top 5
      const cPts = [25, 18, 15]; // F1-style points for top 3

      if (drivers.length > 0) hasResults = true;

      drivers.forEach((id, i) => {
        if (!driverPoints[id]) driverPoints[id] = { points: 0, appearances: 0, best: 99 };
        driverPoints[id].points += dPts[i] || 0;
        driverPoints[id].appearances++;
        driverPoints[id].best = Math.min(driverPoints[id].best, i + 1);
      });

      constructors.forEach((id, i) => {
        if (!constPoints[id]) constPoints[id] = { points: 0, appearances: 0, best: 99 };
        constPoints[id].points += cPts[i] || 0;
        constPoints[id].appearances++;
        constPoints[id].best = Math.min(constPoints[id].best, i + 1);
      });
    }

    if (!hasResults) {
      el.innerHTML = '<p class="text-muted">No hay resultados introducidos todavia. El campeonato aparecera cuando el comisario jefe haga su trabajo.</p>';
      return;
    }

    let html = '';

    // Driver championship
    const sortedDrivers = Object.entries(driverPoints)
      .sort((a, b) => b[1].points - a[1].points || a[1].best - b[1].best);

    if (sortedDrivers.length > 0) {
      html += '<h3>Campeonato de Pilotos</h3>';
      html += '<div class="results-list">';
      sortedDrivers.forEach(([id, stats], i) => {
        const driver = getDriver(id);
        if (!driver) return;
        const imgUrl = getDriverImageUrl(driver);
        html += `
          <div class="result-row">
            <div class="result-pos champ-pos-${i < 3 ? i + 1 : 'n'}">${i + 1}</div>
            ${imgUrl ? `<img src="${imgUrl}" class="result-driver-img" alt="${driver.name}">` : ''}
            <div class="result-info">
              <span class="result-name">${driver.name}</span>
              <span class="result-team" style="color: ${getTeamColor(driver.team)}">${getTeam(driver.team)?.name || ''}</span>
            </div>
            <div class="champ-stats">
              <span class="champ-pts">${stats.points}</span>
              <span class="champ-detail">${stats.appearances} fases · Mejor: P${stats.best}</span>
            </div>
          </div>
        `;
      });
      html += '</div>';
    }

    // Constructor championship
    const sortedConst = Object.entries(constPoints)
      .sort((a, b) => b[1].points - a[1].points || a[1].best - b[1].best);

    if (sortedConst.length > 0) {
      html += '<h3 class="mt-2">Campeonato de Constructores</h3>';
      html += '<div class="results-list">';
      sortedConst.forEach(([id, stats], i) => {
        const team = getTeam(id);
        if (!team) return;
        html += `
          <div class="result-row">
            <div class="result-pos champ-pos-${i < 3 ? i + 1 : 'n'}">${i + 1}</div>
            ${renderTeamBadge(team.id)}
            <div class="result-info">
              <span class="result-name">${team.name}</span>
            </div>
            <div class="champ-stats">
              <span class="champ-pts">${stats.points}</span>
              <span class="champ-detail">${stats.appearances} fases · Mejor: P${stats.best}</span>
            </div>
          </div>
        `;
      });
      html += '</div>';
    }

    el.innerHTML = html;
  }

  // --- Start ---
  init();

})();

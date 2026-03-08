// ============================================================
// Banana Leclerc Challenge 2026 — Resultados (Race Results)
// ============================================================

(function () {

  // F1 points system for top 10
  const F1_POINTS = [25, 18, 15, 12, 10, 8, 6, 4, 2, 1];

  let globalData = {};
  let selectedRound = null;

  // --- Init ---
  async function init() {
    await loadAvatars();
    const state = await Storage.load();
    globalData = state.global;

    // Default to most recent race with results, or first race
    if (globalData.raceResults) {
      const rounds = Object.keys(globalData.raceResults)
        .map(Number)
        .filter(r => globalData.raceResults[r] && globalData.raceResults[r].length > 0)
        .sort((a, b) => b - a);
      selectedRound = rounds.length > 0 ? rounds[0] : 1;
    } else {
      selectedRound = 1;
    }

    renderRaceTabs();
    renderRaceResult();
    renderDriverChampionship();
    renderConstructorChampionship();
  }

  // ==================== RACE TABS ====================

  function renderRaceTabs() {
    const container = document.getElementById('raceTabs');
    const raceResults = globalData.raceResults || {};

    container.innerHTML = CONFIG.RACES.map(r => {
      const hasResult = raceResults[r.round] && raceResults[r.round].length > 0;
      return `
        <button class="race-tab ${r.round === selectedRound ? 'active' : ''} ${!hasResult ? 'race-tab-empty' : ''}"
          data-round="${r.round}" title="${r.name}">
          <span class="race-tab-flag">${r.flag}</span>
          <span class="race-tab-round">R${r.round}</span>
        </button>
      `;
    }).join('');

    container.querySelectorAll('.race-tab').forEach(btn => {
      btn.addEventListener('click', () => {
        selectedRound = parseInt(btn.dataset.round);
        renderRaceTabs();
        renderRaceResult();
      });
    });
  }

  // ==================== INDIVIDUAL RACE RESULT ====================

  function renderRaceResult() {
    const el = document.getElementById('raceResult');
    const race = CONFIG.RACES.find(r => r.round === selectedRound);
    const raceResults = globalData.raceResults || {};
    const drivers = raceResults[selectedRound] || [];

    if (!race) { el.innerHTML = ''; return; }

    const date = new Date(race.date + 'T00:00:00');
    const formatted = date.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });

    let html = `
      <div class="race-result-header">
        <span class="race-result-flag">${race.flag}</span>
        <div>
          <span class="race-result-name">${race.name}</span>
          <span class="race-result-date">Ronda ${race.round} · ${formatted}</span>
        </div>
      </div>
    `;

    if (drivers.length === 0) {
      html += '<p class="text-muted mt-1">Resultado pendiente. El comisario jefe aun no ha introducido este GP.</p>';
      el.innerHTML = html;
      return;
    }

    html += '<div class="results-list mt-1">';
    drivers.forEach((driverId, i) => {
      const driver = getDriver(driverId);
      if (!driver) return;
      const team = getTeam(driver.team);
      const imgUrl = getDriverImageUrl(driver);
      const pts = F1_POINTS[i] || 0;

      html += `
        <div class="result-row ${i < 3 ? 'result-podium result-podium-' + (i + 1) : ''}">
          <div class="result-pos" style="background: ${getTeamColor(driver.team)}">${i + 1}</div>
          ${imgUrl ? `<img src="${imgUrl}" class="result-driver-img" alt="${driver.name}">` : ''}
          <div class="result-info">
            <span class="result-name">${driver.name}</span>
            <span class="result-team" style="color: ${getTeamColor(driver.team)}">${team ? team.name : ''}</span>
          </div>
          ${team ? renderTeamBadge(team.id, 'sm') : ''}
          <span class="result-pts">${pts > 0 ? '+' + pts : ''}</span>
        </div>
      `;
    });
    html += '</div>';

    el.innerHTML = html;
  }

  // ==================== DRIVER CHAMPIONSHIP ====================

  function computeDriverStandings() {
    const raceResults = globalData.raceResults || {};
    const standings = {};

    for (const [round, drivers] of Object.entries(raceResults)) {
      if (!drivers || drivers.length === 0) continue;
      drivers.forEach((driverId, i) => {
        if (!standings[driverId]) standings[driverId] = { points: 0, wins: 0, podiums: 0, races: 0 };
        const pts = F1_POINTS[i] || 0;
        standings[driverId].points += pts;
        standings[driverId].races++;
        if (i === 0) standings[driverId].wins++;
        if (i < 3) standings[driverId].podiums++;
      });
    }

    return Object.entries(standings)
      .sort((a, b) => b[1].points - a[1].points || b[1].wins - a[1].wins)
      .map(([id, stats], i) => ({ id, rank: i + 1, ...stats }));
  }

  function renderDriverChampionship() {
    const el = document.getElementById('driverChampionship');
    const standings = computeDriverStandings();

    if (standings.length === 0) {
      el.innerHTML = '<p class="text-muted">No hay resultados de carrera todavia.</p>';
      return;
    }

    let html = '<div class="results-list">';
    standings.forEach((s) => {
      const driver = getDriver(s.id);
      if (!driver) return;
      const team = getTeam(driver.team);
      const imgUrl = getDriverImageUrl(driver);

      html += `
        <div class="result-row">
          <div class="result-pos champ-pos-${s.rank <= 3 ? s.rank : 'n'}">${s.rank}</div>
          ${imgUrl ? `<img src="${imgUrl}" class="result-driver-img" alt="${driver.name}">` : ''}
          <div class="result-info">
            <span class="result-name">${driver.name}</span>
            <span class="result-team" style="color: ${getTeamColor(driver.team)}">${team ? team.name : ''}</span>
          </div>
          <div class="champ-stats">
            <span class="champ-pts">${s.points}</span>
            <span class="champ-detail">${s.wins}V · ${s.podiums}P · ${s.races} carreras</span>
          </div>
        </div>
      `;
    });
    html += '</div>';

    el.innerHTML = html;
  }

  // ==================== CONSTRUCTOR CHAMPIONSHIP ====================

  function computeConstructorStandings() {
    const raceResults = globalData.raceResults || {};
    const standings = {};

    for (const [round, drivers] of Object.entries(raceResults)) {
      if (!drivers || drivers.length === 0) continue;
      drivers.forEach((driverId, i) => {
        const driver = getDriver(driverId);
        if (!driver) return;
        const teamId = driver.team;
        if (!standings[teamId]) standings[teamId] = { points: 0, wins: 0, podiums: 0, races: new Set() };
        const pts = F1_POINTS[i] || 0;
        standings[teamId].points += pts;
        standings[teamId].races.add(parseInt(round));
        if (i === 0) standings[teamId].wins++;
        if (i < 3) standings[teamId].podiums++;
      });
    }

    return Object.entries(standings)
      .sort((a, b) => b[1].points - a[1].points || b[1].wins - a[1].wins)
      .map(([id, stats], i) => ({ id, rank: i + 1, points: stats.points, wins: stats.wins, podiums: stats.podiums, races: stats.races.size }));
  }

  function renderConstructorChampionship() {
    const el = document.getElementById('constructorChampionship');
    const standings = computeConstructorStandings();

    if (standings.length === 0) {
      el.innerHTML = '<p class="text-muted">No hay resultados de carrera todavia.</p>';
      return;
    }

    let html = '<div class="results-list">';
    standings.forEach((s) => {
      const team = getTeam(s.id);
      if (!team) return;

      // Find team's drivers
      const teamDrivers = CONFIG.DRIVERS.filter(d => d.team === s.id).map(d => d.name).join(', ');

      html += `
        <div class="result-row">
          <div class="result-pos champ-pos-${s.rank <= 3 ? s.rank : 'n'}">${s.rank}</div>
          ${renderTeamBadge(team.id)}
          <div class="result-info">
            <span class="result-name">${team.name}</span>
            <span class="result-team" style="color: ${team.color}">${teamDrivers}</span>
          </div>
          <div class="champ-stats">
            <span class="champ-pts">${s.points}</span>
            <span class="champ-detail">${s.wins}V · ${s.podiums}P · ${s.races} carreras</span>
          </div>
        </div>
      `;
    });
    html += '</div>';

    el.innerHTML = html;
  }

  // --- Start ---
  init();

})();

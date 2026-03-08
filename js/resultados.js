// ============================================================
// Banana Leclerc Challenge 2026 — Resultados (Live F1 Data)
// ============================================================
// Fetches real race results from the Jolpica/Ergast F1 API.

(function () {

  const F1_API = 'https://api.jolpi.ca/ergast/f1';
  const SEASON = '2026';

  let races = [];
  let driverStandings = [];
  let constructorStandings = [];
  let selectedRound = null;

  // --- Map API IDs to our config for photos/colors ---
  function findOurDriver(apiId, familyName) {
    for (const d of CONFIG.DRIVERS) {
      if (apiId.includes(d.id) || d.id === apiId) return d;
      if (familyName && d.name.toLowerCase().endsWith(familyName.toLowerCase())) return d;
    }
    return null;
  }

  function findOurTeam(apiId) {
    for (const t of CONFIG.TEAMS) {
      const norm = t.id.replace(/-/g, '_');
      if (apiId === norm || apiId === t.id || apiId.includes(norm) || norm.includes(apiId)) return t;
      if (t.name.toLowerCase().replace(/\s/g, '') === apiId.replace(/_/g, '')) return t;
    }
    return null;
  }

  // --- Fetch from API ---
  async function fetchRaces() {
    const resp = await fetch(`${F1_API}/${SEASON}/results.json?limit=500`);
    if (!resp.ok) throw new Error(`API ${resp.status}`);
    const data = await resp.json();
    return data.MRData.RaceTable.Races || [];
  }

  async function fetchDriverStandings() {
    const resp = await fetch(`${F1_API}/${SEASON}/driverStandings.json`);
    if (!resp.ok) return [];
    const data = await resp.json();
    const lists = data.MRData.StandingsTable.StandingsLists;
    return lists && lists.length > 0 ? lists[0].DriverStandings : [];
  }

  async function fetchConstructorStandings() {
    const resp = await fetch(`${F1_API}/${SEASON}/constructorStandings.json`);
    if (!resp.ok) return [];
    const data = await resp.json();
    const lists = data.MRData.StandingsTable.StandingsLists;
    return lists && lists.length > 0 ? lists[0].ConstructorStandings : [];
  }

  // ==================== INIT ====================

  async function init() {
    const raceEl = document.getElementById('raceResult');
    // Remove loading spinner
    raceEl.classList.remove('loading');
    raceEl.textContent = 'Conectando con la API de F1...';

    try {
      const [r, ds, cs] = await Promise.all([
        fetchRaces(),
        fetchDriverStandings(),
        fetchConstructorStandings(),
      ]);
      races = r;
      driverStandings = ds;
      constructorStandings = cs;
    } catch (e) {
      console.error('Error fetching F1 data:', e);
      raceEl.innerHTML =
        `<p class="text-red">Error cargando datos de F1: ${e.message}</p>`;
      document.getElementById('driverChampionship').innerHTML = '';
      document.getElementById('constructorChampionship').innerHTML = '';
      return;
    }

    if (races.length > 0) {
      selectedRound = parseInt(races[races.length - 1].round);
    }

    renderRaceTabs();
    renderRaceResult();
    renderDriverChampionship();
    renderConstructorChampionship();
  }

  // ==================== RACE TABS ====================

  function renderRaceTabs() {
    const container = document.getElementById('raceTabs');

    if (races.length === 0) {
      container.innerHTML = '';
      return;
    }

    // Build tabs from actual API races
    container.innerHTML = races.map(r => {
      const round = parseInt(r.round);
      // Try to find our config race for the flag
      const configRace = CONFIG.RACES.find(cr => cr.round === round);
      const flag = configRace ? configRace.flag : '';

      return `
        <button class="race-tab ${round === selectedRound ? 'active' : ''}"
          data-round="${round}" title="${r.raceName}">
          <span class="race-tab-flag">${flag || round}</span>
          <span class="race-tab-round">R${round}</span>
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

  // ==================== INDIVIDUAL RACE ====================

  function renderRaceResult() {
    const el = document.getElementById('raceResult');

    if (races.length === 0) {
      el.innerHTML = '<p class="text-muted">No hay resultados de carrera disponibles para esta temporada todavia.</p>';
      return;
    }

    const race = races.find(r => parseInt(r.round) === selectedRound);
    if (!race) {
      el.innerHTML = '<p class="text-muted">Carrera no encontrada.</p>';
      return;
    }

    const results = race.Results || [];
    const date = new Date(race.date + 'T00:00:00');
    const formatted = date.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });

    let html = `
      <div class="race-result-header">
        <div>
          <span class="race-result-name">${race.raceName}</span>
          <span class="race-result-date">Ronda ${race.round} · ${formatted} · ${race.Circuit.circuitName}</span>
        </div>
      </div>
    `;

    html += '<div class="results-list mt-1">';
    results.forEach((r, i) => {
      const driver = r.Driver || {};
      const constructor = r.Constructor || {};
      const ourDriver = driver.driverId ? findOurDriver(driver.driverId, driver.familyName) : null;
      const ourTeam = constructor.constructorId ? findOurTeam(constructor.constructorId) : null;
      const teamColor = ourTeam ? ourTeam.color : '#666';
      const imgUrl = ourDriver ? getDriverImageUrl(ourDriver) : '';
      const pts = parseInt(r.points) || 0;
      const pos = parseInt(r.position);

      html += `
        <div class="result-row ${pos <= 3 ? 'result-podium result-podium-' + pos : ''}">
          <div class="result-pos" style="background: ${teamColor}">${r.position || pos}</div>
          ${imgUrl ? `<img src="${imgUrl}" class="result-driver-img" alt="${driver.familyName || ''}">` : `<div class="result-driver-placeholder"></div>`}
          <div class="result-info">
            <span class="result-name">${driver.givenName || ''} ${driver.familyName || ''}</span>
            <span class="result-team" style="color: ${teamColor}">${constructor.name || ''}</span>
          </div>
          ${ourTeam ? renderTeamBadge(ourTeam.id, 'sm') : `<span class="team-badge-sm" style="background:${teamColor}">${constructor.constructorId ? constructor.constructorId.slice(0,3).toUpperCase() : ''}</span>`}
          <span class="result-pts">${pts > 0 ? '+' + pts : ''}</span>
        </div>
      `;
    });
    html += '</div>';

    el.innerHTML = html;
  }

  // ==================== DRIVER CHAMPIONSHIP ====================

  function renderDriverChampionship() {
    const el = document.getElementById('driverChampionship');

    if (driverStandings.length === 0) {
      el.innerHTML = '<p class="text-muted">No hay clasificacion de pilotos disponible todavia.</p>';
      return;
    }

    let html = '<div class="results-list">';
    driverStandings.forEach((s) => {
      const driver = s.Driver;
      const constructor = s.Constructors && s.Constructors[0];
      const ourDriver = driver ? findOurDriver(driver.driverId, driver.familyName) : null;
      const ourTeam = constructor ? findOurTeam(constructor.constructorId) : null;
      const teamColor = ourTeam ? ourTeam.color : '#666';
      const imgUrl = ourDriver ? getDriverImageUrl(ourDriver) : '';
      const pos = parseInt(s.position);

      html += `
        <div class="result-row">
          <div class="result-pos champ-pos-${pos <= 3 ? pos : 'n'}">${s.position || pos}</div>
          ${imgUrl ? `<img src="${imgUrl}" class="result-driver-img" alt="${driver ? driver.familyName : ''}">` : `<div class="result-driver-placeholder"></div>`}
          <div class="result-info">
            <span class="result-name">${driver ? driver.givenName : ''} ${driver ? driver.familyName : ''}</span>
            <span class="result-team" style="color: ${teamColor}">${constructor ? constructor.name : ''}</span>
          </div>
          <div class="champ-stats">
            <span class="champ-pts">${s.points || 0}</span>
            <span class="champ-detail">${s.wins || 0} victorias</span>
          </div>
        </div>
      `;
    });
    html += '</div>';

    el.innerHTML = html;
  }

  // ==================== CONSTRUCTOR CHAMPIONSHIP ====================

  function renderConstructorChampionship() {
    const el = document.getElementById('constructorChampionship');

    if (constructorStandings.length === 0) {
      el.innerHTML = '<p class="text-muted">No hay clasificacion de constructores disponible todavia.</p>';
      return;
    }

    let html = '<div class="results-list">';
    constructorStandings.forEach((s) => {
      const constructor = s.Constructor;
      const ourTeam = constructor ? findOurTeam(constructor.constructorId) : null;
      const teamColor = ourTeam ? ourTeam.color : '#666';
      const pos = parseInt(s.position);

      html += `
        <div class="result-row">
          <div class="result-pos champ-pos-${pos <= 3 ? pos : 'n'}">${s.position || pos}</div>
          ${ourTeam ? renderTeamBadge(ourTeam.id) : `<span class="team-badge" style="background:${teamColor}">${constructor ? constructor.constructorId.slice(0,3).toUpperCase() : ''}</span>`}
          <div class="result-info">
            <span class="result-name">${constructor ? constructor.name : ''}</span>
          </div>
          <div class="champ-stats">
            <span class="champ-pts">${s.points || 0}</span>
            <span class="champ-detail">${s.wins || 0} victorias</span>
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

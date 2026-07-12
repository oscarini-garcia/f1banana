// ============================================================
// Banana Leclerc Challenge 2026 — Storage (local-first + sync)
// ============================================================
//
// Modelo "local-first" (mismo enfoque que counter-ops):
//   - El estado SIEMPRE vive en localStorage ('blc_data') y se lee/escribe
//     al instante. La app funciona offline.
//   - En producción, un ciclo de sync (pull → merge → push) reconcilia el
//     estado local con el bin de JSONBin. Nunca se hace PUT a ciegas:
//     el push solo ocurre tras un GET correcto en el mismo ciclo, así un
//     fallo de red jamás puede machacar el bin con un estado vacío.
//   - La fusión es por subárbol con sellos de tiempo (state.stamps): cada
//     players.{id}, avatars.{id}, statuses.{id} y cada sección de global
//     lleva su propio sello; gana la copia más reciente (empate → remoto).
//     Como cada jugador solo escribe su subárbol y solo el admin escribe
//     global, el guardado de uno no puede pisar el de otro.
//
// Estructura:
// {
//   players: { mariona: { phase1: {...}, ordago: '' }, ... },
//   global:  { results, raceResults, eventos, ordagoVotes, bonuses, penalties, unlocks },
//   avatars: { mariona: '🍌' | 'data:...' },
//   statuses:{ mariona: '...' },
//   stamps:  { players: {id: iso}, global: {seccion: iso},
//              avatars: {id: iso}, statuses: {id: iso} }
// }

const Storage = (() => {
  const STORAGE_KEY = 'blc_data';
  const DIRTY_KEY = 'blc_dirty';
  const JSONBIN_BASE = 'https://api.jsonbin.io/v3/b';
  const GLOBAL_SECTIONS = ['results', 'raceResults', 'eventos', 'ordagoVotes', 'bonuses', 'penalties', 'unlocks'];
  const SYNC_INTERVAL_MS = 60000;

  let _cache = null;
  let _syncing = false;
  let _queued = false;
  let _lastSyncTs = null;
  let _status = 'idle';

  function now() { return new Date().toISOString(); }

  // --- Empty state template ---
  function createEmpty() {
    const state = {
      players: {},
      global: {
        results: {},
        raceResults: {},
        eventos: {},
        ordagoVotes: {},
        bonuses: {
          alonso_wins: 0,
          sainz_wins: 0,
          max_wall: 0,
          gasly_chef: 0,
          yuki_radio: 0,
        },
        penalties: {},
        unlocks: {},
      },
      avatars: {},
      statuses: {},
      stamps: emptyStamps(),
    };
    for (const p of CONFIG.PLAYERS) {
      state.players[p.id] = createEmptyPlayerData();
      state.avatars[p.id] = p.emoji;
      state.statuses[p.id] = '';
      state.global.penalties[p.id] = [];
    }
    return state;
  }

  function createEmptyPlayerData() {
    return {
      phase1: { drivers: [], constructors: [], evento: '' },
      phase2: { drivers: [], constructors: [], evento: '' },
      phase3: { drivers: [], constructors: [], evento: '' },
      phase4: { drivers: [], constructors: [], evento: '' },
      ordago: '',
    };
  }

  function emptyStamps() {
    return { players: {}, global: {}, avatars: {}, statuses: {} };
  }

  // Garantiza la forma completa del estado (compat con datos antiguos sin stamps)
  function normalize(state) {
    if (!state || typeof state !== 'object') state = createEmpty();
    if (!state.players) state.players = {};
    if (!state.global) state.global = createEmpty().global;
    for (const s of GLOBAL_SECTIONS) {
      if (state.global[s] === undefined) state.global[s] = createEmpty().global[s];
    }
    if (!state.avatars) state.avatars = {};
    if (!state.statuses) state.statuses = {};
    if (!state.stamps) state.stamps = emptyStamps();
    for (const k of ['players', 'global', 'avatars', 'statuses']) {
      if (!state.stamps[k]) state.stamps[k] = {};
    }
    for (const p of CONFIG.PLAYERS) {
      if (!state.players[p.id]) state.players[p.id] = createEmptyPlayerData();
      if (!state.avatars[p.id]) state.avatars[p.id] = p.emoji;
      if (!state.global.penalties[p.id]) state.global.penalties[p.id] = [];
    }
    return state;
  }

  // --- Local (localStorage) ---
  function readLocal() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return normalize(raw ? JSON.parse(raw) : createEmpty());
    } catch (e) {
      console.warn('Error leyendo localStorage:', e);
      return createEmpty();
    }
  }

  function writeLocal(state) {
    _cache = state;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      // Cuota llena (avatares muy grandes): seguimos con el caché en memoria
      console.warn('Error escribiendo localStorage:', e);
    }
  }

  function isDirty() { return localStorage.getItem(DIRTY_KEY) === '1'; }

  // fetch con timeout: en red móvil mala, mejor caer a datos locales que colgarse
  function fetchWithTimeout(url, options, ms = 10000) {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), ms);
    return fetch(url, { ...options, signal: ctrl.signal })
      .finally(() => clearTimeout(timer));
  }
  function setDirty(v) {
    if (v) localStorage.setItem(DIRTY_KEY, '1');
    else localStorage.removeItem(DIRTY_KEY);
  }

  // --- Merge por subárbol: gana el sello más reciente, empate → remoto ---
  function mergeStates(local, remote) {
    local = normalize(local);
    remote = normalize(remote);
    const merged = {
      players: {}, global: {}, avatars: {}, statuses: {}, stamps: emptyStamps(),
    };

    function mergeKeyed(section) {
      const ids = new Set([
        ...Object.keys(local[section]),
        ...Object.keys(remote[section]),
      ]);
      for (const id of ids) {
        const lts = local.stamps[section][id] || '';
        const rts = remote.stamps[section][id] || '';
        const localWins = lts > rts && local[section][id] !== undefined;
        const winner = localWins ? local : remote;
        merged[section][id] = winner[section][id] !== undefined
          ? winner[section][id]
          : (localWins ? remote : local)[section][id];
        merged.stamps[section][id] = localWins ? lts : rts;
      }
    }

    mergeKeyed('players');
    mergeKeyed('avatars');
    mergeKeyed('statuses');

    // Global: por sección (conserva secciones desconocidas del remoto)
    merged.global = { ...remote.global };
    const sections = new Set([
      ...GLOBAL_SECTIONS,
      ...Object.keys(local.global),
      ...Object.keys(remote.global),
    ]);
    for (const s of sections) {
      const lts = local.stamps.global[s] || '';
      const rts = remote.stamps.global[s] || '';
      if (lts > rts && local.global[s] !== undefined) {
        merged.global[s] = local.global[s];
        merged.stamps.global[s] = lts;
      } else {
        if (merged.global[s] === undefined) merged.global[s] = local.global[s];
        merged.stamps.global[s] = rts;
      }
    }

    return normalize(merged);
  }

  // --- Ciclo de sync: pull → merge → push (solo si hay cambios) ---
  async function syncCycle() {
    if (CONFIG.DEV_MODE) return _cache;
    if (!navigator.onLine) { emitStatus(isDirty() ? 'pending' : 'offline'); return _cache; }

    _syncing = true;
    emitStatus('syncing');
    try {
      const local = _cache || readLocal();

      const resp = await fetchWithTimeout(`${JSONBIN_BASE}/${CONFIG.JSONBIN_BIN_ID}/latest`, {
        headers: { 'X-Access-Key': CONFIG.JSONBIN_API_KEY },
      });
      if (!resp.ok) throw new Error(`GET ${resp.status}`);
      const json = await resp.json();
      const remote = normalize(json.record && Object.keys(json.record).length ? json.record : createEmpty());

      const merged = mergeStates(local, remote);
      const localChanged = JSON.stringify(merged) !== JSON.stringify(local);
      writeLocal(merged);

      if (JSON.stringify(merged) !== JSON.stringify(remote)) {
        const put = await fetchWithTimeout(`${JSONBIN_BASE}/${CONFIG.JSONBIN_BIN_ID}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'X-Access-Key': CONFIG.JSONBIN_API_KEY,
            'X-Bin-Versioning': 'false',
          },
          body: JSON.stringify(merged),
        });
        if (!put.ok) throw new Error(`PUT ${put.status}`);
      }

      setDirty(false);
      _lastSyncTs = now();
      emitStatus('synced');
      if (localChanged) {
        document.dispatchEvent(new CustomEvent('blc:state-updated'));
      }
      return merged;
    } catch (e) {
      console.warn('[sync] Fallo de sincronización (se reintentará):', e);
      emitStatus(isDirty() ? 'pending' : 'error');
      return _cache;
    } finally {
      _syncing = false;
    }
  }

  // Pide un sync; si ya hay uno en curso, encola otro al terminar
  async function requestSync() {
    if (CONFIG.DEV_MODE) return;
    if (_syncing) { _queued = true; return; }
    await syncCycle();
    if (_queued) {
      _queued = false;
      requestSync();
    }
  }

  // --- Read full state ---
  // Devuelve el estado local al instante; en producción, el primer load
  // de la página intenta además un sync bloqueante para arrancar frescos.
  // Si la red falla, seguimos con la copia local (nunca con estado vacío
  // que pueda subirse luego al bin).
  async function load() {
    if (_cache) return _cache;
    _cache = readLocal();
    if (!CONFIG.DEV_MODE) {
      await requestSync();
    }
    return _cache;
  }

  // --- Write full state (compat; preferir los helpers con sello) ---
  async function save(state) {
    writeLocal(normalize(state));
    if (!CONFIG.DEV_MODE) {
      setDirty(true);
      await requestSync();
    }
  }

  // --- Convenience helpers (misma API que antes para las páginas) ---

  async function getPlayerData(playerId) {
    const state = await load();
    return state.players[playerId] || createEmptyPlayerData();
  }

  async function savePlayerData(playerId, data) {
    const state = await load();
    state.players[playerId] = data;
    state.stamps.players[playerId] = now();
    writeLocal(state);
    if (!CONFIG.DEV_MODE) setDirty(true);
    await requestSync();
  }

  async function getGlobalData() {
    const state = await load();
    return state.global;
  }

  // sections: qué secciones de global cambiaron (ej. ['eventos']).
  // Solo esas se copian y sellan; el resto conserva lo más fresco que
  // tenga el estado local, evitando subir copias rancias de otras secciones.
  async function saveGlobalData(data, sections) {
    const state = await load();
    const list = (sections && sections.length) ? sections : Object.keys(data);
    for (const s of list) {
      state.global[s] = data[s];
      state.stamps.global[s] = now();
    }
    writeLocal(state);
    if (!CONFIG.DEV_MODE) setDirty(true);
    await requestSync();
  }

  async function getAllPlayerData() {
    const state = await load();
    return state.players;
  }

  // --- Avatars ---
  async function getAvatar(playerId) {
    const state = await load();
    return state.avatars[playerId] || (CONFIG.PLAYERS.find(p => p.id === playerId) || {}).emoji || '🍌';
  }

  async function setAvatar(playerId, value) {
    const state = await load();
    state.avatars[playerId] = value;
    state.stamps.avatars[playerId] = now();
    writeLocal(state);
    if (!CONFIG.DEV_MODE) setDirty(true);
    await requestSync();
  }

  // --- Statuses ---
  async function getStatus(playerId) {
    const state = await load();
    return (state.statuses && state.statuses[playerId]) || '';
  }

  async function setStatus(playerId, value) {
    const state = await load();
    state.statuses[playerId] = value;
    state.stamps.statuses[playerId] = now();
    writeLocal(state);
    if (!CONFIG.DEV_MODE) setDirty(true);
    await requestSync();
  }

  // --- Reset (dev) ---
  function resetAll() {
    _cache = null;
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(DIRTY_KEY);
  }

  // ==================== SYNC UI & TRIGGERS ====================

  const STATUS_BADGE = {
    idle:    { icon: '·',  label: 'Sin sincronizar aún' },
    syncing: { icon: '🔄', label: 'Sincronizando…' },
    synced:  { icon: '🟢', label: 'Sincronizado' },
    pending: { icon: '🟡', label: 'Cambios pendientes de subir (se reintenta solo)' },
    offline: { icon: '📴', label: 'Sin conexión — usando datos locales' },
    error:   { icon: '🔴', label: 'Error de red — usando datos locales' },
  };

  function emitStatus(status) {
    _status = status;
    document.dispatchEvent(new CustomEvent('blc:sync-status', {
      detail: { status, lastSync: _lastSyncTs },
    }));
    const el = document.getElementById('syncBadge');
    if (!el) return;
    const info = STATUS_BADGE[status] || STATUS_BADGE.idle;
    el.textContent = info.icon;
    el.title = info.label + (_lastSyncTs
      ? ` · Último sync: ${new Date(_lastSyncTs).toLocaleTimeString('es-ES')}`
      : '') + ' · Toca para sincronizar';
    el.className = `sync-badge sync-${status}`;
  }

  function initSyncUI() {
    if (CONFIG.DEV_MODE) return;

    const header = document.querySelector('.header-inner');
    if (header && !document.getElementById('syncBadge')) {
      const el = document.createElement('button');
      el.id = 'syncBadge';
      el.type = 'button';
      el.className = 'sync-badge sync-idle';
      el.textContent = STATUS_BADGE.idle.icon;
      el.title = STATUS_BADGE.idle.label;
      el.addEventListener('click', () => requestSync());
      header.appendChild(el);
    }

    // Los móviles congelan la pestaña en segundo plano y no la recargan al
    // volver: sin estos disparadores, los datos de los demás quedarían
    // invisibles horas (y los cambios propios sin subir).
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') requestSync();
    });
    window.addEventListener('online', () => requestSync());
    setInterval(() => {
      if (document.visibilityState === 'visible') requestSync();
    }, SYNC_INTERVAL_MS);
  }

  initSyncUI();

  return {
    load,
    save,
    sync: requestSync,
    getPlayerData,
    savePlayerData,
    getGlobalData,
    saveGlobalData,
    getAllPlayerData,
    getAvatar,
    setAvatar,
    getStatus,
    setStatus,
    resetAll,
    createEmptyPlayerData,
    get _cache() { return _cache; },
  };
})();

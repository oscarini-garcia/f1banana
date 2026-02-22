// ============================================================
// Banana Leclerc Challenge 2026 — Storage (single JSON blob)
// ============================================================
//
// Todo el estado vive en UN solo JSON:
//   - DEV_MODE  → localStorage key 'blc_data'
//   - Producción → un solo bin en JSONBin.io (CONFIG.JSONBIN_BIN_ID)
//
// Estructura:
// {
//   players: { mariona: { phase1: {...}, ordago: '' }, ... },
//   global:  { results: {}, eventos: {}, ordagoVotes: {}, bonuses: {}, penalties: {} },
//   avatars: { mariona: '🍌', oscar: 'data:...' }
// }

const Storage = (() => {
  const STORAGE_KEY = 'blc_data';
  const JSONBIN_BASE = 'https://api.jsonbin.io/v3/b';

  // --- In-memory cache (avoids re-reading on every call within same page) ---
  let _cache = null;

  // --- Empty state template ---
  function createEmpty() {
    const state = {
      players: {},
      global: {
        results: {},
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

  // --- Read full state ---
  async function load() {
    if (_cache) return _cache;

    if (CONFIG.DEV_MODE) {
      const raw = localStorage.getItem(STORAGE_KEY);
      _cache = raw ? JSON.parse(raw) : createEmpty();
    } else {
      const binId = CONFIG.JSONBIN_BIN_ID;
      if (!binId) throw new Error('No JSONBIN_BIN_ID configurado');
      try {
        const resp = await fetch(`${JSONBIN_BASE}/${binId}/latest`, {
          headers: { 'X-Access-Key': CONFIG.JSONBIN_API_KEY },
        });
        if (!resp.ok) throw new Error(`GET ${resp.status}`);
        const json = await resp.json();
        _cache = json.record || createEmpty();
      } catch (e) {
        console.warn('Error leyendo JSONBin, usando estado vacío:', e);
        _cache = createEmpty();
      }
    }

    // Ensure all players exist (forward compat if a player is added later)
    for (const p of CONFIG.PLAYERS) {
      if (!_cache.players[p.id]) _cache.players[p.id] = createEmptyPlayerData();
      if (!_cache.avatars[p.id]) _cache.avatars[p.id] = p.emoji;
      if (!_cache.global.penalties[p.id]) _cache.global.penalties[p.id] = [];
    }
    if (!_cache.global) _cache.global = createEmpty().global;
    if (!_cache.global.unlocks) _cache.global.unlocks = {};
    if (!_cache.avatars) _cache.avatars = {};
    if (!_cache.statuses) _cache.statuses = {};

    return _cache;
  }

  // --- Write full state ---
  async function save(state) {
    _cache = state;

    if (CONFIG.DEV_MODE) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      return;
    }

    const binId = CONFIG.JSONBIN_BIN_ID;
    if (!binId) throw new Error('No JSONBIN_BIN_ID configurado');
    const resp = await fetch(`${JSONBIN_BASE}/${binId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-Access-Key': CONFIG.JSONBIN_API_KEY,
      },
      body: JSON.stringify(state),
    });
    if (!resp.ok) throw new Error(`PUT ${resp.status}`);
  }

  // --- Convenience helpers (keep API simple for consumers) ---

  async function getPlayerData(playerId) {
    const state = await load();
    return state.players[playerId] || createEmptyPlayerData();
  }

  async function savePlayerData(playerId, data) {
    const state = await load();
    state.players[playerId] = data;
    await save(state);
  }

  async function getGlobalData() {
    const state = await load();
    return state.global;
  }

  async function saveGlobalData(data) {
    const state = await load();
    state.global = data;
    await save(state);
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
    await save(state);
  }

  // --- Statuses ---
  async function getStatus(playerId) {
    const state = await load();
    return (state.statuses && state.statuses[playerId]) || '';
  }

  async function setStatus(playerId, value) {
    const state = await load();
    if (!state.statuses) state.statuses = {};
    state.statuses[playerId] = value;
    await save(state);
  }

  // --- Reset (dev) ---
  function resetAll() {
    _cache = null;
    localStorage.removeItem(STORAGE_KEY);
  }

  return {
    load,
    save,
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

// ============================================================
// Banana Leclerc Challenge 2026 — Configuración
// ============================================================

const CONFIG = {
  // --- JSONBin.io ---
  JSONBIN_API_KEY: '$2a$10$ss.2va8OnShVIPM0cQpq6ey49smlL/wGUrPvMhYXA70e0ZjllDife',
  JSONBIN_BIN_ID: '699b2779d0ea881f40cf6414',

  // Modo desarrollo (usa datos locales en vez de JSONBin)
  DEV_MODE: false,

  // --- Jugadores ---
  PLAYERS: [
    { id: 'mariona', name: 'Mariona', emoji: '🍌', code: '1692' },
    { id: 'amaya',   name: 'Amaya',   emoji: '🏎️', code: '3847' },
    { id: 'ana',     name: 'Ana',     emoji: '👩‍👧', code: '5214' },
    { id: 'oscar',   name: 'Oscar',   emoji: '🏁', code: '7063' },
  ],

  // --- Admin PIN (simple protección) ---
  ADMIN_PIN: '2026',

  // --- Pilotos 2026 ---
  DRIVERS: [
    { id: 'verstappen',  name: 'Max Verstappen',      team: 'red-bull',     number: 1  },
    { id: 'lawson',      name: 'Liam Lawson',          team: 'red-bull',     number: 30 },
    { id: 'leclerc',     name: 'Charles Leclerc',      team: 'ferrari',      number: 16 },
    { id: 'hamilton',    name: 'Lewis Hamilton',        team: 'ferrari',      number: 44 },
    { id: 'norris',      name: 'Lando Norris',         team: 'mclaren',      number: 4  },
    { id: 'piastri',     name: 'Oscar Piastri',        team: 'mclaren',      number: 81 },
    { id: 'russell',     name: 'George Russell',        team: 'mercedes',     number: 63 },
    { id: 'antonelli',   name: 'Kimi Antonelli',       team: 'mercedes',     number: 12 },
    { id: 'alonso',      name: 'Fernando Alonso',      team: 'aston-martin', number: 14 },
    { id: 'stroll',      name: 'Lance Stroll',         team: 'aston-martin', number: 18 },
    { id: 'sainz',       name: 'Carlos Sainz',         team: 'williams',     number: 55 },
    { id: 'albon',       name: 'Alex Albon',           team: 'williams',     number: 23 },
    { id: 'gasly',       name: 'Pierre Gasly',         team: 'alpine',       number: 10 },
    { id: 'doohan',      name: 'Jack Doohan',          team: 'alpine',       number: 7  },
    { id: 'tsunoda',     name: 'Yuki Tsunoda',         team: 'rb',           number: 22 },
    { id: 'hadjar',      name: 'Isack Hadjar',         team: 'rb',           number: 6  },
    { id: 'ocon',        name: 'Esteban Ocon',         team: 'haas',         number: 31 },
    { id: 'bearman',     name: 'Oliver Bearman',       team: 'haas',         number: 87 },
    { id: 'hulkenberg',  name: 'Nico Hülkenberg',      team: 'sauber',       number: 27 },
    { id: 'bortoleto',   name: 'Gabriel Bortoleto',    team: 'sauber',       number: 5  },
  ],

  // --- Equipos / Constructores 2026 ---
  TEAMS: [
    { id: 'red-bull',     name: 'Red Bull Racing',   abbr: 'RBR', color: '#3671C6',
      logo: 'https://media.formula1.com/content/dam/fom-website/teams/2025/red-bull-racing-logo.png' },
    { id: 'ferrari',      name: 'Ferrari',            abbr: 'FER', color: '#E8002D',
      logo: 'https://media.formula1.com/content/dam/fom-website/teams/2025/ferrari-logo.png' },
    { id: 'mclaren',      name: 'McLaren',            abbr: 'MCL', color: '#FF8000',
      logo: 'https://media.formula1.com/content/dam/fom-website/teams/2025/mclaren-logo.png' },
    { id: 'mercedes',     name: 'Mercedes',           abbr: 'MER', color: '#27F4D2',
      logo: 'https://media.formula1.com/content/dam/fom-website/teams/2025/mercedes-logo.png' },
    { id: 'aston-martin', name: 'Aston Martin',       abbr: 'AMR', color: '#229971',
      logo: 'https://media.formula1.com/content/dam/fom-website/teams/2025/aston-martin-logo.png' },
    { id: 'williams',     name: 'Williams',           abbr: 'WIL', color: '#64C4FF',
      logo: 'https://media.formula1.com/content/dam/fom-website/teams/2025/williams-logo.png' },
    { id: 'alpine',       name: 'Alpine',             abbr: 'ALP', color: '#FF87BC',
      logo: 'https://media.formula1.com/content/dam/fom-website/teams/2025/alpine-logo.png' },
    { id: 'rb',           name: 'RB',                 abbr: 'RB',  color: '#6692FF',
      logo: 'https://media.formula1.com/content/dam/fom-website/teams/2025/rb-logo.png' },
    { id: 'haas',         name: 'Haas',               abbr: 'HAS', color: '#B6BABD',
      logo: 'https://media.formula1.com/content/dam/fom-website/teams/2025/haas-logo.png' },
    { id: 'sauber',       name: 'Sauber / Audi',      abbr: 'SAU', color: '#52E252',
      logo: 'https://media.formula1.com/content/dam/fom-website/teams/2025/kick-sauber-logo.png' },
  ],

  // --- Fases ---
  PHASES: [
    { id: 1, label: 'Fase 1', races: '1–6',      deadline: '2026-03-14' },  // Antes de Australia
    { id: 2, label: 'Fase 2', races: '7–12',     deadline: '2026-05-30' },  // Antes de Emilia Romaña
    { id: 3, label: 'Fase 3', races: '13–18',    deadline: '2026-08-01' },  // Antes de Bélgica
    { id: 4, label: 'Fase 4', races: '19–Final', deadline: '2026-10-17' },  // Antes de EE.UU.
  ],

  // --- Puntuación por fase ---
  SCORING: {
    drivers: {
      1: [20, 16, 12, 8, 4],   // Fase 1: puntos para posiciones 1–5
      2: [15, 12,  9, 6, 3],
      3: [10,  8,  6, 4, 2],
      4: [ 5,  4,  3, 2, 1],
    },
    constructors: {
      1: [20, 16, 12],          // Fase 1: puntos para posiciones 1–3
      2: [15, 12,  9],
      3: [10,  8,  6],
      4: [ 5,  4,  3],
    },
    consolation: 1,              // Piloto en Top 5 pero posición incorrecta
    evento: 10,                  // Puntos por evento acertado
    ordago: { exact: 25, partial: 15, similar: 5, fail: 0 },
  },

  // --- Bonos colectivos ---
  COLLECTIVE_BONUSES: {
    alonso_win:  14,   // +14 a todos si Alonso gana una carrera
    sainz_win:   10,   // +10 a todos si Sainz gana una carrera
  },

  // --- Bonos especiales ---
  SPECIAL_BONUSES: {
    max_wall:      2,  // +2 si Max se da contra el muro en qualy
    gasly_chef:    'double', // Doble puntos si Gasly sube al podio con look chef
    yuki_radio:    1,  // +1 automático por carrera si Yuki grita (max 6/fase)
  },

  // --- Penalizaciones individuales ---
  PENALTIES: {
    mariona: { desc: 'Declaración pública de infidelidad emocional', points: -3 },
    amaya:   { desc: 'Crítica espontánea de peinados/outfits', points: -3 },
    ana:     { desc: 'Discurso dramático > 20 segundos', points: -2 },
    oscar:   { desc: 'Voto sistemáticamente opuesto a mamá: -5 / Crítica gratuita a pilotos protegidos: -10', points: -5 },
  },

  // --- Calendario 2026 (simplificado) ---
  RACES: [
    { round: 1,  name: 'Australia',        date: '2026-03-15', flag: '🇦🇺' },
    { round: 2,  name: 'China',            date: '2026-03-29', flag: '🇨🇳' },
    { round: 3,  name: 'Japón',            date: '2026-04-05', flag: '🇯🇵' },
    { round: 4,  name: 'Bahréin',          date: '2026-04-19', flag: '🇧🇭' },
    { round: 5,  name: 'Arabia Saudí',     date: '2026-05-03', flag: '🇸🇦' },
    { round: 6,  name: 'Miami',            date: '2026-05-17', flag: '🇺🇸' },
    { round: 7,  name: 'Emilia Romaña',    date: '2026-05-31', flag: '🇮🇹' },
    { round: 8,  name: 'Mónaco',           date: '2026-06-07', flag: '🇲🇨' },
    { round: 9,  name: 'España',           date: '2026-06-21', flag: '🇪🇸' },
    { round: 10, name: 'Canadá',           date: '2026-07-05', flag: '🇨🇦' },
    { round: 11, name: 'Austria',          date: '2026-07-19', flag: '🇦🇹' },
    { round: 12, name: 'Gran Bretaña',     date: '2026-07-26', flag: '🇬🇧' },
    { round: 13, name: 'Bélgica',          date: '2026-08-02', flag: '🇧🇪' },
    { round: 14, name: 'Hungría',          date: '2026-08-16', flag: '🇭🇺' },
    { round: 15, name: 'Países Bajos',     date: '2026-08-30', flag: '🇳🇱' },
    { round: 16, name: 'Italia',           date: '2026-09-06', flag: '🇮🇹' },
    { round: 17, name: 'Azerbaiyán',       date: '2026-09-20', flag: '🇦🇿' },
    { round: 18, name: 'Singapur',         date: '2026-10-04', flag: '🇸🇬' },
    { round: 19, name: 'EE.UU.',           date: '2026-10-18', flag: '🇺🇸' },
    { round: 20, name: 'México',           date: '2026-10-25', flag: '🇲🇽' },
    { round: 21, name: 'Brasil',           date: '2026-11-08', flag: '🇧🇷' },
    { round: 22, name: 'Las Vegas',        date: '2026-11-22', flag: '🇺🇸' },
    { round: 23, name: 'Catar',            date: '2026-11-29', flag: '🇶🇦' },
    { round: 24, name: 'Abu Dabi',         date: '2026-12-06', flag: '🇦🇪' },
  ],
};

// Helpers
function getDriver(id) {
  return CONFIG.DRIVERS.find(d => d.id === id);
}

function getTeam(id) {
  return CONFIG.TEAMS.find(t => t.id === id);
}

function getTeamColor(teamId) {
  const team = getTeam(teamId);
  return team ? team.color : '#666';
}

function getPhaseForRound(round) {
  if (round <= 6)  return 1;
  if (round <= 12) return 2;
  if (round <= 18) return 3;
  return 4;
}

function getCurrentPhase() {
  const today = new Date().toISOString().slice(0, 10);
  for (let i = CONFIG.PHASES.length - 1; i >= 0; i--) {
    const phase = CONFIG.PHASES[i];
    if (phase.deadline && today < phase.deadline) continue;
    return phase.id;
  }
  return 1;
}

// Driver photo URL from F1 CDN
function getDriverImageUrl(driver) {
  const lastName = driver.name.split(' ').pop().toUpperCase().slice(0, 3);
  const firstName = driver.name.split(' ')[0].slice(0, 3).toUpperCase();
  // F1 CDN pattern — fallback to placeholder
  return `https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/2025Drivers/${driver.id}.png`;
}

// Team logo URL
function getTeamLogoUrl(team) {
  return `https://media.formula1.com/content/dam/fom-website/teams/2025/${team.id}-logo.png`;
}

// --- Avatar system ---
// Avatars can be emojis (string) or images (base64 data URL starting with "data:")
// Uses a sync cache (_avatarCache) populated from Storage.load() at init.
// Pages must call `await loadAvatars()` before rendering.

const AVATAR_EMOJIS = [
  '🍌', '🏎️', '👩‍👧', '🏁', '🐒', '🏆', '🔥', '💀',
  '🦊', '🐝', '🎯', '🚀', '⭐', '🎸', '🌶️', '🧨',
  '👑', '🦁', '🐻', '🎪', '💎', '🌈', '🍕', '🍿',
];

// Sync caches — populated by loadAvatars()
const _avatarCache = {};
const _statusCache = {};

async function loadAvatars() {
  const state = await Storage.load();
  for (const p of CONFIG.PLAYERS) {
    _avatarCache[p.id] = (state.avatars && state.avatars[p.id]) || p.emoji;
    _statusCache[p.id] = (state.statuses && state.statuses[p.id]) || '';
  }
}

function getPlayerAvatar(playerId) {
  return _avatarCache[playerId] || (CONFIG.PLAYERS.find(p => p.id === playerId) || {}).emoji || '🍌';
}

async function setPlayerAvatar(playerId, value) {
  _avatarCache[playerId] = value;
  await Storage.setAvatar(playerId, value);
}

function getPlayerStatus(playerId) {
  return _statusCache[playerId] || '';
}

async function setPlayerStatus(playerId, value) {
  _statusCache[playerId] = value;
  await Storage.setStatus(playerId, value);
}

function renderPlayerStatus(playerId) {
  const status = getPlayerStatus(playerId);
  if (!status) return '';
  return `<span class="player-status"> — ${status}</span>`;
}

function isAvatarImage(avatar) {
  return avatar && avatar.startsWith('data:');
}

function renderAvatar(playerId, sizeClass) {
  const avatar = getPlayerAvatar(playerId);
  if (isAvatarImage(avatar)) {
    return `<img src="${avatar}" alt="avatar" class="avatar-img ${sizeClass || ''}">`;
  }
  return `<span class="avatar-emoji ${sizeClass || ''}">${avatar}</span>`;
}

function resizeImage(file, maxSize, callback) {
  const reader = new FileReader();
  reader.onload = function (e) {
    const img = new Image();
    img.onload = function () {
      const canvas = document.createElement('canvas');
      let w = img.width, h = img.height;
      if (w > h) { if (w > maxSize) { h = h * maxSize / w; w = maxSize; } }
      else       { if (h > maxSize) { w = w * maxSize / h; h = maxSize; } }
      canvas.width = w;
      canvas.height = h;
      canvas.getContext('2d').drawImage(img, 0, 0, w, h);
      callback(canvas.toDataURL('image/jpeg', 0.8));
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
}

// --- Team badge (logo image with colored fallback) ---
function renderTeamBadge(teamId, size) {
  const team = getTeam(teamId);
  if (!team) return '';
  const cls = size === 'sm' ? 'team-logo-sm' : 'team-logo';
  const fallbackCls = size === 'sm' ? 'team-badge-sm' : 'team-badge';
  if (team.logo) {
    return `<img src="${team.logo}" alt="${team.abbr}" class="${cls}" onerror="this.outerHTML='<span class=\\'${fallbackCls}\\' style=\\'background:${team.color}\\'>${team.abbr}</span>'">`;
  }
  return `<span class="${fallbackCls}" style="background:${team.color}">${team.abbr}</span>`;
}

// --- F1 Memes ticker ---
const F1_TICKER_MESSAGES = [
  // Kimi Räikkönen
  '"Just leave me alone, I know what I\'m doing" — Kimi, Abu Dhabi 2012. El himno.',
  'Kimi cuando el ingeniero habla demasiado: "Bwoah..."',
  'Kimi Räikkönen: el único piloto que ganó un campeonato entre cervezas',
  'Kimi por radio: "Mi botella de agua no funciona." Ingeniero: "Entendido." Silencio eterno.',
  '"I was having a shit" — Kimi explicando dónde estaba. No hay más preguntas.',

  // Fernando Alonso
  'Alonso: "GP2 engine! GP2! Argh!" — en la pista de Honda. En casa de Honda.',
  'Alonso cuando Palmer se retiró: "Karma." Solo eso. Karma.',
  '"What are we doing here? Racing or ping pong?" — Alonso, eterna víctima del caos',
  'Alonso lleva 20 años siendo el mejor piloto del mundo y el universo lo ignora',
  'El Plan de Alonso: ganar el triplete. Nuestro plan: no quedar últimos. Similar energía.',

  // Max Verstappen
  '"This is boring. I should have brought my pillow." — Max en Mónaco 2024',
  'Verstappen ganando carrera 14 consecutiva: "¿Esto es todo?" El resto: 😭',
  'Multi 21, Seb! — Webber, sabiendo ya que Vettel no iba a obedecer',
  'Red Bull en modo pareja tóxica: Max gana, el equipo se destruye por dentro',
  'Verstappen clasificando en P1 mientras el resto reza por la lluvia',

  // Ferrari Estrategia™
  'Ferrari strategia™: "box box box... no stay out... box box"',
  '"Estamos revisando." — Ferrari pitwall cuando pasan cosas, siempre revisando',
  'Ferrari: el único equipo que pierde carreras desde el muro de boxes',
  'Leclerc: "No no no no no!" — Ferrari estrategia, probablemente',
  '"Plan A, Plan B, Plan C..." — Ferrari cuando le preguntan qué hora es',
  'Ferrari Strategy Department: 5 ingenieros, 0 ideas, 1 bolígrafo que no funciona',

  // Charles Leclerc
  '"I am stupid, I am stupid" — Leclerc tras estrellarse solo en Bakú 2019',
  'Leclerc por radio: "¡Tengo el asiento lleno de agua!" Ingeniero: "Debe ser el agua."',
  '"Nothing, just an inchident" — Leclerc de kart empujando a Verstappen. Los inicios.',
  'Leclerc disfrazado de banana en Twitch. Ferrari no lo vio venir.',

  // Hamilton & Mercedes
  'Hamilton entrando en Ferrari como quien cambia de equipo en el recreo',
  '"Still I Rise" — Hamilton. Ferrari fans: "Still we cry."',
  'Bottas 2019: "To whom it may concern: f**k you." El discurso más corto de la historia.',
  'George Russell a Toto: "Just let me f**king drive!" — Austria 2024',
  'Toto Wolff rompiendo auriculares por radio. Gestión de emociones nivel F1.',

  // McLaren & Norris
  'Norris tan cerca del título como tú de acertar tus predicciones',
  'Piastri: "Entendido, no entendido" — la comunicación interna de McLaren',
  'McLaren pintando el coche de papaya porque el rojo ya estaba muy visto',
  '"Pieeeeeeeerre Gaslyyyyyyyyy!" — Ricciardo, pronunciación francesa nivel maestro',

  // Otros pilotos
  'Tsunoda por radio: *sonidos que no se pueden emitir en horario familiar*',
  'Hülkenberg: 200 carreras, 0 podios, 100% leyenda pura',
  'Magnussen a Hülkenberg: "Suck my balls, mate." Deportividad ante todo.',
  'Albon pintando acuarelas entre carreras. Un artista del volante y del pincel.',
  '"I think Ericsson hit us" — Ingeniero de Grosjean, mirando repetición y mintiendo',
  'Sainz fichando por Williams con la misma energía que mudarse de barrio',
  'Stroll: conducción patrocinada por papá desde 2018. El legado continúa.',
  'Ricciardo: "shoey" en el podio de Monza. El mundo del vino nunca fue igual.',

  // Memes del juego / generales
  'Último clasificado = disfraz de Banana Leclerc. Tú has sido avisado.',
  'Safety car: el mejor amigo de quien va último en la clasificación',
  'DRS abierto, predicciones cerradas. Así funciona esto.',
  'Si aciertas el Top 5 exacto, probablemente eres brujo o eres Alonso',
  'Red Bull: cuando tu bebida energética va más rápida que tu coche',
  'Virtual Safety Car desplegado justo cuando Ferrari iba a ganar. Siempre.',
  'El órdago es como apostar en el casino pero con más sufrimiento y más honor',
  'Alpine: el equipo que cambió más de nombre que de estrategia',
  'Antonelli: el bebé de la parrilla, pero con más puntos que tú en el Banana',
  'Lawson: el piloto de reserva que ya tiene más asiento que tú en el sofá',
  'Bortoleto: de la F2 al Banana Challenge en menos de un sprint',
  'Hadjar: "¿Isack quién?" — Pregunta que no harás en diciembre',
  'Doohan intentando mantener el asiento como tú tus predicciones: con fe ciega',
  'Russell haciendo PowerPoint mientras los demás hacen vueltas rápidas',
  'Bearman debutando más tranquilo que tú eligiendo tus pilotos en el último minuto',
  'Gasly cocinando en el podio: crème brûlée avec un toque de DRS',
  'Ocon y Gasly como compañeros otra vez en Alpine: ¿qué podría salir mal?',
  'Bottas en Sauber/Kick: "Es lo que hay." El haiku de la F1.',
  'Si Alonso gana, +14 puntos para todos. Básicamente Navidad en primavera.',
  'Leclerc en Twitch: más puntos en clasificación que en Fantasy. Respect.',
];

// --- Daily reload: force one refresh per day to pick up changes ---
(function dailyReload() {
  const key = 'blc_last_reload';
  const today = new Date().toISOString().slice(0, 10);
  const last = localStorage.getItem(key);
  if (last && last !== today) {
    localStorage.setItem(key, today);
    location.reload();
  } else {
    localStorage.setItem(key, today);
  }
})();

// --- Phase lock helper ---
// Returns true if the phase is locked for a player (deadline passed + no admin unlock)
function isPhaseLocked(phaseId, playerId) {
  const phase = CONFIG.PHASES.find(p => p.id === phaseId);
  if (!phase || !phase.deadline) return false;
  const today = new Date().toISOString().slice(0, 10);
  if (today < phase.deadline) return false;
  // Check admin unlock in global data (loaded async, so we use sync cache)
  const state = Storage._cache;
  if (state && state.global && state.global.unlocks) {
    const key = `phase${phaseId}`;
    if (state.global.unlocks[key] && state.global.unlocks[key].includes(playerId)) {
      return false; // Admin unlocked this player for this phase
    }
  }
  return true;
}

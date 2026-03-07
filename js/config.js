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
    { id: 'verstappen',  name: 'Max Verstappen',      team: 'red-bull',      number: 3  },
    { id: 'hadjar',      name: 'Isack Hadjar',         team: 'red-bull',      number: 6  },
    { id: 'leclerc',     name: 'Charles Leclerc',      team: 'ferrari',       number: 16 },
    { id: 'hamilton',    name: 'Lewis Hamilton',        team: 'ferrari',       number: 44 },
    { id: 'norris',      name: 'Lando Norris',         team: 'mclaren',       number: 1  },
    { id: 'piastri',     name: 'Oscar Piastri',        team: 'mclaren',       number: 81 },
    { id: 'russell',     name: 'George Russell',        team: 'mercedes',      number: 63 },
    { id: 'antonelli',   name: 'Kimi Antonelli',       team: 'mercedes',      number: 12 },
    { id: 'alonso',      name: 'Fernando Alonso',      team: 'aston-martin',  number: 14 },
    { id: 'stroll',      name: 'Lance Stroll',         team: 'aston-martin',  number: 18 },
    { id: 'sainz',       name: 'Carlos Sainz',         team: 'williams',      number: 55 },
    { id: 'albon',       name: 'Alex Albon',           team: 'williams',      number: 23 },
    { id: 'gasly',       name: 'Pierre Gasly',         team: 'alpine',        number: 10 },
    { id: 'colapinto',   name: 'Franco Colapinto',     team: 'alpine',        number: 43 },
    { id: 'lawson',      name: 'Liam Lawson',          team: 'racing-bulls',  number: 30 },
    { id: 'lindblad',    name: 'Arvid Lindblad',       team: 'racing-bulls',  number: 41 },
    { id: 'ocon',        name: 'Esteban Ocon',         team: 'haas',          number: 31 },
    { id: 'bearman',     name: 'Oliver Bearman',       team: 'haas',          number: 87 },
    { id: 'hulkenberg',  name: 'Nico Hülkenberg',      team: 'audi',          number: 27 },
    { id: 'bortoleto',   name: 'Gabriel Bortoleto',    team: 'audi',          number: 5  },
    { id: 'perez',       name: 'Sergio Pérez',         team: 'cadillac',      number: 11 },
    { id: 'bottas',      name: 'Valtteri Bottas',      team: 'cadillac',      number: 77 },
  ],

  // --- Equipos / Constructores 2026 ---
  TEAMS: [
    { id: 'red-bull',      name: 'Red Bull Racing',   abbr: 'RBR', color: '#3671C6',
      logo: 'img/teams/red-bull.webp' },
    { id: 'ferrari',       name: 'Ferrari',            abbr: 'FER', color: '#E8002D',
      logo: 'img/teams/ferrari.webp' },
    { id: 'mclaren',       name: 'McLaren',            abbr: 'MCL', color: '#FF8000',
      logo: 'img/teams/mclaren.webp' },
    { id: 'mercedes',      name: 'Mercedes',           abbr: 'MER', color: '#27F4D2',
      logo: 'img/teams/mercedes.webp' },
    { id: 'aston-martin',  name: 'Aston Martin',       abbr: 'AMR', color: '#229971',
      logo: 'img/teams/aston-martin.webp' },
    { id: 'williams',      name: 'Williams',           abbr: 'WIL', color: '#64C4FF',
      logo: 'img/teams/williams.webp' },
    { id: 'alpine',        name: 'Alpine',             abbr: 'ALP', color: '#FF87BC',
      logo: 'img/teams/alpine.webp' },
    { id: 'racing-bulls',  name: 'Racing Bulls',       abbr: 'RCB', color: '#6692FF',
      logo: 'img/teams/racing-bulls.webp' },
    { id: 'haas',          name: 'Haas',               abbr: 'HAS', color: '#B6BABD',
      logo: 'img/teams/haas.webp' },
    { id: 'audi',          name: 'Audi',               abbr: 'AUD', color: '#52E252',
      logo: 'img/teams/audi.webp' },
    { id: 'cadillac',      name: 'Cadillac',           abbr: 'CAD', color: '#C0A44D',
      logo: 'img/teams/cadillac.webp' },
  ],

  // --- Fases ---
  PHASES: [
    { id: 1, label: 'Fase 1', races: '1–6',      deadline: '2026-03-08' },  // Antes de Australia
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
    { round: 1,  name: 'Australia',        date: '2026-03-08', flag: '🇦🇺' },
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

// Driver photo URL from F1 CDN (2026 season)
const DRIVER_IMAGE_MAP = {
  'verstappen':  'redbullracing/maxver01/2026redbullracingmaxver01right',
  'hadjar':      'redbullracing/isahad01/2026redbullracingisahad01right',
  'leclerc':     'ferrari/chalec01/2026ferrarichalec01right',
  'hamilton':    'ferrari/lewham01/2026ferrarilewham01right',
  'norris':      'mclaren/lannor01/2026mclarenlannor01right',
  'piastri':     'mclaren/oscpia01/2026mclarenoscpia01right',
  'russell':     'mercedes/georus01/2026mercedesgeorus01right',
  'antonelli':   'mercedes/andant01/2026mercedesandant01right',
  'alonso':      'astonmartin/feralo01/2026astonmartinferalo01right',
  'stroll':      'astonmartin/lanstr01/2026astonmartinlanstr01right',
  'sainz':       'williams/carsai01/2026williamscarsai01right',
  'albon':       'williams/alealb01/2026williamsalealb01right',
  'gasly':       'alpine/piegas01/2026alpinepiegas01right',
  'colapinto':   'alpine/fracol01/2026alpinefracol01right',
  'lawson':      'racingbulls/lialaw01/2026racingbullslialaw01right',
  'lindblad':    'racingbulls/arvlin01/2026racingbullsarvlin01right',
  'ocon':        'haasf1team/estoco01/2026haasf1teamestoco01right',
  'bearman':     'haasf1team/olibea01/2026haasf1teamolibea01right',
  'hulkenberg':  'audi/nichul01/2026audinichul01right',
  'bortoleto':   'audi/gabbor01/2026audigabbor01right',
  'perez':       'cadillac/serper01/2026cadillacserper01right',
  'bottas':      'cadillac/valbot01/2026cadillacvalbot01right',
};

function getDriverImageUrl(driver) {
  const path = DRIVER_IMAGE_MAP[driver.id];
  if (path) {
    return `https://media.formula1.com/image/upload/c_lfill,w_440/q_auto/d_common:f1:2026:fallback:driver:2026fallbackdriverright.webp/v1740000000/common/f1/2026/${path}.webp`;
  }
  return '';
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
    return `<img src="${avatar}" alt="avatar" class="avatar-img ${sizeClass || ''}" onclick="openAvatarLightbox(this.src)" style="cursor:zoom-in">`;
  }
  return `<span class="avatar-emoji ${sizeClass || ''}">${avatar}</span>`;
}

function openAvatarLightbox(src) {
  const existing = document.getElementById('avatarLightbox');
  if (existing) existing.remove();
  const lb = document.createElement('div');
  lb.id = 'avatarLightbox';
  lb.className = 'avatar-lightbox';
  lb.innerHTML = `<img src="${src}" alt="avatar">`;
  lb.addEventListener('click', () => lb.remove());
  document.body.appendChild(lb);
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
  '"Just leave me alone, I know what I\'m doing." — Kimi, Abu Dhabi 2012. Lo dijo, lo hizo, se fue a casa a cenar. El himno universal de los introvertidos con talento.',
  'Kimi por radio: "Mi botella de agua no funciona." Ingeniero: "Entendido." Kimi: *silencio de 47 vueltas*. La comunicación más eficiente de la historia de la F1.',
  '"I was having a shit." — Kimi explicando por qué no estaba en el briefing. El equipo asintió. Nadie preguntó más. Nadie se atrevió.',
  'Kimi Räikkönen ganó un mundial pilotando un Ferrari, bebiendo vodka y sin hablar con nadie. Tú no puedes ni elegir 5 pilotos sin llorar.',

  // Fernando Alonso
  '"GP2 engine! GP2! Argh!" — Alonso humillando a Honda en directo por radio. Honda fingió no escucharlo. El motor fingió no existir.',
  'Alonso cuando Palmer abandonó: "Karma." Una sola palabra. Sin contexto. Sin piedad. El tuit perfecto antes de que existieran los tuits.',
  'Alonso lleva 20 años siendo el mejor piloto del mundo según Alonso. Lo peor es que probablemente tiene razón y eso nos duele a todos.',
  'El Plan™ de Alonso: ganar Le Mans, Indianápolis, y el mundial. Nuestro plan: no quedar últimos en el Banana Challenge. Misma energía, distinta escala.',
  '"What are we doing here? Racing or ping pong?" — Alonso preguntando lo que todos pensamos cada domingo. La FIA todavía no ha respondido.',

  // Max Verstappen
  'Verstappen ganando su carrera número 14 consecutiva mientras los demás pilotos planean carreras alternativas en sim racing. "¿Esto es todo?" dijo Max. El paddock lloró.',
  '"This is boring. I should have brought my pillow." — Max en Mónaco 2024. Ganó igualmente. El pillow sigue esperando su oportunidad.',
  'Red Bull en modo pareja tóxica: Max gana, Horner sale en los periódicos por otras razones, y el equipo se autodestruye. Pero ganan el mundial. Prioridades.',
  'Verstappen clasificando en P1 con lluvia, sol, niebla y un monoplaza en llamas. El resto del grid encendiendo velas a santos varios.',

  // Ferrari Estrategia™
  '"Box box box... no, stay out... box box..." — Ferrari pitwall inventando el jazz improvisado aplicado a la estrategia de carrera. El resultado: siempre el mismo.',
  '"Estamos revisando." — El Ferrari Strategy Department cuando les preguntas cualquier cosa. La hora, el menú del almuerzo, si van a parar. Siempre revisando, nunca decidiendo.',
  'Ferrari Strategy Department: 5 ingenieros con doctorado, 0 ideas útiles, 1 bolígrafo que no funciona y una pizarra con flechas que no llevan a ningún sitio.',
  '"Plan A, Plan B, Plan C, Plan D..." — Ferrari tiene más planes que resultados. La letra Z la reservan para cuando todo sale bien. Nunca la han usado.',

  // Charles Leclerc
  '"I am stupid, I am stupid!" — Leclerc tras estrellarse solo en Bakú 2019. La autocrítica más honesta jamás emitida por radio. Al menos lo reconoce, que es más de lo que hacen algunos.',
  'Leclerc disfrazado de banana en Twitch mientras Ferrari le paga millones por conducir. Si eso no es vivir el sueño, no sé qué es. Inspiración pura para este juego.',
  '"Nothing, just an inchident." — Leclerc de kart empujando a Verstappen fuera de pista. Tenían 12 años. La rivalidad empezó antes que la pubertad.',

  // Hamilton & Mercedes
  'Hamilton entrando en Ferrari como quien cambia de equipo en el recreo. "Ahora soy rojo." Mercedes llorando con el mono plateado aún puesto.',
  '"Still I Rise." — Hamilton. Ferrari fans: "Still we cry." Mercedes fans: "Still we rebuild." Todos los demás: "Still we wait."',
  'Bottas 2019: "To whom it may concern: f**k you." El discurso más corto, más directo y más legendario de la historia del deporte. Ganó esa carrera, obviamente.',
  'Toto Wolff rompiendo auriculares, mesas y la cuarta pared por radio. Su fisioterapeuta cobra por horas. Muchas horas.',

  // McLaren & Norris
  'Norris tan cerca del título como tú de acertar el Top 5 exacto. Se ve cerquita, se huele el triunfo, y al final te dan puntos de consolación.',
  'Piastri al ingeniero: "Entendido." También Piastri: *hace exactamente lo contrario*. La comunicación interna de McLaren es un género literario propio.',
  '"Pieeeeeeeerre Gaslyyyyyyyyy!" — Ricciardo pronunciando el nombre de Gasly con más pasión que un locutor de Roland Garros. Arte sonoro puro.',

  // Otros pilotos
  'Tsunoda por radio: *sonidos que requieren 3 niveles de censura, un exorcismo y una disculpa formal a la FIA*. Cada carrera. Sin excepción.',
  'Hülkenberg: 200+ carreras, 0 podios, infinita dignidad. El único piloto que convirtió la mediocridad en una forma de arte respetable.',
  'Magnussen a Hülkenberg en parrilla: "Suck my balls, mate." Hülkenberg no respondió. No hacía falta. El meme ya era inmortal.',
  'Albon pintando acuarelas entre carreras como si fuera un renacentista con casco. Un artista del volante, del pincel y de la paciencia con Williams.',
  '"I think Ericsson hit us." — Ingeniero de Grosjean tras ver la repetición que claramente muestra que Ericsson NO le tocó. La mentira más valiente de la F1.',
  'Sainz fichando por Williams con la misma energía que mudarse del centro a las afueras. "Es un proyecto." Claro, Carlos. Claro.',
  'Stroll: conducción patrocinada por papá desde 2018. Lance no eligió nacer rico, pero sí eligió conducir como si el coche fuera de alquiler.',

  // Memes del Banana Challenge
  'Último clasificado = disfraz de Banana Leclerc en público. No es una amenaza, es una promesa. Empieza a elegir bien tus pilotos.',
  'Safety car desplegado. El que va último en el Banana Challenge sonríe porque los puntos se comprimen. Spoiler: sigues último.',
  'DRS abierto, predicciones cerradas, excusas agotadas. Bienvenido al Banana Leclerc Challenge 2026. Que gane el menos malo.',
  'Si aciertas el Top 5 exacto, probablemente eres brujo, vienes del futuro o eres Alonso. En cualquier caso, queremos tu secreto.',
  'Virtual Safety Car desplegado justo cuando Ferrari iba a ganar. Como siempre. Como todas las veces. El algoritmo de la FIA es un troll.',
  'El órdago es como apostar en el casino pero con más sufrimiento emocional, menos dinero y la posibilidad real de ir disfrazado de plátano.',
  'Si Alonso gana una carrera, +14 puntos para todos. Básicamente Navidad, Reyes y tu cumpleaños juntos. En marzo. Rezad.',
  'Antonelli es el bebé de la parrilla pero ya tiene más puntos de potencial que tú de aciertos. La juventud es cruel.',
  'Leclerc en Twitch tiene más viewers que este juego tiene jugadores. Pero nosotros tenemos penalizaciones personalizadas. Gana el Banana.',
  'Gasly cocinando en el podio con gorro de chef: crème brûlée avec un toque de DRS y una pizca de vergüenza ajena colectiva.',
  'Russell haciendo presentaciones PowerPoint mientras los demás hacen vueltas rápidas. El consultor de McKinsey de la F1.',
  'Doohan intentando mantener su asiento en Alpine como tú intentas mantener tus predicciones: con fe ciega y cero evidencia.',
];

// --- Build timestamp (updated on each deploy) ---
const BUILD_TIME = '22-02-2026 18:17';

// --- Show build time in footer ---
document.querySelectorAll('.build-time').forEach(el => {
  el.textContent = BUILD_TIME;
});

// --- Session via cookie (persists across browser restarts) ---
function getSessionPlayer() {
  const match = document.cookie.match(/(?:^|; )blc_player=([^;]*)/);
  if (match) return decodeURIComponent(match[1]);
  // Migrate from sessionStorage if exists
  const ss = sessionStorage.getItem('blc_player');
  if (ss) { setSessionPlayer(ss); return ss; }
  return null;
}
function setSessionPlayer(playerId) {
  document.cookie = `blc_player=${encodeURIComponent(playerId)};path=/;max-age=${60*60*24*365};SameSite=Lax`;
  sessionStorage.setItem('blc_player', playerId); // keep in sync
}
function clearSessionPlayer() {
  document.cookie = 'blc_player=;path=/;max-age=0';
  sessionStorage.removeItem('blc_player');
}

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

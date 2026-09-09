'use strict';
const fs=require('fs'),path=require('path');
const CD=require('../car-development-core.js');
const ROOT=path.resolve(__dirname,'..');
const app=fs.readFileSync(path.join(ROOT,'app.js'),'utf8');
const css=fs.readFileSync(path.join(ROOT,'styles.css'),'utf8');
function section(a,b){const i=app.indexOf(a),j=app.indexOf(b);return i>=0&&j>i?app.slice(i,j):'';}
function gate(name,checks){let passed=0;for(const [label,fn] of checks){let good=false;try{good=!!fn();}catch{}if(good)passed++;else console.log(`  FAIL: ${label}`);}const score=10*passed/checks.length;console.log(`${name}: ${passed}/${checks.length} — ${score.toFixed(2)}/10`);if(score<9)process.exitCode=1;return score;}
const scores=[];

scores.push(gate('Car Development parsing & mapping',[
 ['flat FIA parser exists',()=>app.includes('function parseFlatCarRows')],
 ['table parser remains supported',()=>section('function parseCarPresentation','function carTeamSlug').includes("startsWith('|')")],
 ['explicit no-update teams retained',()=>app.includes('NO UPDATES SUBMITTED')],
 ['parser failures stay visible instead of disappearing',()=>app.includes('UPDATE TABLE COULD NOT BE SPLIT')],
 ['Racing Bulls resolves before Red Bull',()=>section('function carTeamName','function updateBadge').indexOf('racing bulls')<section('function carTeamName','function updateBadge').indexOf('red bull racing')],
 ['front wing maps',()=>CD.matchZone({component:'Front Wing'}).id==='front-wing'],
 ['floor-board stay maps',()=>CD.matchZone({component:'Forward Floor Board Stay'}).id!=='unmapped'],
 ['combined components can map twice',()=>CD.matchZones({component:'Floor Edge and Diffuser'}).length===2],
 ['unknown components remain honest',()=>CD.matchZone({component:'Mystery Device'}).id==='unmapped'],
 ['official source link retained',()=>app.includes('OFFICIAL FIA DOCUMENT ↗')],
 ['official-style 2026 car map uses multi-view schematic image',()=>app.includes('official-schematic')&&app.includes('tech-car-reference-clean2.png')&&app.includes('schematic-marker')&&app.includes('REAR VIEW')&&app.includes('SIDE VIEW')]
]));

scores.push(gate('Favourite cleanup',[
 ['driver standings have no favourite class',()=>!section('function standingRow','function renderHome').includes('is-favourite')],
 ['driver standings have no favourite star',()=>!section('function standingRow','function renderHome').includes('★')],
 ['constructor standings have no favourite class',()=>!section('function renderStandings','function fmtNewsTime').includes('is-favourite')],
 ['news source tabs contain no MYF1',()=>!section('function renderNews','function renderMore').includes('MYF1')],
 ['news source tabs contain no My F1 label',()=>!section('function renderNews','function renderMore').includes('MY F1')],
 ['favourite theme remains available',()=>app.includes('applyPersonalTheme')],
 ['Home favourite card removed',()=>!section('function renderHome','function latestHeadline').includes('favouriteCard')],
 ['Car Development favourite-team filter remains',()=>app.includes('★ MY TEAM')],
 ['driver grid personalisation remains',()=>section('function driverCard','function buildDriverCareer').includes('isFavouriteDriver')],
 ['theme opt-out remains',()=>app.includes('f1hub:personal-theme')]
]));

scores.push(gate('Swipe navigation',[
 ['top-level route order declared',()=>app.includes("['home','races','standings','news','more']")],
 ['swipe helper calculates adjacent route',()=>app.includes('function swipeTarget')],
 ['touchstart tracked',()=>section('function setupSwipeNavigation','function enhanceAccessibility').includes("addEventListener('touchstart'")],
 ['touchmove follows finger with translate3d',()=>section('function setupSwipeNavigation','function enhanceAccessibility').includes('translate3d(${edge}px,0,0)')],
 ['touchend commits adjacent route',()=>section('function setupSwipeNavigation','function enhanceAccessibility').includes('commitSwipe(quickTarget,dx)')],
 ['completed swipe releases gesture state immediately',()=>section('function setupSwipeNavigation','function enhanceAccessibility').includes('resetGesture();preview.classList.remove')],
 ['old swipe visual can be interrupted by next touch',()=>section('function setupSwipeNavigation','function enhanceAccessibility').includes('stopVisual();const p=e.touches[0]')],
 ['outgoing page snapshot gives continuous transition',()=>section('function setupSwipeNavigation','function enhanceAccessibility').includes('makeSnapshot()')&&css.includes('.swipe-snapshot')],
 ['edge resistance only applies beyond navigation edge',()=>section('function setupSwipeNavigation','function enhanceAccessibility').includes('dx*.16')],
 ['swipe gestures can start on article links while buttons stay excluded',()=>!section('function setupSwipeNavigation','function enhanceAccessibility').includes('a,button,input,select,textarea')&&section('function setupSwipeNavigation','function enhanceAccessibility').includes('button,input,select,textarea')],
 ['weather tabs excluded',()=>section('function setupSwipeNavigation','function enhanceAccessibility').includes('.weather-session-tabs')],
 ['left/right route animation classes',()=>css.includes('.route-swipe-left')&&css.includes('.route-swipe-right')],
 ['reduced motion remains supported',()=>css.includes('prefers-reduced-motion:reduce')]
]));

scores.push(gate('More hierarchy',[
 ['Drivers appears in first group',()=>section('function renderMore','function menu').indexOf("'Drivers'")>=0],
 ['Car Development appears near top',()=>section('function renderMore','function menu').indexOf("'Car Development'")>=0],
 ['Driver Compare remains high priority',()=>section('function renderMore','function menu').indexOf("'Driver Compare'")>=0],
 ['Teams menu removed',()=>!section('function renderMore','function menu').includes("'Teams'")],
 ['reference items grouped separately',()=>section('function renderMore','function menu').includes('RACE REFERENCE')],
 ['Data Health retained but not top',()=>section('function renderMore','function menu').indexOf("'Data Health'")>section('function renderMore','function menu').indexOf("'Drivers'")],
 ['Personalise group is after reference group',()=>section('function renderMore','function menu').indexOf('PERSONALISE')>section('function renderMore','function menu').indexOf('RACE REFERENCE')],
 ['My F1 is after Data Health',()=>section('function renderMore','function menu').indexOf("'My F1'")>section('function renderMore','function menu').indexOf("'Data Health'")],
 ['My F1 uses single-last layout',()=>section('function renderMore','function menu').includes('single-last')],
 ['install/spoiler controls remain after feature menus',()=>section('function renderMore','function menu').includes('spoilerSettingsCard()')]
]));

scores.push(gate('Driver career history',[
 ['career archive is paginated',()=>app.includes('limit=${pageSize}&offset=${offset}')&&app.includes('MRData?.total')],
 ['career aggregation helper',()=>app.includes('function buildDriverCareer')],
 ['career totals include full Grand Prix entries',()=>section('function driverCareerHtml','async function fetchAllDriverCareerRaces').includes('GRANDS PRIX')],
 ['career totals include wins',()=>section('function driverCareerHtml','async function loadDriverCareerInto').includes('WINS')],
 ['career totals include podiums',()=>section('function driverCareerHtml','async function loadDriverCareerInto').includes('PODIUMS')],
 ['team history timeline',()=>section('function driverCareerHtml','async function loadDriverCareerInto').includes('TEAM HISTORY')],
 ['team tenure year span',()=>app.includes('function careerSpan')],
 ['season-by-season timeline',()=>section('function driverCareerHtml','async function loadDriverCareerInto').includes('SEASON BY SEASON')],
 ['season rows show championship position',()=>section('function driverCareerHtml','async function fetchAllDriverCareerRaces').includes('career-season-finish')&&section('function driverCareerHtml','async function fetchAllDriverCareerRaces').includes('CHAMPIONSHIP')],
 ['season positions come from driver standings endpoint',()=>section('async function fetchDriverSeasonPositions','async function loadDriverCareerInto').includes('/driverstandings/')],
 ['mid-season team arrows',()=>section('function driverCareerHtml','async function loadDriverCareerInto').includes("join(' → ')")],
 ['career load has error fallback',()=>section('async function loadDriverCareerInto','function renderDriver(id)').includes('Career history could not be loaded')]
]));

scores.push(gate('Session weather',[
 ['upcoming sessions helper',()=>app.includes('function upcomingWeatherSessions')],
 ['selected session state',()=>app.includes('weatherSessionByRound')],
 ['session tabs',()=>app.includes('function weatherSessionTabs')],
 ['toggle handler',()=>app.includes('async function selectWeatherSession')],
 ['selected session is persisted for round',()=>section('async function selectWeatherSession','window.selectWeatherSession').includes('weatherSessionByRound')],
 ['forecast centers on session',()=>section('async function loadWeatherIntoCard','function renderRaces').includes('selectedWeatherSession(r)')],
 ['session label shown in card',()=>section('function weatherCard','async function loadWeatherIntoCard').includes('SESSION WEATHER')],
 ['tabs are swipe-safe',()=>section('function weatherSessionTabs','function weatherCard').includes('data-no-swipe')],
 ['animated weather replacement',()=>css.includes('.weather-swap')],
 ['fallback when weekend complete',()=>section('function upcomingWeatherSessions','function selectedWeatherSession').includes('all.at(-1)')]
]));

scores.push(gate('Race Calendar redesign',[
 ['season progress overview',()=>app.includes('calendar-overview')],
 ['progress bar',()=>app.includes('calendar-progress')],
 ['next-race summary',()=>app.includes('calendar-next')],
 ['next-race summary scrolls to main calendar round',()=>app.includes('function focusCalendarRound')&&section('function renderRaces','function renderStandings').includes('focusCalendarRound')],
 ['focused calendar round now highlights the main calendar card without extra session UI',()=>app.includes('calendarFocusRound')&&!app.includes('OPEN RACE HUB')],
 ['month grouping',()=>app.includes('calendarMonthLabel')&&app.includes('calendar-month')],
 ['timeline rail',()=>app.includes('calendar-rail')&&css.includes('.calendar-list:before')],
 ['track silhouette in cards',()=>section('function calendarRaceCard','function renderRaces').includes('calendar-track')],
 ['status-specific styling',()=>css.includes('.calendar-race.status-next')],
 ['selection animation before navigation',()=>app.includes('openRaceFromCalendar')&&css.includes('.calendar-race.is-opening')],
 ['sibling dimming on selection',()=>section('function openRaceFromCalendar','window.openRaceFromCalendar').includes('is-navigating')],
 ['spoiler winner protection retained',()=>section('function calendarRaceCard','function renderRaces').includes('SPOILER HIDDEN')]
]));


scores.push(gate('Race-weekend launch experience',[
 ['launch overlay is present',()=>fs.readFileSync(path.join(ROOT,'index.html'),'utf8').includes('id="launch-screen"')],
 ['launch summary uses current/next race',()=>app.includes('function launchWeekendSummary')&&app.includes('NEXT · ROUND')],
 ['live session launch state exists',()=>section('function launchWeekendSummary','function updateLaunchContent').includes('RACE WEEKEND · LIVE')],
 ['first install can update launch content after schedule arrives',()=>app.includes('updateLaunchContent();')],
 ['launch is non-blocking',()=>app.indexOf('showLaunchSequence(false);')<app.lastIndexOf('loadBase();')],
 ['long-resume launch exists',()=>app.includes('awayFor>10*60e3')&&app.includes('showLaunchSequence(true)')],
 ['launch has speed-line animation',()=>css.includes('.launch-speed-lines')&&css.includes('@keyframes launchSpeed')],
 ['launch has progress animation',()=>css.includes('.launch-progress')&&css.includes('@keyframes launchProgress')],
 ['team theme accent carries through launch',()=>css.includes('var(--red)')],
 ['reduced motion is respected',()=>css.includes('@media(prefers-reduced-motion:reduce)')&&css.includes('.launch-screen{transition:none}')]
]));

const avg=scores.reduce((a,b)=>a+b,0)/scores.length;
console.log(`FEATURE GATE AVERAGE: ${avg.toFixed(2)}/10`);
if(avg<9)process.exitCode=1;

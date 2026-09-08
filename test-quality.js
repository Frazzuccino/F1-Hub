'use strict';
const fs=require('fs');const path=require('path');const Q=require('../quality-core.js');const CD=require('../car-development-core.js');
const ROOT=path.resolve(__dirname,'..');
let passed=0,failed=0;const results=[];
function test(name,fn,category='general'){try{fn();passed++;results.push({name,category,ok:true});}catch(e){failed++;results.push({name,category,ok:false,error:e.message});}}
function ok(v,msg='assertion failed'){if(!v)throw new Error(msg);}function eq(a,b,msg='values differ'){if(JSON.stringify(a)!==JSON.stringify(b))throw new Error(`${msg}: ${JSON.stringify(a)} !== ${JSON.stringify(b)}`);}
const dnfRows=[
 {driver_number:18,dnf:true,number_of_laps:26,position:null},
 {driver_number:14,dnf:true,number_of_laps:23,position:null},
 {driver_number:16,dnf:true,number_of_laps:1,position:null},
 {driver_number:12,position:1,number_of_laps:53,duration:6675.2},
 {driver_number:63,position:2,number_of_laps:53,gap_to_leader:3.857},
 {driver_number:1,position:3,number_of_laps:53,gap_to_leader:7.1}
];
test('DNFs never sort ahead of P1',()=>eq(Q.sortResults(dnfRows).map(x=>x.driver_number).slice(0,3),[12,63,1]),'data');
test('DNFs sort after classified finishers',()=>ok(Q.sortResults(dnfRows).slice(-3).every(x=>x.dnf)),'data');
test('race validation finds a real winner',()=>ok(Q.validateResults(dnfRows,{minEntries:3}).leader.driver_number===12),'data');
test('duplicate P1 is rejected',()=>ok(!Q.validateResults([{position:1},{position:1},{position:2}],{minEntries:1}).ok),'data');
test('valid standings accepted',()=>ok(Q.validateStandings([{position:1,points:267,wins:7},{position:2,points:201,wins:2},{position:3,points:191,wins:1}],{minEntries:3}).ok),'data');
test('out-of-order standings rejected',()=>ok(!Q.validateStandings([{position:1,points:100,wins:1},{position:2,points:120,wins:0}],{minEntries:2}).ok),'data');
test('provisional standings adds points generically',()=>{const base=[{position:'1',points:'242',wins:'6',Driver:{code:'ANT'}},{position:'2',points:'183',wins:'2',Driver:{code:'RUS'}}];const out=Q.provisionalStandings(base,{ANT:25,RUS:18},{ANT:1},x=>x.Driver.code);eq(out.map(x=>[x.Driver.code,x.points,x.wins]),[['ANT','267','7'],['RUS','201','2']]);},'reliability');
test('race insights identify winner',()=>ok(Q.calculateRaceInsights([{position:2,grid:5,Driver:{code:'B'}},{position:1,grid:3,Driver:{code:'A'}}]).winner.Driver.code==='A'),'data');
test('race insights identify biggest gainer',()=>ok(Q.calculateRaceInsights([{position:1,grid:5,Driver:{code:'A'}},{position:2,grid:1,Driver:{code:'B'}}]).biggestGainer.row.Driver.code==='A'),'features');
test('freshness classifies stale records',()=>ok(Q.freshness(Date.now()-400000,60000).state==='stale'),'reliability');
test('quality scoring weights categories',()=>ok(Q.overallQualityScore({data:9,reliability:9,performance:9,ux:9,features:9,pwa:9,accessibility:9,tests:9})===9),'tests');

const app=fs.readFileSync(path.join(ROOT,'app.js'),'utf8'),html=fs.readFileSync(path.join(ROOT,'index.html'),'utf8'),css=fs.readFileSync(path.join(ROOT,'styles.css'),'utf8'),sw=fs.readFileSync(path.join(ROOT,'service-worker.js'),'utf8'),manifest=JSON.parse(fs.readFileSync(path.join(ROOT,'manifest.json'),'utf8'));
test('release version is 1.13.0',()=>ok(app.includes("APP_VERSION = '1.13.0'")),'pwa');
test('quality core loads before app',()=>ok(html.indexOf('quality-core.js')<html.indexOf('app.js')),'reliability');
test('car development core loads before app',()=>ok(html.indexOf('car-development-core.js')>0&&html.indexOf('car-development-core.js')<html.indexOf('app.js')),'reliability');
test('hard-coded standings snapshot removed',()=>ok(!app.includes('BUNDLED_STANDINGS_SNAPSHOTS')),'reliability');
test('standings reconstruct from previous round',()=>ok(app.includes('deriveStandingsFromPreviousRound')),'reliability');
test('result validation wired into race results',()=>ok(app.includes("validateResults(rr?.Results")),'data');
test('Data Health screen exists',()=>ok(app.includes("renderDataHealth")),'ux');
test('Data Health strip is removed from Home',()=>{const h=app.slice(app.indexOf('function renderHome()'),app.indexOf('function latestHeadline()'));ok(!h.includes('freshnessStrip()'));},'ux');
test('favourite driver preference exists',()=>ok(app.includes('favouriteDriver')),'features');
test('My F1 Home card exists',()=>ok(app.includes('function favouriteCard')),'features');
test('My F1 can theme the app from favourite team',()=>ok(app.includes('function applyPersonalTheme')&&app.includes('f1hub:personal-theme')),'features');
test('My F1 theme changes core accent variable',()=>ok(app.includes("setProperty('--red',accent)")),'ux');
test('My F1 highlights favourite standings rows',()=>ok(app.includes("standing-row ${fav?'is-favourite':''}")),'features');
test('My F1 has personalised news filter',()=>ok(app.includes("['MYF1']")&&app.includes('function myF1News')),'features');
test('My F1 includes team-mate context on Home',()=>ok(app.includes('TEAM-MATE')&&app.includes('mateGap')),'features');
test('My F1 affects Car Development ordering/filter',()=>ok(app.includes('★ MY TEAM')&&app.includes('favourite-update-team')),'features');
test('race weekend calendar export exists',()=>ok(app.includes('addRaceWeekendCalendar')),'features');
test('calendar export contains reminder alarm',()=>ok(app.includes('BEGIN:VALARM')&&app.includes('TRIGGER:-PT30M')),'features');
test('post-race Race at a Glance exists',()=>ok(app.includes('RACE AT A GLANCE')),'features');
test('post-race summary includes gainer/loss/retirements/pits',()=>ok(['BIGGEST GAIN','BIGGEST LOSS','RETIREMENTS','PIT STOPS'].every(x=>app.includes(x))),'features');
test('championship trends route exists',()=>ok(app.includes('renderTrends')),'features');
test('points evolution chart exists',()=>ok(app.includes('POINTS EVOLUTION')),'features');
test('constructor contribution exists',()=>ok(app.includes('Driver Contribution')),'features');
test('driver compare has quali H2H',()=>ok(app.includes('QUALI H2H')),'features');
test('driver compare has race H2H',()=>ok(app.includes('RACE H2H')),'features');
test('native share support exists',()=>ok(app.includes('navigator.share')),'features');
test('telemetry share button exists',()=>ok(app.includes('SHARE COMPARISON')),'features');
test('zoom is not disabled',()=>ok(!html.includes('user-scalable=no')),'accessibility');
test('focus-visible style exists',()=>ok(css.includes(':focus-visible')),'accessibility');
test('touch targets enforce 44px minimum',()=>ok(css.includes('min-height:44px')),'accessibility');
test('reduced motion is respected',()=>ok(css.includes('prefers-reduced-motion:reduce')),'accessibility');
test('clickable non-buttons get keyboard enhancement',()=>ok(app.includes('enhanceAccessibility')),'accessibility');
test('Leaflet is no longer loaded at startup',()=>ok(!html.includes('leaflet@1.9.4')),'performance');
test('Leaflet lazy loader exists',()=>ok(app.includes('function ensureLeaflet')),'performance');
test('cached app shell is served immediately',()=>ok(sw.includes("caches.match('./index.html')")),'performance');
test('static release assets are cache-first',()=>ok(sw.includes('cached||network')),'performance');
test('below-fold cards use content-visibility',()=>ok(css.includes('content-visibility:auto')),'performance');
test('PWA has app shortcuts',()=>ok(Array.isArray(manifest.shortcuts)&&manifest.shortcuts.length>=4),'pwa');
test('PWA has install screenshots',()=>ok(Array.isArray(manifest.screenshots)&&manifest.screenshots.length>=2),'pwa');
test('update banner exists',()=>ok(html.includes('update-banner')&&app.includes('checkForUpdate')),'pwa');
test('version endpoint is network-only in service worker',()=>ok(sw.includes("endsWith('/version.json')")&&sw.includes("cache:'no-store'")),'pwa');
test('news still refreshes on resume',()=>ok(app.includes("visibilitychange")&&app.includes('refreshNewsOnly(true)')),'reliability');
test('app startup still hydrates cache before network',()=>ok(app.indexOf('hydrateBaseFromCache();')<app.lastIndexOf('loadBase();')),'performance');
test('app JS remains under 215KB',()=>ok(Buffer.byteLength(app)<215000,`app.js is ${Buffer.byteLength(app)} bytes`),'performance');
test('post-race reconstruction only replaces demonstrably stale published standings',()=>ok(app.includes('dLooksStale') && app.includes('cLooksStale')),'reliability');
test('post-race standings fetch is validated before assignment',()=>ok((app.match(/validateStandings\(rows,\{minEntries:18\}\)/g)||[]).length>=3 && (app.match(/validateStandings\(rows,\{minEntries:8\}\)/g)||[]).length>=3),'data');
test('previous-round reconstruction rejects invalid base standings',()=>ok(app.includes("if(!(Q?.validateStandings(drows,{minEntries:18})?.ok))return false") && app.includes("if(!(Q?.validateStandings(crows,{minEntries:8})?.ok))return false")),'reliability');
test('constructor contribution bar uses constructor colour',()=>ok(app.includes('contribution-bar" style="color:${teamColour(c.team)}')),'ux');
test('news refresh clears loading state before final render',()=>ok(/newsRefreshing=false;if\(state\.route==='news'\)renderNews/.test(app)),'reliability');


// v1.13 Car Development visual mapping regression tests
test('front wing maps to front of schematic',()=>{const z=CD.matchZone({component:'Front Wing'});eq([z.id,z.confidence],['front-wing','HIGH']);},'features');
test('floor edge maps to floor',()=>ok(CD.matchZone({component:'Floor Edge'}).id==='floor'),'features');
test('sidepod maps to sidepod',()=>ok(CD.matchZone({component:'Sidepod Inlet'}).id==='sidepod'),'features');
test('diffuser maps to diffuser',()=>ok(CD.matchZone({component:'Diffuser'}).id==='diffuser'),'features');
test('rear wing maps to rear wing',()=>ok(CD.matchZone({component:'Rear Wing Mainplane'}).id==='rear-wing'),'features');
test('real FIA floor furniture term maps correctly',()=>ok(CD.matchZone({component:'Floor Furniture'}).id==='floor-fences'),'features');
test('real FIA Coke Engine Cover term maps to cooling bodywork',()=>ok(CD.matchZone({component:'Coke/Engine Cover'}).id==='cooling'),'features');
test('real FIA exhaust tailpipe bracket maps to rear body',()=>ok(CD.matchZone({component:'Exhaust Tailpipe Bracket'}).id==='rear-body'),'features');
test('combined FIA component maps to multiple physical zones',()=>eq(CD.matchZones({component:'Floor Edge and Diffuser'}).map(x=>x.id),['floor','diffuser']),'features');
test('description-only part mapping is marked medium confidence',()=>ok(CD.matchZone({component:'Bodywork update',desc:'Revised rear wing endplate geometry'}).confidence==='MEDIUM'),'reliability');
test('unknown components are not given false precise locations',()=>ok(CD.matchZone({component:'Experimental assembly'}).id==='unmapped'),'reliability');
test('car update UI has top and side schematic',()=>ok(app.includes('TOP VIEW')&&app.includes('SIDE VIEW')&&app.includes('carSchematicSvg')),'features');
test('car schematic discloses it is not CAD geometry',()=>ok(app.includes('not team CAD geometry')),'reliability');
test('Car Development keeps teams that submit zero updates',()=>ok(app.includes('noUpdateTeams')&&app.includes('NO UPDATES SUBMITTED')),'features');
test('car markers link to update details',()=>ok(app.includes('focusCarUpdate')&&app.includes('update-flash')),'ux');
test('service worker caches car-development core',()=>ok(sw.includes('car-development-core.js?v=1.13.0')),'performance');
// Motion quality: transitions only on navigation, not every background render.
test('route motion helper exists',()=>ok(app.includes('function animateRouteContent')),'ux');
test('render no longer replays view animation every refresh',()=>{const r=app.slice(app.indexOf('function render(){'),app.indexOf('function titleBlock'));ok(!r.includes("classList.add('view-enter')"));},'performance');
test('route motion has staggered card entrance',()=>ok(css.includes('.stagger-enter')&&css.includes('@keyframes cardIn')),'ux');
test('active bottom navigation has animated indicator',()=>ok(css.includes('.nav-btn:after')&&css.includes('.nav-btn.active:after')),'ux');
test('motion polish still respects reduced motion',()=>ok(css.includes('prefers-reduced-motion:reduce')&&css.includes('.route-enter')),'accessibility');

const cats={};for(const r of results){cats[r.category]??={pass:0,total:0};cats[r.category].total++;if(r.ok)cats[r.category].pass++;}
const score=10*passed/(passed+failed);
console.log(`\nF1 HUB QUALITY TESTS: ${passed}/${passed+failed} passed`);for(const [k,v] of Object.entries(cats))console.log(`${k.padEnd(14)} ${v.pass}/${v.total}`);console.log(`TEST SCORE: ${score.toFixed(2)}/10`);
for(const r of results.filter(x=>!x.ok))console.log(`FAIL [${r.category}] ${r.name}: ${r.error}`);
process.exitCode=failed?1:0;

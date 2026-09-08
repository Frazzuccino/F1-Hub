'use strict';
const fs=require('fs'),path=require('path');
const CD=require('../car-development-core.js');
const ROOT=path.resolve(__dirname,'..');
const app=fs.readFileSync(path.join(ROOT,'app.js'),'utf8');
const css=fs.readFileSync(path.join(ROOT,'styles.css'),'utf8');
const html=fs.readFileSync(path.join(ROOT,'index.html'),'utf8');
function section(a,b){return app.slice(app.indexOf(a),app.indexOf(b));}
function gate(name,checks){const passed=checks.filter(x=>x[1]()).length,score=10*passed/checks.length;console.log(`${name}: ${passed}/${checks.length} — ${score.toFixed(2)}/10`);for(const [label,fn] of checks){if(!fn())console.log(`  FAIL: ${label}`);}if(score<9){process.exitCode=1;}return score;}
const scores=[];
scores.push(gate('Home cleanup',[
 ['no data-health strip on Home',()=>!section('function renderHome()','function latestHeadline()').includes('freshnessStrip()')],
 ['Data Health remains in More',()=>app.includes("menu('✓','Data Health'")],
 ['connection pill still opens health',()=>app.includes("connection-pill')?.addEventListener('click',()=>setRoute('datahealth')")],
 ['Home keeps race hero',()=>section('function renderHome()','function latestHeadline()').includes('<section class="hero">')],
 ['Home keeps schedule',()=>section('function renderHome()','function latestHeadline()').includes('sessionRows(r)')],
 ['Home keeps weather',()=>section('function renderHome()','function latestHeadline()').includes('weatherCard(r)')],
 ['Home keeps championship top 3',()=>section('function renderHome()','function latestHeadline()').includes("titleBlock('CHAMPIONSHIP','Top 3')")],
 ['Home keeps latest headline',()=>section('function renderHome()','function latestHeadline()').includes('latestHeadline()')],
 ['Home includes personalised card',()=>section('function renderHome()','function latestHeadline()').includes('favouriteCard()')],
 ['spoiler protection retained',()=>section('function renderHome()','function latestHeadline()').includes('SPOILER MODE')]
]));
scores.push(gate('My F1 personalisation',[
 ['favourite driver',()=>app.includes('favouriteDriver')],['favourite team',()=>app.includes('favouriteTeam')],
 ['team theme',()=>app.includes('applyPersonalTheme')&&css.includes('body.personal-theme')],
 ['theme opt-out',()=>app.includes('f1hub:personal-theme')],
 ['driver standings highlight',()=>app.includes("standing-row ${fav?'is-favourite':''}")],
 ['constructor highlight',()=>app.includes("isFavouriteTeamName(c.Constructor.name)?'is-favourite':''")],
 ['driver card highlight',()=>app.includes("driver-card clickable ${isFavouriteDriver(s)?'is-favourite':''}")],
 ['My F1 news filter',()=>app.includes("id==='MYF1'?'★ MY F1'")],
 ['team-mate context',()=>app.includes('TEAM-MATE')&&app.includes('mateGap')],
 ['car-development integration',()=>app.includes('★ MY TEAM')&&app.includes('MY TEAM ·')]
]));
scores.push(gate('Car Development 2.0',[
 ['official FIA parser retained',()=>app.includes('parseCarPresentation')&&app.includes('OFFICIAL FIA DOCUMENT')],
 ['top view',()=>app.includes('TOP VIEW')],['side view',()=>app.includes('SIDE VIEW')],
 ['numbered interactive markers',()=>app.includes('car-marker')&&app.includes('focusCarUpdate')],
 ['high-confidence component mapping',()=>CD.matchZone({component:'Front Wing'}).confidence==='HIGH'],
 ['combined components map to multiple zones',()=>CD.matchZones({component:'Floor Edge and Diffuser'}).length===2],
 ['unknown parts remain unmapped',()=>CD.matchZone({component:'Mystery device'}).id==='unmapped'],
 ['zero-update teams retained',()=>app.includes('NO UPDATES SUBMITTED')],
 ['mapping coverage shown',()=>app.includes('map-coverage')],
 ['CAD precision disclaimer',()=>app.includes('not team CAD geometry')]
]));
scores.push(gate('Motion & animation',[
 ['route transition',()=>css.includes('@keyframes routeIn')],['staggered cards',()=>css.includes('@keyframes cardIn')],
 ['animated nav indicator',()=>css.includes('.nav-btn.active:after')],['nav icon pop',()=>css.includes('@keyframes navPop')],
 ['hero ambient motion',()=>css.includes('@keyframes heroOrbit')&&css.includes('@keyframes heroSlash')],
 ['button press feedback',()=>css.includes('.external-btn:active')],['marker feedback',()=>css.includes('.update-flash')],
 ['not replayed on every render',()=>!section('function render(){','function titleBlock').includes("classList.add('view-enter')")],
 ['reduced motion respected',()=>css.includes('@media(prefers-reduced-motion:reduce)')&&css.includes('.route-enter')],
 ['cold-start animation',()=>app.includes('routeMotionPending')]
]));
const avg=scores.reduce((a,b)=>a+b,0)/scores.length;console.log(`FEATURE GATE AVERAGE: ${avg.toFixed(2)}/10`);if(avg<9)process.exitCode=1;

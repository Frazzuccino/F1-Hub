'use strict';
const fs=require('fs'),vm=require('vm'),path=require('path');
global.F1HubQuality=require('../quality-core.js');
global.F1HubCarDevelopment=require('../car-development-core.js');
global.F1HubDriverCareer=require('../driver-career-core.js');
const src=fs.readFileSync(path.join(__dirname,'..','app.js'),'utf8');
function classes(){const s=new Set();return {add(...a){a.forEach(x=>s.add(x))},remove(...a){a.forEach(x=>s.delete(x))},toggle(x,v){if(v===undefined){s.has(x)?s.delete(x):s.add(x)}else v?s.add(x):s.delete(x)},contains(x){return s.has(x)}};}
const dummy=()=>({textContent:'',className:'',innerHTML:'',dataset:{},style:{cssText:'',setProperty(){},removeProperty(){}},classList:classes(),addEventListener(){},removeEventListener(){},querySelector(){return null},querySelectorAll(){return []},closest(){return null},appendChild(){},insertBefore(){},remove(){},setAttribute(){},removeAttribute(){},hasAttribute(){return false},cloneNode(){return dummy()},getBoundingClientRect(){return {top:70}},scrollIntoView(){},get value(){return this._value||''},set value(v){this._value=v},options:[],disabled:false});
const elems=new Map();['view','toast','connection-pill','refresh-btn','brand-btn','install-app-btn','install-sheet','install-now','install-later','update-banner','update-now','pull-indicator','app-shell','launch-screen'].forEach(id=>elems.set(id,dummy()));
global.document={hidden:false,body:dummy(),head:dummy(),documentElement:dummy(),getElementById(id){if(!elems.has(id))elems.set(id,dummy());return elems.get(id)},querySelector(){return null},querySelectorAll(){return []},createElement(){return dummy()},addEventListener(){},removeEventListener(){}};
global.window=global;window.innerWidth=420;window.innerHeight=850;window.scrollY=0;window.scrollTo=()=>{};window.addEventListener=()=>{};window.removeEventListener=()=>{};window.matchMedia=()=>({matches:false,addEventListener(){}});global.matchMedia=window.matchMedia;
Object.defineProperty(global,'navigator',{value:{onLine:true},configurable:true});Object.defineProperty(global,'location',{value:{hash:'#home',protocol:'file:',href:'file:///index.html'},configurable:true});global.history={pushState(_s,_t,h){location.hash=h},length:1,back(){}};global.localStorage={getItem(){return null},setItem(){},removeItem(){}};global.sessionStorage={getItem(){return null},setItem(){}};global.MutationObserver=class{constructor(){}observe(){}};global.DOMParser=class{parseFromString(){return {querySelector(){return null},getElementsByTagName(){return []}}}};global.fetch=async()=>{throw new Error('offline')};global.AbortController=class{constructor(){this.signal={}}abort(){}};global.setInterval=()=>0;global.clearInterval=()=>{};global.setTimeout=(fn)=>{if(typeof fn==='function')fn();return 0};global.clearTimeout=()=>{};global.requestAnimationFrame=(fn)=>{fn();return 1};global.cancelAnimationFrame=()=>{};global.performance={now:(()=>{let n=0;return()=>n+=16})()};global.CSS={escape:s=>String(s)};
vm.runInThisContext(src,{filename:'app.js'});
const failures=[];
function assert(name,cond){if(!cond)failures.push(name);}
assert('F1 story filter keeps F1 article', looksLikeF1Story({title:'Ferrari brings Monza rear-wing package for Italian Grand Prix',source:'BBC Sport'}));
assert('F1 story filter blocks tennis article', !looksLikeF1Story({title:'US Open 2026 results: wheelchair doubles match',source:'BBC Sport'}));
const raceCard=calendarRaceCard({round:'2',raceName:'Saudi Arabian Grand Prix',date:'2026-03-15',time:'17:00:00Z',Circuit:{circuitId:'jeddah',circuitName:'Jeddah Corniche Circuit',Location:{country:'Saudi Arabia',locality:'Jeddah'}}});
assert('Calendar card no longer injects race hub CTA', !raceCard.includes('OPEN RACE HUB'));
assert('Calendar card no longer injects weekend session strip', !raceCard.includes('WEEKEND SESSIONS'));
const schematic=carSchematicSvg('Ferrari',[{component:'Rear Wing',reason:'Performance',diff:'',desc:'Low drag',mapIndex:1,maps:[{id:'rear-wing',label:'Rear wing',confidence:'HIGH'}]},{component:'Floor Board',reason:'Circuit specific',diff:'',desc:'Monza floor',mapIndex:2,maps:[{id:'floor',label:'Floor',confidence:'HIGH'}]}]);
assert('Technical schematic uses official schematic shell', schematic.includes('official-schematic'));
assert('Technical schematic uses cleaned 2026 reference image', schematic.includes('tech-car-reference-clean2.png'));
assert('Technical schematic renders clickable markers', schematic.includes('schematic-marker'));
assert('Technical schematic labels multiple views', schematic.includes('REAR VIEW')&&schematic.includes('TOP VIEW')&&schematic.includes('FRONT VIEW')&&schematic.includes('SIDE VIEW'));
const hero=compareDriverHero({name:'George Russell',code:'RUS',nationality:'British',team:'Mercedes',champPos:2,points:176,wins:4,pod:9,avgF:'4.1',poles:2,dnfs:1},{Driver:{permanentNumber:'63'}},'#00d2be');
assert('Driver compare hero includes stat chips', hero.includes('compare-driver-chip')&&hero.includes('POINTS')&&hero.includes('PODIUMS'));
const overview=compareOverviewGraphic({code:'ANT',points:198,wins:5,pod:10,poles:2},{code:'RUS',points:176,wins:4,pod:9,poles:3},{a:'#00d2be',b:'#999'});
assert('Driver compare overview graphic exists', overview.includes('AT A GLANCE')&&overview.includes('compare-overview-track'));
assert('Swipe code no longer excludes anchors from gesture start', !src.includes("a,button,input,select,textarea"));
assert('Race focus helper uses focus state not expansion state', src.includes('state.calendarFocusRound')&&!src.includes('state.calendarExpandedRound=String(round)'));

assert('News page uses a smaller first batch for mobile swipe performance', src.includes("defaultNewsBatch=window.innerWidth<620?18:28"));
assert('News swipe uses lightweight snapshot instead of cloning full feed', src.includes("swipe-news-snapshot")&&src.includes("state.route==='news'"));
const compareSection=src.slice(src.indexOf("function renderCompare"),src.indexOf("function renderRoute"));
assert('Driver compare puts graphics before photo cards', compareSection.indexOf('compareRadarSvg(aa,bb,colours)')<compareSection.indexOf('compareDriverHero(aa,sa,colours.a)'));
if(failures.length){
  console.error('V1.18 FIX SMOKE: FAIL');
  failures.forEach(f=>console.error(' - '+f));
  process.exit(1);
}
console.log('V1.18 FIX SMOKE: PASS');

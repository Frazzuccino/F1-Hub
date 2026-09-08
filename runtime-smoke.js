'use strict';
const fs=require('fs'),vm=require('vm'),path=require('path');
global.F1HubQuality=require('../quality-core.js');
global.F1HubCarDevelopment=require('../car-development-core.js');
global.F1HubDriverCareer=require('../driver-career-core.js');
const dummy=()=>({
  textContent:'',className:'',innerHTML:'',dataset:{},style:{setProperty(){},removeProperty(){}},classList:{add(){},remove(){},toggle(){},contains(){return false}},
  addEventListener(){},removeEventListener(){},querySelector(){return null},querySelectorAll(){return []},closest(){return null},appendChild(){},insertBefore(){},remove(){},setAttribute(){},hasAttribute(){return false},
  get value(){return this._value||''},set value(v){this._value=v},options:[],disabled:false
});
const elems=new Map();['view','toast','connection-pill','refresh-btn','brand-btn','install-app-btn','install-sheet','install-now','install-later','update-banner','update-now','pull-indicator','app-shell','launch-screen'].forEach(id=>elems.set(id,dummy()));
global.document={
  hidden:false,body:dummy(),head:dummy(),documentElement:dummy(),
  getElementById(id){if(!elems.has(id))elems.set(id,dummy());return elems.get(id)},querySelector(){return null},querySelectorAll(){return []},
  createElement(){return dummy()},addEventListener(){},removeEventListener(){}
};
global.window=global;window.scrollY=0;window.scrollTo=()=>{};window.addEventListener=()=>{};window.removeEventListener=()=>{};window.matchMedia=()=>({matches:false,addEventListener(){}});Object.defineProperty(global,'navigator',{value:{onLine:true},configurable:true});Object.defineProperty(global,'location',{value:{hash:'#home',protocol:'file:',href:'file:///smoke/index.html'},configurable:true});global.history={pushState(){},length:1,back(){}};
global.localStorage={getItem(){return null},setItem(){},removeItem(){}};global.sessionStorage={getItem(){return null},setItem(){}};
global.MutationObserver=class{constructor(){}observe(){}};
global.DOMParser=class{parseFromString(){return {querySelector(){return null},getElementsByTagName(){return []}}}};
global.fetch=async()=>{throw new Error('offline smoke')};
global.AbortController=class{constructor(){this.signal={}}abort(){}};
global.setInterval=()=>0;global.clearInterval=()=>{};global.setTimeout=()=>0;global.clearTimeout=()=>{};
global.requestAnimationFrame=(fn)=>fn();global.cancelAnimationFrame=()=>{};
try{
  const code=fs.readFileSync(path.join(__dirname,'..','app.js'),'utf8');vm.runInThisContext(code,{filename:'app.js'});

  const sorted=vm.runInThisContext("sortedSessionResults([{driver_number:18,dnf:true,position:null,number_of_laps:20},{driver_number:12,position:1,number_of_laps:53},{driver_number:63,position:2,number_of_laps:53}]).map(x=>x.driver_number)");
  if(JSON.stringify(sorted)!=='[12,63,18]')throw new Error('runtime DNF ordering failed: '+JSON.stringify(sorted));
  const route=vm.runInThisContext("parentNav('datahealth')");if(route!=='more')throw new Error('data health nav route failed');

  const tableParsed=vm.runInThisContext("parseCarPresentation('Mercedes\\n| 1 | Front Wing | Circuit specific | Revised flap | Lower drag |\\nWilliams\\n| 1 | Floor Edge | Performance | Re-profiled edge | More load |')");
  if(tableParsed.teams.length!==2||tableParsed.teams[0].updates[0].component!=='Front Wing')throw new Error('FIA table update parser fixture failed');

  const flatFia=`
McLaren Mastercard F1 Team
Updated
component
Primary reason for update
Geometric differences compared to previous version
Brief description on how the update works
1 Rear Wing Performance -
Drag reduction
Alternative Straight Line Mode Flap Position and Beamwing
The high isochronal rear wing has been modified to reduce drag.
2 Floor Furniture Performance -
Flow Conditioning Updated Floor Furniture
A small modification improves flow conditioning.
Mercedes-AMG PETRONAS F1 Team
Updated
component
Primary reason for update
1 Rear Wing
Circuit specific - Drag
Range
Various winglet devices removed from rear wing.
Removing the winglets reduces drag.
2 Front Bodywork Circuit specific - Drag
Range
Mirror rear stays trimmed.
The trim reduces local loading.
Oracle Red Bull Racing.
Updated
component
Primary reason for update
1 Rear Corner Reliability Rear suspension to wheel bodywork gaitor revision
To improve reliability the gaitor was changed.
2 Floor Body Performance -
Local Load Revised bib edge profile
The edge profile has been revised.
3
Exhaust
Tailpipe Reliability Revised tailpipe bracket
The bracket has been trimmed.
4 Front Wing Flow Conditioning Revised endplate vane
A trimmed dive-plane is available.
Scuderia Ferrari HP
Updated
component
Primary reason for update
1 Floor Board Circuit specific -
Drag Range
Front floor board elements optimisation.
2 Mirror Stay Circuit specific -
Drag Range
Shorter mirror vertical stay.
3 Rear Corner Circuit specific -
Drag Range
Removal of rear brake duct winglet.
4 RV Tail Circuit specific -
Drag Range
Slotted central winglet.
Williams
Updated
component
Primary reason for update
1 Halo Circuit specific -
Drag Range
A vertical fence has been introduced.
2 Front Wing Circuit specific -
Balance Range A reduction in chord.
3 Floor Body Circuit specific -
Drag Range A local trim has been applied.
Visa Cash App Racing Bulls
Updated
component
Primary reason for update
1 Rear Wing
Circuit Specific –
Drag Range
New assembly with updated mechanism.
2
Exhaust
Tailpipe
Performance –
Flow Conditioning Repositioned tailpipe with reprofiled bracket
The updates improve flow management.
Aston Martin Aramco F1 Team
Updated
component
Primary reason for update
1
Front
Suspension
Performance -
Local Load
Revised fairings for a front suspension member.
2 Floor Edge Performance -
Local Load
Update to the area in front of the rear tyre.
TGR HAAS F1 TEAM
Updated
component
Primary reason for update
1 Floor Performance -
Local Load
New Front Floor - new side geometry and diffuser update
The floor update improves efficiency.
2 Bodywork Performance -
Local Load
New Sidepod and coke-line.
3 Rear Corner Performance -
Local Load
Realigned rear suspension fairings.
Audi Revolut F1 Team
No updates submitted for this event.
BWT Alpine F1 Team
Updated
component
Primary reason for update
1
Front Wing
Endplate
Performance -
Local Load Revised footplate vane
The vane has been redesigned.
2 Rear wing
Performance -
Drag Reduction SM pod fairing removal
The pod has been adjusted.
Cadillac
Updated
component
Primary reason for update
1
Forward Floor
Board Stay
Performance –
Flow Conditioning
Updated stay position with higher outboard attachment point
The geometry improves flow conditioning.
2 Diffuser Vane
Performance –
Local Load
Addition of vane to diffuser sidewall
The vane improves aerodynamic performance.
`;
  global.__flatFia=flatFia;
  const flatParsed=vm.runInThisContext('parseCarPresentation(__flatFia)');
  if(flatParsed.teams.length!==11)throw new Error('FIA flat parser missed teams: '+flatParsed.teams.map(x=>x.name).join(','));
  const audi=flatParsed.teams.find(x=>x.name==='Audi');if(!audi?.noUpdates||audi.updates.length)throw new Error('FIA Audi no-update handling failed');
  const mcl=flatParsed.teams.find(x=>x.name==='McLaren');if(mcl?.updates.length!==2||mcl.updates[0].component!=='Rear Wing')throw new Error('FIA McLaren flat rows failed');
  const rb=flatParsed.teams.find(x=>x.name==='Red Bull Racing');if(rb?.updates.length!==4)throw new Error('FIA Red Bull flat rows failed');
  const cad=flatParsed.teams.find(x=>x.name==='Cadillac F1 Team');if(cad?.updates.length!==2||!cad.updates[0].component.includes('Forward Floor'))throw new Error('FIA Cadillac flat rows failed');
  if(flatParsed.teams.some(x=>x.parseWarning))throw new Error('FIA flat parser left a team unresolved: '+flatParsed.teams.filter(x=>x.parseWarning).map(x=>x.name).join(','));

  const none=vm.runInThisContext("parseCarPresentation('Aston Martin Aramco F1 Team\\nNo updates submitted for this event.')");if(none.teams.length!==1||!none.teams[0].noUpdates)throw new Error('FIA no-update team parser failed');
  const carHtml=vm.runInThisContext("carUpdatesHtml(parseCarPresentation('Mercedes\\n| 1 | Front Wing | Circuit specific | Revised flap | Lower drag |'),{url:'https://fia.example/doc.pdf'})");
  if(!carHtml.includes('TOP VIEW')||!carHtml.includes('SIDE VIEW')||!carHtml.includes('car-schematic-v2')||!carHtml.includes('halo-shape')||!carHtml.includes('Front wing'))throw new Error('detailed car schematic render failed');

  const theme=vm.runInThisContext("(()=>{state.favouriteTeam='McLaren';state.personalTheme=true;applyPersonalTheme();return favouriteTeamName();})()");if(theme!=='McLaren')throw new Error('My F1 theme runtime failed');
  const standingsHtml=vm.runInThisContext("standingRow({position:'1',points:'100',wins:'2',Driver:{code:'AAA',familyName:'Alpha'},Constructors:[{name:'McLaren'}]})");
  if(standingsHtml.includes('★')||standingsHtml.includes('is-favourite'))throw new Error('standings favourite marker regression');

  const career=vm.runInThisContext("buildDriverCareer([{season:'2019',round:'1',Results:[{position:'10',Constructor:{name:'Toro Rosso'}}]},{season:'2019',round:'12',Results:[{position:'5',Constructor:{name:'Red Bull'}}]},{season:'2020',round:'1',Results:[{position:'3',Constructor:{name:'Red Bull'}}]}])");
  if(career.teams.length!==2||career.seasons.find(x=>x.season===2019)?.teams.join('>')!=='Toro Rosso>Red Bull')throw new Error('driver career team history failed');
  const offsets=vm.runInThisContext('careerPageOffsets(393,100)');if(JSON.stringify(offsets)!=='[0,100,200,300]')throw new Error('career pagination offsets failed: '+JSON.stringify(offsets));

  const sw1=vm.runInThisContext("swipeTarget('races',-120)"),sw2=vm.runInThisContext("swipeTarget('standings',120)"),edge=vm.runInThisContext("swipeTarget('home',120)");
  if(sw1!=='standings'||sw2!=='races'||edge!==null)throw new Error('swipe route helper failed');

  const weather=vm.runInThisContext("upcomingWeatherSessions({date:'2099-09-10',time:'14:00:00Z',FirstPractice:{date:'2099-09-08',time:'10:00:00Z'},Qualifying:{date:'2099-09-09',time:'14:00:00Z'}}).map(x=>x.key)");
  if(!weather.includes('fp1')||!weather.includes('quali')||!weather.includes('race'))throw new Error('weather session selector failed');

  // Render-level smoke checks using the browser-like DOM stub.
  const rendered=vm.runInThisContext(`(()=>{
    state.loaded=true;state.favouriteDriver='alpha';state.favouriteTeam='Mercedes';
    state.schedule=[
      {season:'2099',round:'1',raceName:'Test GP',date:'2099-09-10',time:'14:00:00Z',Circuit:{circuitId:'monza',circuitName:'Test Circuit',Location:{country:'Italy',locality:'Test',lat:'45',long:'9'}},FirstPractice:{date:'2099-09-08',time:'10:00:00Z'},Qualifying:{date:'2099-09-09',time:'14:00:00Z'}},
      {season:'2099',round:'2',raceName:'Next GP',date:'2099-10-10',time:'14:00:00Z',Circuit:{circuitId:'baku',circuitName:'Next Circuit',Location:{country:'Azerbaijan',locality:'Baku',lat:'40',long:'49'}},FirstPractice:{date:'2099-10-08',time:'10:00:00Z'},Qualifying:{date:'2099-10-09',time:'14:00:00Z'}}
    ];
    state.drivers=[{position:'1',points:'100',wins:'2',Driver:{driverId:'alpha',code:'AAA',familyName:'Alpha'},Constructors:[{name:'Mercedes'}]}];
    state.constructors=[{position:'1',points:'100',wins:'2',Constructor:{name:'Mercedes'}}];
    state.news=[{title:'Story',link:'https://example.test',pubDate:new Date().toISOString(),source:'BBC',sourceId:'BBC'}];
    renderRaces();const races=view.innerHTML;
    renderMore();const more=view.innerHTML;
    renderStandings();const standings=view.innerHTML;
    renderNews();const news=view.innerHTML;
    const weatherHtml=weatherCard(state.schedule[0]);
    return {races,more,standings,news,weatherHtml};
  })()`);
  if(!rendered.races.includes('calendar-overview')||!rendered.races.includes('calendar-race'))throw new Error('race calendar render smoke failed');
  if(rendered.more.includes('>Teams<')||rendered.more.indexOf('My F1')<rendered.more.indexOf('Data Health'))throw new Error('More hierarchy render smoke failed');
  if(rendered.standings.includes('is-favourite')||rendered.standings.includes('★'))throw new Error('standings neutral render smoke failed');
  if(rendered.news.includes('MYF1')||rendered.news.includes('MY F1'))throw new Error('news cleanup render smoke failed');
  if(!rendered.weatherHtml.includes('weather-session-tab')||!rendered.weatherHtml.includes('QUALIFYING'))throw new Error('weather tabs render smoke failed');

  console.log('RUNTIME SMOKE: PASS');
}catch(e){console.error('RUNTIME SMOKE: FAIL',e.stack||e);process.exit(1);}

'use strict';

const YEAR = new Date().getFullYear();
const UK_TZ = 'Europe/London';
const JOLPICA = 'https://api.jolpi.ca/ergast/f1';
const OPENF1 = 'https://api.openf1.org/v1';
const RSS2JSON = 'https://api.rss2json.com/v1/api.json?rss_url=';
const NEWS_SOURCES = [
  {id:'BBC',name:'BBC Sport',feed:'https://feeds.bbci.co.uk/sport/formula1/rss.xml'},
  {id:'AUTOSPORT',name:'Autosport',feed:'https://www.autosport.com/rss/f1/news/'},
  {id:'MOTORSPORT',name:'Motorsport.com',feed:'https://www.motorsport.com/rss/f1/news/'},
  {id:'RACEFANS',name:'RaceFans',feed:'https://www.racefans.net/feed/'},
  {id:'THERACE',name:'The Race',feed:'https://www.the-race.com/category/formula-1/feed/'}
];
const FIA_DOCS = 'https://www.fia.com/documents/formula-1';
const PENALTY_SOURCE = 'https://racingnews365.com/penalty-points-f1-drivers';
const REPRIMAND_SOURCE = 'https://timepenalty.com/guide/reprimand';
const JINA = 'https://r.jina.ai/';
const WIKI_API = 'https://en.wikipedia.org/w/api.php';
const APP_VERSION = '1.6.0';
const STATIC_DRIVER_PHOTOS = {
  lindblad: 'https://commons.wikimedia.org/wiki/Special:FilePath/Arvid_lindblad_Budapest_2026.jpg?width=700'
};

const F1_RECORDS = {
  drivers:[
    ['MOST WORLD TITLES','Lewis Hamilton / Michael Schumacher','7'],
    ['MOST GRAND PRIX WINS','Lewis Hamilton','106'],
    ['MOST POLE POSITIONS','Lewis Hamilton','104'],
    ['MOST PODIUMS','Lewis Hamilton','207'],
    ['MOST GRAND PRIX ENTRIES','Fernando Alonso','439'],
    ['YOUNGEST RACE WINNER','Max Verstappen','18y 228d'],
    ['MOST WINS IN A SEASON','Max Verstappen','19 · 2023'],
    ['MOST CONSECUTIVE WINS','Max Verstappen','10 · 2023']
  ],
  teams:[
    ['MOST CONSTRUCTORS’ TITLES','Ferrari','16'],
    ['MOST GRAND PRIX WINS','Ferrari','251'],
    ['MOST POLE POSITIONS','Ferrari','254'],
    ['MOST PODIUMS','Ferrari','647']
  ],
  milestones:[
    ['OLDEST RACE WINNER','Luigi Fagioli','53y 22d · 1951'],
    ['MOST CONSECUTIVE DRIVER TITLES','Michael Schumacher','5 · 2000–2004'],
    ['FIRST WORLD CHAMPION','Giuseppe Farina','1950'],
    ['FIRST CONSTRUCTORS’ CHAMPION','Vanwall','1958']
  ]
};

const TEAM_COLOURS = {
  'McLaren':'#ff8700','Mercedes':'#00d2be','Ferrari':'#e8002d','Red Bull':'#3671c6','Red Bull Racing':'#3671c6',
  'RB F1 Team':'#6692ff','Racing Bulls':'#6692ff','Aston Martin':'#229971','Williams':'#64c4ff','Haas F1 Team':'#b6babd',
  'Alpine F1 Team':'#ff87bc','Audi':'#f50537','Cadillac F1 Team':'#d6b46c'
};

const CIRCUITS = {
  albert_park:{length:5.278,laps:58,turns:14,first:1996,slug:'albert_park'}, shanghai:{length:5.451,laps:56,turns:16,first:2004,slug:'shanghai'},
  suzuka:{length:5.807,laps:53,turns:18,first:1987,slug:'suzuka'}, miami:{length:5.412,laps:57,turns:19,first:2022,slug:'miami'},
  villeneuve:{length:4.361,laps:70,turns:14,first:1978,slug:'villeneuve'}, monaco:{length:3.337,laps:78,turns:19,first:1950,slug:'monaco'},
  catalunya:{length:4.657,laps:66,turns:14,first:1991,slug:'catalunya'}, red_bull_ring:{length:4.318,laps:71,turns:10,first:1970,slug:'red_bull_ring'},
  silverstone:{length:5.891,laps:52,turns:18,first:1950,slug:'silverstone'}, spa:{length:7.004,laps:44,turns:19,first:1950,slug:'spa'},
  hungaroring:{length:4.381,laps:70,turns:14,first:1986,slug:'hungaroring'}, zandvoort:{length:4.259,laps:72,turns:14,first:1952,slug:'zandvoort'},
  monza:{length:5.793,laps:53,turns:11,first:1950,slug:'monza'}, madring:{length:5.416,laps:57,turns:22,first:2026,f1db:'madring-1.svg'},
  baku:{length:6.003,laps:51,turns:20,first:2016,slug:'baku'}, sepang:{length:5.543,laps:56,turns:15,first:1999,f1db:'sepang-1.svg'},
  marina_bay:{length:4.940,laps:62,turns:19,first:2008,slug:'marina_bay'}, americas:{length:5.513,laps:56,turns:20,first:2012,slug:'americas'},
  rodriguez:{length:4.304,laps:71,turns:17,first:1963,slug:'rodriguez'}, interlagos:{length:4.309,laps:71,turns:15,first:1973,slug:'interlagos'},
  vegas:{length:6.201,laps:50,turns:17,first:2023,slug:'vegas'}, losail:{length:5.419,laps:57,turns:16,first:2021,slug:'losail'},
  yas_marina:{length:5.281,laps:58,turns:16,first:2009,slug:'yas_marina'}
};

const FALLBACK_POINTS = {
  'Oliver Bearman':[[2,'2026-09-07'],[1,'2026-11-08'],[1,'2026-12-07']],
  'Kimi Antonelli':[[1,'2026-09-07'],[1,'2027-07-25']],
  'Franco Colapinto':[[1,'2027-06-14'],[2,'2027-08-23'],[1,'2027-08-23']],
  'Lewis Hamilton':[[1,'2026-11-09']], 'Alex Albon':[[2,'2026-09-21'],[1,'2026-11-23']],
  'Lance Stroll':[[2,'2026-10-18'],[1,'2026-12-07']], 'Liam Lawson':[[1,'2026-11-08'],[1,'2026-12-07'],[1,'2027-08-23']],
  'Carlos Sainz':[[2,'2026-10-26']], 'Arvid Lindblad':[[2,'2027-08-23']], 'Oscar Piastri':[[2,'2026-11-09']],
  'Gabriel Bortoleto':[[2,'2026-11-23']], 'Esteban Ocon':[[1,'2026-09-07']], 'Yuki Tsunoda':[[2,'2026-11-09'],[1,'2026-12-07']]
};
const FALLBACK_REPRIMANDS = {'Gabriel Bortoleto':1,'Oliver Bearman':1,'Alex Albon':2,'Nico Hulkenberg':1,'Carlos Sainz':1,'Lewis Hamilton':1,'Kimi Antonelli':1,'Sergio Perez':2,'Liam Lawson':1,'George Russell':1};

const state = {
  route:'home', schedule:[], drivers:[], constructors:[], photos:{}, wikiPhotos:{}, news:[], newsSource:'ALL', spoilerNewsRevealedRound:null, standingsSpoilerRevealedRound:null,
  penaltyPoints:{...FALLBACK_POINTS}, reprimands:{...FALLBACK_REPRIMANDS}, stewardDocs:{}, historyYear:YEAR-1, historyCache:{}, carUpdateDocs:{},
  loaded:false, refreshing:false, installPrompt:window.__f1InstallPrompt||null, justInstalled:false, countdownTimer:null, dataStamp:null, raceWinners:{}, raceHistory:null
};
const view = document.getElementById('view');

function esc(v=''){ return String(v).replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c])); }
function sleep(ms){ return new Promise(r=>setTimeout(r,ms)); }
function teamColour(name){ return TEAM_COLOURS[name] || '#777'; }
function fullName(d){ return [d?.givenName,d?.familyName].filter(Boolean).join(' '); }
function driverCode(d){ return d?.code || d?.familyName?.slice(0,3).toUpperCase() || '---'; }
function flag(country){
  const m={'Australia':'🇦🇺','China':'🇨🇳','Japan':'🇯🇵','USA':'🇺🇸','United States':'🇺🇸','Canada':'🇨🇦','Monaco':'🇲🇨','Spain':'🇪🇸','Austria':'🇦🇹','UK':'🇬🇧','Great Britain':'🇬🇧','Belgium':'🇧🇪','Hungary':'🇭🇺','Netherlands':'🇳🇱','Italy':'🇮🇹','Azerbaijan':'🇦🇿','Malaysia':'🇲🇾','Singapore':'🇸🇬','Mexico':'🇲🇽','Brazil':'🇧🇷','Qatar':'🇶🇦','UAE':'🇦🇪','United Arab Emirates':'🇦🇪'};
  return m[country]||'🏁';
}
function fmtDate(iso, opts={weekday:'short',day:'numeric',month:'short'}){ if(!iso)return '—'; return new Intl.DateTimeFormat('en-GB',{timeZone:UK_TZ,...opts}).format(new Date(iso)); }
function fmtTime(iso){ if(!iso)return '—'; return new Intl.DateTimeFormat('en-GB',{timeZone:UK_TZ,hour:'2-digit',minute:'2-digit',hour12:false}).format(new Date(iso)); }
function fmtDateTime(iso){ return `${fmtDate(iso)} · ${fmtTime(iso)}`; }
function isoOf(x){ if(!x?.date)return null; return `${x.date}T${x.time||'12:00:00Z'}`; }
function raceIso(r){ return `${r.date}T${r.time||'12:00:00Z'}`; }
function age(dob){ if(!dob)return '—'; const d=new Date(dob+'T12:00:00Z'),n=new Date(); let a=n.getUTCFullYear()-d.getUTCFullYear(); if(n.getUTCMonth()<d.getUTCMonth()||(n.getUTCMonth()===d.getUTCMonth()&&n.getUTCDate()<d.getUTCDate()))a--; return a; }
function toast(msg){ const el=document.getElementById('toast'); el.textContent=msg; el.classList.add('show'); setTimeout(()=>el.classList.remove('show'),1800); }
function cacheGet(key,maxAge){ try{const x=JSON.parse(localStorage.getItem('f1hub:'+key)); if(!x)return null;if(maxAge && Date.now()-x.t>maxAge)return null;return x.v;}catch{return null;} }
function cachePut(key,v){ try{localStorage.setItem('f1hub:'+key,JSON.stringify({t:Date.now(),v}));}catch{} return v; }
async function fetchJSON(url,key,maxAge=15*60e3){
  const fresh=cacheGet(key,maxAge); if(fresh)return fresh;
  try{const c=new AbortController();const t=setTimeout(()=>c.abort(),14000);const r=await fetch(url,{signal:c.signal});clearTimeout(t);if(!r.ok)throw new Error(`${r.status}`);return cachePut(key,await r.json());}
  catch(e){const old=cacheGet(key);if(old)return old;throw e;}
}
async function fetchText(url,key,maxAge=30*60e3){
  const fresh=cacheGet(key,maxAge); if(fresh)return fresh;
  try{const c=new AbortController();const t=setTimeout(()=>c.abort(),15000);const r=await fetch(url,{signal:c.signal});clearTimeout(t);if(!r.ok)throw new Error(`${r.status}`);return cachePut(key,await r.text());}
  catch(e){const old=cacheGet(key);if(old)return old;throw e;}
}
function sessions(r){
  const raw=[
    ['fp1','FP1','Practice 1',r.FirstPractice],
    ['fp2','FP2','Practice 2',r.SecondPractice],
    ['fp3','FP3','Practice 3',r.ThirdPractice],
    ['sprintq','SPRINT QUALI','Sprint Qualifying',r.SprintQualifying],
    ['sprint','SPRINT','Sprint',r.Sprint],
    ['quali','QUALIFYING','Qualifying',r.Qualifying],
    ['race','RACE','Race',{date:r.date,time:r.time}]
  ];
  return raw.filter(([, , ,x])=>x?.date).map(([key,name,openName,x])=>({key,name,openName,iso:isoOf(x)})).sort((a,b)=>new Date(a.iso)-new Date(b.iso));
}
function sessionExpectedMinutes(s){
  if(s.key==='race')return 240;
  if(s.key==='sprint')return 120;
  if(s.key==='quali'||s.key==='sprintq')return 105;
  return 90;
}
function sessionIsDone(s){return Date.now()>=new Date(s.iso).getTime()+sessionExpectedMinutes(s)*60000;}
function sessionIsLive(s){const t=new Date(s.iso).getTime();return Date.now()>=t&&!sessionIsDone(s);}
function currentRace(){
  const now=Date.now(); return state.schedule.find(r=>{const ss=sessions(r);const start=new Date(ss[0]?.iso||raceIso(r)).getTime()-12*3600e3;const end=new Date(raceIso(r)).getTime()+5*3600e3;return now>=start&&now<=end;}) || state.schedule.find(r=>new Date(raceIso(r)).getTime()+5*3600e3>now) || state.schedule.at(-1);
}
function nextSession(r){ const now=Date.now(); return sessions(r).find(s=>new Date(s.iso).getTime()>now) || null; }
function raceStatus(r){ const now=Date.now(),t=new Date(raceIso(r)).getTime(); if(t+5*3600e3<now)return 'DONE'; if(currentRace()?.round===r.round)return 'NEXT'; return 'UPCOMING'; }
function ukDateKey(value){
  const parts=new Intl.DateTimeFormat('en-GB',{timeZone:UK_TZ,year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(new Date(value));
  const m=Object.fromEntries(parts.map(x=>[x.type,x.value]));return `${m.year}-${m.month}-${m.day}`;
}
function spoilerRace(){
  const today=ukDateKey(new Date());
  return state.schedule.find(r=>{const ss=sessions(r);if(!ss.length)return false;const first=ukDateKey(ss[0].iso),raceDay=ukDateKey(raceIso(r));return today>=first&&today<=raceDay;})||null;
}
function spoilerActive(){return !!spoilerRace();}
function isSpoilerRace(r){const x=spoilerRace();return !!x&&String(x.round)===String(r?.round);}
function raceSessionDone(r){const rs=sessions(r).find(x=>x.key==='race');return !!rs&&sessionIsDone(rs);}
function revealNewsSpoilers(){const sr=spoilerRace();state.spoilerNewsRevealedRound=sr?String(sr.round):null;renderNews();}
function revealStandingsSpoilers(){const sr=spoilerRace();state.standingsSpoilerRevealedRound=sr?String(sr.round):null;renderStandings();}
function newsSpoilersRevealed(){const sr=spoilerRace();return !!sr&&state.spoilerNewsRevealedRound===String(sr.round);}
function standingsSpoilersRevealed(){const sr=spoilerRace();return !!sr&&state.standingsSpoilerRevealedRound===String(sr.round);}
window.revealNewsSpoilers=revealNewsSpoilers;window.revealStandingsSpoilers=revealStandingsSpoilers;

function circuitSvg(id){ const c=CIRCUITS[id]; if(!c)return null; if(c.f1db)return `https://raw.githubusercontent.com/f1db/f1db/main/src/assets/circuits/white/${c.f1db}`; return c.slug?`https://raw.githubusercontent.com/MasterPlay007/F1-Track-Layouts-SVG/main/${c.slug}.svg`:null; }
function radarUrl(r){ const l=r.Circuit.Location; return `https://www.windy.com/-Weather-radar-radar?radar,${Number(l.lat).toFixed(4)},${Number(l.long).toFixed(4)},9`; }
function radarEmbedUrl(r){ const l=r.Circuit.Location; const q=new URLSearchParams({type:'map',location:'coordinates',metricRain:'mm',metricTemp:'°C',metricWind:'km/h',zoom:'8',overlay:'radar',product:'radar',level:'surface',lat:String(l.lat),lon:String(l.long),detailLat:String(l.lat),detailLon:String(l.long),message:'true',marker:'true'}); return `https://embed.windy.com/embed.html?${q.toString()}`; }
function isStandalone(){ return window.matchMedia('(display-mode: standalone)').matches || window.matchMedia('(display-mode: fullscreen)').matches || window.navigator.standalone===true; }
function wikiTitle(d){ try{ return decodeURIComponent(new URL(d?.url||'').pathname.split('/').pop()||'').replaceAll('_',' '); }catch{return '';} }
async function loadWikipediaPhotos(force=false){
  const wanted=state.drivers.map(s=>({id:s.Driver.driverId,title:wikiTitle(s.Driver)})).filter(x=>x.title); if(!wanted.length)return;
  const key=`wiki-photos-${YEAR}`; if(force)localStorage.removeItem('f1hub:'+key);
  const qs=new URLSearchParams({action:'query',format:'json',origin:'*',prop:'pageimages',piprop:'thumbnail',pithumbsize:'700',redirects:'1',titles:wanted.map(x=>x.title).join('|')});
  try{const j=await fetchJSON(`${WIKI_API}?${qs.toString()}`,key,force?1:24*3600e3);const pages=Object.values(j?.query?.pages||{});const byTitle=Object.fromEntries(pages.filter(x=>x.thumbnail?.source).map(x=>[x.title,x.thumbnail.source]));state.wikiPhotos=Object.fromEntries(wanted.map(x=>[x.id,byTitle[x.title]]).filter(([,v])=>v));}catch{}
}
function driverPhotoUrls(s){ const d=s?.Driver||s; const of=state.photos[driverCode(d)]?.headshot_url; const wiki=state.wikiPhotos[d?.driverId]; const special=/lindblad/i.test(`${d?.driverId||''} ${d?.givenName||''} ${d?.familyName||''}`)?STATIC_DRIVER_PHOTOS.lindblad:null; return [...new Set([special,of,wiki].filter(Boolean))]; }
function driverPhotoError(img){ const fb=img.dataset.fallback; if(fb){img.dataset.fallback='';img.src=fb;return;} const holder=img.closest('.driver-photo-holder, .profile-photo-holder'); if(holder){holder.innerHTML=`<div class="avatar ${holder.classList.contains('profile-photo-holder')?'profile-avatar':''}">${esc(img.dataset.code||'---')}</div>`;} else {img.style.display='none';} }
window.driverPhotoError=driverPhotoError;

async function loadNewsSources(force=false){
  if(force)NEWS_SOURCES.forEach(src=>localStorage.removeItem('f1hub:news-'+src.id));
  const items=[];
  for(const src of NEWS_SOURCES){
    try{
      const j=await fetchJSON(RSS2JSON+encodeURIComponent(src.feed),'news-'+src.id,force?1:10*60e3);
      if(j?.status==='ok')for(const n of (j.items||[]).slice(0,18))items.push({...n,source:src.name,sourceId:src.id});
    }catch{}
    await sleep(90);
  }
  const seen=new Set();
  state.news=items.sort((a,b)=>new Date(b.pubDate||0)-new Date(a.pubDate||0)).filter(n=>{const k=(n.link||n.title||'').replace(/\?.*$/,'').toLowerCase();if(!k||seen.has(k))return false;seen.add(k);return true;}).slice(0,80);
  return state.news;
}

async function loadBase(force=false){
  state.refreshing=true; if(force){['schedule','drivers','constructors','photos','wiki-photos-'+YEAR].forEach(k=>localStorage.removeItem('f1hub:'+k));}
  try{
    const newsPromise=loadNewsSources(force);
    const [sched,ds,cs,of1] = await Promise.allSettled([
      fetchJSON(`${JOLPICA}/${YEAR}/?limit=100`,'schedule',force?1:30*60e3),
      fetchJSON(`${JOLPICA}/${YEAR}/driverstandings/?limit=100`,'drivers',force?1:15*60e3),
      fetchJSON(`${JOLPICA}/${YEAR}/constructorstandings/?limit=100`,'constructors',force?1:15*60e3),
      fetchJSON(`${OPENF1}/drivers?session_key=latest`,'photos',force?1:6*3600e3)
    ]);
    if(sched.status==='fulfilled')state.schedule=sched.value?.MRData?.RaceTable?.Races||[];
    if(ds.status==='fulfilled')state.drivers=ds.value?.MRData?.StandingsTable?.StandingsLists?.[0]?.DriverStandings||[];
    if(cs.status==='fulfilled')state.constructors=cs.value?.MRData?.StandingsTable?.StandingsLists?.[0]?.ConstructorStandings||[];
    if(of1.status==='fulfilled')state.photos=Object.fromEntries((of1.value||[]).filter(x=>x.name_acronym).map(x=>[x.name_acronym,x]));
    await Promise.allSettled([newsPromise,loadWikipediaPhotos(force)]);
    state.loaded=true;state.dataStamp=new Date();
  } finally { state.refreshing=false; render(); }
  refreshPenaltyData();
  preloadRaceWinners(force);
}

async function refreshPenaltyData(){
  try{
    const text=await fetchText(JINA+PENALTY_SOURCE,'penalty-source',60*60e3);
    const parsed=parsePenaltyText(text); if(Object.keys(parsed).length)state.penaltyPoints=parsed;
  }catch{}
  try{
    const text=await fetchText(JINA+REPRIMAND_SOURCE,'reprimand-source',60*60e3);
    const parsed=parseReprimands(text); if(Object.keys(parsed).length)state.reprimands=parsed;
  }catch{}
  if(state.route==='penalties')render();
}
function parsePenaltyText(text){
  const out={}; const lines=text.split('\n');
  for(const line of lines){
    if(!line.includes('|')||!/\d+\s*\(/.test(line))continue;
    const parts=line.split('|').map(s=>s.trim()).filter(Boolean); if(parts.length<3)continue;
    let name=parts[0].replace(/\*+/g,'').trim(); if(!/[A-Za-z]/.test(name)||name.toLowerCase().includes('driver'))continue;
    name=name.replace('Alexander Albon','Alex Albon').replace('Nico Hülkenberg','Nico Hulkenberg').replace('Sergio Pérez','Sergio Perez');
    const ev=[]; const rx=/(\d+)\s*\((January|February|March|April|May|June|July|August|September|October|November|December)\s+(\d{1,2}),\s*(\d{4})\)/g; let m;
    while((m=rx.exec(line))){ const dt=new Date(`${m[2]} ${m[3]}, ${m[4]} 12:00:00 UTC`); ev.push([Number(m[1]),dt.toISOString().slice(0,10)]); }
    if(ev.length)out[name]=ev;
  }
  return out;
}
function parseReprimands(text){
  // timepenalty's guide contains every reprimand from multiple seasons.
  // Reprimands are championship/season-specific, so only count entries whose
  // preceding record date belongs to the current season. Penalty points are
  // handled separately because they use a rolling 12-month window.
  const map={};
  const names=state.drivers.map(x=>fullName(x.Driver));
  const lines=String(text||'').split(/\r?\n/);
  let recordYear=null;
  for(const line of lines){
    const dm=line.match(/\b(20\d{2})-\d{2}-\d{2}\b/);
    if(dm)recordYear=Number(dm[1]);
    const rm=line.match(/Reprimand:\s*([A-Za-zÀ-ÖØ-öø-ÿ'-]+)/i);
    if(!rm || recordYear!==YEAR)continue;
    const sn=rm[1].toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu,'');
    const full=names.find(n=>n.split(' ').at(-1).toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu,'')===sn);
    if(full)map[full]=(map[full]||0)+1;
  }
  return map;
}

function parentNav(route){ if(route==='home'||route==='races'||route==='standings'||route==='news'||route==='more')return route; if(route.startsWith('race:')||route.startsWith('session:')||route.startsWith('telemetry:')||route.startsWith('carupdates:')||route.startsWith('circuit:')||route.startsWith('radar:'))return 'races'; return 'more'; }
function setRoute(route,push=true){ if(!route)return; state.route=route; if(push && location.hash!==`#${encodeURIComponent(route)}`)history.pushState({route},'',`#${encodeURIComponent(route)}`); window.scrollTo({top:0,behavior:'instant'}); const parent=parentNav(route);document.querySelectorAll('.nav-btn').forEach(b=>b.classList.toggle('active',parent===b.dataset.route)); render(); }
function render(){
  clearInterval(state.countdownTimer);
  view.classList.remove('view-enter');
  void view.offsetWidth;
  view.classList.add('view-enter');
  if(!state.loaded){view.innerHTML='<div class="loader">Loading F1 Hub…</div>';return;}
  const r=state.route;
  if(r==='home')return renderHome(); if(r==='races')return renderRaces(); if(r==='standings')return renderStandings(); if(r==='news')return renderNews(); if(r==='more')return renderMore();
  if(r.startsWith('race:'))return renderRaceDetail(r.split(':')[1]); if(r.startsWith('session:')){const [,round,key]=r.split(':');return renderSessionResult(round,key);} if(r.startsWith('telemetry:')){const [,round,key]=r.split(':');return renderTelemetry(round,key);} if(r.startsWith('carupdates:'))return renderCarUpdates(r.split(':')[1]); if(r.startsWith('driver:'))return renderDriver(r.slice(7)); if(r.startsWith('circuit:'))return renderCircuit(r.split(':')[1]); if(r.startsWith('radar:'))return renderRadar(r.split(':')[1]); if(r.startsWith('stewarddoc:'))return renderStewardDoc(r.slice(11));
  if(r.startsWith('historyrace:')){const [,y,round]=r.split(':');return renderHistoryRace(y,round);} if(r.startsWith('history:'))return renderHistory(r.split(':')[1]);
  if(r==='drivers')return renderDrivers(); if(r==='teams')return renderTeams(); if(r==='circuits')return renderCircuits(); if(r==='penalties')return renderPenalties(); if(r==='battles')return renderBattles(); if(r==='stewards')return renderStewards(); if(r==='stats')return renderStats(); if(r==='compare')return renderCompare(); if(r==='history')return renderHistory(); if(r==='records')return renderRecords(); if(r==='updates')return renderUpdates();
  renderHome();
}
function titleBlock(eyebrow,title,right=''){ return `<div class="section-head"><div><div class="eyebrow">${esc(eyebrow)}</div><h1>${esc(title)}</h1></div>${right}</div>`; }
function spoilerPill(){return spoilerActive()?'<span class="pill spoiler">SPOILER MODE</span>':'';}

function countdownHtml(iso){ return `<div class="countdown" data-countdown="${esc(iso)}"><div class="count-cell"><b data-c="d">00</b><small>DAYS</small></div><div class="count-cell"><b data-c="h">00</b><small>HOURS</small></div><div class="count-cell"><b data-c="m">00</b><small>MIN</small></div><div class="count-cell"><b data-c="s">00</b><small>SEC</small></div></div>`; }
function startCountdown(){ const el=document.querySelector('[data-countdown]'); if(!el)return; const tick=()=>{let d=Math.max(0,new Date(el.dataset.countdown)-new Date()),days=Math.floor(d/864e5);d%=864e5;let h=Math.floor(d/36e5);d%=36e5;let m=Math.floor(d/6e4);let s=Math.floor((d%6e4)/1000);[['d',days],['h',h],['m',m],['s',s]].forEach(([k,v])=>{const x=el.querySelector(`[data-c="${k}"]`);if(x)x.textContent=String(v).padStart(2,'0');});};tick();state.countdownTimer=setInterval(tick,1000); }
function standingsMini(){ return state.drivers.slice(0,3).map(s=>standingRow(s)).join(''); }
function standingRow(s){ const team=s.Constructors?.at(-1)?.name||'';return `<div class="standing-row"><div class="pos">${esc(s.position)}</div><div class="driver-line"><i class="team-dot" style="background:${teamColour(team)}"></i><div><div class="driver-name">${esc(driverCode(s.Driver))} · ${esc(s.Driver.familyName)}</div><div class="driver-meta">${esc(team)} · ${esc(s.wins)} wins</div></div></div><div class="points">${esc(s.points)}<small>PTS</small></div></div>`; }
function sessionRows(r){
  const ns=nextSession(r);
  return sessions(r).map(s=>{
    const done=sessionIsDone(s),live=sessionIsLive(s),next=!live&&!done&&ns?.iso===s.iso;
    const cls=['session-row',next?'next':'',done?'done clickable':'',live?'live':''].filter(Boolean).join(' ');
    const action=done?` onclick="setRoute('session:${r.round}:${s.key}')" role="button" tabindex="0" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();setRoute('session:${r.round}:${s.key}')}"`:'';
    const stateLabel=done?(isSpoilerRace(r)?'VIEW RESULTS ›':'RESULT ›'):live?'LIVE':next?'NEXT':'';
    return `<div class="${cls}"${action}><div><div class="session-name">${esc(s.name)}</div><div class="day">${fmtDate(s.iso,{weekday:'short',day:'numeric',month:'short'})}</div></div><div class="clock">${fmtTime(s.iso)}</div><div class="state">${stateLabel}</div></div>`;
  }).join('');
}

function renderHome(){
  const r=currentRace(); if(!r){view.innerHTML='<div class="empty">No race calendar available.</div>';return;} const ns=nextSession(r); const isWeekend=raceStatus(r)==='NEXT',spoilers=spoilerActive();
  const hideChamp=spoilers&&raceSessionDone(r)&&!standingsSpoilersRevealed();
  view.innerHTML=`
    <section class="hero"><div class="hero-top"><span class="pill ${isWeekend?'live':'subtle'}">${isWeekend?'RACE WEEKEND':'NEXT ROUND'}</span><span>${spoilers?spoilerPill():''} ${flag(r.Circuit.Location.country)} ROUND ${esc(r.round)}</span></div>
      <h1>${esc(r.raceName.toUpperCase())}</h1><div class="circuit">${esc(r.Circuit.circuitName)} · ${esc(r.Circuit.Location.locality)}</div>
      ${ns?`<div class="next-session"><div class="label">NEXT SESSION</div><div class="name">${esc(ns.name)}</div><div class="time">${fmtDateTime(ns.iso)} · UK</div></div>${countdownHtml(ns.iso)}`:`<div class="next-session"><div class="name">Race weekend complete</div></div>`}
    </section>
    <div class="grid desktop-two"><div>
      ${titleBlock('WEEKEND','Schedule')}<div class="schedule-list">${sessionRows(r)}</div>
      <div class="spacer"></div><div class="actions"><button class="external-btn red" onclick="setRoute('race:${r.round}')">RACE HUB</button><button class="external-btn" onclick="setRoute('radar:${r.round}')">RAIN RADAR</button></div>
    </div><div>
      ${titleBlock('CHAMPIONSHIP','Top 3')}<div class="card">${hideChamp?`<div class="spoiler-cover"><div class="eyebrow">SPOILER PROTECTED</div><div class="card-title">Updated standings hidden until tomorrow</div><button class="external-btn" onclick="revealStandingsSpoilers()">REVEAL STANDINGS</button></div>`:standingsMini()}</div>
      <div class="spacer"></div>${weatherCard(r)}
      <div class="spacer"></div>${latestHeadline()}
    </div></div>`;
  startCountdown(); loadWeatherIntoCard(r);
}
function latestHeadline(){
  const n=state.news[0]; if(!n)return `<div class="card"><div class="card-title">Latest news</div><div class="muted" style="margin-top:7px">News feed unavailable.</div></div>`;
  if(spoilerActive()&&!newsSpoilersRevealed())return `<div class="card"><div class="eyebrow">LATEST NEWS · ${esc(n.source||'F1')}</div><div class="card-title" style="margin-top:6px">Headline hidden by Spoiler Mode</div><div class="news-meta">${fmtNewsTime(n.pubDate)}</div><div class="spacer"></div><button class="external-btn" onclick="setRoute('news')">OPEN NEWS</button></div>`;
  return `<a class="card clickable news-link" href="${esc(n.link)}" target="_blank" rel="noopener"><div class="eyebrow">LATEST NEWS</div><div class="card-title" style="margin-top:6px">${esc(n.title)}</div><div class="news-meta">${esc((n.source||'F1').toUpperCase())} · ${fmtNewsTime(n.pubDate)}</div></a>`;
}
function weatherCard(r){return `<div id="weather-card" class="card"><div class="eyebrow">RACE WEATHER</div><div class="stat-big">—</div><div class="muted">Checking forecast…</div></div>`;}
async function loadWeatherIntoCard(r){
  const el=document.getElementById('weather-card');if(!el)return;try{const l=r.Circuit.Location;const url=`https://api.open-meteo.com/v1/forecast?latitude=${l.lat}&longitude=${l.long}&hourly=temperature_2m,precipitation_probability,weather_code,wind_speed_10m&timezone=${encodeURIComponent(UK_TZ)}&forecast_days=16`;const w=await fetchJSON(url,`weather-${r.Circuit.circuitId}`,30*60e3);const target=new Date(raceIso(r));const times=w.hourly?.time||[];let i=times.reduce((best,x,j)=>Math.abs(new Date(x)-target)<Math.abs(new Date(times[best]||0)-target)?j:best,0);if(!times.length||Math.abs(new Date(times[i])-target)>20*3600e3){el.innerHTML='<div class="eyebrow">RACE WEATHER</div><div class="card-title" style="margin-top:7px">Forecast not available yet</div><div class="muted" style="margin-top:5px">Weather appears when the race is inside the forecast window.</div>';return;}const temp=Math.round(w.hourly.temperature_2m?.[i]??0),rain=w.hourly.precipitation_probability?.[i]??0,wind=Math.round(w.hourly.wind_speed_10m?.[i]??0);el.innerHTML=`<div class="eyebrow">RACE WEATHER</div><div class="stat-big">${temp}°C</div><div class="muted">Rain ${rain}% · Wind ${wind} km/h</div>`;}catch{el.innerHTML='<div class="eyebrow">RACE WEATHER</div><div class="muted" style="margin-top:7px">Forecast unavailable.</div>';}
}

function renderRaces(){
  view.innerHTML=titleBlock(`${YEAR} SEASON`,'Race Calendar',spoilerPill())+`<div class="grid">${state.schedule.map(r=>{
    const status=raceStatus(r),w=raceWinner(r),hideWinner=status==='DONE'&&isSpoilerRace(r);
    const outcome=status==='DONE'?(hideWinner?`<div class="winner-label spoiler-result"><small>SPOILER</small><b>HIDDEN</b></div>`:(w?`<div class="winner-label"><small>WINNER</small><b>${esc((w.Driver?.familyName||driverCode(w.Driver)).toUpperCase())}</b></div>`:`<div class="done">RESULT</div>`)):`<div class="${status.toLowerCase()}">${status}</div>`;
    return `<div class="card clickable race-card" onclick="setRoute('race:${r.round}')"><div class="round-box"><small>ROUND</small><b>${esc(r.round)}</b></div><div><div class="race-name">${flag(r.Circuit.Location.country)} ${esc(r.raceName)}</div><div class="race-place">${esc(r.Circuit.circuitName)}</div></div><div class="date-chip"><div>${fmtDate(raceIso(r),{day:'numeric',month:'short'})}</div>${outcome}</div></div>`;
  }).join('')}</div>`;
  if(!state.raceHistory)preloadRaceWinners(false);
}
function renderStandings(){
  const sr=spoilerRace(),guard=spoilerActive()&&sr&&raceSessionDone(sr)&&!standingsSpoilersRevealed();
  if(guard){view.innerHTML=titleBlock(`${YEAR} CHAMPIONSHIP`,'Standings',spoilerPill())+`<div class="card spoiler-guard"><div class="eyebrow">SPOILER PROTECTED</div><div class="card-title">Post-race standings are hidden until tomorrow</div><div class="muted">You can reveal them now if you already know the race result.</div><div class="spacer"></div><button class="external-btn red" onclick="revealStandingsSpoilers()">REVEAL STANDINGS</button></div>`;return;}
  view.innerHTML=titleBlock(`${YEAR} CHAMPIONSHIP`,'Standings',spoilerPill())+`<div class="tabs"><button class="tab active" data-stand="drivers">DRIVERS</button><button class="tab" data-stand="constructors">CONSTRUCTORS</button></div><div id="stand-list" class="card">${state.drivers.map(standingRow).join('')}</div>`;
  document.querySelectorAll('[data-stand]').forEach(b=>b.onclick=()=>{document.querySelectorAll('[data-stand]').forEach(x=>x.classList.remove('active'));b.classList.add('active');const el=document.getElementById('stand-list');el.innerHTML=b.dataset.stand==='drivers'?state.drivers.map(standingRow).join(''):state.constructors.map(c=>`<div class="standing-row"><div class="pos">${esc(c.position)}</div><div class="driver-line"><i class="team-dot" style="background:${teamColour(c.Constructor.name)}"></i><div><div class="driver-name">${esc(c.Constructor.name)}</div><div class="driver-meta">${esc(c.wins)} wins</div></div></div><div class="points">${esc(c.points)}<small>PTS</small></div></div>`).join('');});
}
function fmtNewsTime(d){ if(!d)return ''; const x=new Date(d),mins=Math.round((Date.now()-x)/60000);if(mins<60)return `${Math.max(1,mins)}m`;if(mins<1440)return `${Math.floor(mins/60)}h`;return fmtDate(x.toISOString()); }
function renderNews(){
  const guard=spoilerActive()&&!newsSpoilersRevealed();
  const sourceIds=['ALL',...NEWS_SOURCES.map(x=>x.id)];
  if(!sourceIds.includes(state.newsSource))state.newsSource='ALL';
  const filtered=state.newsSource==='ALL'?state.news:state.news.filter(n=>n.sourceId===state.newsSource);
  const tabs=`<div class="news-source-tabs">${sourceIds.map(id=>{const x=NEWS_SOURCES.find(s=>s.id===id);return `<button class="tab ${state.newsSource===id?'active':''}" data-news-source="${id}">${id==='ALL'?'ALL':esc(x?.name||id)}</button>`;}).join('')}</div>`;
  const reveal=guard?`<div class="card spoiler-guard"><div class="eyebrow">SPOILER MODE</div><div class="card-title">Headlines are hidden during the current race weekend</div><div class="muted">Article sources and times remain visible. Spoiler Mode switches off automatically the day after the race.</div><div class="spacer"></div><button class="external-btn red" onclick="revealNewsSpoilers()">REVEAL HEADLINES</button></div><div class="spacer"></div>`:'';
  const cards=filtered.length?filtered.map(n=>guard?`<div class="card news-card spoiler-news-card"><div class="news-body"><div class="news-title">SPOILER HIDDEN</div><div class="news-meta">${esc((n.source||'F1').toUpperCase())} · ${fmtNewsTime(n.pubDate)}</div></div></div>`:`<a class="card news-card news-link" href="${esc(n.link)}" target="_blank" rel="noopener">${n.thumbnail?`<img class="news-img" src="${esc(n.thumbnail)}" alt="" loading="lazy">`:''}<div class="news-body"><div class="news-title">${esc(n.title)}</div><div class="news-meta">${esc((n.source||'F1').toUpperCase())} · ${fmtNewsTime(n.pubDate)}</div></div></a>`).join(''):'<div class="empty">No stories from this source right now.</div>';
  view.innerHTML=titleBlock('MULTI-SOURCE','Latest News',spoilerPill())+tabs+reveal+`<div class="grid news-grid">${cards}</div>`;
  document.querySelectorAll('[data-news-source]').forEach(b=>b.onclick=()=>{state.newsSource=b.dataset.newsSource;renderNews();});
}
function renderMore(){ const installed=isAppInstalled(); const canInstall=!!state.installPrompt; const install=!installed?(canInstall?`<div class="spacer"></div><div class="card app-mode-card"><div><div class="eyebrow">INSTALL APP</div><div class="card-title" style="margin-top:5px">Install F1 Hub</div><div class="muted" style="margin-top:5px">Adds F1 Hub to Android with its own icon and no browser address bar.</div></div><button id="install-btn" class="external-btn red">↓ INSTALL</button></div>`:`<div class="spacer"></div><div class="card app-mode-card"><div><div class="eyebrow">APP INSTALL</div><div class="card-title" style="margin-top:5px">Install option is preparing</div><div class="muted" style="margin-top:5px">Refresh once if this remains here. If Chrome still does not expose the install prompt, use ⋮ → Install and create shortcut → Install.</div></div></div>`):''; view.innerHTML=titleBlock('F1 HUB','Explore')+`<div class="menu-grid">
  ${menu('👤','Drivers','Profiles, photos & season stats','drivers')}${menu('🏎','Teams','Constructors & points','teams')}${menu('🗺','Circuits','Layouts & track facts','circuits')}${menu('🟨','Penalty Points','Licence points & reprimands','penalties')}
  ${menu('⚔️','Teammate Battles','Qualifying & race H2H','battles')}${menu('🚨','Stewards','Latest FIA decisions','stewards')}${menu('📊','Season Stats','Wins, podiums & DNFs','stats')}${menu('↔','Driver Compare','Compare two drivers','compare')}
  ${menu('🛠️','Car Development','Race-by-race technical updates','updates')}${menu('🕰️','F1 History','Seasons & race results','history')}${menu('🏅','F1 Records','All-time records & milestones','records')}
  </div>${install}<div class="source-note">F1 Hub v${APP_VERSION} · Personal unofficial Formula 1 companion. Live/current data comes from free public sources and is cached locally.</div>`;
  document.getElementById('install-btn')?.addEventListener('click',requestInstall);
}
function menu(icon,title,sub,route){return `<div class="menu-card" onclick="setRoute('${route}')"><div class="icon">${icon}</div><b>${esc(title)}</b><small>${esc(sub)}</small></div>`;}

function renderDrivers(){ view.innerHTML=titleBlock(`${YEAR} GRID`,'Drivers')+`<div class="driver-grid">${state.drivers.map(s=>driverCard(s)).join('')}</div>`; }
function driverCard(s){ const team=s.Constructors?.at(-1)?.name||'',imgs=driverPhotoUrls(s),img=imgs[0],fb=imgs[1]||'';return `<div class="card driver-card clickable" onclick="setRoute('driver:${s.Driver.driverId}')"><i class="team-strip" style="background:${teamColour(team)}"></i><div class="driver-photo-holder">${img?`<img class="driver-photo" src="${esc(img)}" data-fallback="${esc(fb)}" data-code="${esc(driverCode(s.Driver))}" onerror="driverPhotoError(this)" alt="${esc(fullName(s.Driver))}" loading="lazy">`:`<div class="avatar">${esc(driverCode(s.Driver))}</div>`}</div><div class="driver-copy"><div class="driver-code">#${esc(s.Driver.permanentNumber||'—')} · ${esc(driverCode(s.Driver))}</div><div class="driver-full">${esc(fullName(s.Driver))}</div><div class="driver-bottom"><span>${esc(team)}</span><span><b>${esc(s.points)}</b> pts</span></div></div></div>`; }
function renderDriver(id){ const s=state.drivers.find(x=>x.Driver.driverId===id);if(!s)return setRoute('drivers');const d=s.Driver,team=s.Constructors?.at(-1)?.name||'',imgs=driverPhotoUrls(s),img=imgs[0],fb=imgs[1]||'';view.innerHTML=`<div class="actions"><button class="external-btn" onclick="history.length>1?history.back():setRoute('drivers')">← DRIVERS</button></div><div class="spacer"></div><div class="card" style="overflow:hidden"><div style="display:grid;grid-template-columns:1fr 1fr;align-items:end;background:linear-gradient(135deg,#181818,#0d0d0d);border-left:6px solid ${teamColour(team)}"><div style="padding:20px"><div class="eyebrow">#${esc(d.permanentNumber||'—')} · ${esc(driverCode(d))}</div><h1 style="font-size:34px;margin:6px 0">${esc(fullName(d))}</h1><div class="muted">${esc(d.nationality)} · ${esc(team)}</div></div><div class="profile-photo-holder">${img?`<img src="${esc(img)}" data-fallback="${esc(fb)}" data-code="${esc(driverCode(d))}" onerror="driverPhotoError(this)" alt="${esc(fullName(d))}">`:`<div class="avatar profile-avatar">${esc(driverCode(d))}</div>`}</div></div><div style="padding:14px"><div class="facts"><div class="fact"><b>${esc(s.position)}</b><small>CHAMP POS</small></div><div class="fact"><b>${esc(s.points)}</b><small>POINTS</small></div><div class="fact"><b>${esc(s.wins)}</b><small>WINS</small></div><div class="fact"><b>${age(d.dateOfBirth)}</b><small>AGE</small></div><div class="fact"><b>${fmtDate(d.dateOfBirth+'T12:00:00Z',{day:'numeric',month:'short',year:'numeric'})}</b><small>BORN</small></div><div class="fact"><b>${esc(d.nationality)}</b><small>NATIONALITY</small></div></div><div class="spacer"></div><div class="actions"><a class="external-btn" href="${esc(d.url||'#')}" target="_blank" rel="noopener">PROFILE SOURCE ↗</a></div><div class="source-note">Driver photo uses the OpenF1 headshot where available, with a Wikipedia/Wikimedia fallback.</div></div></div>`; }
function renderTeams(){ view.innerHTML=titleBlock(`${YEAR} GRID`,'Teams')+`<div class="grid two">${state.constructors.map(c=>`<div class="card" style="border-left:5px solid ${teamColour(c.Constructor.name)}"><div class="eyebrow">P${esc(c.position)}</div><div class="card-title" style="font-size:20px;margin-top:5px">${esc(c.Constructor.name)}</div><div class="stat-big">${esc(c.points)} <span class="muted" style="font-size:11px">PTS</span></div><div class="muted">${esc(c.wins)} wins · ${esc(c.Constructor.nationality||'')}</div></div>`).join('')}</div>`; }
function renderCircuits(){ view.innerHTML=titleBlock(`${YEAR} CALENDAR`,'Circuits')+`<div class="grid two">${state.schedule.map(r=>{const src=circuitSvg(r.Circuit.circuitId);return `<div class="card clickable" onclick="setRoute('circuit:${r.round}')">${src?`<div class="track-img-wrap"><img class="track-img" src="${src}" alt="${esc(r.Circuit.circuitName)} layout" loading="lazy"></div>`:''}<div class="eyebrow">${flag(r.Circuit.Location.country)} ${esc(r.Circuit.Location.country)}</div><div class="card-title" style="margin-top:5px">${esc(r.Circuit.circuitName)}</div><div class="muted" style="margin-top:3px">${esc(r.Circuit.Location.locality)}</div></div>`}).join('')}</div>`; }
function renderCircuit(round){
  const r=state.schedule.find(x=>x.round===round);if(!r)return setRoute('circuits');const c=CIRCUITS[r.Circuit.circuitId]||{},src=circuitSvg(r.Circuit.circuitId);
  view.innerHTML=`<div class="actions"><button class="external-btn" onclick="setRoute('circuits')">← CIRCUITS</button></div><div class="spacer"></div>${titleBlock(flag(r.Circuit.Location.country)+' '+r.Circuit.Location.country,r.Circuit.circuitName)}<div class="card">${src?`<div class="track-img-wrap" style="height:240px"><img class="track-img" src="${src}" alt="track layout"></div>`:''}<div class="facts"><div class="fact"><b>${c.length?c.length.toFixed(3)+' km':'—'}</b><small>LENGTH</small></div><div class="fact"><b>${c.laps??'—'}</b><small>LAPS</small></div><div class="fact"><b>${c.turns??'—'}</b><small>TURNS</small></div><div class="fact"><b>${c.first??'—'}</b><small>FIRST GP</small></div><div class="fact"><b>${c.length&&c.laps?(c.length*c.laps).toFixed(1)+' km':'—'}</b><small>RACE DIST.</small></div><div class="fact"><b>${fmtDate(raceIso(r),{day:'numeric',month:'short'})}</b><small>${YEAR} RACE</small></div></div><div class="spacer"></div><div class="actions"><button class="external-btn red" onclick="setRoute('radar:${r.round}')">RAIN RADAR</button><button class="external-btn" onclick="setRoute('race:${r.round}')">RACE HUB</button></div></div><div class="spacer"></div>${titleBlock('HISTORY','Previous Winners')}<div id="circuit-history"><div class="loader">Loading circuit history…</div></div><div class="source-note">Circuit layout: community SVG source. Historical race winners are loaded from Jolpica/Ergast data.</div>`;
  loadCircuitHistoryInto(r);
}
async function loadCircuitHistoryInto(r){
  const root=document.getElementById('circuit-history');if(!root)return;const id=r.Circuit.circuitId;
  try{
    let j;
    try{j=await fetchJSON(`${JOLPICA}/circuits/${encodeURIComponent(id)}/results/1/?limit=100`,`circuit-wins-${id}`,7*864e5);}catch{j=await fetchJSON(`${JOLPICA}/results/1/circuits/${encodeURIComponent(id)}/?limit=100`,`circuit-wins2-${id}`,7*864e5);}
    const races=j?.MRData?.RaceTable?.Races||[];
    const wins=races.map(x=>({race:x,w:(x.Results||[])[0]})).filter(x=>x.w?.Driver);
    if(!wins.length){root.innerHTML='<div class="card"><div class="empty">No previous World Championship winners at this circuit yet.</div></div>';return;}
    const counts={};for(const x of wins){const n=fullName(x.w.Driver);counts[n]=(counts[n]||0)+1;}
    const leaders=Object.entries(counts).sort((a,b)=>b[1]-a[1]||a[0].localeCompare(b[0])).slice(0,3);
    const recent=wins.slice().sort((a,b)=>Number(b.race.season)-Number(a.race.season)).slice(0,6);
    root.innerHTML=`<div class="grid two"><div class="card"><div class="eyebrow">MOST WINS HERE</div>${leaders.map(([n,c],i)=>`<div class="history-leader"><b>${i+1}. ${esc(n)}</b><span>${c}</span></div>`).join('')}</div><div class="card"><div class="eyebrow">RECENT WINNERS</div>${recent.map(x=>`<div class="history-leader"><b>${esc(x.race.season)} · ${esc(x.w.Driver.familyName)}</b><span>${esc(x.w.Constructor?.name||'')}</span></div>`).join('')}</div></div>`;
  }catch{root.innerHTML='<div class="card"><div class="empty">Circuit history is unavailable right now.</div></div>';}
}

async function renderRadar(round){ const r=state.schedule.find(x=>x.round===round);if(!r)return setRoute('races');const l=r.Circuit.Location;view.innerHTML=`<div class="actions"><button class="external-btn" onclick="history.length>1?history.back():setRoute('race:${r.round}')">← BACK</button></div><div class="spacer"></div>${titleBlock('LIVE WEATHER RADAR',r.Circuit.circuitName)}<div class="radar-card"><iframe class="radar-frame" src="${esc(radarEmbedUrl(r))}" title="Weather radar for ${esc(r.Circuit.circuitName)}" loading="eager" allowfullscreen></iframe></div><div class="spacer"></div><div class="actions"><a class="external-btn red" href="${esc(radarUrl(r))}" target="_blank" rel="noopener">OPEN FULL RADAR ↗</a><button class="external-btn" onclick="setRoute('race:${r.round}')">RACE HUB</button></div><div class="source-note">Radar is centred on ${esc(l.locality)}, ${esc(l.country)} using the circuit coordinates.</div>`; }

function renderRaceDetail(round){ const r=state.schedule.find(x=>x.round===round);if(!r)return setRoute('races');const c=CIRCUITS[r.Circuit.circuitId]||{},src=circuitSvg(r.Circuit.circuitId);view.innerHTML=`<div class="actions"><button class="external-btn" onclick="setRoute('races')">← CALENDAR</button></div><div class="spacer"></div><section class="hero" style="min-height:190px"><div class="hero-top"><span class="pill ${raceStatus(r)==='NEXT'?'live':'subtle'}">ROUND ${esc(r.round)}</span><span>${flag(r.Circuit.Location.country)}</span></div><h1>${esc(r.raceName.toUpperCase())}</h1><div class="circuit">${esc(r.Circuit.circuitName)}</div></section><div class="tabs"><button class="tab active" data-racetab="weekend">WEEKEND</button><button class="tab" data-racetab="results">RESULTS</button><button class="tab" data-racetab="updates">UPDATES</button><button class="tab" data-racetab="control">RACE CONTROL</button><button class="tab" data-racetab="radio">RADIO</button></div><div id="race-tab-content"></div>`;
  const root=document.getElementById('race-tab-content'); const drawWeekend=()=>{root.innerHTML=`<div class="grid desktop-two"><div><div class="schedule-list">${sessionRows(r)}</div><div class="spacer"></div><div class="actions"><button class="external-btn red" onclick="setRoute('radar:${r.round}')">RAIN RADAR</button><button class="external-btn" onclick="setRoute('circuit:${r.round}')">TRACK INFO</button></div></div><div>${weatherCard(r)}${src?`<div class="spacer"></div><div class="card"><div class="track-img-wrap"><img class="track-img" src="${src}" alt="track layout"></div><div class="facts"><div class="fact"><b>${c.length||'—'} km</b><small>LENGTH</small></div><div class="fact"><b>${c.laps||'—'}</b><small>LAPS</small></div><div class="fact"><b>${c.turns||'—'}</b><small>TURNS</small></div></div></div>`:''}</div></div>`;loadWeatherIntoCard(r);}; drawWeekend();
  document.querySelectorAll('[data-racetab]').forEach(b=>b.onclick=async()=>{document.querySelectorAll('[data-racetab]').forEach(x=>x.classList.remove('active'));b.classList.add('active');const t=b.dataset.racetab;if(t==='weekend')drawWeekend();else if(t==='results')await drawResults(root,r);else if(t==='updates')await drawCarUpdates(root,r);else if(t==='control')await drawRaceControl(root,r);else await drawRadio(root,r);});
}
async function drawResults(root,r){
  root.innerHTML='<div class="loader">Loading classification…</div>';
  try{
    const [res,q]=await Promise.allSettled([fetchJSON(`${JOLPICA}/${YEAR}/${r.round}/results/?limit=100`,`result-${r.round}`,15*60e3),fetchJSON(`${JOLPICA}/${YEAR}/${r.round}/qualifying/?limit=100`,`quali-${r.round}`,15*60e3)]);
    const rr=res.status==='fulfilled'?res.value?.MRData?.RaceTable?.Races?.[0]:null,qq=q.status==='fulfilled'?q.value?.MRData?.RaceTable?.Races?.[0]:null;
    root.innerHTML=`${resultTable('RACE RESULT',rr?.Results||[])}${rr?.Results?.length?`<div class="spacer"></div><div class="actions"><button class="external-btn red" onclick="setRoute('telemetry:${r.round}:race')">VIEW RACE TELEMETRY ›</button></div>`:''}<div id="race-strategy-inline"></div><div class="spacer"></div>${resultTable('QUALIFYING',qq?.QualifyingResults||[],true)}`;
    const slot=document.getElementById('race-strategy-inline');
    if(slot&&rr?.Results?.length){
      try{const os=await openF1RaceSession(r);if(os){const [ofres,drivers,stints]=await Promise.all([fetchJSON(`${OPENF1}/session_result?session_key=${os.session_key}`,`of1-result-${os.session_key}`,15*60e3),fetchJSON(`${OPENF1}/drivers?session_key=${os.session_key}`,`of1-drivers-${os.session_key}`,6*3600e3),fetchJSON(`${OPENF1}/stints?session_key=${os.session_key}`,`of1-stints-${os.session_key}`,30*60e3)]);slot.innerHTML=`<div class="spacer"></div>${sessionRecapHtml(ofres,drivers,{key:'race'})}<div class="spacer"></div>${raceStrategyHtml(stints,drivers,ofres)}`;}}
      catch{}
    }
  }catch{root.innerHTML='<div class="error-box">Results are not available yet.</div>';}
}
function raceGapLabel(x,winner){
  if(Number(x.position)===1)return x.Time?.time||'WINNER';
  const raw=x.Time?.time;
  if(raw){return raw.startsWith('+')?raw:`+${raw}`;}
  const wm=Number(winner?.Time?.millis),xm=Number(x.Time?.millis);
  if(Number.isFinite(wm)&&Number.isFinite(xm)&&xm>=wm){
    const d=xm-wm,mins=Math.floor(d/60000),secs=(d%60000)/1000;
    return mins?`+${mins}:${secs.toFixed(3).padStart(6,'0')}`:`+${secs.toFixed(3)}`;
  }
  const st=String(x.status||'').trim();
  if(/^\+/.test(st))return st.toUpperCase();
  if(st==='Finished')return 'FINISHED';
  return st||'—';
}
function qualiTime(x){return x.Q3||x.Q2||x.Q1||'—';}
function resultTable(title,rows,q=false){
  if(!rows.length)return `<div class="card"><div class="eyebrow">${title}</div><div class="empty">Not available yet.</div></div>`;
  const winner=rows.find(x=>Number(x.position)===1)||rows[0];
  return `<div class="card classification-card"><div class="eyebrow">${title}</div><div class="classification-head"><span>POS</span><span>DRIVER</span><span>${q?'TIME':'TIME / GAP'}</span></div><div class="classification-list">${rows.map(x=>{
    const timing=q?qualiTime(x):raceGapLabel(x,winner);
    const meta=q?`${x.Constructor?.name||''}`:`${x.Constructor?.name||''}${x.points?` · ${x.points} pt${Number(x.points)===1?'':'s'}`:''}`;
    return `<div class="classification-row ${Number(x.position)===1&&!q?'winner':''}"><div class="class-pos">${esc(x.position)}</div><div class="driver-line"><i class="team-dot" style="background:${teamColour(x.Constructor?.name)}"></i><div><div class="driver-name">${esc(driverCode(x.Driver))} · ${esc(x.Driver.familyName)}</div><div class="driver-meta">${esc(meta)}</div></div></div><div class="class-time">${esc(timing)}</div></div>`;
  }).join('')}</div></div>`;
}
function openF1Country(r){return ({'USA':'United States','UK':'Great Britain','UAE':'United Arab Emirates'})[r.Circuit.Location.country]||r.Circuit.Location.country;}
async function openF1Session(r,s){
  const country=openF1Country(r);
  const rows=await fetchJSON(`${OPENF1}/sessions?year=${YEAR}&country_name=${encodeURIComponent(country)}&session_name=${encodeURIComponent(s.openName)}`,`of1-sess-${r.round}-${s.key}`,6*3600e3);
  if(!rows?.length)return null;
  const target=new Date(s.iso);
  return rows.slice().sort((a,b)=>Math.abs(new Date(a.date_start)-target)-Math.abs(new Date(b.date_start)-target))[0];
}
function openF1DriverMap(rows){return Object.fromEntries((rows||[]).map(d=>[String(d.driver_number),d]));}
function lastValue(v){if(Array.isArray(v)){for(let i=v.length-1;i>=0;i--){if(v[i]!==null&&v[i]!==undefined)return v[i];}return null;}return v;}
function formatLapSeconds(sec){
  const n=Number(sec);if(!Number.isFinite(n))return '—';
  const m=Math.floor(n/60),s=n-m*60;return `${m}:${s.toFixed(3).padStart(6,'0')}`;
}
function formatTotalSeconds(sec){
  const n=Number(sec);if(!Number.isFinite(n))return '—';
  const h=Math.floor(n/3600),m=Math.floor((n%3600)/60),s=n%60;
  return h?`${h}:${String(m).padStart(2,'0')}:${s.toFixed(3).padStart(6,'0')}`:`${m}:${s.toFixed(3).padStart(6,'0')}`;
}
function openF1Timing(row,s){
  if(row.dsq)return 'DSQ';if(row.dns)return 'DNS';if(row.dnf)return 'DNF';
  const dur=lastValue(row.duration),gap=lastValue(row.gap_to_leader);
  if(s.key==='race'||s.key==='sprint'){
    if(Number(row.position)===1)return formatTotalSeconds(dur);
    if(typeof gap==='string')return gap.toUpperCase();
    const g=Number(gap);return Number.isFinite(g)?`+${g.toFixed(3)}`:'—';
  }
  return formatLapSeconds(dur);
}
function openF1Gap(row,s){
  if(row.dsq||row.dns||row.dnf)return '';
  if(s.key==='race'||s.key==='sprint')return '';
  if(Number(row.position)===1)return '';
  const gap=lastValue(row.gap_to_leader);if(typeof gap==='string')return gap.toUpperCase();const g=Number(gap);return Number.isFinite(g)?`+${g.toFixed(3)}`:'';
}
function sessionResultTable(rows,drivers,s){
  if(!rows?.length)return '<div class="card"><div class="empty">Classification not available yet.</div></div>';
  const dmap=openF1DriverMap(drivers);
  const sorted=rows.slice().sort((a,b)=>Number(a.position)-Number(b.position));
  return `<div class="card classification-card"><div class="classification-head"><span>POS</span><span>DRIVER</span><span>${s.key==='race'||s.key==='sprint'?'TIME / GAP':'BEST / GAP'}</span></div><div class="classification-list">${sorted.map(x=>{
    const d=dmap[String(x.driver_number)]||{},team=d.team_name||'',code=d.name_acronym||String(x.driver_number),name=d.last_name||d.full_name||`Car ${x.driver_number}`,gap=openF1Gap(x,s);
    return `<div class="classification-row ${Number(x.position)===1?'winner':''}"><div class="class-pos">${esc(x.position??'—')}</div><div class="driver-line"><i class="team-dot" style="background:${d.team_colour?'#'+d.team_colour:teamColour(team)}"></i><div><div class="driver-name">${esc(code)} · ${esc(name)}</div><div class="driver-meta">${esc(team)}${x.number_of_laps!=null?` · ${esc(x.number_of_laps)} laps`:''}</div></div></div><div class="class-time">${esc(openF1Timing(x,s))}${gap?`<small class="class-gap">${esc(gap)}</small>`:''}</div></div>`;
  }).join('')}</div></div>`;
}

function sessionRecapHtml(rows,drivers,s){
  if(!rows?.length)return '';
  const dmap=openF1DriverMap(drivers),sorted=rows.slice().sort((a,b)=>Number(a.position)-Number(b.position)),top=sorted.slice(0,3);
  const who=x=>{const d=dmap[String(x.driver_number)]||{};return `${d.name_acronym||x.driver_number} · ${d.last_name||d.full_name||('Car '+x.driver_number)}`;};
  const leader=top[0],p2=top[1],dnfs=sorted.filter(x=>x.dnf||x.dns||x.dsq).length;
  const label=(s.key==='race'||s.key==='sprint')?'WINNER':(s.key==='quali'||s.key==='sprintq')?'POLE / P1':'FASTEST';
  const margin=p2?((s.key==='race'||s.key==='sprint')?openF1Timing(p2,s):openF1Gap(p2,s)):'—';
  return `<div class="card recap-card"><div class="eyebrow">SESSION RECAP</div><div class="recap-hero"><div><div class="recap-sub">${label}</div><div class="recap-main">${esc(who(leader))}</div><div class="recap-sub">${esc(openF1Timing(leader,s))}</div></div><div><div class="recap-sub">MARGIN TO P2</div><div class="recap-gap">${esc(margin||'—')}</div>${(s.key==='race'||s.key==='sprint')?`<div class="recap-sub">${dnfs} DNF / DNS / DSQ</div>`:''}</div></div><div class="recap-top3">${top.map(x=>`<div class="recap-line"><strong>P${esc(x.position)}</strong><span>${esc(who(x))}</span><b>${esc(openF1Timing(x,s))}</b></div>`).join('')}</div></div>`;
}
function tyreClass(comp){return String(comp||'UNKNOWN').toLowerCase().replace(/[^a-z]/g,'');}
function raceStrategyHtml(stints,drivers,results){
  if(!stints?.length)return '<div class="card"><div class="eyebrow">TYRE STRATEGY</div><div class="empty">Tyre stint data is not available yet.</div></div>';
  const dmap=openF1DriverMap(drivers),by={};for(const x of stints){(by[String(x.driver_number)]??=[]).push(x);}
  const order=(results||[]).slice().sort((a,b)=>Number(a.position)-Number(b.position)).map(x=>String(x.driver_number));
  const nums=[...new Set([...order,...Object.keys(by)])];
  return `<div class="card strategy-card"><div class="eyebrow">TYRE STRATEGY</div><div class="strategy-list">${nums.filter(n=>by[n]?.length).map(n=>{const d=dmap[n]||{},ss=by[n].slice().sort((a,b)=>Number(a.stint_number)-Number(b.stint_number));return `<div class="strategy-row"><div class="strategy-driver">${esc(d.name_acronym||n)}</div><div class="strategy-stints">${ss.map(x=>`<span class="tyre ${tyreClass(x.compound)}"><i>${esc((x.compound||'?').slice(0,1))}</i>${esc(x.lap_start??'?')}–${esc(x.lap_end??'?')}</span>`).join('<span class="strategy-arrow">→</span>')}</div><div class="strategy-stops">${Math.max(0,ss.length-1)} stop${ss.length===2?'':'s'}</div></div>`;}).join('')}</div></div>`;
}
async function renderSessionResult(round,key){
  const r=state.schedule.find(x=>String(x.round)===String(round));if(!r)return setRoute('races');
  const s=sessions(r).find(x=>x.key===key);if(!s)return setRoute(`race:${round}`);
  view.innerHTML=`<div class="actions"><button class="external-btn" onclick="history.length>1?history.back():setRoute('race:${r.round}')">← WEEKEND</button></div><div class="spacer"></div>${titleBlock(`${flag(r.Circuit.Location.country)} ${r.raceName}`,s.name)}<div id="session-classification"><div class="loader">Loading classification…</div></div>`;
  const root=document.getElementById('session-classification');
  try{
    const os=await openF1Session(r,s);if(!os)throw new Error('session');
    const tasks=[fetchJSON(`${OPENF1}/session_result?session_key=${os.session_key}`,`of1-result-${os.session_key}`,15*60e3),fetchJSON(`${OPENF1}/drivers?session_key=${os.session_key}`,`of1-drivers-${os.session_key}`,6*3600e3)];
    if(s.key==='race')tasks.push(fetchJSON(`${OPENF1}/stints?session_key=${os.session_key}`,`of1-stints-${os.session_key}`,30*60e3));
    const [results,drivers,stints=[]]=await Promise.all(tasks);
    root.innerHTML=sessionRecapHtml(results,drivers,s)+`<div class="spacer"></div>`+sessionResultTable(results,drivers,s)+(s.key==='race'?`<div class="spacer"></div>${raceStrategyHtml(stints,drivers,results)}`:'')+`<div class="spacer"></div><div class="actions"><button class="external-btn red" onclick="setRoute('telemetry:${r.round}:${s.key}')">VIEW TELEMETRY ›</button></div><div class="source-note">Session classification and tyre stints via OpenF1. Detailed data normally appears shortly after the official session is published.</div>`;
  }catch{root.innerHTML='<div class="card"><div class="empty">Classification has not been published on the free feed yet. Try Refresh shortly after the session.</div></div>';}
}

// v1.6.0 — FIA car updates + post-session telemetry
function normaliseRaceText(v){
  return String(v||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,' ').trim();
}
function raceDocTerms(r){
  return uniqueBy([
    r?.raceName,
    String(r?.raceName||'').replace(/\s+Grand Prix$/i,''),
    r?.Circuit?.Location?.country,
    r?.Circuit?.Location?.locality,
    r?.Circuit?.circuitName
  ].filter(Boolean).map(normaliseRaceText),x=>x).filter(x=>x.length>2);
}
function absoluteFiaUrl(url){
  if(!url)return '';
  if(/^https?:\/\//i.test(url))return url;
  if(url.startsWith('/'))return 'https://www.fia.com'+url;
  return url;
}
function findCarPresentationLink(raw,r){
  const lines=String(raw||'').split('\n'),terms=raceDocTerms(r),candidates=[];
  for(let i=0;i<lines.length;i++){
    if(!/Car Presentation Submissions/i.test(lines[i]))continue;
    const m=lines[i].match(/\[([^\]]*Car Presentation Submissions[^\]]*)\]\(([^)]+)\)/i);
    if(!m)continue;
    const context=normaliseRaceText(lines.slice(Math.max(0,i-35),i+2).join(' '));
    let score=0;
    for(const t of terms)if(context.includes(t))score+=t.length;
    candidates.push({title:m[1],url:absoluteFiaUrl(m[2]),score});
  }
  const best=candidates.sort((a,b)=>b.score-a.score)[0]||null;
  return best&&best.score>0?best:null;
}
function cleanMarkdownInline(v){
  return String(v||'').replace(/<[^>]+>/g,' ').replace(/!\[[^\]]*\]\([^)]*\)/g,'').replace(/\[([^\]]+)\]\([^)]*\)/g,'$1').replace(/[*_`#]/g,'').replace(/\s+/g,' ').trim();
}
function carTeamName(line){
  const s=cleanMarkdownInline(line);
  const tests=[
    ['Mercedes','Mercedes'],['McLaren','McLaren'],['Ferrari','Ferrari'],['Red Bull','Red Bull Racing'],
    ['Racing Bulls','Racing Bulls'],['Aston Martin','Aston Martin'],['Williams','Williams'],
    ['Haas','Haas F1 Team'],['Alpine','Alpine F1 Team'],['Audi','Audi'],['Cadillac','Cadillac F1 Team']
  ];
  for(const [needle,name] of tests)if(new RegExp(needle,'i').test(s)&&(/team|racing|ferrari|mclaren|mercedes|williams|haas|alpine|audi|cadillac/i.test(s)))return name;
  return null;
}
function updateBadge(reason,desc,diff){
  const t=`${reason||''} ${desc||''} ${diff||''}`.toLowerCase();
  if(/cooling|heat rejection|temperature/.test(t))return 'COOLING';
  if(/circuit specific|circuit-specific|track specific|track-specific|specific to this (event|circuit)|drag level/.test(t))return 'CIRCUIT';
  if(/previous version|revised|modified|reprofile|changed|updated|compared to/.test(t))return 'MODIFIED';
  return 'NEW';
}
function parseCarPresentation(raw){
  let t=String(raw||'').replace(/\r/g,'');
  const marker=t.indexOf('Markdown Content:');if(marker>=0)t=t.slice(marker+'Markdown Content:'.length);
  // Jina can return HTML tables for PDFs. Convert each row into a pipe row first.
  t=t.replace(/<tr[^>]*>([\s\S]*?)<\/tr>/gi,(all,row)=>{
    const cells=[...row.matchAll(/<(?:td|th)[^>]*>([\s\S]*?)<\/(?:td|th)>/gi)].map(m=>cleanMarkdownInline(m[1]));
    return cells.length?`\n| ${cells.join(' | ')} |\n`:all;
  });
  const lines=t.split('\n');
  const groups={},teamOrder=[];let team=null;
  const ensure=n=>{if(!groups[n]){groups[n]=[];teamOrder.push(n);}return groups[n];};
  for(const line of lines){
    const maybe=carTeamName(line);if(maybe){team=maybe;ensure(team);continue;}
    if(!team||!line.trim().startsWith('|'))continue;
    const cells=line.split('|').slice(1,-1).map(cleanMarkdownInline);
    if(cells.length<3)continue;
    if(!/^\d+$/.test(cells[0]))continue;
    const component=cells[1]||'Update',reason=cells[2]||'',diff=cells[3]||'',desc=cells.slice(4).join(' ')||'';
    if(/updated component/i.test(component))continue;
    ensure(team).push({component,reason,diff,desc,badge:updateBadge(reason,desc,diff)});
  }
  const teams=teamOrder.map(name=>({name,updates:groups[name]})).filter(x=>x.updates.length);
  return {teams,plain:cleanFiaDocument(t)};
}
function carUpdatesHtml(parsed,doc){
  if(parsed.teams.length){
    return `<div class="update-team-list">${parsed.teams.map(g=>`<div class="card update-team-card" style="border-left-color:${teamColour(g.name)}"><div class="update-team-head"><div class="card-title">${esc(g.name)}</div><div class="update-count">${g.updates.length} update${g.updates.length===1?'':'s'}</div></div>${g.updates.map(u=>`<div class="update-item"><div class="update-item-top"><b>${esc(u.component)}</b><span class="update-badge ${u.badge.toLowerCase()}">${esc(u.badge)}</span></div>${u.reason?`<div class="update-reason">${esc(u.reason)}</div>`:''}${u.desc?`<div class="update-desc">${esc(u.desc)}</div>`:''}${u.diff?`<details class="update-details"><summary>Geometry / difference</summary><div>${esc(u.diff)}</div></details>`:''}</div>`).join('')}</div>`).join('')}</div><div class="source-note">Official FIA Car Presentation Submission. Teams describe the component, primary reason and how the update differs from the previous specification.</div><div class="spacer"></div><div class="actions"><a class="external-btn" target="_blank" rel="noopener" href="${esc(doc.url)}">OFFICIAL FIA DOCUMENT ↗</a></div>`;
  }
  if(parsed.plain){
    return `<div class="card fia-text-card">${renderFiaText(parsed.plain)}</div><div class="source-note">The FIA document was found, but its table layout could not be split reliably into team cards. The readable official text is shown instead.</div><div class="spacer"></div><div class="actions"><a class="external-btn" target="_blank" rel="noopener" href="${esc(doc.url)}">OFFICIAL FIA DOCUMENT ↗</a></div>`;
  }
  return '<div class="card"><div class="empty">No update rows could be read from the FIA document.</div></div>';
}
async function getCarUpdateDoc(r){
  const cached=state.carUpdateDocs[String(r.round)];if(cached)return cached;
  const text=await fetchText(JINA+FIA_DOCS,'fia-docs',20*60e3);
  const doc=findCarPresentationLink(text,r);
  if(doc)state.carUpdateDocs[String(r.round)]=doc;
  return doc;
}
async function drawCarUpdates(root,r){
  root.innerHTML='<div class="loader">Checking FIA car presentation submissions…</div>';
  try{
    const doc=await getCarUpdateDoc(r);
    if(!doc)throw new Error('not-published');
    const raw=await fetchText(JINA+doc.url,`fia-car-updates-${r.round}`,6*3600e3);
    const parsed=parseCarPresentation(raw);
    root.innerHTML=titleBlock('TECHNICAL','Car Updates')+carUpdatesHtml(parsed,doc);
  }catch{
    root.innerHTML=`${titleBlock('TECHNICAL','Car Updates')}<div class="card"><div class="empty">A Car Presentation Submission could not be matched to this weekend yet. The FIA normally publishes it around the start of track running.</div></div><div class="spacer"></div><div class="actions"><a class="external-btn" target="_blank" rel="noopener" href="${FIA_DOCS}">FIA DOCUMENTS ↗</a></div>`;
  }
}
function renderUpdates(){
  const rows=[...state.schedule].reverse().map(r=>{
    const past=new Date(raceIso(r)).getTime()<Date.now(),status=past?'PAST WEEKEND':raceStatus(r)==='NEXT'?'CURRENT / NEXT':'UPCOMING';
    return `<div class="card clickable development-race" onclick="setRoute('carupdates:${r.round}')"><div class="round-box"><small>ROUND</small><b>${esc(r.round)}</b></div><div><div class="race-name">${flag(r.Circuit.Location.country)} ${esc(r.raceName)}</div><div class="race-place">${esc(r.Circuit.circuitName)} · ${fmtDate(raceIso(r),{day:'numeric',month:'short'})}</div></div><div class="development-status">${status}<b>UPDATES ›</b></div></div>`;
  }).join('');
  view.innerHTML=titleBlock(`${YEAR} SEASON`,'Car Development')+`<div class="card development-intro"><div class="eyebrow">OFFICIAL FIA SUBMISSIONS</div><div class="card-title" style="margin-top:5px">Race-by-race car updates</div><div class="muted" style="margin-top:5px">Component changes are taken from each weekend’s FIA Car Presentation Submission. Tap a round to see what every team declared.</div></div><div class="spacer"></div><div class="grid">${rows}</div><div class="source-note">The FIA submissions are the primary technical source. A weekend may show unavailable until its document is published.</div>`;
}
async function renderCarUpdates(round){
  const r=state.schedule.find(x=>String(x.round)===String(round));if(!r)return setRoute('updates');
  view.innerHTML=`<div class="actions"><button class="external-btn" onclick="history.length>1?history.back():setRoute('updates')">← BACK</button><button class="external-btn" onclick="setRoute('race:${r.round}')">RACE HUB</button></div><div class="spacer"></div>${titleBlock(`${flag(r.Circuit.Location.country)} ${r.raceName}`,'Car Updates')}<div id="car-updates-page"><div class="loader">Checking FIA submission…</div></div>`;
  await drawCarUpdates(document.getElementById('car-updates-page'),r);
}

function validTelemetryLaps(laps,driverNumber){
  return (laps||[]).filter(x=>String(x.driver_number)===String(driverNumber)&&Number.isFinite(Number(x.lap_duration))&&Number(x.lap_duration)>0&&!x.is_pit_out_lap).sort((a,b)=>Number(a.lap_number)-Number(b.lap_number));
}
function fastestLap(laps,driverNumber){
  const a=validTelemetryLaps(laps,driverNumber);return a.length?[...a].sort((x,y)=>Number(x.lap_duration)-Number(y.lap_duration))[0]:null;
}
function telemetryDriverName(d){return d?.name_acronym?`${d.name_acronym} · ${d.last_name||d.full_name||d.driver_number}`:(d?.full_name||`Car ${d?.driver_number??'—'}`);}
function lapSelectOptions(laps,driverNumber,selected){
  const a=validTelemetryLaps(laps,driverNumber),fast=fastestLap(laps,driverNumber);
  return a.map(x=>`<option value="${esc(x.lap_number)}" ${String(x.lap_number)===String(selected??fast?.lap_number)?'selected':''}>${x===fast?'FASTEST · ':''}L${esc(x.lap_number)} · ${formatLapSeconds(x.lap_duration)}</option>`).join('');
}
function rangeUrl(endpoint,sessionKey,driverNumber,start,end){
  const u=new URL(`${OPENF1}/${endpoint}`);
  u.searchParams.set('session_key',sessionKey);u.searchParams.set('driver_number',driverNumber);
  u.searchParams.set('date>=',start);u.searchParams.set('date<=',end);
  return u.toString();
}
function median(nums){
  const a=nums.filter(Number.isFinite).sort((x,y)=>x-y);if(!a.length)return 0;const m=Math.floor(a.length/2);return a.length%2?a[m]:(a[m-1]+a[m])/2;
}
function nearestCarData(car,t,idx){
  while(idx+1<car.length&&Math.abs(new Date(car[idx+1].date).getTime()-t)<=Math.abs(new Date(car[idx].date).getTime()-t))idx++;
  return [car[idx]||{},idx];
}
function buildTelemetrySeries(car,loc,startMs){
  car=(car||[]).slice().sort((a,b)=>new Date(a.date)-new Date(b.date));
  loc=(loc||[]).slice().sort((a,b)=>new Date(a.date)-new Date(b.date));
  if(!car.length)return [];
  if(loc.length<5){
    const first=new Date(car[0].date).getTime(),last=new Date(car.at(-1).date).getTime(),span=Math.max(1,last-first);
    return car.map(c=>({p:(new Date(c.date).getTime()-first)/span,elapsed:(new Date(c.date).getTime()-startMs)/1000,x:null,y:null,speed:Number(c.speed)||0,throttle:Number(c.throttle)||0,brake:Number(c.brake)||0,gear:Number(c.n_gear)||0,rpm:Number(c.rpm)||0,drs:Number(c.drs)||0}));
  }
  let ci=0,pts=[];
  for(const l of loc){
    const t=new Date(l.date).getTime();let c;[c,ci]=nearestCarData(car,t,ci);
    pts.push({t,elapsed:(t-startMs)/1000,x:Number(l.x),y:Number(l.y),speed:Number(c.speed)||0,throttle:Number(c.throttle)||0,brake:Number(c.brake)||0,gear:Number(c.n_gear)||0,rpm:Number(c.rpm)||0,drs:Number(c.drs)||0});
  }
  const steps=[];for(let i=1;i<pts.length;i++){const d=Math.hypot(pts[i].x-pts[i-1].x,pts[i].y-pts[i-1].y);if(Number.isFinite(d)&&d>0)steps.push(d);}
  const med=median(steps)||1,limit=Math.max(med*12,1000);let dist=0,prev=pts[0];
  for(const p of pts){if(p!==pts[0]){const d=Math.hypot(p.x-prev.x,p.y-prev.y);if(Number.isFinite(d)&&d<=limit)dist+=d;}p.dist=dist;prev=p;}
  const total=Math.max(1,dist);for(const p of pts)p.p=Math.max(0,Math.min(1,p.dist/total));
  return pts;
}
async function fetchLapTelemetry(sessionKey,driverNumber,lap){
  const start=new Date(lap.date_start),duration=Math.max(20,Number(lap.lap_duration)||120),end=new Date(start.getTime()+(duration+2)*1000);
  const s=start.toISOString(),e=end.toISOString(),key=`telemetry-${sessionKey}-${driverNumber}-${lap.lap_number}`;
  const [car,loc]=await Promise.all([
    fetchJSON(rangeUrl('car_data',sessionKey,driverNumber,s,e),`${key}-car`,7*864e5),
    fetchJSON(rangeUrl('location',sessionKey,driverNumber,s,e),`${key}-loc`,7*864e5)
  ]);
  return buildTelemetrySeries(car,loc,start.getTime());
}
function hexRgb(h){const x=h.replace('#','');return [parseInt(x.slice(0,2),16),parseInt(x.slice(2,4),16),parseInt(x.slice(4,6),16)];}
function mixHex(a,b,t){const A=hexRgb(a),B=hexRgb(b),v=A.map((x,i)=>Math.round(x+(B[i]-x)*t));return '#'+v.map(x=>x.toString(16).padStart(2,'0')).join('');}
function speedColour(v,min,max){
  const t=Math.max(0,Math.min(1,(Number(v)-min)/Math.max(1,max-min)));
  return t<.5?mixHex('#2d7dff','#40d878',t*2):mixHex('#40d878','#ff3434',(t-.5)*2);
}
function trackSpeedMapSvg(series,label){
  const pts=series.filter(p=>Number.isFinite(p.x)&&Number.isFinite(p.y));if(pts.length<8)return `<div class="telemetry-map-empty">Track location unavailable for this lap.</div>`;
  const xs=pts.map(p=>p.x),ys=pts.map(p=>p.y),xmin=Math.min(...xs),xmax=Math.max(...xs),ymin=Math.min(...ys),ymax=Math.max(...ys);
  const W=720,H=430,pad=26,sx=(W-pad*2)/Math.max(1,xmax-xmin),sy=(H-pad*2)/Math.max(1,ymax-ymin),scale=Math.min(sx,sy);
  const ox=(W-(xmax-xmin)*scale)/2,oy=(H-(ymax-ymin)*scale)/2;
  const speeds=pts.map(p=>p.speed).filter(x=>Number.isFinite(x)&&x>0);if(!speeds.length)return `<div class="telemetry-map-empty">Speed data unavailable for this lap.</div>`;const lo=Math.min(...speeds),hi=Math.max(...speeds);
  const xy=p=>[ox+(p.x-xmin)*scale,H-(oy+(p.y-ymin)*scale)];
  let lines='';for(let i=1;i<pts.length;i++){const [x1,y1]=xy(pts[i-1]),[x2,y2]=xy(pts[i]),sp=(pts[i-1].speed+pts[i].speed)/2;lines+=`<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="${speedColour(sp,lo,hi)}" stroke-width="7" stroke-linecap="round"/>`;}
  const [sx0,sy0]=xy(pts[0]);
  return `<div class="telemetry-map-title">${esc(label)}</div><svg class="speed-map" viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(label)} speed map"><g opacity=".2" stroke="#fff" stroke-width="12">${lines.replace(/stroke="#[0-9a-f]{6}"/gi,'stroke="#fff"')}</g>${lines}<circle cx="${sx0.toFixed(1)}" cy="${sy0.toFixed(1)}" r="7" fill="#fff" stroke="#111" stroke-width="3"/></svg><div class="speed-legend"><span>${Math.round(lo)} km/h</span><i></i><span>${Math.round(hi)} km/h</span></div>`;
}
function chartPath(series,getValue,min,max,W=720,H=210,padX=36,padY=22){
  const pts=series.filter(p=>Number.isFinite(p.p)&&Number.isFinite(getValue(p)));if(!pts.length)return '';
  const y=v=>H-padY-(v-min)/Math.max(1e-9,max-min)*(H-padY*2),x=p=>padX+p*(W-padX*2);
  return pts.map((p,i)=>`${i?'L':'M'}${x(p.p).toFixed(1)},${y(getValue(p)).toFixed(1)}`).join(' ');
}
function telemetryLineChart(title,a,b,getValue,unit,min,max,names){
  const vals=[...a,...b].map(getValue).filter(Number.isFinite);if(!vals.length)return '';
  if(min==null)min=Math.min(...vals);if(max==null)max=Math.max(...vals);if(max===min)max=min+1;
  const W=720,H=210,pa=chartPath(a,getValue,min,max,W,H),pb=chartPath(b,getValue,min,max,W,H);
  const grid=[0,.25,.5,.75,1].map(t=>{const y=22+(H-44)*t;const val=max-(max-min)*t;return `<line x1="36" y1="${y}" x2="${W-36}" y2="${y}" stroke="#292929"/><text x="6" y="${y+4}" fill="#777" font-size="10">${esc(Math.round(val))}</text>`;}).join('');
  return `<div class="card telemetry-chart"><div class="telemetry-chart-head"><div><div class="eyebrow">${esc(title)}</div><div class="chart-unit">${esc(unit||'')}</div></div><div class="telemetry-legend"><span><i class="a"></i>${esc(names[0])}</span><span><i class="b"></i>${esc(names[1])}</span></div></div><svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="none">${grid}<path d="${pa}" fill="none" stroke="#ff3636" stroke-width="4" vector-effect="non-scaling-stroke"/><path d="${pb}" fill="none" stroke="#efefef" stroke-width="3" vector-effect="non-scaling-stroke"/></svg><div class="distance-axis"><span>START</span><span>LAP DISTANCE</span><span>FINISH</span></div></div>`;
}
function interpElapsed(series,p){
  if(!series.length)return null;let i=1;while(i<series.length&&series[i].p<p)i++;if(i>=series.length)return series.at(-1).elapsed;
  const a=series[Math.max(0,i-1)],b=series[i],span=b.p-a.p;if(span<=0)return b.elapsed;const t=(p-a.p)/span;return a.elapsed+(b.elapsed-a.elapsed)*t;
}
function deltaChart(a,b,names){
  const pts=[];for(let i=0;i<=100;i++){const p=i/100,ta=interpElapsed(a,p),tb=interpElapsed(b,p);if(Number.isFinite(ta)&&Number.isFinite(tb))pts.push({p,delta:ta-tb});}
  if(!pts.length)return '';
  const mx=Math.max(.05,...pts.map(x=>Math.abs(x.delta))),W=720,H=210,path=chartPath(pts,x=>x.delta,-mx,mx,W,H);
  const zero=H/2;
  return `<div class="card telemetry-chart delta-chart"><div class="telemetry-chart-head"><div><div class="eyebrow">LAP DELTA</div><div class="chart-unit">+ = ${esc(names[0])} slower · − = ${esc(names[0])} faster</div></div></div><svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="none"><line x1="36" y1="${zero}" x2="${W-36}" y2="${zero}" stroke="#777" stroke-dasharray="6 6"/><path d="${path}" fill="none" stroke="#ff4141" stroke-width="4" vector-effect="non-scaling-stroke"/></svg><div class="distance-axis"><span>START</span><span>0.000 s</span><span>FINISH</span></div></div>`;
}
function sectorComparison(lapA,lapB,names){
  const rows=[['S1','duration_sector_1'],['S2','duration_sector_2'],['S3','duration_sector_3'],['LAP','lap_duration']];
  return `<div class="card sector-card"><div class="eyebrow">SECTOR COMPARISON</div><div class="sector-head"><b>${esc(names[0])}</b><span></span><b>${esc(names[1])}</b></div>${rows.map(([label,k])=>{const a=Number(lapA[k]),b=Number(lapB[k]),d=Number.isFinite(a)&&Number.isFinite(b)?a-b:null;return `<div class="sector-row"><div>${Number.isFinite(a)?formatLapSeconds(a):'—'}${d!=null&&d<0?`<small> ${Math.abs(d).toFixed(3)} faster</small>`:''}</div><b>${label}</b><div>${Number.isFinite(b)?formatLapSeconds(b):'—'}${d!=null&&d>0?`<small> ${Math.abs(d).toFixed(3)} faster</small>`:''}</div></div>`;}).join('')}</div>`;
}
function telemetrySummary(series,lap,name){
  const speeds=series.map(x=>x.speed).filter(Number.isFinite),top=speeds.length?Math.max(...speeds):0,min=speeds.filter(x=>x>0).length?Math.min(...speeds.filter(x=>x>0)):0;
  const full=series.length?Math.round(series.filter(x=>x.throttle>=98).length/series.length*100):0,brake=series.length?Math.round(series.filter(x=>x.brake>0).length/series.length*100):0;
  return `<div class="card telemetry-summary"><div class="eyebrow">${esc(name)}</div><div class="facts"><div class="fact"><b>${formatLapSeconds(lap.lap_duration)}</b><small>LAP</small></div><div class="fact"><b>${Math.round(top)} km/h</b><small>TOP SPEED</small></div><div class="fact"><b>${Math.round(min)} km/h</b><small>MIN SPEED</small></div><div class="fact"><b>${full}%</b><small>FULL THROTTLE</small></div><div class="fact"><b>${brake}%</b><small>BRAKING SAMPLES</small></div><div class="fact"><b>L${esc(lap.lap_number)}</b><small>SELECTED LAP</small></div></div></div>`;
}
async function renderTelemetry(round,key){
  const r=state.schedule.find(x=>String(x.round)===String(round));if(!r)return setRoute('races');
  const s=sessions(r).find(x=>x.key===key);if(!s)return setRoute(`race:${round}`);
  view.innerHTML=`<div class="actions"><button class="external-btn" onclick="history.length>1?history.back():setRoute('session:${r.round}:${s.key}')">← ${esc(s.name)}</button></div><div class="spacer"></div>${titleBlock(`${flag(r.Circuit.Location.country)} ${r.raceName}`,'Telemetry')}<div id="telemetry-root"><div class="loader">Loading session laps…</div></div>`;
  const root=document.getElementById('telemetry-root');
  try{
    const os=await openF1Session(r,s);if(!os)throw new Error('session');
    const [drivers,laps,results]=await Promise.all([
      fetchJSON(`${OPENF1}/drivers?session_key=${os.session_key}`,`of1-drivers-${os.session_key}`,6*3600e3),
      fetchJSON(`${OPENF1}/laps?session_key=${os.session_key}`,`of1-laps-${os.session_key}`,6*3600e3),
      fetchJSON(`${OPENF1}/session_result?session_key=${os.session_key}`,`of1-result-${os.session_key}`,15*60e3)
    ]);
    const dmap=openF1DriverMap(drivers),available=(drivers||[]).filter(d=>validTelemetryLaps(laps,d.driver_number).length);
    if(available.length<1)throw new Error('laps');
    const resultOrder=(results||[]).slice().sort((a,b)=>Number(a.position)-Number(b.position)).map(x=>String(x.driver_number));
    available.sort((a,b)=>{const ai=resultOrder.indexOf(String(a.driver_number)),bi=resultOrder.indexOf(String(b.driver_number));return (ai<0?99:ai)-(bi<0?99:bi)||telemetryDriverName(a).localeCompare(telemetryDriverName(b));});
    const da=available[0],db=available[1]||available[0],fa=fastestLap(laps,da.driver_number),fb=fastestLap(laps,db.driver_number);
    const options=available.map(d=>`<option value="${esc(d.driver_number)}">${esc(telemetryDriverName(d))}</option>`).join('');
    root.innerHTML=`<div class="card telemetry-controls"><div class="grid two"><label><div class="eyebrow">DRIVER A</div><select id="tel-driver-a">${options}</select></label><label><div class="eyebrow">DRIVER B</div><select id="tel-driver-b">${options}</select></label><label><div class="eyebrow">LAP A</div><select id="tel-lap-a"></select></label><label><div class="eyebrow">LAP B</div><select id="tel-lap-b"></select></label></div><div class="spacer"></div><button id="tel-load" class="external-btn red">LOAD COMPARISON</button></div><div id="telemetry-output"><div class="loader">Loading fastest laps…</div></div><div class="source-note">Post-session telemetry via OpenF1. Historical data from 2023 onwards is free. Track position is approximate, so the coloured map is for speed visualisation rather than precise racing-line analysis.</div>`;
    const sa=document.getElementById('tel-driver-a'),sb=document.getElementById('tel-driver-b'),la=document.getElementById('tel-lap-a'),lb=document.getElementById('tel-lap-b'),load=document.getElementById('tel-load'),output=document.getElementById('telemetry-output');
    sa.value=String(da.driver_number);sb.value=String(db.driver_number);
    const fillLaps=(sel,driver,chosen)=>{sel.innerHTML=lapSelectOptions(laps,driver,chosen);};
    fillLaps(la,sa.value,fa?.lap_number);fillLaps(lb,sb.value,fb?.lap_number);
    sa.onchange=()=>fillLaps(la,sa.value);sb.onchange=()=>fillLaps(lb,sb.value);
    const run=async()=>{
      const na=sa.value,nb=sb.value,lpa=validTelemetryLaps(laps,na).find(x=>String(x.lap_number)===la.value),lpb=validTelemetryLaps(laps,nb).find(x=>String(x.lap_number)===lb.value);
      if(!lpa||!lpb)return;output.innerHTML='<div class="loader">Loading car and track data…</div>';load.disabled=true;
      try{
        const [A,B]=await Promise.all([fetchLapTelemetry(os.session_key,na,lpa),fetchLapTelemetry(os.session_key,nb,lpb)]);
        if(!A.length||!B.length)throw new Error('telemetry');
        const nameA=(dmap[String(na)]?.name_acronym||na),nameB=(dmap[String(nb)]?.name_acronym||nb),names=[nameA,nameB],rpmMax=Math.max(10000,...A.map(x=>x.rpm),...B.map(x=>x.rpm));
        output.innerHTML=`<div class="spacer"></div><div class="grid two">${telemetrySummary(A,lpa,nameA)}${telemetrySummary(B,lpb,nameB)}</div><div class="spacer"></div>${sectorComparison(lpa,lpb,names)}<div class="spacer"></div>${telemetryLineChart('SPEED',A,B,x=>x.speed,'km/h',0,Math.max(360,...A.map(x=>x.speed),...B.map(x=>x.speed)),names)}<div class="spacer"></div>${deltaChart(A,B,names)}<div class="spacer"></div>${telemetryLineChart('THROTTLE',A,B,x=>x.throttle,'%',0,100,names)}<div class="spacer"></div>${telemetryLineChart('BRAKE',A,B,x=>x.brake,'0 / 100',0,100,names)}<div class="spacer"></div>${telemetryLineChart('GEAR',A,B,x=>x.gear,'gear',0,8,names)}<div class="spacer"></div>${telemetryLineChart('RPM',A,B,x=>x.rpm,'rpm',0,rpmMax,names)}<div class="spacer"></div>${titleBlock('SPEED MAP','Circuit-coloured Lap')}<div class="grid two"><div class="card speed-map-card">${trackSpeedMapSvg(A,`${nameA} · L${lpa.lap_number}`)}</div><div class="card speed-map-card">${trackSpeedMapSvg(B,`${nameB} · L${lpb.lap_number}`)}</div></div>`;
      }catch{output.innerHTML='<div class="error-box">Telemetry for one of those laps could not be loaded. Try another completed lap or refresh the session.</div>';}
      finally{load.disabled=false;}
    };
    load.onclick=run;await run();
  }catch{
    root.innerHTML='<div class="card"><div class="empty">Post-session telemetry is not available for this session yet. OpenF1 free historical telemetry covers sessions from 2023 onwards after publication.</div></div>';
  }
}

async function openF1RaceSession(r){const country=openF1Country(r);const ss=await fetchJSON(`${OPENF1}/sessions?year=${YEAR}&country_name=${encodeURIComponent(country)}&session_name=Race`,`of1-sess-${r.round}`,6*3600e3);if(!ss?.length)return null;const target=new Date(raceIso(r));return ss.sort((a,b)=>Math.abs(new Date(a.date_start)-target)-Math.abs(new Date(b.date_start)-target))[0];}
async function drawRaceControl(root,r){root.innerHTML='<div class="loader">Loading race control…</div>';try{const s=await openF1RaceSession(r);if(!s)throw 0;const rows=await fetchJSON(`${OPENF1}/race_control?session_key=${s.session_key}`,`rc-${r.round}`,10*60e3);if(!rows.length)throw 0;root.innerHTML=`<div class="card">${rows.slice().reverse().slice(0,120).map(x=>`<div class="steward-item"><div class="steward-kind">${esc((x.flag||x.category||'RACE CONTROL').toUpperCase())} · LAP ${esc(x.lap_number??'—')}</div><div class="steward-title">${esc(x.message||'')}</div><div class="news-meta">${x.date?fmtTime(x.date):''}</div></div>`).join('')}</div>`;}catch{root.innerHTML='<div class="card"><div class="empty">Race-control data becomes available through the free OpenF1 feed after sessions are published.</div></div>';}}
async function drawRadio(root,r){root.innerHTML='<div class="loader">Loading team radio…</div>';try{const s=await openF1RaceSession(r);if(!s)throw 0;const rows=await fetchJSON(`${OPENF1}/team_radio?session_key=${s.session_key}`,`radio-${r.round}`,20*60e3);if(!rows.length)throw 0;root.innerHTML=`<div class="card">${rows.slice().reverse().slice(0,60).map(x=>`<div class="steward-item"><div class="steward-kind">CAR ${esc(x.driver_number)}</div><audio controls preload="none" style="width:100%;height:36px" src="${esc(x.recording_url)}"></audio><div class="news-meta">${x.date?fmtTime(x.date):''}</div></div>`).join('')}</div>`;}catch{root.innerHTML='<div class="card"><div class="empty">Team radio is unavailable for this session on the free feed.</div></div>';}}

function activePenaltyEvents(events){const today=new Date();today.setHours(0,0,0,0);return (events||[]).filter(x=>new Date(x[1]+'T23:59:59Z')>=today);}
function lookupPenaltyName(name){if(state.penaltyPoints[name])return name;const aliases={'Andrea Kimi Antonelli':'Kimi Antonelli','Alexander Albon':'Alex Albon','Alex Albon':'Alexander Albon','Sergio Pérez':'Sergio Perez','Nico Hülkenberg':'Nico Hulkenberg'};const alt=aliases[name];return alt&&state.penaltyPoints[alt]?alt:name;}
function renderPenalties(){ const names=state.drivers.map(s=>fullName(s.Driver));const rows=names.map(name=>{const key=lookupPenaltyName(name),ev=activePenaltyEvents(state.penaltyPoints[key]||[]),pts=ev.reduce((a,x)=>a+x[0],0),rep=state.reprimands[name]??state.reprimands[key]??state.reprimands[{'Andrea Kimi Antonelli':'Kimi Antonelli','Sergio Pérez':'Sergio Perez','Nico Hülkenberg':'Nico Hulkenberg'}[name]]??0;return {name,pts,rep,ev};}).sort((a,b)=>b.pts-a.pts||b.rep-a.rep||a.name.localeCompare(b.name));view.innerHTML=titleBlock('SUPER LICENCE','Penalty Points')+`<div class="card">${rows.map(x=>`<div class="penalty-row"><div class="penalty-head"><div class="penalty-name">${esc(x.name)} ${x.rep?`<span class="reprimand-badge">${x.rep} REP</span>`:''}</div><div class="penalty-count">${x.pts} / 12</div></div><div class="penalty-bar"><div class="penalty-fill" style="width:${Math.min(100,x.pts/12*100)}%"></div></div><div class="penalty-meta">${x.ev.length?x.ev.map(e=>`${e[0]} pt${e[0]>1?'s':''} expires ${fmtDate(e[1]+'T12:00:00Z',{day:'numeric',month:'short',year:'numeric'})}`).join(' · '):'No active penalty points'}</div></div>`).join('')}</div><div class="source-note">Penalty points use their rolling 12-month expiry dates. Reprimands are counted only within the current championship season. The app attempts a live refresh from RacingNews365 and timepenalty, with a bundled fallback if a source is unavailable.</div><div class="spacer"></div><div class="actions"><a class="external-btn" target="_blank" rel="noopener" href="${PENALTY_SOURCE}">PENALTY SOURCE ↗</a><a class="external-btn" target="_blank" rel="noopener" href="${REPRIMAND_SOURCE}">REPRIMANDS ↗</a></div>`; }

async function fetchPaged(type){const cacheKey='all-'+type;const cached=cacheGet(cacheKey,60*60e3);if(cached)return cached;let offset=0,total=Infinity,parts=[];while(offset<total){const j=await fetchJSON(`${JOLPICA}/${YEAR}/${type}/?limit=100&offset=${offset}`,`${cacheKey}-${offset}`,60*60e3);const mr=j.MRData||{},rs=mr.RaceTable?.Races||[];parts.push(...rs);total=Number(mr.total||offset+100);if(!rs.length||offset+100>=total)break;offset+=100;await sleep(330);}const by={};for(const r of parts){const k=r.round;if(!by[k])by[k]={...r,Results:[],QualifyingResults:[]};by[k].Results.push(...(r.Results||[]));by[k].QualifyingResults.push(...(r.QualifyingResults||[]));}const out=Object.values(by).map(r=>({...r,Results:uniqueBy(r.Results,x=>x.Driver.driverId),QualifyingResults:uniqueBy(r.QualifyingResults,x=>x.Driver.driverId)}));return cachePut(cacheKey,out);}
function uniqueBy(a,fn){const s=new Set();return a.filter(x=>{const k=fn(x);if(s.has(k))return false;s.add(k);return true;});}
async function preloadRaceWinners(force=false){
  try{
    if(force){
      localStorage.removeItem('f1hub:all-results');
      for(let o=0;o<500;o+=100)localStorage.removeItem(`f1hub:all-results-${o}`);
    }
    const races=await fetchPaged('results');
    state.raceHistory=races;
    state.raceWinners=Object.fromEntries(races.map(r=>[String(r.round),(r.Results||[]).find(x=>Number(x.position)===1)]).filter(([,v])=>v));
    if(state.route==='races')renderRaces();
  }catch{}
}
function raceWinner(r){ return state.raceWinners[String(r.round)]||null; }
async function getSeasonData(){return Promise.all([fetchPaged('results'),fetchPaged('qualifying')]);}
function dnf(x){return x?.status && x.status!=='Finished' && !String(x.status).startsWith('+');}
async function renderBattles(){view.innerHTML=titleBlock(`${YEAR} SEASON`,'Teammate Battles')+'<div class="loader">Calculating head-to-heads…</div>';try{const [races,quali]=await getSeasonData();const latest=[...races].sort((a,b)=>Number(b.round)-Number(a.round))[0];let teams={};(latest?.Results||[]).forEach(x=>{(teams[x.Constructor.name]??=[]).push(x.Driver.driverId)});const byId=Object.fromEntries(state.drivers.map(s=>[s.Driver.driverId,s]));const cards=[];for(const [team,ids0] of Object.entries(teams)){const ids=[...new Set(ids0)].filter(x=>byId[x]).slice(0,2);if(ids.length<2)continue;const a=battleStats(ids[0],ids[1],team,races,quali,byId),b=battleStats(ids[1],ids[0],team,races,quali,byId);cards.push(battleCard(team,a,b));}view.innerHTML=titleBlock(`${YEAR} SEASON`,'Teammate Battles')+`<div class="grid two">${cards.join('')}</div>`;}catch(e){view.innerHTML+=`<div class="error-box">Could not load the season result history.</div>`;}}
function battleStats(id,mate,team,races,quali,byId){let podiums=0,dnfs=0,rh=0,qh=0,starts=[],fin=[];for(const r of races){const me=(r.Results||[]).find(x=>x.Driver.driverId===id&&x.Constructor.name===team),m=(r.Results||[]).find(x=>x.Driver.driverId===mate&&x.Constructor.name===team);if(me){const p=Number(me.position);if(p){fin.push(p);if(p<=3)podiums++;}const g=Number(me.grid);if(Number.isFinite(g))starts.push(g);if(dnf(me))dnfs++;}if(me&&m&&Number(me.position)<Number(m.position))rh++;}for(const q of quali){const me=(q.QualifyingResults||[]).find(x=>x.Driver.driverId===id&&x.Constructor.name===team),m=(q.QualifyingResults||[]).find(x=>x.Driver.driverId===mate&&x.Constructor.name===team);if(me&&m&&Number(me.position)<Number(m.position))qh++;}const s=byId[id];return {code:driverCode(s.Driver),points:s.points,wins:s.wins,podiums,dnfs,rh,qh,avgS:starts.length?(starts.reduce((a,b)=>a+b)/starts.length).toFixed(1):'—',avgF:fin.length?(fin.reduce((a,b)=>a+b)/fin.length).toFixed(1):'—'};}
function battleCard(team,a,b){const row=(label,x,y)=>`<div class="battle-stat"><b>${esc(x)}</b><div class="mid">${label}</div><b>${esc(y)}</b></div>`;return `<div class="card battle-card" style="border-top:4px solid ${teamColour(team)}"><div class="battle-team">${esc(team.toUpperCase())}</div><div class="battle-head"><div class="battle-driver">${esc(a.code)}</div><div class="battle-vs">VS</div><div class="battle-driver">${esc(b.code)}</div></div>${row('POINTS',a.points,b.points)}${row('WINS',a.wins,b.wins)}${row('PODIUMS',a.podiums,b.podiums)}${row('QUALI H2H',a.qh,b.qh)}${row('RACE H2H',a.rh,b.rh)}${row('AVG START',a.avgS,b.avgS)}${row('AVG FINISH',a.avgF,b.avgF)}${row('DNFs',a.dnfs,b.dnfs)}</div>`;}

async function renderStewards(){
  view.innerHTML=titleBlock('FIA','Stewards & Decisions')+'<div class="loader">Checking FIA documents…</div>';
  try{
    const text=await fetchText(JINA+FIA_DOCS,'fia-docs',20*60e3), items=[];
    for(const line of text.split('\n')){
      if(!/(Decision|Infringement|Summons)/i.test(line))continue;
      const m=line.match(/\[([^\]]*(?:Decision|Infringement|Summons)[^\]]*)\]\((https?:\/\/[^)]+)\)/i);
      if(m)items.push({title:m[1],url:m[2],kind:/summons/i.test(m[1])?'SUMMONS':/infringement/i.test(m[1])?'INFRINGEMENT':'DECISION'});
    }
    const uniq=uniqueBy(items,x=>x.url).slice(0,80); state.stewardDocs={};
    const rows=uniq.map((x,i)=>{const id=`fia-${i}`;state.stewardDocs[id]=x;return `<div class="steward-link" role="button" tabindex="0" onclick="setRoute('stewarddoc:${id}')"><div class="steward-item"><div class="steward-kind">${x.kind}</div><div class="steward-title">${esc(x.title)}</div><div class="news-meta">Tap to read in F1 Hub ›</div></div></div>`;}).join('');
    view.innerHTML=titleBlock('FIA','Stewards & Decisions')+`<div class="card">${rows||'<div class="empty">No decision links could be parsed automatically.</div>'}</div><div class="spacer"></div><a class="external-btn red" href="${FIA_DOCS}" target="_blank" rel="noopener">OPEN FIA DOCUMENTS ↗</a>`;
  }catch{
    view.innerHTML=titleBlock('FIA','Stewards & Decisions')+`<div class="card"><div class="empty">The FIA page could not be read automatically. You can still open the official documents page.</div></div><div class="spacer"></div><a class="external-btn red" href="${FIA_DOCS}" target="_blank" rel="noopener">OPEN FIA DOCUMENTS ↗</a>`;
  }
}
function cleanFiaDocument(raw){
  let t=String(raw||'').replace(/\r/g,'');
  const marker=t.indexOf('Markdown Content:'); if(marker>=0)t=t.slice(marker+'Markdown Content:'.length);
  t=t.replace(/!\[[^\]]*\]\([^)]*\)/g,'').replace(/\[([^\]]+)\]\([^)]*\)/g,'$1').replace(/^#{1,6}\s*/gm,'').replace(/\*\*/g,'').replace(/__/g,'').replace(/`/g,'');
  const lines=t.split('\n').map(x=>x.trim()).filter(Boolean).filter(x=>!/^URL Source:/i.test(x)&&!/^Published Time:/i.test(x)&&!/^Title:/i.test(x));
  return lines.join('\n');
}
function renderFiaText(text){
  const key=/^(From|To|Document|Date|Time|No\s*\/\s*Driver|Competitor|Session|Fact|Infringement|Decision|Reason)\b/i;
  return text.split('\n').map(line=>{
    const m=line.match(key);
    if(m){const label=m[0],rest=line.slice(label.length).trim();return `<div class="fia-text-row"><div class="fia-text-key">${esc(label)}</div><div>${esc(rest||'—')}</div></div>`;}
    if(/^[A-Z0-9][A-Z0-9 '\-–—&]{8,}$/.test(line))return `<div class="fia-event-title">${esc(line)}</div>`;
    return `<p>${esc(line)}</p>`;
  }).join('');
}
async function renderStewardDoc(id){
  const d=state.stewardDocs[id]; if(!d){setRoute('stewards',false);return;}
  view.innerHTML=`<div class="actions"><button class="external-btn" onclick="history.length>1?history.back():setRoute('stewards')">← STEWARDS</button></div><div class="spacer"></div>${titleBlock(d.kind,'FIA Document')}<div class="card fia-doc-head"><div class="steward-title">${esc(d.title)}</div><div class="news-meta">Official FIA document · opening as readable text inside F1 Hub</div></div><div class="spacer"></div><div id="fia-doc-body" class="card fia-text-card"><div class="loader">Reading FIA document…</div></div>`;
  const root=document.getElementById('fia-doc-body');
  try{
    const raw=await fetchText(JINA+d.url,`fia-doc-${id}`,30*60e3),text=cleanFiaDocument(raw);
    if(!text)throw new Error('empty');
    root.innerHTML=renderFiaText(text)+`<div class="source-note">Text extracted from the official FIA PDF. The original document remains the authoritative source.</div>`;
  }catch{
    root.innerHTML=`<div class="empty">The readable text could not be loaded right now.</div><div class="actions"><a class="external-btn" href="${esc(d.url)}" target="_blank" rel="noopener">OPEN OFFICIAL FIA PDF ↗</a></div>`;
  }
}


async function fetchYearResults(year){
  const key=`history-results-${year}`,cached=cacheGet(key,7*864e5);if(cached)return cached;
  let offset=0,total=Infinity,parts=[];
  while(offset<total){const j=await fetchJSON(`${JOLPICA}/${year}/results/?limit=100&offset=${offset}`,`${key}-${offset}`,7*864e5);const mr=j.MRData||{},rs=mr.RaceTable?.Races||[];parts.push(...rs);total=Number(mr.total||offset+100);if(!rs.length||offset+100>=total)break;offset+=100;await sleep(330);}
  const by={};for(const r of parts){if(!by[r.round])by[r.round]={...r,Results:[]};by[r.round].Results.push(...(r.Results||[]));}
  return cachePut(key,Object.values(by).map(r=>({...r,Results:uniqueBy(r.Results,x=>x.Driver?.driverId||x.number)})).sort((a,b)=>Number(a.round)-Number(b.round)));
}
async function renderHistory(yearArg){
  const y=Math.min(YEAR-1,Math.max(1950,Number(yearArg||state.historyYear||YEAR-1)));state.historyYear=y;
  const years=Array.from({length:YEAR-1950},(_,i)=>YEAR-1-i);
  view.innerHTML=titleBlock('ARCHIVE','F1 History')+`<div class="card history-selector"><label><div class="eyebrow">SEASON</div><select id="history-year">${years.map(x=>`<option value="${x}" ${x===y?'selected':''}>${x}</option>`).join('')}</select></label></div><div id="history-season"><div class="loader">Loading ${y} season…</div></div>`;
  document.getElementById('history-year').onchange=e=>setRoute(`history:${e.target.value}`);
  const root=document.getElementById('history-season');
  try{
    const [races,ds,cs]=await Promise.all([fetchYearResults(y),fetchJSON(`${JOLPICA}/${y}/driverstandings/1/?limit=10`,`history-champ-${y}`,30*864e5),y>=1958?fetchJSON(`${JOLPICA}/${y}/constructorstandings/1/?limit=10`,`history-team-${y}`,30*864e5):Promise.resolve(null)]);
    const champ=ds?.MRData?.StandingsTable?.StandingsLists?.[0]?.DriverStandings?.[0],team=cs?.MRData?.StandingsTable?.StandingsLists?.[0]?.ConstructorStandings?.[0];
    root.innerHTML=`<div class="grid two"><div class="card history-champion"><div class="eyebrow">WORLD CHAMPION</div><div class="record-value">${champ?esc(fullName(champ.Driver)):'—'}</div><div class="muted">${champ?`${esc(champ.points)} pts · ${esc(champ.wins)} wins`:''}</div></div><div class="card history-champion"><div class="eyebrow">CONSTRUCTORS’ CHAMPION</div><div class="record-value">${team?esc(team.Constructor.name):(y<1958?'Not awarded':'—')}</div><div class="muted">${team?`${esc(team.points)} pts · ${esc(team.wins)} wins`:''}</div></div></div><div class="spacer"></div>${titleBlock(`${y} SEASON`,'Race Results')}<div class="grid">${races.map(r=>{const w=(r.Results||[]).find(x=>Number(x.position)===1)||r.Results?.[0];return `<div class="card clickable history-race-card" onclick="setRoute('historyrace:${y}:${r.round}')"><div class="round-box"><small>ROUND</small><b>${esc(r.round)}</b></div><div><div class="race-name">${flag(r.Circuit?.Location?.country)} ${esc(r.raceName)}</div><div class="race-place">${fmtDate(raceIso(r),{day:'numeric',month:'short',year:'numeric'})}</div></div><div class="history-winner"><small>WINNER</small><b>${w?esc(w.Driver.familyName):'—'}</b></div></div>`;}).join('')}</div><div class="source-note">Historical calendars, champions and race classifications are loaded from the Jolpica/Ergast Formula 1 archive.</div>`;
  }catch{root.innerHTML='<div class="error-box">Historical season data is unavailable right now.</div>';}
}
async function renderHistoryRace(year,round){
  const y=Number(year);view.innerHTML=`<div class="actions"><button class="external-btn" onclick="setRoute('history:${y}')">← ${y} SEASON</button></div><div class="spacer"></div><div id="history-race"><div class="loader">Loading race result…</div></div>`;
  const root=document.getElementById('history-race');
  try{
    const [res,q]=await Promise.allSettled([fetchJSON(`${JOLPICA}/${y}/${round}/results/?limit=100`,`history-race-${y}-${round}`,30*864e5),fetchJSON(`${JOLPICA}/${y}/${round}/qualifying/?limit=100`,`history-quali-${y}-${round}`,30*864e5)]);
    const rr=res.status==='fulfilled'?res.value?.MRData?.RaceTable?.Races?.[0]:null,qq=q.status==='fulfilled'?q.value?.MRData?.RaceTable?.Races?.[0]:null;
    if(!rr)throw 0;
    root.innerHTML=titleBlock(`${y} · ROUND ${round}`,rr.raceName)+resultTable('RACE RESULT',rr.Results||[])+(qq?.QualifyingResults?.length?`<div class="spacer"></div>${resultTable('QUALIFYING',qq.QualifyingResults,true)}`:'')+`<div class="source-note">Historical classification via Jolpica/Ergast.</div>`;
  }catch{root.innerHTML='<div class="error-box">This historical race result could not be loaded.</div>';}
}
function recordGrid(rows){return `<div class="grid two">${rows.map(([label,who,value])=>`<div class="card record-card"><div class="eyebrow">${esc(label)}</div><div class="record-value">${esc(value)}</div><div class="record-holder">${esc(who)}</div></div>`).join('')}</div>`;}
function renderRecords(){
  view.innerHTML=titleBlock('ALL-TIME','F1 Records')+`<div class="record-section"><h2>Drivers</h2>${recordGrid(F1_RECORDS.drivers)}</div><div class="record-section"><h2>Teams</h2>${recordGrid(F1_RECORDS.teams)}</div><div class="record-section"><h2>Milestones</h2>${recordGrid(F1_RECORDS.milestones)}</div><div class="source-note">Record values are bundled from Formula1.com career/team statistics and historical records, current to September 2026. They are refreshed when F1 Hub is updated.</div>`;
}

async function renderStats(){view.innerHTML=titleBlock(`${YEAR} SEASON`,'Season Stats')+'<div class="loader">Calculating season stats…</div>';try{const [races,quali]=await getSeasonData();const stats=state.drivers.map(s=>{let pod=0,dnfs=0,poles=0;for(const r of races){const x=(r.Results||[]).find(z=>z.Driver.driverId===s.Driver.driverId);if(x){if(Number(x.position)<=3)pod++;if(dnf(x))dnfs++;}}for(const q of quali){const x=(q.QualifyingResults||[]).find(z=>z.Driver.driverId===s.Driver.driverId);if(Number(x?.position)===1)poles++;}return {s,pod,dnfs,poles};});const leaders=(key,label)=>`<div class="card"><div class="eyebrow">${label}</div>${[...stats].sort((a,b)=>Number(b[key]??b.s[key])-Number(a[key]??a.s[key])).slice(0,5).map((x,i)=>`<div class="standing-row"><div class="pos">${i+1}</div><div class="driver-name">${esc(driverCode(x.s.Driver))} · ${esc(x.s.Driver.familyName)}</div><div class="points">${esc(x[key]??x.s[key])}</div></div>`).join('')}</div>`;view.innerHTML=titleBlock(`${YEAR} SEASON`,'Season Stats')+`<div class="grid two">${leaders('wins','MOST WINS')}${leaders('pod','MOST PODIUMS')}${leaders('poles','MOST POLES')}${leaders('dnfs','MOST DNFs')}</div>`;}catch{view.innerHTML+='<div class="error-box">Season history is unavailable.</div>';}}

function renderCompare(){const opts=state.drivers.map(s=>`<option value="${esc(s.Driver.driverId)}">${esc(fullName(s.Driver))}</option>`).join('');view.innerHTML=titleBlock(`${YEAR} SEASON`,'Driver Compare')+`<div class="card"><div class="grid two"><label><div class="eyebrow">DRIVER A</div><select id="cmp-a" style="width:100%;margin-top:8px;background:#0d0d0d;color:white;border:1px solid #333;border-radius:12px;padding:12px">${opts}</select></label><label><div class="eyebrow">DRIVER B</div><select id="cmp-b" style="width:100%;margin-top:8px;background:#0d0d0d;color:white;border:1px solid #333;border-radius:12px;padding:12px">${opts}</select></label></div><div class="spacer"></div><button id="cmp-go" class="external-btn red">COMPARE</button></div><div id="cmp-out" class="spacer"></div>`;const a=document.getElementById('cmp-a'),b=document.getElementById('cmp-b');b.selectedIndex=Math.min(1,b.options.length-1);document.getElementById('cmp-go').onclick=async()=>{const out=document.getElementById('cmp-out');out.innerHTML='<div class="loader">Comparing…</div>';try{const [races,quali]=await getSeasonData();const byId=Object.fromEntries(state.drivers.map(s=>[s.Driver.driverId,s]));const aa=simpleDriverStats(a.value,races,quali,byId),bb=simpleDriverStats(b.value,races,quali,byId);out.innerHTML=`<div class="card battle-card"><div class="battle-head"><div class="battle-driver">${aa.code}</div><div class="battle-vs">VS</div><div class="battle-driver">${bb.code}</div></div>${[['POINTS','points'],['WINS','wins'],['PODIUMS','pod'],['POLES','poles'],['DNFs','dnfs'],['AVG FINISH','avgF']].map(([l,k])=>`<div class="battle-stat"><b>${aa[k]}</b><div class="mid">${l}</div><b>${bb[k]}</b></div>`).join('')}</div>`;}catch{out.innerHTML='<div class="error-box">Could not load season history.</div>';}};}
function simpleDriverStats(id,races,quali,byId){let pod=0,dnfs=0,poles=0,fin=[];for(const r of races){const x=(r.Results||[]).find(z=>z.Driver.driverId===id);if(x){if(Number(x.position)<=3)pod++;if(dnf(x))dnfs++;if(Number(x.position))fin.push(Number(x.position));}}for(const q of quali){const x=(q.QualifyingResults||[]).find(z=>z.Driver.driverId===id);if(Number(x?.position)===1)poles++;}const s=byId[id];return {code:driverCode(s.Driver),points:s.points,wins:s.wins,pod,poles,dnfs,avgF:fin.length?(fin.reduce((a,b)=>a+b)/fin.length).toFixed(1):'—'};}

function setupPullToRefresh(){
  const indicator=document.getElementById('pull-indicator');
  let startY=0,pulling=false,dist=0;
  const reset=()=>{
    pulling=false;dist=0;
    view.classList.remove('pulling');
    view.style.transform='';
    if(indicator)indicator.classList.remove('show','ready');
  };
  window.addEventListener('touchstart',e=>{
    if(window.scrollY<=0&&!state.refreshing&&e.touches?.length===1){
      startY=e.touches[0].clientY;pulling=true;dist=0;view.classList.add('pulling');
    }
  },{passive:true});
  window.addEventListener('touchmove',e=>{
    if(!pulling||!e.touches?.length)return;
    dist=Math.max(0,e.touches[0].clientY-startY);
    if(dist<5)return;
    const shift=Math.min(62,dist*.34);
    view.style.transform=`translateY(${shift}px)`;
    if(indicator){
      indicator.classList.add('show');
      indicator.classList.toggle('ready',dist>=82);
      indicator.textContent=dist>=82?'RELEASE TO REFRESH':'PULL TO REFRESH';
    }
  },{passive:true});
  window.addEventListener('touchend',async()=>{
    if(!pulling)return;
    const shouldRefresh=dist>=82&&!state.refreshing;
    reset();
    if(shouldRefresh){
      toast('Refreshing…');
      await loadBase(true);
      toast('Updated');
    }
  },{passive:true});
  window.addEventListener('touchcancel',reset,{passive:true});
}

// Navigation / lifecycle
window.setRoute=setRoute;
state.route=decodeURIComponent(location.hash.slice(1)||'home');
function isAppInstalled(){return isStandalone()||state.justInstalled;}
document.body.classList.toggle('standalone',isStandalone());
function updateInstallUI(){
  const installed=isAppInstalled();
  const top=document.getElementById('install-app-btn');
  if(top)top.classList.toggle('hidden',installed||!state.installPrompt);
  if(installed)hideInstallSheet();
}
async function requestInstall(){
  if(isAppInstalled()){updateInstallUI();return;}
  // Pick up an event captured by the early <head> listener, if present.
  if(!state.installPrompt && window.__f1InstallPrompt) state.installPrompt=window.__f1InstallPrompt;
  if(!state.installPrompt){
    toast('Install prompt not ready — refresh once');
    return;
  }
  const p=state.installPrompt;
  state.installPrompt=null;
  window.__f1InstallPrompt=null;
  updateInstallUI();
  try{
    await p.prompt();
    const choice=await p.userChoice;
    if(choice?.outcome==='accepted'){
      state.justInstalled=true;
      hideInstallSheet();
      toast('Installing F1 Hub…');
    }
  }catch{
    toast('Chrome could not open the install prompt');
  }
  updateInstallUI();
  if(state.route==='more')renderMore();
}
function installPromptReady(e){
  if(e){ e.preventDefault(); state.installPrompt=e; window.__f1InstallPrompt=e; }
  else if(window.__f1InstallPrompt){ state.installPrompt=window.__f1InstallPrompt; }
  updateInstallUI();
  if(state.route==='more')renderMore();
}
document.querySelectorAll('.nav-btn').forEach(b=>b.addEventListener('click',()=>setRoute(b.dataset.route)));
document.getElementById('brand-btn').addEventListener('click',()=>setRoute('home'));
document.getElementById('install-app-btn')?.addEventListener('click',requestInstall);
window.addEventListener('popstate',()=>{state.route=decodeURIComponent(location.hash.slice(1)||'home');document.querySelectorAll('.nav-btn').forEach(b=>b.classList.toggle('active',parentNav(state.route)===b.dataset.route));render();});
document.getElementById('refresh-btn').addEventListener('click',async()=>{if(state.refreshing)return;toast('Refreshing…');await loadBase(true);toast('Updated');});
window.addEventListener('online',()=>{document.getElementById('connection-pill').textContent='ONLINE';document.getElementById('connection-pill').className='pill good';});
window.addEventListener('offline',()=>{document.getElementById('connection-pill').textContent='OFFLINE';document.getElementById('connection-pill').className='pill warn';});
window.addEventListener('beforeinstallprompt',installPromptReady);
window.addEventListener('appinstalled',()=>{state.installPrompt=null;window.__f1InstallPrompt=null;state.justInstalled=true;document.body.classList.add('standalone');hideInstallSheet();updateInstallUI();if(state.route==='more')renderMore();toast('F1 Hub installed');});
function showInstallSheet(force=false){if(isAppInstalled()||(!force&&sessionStorage.getItem('f1hub-install-dismissed')))return;const s=document.getElementById('install-sheet');if(s)s.classList.remove('hidden');}
function hideInstallSheet(){document.getElementById('install-sheet')?.classList.add('hidden');}
document.getElementById('install-now')?.addEventListener('click',requestInstall);
document.getElementById('install-later')?.addEventListener('click',()=>{sessionStorage.setItem('f1hub-install-dismissed','1');hideInstallSheet();});
installPromptReady();
if('serviceWorker' in navigator && location.protocol!=='file:')navigator.serviceWorker.register('./service-worker.js',{updateViaCache:'none'}).then(r=>r.update()).catch(()=>{});
if(!navigator.onLine){document.getElementById('connection-pill').textContent='OFFLINE';document.getElementById('connection-pill').className='pill warn';}
updateInstallUI();
setupPullToRefresh();
loadBase();

'use strict';

const YEAR = new Date().getFullYear();
const UK_TZ = 'Europe/London';
const JOLPICA = 'https://api.jolpi.ca/ergast/f1';
const OPENF1 = 'https://api.openf1.org/v1';
const F1_ARCHIVE = 'https://livetiming.formula1.com/static';
const ARCHIVE_INDEX_FALLBACK_API = 'https://f1-live-api.onrender.com';
const RSS2JSON = 'https://api.rss2json.com/v1/api.json?rss_url=';
const NEWS_SOURCES = [
  {id:'F1',name:'F1.com',domain:'formula1.com'},
  {id:'BBC',name:'BBC Sport',domain:'bbc.co.uk',feed:'https://feeds.bbci.co.uk/sport/formula1/rss.xml'},
  {id:'AUTOSPORT',name:'Autosport',domain:'autosport.com',feed:'https://www.autosport.com/rss/f1/news/'},
  {id:'MOTORSPORT',name:'Motorsport.com',domain:'motorsport.com',feed:'https://www.motorsport.com/rss/f1/news/'},
  {id:'RACEFANS',name:'RaceFans',domain:'racefans.net',feed:'https://www.racefans.net/feed/'},
  {id:'THERACE',name:'The Race',domain:'the-race.com',feed:'https://www.the-race.com/category/formula-1/feed/'}
];
const FIA_DOCS = 'https://www.fia.com/documents/formula-1';
const PENALTY_SOURCE = 'https://racingnews365.com/penalty-points-f1-drivers';
const REPRIMAND_SOURCE = 'https://timepenalty.com/guide/reprimand';
const JINA = 'https://r.jina.ai/';
const MOTORSPORT_STANDINGS = `https://www.motorsport.com/f1/standings/${YEAR}/`;
const WIKI_API = 'https://en.wikipedia.org/w/api.php';
const WIKI_REST = 'https://en.wikipedia.org/api/rest_v1/page/summary/';
const APP_VERSION = '1.20.0';
const Q = globalThis.F1HubQuality;
const CD = globalThis.F1HubCarDevelopment;
const CAREER = globalThis.F1HubDriverCareer;
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
  route:'home', schedule:[], drivers:[], constructors:[], photos:{}, wikiPhotos:{}, news:[], newsSource:'ALL', newsVisibleCount:28, spoilerNewsRevealedRound:null, standingsSpoilerRevealedRound:null,
  penaltyPoints:{...FALLBACK_POINTS}, reprimands:{...FALLBACK_REPRIMANDS}, stewardDocs:{}, historyYear:YEAR-1, historyCache:{}, carUpdateDocs:{},
  loaded:false, refreshing:false, newsRefreshing:false, newsUpdatedAt:0, newsLatestArticleAt:0, standingsRefreshing:false, standingsUpdatedAt:0, driverStandingsRound:0, constructorStandingsRound:0, standingsDerivedRound:0, installPrompt:window.__f1InstallPrompt||null, justInstalled:false, countdownTimer:null, dataStamp:null, raceWinners:{}, raceHistory:null, radarTimer:null,
  dataHealth:{}, favouriteDriver:localStorage.getItem('f1hub:favourite-driver')||'', favouriteTeam:localStorage.getItem('f1hub:favourite-team')||'', personalTheme:localStorage.getItem('f1hub:personal-theme')!=='off', lastRaceInsights:{}, updateAvailable:false, routeMotionPending:true, driverCareerCache:{}, weatherSessionByRound:{}, calendarExpandedRound:'', routeMotionDirection:'',
  compareA:'', compareB:'', compareResultHtml:'', compareBusy:false
};
const view = document.getElementById('view');

function esc(v=''){ return String(v).replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c])); }
function sleep(ms){ return new Promise(r=>setTimeout(r,ms)); }
function teamColour(name){ return TEAM_COLOURS[name] || '#777'; }
function shadeHex(hex,factor=.48){
  const m=String(hex||'').match(/^#([0-9a-f]{6})$/i);if(!m)return '#651616';
  const n=parseInt(m[1],16),r=(n>>16)&255,g=(n>>8)&255,b=n&255;
  const f=Math.max(0,Math.min(1,factor));return '#'+[r,g,b].map(v=>Math.round(v*f).toString(16).padStart(2,'0')).join('');
}
function favouriteTeamName(){
  if(state.favouriteTeam)return state.favouriteTeam;
  const s=favouriteDriverStanding();return s?.Constructors?.at(-1)?.name||'';
}
function applyPersonalTheme(){
  const team=state.personalTheme?favouriteTeamName():'';
  const accent=team&&teamColour(team)!=='#777'?teamColour(team):'#ff1e1e';
  document.documentElement.style.setProperty('--red',accent);
  document.documentElement.style.setProperty('--red2',shadeHex(accent,.5));
  document.documentElement.style.setProperty('--theme-soft',shadeHex(accent,.23));
  document.body.classList.toggle('personal-theme',!!team);
  document.body.dataset.themeTeam=team||'default';
  const meta=document.querySelector('meta[name="theme-color"]');if(meta)meta.setAttribute('content','#090909');
}
function isFavouriteDriver(s){return !!s&&s.Driver?.driverId===state.favouriteDriver;}
function isFavouriteTeamName(team){return !!team&&team===favouriteTeamName();}
function favouriteTeamStanding(){const name=favouriteTeamName();return state.constructors.find(c=>c.Constructor?.name===name)||null;}
function myF1Terms(){
  const out=[];const s=favouriteDriverStanding(),team=favouriteTeamName();
  if(s){out.push(fullName(s.Driver),s.Driver.familyName);}
  if(team)out.push(team,team.replace(/ F1 Team$/i,''),team.replace(/ Racing$/i,''));
  return [...new Set(out.map(x=>String(x||'').trim().toLowerCase()).filter(x=>x.length>2))];
}
function myF1News(){const terms=myF1Terms();return terms.length?state.news.filter(n=>{const hay=`${n.title||''} ${n.description||''}`.toLowerCase();return terms.some(t=>hay.includes(t));}):[];}
function openMyF1News(){state.newsSource='ALL';setRoute('news');}
window.openMyF1News=openMyF1News;
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
function cacheStamp(key){try{return JSON.parse(localStorage.getItem('f1hub:'+key)||'null')?.t||0;}catch{return 0;}}
function markHealth(key,status,source,updatedAt=Date.now(),detail='',round=0,maxAgeMs=30*60e3){state.dataHealth[key]={key,status,source,updatedAt,detail,round:Number(round||0),maxAgeMs};}
function healthState(rec){if(!rec)return 'unknown';if(rec.status==='error')return 'error';const f=Q?.freshness(rec.updatedAt,rec.maxAgeMs)||{state:'unknown'};return f.state;}
function healthLabel(rec){if(!rec)return 'Not checked';if(rec.status==='error')return rec.detail||'Unavailable';const age=Q?.ageLabel(rec.updatedAt)||'unknown';return `${rec.source||'Source'} · ${age}`;}
function healthIcon(rec){const st=healthState(rec);return st==='fresh'?'✓':st==='aging'?'~':st==='stale'?'!':st==='error'?'×':'?';}
function currentDataHealthScore(){const vals=Object.values(state.dataHealth);if(!vals.length)return 0;return Math.round(vals.reduce((a,r)=>a+(Q?.freshness(r.updatedAt,r.maxAgeMs)?.score||20),0)/vals.length);}
function saveFavourite(kind,value){if(kind==='driver'){state.favouriteDriver=value;localStorage.setItem('f1hub:favourite-driver',value||'');}else{state.favouriteTeam=value;localStorage.setItem('f1hub:favourite-team',value||'');}render();toast('Preferences saved');}
function favouriteDriverStanding(){return state.drivers.find(s=>s.Driver.driverId===state.favouriteDriver)||null;}
function freshnessStrip(){
  const items=[['Schedule',state.dataHealth.schedule],['Standings',state.dataHealth.standings],['News',state.dataHealth.news]];
  return `<button class="freshness-strip" onclick="setRoute('datahealth')" aria-label="Open data health">${items.map(([n,r])=>`<span class="health-${healthState(r)}"><b>${healthIcon(r)}</b>${esc(n)}</span>`).join('')}<small>DATA HEALTH ›</small></button>`;
}
function downloadTextFile(name,text,type='text/plain'){const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([text],{type}));a.download=name;document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove();},1000);}
function icsDate(iso){return new Date(iso).toISOString().replace(/[-:]/g,'').replace(/\.\d{3}Z$/,'Z');}
function shareText(title,text){if(navigator.share){navigator.share({title,text,url:location.href}).catch(()=>{});return;}navigator.clipboard?.writeText(`${text} ${location.href}`).then(()=>toast('Copied to clipboard')).catch(()=>toast('Share unavailable'));}
function addRaceWeekendCalendar(round){const r=state.schedule.find(x=>String(x.round)===String(round));if(!r)return;const events=sessions(r).map(s=>`BEGIN:VEVENT\r\nUID:f1hub-${YEAR}-${r.round}-${s.key}@f1hub\r\nDTSTAMP:${icsDate(new Date().toISOString())}\r\nDTSTART:${icsDate(s.iso)}\r\nSUMMARY:F1 ${r.raceName} — ${s.name}\r\nDESCRIPTION:F1 Hub race-weekend session (UK time shown in app)\r\nBEGIN:VALARM\r\nTRIGGER:-PT30M\r\nACTION:DISPLAY\r\nDESCRIPTION:${s.name} starts in 30 minutes\r\nEND:VALARM\r\nEND:VEVENT`).join('\r\n');downloadTextFile(`F1-${YEAR}-R${r.round}-${r.Circuit.circuitId}.ics`,`BEGIN:VCALENDAR\r\nVERSION:2.0\r\nPRODID:-//F1 Hub//EN\r\n${events}\r\nEND:VCALENDAR`,'text/calendar');toast('Calendar file created');}

function hydrateBaseFromCache(){
  try{
    const sched=cacheGet('schedule');
    const ds=cacheGet('drivers');
    const cs=cacheGet('constructors');
    const of1=cacheGet('photos');
    let news=cacheGet('news-combined');
    if(!Array.isArray(news)||!news.length){
      const legacy=[];
      for(const src of NEWS_SOURCES){
        const a=cacheGet('news-'+src.id);if(Array.isArray(a))legacy.push(...a);
        const b=cacheGet('news-rss2json-'+src.id);if(Array.isArray(b))legacy.push(...b);
      }
      if(legacy.length){
        const seen=new Set();
        news=legacy.sort((a,b)=>new Date(b.pubDate||0)-new Date(a.pubDate||0)).filter(n=>{const k=String(n.link||n.title||'').replace(/\?.*$/,'').toLowerCase();if(!k||seen.has(k))return false;seen.add(k);return true;}).slice(0,80);
        cachePut('news-combined',news);
      }
    }
    if(sched)state.schedule=sched?.MRData?.RaceTable?.Races||state.schedule;
    if(ds){const table=ds?.MRData?.StandingsTable||{};const rows=table.StandingsLists?.[0]?.DriverStandings||[];if(rows.length){state.drivers=rows;state.driverStandingsRound=Number(table.round||0);}}
    if(cs){const table=cs?.MRData?.StandingsTable||{};const rows=table.StandingsLists?.[0]?.ConstructorStandings||[];if(rows.length){state.constructors=rows;state.constructorStandingsRound=Number(table.round||0);}}
    if(Array.isArray(of1)&&of1.length)state.photos=Object.fromEntries(of1.filter(x=>x.name_acronym).map(x=>[x.name_acronym,x]));
    if(Array.isArray(news)&&news.length){state.news=news;const newest=Math.max(...news.map(n=>new Date(n.pubDate||0).getTime()).filter(Number.isFinite));state.newsLatestArticleAt=Number.isFinite(newest)?newest:0;}
    if(state.schedule.length)markHealth('schedule','ok','Jolpica cache',cacheStamp('schedule'),'Cached season calendar',0,60*60e3);
    if(state.drivers.length&&state.constructors.length)markHealth('standings','ok','Jolpica cache',Math.max(cacheStamp('drivers'),cacheStamp('constructors')),'Cached championship table',Math.min(state.driverStandingsRound,state.constructorStandingsRound),30*60e3);
    if(state.news.length)markHealth('news','ok','News cache',cacheStamp('news-combined'),'Cached multi-source headlines',0,20*60e3);
    state.loaded=state.schedule.length>0||state.drivers.length>0;
    if(state.loaded){state.dataStamp=new Date();render();if(state.routeMotionPending){state.routeMotionPending=false;requestAnimationFrame(animateRouteContent);}}
    return state.loaded;
  }catch{return false;}
}
async function fetchJSON(url,key,maxAge=15*60e3,timeoutMs=14000){
  const fresh=cacheGet(key,maxAge); if(fresh)return fresh;
  try{const c=new AbortController();const t=setTimeout(()=>c.abort(),timeoutMs);const r=await fetch(url,{signal:c.signal});clearTimeout(t);if(!r.ok){const err=new Error(`${r.status}`);err.status=r.status;throw err;}return cachePut(key,await r.json());}
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
function spoilerPrefKey(r){return `f1hub:spoiler-${YEAR}-${r?.round||'none'}`;}
function spoilerPreference(r){
  if(!r)return false;
  const v=localStorage.getItem(spoilerPrefKey(r));
  return v!=='off'; // each race weekend defaults to protected
}
function spoilerActive(){const r=spoilerRace();return !!r&&spoilerPreference(r);}
function isSpoilerRace(r){const x=spoilerRace();return spoilerActive()&&!!x&&String(x.round)===String(r?.round);}
function raceSessionDone(r){const rs=sessions(r).find(x=>x.key==='race');return !!rs&&sessionIsDone(rs);}
function toggleSpoilerMode(){
  const r=spoilerRace();
  if(!r){toast('Spoiler Mode only runs during the current race weekend');return;}
  const turnOn=!spoilerActive();
  try{localStorage.setItem(spoilerPrefKey(r),turnOn?'on':'off');}catch{}
  if(turnOn){state.spoilerNewsRevealedRound=null;state.standingsSpoilerRevealedRound=null;try{localStorage.setItem(headlineRevealKey(r),'off');}catch{}}
  render();toast(`Spoiler Mode ${turnOn?'on':'off'}`);
}
function headlineRevealKey(r){return `f1hub:headline-reveal-${YEAR}-${r?.round||'none'}`;}
function newsSpoilersRevealed(){const sr=spoilerRace();if(!sr)return false;try{return localStorage.getItem(headlineRevealKey(sr))==='on';}catch{return false;}}
function toggleNewsSpoilers(){const sr=spoilerRace();if(!sr)return;const on=!newsSpoilersRevealed();try{localStorage.setItem(headlineRevealKey(sr),on?'on':'off');}catch{} if(state.route==='news')renderNews();else render();toast(`Headlines ${on?'revealed':'hidden'}`);}
function headlineToggleHtml(){const on=newsSpoilersRevealed();return `<button class="spoiler-toggle ${on?'on':'off'}" onclick="toggleNewsSpoilers()" aria-pressed="${on?'true':'false'}" aria-label="${on?'Hide':'Reveal'} headlines"><span class="switch-track"><i></i></span><b>${on?'ON':'OFF'}</b></button>`;}
function revealStandingsSpoilers(){const sr=spoilerRace();state.standingsSpoilerRevealedRound=sr?String(sr.round):null;renderStandings();}
function standingsSpoilersRevealed(){const sr=spoilerRace();return !!sr&&state.standingsSpoilerRevealedRound===String(sr.round);}
window.toggleSpoilerMode=toggleSpoilerMode;window.toggleNewsSpoilers=toggleNewsSpoilers;window.revealStandingsSpoilers=revealStandingsSpoilers;

function circuitSvg(id){ const c=CIRCUITS[id]; if(!c)return null; if(c.f1db)return `https://raw.githubusercontent.com/f1db/f1db/main/src/assets/circuits/white/${c.f1db}`; return c.slug?`https://raw.githubusercontent.com/MasterPlay007/F1-Track-Layouts-SVG/main/${c.slug}.svg`:null; }
function radarUrl(r){ const l=r.Circuit.Location; return `https://www.windy.com/-Weather-radar-radar?radar,${Number(l.lat).toFixed(4)},${Number(l.long).toFixed(4)},9`; }
const CIRCUIT_GEOJSON='https://raw.githubusercontent.com/bacinger/f1-circuits/refs/heads/master/f1-circuits.geojson';
const RAINVIEWER_API='https://api.rainviewer.com/public/weather-maps.json';
function isStandalone(){ return window.matchMedia('(display-mode: standalone)').matches || window.matchMedia('(display-mode: fullscreen)').matches || window.navigator.standalone===true; }
function wikiTitle(d){ return wikiPhotoCandidates(d)[0]||''; }
function wikiPhotoCandidates(d){
  const id=String(d?.driverId||'').toLowerCase();
  const mapped={
    albon:['Alexander Albon','Alex Albon'],
    antonelli:['Andrea Kimi Antonelli','Kimi Antonelli']
  }[id]||[];
  let fromUrl='';
  try{ fromUrl=decodeURIComponent(new URL(d?.url||'').pathname.split('/').pop()||'').replaceAll('_',' '); }catch{}
  const fromName=fullName(d);
  return [...new Set([...mapped, fromUrl, fromName].filter(Boolean))];
}
async function loadWikipediaPhotos(force=false){
  const wanted=state.drivers.map(s=>({id:s.Driver.driverId,titles:wikiPhotoCandidates(s.Driver)})).filter(x=>x.titles.length); if(!wanted.length)return;
  const key=`wiki-photos-${YEAR}`; if(force)localStorage.removeItem('f1hub:'+key);
  const primaryTitles=[...new Set(wanted.map(x=>x.titles[0]).filter(Boolean))];
  const qs=new URLSearchParams({action:'query',format:'json',origin:'*',prop:'pageimages',piprop:'thumbnail',pithumbsize:'1400',redirects:'1',titles:primaryTitles.join('|')});
  try{
    const j=await fetchJSON(`${WIKI_API}?${qs.toString()}`,key,force?1:24*3600e3);
    const pages=Object.values(j?.query?.pages||{});
    const byTitle=Object.fromEntries(pages.filter(x=>x.thumbnail?.source).map(x=>[x.title,x.thumbnail.source]));
    const resolved=Object.fromEntries(wanted.map(x=>[x.id, x.titles.map(t=>byTitle[t]).find(Boolean)]).filter(([,v])=>v));
    const missing=wanted.filter(x=>!resolved[x.id]);
    for(const item of missing){
      for(const title of item.titles){
        try{
          const keyPart=encodeURIComponent(title.replaceAll(' ','_'));
          const summary=await fetchJSON(`${WIKI_REST}${keyPart}`, `wiki-summary-${YEAR}-${item.id}-${keyPart}`, force?1:7*24*3600e3, 12000);
          const thumb=summary?.thumbnail?.source || summary?.originalimage?.source;
          if(thumb){ resolved[item.id]=thumb; break; }
        }catch{}
      }
    }
    state.wikiPhotos=resolved;
  }catch{}
}
function highResDriverPhoto(url){
  const u=String(url||'');
  if(!u)return '';
  // OpenF1 commonly returns Formula1.com's compact 1-column DAM rendition.
  // Request a larger responsive rendition first while retaining the original URL as fallback.
  if(/\.transform\/1col\/image\./i.test(u))return u.replace(/\.transform\/1col\/image\./i,'.transform/4col/image.');
  return u;
}
function originalDriverPhoto(url){
  return String(url||'').replace(/\.transform\/[^/]+\/image\.(png|jpe?g|webp)(?:\?.*)?$/i,'');
}
function driverPhotoUrls(s){
  const d=s?.Driver||s;
  const of=state.photos[driverCode(d)]?.headshot_url;
  const ofHi=highResDriverPhoto(of),ofOriginal=originalDriverPhoto(of);
  const wiki=state.wikiPhotos[d?.driverId];
  const special=/lindblad/i.test(`${d?.driverId||''} ${d?.givenName||''} ${d?.familyName||''}`)?STATIC_DRIVER_PHOTOS.lindblad:null;
  return [...new Set([special,ofHi,ofOriginal,of,wiki].filter(Boolean))];
}
function driverPhotoAttrs(imgs,code){
  const src=imgs?.[0]||'',fallbacks=(imgs||[]).slice(1);
  return src?`src="${esc(src)}" data-fallbacks="${esc(JSON.stringify(fallbacks))}" data-code="${esc(code)}"`:'';
}
function driverPhotoError(img){
  let list=[];
  try{list=JSON.parse(img.dataset.fallbacks||'[]')}catch{}
  const next=list.shift();
  if(next){img.dataset.fallbacks=JSON.stringify(list);img.src=next;return;}
  const old=img.dataset.fallback;
  if(old){img.dataset.fallback='';img.src=old;return;}
  const holder=img.closest('.driver-photo-holder, .profile-photo-holder');
  if(holder){holder.innerHTML=`<div class="avatar ${holder.classList.contains('profile-photo-holder')?'profile-avatar':''}">${esc(img.dataset.code||'---')}</div>`;} else {img.style.display='none';}
}
window.driverPhotoError=driverPhotoError;

function rssCacheBust(url){
  try{const u=new URL(url);u.searchParams.set('_f1hub',String(Math.floor(Date.now()/300000)));return u.toString();}catch{return url;}
}
async function fetchNewsText(url,force=false,timeoutMs=10000){
  const target=force?rssCacheBust(url):url;
  const c=new AbortController();const timer=setTimeout(()=>c.abort(),timeoutMs);
  try{
    const r=await fetch(target,{signal:c.signal,cache:'no-store'});
    if(!r.ok)throw new Error(`${r.status}`);
    return await r.text();
  } finally { clearTimeout(timer); }
}
async function fetchNewsJSONNoCache(url,timeoutMs=10000){
  const c=new AbortController();const timer=setTimeout(()=>c.abort(),timeoutMs);
  try{
    const r=await fetch(url,{signal:c.signal,cache:'no-store'});
    if(!r.ok)throw new Error(`${r.status}`);
    return await r.json();
  } finally { clearTimeout(timer); }
}
function xmlNodeText(node,names){
  for(const name of names){const el=node.getElementsByTagName(name)?.[0];const v=el?.textContent?.trim();if(v)return v;}return '';
}
function rssImage(node,description=''){
  for(const name of ['media:content','media:thumbnail','enclosure']){
    const els=[...(node.getElementsByTagName(name)||[])];
    for(const el of els){const u=el.getAttribute?.('url');const type=el.getAttribute?.('type')||'';if(u&&(name!=='enclosure'||!type||type.startsWith('image/')))return u;}
  }
  const m=String(description||'').match(/<img[^>]+src=["']([^"']+)["']/i);return m?.[1]||'';
}
function cleanAggregatedTitle(title,src){
  let t=String(title||'').trim();
  for(const suffix of [` - ${src.name}`,` – ${src.name}`,` | ${src.name}`])if(t.endsWith(suffix))t=t.slice(0,-suffix.length).trim();
  return t;
}
function parseRSS(xml,src){
  const doc=new DOMParser().parseFromString(String(xml||''),'application/xml');
  if(doc.querySelector('parsererror'))return [];
  const nodes=[...doc.getElementsByTagName('item'),...doc.getElementsByTagName('entry')];
  return nodes.slice(0,24).map(node=>{
    const title=cleanAggregatedTitle(xmlNodeText(node,['title']),src);
    let link='';
    for(const el of [...(node.getElementsByTagName('link')||[])]){link=el.getAttribute?.('href')||el.textContent?.trim()||'';if(link)break;}
    const pubDate=xmlNodeText(node,['pubDate','published','updated','dc:date']);
    const description=xmlNodeText(node,['description','summary','content','content:encoded']);
    return {title,link,pubDate,thumbnail:rssImage(node,description),description,source:src.name,sourceId:src.id};
  }).filter(x=>x.title&&x.link);
}
function googleNewsRss(src){
  const u=new URL('https://news.google.com/rss/search');
  u.searchParams.set('q',`Formula 1 site:${src.domain} when:1d`);
  u.searchParams.set('hl','en-GB');u.searchParams.set('gl','GB');u.searchParams.set('ceid','GB:en');
  u.searchParams.set('_f1hub',String(Math.floor(Date.now()/300000)));
  return u.toString();
}
function normaliseNewsJsonItems(j,src){
  if(j?.status!=='ok')return [];
  return (j.items||[]).slice(0,20).map(n=>({...n,title:cleanAggregatedTitle(n.title,src),source:src.name,sourceId:src.id})).filter(x=>x.title&&x.link);
}
async function fetchGoogleNewsItems(src){
  const feed=googleNewsRss(src);
  const bucket=Math.floor(Date.now()/300000);
  const url=RSS2JSON+encodeURIComponent(feed)+`&_f1hub=${bucket}`;
  try{return normaliseNewsJsonItems(await fetchNewsJSONNoCache(url,10000),src);}catch{return [];}
}
async function fetchPublisherItems(src,force=false){
  if(!src.feed)return [];
  const direct=(async()=>{try{const xml=await fetchNewsText(src.feed,force,8000);return parseRSS(xml,src);}catch{return [];}})();
  const proxy=(async()=>{try{const target=force?rssCacheBust(src.feed):src.feed;const raw=`https://api.allorigins.win/raw?url=${encodeURIComponent(target)}`;const xml=await fetchNewsText(raw,false,9000);return parseRSS(xml,src);}catch{return [];}})();
  const legacy=(async()=>{try{const target=force?rssCacheBust(src.feed):src.feed;const url=RSS2JSON+encodeURIComponent(target)+`&_f1hub=${Math.floor(Date.now()/300000)}`;return normaliseNewsJsonItems(await fetchNewsJSONNoCache(url),src);}catch{return [];}})();
  const settled=await Promise.allSettled([direct,proxy,legacy]);
  return settled.flatMap(x=>x.status==='fulfilled'?x.value:[]);
}
async function fetchRSSItems(src,force=false){
  const [googleItems,publisherItems]=await Promise.all([fetchGoogleNewsItems(src),fetchPublisherItems(src,force)]);
  const all=[...googleItems,...publisherItems];
  const seen=new Set();
  return all.sort((a,b)=>new Date(b.pubDate||0)-new Date(a.pubDate||0)).filter(n=>{
    const title=String(n.title||'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
    const key=title||String(n.link||'').replace(/\?.*$/,'').toLowerCase();
    if(!key||seen.has(key))return false;seen.add(key);return true;
  }).slice(0,24);
}

const F1_NEWS_INCLUDE=[
  'formula 1','f1','grand prix','gp','fia','qualifying','sprint','steward','paddock','pit lane','pole position','race control',
  'verstappen','norris','piastri','leclerc','hamilton','russell','antonelli','sainz','alonso','stroll','albon','hulkenberg','ocon','gasly','tsunoda','hadjar','bearman','bottas',
  'ferrari','mclaren','mercedes','red bull','williams','haas','sauber','aston martin','alpine','racing bulls','cadillac',
  'monza','silverstone','spa','suzuka','interlagos','miami','bahrain','jeddah','singapore','las vegas','hungary','imola'
];
const F1_NEWS_EXCLUDE=[
  'tennis','us open','wheelchair','doubles','atp','wta','wimbledon','roland garros','golf','football','soccer','rugby','cricket','nba','nfl','baseball','hockey'
];
function newsTextBlob(n){return [n?.title,n?.description,n?.link,n?.source].filter(Boolean).join(' ').toLowerCase();}
function looksLikeF1Story(n){
  const t=newsTextBlob(n);
  if(!t)return false;
  if(F1_NEWS_EXCLUDE.some(x=>t.includes(x))&&!(/formula 1|\bf1\b/.test(t)))return false;
  if(F1_NEWS_INCLUDE.some(x=>t.includes(x)))return true;
  return /\bf1\b|formula\s*1|grand prix|qualifying|sprint|steward|paddock/.test(t);
}
async function loadNewsSources(force=false){

  if(force)NEWS_SOURCES.forEach(src=>{localStorage.removeItem('f1hub:news-'+src.id);localStorage.removeItem('f1hub:news-rss2json-'+src.id);});
  const settled=await Promise.allSettled(NEWS_SOURCES.map(src=>fetchRSSItems(src,force)));
  const items=settled.flatMap(x=>x.status==='fulfilled'?x.value:[]);
  const seen=new Set();
  const fresh=items.sort((a,b)=>new Date(b.pubDate||0)-new Date(a.pubDate||0)).filter(n=>looksLikeF1Story(n)).filter(n=>{const k=(n.link||n.title||'').replace(/\?.*$/,'').toLowerCase();if(!k||seen.has(k))return false;seen.add(k);return true;}).slice(0,80);
  if(fresh.length){
    state.news=fresh;cachePut('news-combined',fresh);state.newsUpdatedAt=Date.now();
    const newest=Math.max(...fresh.map(n=>new Date(n.pubDate||0).getTime()).filter(Number.isFinite));
    state.newsLatestArticleAt=Number.isFinite(newest)?newest:0;
    markHealth('news','ok','Publisher + Google News RSS',state.newsUpdatedAt,`${fresh.length} stories · newest ${Q?.ageLabel(state.newsLatestArticleAt)||''}`,0,20*60e3);
  } else {
    const old=cacheGet('news-combined');
    if(old?.length){state.news=old;const newest=Math.max(...old.map(n=>new Date(n.pubDate||0).getTime()).filter(Number.isFinite));state.newsLatestArticleAt=Number.isFinite(newest)?newest:0;markHealth('news','ok','Cached news',cacheStamp('news-combined'),'Live sources unavailable; showing cached stories',0,20*60e3);}
    else markHealth('news','error','News sources',Date.now(),'No news source returned stories',0,20*60e3);
  }
  return state.news;
}
async function refreshNewsOnly(force=false){
  if(state.newsRefreshing)return;
  state.newsRefreshing=true;
  try{await loadNewsSources(force);}finally{state.newsRefreshing=false;if(state.route==='news')renderNews();}
}

async function loadBase(force=false){
  state.refreshing=true;
  if(force){['schedule','drivers','constructors','photos','wiki-photos-'+YEAR].forEach(k=>localStorage.removeItem('f1hub:'+k));}

  state.newsRefreshing=true;
  const newsTask=loadNewsSources(force).catch(()=>{}).finally(()=>{state.newsRefreshing=false;if(state.route==='news')renderNews();});
  let standingsTask=Promise.resolve();
  let wikiTask=Promise.resolve();

  try{
    const [sched,ds,cs,of1] = await Promise.allSettled([
      fetchJSON(`${JOLPICA}/${YEAR}/?limit=100`,'schedule',force?1:30*60e3),
      fetchJSON(`${JOLPICA}/${YEAR}/driverstandings/?limit=100`,'drivers',force?1:15*60e3),
      fetchJSON(`${JOLPICA}/${YEAR}/constructorstandings/?limit=100`,'constructors',force?1:15*60e3),
      fetchJSON(`${OPENF1}/drivers?session_key=latest`,'photos',force?1:6*3600e3)
    ]);
    if(sched.status==='fulfilled'){
      const rows=sched.value?.MRData?.RaceTable?.Races||[];
      if(rows.length>=10){state.schedule=rows;markHealth('schedule','ok','Jolpica',Date.now(),`${rows.length} rounds`,0,60*60e3);updateLaunchContent();}else if(!state.schedule.length)markHealth('schedule','error','Jolpica',Date.now(),'Calendar response failed validation',0,60*60e3);
    }else if(!state.schedule.length)markHealth('schedule','error','Jolpica',Date.now(),'Calendar request failed',0,60*60e3);
    if(ds.status==='fulfilled'){
      const table=ds.value?.MRData?.StandingsTable||{};
      const rows=table.StandingsLists?.[0]?.DriverStandings||[];
      const v=Q?.validateStandings(rows,{minEntries:18})||{ok:!!rows.length};
      if(v.ok){state.drivers=rows;state.driverStandingsRound=Number(table.round||0);}
    }
    if(cs.status==='fulfilled'){
      const table=cs.value?.MRData?.StandingsTable||{};
      const rows=table.StandingsLists?.[0]?.ConstructorStandings||[];
      const v=Q?.validateStandings(rows,{minEntries:8})||{ok:!!rows.length};
      if(v.ok){state.constructors=rows;state.constructorStandingsRound=Number(table.round||0);}
    }
    if(state.drivers.length&&state.constructors.length)markHealth('standings','ok','Jolpica',Date.now(),`Round ${Math.min(state.driverStandingsRound,state.constructorStandingsRound)||'—'}`,Math.min(state.driverStandingsRound,state.constructorStandingsRound),30*60e3);
    else markHealth('standings','error','Jolpica',Date.now(),'Championship response failed validation',0,30*60e3);
    if(of1.status==='fulfilled'&&of1.value?.length){state.photos=Object.fromEntries(of1.value.filter(x=>x.name_acronym).map(x=>[x.name_acronym,x]));markHealth('photos','ok','OpenF1',Date.now(),`${of1.value.length} driver records`,0,24*3600e3);}

    state.loaded=state.schedule.length>0||state.drivers.length>0;
    state.dataStamp=new Date();
    applyPersonalTheme();
    if(state.route!=='compare'||!document.querySelector('.compare-page'))render();
    if(state.routeMotionPending){state.routeMotionPending=false;requestAnimationFrame(animateRouteContent);}

    standingsTask=refreshPostRaceStandings().then(()=>{if(['standings','home','drivers','teams'].includes(state.route))render();}).catch(()=>{});
    wikiTask=loadWikipediaPhotos(force).then(()=>{if(state.route==='drivers'||state.route.startsWith('driver:'))render();}).catch(()=>{});

    if(force)await Promise.allSettled([newsTask,standingsTask,wikiTask]);
  } finally {
    state.refreshing=false;
    if(force&&state.loaded&&(state.route!=='compare'||!document.querySelector('.compare-page')))render();
  }
  refreshPenaltyData();
  preloadRaceWinners(force);
}

function latestCompletedRace(){
  return state.schedule.filter(r=>raceSessionDone(r)).slice().sort((a,b)=>Number(b.round)-Number(a.round))[0]||null;
}
function teamStandingsKey(name=''){
  const s=String(name).toLowerCase().replace(/[^a-z0-9]+/g,'');
  if(s.includes('racingbull')||s.includes('rbf1'))return 'racingbulls';
  if(s.includes('redbull'))return 'redbull';
  if(s.includes('mercedes'))return 'mercedes';
  if(s.includes('ferrari'))return 'ferrari';
  if(s.includes('mclaren'))return 'mclaren';
  if(s.includes('astonmartin'))return 'astonmartin';
  if(s.includes('williams'))return 'williams';
  if(s.includes('haas'))return 'haas';
  if(s.includes('alpine'))return 'alpine';
  if(s.includes('audi'))return 'audi';
  if(s.includes('cadillac'))return 'cadillac';
  return s;
}
function addMapPoint(map,key,value){const n=Number(value||0);if(key&&Number.isFinite(n))map[key]=(map[key]||0)+n;}
function pointsForPosition(pos,sprint=false){const p=Number(pos),scale=sprint?[8,7,6,5,4,3,2,1]:[25,18,15,12,10,8,6,4,2,1];return Number.isFinite(p)&&p>=1&&p<=scale.length?scale[p-1]:0;}
async function weekendPoints(r){
  const driverPoints={},teamPoints={};let raceWinnerCode='',raceWinnerTeam='',hadData=false;
  const ss=sessions(r),scored=[];const sprint=ss.find(x=>x.key==='sprint'),race=ss.find(x=>x.key==='race');if(sprint&&sessionIsDone(sprint))scored.push(sprint);if(race&&sessionIsDone(race))scored.push(race);
  for(const s of scored){
    let used=false;
    try{
      const endpoint=s.key==='sprint'?'sprint':'results';
      const j=await fetchNoStoreJSON(`${JOLPICA}/${YEAR}/${r.round}/${endpoint}/?limit=100&_=${Date.now()}`),rr=j?.MRData?.RaceTable?.Races?.[0],rows=s.key==='sprint'?(rr?.SprintResults||[]):(rr?.Results||[]);
      if(rows.length){for(const x of rows){const pts=Number(x.points||0),code=driverCode(x.Driver),team=x.Constructor?.name||'';addMapPoint(driverPoints,code,pts);addMapPoint(teamPoints,teamStandingsKey(team),pts);if(s.key==='race'&&Number(x.position)===1){raceWinnerCode=code;raceWinnerTeam=teamStandingsKey(team);}}used=true;hadData=true;}
    }catch{}
    if(used)continue;
    try{
      const os=await openF1Session(r,s);if(!os)continue;
      const [rows,drivers]=await Promise.all([fetchNoStoreJSON(`${OPENF1}/session_result?session_key=${os.session_key}`),fetchNoStoreJSON(`${OPENF1}/drivers?session_key=${os.session_key}`)]),dmap=openF1DriverMap(drivers);
      for(const x of rows||[]){const p=validSessionPosition(x);if(p===null)continue;hadData=true;const d=dmap[String(x.driver_number)]||{},code=d.name_acronym||'',team=teamStandingsKey(d.team_name||''),pts=pointsForPosition(p,s.key==='sprint');addMapPoint(driverPoints,code,pts);addMapPoint(teamPoints,team,pts);if(s.key==='race'&&p===1){raceWinnerCode=code;raceWinnerTeam=team;}}
    }catch{}
  }
  return {driverPoints,teamPoints,raceWinnerCode,raceWinnerTeam,hadData};
}
function standingsNameKey(v=''){return String(v).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,' ');}
function cleanMarkdownCell(v=''){return String(v).replace(/\[([^\]]+)\]\([^)]+\)/g,'$1').replace(/[*_`]/g,'').trim();}
function parseMotorsportDriverStandings(text){
  const lines=String(text||'').split(/\r?\n/),start=lines.findIndex(x=>/^###\s+Drivers\s*$/i.test(x.trim()));if(start<0)return [];
  const out=[];
  for(const line of lines.slice(start+1)){
    if(/^####\s+Subscribe/i.test(line)||/^###\s+Teams/i.test(line))break;
    if(!line.includes('|'))continue;
    const cells=line.split('|').map(cleanMarkdownCell);const pos=Number(cells[0]),ptsText=String(cells[2]||'').trim();if(!Number.isFinite(pos)||pos<1)continue;
    const points=ptsText===''?0:Number(ptsText.replace(/[^0-9.\-]/g,''));if(!Number.isFinite(points))continue;
    out.push({position:pos,name:cells[1]||'',points});
  }
  return out;
}
async function refreshDriversFromMotorsport(targetRound,baseRound){
  try{
    const text=await fetchNoStoreText(`${JINA}${MOTORSPORT_STANDINGS}?_=${Date.now()}`),rows=parseMotorsportDriverStandings(text);if(rows.length<20)return false;
    const byFamily=new Map(state.drivers.map(s=>[standingsNameKey(s.Driver?.familyName),s]));const matched=[];
    for(const row of rows){const key=standingsNameKey(row.name);let current=null;for(const [family,s] of byFamily){if(family&&key.includes(family)){current=s;break;}}if(current)matched.push({...current,position:String(row.position),positionText:String(row.position),points:String(row.points)});}
    if(matched.length<Math.min(20,state.drivers.length))return false;
    const existing=new Map(matched.map(x=>[x.Driver.driverId,x]));state.drivers=state.drivers.map(x=>existing.get(x.Driver.driverId)||x);
    if(Number(baseRound||0)>0&&Number(baseRound)<targetRound){for(const r of state.schedule.filter(x=>Number(x.round)>Number(baseRound)&&Number(x.round)<=targetRound&&raceSessionDone(x)).sort((a,b)=>Number(a.round)-Number(b.round))){const pts=await weekendPoints(r);if(pts.hadData&&pts.raceWinnerCode){state.drivers=state.drivers.map(x=>driverCode(x.Driver)===pts.raceWinnerCode?{...x,wins:String(Number(x.wins||0)+1)}:x);}}}
    state.drivers=state.drivers.slice().sort((a,b)=>Number(a.position)-Number(b.position));state.driverStandingsRound=targetRound;state.standingsDerivedRound=targetRound;return true;
  }catch{return false;}
}
function resortDriverStandings(rows){const indexed=rows.map((x,i)=>({x,i})).sort((a,b)=>Number(b.x.points)-Number(a.x.points)||Number(b.x.wins)-Number(a.x.wins)||a.i-b.i);return indexed.map(({x},i)=>({...x,position:String(i+1),positionText:String(i+1)}));}
function resortConstructorStandings(rows){const indexed=rows.map((x,i)=>({x,i})).sort((a,b)=>Number(b.x.points)-Number(a.x.points)||Number(b.x.wins)-Number(a.x.wins)||a.i-b.i);return indexed.map(({x},i)=>({...x,position:String(i+1),positionText:String(i+1)}));}
async function deriveStandingsThroughRound(targetRound){
  const dBase=Number(state.driverStandingsRound||0),cBase=Number(state.constructorStandingsRound||0),start=Math.min(dBase||Infinity,cBase||Infinity);if(!Number.isFinite(start)||start>=targetRound)return false;
  const missing=state.schedule.filter(r=>Number(r.round)>start&&Number(r.round)<=targetRound&&raceSessionDone(r)).sort((a,b)=>Number(a.round)-Number(b.round));if(!missing.length)return false;
  let drivers=state.drivers.map(x=>({...x})),constructors=state.constructors.map(x=>({...x}));let changed=false;
  for(const r of missing){
    const pts=await weekendPoints(r),rn=Number(r.round);if(!pts.hadData)continue;
    if(dBase<rn){drivers=drivers.map(x=>{const code=driverCode(x.Driver),add=Number(pts.driverPoints[code]||0);return {...x,points:String(Number(x.points||0)+add),wins:String(Number(x.wins||0)+(pts.raceWinnerCode===code?1:0))};});changed=true;}
    if(cBase<rn){constructors=constructors.map(x=>{const key=teamStandingsKey(x.Constructor?.name),add=Number(pts.teamPoints[key]||0);return {...x,points:String(Number(x.points||0)+add),wins:String(Number(x.wins||0)+(pts.raceWinnerTeam===key?1:0))};});changed=true;}
  }
  if(changed){if(dBase<targetRound){state.drivers=resortDriverStandings(drivers);state.driverStandingsRound=targetRound;}if(cBase<targetRound){state.constructors=resortConstructorStandings(constructors);state.constructorStandingsRound=targetRound;}state.standingsDerivedRound=targetRound;}
  return changed;
}
async function deriveStandingsFromPreviousRound(targetRound){
  const round=Number(targetRound||0);if(round<=1)return false;
  const race=state.schedule.find(r=>Number(r.round)===round);if(!race)return false;
  try{
    const [dprev,cprev,pts]=await Promise.all([
      fetchNoStoreJSON(`${JOLPICA}/${YEAR}/${round-1}/driverstandings/?limit=100&_=${Date.now()}`),
      fetchNoStoreJSON(`${JOLPICA}/${YEAR}/${round-1}/constructorstandings/?limit=100&_=${Date.now()}`),
      weekendPoints(race)
    ]);
    if(!pts.hadData)return false;
    const drows=dprev?.MRData?.StandingsTable?.StandingsLists?.[0]?.DriverStandings||[];
    const crows=cprev?.MRData?.StandingsTable?.StandingsLists?.[0]?.ConstructorStandings||[];
    if(!(Q?.validateStandings(drows,{minEntries:18})?.ok))return false;
    if(!(Q?.validateStandings(crows,{minEntries:8})?.ok))return false;
    const expectedD=Q?.provisionalStandings(drows,pts.driverPoints,Object.fromEntries(Object.keys(pts.driverPoints).map(k=>[k,pts.raceWinnerCode===k?1:0])),x=>driverCode(x.Driver))||drows;
    const expectedC=Q?.provisionalStandings(crows,pts.teamPoints,Object.fromEntries(Object.keys(pts.teamPoints).map(k=>[k,pts.raceWinnerTeam===k?1:0])),x=>teamStandingsKey(x.Constructor?.name))||crows;
    const currentD=Object.fromEntries(state.drivers.map(x=>[driverCode(x.Driver),Number(x.points||0)]));
    const currentC=Object.fromEntries(state.constructors.map(x=>[teamStandingsKey(x.Constructor?.name),Number(x.points||0)]));
    const dMismatch=expectedD.some(x=>currentD[driverCode(x.Driver)]!==Number(x.points||0));
    const cMismatch=expectedC.some(x=>currentC[teamStandingsKey(x.Constructor?.name)]!==Number(x.points||0));
    const sum=a=>a.reduce((n,x)=>n+Number(x.points||0),0),prevDTotal=sum(drows),prevCTotal=sum(crows),curDTotal=sum(state.drivers),curCTotal=sum(state.constructors);
    const dLooksStale=Number(state.driverStandingsRound||0)<round||Math.abs(curDTotal-prevDTotal)<0.01;
    const cLooksStale=Number(state.constructorStandingsRound||0)<round||Math.abs(curCTotal-prevCTotal)<0.01;
    const applyD=dMismatch&&dLooksStale,applyC=cMismatch&&cLooksStale;
    if(applyD){state.drivers=expectedD;state.driverStandingsRound=round;}
    if(applyC){state.constructors=expectedC;state.constructorStandingsRound=round;}
    if(applyD||applyC){state.standingsDerivedRound=round;markHealth('standings','ok','Validated previous round + race classification',Date.now(),`Provisional Round ${round} while primary feed catches up`,round,30*60e3);return true;}
    return false;
  }catch{return false;}
}

async function refreshPostRaceStandings(){
  const latest=latestCompletedRace();if(!latest)return false;const round=Number(latest.round||0);if(!round)return false;
  const recent=Date.now()-new Date(raceIso(latest)).getTime()<36*3600e3;
  const baseDriverRound=Number(state.driverStandingsRound||0);
  if(baseDriverRound>=round&&Number(state.constructorStandingsRound||0)>=round&&!recent){state.standingsDerivedRound=0;state.standingsUpdatedAt=Date.now();return true;}
  const [ds,cs]=await Promise.allSettled([fetchNoStoreJSON(`${JOLPICA}/${YEAR}/${round}/driverstandings/?limit=100&_=${Date.now()}`),fetchNoStoreJSON(`${JOLPICA}/${YEAR}/${round}/constructorstandings/?limit=100&_=${Date.now()}`)]);
  if(ds.status==='fulfilled'){const table=ds.value?.MRData?.StandingsTable||{},rows=table.StandingsLists?.[0]?.DriverStandings||[],rr=Number(table.round||round),v=Q?.validateStandings(rows,{minEntries:18});if(v?.ok&&rr>=round){state.drivers=rows;state.driverStandingsRound=round;}}
  if(cs.status==='fulfilled'){const table=cs.value?.MRData?.StandingsTable||{},rows=table.StandingsLists?.[0]?.ConstructorStandings||[],rr=Number(table.round||round),v=Q?.validateStandings(rows,{minEntries:8});if(v?.ok&&rr>=round){state.constructors=rows;state.constructorStandingsRound=round;}}
  if(recent||Number(state.driverStandingsRound||0)<round)await refreshDriversFromMotorsport(round,baseDriverRound);
  if(Number(state.driverStandingsRound||0)<round||Number(state.constructorStandingsRound||0)<round)await deriveStandingsThroughRound(round);
  await deriveStandingsFromPreviousRound(round);
  if(Number(state.driverStandingsRound||0)>=round&&Number(state.constructorStandingsRound||0)>=round&&state.standingsDerivedRound!==round)state.standingsDerivedRound=0;
  state.standingsUpdatedAt=Date.now();
  const source=state.standingsDerivedRound===round?'Validated provisional table':'Jolpica / cross-checked';
  markHealth('standings','ok',source,state.standingsUpdatedAt,`Round ${round}`,round,30*60e3);
  return true;
}
async function refreshChampionshipOnly(){
  if(state.standingsRefreshing)return;state.standingsRefreshing=true;
  try{
    const [ds,cs]=await Promise.allSettled([fetchNoStoreJSON(`${JOLPICA}/${YEAR}/driverstandings/?limit=100&_=${Date.now()}`),fetchNoStoreJSON(`${JOLPICA}/${YEAR}/constructorstandings/?limit=100&_=${Date.now()}`)]);
    if(ds.status==='fulfilled'){const table=ds.value?.MRData?.StandingsTable||{},rows=table.StandingsLists?.[0]?.DriverStandings||[],v=Q?.validateStandings(rows,{minEntries:18});if(v?.ok){state.drivers=rows;state.driverStandingsRound=Number(table.round||0);}}
    if(cs.status==='fulfilled'){const table=cs.value?.MRData?.StandingsTable||{},rows=table.StandingsLists?.[0]?.ConstructorStandings||[],v=Q?.validateStandings(rows,{minEntries:8});if(v?.ok){state.constructors=rows;state.constructorStandingsRound=Number(table.round||0);}}
    state.standingsDerivedRound=0;await refreshPostRaceStandings();if(['standings','home','drivers','teams'].includes(state.route))render();
  }finally{state.standingsRefreshing=false;state.standingsUpdatedAt=Date.now();}
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

const TOP_LEVEL_ROUTES=['home','races','standings','news','more'];
const SWIPE_META={home:['⌂','HOME'],races:['▦','RACES'],standings:['🏆','STANDINGS'],news:['◫','NEWS'],more:['☰','MORE']};
function parentNav(route){ if(TOP_LEVEL_ROUTES.includes(route))return route; if(route.startsWith('race:')||route.startsWith('session:')||route.startsWith('telemetry:')||route.startsWith('carupdates:')||route.startsWith('circuit:')||route.startsWith('radar:'))return 'races'; return 'more'; }
function swipeTarget(route,dx){const i=TOP_LEVEL_ROUTES.indexOf(route);if(i<0)return null;const n=i+(dx<0?1:-1);return n>=0&&n<TOP_LEVEL_ROUTES.length?TOP_LEVEL_ROUTES[n]:null;}
function animateRouteContent(direction=state.routeMotionDirection){
  if(matchMedia('(prefers-reduced-motion: reduce)').matches){state.routeMotionDirection='';return;}
  const cls=direction==='left'?'route-swipe-left':direction==='right'?'route-swipe-right':'route-enter';
  view.classList.remove('route-enter','route-swipe-left','route-swipe-right');void view.offsetWidth;view.classList.add(cls);
  const els=[...view.querySelectorAll('.card,.session-row,.calendar-race,.menu-card,.driver-card')].slice(0,16);
  els.forEach((el,i)=>{el.classList.remove('stagger-enter');el.style.setProperty('--stagger',`${Math.min(i,10)*24}ms`);void el.offsetWidth;el.classList.add('stagger-enter');});
  setTimeout(()=>{view.classList.remove('route-enter','route-swipe-left','route-swipe-right');els.forEach(el=>el.classList.remove('stagger-enter'));},650);
  state.routeMotionDirection='';
}
function setRoute(route,push=true,motion=''){ if(!route)return; const changed=route!==state.route;state.route=route;state.routeMotionDirection=motion; if(push && location.hash!==`#${encodeURIComponent(route)}`)history.pushState({route},'',`#${encodeURIComponent(route)}`); window.scrollTo({top:0,behavior:'instant'}); const parent=parentNav(route);document.querySelectorAll('.nav-btn').forEach(b=>b.classList.toggle('active',parent===b.dataset.route)); render(); if(changed)requestAnimationFrame(()=>animateRouteContent(motion)); if(route==='news'&&!state.news.length&&!state.newsRefreshing)setTimeout(()=>refreshNewsOnly(true),0); }

function render(){
  clearInterval(state.countdownTimer);clearInterval(state.radarTimer);state.radarTimer=null;
  document.body.classList.toggle('compare-route',state.route==='compare');
  if(!state.loaded){view.innerHTML='<div class="loader">Loading F1 Hub…</div>';return;}
  const r=state.route;
  if(r==='home')return renderHome(); if(r==='races')return renderRaces(); if(r==='standings')return renderStandings(); if(r==='news')return renderNews(); if(r==='more')return renderMore();
  if(r.startsWith('race:'))return renderRaceDetail(r.split(':')[1]); if(r.startsWith('session:')){const [,round,key]=r.split(':');return renderSessionResult(round,key);} if(r.startsWith('telemetry:')){const [,round,key]=r.split(':');return renderTelemetry(round,key);} if(r.startsWith('carupdates:'))return renderCarUpdates(r.split(':')[1]); if(r.startsWith('driver:'))return renderDriver(r.slice(7)); if(r.startsWith('circuit:'))return renderCircuit(r.split(':')[1]); if(r.startsWith('radar:'))return renderRadar(r.split(':')[1]); if(r.startsWith('stewarddoc:'))return renderStewardDoc(r.slice(11));
  if(r.startsWith('historyrace:')){const [,y,round]=r.split(':');return renderHistoryRace(y,round);} if(r.startsWith('history:'))return renderHistory(r.split(':')[1]);
  if(r==='drivers')return renderDrivers(); if(r==='trends')return renderTrends(); if(r==='teams')return renderTeams(); if(r==='circuits')return renderCircuits(); if(r==='penalties')return renderPenalties(); if(r==='battles')return renderBattles(); if(r==='stewards')return renderStewards(); if(r==='stats')return renderStats(); if(r==='compare')return renderCompare(); if(r==='history')return renderHistory(); if(r==='records')return renderRecords(); if(r==='updates')return renderUpdates(); if(r==='preferences')return renderPreferences(); if(r==='datahealth')return renderDataHealth();
  renderHome();
}
function titleBlock(eyebrow,title,right=''){ return `<div class="section-head"><div><div class="eyebrow">${esc(eyebrow)}</div><h1>${esc(title)}</h1></div>${right}</div>`; }
function spoilerPill(){return spoilerActive()?'<span class="pill spoiler">SPOILER MODE</span>':'';}
function spoilerToggleHtml(compact=false){
  const r=spoilerRace();if(!r)return '';
  const on=spoilerActive();
  return `<button class="spoiler-toggle ${on?'on':'off'} ${compact?'compact':''}" onclick="toggleSpoilerMode()" aria-pressed="${on?'true':'false'}" aria-label="Turn Spoiler Mode ${on?'off':'on'}"><span class="switch-track"><i></i></span><b>${on?'ON':'OFF'}</b></button>`;
}
function spoilerSettingsCard(){
  const r=spoilerRace();
  if(r)return `<div class="card spoiler-settings"><div><div class="eyebrow">RACE-WEEKEND SPOILERS</div><div class="card-title">Spoiler Mode</div><div class="muted">Starts on the first session day and ends automatically the day after the race. Your choice only applies to this weekend.</div></div>${spoilerToggleHtml()}</div>`;
  return `<div class="card spoiler-settings"><div><div class="eyebrow">RACE-WEEKEND SPOILERS</div><div class="card-title">Spoiler Mode · Auto</div><div class="muted">It will switch on automatically when the next race weekend starts, then switch off the day after the race.</div></div><span class="pill subtle">AUTO</span></div>`;
}

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
    <section class="hero"><div class="hero-top"><span class="pill ${isWeekend?'live':'subtle'}">${isWeekend?'RACE WEEKEND':'NEXT ROUND'}</span><span class="round-meta"><i>${flag(r.Circuit.Location.country)}</i><span>ROUND</span><b>${esc(r.round)}</b></span></div>
      ${spoilerRace()?`<div class="hero-spoiler"><div><b>SPOILER MODE</b><small>${spoilers?'Results & headlines protected':'Protection paused for this weekend'}</small></div>${spoilerToggleHtml(true)}</div>`:''}
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
function raceWeatherIsHistorical(r){
  const race=sessions(r).find(s=>s.key==='race')||sessions(r).at(-1);
  return !!race&&new Date(race.iso).getTime()<Date.now()-90*60e3;
}
function upcomingWeatherSessions(r){
  const all=sessions(r);
  if(!all.length)return [];
  if(raceWeatherIsHistorical(r))return [all.find(s=>s.key==='race')||all.at(-1)].filter(Boolean);
  const now=Date.now(),future=all.filter(s=>new Date(s.iso).getTime()>=now-5*60e3);
  return future.length?future:[all.at(-1)].filter(Boolean);
}
function selectedWeatherSession(r){const list=upcomingWeatherSessions(r),saved=state.weatherSessionByRound[String(r.round)],found=list.find(s=>s.key===saved);return found||list[0]||sessions(r).at(-1)||null;}
function weatherSessionTabs(r,selected){const list=upcomingWeatherSessions(r);if(list.length<=1)return '';return `<div class="weather-session-tabs" data-no-swipe>${list.map(s=>`<button class="weather-session-tab ${s.key===selected?.key?'active':''}" onclick="selectWeatherSession('${esc(r.round)}','${esc(s.key)}')">${esc(s.name)}</button>`).join('')}</div>`;}
function weatherLoadingCopy(r,s){return raceWeatherIsHistorical(r)&&s?.key==='race'?'Checking recorded race weather…':'Checking session forecast…';}
function weatherCard(r){const s=selectedWeatherSession(r);return `<div id="weather-card" class="card race-weather-card">${weatherSessionTabs(r,s)}<div id="weather-content"><div class="eyebrow">SESSION WEATHER${s?` · ${esc(s.name)}`:''}</div><div class="weather-loading"><div class="stat-big">—</div><div class="muted">${weatherLoadingCopy(r,s)}</div></div></div></div>`;}
function weatherCondition(code){
  const c=Number(code);
  if(c===0)return ['☀️','Clear'];if(c===1)return ['🌤️','Mostly clear'];if(c===2)return ['⛅','Partly cloudy'];if(c===3)return ['☁️','Overcast'];
  if(c===45||c===48)return ['🌫️','Fog'];if(c>=51&&c<=57)return ['🌦️','Drizzle'];if(c>=61&&c<=67)return ['🌧️','Rain'];
  if(c>=71&&c<=77)return ['🌨️','Snow'];if(c>=80&&c<=82)return ['🌦️','Showers'];if(c>=85&&c<=86)return ['🌨️','Snow showers'];
  if(c>=95)return ['⛈️','Thunderstorm'];return ['🌥️','Mixed'];
}
function closestWeatherIndex(times,targetMs){
  if(!times.length)return -1;let best=0,bestD=Infinity;for(let i=0;i<times.length;i++){const d=Math.abs(new Date(times[i]).getTime()-targetMs);if(d<bestD){best=i;bestD=d;}}return best;
}
async function selectWeatherSession(round,key){const r=state.schedule.find(x=>String(x.round)===String(round));if(!r)return;state.weatherSessionByRound[String(round)]=key;const card=document.getElementById('weather-card');if(card){const s=selectedWeatherSession(r);card.innerHTML=`${weatherSessionTabs(r,s)}<div id="weather-content" class="weather-swap"><div class="eyebrow">SESSION WEATHER · ${esc(s?.name||'SESSION')}</div><div class="weather-loading"><div class="stat-big">—</div><div class="muted">${weatherLoadingCopy(r,s)}</div></div></div>`;}await loadWeatherIntoCard(r);}
window.selectWeatherSession=selectWeatherSession;
async function loadWeatherIntoCard(r){
  const el=document.getElementById('weather-card');if(!el)return;const s=selectedWeatherSession(r),content=()=>document.getElementById('weather-content');if(!s)return;
  const historical=raceWeatherIsHistorical(r)&&s.key==='race';
  try{
    const l=r.Circuit.Location,target=new Date(s.iso),day=target.toISOString().slice(0,10);
    const hourlyFields='temperature_2m,apparent_temperature,precipitation_probability,precipitation,weather_code,wind_speed_10m,wind_gusts_10m';
    const url=historical
      ?`https://archive-api.open-meteo.com/v1/archive?latitude=${l.lat}&longitude=${l.long}&start_date=${day}&end_date=${day}&hourly=${hourlyFields}&timezone=${encodeURIComponent(UK_TZ)}`
      :`https://api.open-meteo.com/v1/forecast?latitude=${l.lat}&longitude=${l.long}&hourly=${hourlyFields}&timezone=${encodeURIComponent(UK_TZ)}&forecast_days=16`;
    const cacheKey=`weather-${historical?'archive':'forecast'}-${r.Circuit.circuitId}-${day}-${s.key}`;
    const w=await fetchJSON(url,cacheKey,historical?365*24*60*60e3:30*60e3);
    const times=w.hourly?.time||[],i=closestWeatherIndex(times,target.getTime()),tolerance=historical?4*3600e3:20*3600e3;
    if(i<0||Math.abs(new Date(times[i]).getTime()-target.getTime())>tolerance){
      const c=content();if(c)c.innerHTML=historical
        ?`<div class="eyebrow">RACE WEATHER · ${fmtDate(s.iso,{day:'numeric',month:'short',year:'numeric'})}</div><div class="card-title" style="margin-top:7px">Historical weather unavailable</div><div class="muted" style="margin-top:5px">Recorded race-start weather could not be matched for this event.</div>`
        :`<div class="eyebrow">SESSION WEATHER · ${esc(s.name)}</div><div class="card-title" style="margin-top:7px">Forecast not available yet</div><div class="muted" style="margin-top:5px">The detailed ${esc(s.name)} forecast appears when the session enters the forecast window.</div><div class="spacer"></div><button class="external-btn" onclick="setRoute('radar:${r.round}')">OPEN RAIN RADAR</button>`;
      return;
    }
    const temp=Math.round(w.hourly.temperature_2m?.[i]??0),feel=Math.round(w.hourly.apparent_temperature?.[i]??temp),rain=Math.round(w.hourly.precipitation_probability?.[i]??0),prec=Number(w.hourly.precipitation?.[i]??0),wind=Math.round(w.hourly.wind_speed_10m?.[i]??0),gust=Math.round(w.hourly.wind_gusts_10m?.[i]??0),[icon,condition]=weatherCondition(w.hourly.weather_code?.[i]);
    const offsets=[-2,-1,0,1,2],hourly=offsets.map(h=>{const at=target.getTime()+h*3600e3,j=closestWeatherIndex(times,at);if(j<0||Math.abs(new Date(times[j]).getTime()-at)>40*60e3)return '';const [ic]=weatherCondition(w.hourly.weather_code?.[j]);return `<div class="weather-hour ${h===0?'race-hour':''}"><b>${fmtTime(new Date(at).toISOString())}</b><span>${ic}</span><strong>${Math.round(w.hourly.temperature_2m?.[j]??0)}°</strong><small>💧 ${Math.round(w.hourly.precipitation_probability?.[j]??0)}%</small></div>`;}).join('');
    const actionHtml=historical
      ?`<div class="weather-actions"><span class="muted">Recorded race-start weather · UK time</span></div>`
      :`<div class="weather-actions"><button class="external-btn red" onclick="setRoute('radar:${r.round}')">RAIN RADAR</button><span class="muted">${esc(s.name)} start forecast · UK time</span></div>`;
    const eyebrow=historical?`RACE WEATHER · ${fmtDateTime(s.iso)}`:`${esc(s.name)} WEATHER · ${fmtTime(s.iso)}`;
    const c=content();if(c)c.innerHTML=`<div class="weather-head"><div><div class="eyebrow">${eyebrow}</div><div class="weather-main"><span class="weather-icon">${icon}</span><div><div class="stat-big">${temp}°C</div><div class="weather-condition">${esc(condition)}</div></div></div></div><div class="weather-rain ${rain>=40?'wet':''}"><b>${rain}%</b><small>RAIN</small></div></div><div class="weather-metrics"><div><b>${feel}°</b><small>FEELS</small></div><div><b>${wind}</b><small>WIND km/h</small></div><div><b>${gust}</b><small>GUST km/h</small></div><div><b>${prec.toFixed(1)}</b><small>RAIN mm</small></div></div><div class="weather-hours">${hourly}</div>${actionHtml}`;
  }catch{const c=content();if(c)c.innerHTML=historical
    ?`<div class="eyebrow">RACE WEATHER · ${esc(s.name)}</div><div class="card-title" style="margin-top:7px">Historical weather unavailable</div><div class="muted" style="margin-top:5px">Pull to refresh later if you'd like to try again.</div>`
    :`<div class="eyebrow">SESSION WEATHER · ${esc(s.name)}</div><div class="card-title" style="margin-top:7px">Forecast unavailable</div><div class="muted" style="margin-top:5px">Pull to refresh or open the rain radar.</div><div class="spacer"></div><button class="external-btn" onclick="setRoute('radar:${r.round}')">OPEN RAIN RADAR</button>`;}
}

function calendarMonthLabel(r){return new Intl.DateTimeFormat('en-GB',{timeZone:UK_TZ,month:'long'}).format(new Date(raceIso(r))).toUpperCase();}
function openRaceFromCalendar(round,el){
  const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;if(!el||reduced){setRoute(`race:${round}`);return;}
  const list=el.closest('.calendar-list');list?.classList.add('is-navigating');el.classList.add('is-opening');
  setTimeout(()=>setRoute(`race:${round}`),180);
}
window.openRaceFromCalendar=openRaceFromCalendar;
function focusCalendarRound(round){
  state.calendarFocusRound=String(round);renderRaces();
  requestAnimationFrame(()=>requestAnimationFrame(()=>{
    const el=document.getElementById(`calendar-round-${String(round)}`);if(!el)return;
    el.classList.add('calendar-focus-pulse');
    el.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'center'});
    setTimeout(()=>{el.classList.remove('calendar-focus-pulse');if(state.calendarFocusRound===String(round))state.calendarFocusRound='';},1100);
  }));
}
window.focusCalendarRound=focusCalendarRound;
function calendarSessionMini(r){
  const ss=sessions(r);return ss.map(x=>`<span class="calendar-session-mini"><b>${esc(x.name)}</b><small>${fmtDate(x.iso,{weekday:'short',day:'numeric',month:'short'})} · ${fmtTime(x.iso)}</small></span>`).join('');
}
function calendarRaceCard(r){
  const status=raceStatus(r),w=raceWinner(r),hideWinner=status==='DONE'&&isSpoilerRace(r),src=circuitSvg(r.Circuit.circuitId),focused=String(state.calendarFocusRound||'')===String(r.round);
  const result=status==='DONE'?(hideWinner?'SPOILER HIDDEN':w?`WINNER · ${(w.Driver?.familyName||driverCode(w.Driver)).toUpperCase()}`:'RESULT AVAILABLE'):status==='NEXT'?'NEXT ROUND':'UPCOMING';
  return `<div id="calendar-round-${esc(r.round)}" class="calendar-race clickable status-${status.toLowerCase()} ${focused?'is-focused':''}" role="button" tabindex="0" onclick="openRaceFromCalendar('${esc(r.round)}',this)" aria-label="Open ${esc(r.raceName)}">
    <span class="calendar-rail"><i></i><small>R${esc(r.round)}</small></span>
    <span class="calendar-copy"><span class="calendar-name">${flag(r.Circuit.Location.country)} ${esc(r.raceName)}</span><span class="calendar-place">${esc(r.Circuit.circuitName)} · ${esc(r.Circuit.Location.locality)}</span><span class="calendar-meta"><b>${fmtDate(raceIso(r),{day:'numeric',month:'short'})}</b><em>${esc(result)}</em></span></span>
    ${src?`<span class="calendar-track"><img src="${src}" alt="" loading="lazy"></span>`:''}<span class="calendar-arrow">›</span>
  </div>`;
}
function renderRaces(){
  const completed=state.schedule.filter(r=>raceStatus(r)==='DONE').length,total=state.schedule.length,next=state.schedule.find(r=>raceStatus(r)==='NEXT')||state.schedule.find(r=>raceStatus(r)==='UPCOMING');
  let lastMonth='',cards='';for(const r of state.schedule){const m=calendarMonthLabel(r);if(m!==lastMonth){cards+=`<div class="calendar-month">${esc(m)}</div>`;lastMonth=m;}cards+=calendarRaceCard(r);}
  const pct=total?Math.round(100*completed/total):0;
  view.innerHTML=titleBlock(`${YEAR} SEASON`,'Race Calendar',spoilerPill())+`<div class="calendar-overview card"><div><div class="eyebrow">SEASON PROGRESS</div><div class="calendar-progress-title"><b>${completed}</b><span>of ${total} rounds complete</span></div></div><div class="calendar-progress"><i style="width:${pct}%"></i></div>${next?`<button class="calendar-next" onclick="focusCalendarRound('${esc(next.round)}')" aria-label="Find ${esc(next.raceName)} in the calendar"><small>NEXT · TAP TO FIND</small><b>${flag(next.Circuit.Location.country)} ${esc(next.raceName)}</b><span>${fmtDate(raceIso(next),{weekday:'short',day:'numeric',month:'short'})}</span><i>↓</i></button>`:''}</div><div class="calendar-list">${cards}</div>`;
  if(!state.raceHistory)preloadRaceWinners(false);
}
function renderStandings(){
  const sr=spoilerRace(),guard=spoilerActive()&&sr&&raceSessionDone(sr)&&!standingsSpoilersRevealed();
  if(guard){view.innerHTML=titleBlock(`${YEAR} CHAMPIONSHIP`,'Standings',spoilerPill())+`<div class="card spoiler-guard"><div class="eyebrow">SPOILER PROTECTED</div><div class="card-title">Post-race standings are hidden until tomorrow</div><div class="muted">You can reveal them now if you already know the race result.</div><div class="spacer"></div><button class="external-btn red" onclick="revealStandingsSpoilers()">REVEAL STANDINGS</button></div>`;return;}
  const latest=latestCompletedRace(),latestRound=Number(latest?.round||0),behind=latestRound>Math.min(Number(state.driverStandingsRound||0),Number(state.constructorStandingsRound||0));
  const syncNote=state.standingsDerivedRound===latestRound&&latestRound?`<div class="source-note good-note">✓ VALIDATED POST-RACE TABLE · Rebuilt from the previous official standings plus the published Round ${latestRound} points while the primary feed catches up.</div>`:`<div class="source-note">STANDINGS · ${esc(healthLabel(state.dataHealth.standings))}</div>`;
  view.innerHTML=titleBlock(`${YEAR} CHAMPIONSHIP`,'Standings',spoilerPill())+`<div class="tabs"><button class="tab active" data-stand="drivers">DRIVERS</button><button class="tab" data-stand="constructors">CONSTRUCTORS</button></div><div id="stand-list" class="card">${state.drivers.map(standingRow).join('')}</div>${syncNote}`;
  document.querySelectorAll('[data-stand]').forEach(b=>b.onclick=()=>{document.querySelectorAll('[data-stand]').forEach(x=>x.classList.remove('active'));b.classList.add('active');const el=document.getElementById('stand-list');el.innerHTML=b.dataset.stand==='drivers'?state.drivers.map(standingRow).join(''):state.constructors.map(c=>`<div class="standing-row"><div class="pos">${esc(c.position)}</div><div class="driver-line"><i class="team-dot" style="background:${teamColour(c.Constructor.name)}"></i><div><div class="driver-name">${esc(c.Constructor.name)}</div><div class="driver-meta">${esc(c.wins)} wins</div></div></div><div class="points">${esc(c.points)}<small>PTS</small></div></div>`).join('');});
  if(behind&&!state.standingsRefreshing&&Date.now()-(state.standingsUpdatedAt||0)>2*60e3)refreshChampionshipOnly();
}
function fmtNewsTime(d){ if(!d)return ''; const x=new Date(d),mins=Math.round((Date.now()-x)/60000);if(mins<60)return `${Math.max(1,mins)}m`;if(mins<1440)return `${Math.floor(mins/60)}h`;return fmtDate(x.toISOString()); }
function renderNews(){
  const guard=spoilerActive()&&!newsSpoilersRevealed();
  const sourceIds=['ALL',...NEWS_SOURCES.map(x=>x.id)];
  if(!sourceIds.includes(state.newsSource))state.newsSource='ALL';
  const filtered=state.newsSource==='ALL'?state.news:state.news.filter(n=>n.sourceId===state.newsSource);
  const tabs=`<div class="news-source-tabs">${sourceIds.map(id=>{const x=NEWS_SOURCES.find(s=>s.id===id);return `<button class="tab ${state.newsSource===id?'active':''}" data-news-source="${id}">${id==='ALL'?'ALL':esc(x?.name||id)}</button>`;}).join('')}</div>`;
  const newestTimes=filtered.map(n=>new Date(n.pubDate||0).getTime()).filter(Number.isFinite);
  const newest=newestTimes.length?Math.max(...newestTimes):0;
  const freshness=newest?`<div class="news-freshness">LATEST ARTICLE · ${esc(fmtNewsTime(new Date(newest).toISOString()))} AGO</div>`:'';
  const reveal=spoilerActive()?`<div class="card spoiler-settings"><div><div class="eyebrow">SPOILER MODE</div><div class="card-title">Reveal headlines</div><div class="muted">Turn this on if you want headlines visible during this race weekend. You can switch them off again at any time.</div></div>${headlineToggleHtml()}</div><div class="spacer"></div>`:'';
  const defaultNewsBatch=window.innerWidth<620?18:28;const visible=filtered.slice(0,Math.max(12,Number(state.newsVisibleCount||defaultNewsBatch)));
  const cards=filtered.length?visible.map(n=>guard?`<div class="card news-card spoiler-news-card"><div class="news-body"><div class="news-title">SPOILER HIDDEN</div><div class="news-meta">${esc((n.source||'F1').toUpperCase())} · ${fmtNewsTime(n.pubDate)}</div></div></div>`:`<a class="card news-card news-link" href="${esc(n.link)}" target="_blank" rel="noopener">${n.thumbnail?`<img class="news-img" src="${esc(n.thumbnail)}" alt="" loading="lazy">`:''}<div class="news-body"><div class="news-title">${esc(n.title)}</div><div class="news-meta">${esc((n.source||'F1').toUpperCase())} · ${fmtNewsTime(n.pubDate)}</div></div></a>`).join(''):(state.newsRefreshing?'<div class="empty">Loading latest stories…</div>':state.newsSource==='ALL'?'<div class="empty">News could not be loaded. <button class="external-btn" onclick="refreshNewsOnly(true)">TRY AGAIN</button></div>':'<div class="empty">No stories from this source right now.</div>');
  const more=filtered.length>visible.length?`<div class="news-more-wrap"><button class="external-btn" onclick="showMoreNews()">SHOW MORE · ${filtered.length-visible.length} REMAINING</button></div>`:'';
  view.innerHTML=titleBlock('MULTI-SOURCE','Latest News',spoilerPill())+tabs+freshness+reveal+`<div class="grid news-grid">${cards}</div>${more}`;
  document.querySelectorAll('[data-news-source]').forEach(b=>b.onclick=()=>{state.newsSource=b.dataset.newsSource;state.newsVisibleCount=window.innerWidth<620?18:28;renderNews();});
}
function showMoreNews(){state.newsVisibleCount=Math.min(100,Number(state.newsVisibleCount||(window.innerWidth<620?18:28))+24);renderNews();}
window.showMoreNews=showMoreNews;
function renderMore(){ const installed=isAppInstalled(); const canInstall=!!state.installPrompt; const install=!installed?(canInstall?`<div class="spacer"></div><div class="card app-mode-card"><div><div class="eyebrow">INSTALL APP</div><div class="card-title" style="margin-top:5px">Install F1 Hub</div><div class="muted" style="margin-top:5px">Adds F1 Hub to Android with its own icon and no browser address bar.</div></div><button id="install-btn" class="external-btn red">↓ INSTALL</button></div>`:`<div class="spacer"></div><div class="card app-mode-card"><div><div class="eyebrow">APP INSTALL</div><div class="card-title" style="margin-top:5px">Install option is preparing</div><div class="muted" style="margin-top:5px">Refresh once if this remains here. If Chrome still does not expose the install prompt, use ⋮ → Install and create shortcut → Install.</div></div></div>`):'';
  view.innerHTML=titleBlock('F1 HUB','Explore')+`
  <div class="more-group-label">DRIVERS & PERFORMANCE</div><div class="menu-grid">
    ${menu('👤','Drivers','Profiles, career history & season stats','drivers')}${menu('🛠️','Car Development','FIA updates mapped onto the car','updates')}
    ${menu('↔','Driver Compare','Compare two drivers','compare')}${menu('📈','Championship Trends','Points evolution & team contribution','trends')}
    ${menu('⚔️','Teammate Battles','Qualifying & race H2H','battles')}${menu('📊','Season Stats','Wins, podiums & DNFs','stats')}
  </div><div class="more-group-label">RACE REFERENCE</div><div class="menu-grid">
    ${menu('🗺','Circuits','Layouts, facts & previous winners','circuits')}${menu('🚨','Stewards','Latest FIA decisions','stewards')}
    ${menu('🟨','Penalty Points','Licence points & reprimands','penalties')}${menu('🕰️','F1 History','Seasons & race results','history')}
    ${menu('🏅','F1 Records','All-time records & milestones','records')}${menu('✓','Data Health','Freshness, sources & validation','datahealth')}
  </div><div class="more-group-label">PERSONALISE</div><div class="menu-grid single-last">${menu('★','My F1','Favourite driver, team & theme','preferences')}</div>
  <div class="spacer"></div>${spoilerSettingsCard()}${install}<div class="source-note">F1 Hub v${APP_VERSION} · Personal unofficial Formula 1 companion. Live/current data comes from free public sources and is cached locally.</div>`;
  document.getElementById('install-btn')?.addEventListener('click',requestInstall);
}

function menu(icon,title,sub,route){return `<button class="menu-card" onclick="setRoute('${route}')" aria-label="${esc(title)}: ${esc(sub)}"><div class="icon">${icon}</div><b>${esc(title)}</b><small>${esc(sub)}</small></button>`;}

function renderPreferences(){
  const driverOpts=['<option value="">No favourite driver</option>',...state.drivers.map(s=>`<option value="${esc(s.Driver.driverId)}" ${state.favouriteDriver===s.Driver.driverId?'selected':''}>${esc(fullName(s.Driver))} · ${esc(s.Constructors?.at(-1)?.name||'')}</option>`)].join('');
  const teams=[...new Set(state.constructors.map(c=>c.Constructor?.name).filter(Boolean))];
  const teamOpts=['<option value="">No favourite team</option>',...teams.map(t=>`<option value="${esc(t)}" ${state.favouriteTeam===t?'selected':''}>${esc(t)}</option>`)].join('');
  const r=currentRace(),activeTeam=favouriteTeamName();
  view.innerHTML=titleBlock('PERSONALISE','My F1')+`<div class="card preferences-card"><label><div class="eyebrow">FAVOURITE DRIVER</div><select id="fav-driver">${driverOpts}</select></label><label><div class="eyebrow">FAVOURITE TEAM</div><select id="fav-team">${teamOpts}</select></label><label class="theme-choice"><span><div class="eyebrow">PERSONAL THEME</div><b>Use my team colours throughout F1 Hub</b><small>Changes the app accent/theme while keeping status colours meaningful.</small></span><input id="fav-theme" type="checkbox" ${state.personalTheme?'checked':''} aria-label="Use favourite team theme"></label><div class="theme-preview" style="--preview:${teamColour(activeTeam)}"><i></i><span>${activeTeam?`${esc(activeTeam)} theme`:'Choose a team or driver to preview a theme'}</span></div><div class="spacer"></div><button id="save-favourites" class="external-btn red">SAVE MY F1</button></div>
  <div class="spacer"></div><div class="card my-f1-benefits"><div class="eyebrow">WHAT MY F1 CHANGES</div><div class="benefit-grid"><div><b>🎨 Theme</b><span>Your chosen team colours can style the whole app.</span></div><div><b>👤 Driver</b><span>Your favourite driver stays one tap away from My F1.</span></div><div><b>🛠 Development</b><span>Your team is surfaced first in car updates.</span></div><div><b>⚙ Quick access</b><span>Jump straight to your driver profile and championship context.</span></div></div></div>
  ${r?`<div class="spacer"></div><div class="card"><div class="eyebrow">RACE-WEEKEND SHORTCUT</div><div class="card-title">Add ${esc(r.raceName)} to your calendar</div><div class="muted">Creates one .ics file containing every session in the weekend.</div><div class="spacer"></div><button class="external-btn" onclick="addRaceWeekendCalendar('${esc(r.round)}')">ADD WEEKEND TO CALENDAR</button></div>`:''}<div class="spacer"></div>${spoilerSettingsCard()}`;
  const preview=()=>{const team=document.getElementById('fav-team').value||state.drivers.find(x=>x.Driver.driverId===document.getElementById('fav-driver').value)?.Constructors?.at(-1)?.name||'';const el=document.querySelector('.theme-preview');if(el){el.style.setProperty('--preview',teamColour(team));el.querySelector('span').textContent=team?`${team} theme`:'Choose a team or driver to preview a theme';}};
  document.getElementById('fav-driver').addEventListener('change',preview);document.getElementById('fav-team').addEventListener('change',preview);
  document.getElementById('save-favourites').onclick=()=>{const d=document.getElementById('fav-driver').value,t=document.getElementById('fav-team').value,theme=document.getElementById('fav-theme').checked;state.favouriteDriver=d;state.favouriteTeam=t;state.personalTheme=theme;localStorage.setItem('f1hub:favourite-driver',d);localStorage.setItem('f1hub:favourite-team',t);localStorage.setItem('f1hub:personal-theme',theme?'on':'off');applyPersonalTheme();toast('My F1 saved');renderPreferences();};
}

function renderDataHealth(){
  const rows=['schedule','standings','news','photos'].map(k=>{const r=state.dataHealth[k],st=healthState(r);return `<div class="health-row"><span class="health-dot health-${st}">${healthIcon(r)}</span><div><b>${esc(k.toUpperCase())}</b><small>${esc(healthLabel(r))}</small>${r?.detail?`<em>${esc(r.detail)}</em>`:''}</div><span class="health-state">${esc(st.toUpperCase())}</span></div>`;}).join('');
  const score=currentDataHealthScore();
  view.innerHTML=titleBlock('TRUST & FRESHNESS','Data Health')+`<div class="card health-score"><div><div class="eyebrow">CURRENT DATA SCORE</div><div class="stat-big">${score || '—'}<small>/100</small></div></div><div class="health-gauge"><i style="width:${Math.min(100,score)}%"></i></div><div class="muted">Freshness and validation are checked independently. Cached data remains visible offline but is labelled as aging/stale rather than silently presented as current.</div></div><div class="spacer"></div><div class="card health-list">${rows}</div><div class="spacer"></div><div class="actions"><button class="external-btn red" onclick="loadBase(true)">CHECK ALL SOURCES</button></div><div class="source-note">Result classifications are validated for a real P1, unique numeric positions and correct ordering of unclassified cars. Championship tables are validated and post-race points can be reconstructed from the previous official round plus the published race/sprint classification.</div>`;
}
window.addRaceWeekendCalendar=addRaceWeekendCalendar;window.shareText=shareText;

function renderDrivers(){ view.innerHTML=titleBlock(`${YEAR} GRID`,'Drivers')+`<div class="driver-grid">${state.drivers.map(s=>driverCard(s)).join('')}</div>`; }
function driverCard(s){ const team=s.Constructors?.at(-1)?.name||'',imgs=driverPhotoUrls(s),img=imgs[0];return `<div class="card driver-card clickable ${isFavouriteDriver(s)?'is-favourite':''}" onclick="setRoute('driver:${s.Driver.driverId}')"><i class="team-strip" style="background:${teamColour(team)}"></i><div class="driver-photo-holder">${img?`<img class="driver-photo" ${driverPhotoAttrs(imgs,driverCode(s.Driver))} onerror="driverPhotoError(this)" alt="${esc(fullName(s.Driver))}" loading="lazy">`:`<div class="avatar">${esc(driverCode(s.Driver))}</div>`}</div><div class="driver-copy"><div class="driver-code">#${esc(s.Driver.permanentNumber||'—')} · ${esc(driverCode(s.Driver))}</div><div class="driver-full">${esc(fullName(s.Driver))}</div><div class="driver-bottom"><span>${esc(team)}</span><span><b>${esc(s.points)}</b> pts</span></div></div></div>`; }
function careerPageOffsets(total,pageSize=100){return CAREER?.pageOffsets(total,pageSize)||[0];}
function buildDriverCareer(races,expectedTotal=0){return CAREER?.build(races,expectedTotal)||{starts:0,wins:0,podiums:0,best:null,seasons:[],teams:[],expectedTotal:Number(expectedTotal||0),complete:false};}
function attachDriverCareerStandings(career,standings){return CAREER?.attachStandings?CAREER.attachStandings(career,standings):career;}
function careerSpan(x){return x.first===x.last?String(x.first):`${x.first}–${x.last}`;}
function driverCareerHtml(c){
  if(!c||!c.starts)return '<div class="card"><div class="empty">Career history is not available for this driver yet.</div></div>';
  return `<div class="career-summary card"><div class="eyebrow">F1 CAREER</div><div class="facts career-facts"><div class="fact"><b>${c.starts}</b><small>GRANDS PRIX</small></div><div class="fact"><b>${c.wins}</b><small>WINS</small></div><div class="fact"><b>${c.podiums}</b><small>PODIUMS</small></div><div class="fact"><b>${c.best?`P${c.best}`:'—'}</b><small>BEST FINISH</small></div></div>${!c.complete?`<div class="career-warning">Archive incomplete · ${c.starts}/${c.expectedTotal} races loaded</div>`:''}</div><div class="spacer"></div><div class="card"><div class="eyebrow">TEAM HISTORY</div><div class="career-team-timeline">${c.teams.map(x=>`<div class="career-team-row"><i style="background:${teamColour(x.team)}"></i><div><b>${esc(x.team)}</b><span>${careerSpan(x)} · ${x.starts} Grands Prix</span></div></div>`).join('')}</div></div><div class="spacer"></div><div class="card"><div class="eyebrow">SEASON BY SEASON</div><div class="career-seasons">${c.seasons.map(x=>{const current=Number(x.season)===YEAR,pos=x.champPosition?`P${x.champPosition}`:'—';return `<div class="career-season-row"><b>${x.season}</b><div><strong>${esc(x.teams.join(' → '))}</strong><span>${x.starts} GP${x.starts===1?'':'s'} · ${x.wins} win${x.wins===1?'':'s'} · ${x.podiums} podium${x.podiums===1?'':'s'}</span></div><div class="career-season-finish ${x.champPosition?'known':''}"><b>${pos}</b><small>${current?'CURRENT':'CHAMPIONSHIP'}</small></div></div>`;}).join('')}</div></div><div class="source-note">Career race totals use every paginated Jolpica/Ergast Grand Prix result. Season finishing positions use the corresponding final driver standings table for each year; the current season is labelled CURRENT rather than final.</div>`;
}
async function fetchAllDriverCareerRaces(id){
  const pageSize=100,driver=encodeURIComponent(id),maxAge=30*60e3;
  const fetchPage=offset=>fetchJSON(`${JOLPICA}/drivers/${driver}/results/?limit=${pageSize}&offset=${offset}`,`driver-career-v2-${id}-${offset}`,maxAge,22000);
  const first=await fetchPage(0),total=Number(first?.MRData?.total||0),firstRows=first?.MRData?.RaceTable?.Races||[];
  const offsets=careerPageOffsets(total,pageSize).filter(x=>x!==0),rows=[...firstRows];
  for(let i=0;i<offsets.length;i+=2){
    const pages=await Promise.allSettled(offsets.slice(i,i+2).map(fetchPage));
    for(const page of pages)if(page.status==='fulfilled')rows.push(...(page.value?.MRData?.RaceTable?.Races||[]));
    if(i+2<offsets.length)await sleep(480);
  }
  return {races:rows,total};
}
async function fetchDriverSeasonPositions(id,seasons){
  const out={},driver=encodeURIComponent(id),years=[...new Set((seasons||[]).map(x=>Number(x.season)).filter(Number.isFinite))].sort((a,b)=>b-a);
  for(let i=0;i<years.length;i++){
    const year=years[i],key=`driver-season-standing-v1-${id}-${year}`,maxAge=year===YEAR?15*60e3:30*864e5;
    try{
      const wasCached=!!cacheGet(key,maxAge);
      const j=await fetchJSON(`${JOLPICA}/${year}/drivers/${driver}/driverstandings/`,key,maxAge,18000);
      const row=j?.MRData?.StandingsTable?.StandingsLists?.[0]?.DriverStandings?.[0];
      if(row)out[String(year)]={position:Number(row.position)||null,points:row.points,wins:row.wins};
      if(!wasCached&&i<years.length-1)await sleep(430);
    }catch{}
  }
  return out;
}
async function loadDriverCareerInto(id){
  const root=document.getElementById('driver-career');if(!root)return;
  try{
    let career=state.driverCareerCache[id];
    if(!career){const all=await fetchAllDriverCareerRaces(id);career=buildDriverCareer(all.races,all.total);state.driverCareerCache[id]=career;}
    if(document.getElementById('driver-career'))root.innerHTML=driverCareerHtml(career);
    const standings=await fetchDriverSeasonPositions(id,career.seasons);
    career=attachDriverCareerStandings(career,standings);state.driverCareerCache[id]=career;
    const live=document.getElementById('driver-career');if(live)live.innerHTML=driverCareerHtml(career);
  }catch{if(document.getElementById('driver-career'))root.innerHTML='<div class="card"><div class="empty">Career history could not be loaded right now.</div></div>';}
}
function renderDriver(id){ const s=state.drivers.find(x=>x.Driver.driverId===id);if(!s)return setRoute('drivers');const d=s.Driver,team=s.Constructors?.at(-1)?.name||'',imgs=driverPhotoUrls(s),img=imgs[0];view.innerHTML=`<div class="actions"><button class="external-btn" onclick="history.length>1?history.back():setRoute('drivers')">← DRIVERS</button></div><div class="spacer"></div><div class="card driver-profile-card" style="overflow:hidden"><div class="driver-profile-hero" style="border-left-color:${teamColour(team)}"><div class="driver-profile-copy"><div class="eyebrow">#${esc(d.permanentNumber||'—')} · ${esc(driverCode(d))}</div><h1>${esc(fullName(d))}</h1><div class="muted">${esc(d.nationality)} · ${esc(team)}</div></div><div class="profile-photo-holder">${img?`<img ${driverPhotoAttrs(imgs,driverCode(d))} onerror="driverPhotoError(this)" alt="${esc(fullName(d))}">`:`<div class="avatar profile-avatar">${esc(driverCode(d))}</div>`}</div></div><div class="driver-profile-stats"><div class="facts"><div class="fact"><b>${esc(s.position)}</b><small>CHAMP POS</small></div><div class="fact"><b>${esc(s.points)}</b><small>POINTS</small></div><div class="fact"><b>${esc(s.wins)}</b><small>${YEAR} WINS</small></div><div class="fact"><b>${age(d.dateOfBirth)}</b><small>AGE</small></div><div class="fact"><b>${fmtDate(d.dateOfBirth+'T12:00:00Z',{day:'numeric',month:'short',year:'numeric'})}</b><small>BORN</small></div><div class="fact"><b>${esc(d.nationality)}</b><small>NATIONALITY</small></div></div></div></div><div class="spacer"></div>${titleBlock('HISTORY','Career')}<div id="driver-career"><div class="loader">Loading F1 career…</div></div><div class="spacer"></div><div class="actions"><a class="external-btn" href="${esc(d.url||'#')}" target="_blank" rel="noopener">PROFILE SOURCE ↗</a></div>`;loadDriverCareerInto(id); }

function renderTeams(){ view.innerHTML=titleBlock(`${YEAR} GRID`,'Teams')+`<div class="grid two">${state.constructors.map(c=>`<div class="card ${isFavouriteTeamName(c.Constructor.name)?'is-favourite':''}" style="border-left:5px solid ${teamColour(c.Constructor.name)}"><div class="eyebrow">P${esc(c.position)}</div><div class="card-title" style="font-size:20px;margin-top:5px">${esc(c.Constructor.name)}</div><div class="stat-big">${esc(c.points)} <span class="muted" style="font-size:11px">PTS</span></div><div class="muted">${esc(c.wins)} wins · ${esc(c.Constructor.nationality||'')}</div></div>`).join('')}</div>`; }
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

function flattenGeoCoordinates(geometry){
  if(!geometry)return [];
  if(geometry.type==='LineString')return geometry.coordinates||[];
  if(geometry.type==='MultiLineString')return (geometry.coordinates||[]).flat();
  if(geometry.type==='Polygon')return (geometry.coordinates||[]).flat();
  if(geometry.type==='MultiPolygon')return (geometry.coordinates||[]).flat(2);
  return [];
}
function haversineKm(lat1,lon1,lat2,lon2){
  const R=6371,toRad=x=>x*Math.PI/180,dLat=toRad(lat2-lat1),dLon=toRad(lon2-lon1);
  const a=Math.sin(dLat/2)**2+Math.cos(toRad(lat1))*Math.cos(toRad(lat2))*Math.sin(dLon/2)**2;
  return 2*R*Math.asin(Math.sqrt(a));
}
function nearestCircuitFeature(geo,r){
  const lat=Number(r.Circuit.Location.lat),lon=Number(r.Circuit.Location.long);let best=null,bestD=Infinity;
  for(const f of geo?.features||[]){
    const pts=flattenGeoCoordinates(f.geometry).filter(x=>Array.isArray(x)&&Number.isFinite(Number(x[0]))&&Number.isFinite(Number(x[1])));if(!pts.length)continue;
    const clat=pts.reduce((a,x)=>a+Number(x[1]),0)/pts.length,clon=pts.reduce((a,x)=>a+Number(x[0]),0)/pts.length,d=haversineKm(lat,lon,clat,clon);
    if(d<bestD){best=f;bestD=d;}
  }
  return bestD<80?best:null;
}
function radarFrameLabel(frame,i,total){
  const iso=new Date(Number(frame.time)*1000).toISOString(),latest=i===total-1?' · LATEST':'';
  return `${fmtDateTime(iso)}${latest}`;
}
let leafletPromise=null;
function ensureLeaflet(){
  if(window.L)return Promise.resolve(window.L);if(leafletPromise)return leafletPromise;
  leafletPromise=new Promise((resolve,reject)=>{
    if(!document.querySelector('link[data-leaflet]')){const link=document.createElement('link');link.rel='stylesheet';link.href='https://cdn.jsdelivr.net/npm/leaflet@1.9.4/dist/leaflet.css';link.dataset.leaflet='1';document.head.appendChild(link);}
    const script=document.createElement('script');script.src='https://cdn.jsdelivr.net/npm/leaflet@1.9.4/dist/leaflet.js';script.async=true;script.onload=()=>resolve(window.L);script.onerror=reject;document.head.appendChild(script);
  });return leafletPromise;
}

async function initRainRadar(r){
  const mapEl=document.getElementById('radar-map'),status=document.getElementById('radar-status');if(!mapEl||!status)return;
  const l=r.Circuit.Location,lat=Number(l.lat),lon=Number(l.long);
  try{await ensureLeaflet();}catch{status.textContent='Interactive radar library could not load. Use Open Windy below.';return;}
  if(!window.L){status.textContent='Interactive radar library could not load. Use Open Windy below.';return;}
  try{
    const map=L.map(mapEl,{zoomControl:true,attributionControl:true,minZoom:5,maxZoom:16}).setView([lat,lon],11);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19,attribution:'© OpenStreetMap contributors'}).addTo(map);
    L.circleMarker([lat,lon],{radius:4,color:'#fff',weight:2,fillColor:'#ff1e1e',fillOpacity:1}).addTo(map);
    setTimeout(()=>map.invalidateSize(),80);

    try{
      const geo=await fetchJSON(CIRCUIT_GEOJSON,'circuit-geojson',30*864e5,22000),feature=nearestCircuitFeature(geo,r);
      if(feature){
        const halo=L.geoJSON(feature,{style:{color:'#050505',weight:9,opacity:.9,lineCap:'round',lineJoin:'round'}}).addTo(map);
        L.geoJSON(feature,{style:{color:'#ff3434',weight:4,opacity:1,lineCap:'round',lineJoin:'round'}}).addTo(map);
        const bounds=halo.getBounds();if(bounds.isValid())map.fitBounds(bounds.pad(1.4),{maxZoom:11});
        document.getElementById('radar-track-status').textContent='Circuit outline locked to real map coordinates';
      }else document.getElementById('radar-track-status').textContent='Circuit outline unavailable for this venue';
    }catch{document.getElementById('radar-track-status').textContent='Circuit outline could not be loaded';}

    const rv=await fetchJSON(RAINVIEWER_API,'rainviewer-frames',90e3,18000),frames=rv?.radar?.past||[];
    if(!frames.length)throw new Error('No radar frames');
    let idx=frames.length-1,radarLayer=null,playing=false;
    const prev=document.getElementById('radar-prev'),play=document.getElementById('radar-play'),next=document.getElementById('radar-next');
    const setFrame=(n)=>{
      idx=(n+frames.length)%frames.length;const frame=frames[idx];if(radarLayer)map.removeLayer(radarLayer);
      radarLayer=L.tileLayer(`${rv.host}${frame.path}/256/{z}/{x}/{y}/2/1_1.png`,{opacity:.68,maxNativeZoom:7,maxZoom:16,zIndex:220,attribution:'Radar © RainViewer'}).addTo(map);
      status.textContent=radarFrameLabel(frame,idx,frames.length);prev.disabled=idx===0;next.disabled=idx===frames.length-1;
    };
    const stop=()=>{playing=false;clearInterval(state.radarTimer);state.radarTimer=null;play.textContent='▶ PLAY';};
    prev.onclick=()=>{stop();setFrame(Math.max(0,idx-1));};next.onclick=()=>{stop();setFrame(Math.min(frames.length-1,idx+1));};
    play.onclick=()=>{if(playing){stop();return;}playing=true;play.textContent='Ⅱ PAUSE';state.radarTimer=setInterval(()=>{if(idx>=frames.length-1){idx=0;}else idx++;setFrame(idx);},700);};
    setFrame(idx);
  }catch(e){status.textContent='Rain radar could not be loaded. Use Open Windy below.';mapEl.innerHTML='<div class="radar-fallback">Radar temporarily unavailable</div>';}
}
async function renderRadar(round){
  const r=state.schedule.find(x=>x.round===round);if(!r)return setRoute('races');const l=r.Circuit.Location;
  view.innerHTML=`<div class="actions"><button class="external-btn" onclick="history.length>1?history.back():setRoute('race:${r.round}')">← BACK</button></div><div class="spacer"></div>${titleBlock('WEATHER RADAR',r.Circuit.circuitName)}<div class="card radar-info"><div><div class="eyebrow">RADAR FRAME</div><div id="radar-status" class="card-title">Loading latest radar…</div><div id="radar-track-status" class="muted">Loading circuit outline…</div></div><div class="radar-controls"><button id="radar-prev" class="mini-btn" aria-label="Previous radar frame">‹</button><button id="radar-play" class="mini-btn wide">▶ PLAY</button><button id="radar-next" class="mini-btn" aria-label="Next radar frame">›</button></div></div><div class="radar-card"><div id="radar-map" class="radar-map" aria-label="Weather radar with ${esc(r.Circuit.circuitName)} circuit outline"></div></div><div class="spacer"></div><div class="actions"><a class="external-btn red" href="${esc(radarUrl(r))}" target="_blank" rel="noopener">OPEN WINDY ↗</a><button class="external-btn" onclick="setRoute('race:${r.round}')">RACE HUB</button></div><div class="source-note">RainViewer radar is shown over OpenStreetMap. The red circuit line uses georeferenced track coordinates, so its position and orientation stay aligned with the real circuit as you pan or zoom.</div>`;
  await initRainRadar(r);
}

function renderRaceDetail(round){ const r=state.schedule.find(x=>x.round===round);if(!r)return setRoute('races');const c=CIRCUITS[r.Circuit.circuitId]||{},src=circuitSvg(r.Circuit.circuitId);view.innerHTML=`<div class="actions"><button class="external-btn" onclick="setRoute('races')">← CALENDAR</button><button class="external-btn" onclick="addRaceWeekendCalendar('${r.round}')">＋ CALENDAR</button></div><div class="spacer"></div><section class="hero" style="min-height:190px"><div class="hero-top"><span class="pill ${raceStatus(r)==='NEXT'?'live':'subtle'}">ROUND ${esc(r.round)}</span><span>${flag(r.Circuit.Location.country)}</span></div><h1>${esc(r.raceName.toUpperCase())}</h1><div class="circuit">${esc(r.Circuit.circuitName)}</div></section><div class="tabs"><button class="tab active" data-racetab="weekend">WEEKEND</button><button class="tab" data-racetab="results">RESULTS</button><button class="tab" data-racetab="control">RACE CONTROL</button><button class="tab" data-racetab="radio">RADIO</button></div><div id="race-tab-content"></div>`;
  const root=document.getElementById('race-tab-content'); const drawWeekend=()=>{root.innerHTML=`<div class="grid desktop-two"><div><div class="schedule-list">${sessionRows(r)}</div><div class="spacer"></div><div class="actions"><button class="external-btn red" onclick="setRoute('radar:${r.round}')">RAIN RADAR</button><button class="external-btn" onclick="setRoute('circuit:${r.round}')">TRACK INFO</button></div></div><div>${weatherCard(r)}${src?`<div class="spacer"></div><div class="card"><div class="track-img-wrap"><img class="track-img" src="${src}" alt="track layout"></div><div class="facts"><div class="fact"><b>${c.length||'—'} km</b><small>LENGTH</small></div><div class="fact"><b>${c.laps||'—'}</b><small>LAPS</small></div><div class="fact"><b>${c.turns||'—'}</b><small>TURNS</small></div></div></div>`:''}</div></div>`;loadWeatherIntoCard(r);}; drawWeekend();
  document.querySelectorAll('[data-racetab]').forEach(b=>b.onclick=async()=>{document.querySelectorAll('[data-racetab]').forEach(x=>x.classList.remove('active'));b.classList.add('active');const t=b.dataset.racetab;if(t==='weekend')drawWeekend();else if(t==='results')await drawResults(root,r);else if(t==='control')await drawRaceControl(root,r);else await drawRadio(root,r);});
}
async function drawResults(root,r){
  root.innerHTML='<div class="loader">Loading classification…</div>';
  try{
    const [res,q,pits]=await Promise.allSettled([
      fetchJSON(`${JOLPICA}/${YEAR}/${r.round}/results/?limit=100`,`result-${r.round}`,15*60e3),
      fetchJSON(`${JOLPICA}/${YEAR}/${r.round}/qualifying/?limit=100`,`quali-${r.round}`,15*60e3),
      fetchJSON(`${JOLPICA}/${YEAR}/${r.round}/pitstops/?limit=2000`,`pitstops-${r.round}`,30*60e3)
    ]);
    const rr=res.status==='fulfilled'?res.value?.MRData?.RaceTable?.Races?.[0]:null,qq=q.status==='fulfilled'?q.value?.MRData?.RaceTable?.Races?.[0]:null;
    const pitRows=pits.status==='fulfilled'?(pits.value?.MRData?.RaceTable?.Races?.[0]?.PitStops||[]):[];
    const validation=Q?.validateResults(rr?.Results||[],{minEntries:15});
    if(rr?.Results?.length&&validation&&!validation.ok)markHealth('results','error','Jolpica',Date.now(),`Classification validation: ${validation.issues.join(', ')}`,Number(r.round),24*3600e3);
    else if(rr?.Results?.length)markHealth('results','ok','Jolpica',Date.now(),`Round ${r.round} classification validated`,Number(r.round),24*3600e3);
    root.innerHTML=`${raceAtGlanceHtml(rr,r,pitRows)}${rr?.Results?.length?'<div class="spacer"></div>':''}${resultTable('RACE RESULT',rr?.Results||[])}${rr?.Results?.length?`<div class="spacer"></div><div class="actions"><button class="external-btn red" onclick="setRoute('telemetry:${r.round}:race')">VIEW RACE TELEMETRY ›</button></div>`:''}<div id="race-strategy-inline"></div><div class="spacer"></div>${resultTable('QUALIFYING',qq?.QualifyingResults||[],true)}`;
    const slot=document.getElementById('race-strategy-inline');
    if(slot&&rr?.Results?.length){
      try{const os=await openF1RaceSession(r);if(os){const [ofres,drivers,stints]=await Promise.all([fetchJSON(`${OPENF1}/session_result?session_key=${os.session_key}`,`of1-result-${os.session_key}`,15*60e3),fetchJSON(`${OPENF1}/drivers?session_key=${os.session_key}`,`of1-drivers-${os.session_key}`,6*3600e3),fetchJSON(`${OPENF1}/stints?session_key=${os.session_key}`,`of1-stints-${os.session_key}`,30*60e3)]);slot.innerHTML=`<div class="spacer"></div>${raceStrategyHtml(stints,drivers,ofres)}`;}}
      catch{}
    }
  }catch{root.innerHTML='<div class="error-box">Results are not available yet.</div>';}
}
function raceAtGlanceHtml(rr,r,pitRows=[]){
  const rows=rr?.Results||[];if(!rows.length)return '';
  const i=Q?.calculateRaceInsights(rows);if(!i?.winner)return '';
  const driver=x=>x?`${driverCode(x.Driver)} · ${x.Driver?.familyName||''}`:'—';
  const gain=i.biggestGainer,loss=i.biggestLoser,fast=i.fastest;
  const leader=state.drivers[0],second=state.drivers[1],champGap=leader&&second?Number(leader.points)-Number(second.points):null;
  const podium=i.podium.map((x,n)=>`<div class="recap-line"><strong>P${n+1}</strong><span>${esc(driver(x))}</span><b>${n===0?'WINNER':esc(raceGapLabel(x,i.winner))}</b></div>`).join('');
  return `<div class="card race-glance"><div class="eyebrow">RACE AT A GLANCE</div><div class="recap-hero"><div><div class="recap-sub">WINNER</div><div class="recap-main">${esc(driver(i.winner))}</div><div class="recap-sub">${esc(i.winner.Time?.time||'CLASSIFIED P1')}</div></div><div><div class="recap-sub">CHAMPIONSHIP</div><div class="recap-gap">${leader?`${esc(driverCode(leader.Driver))} · ${esc(leader.points)} pts`:'—'}</div><div class="recap-sub">${champGap!=null?`${champGap} pts to P2`:'Standings updating'}</div></div></div><div class="recap-top3">${podium}</div><div class="glance-grid"><div><small>FASTEST LAP</small><b>${fast?esc(driver(fast)):'—'}</b><span>${esc(fast?.FastestLap?.Time?.time||'—')}</span></div><div><small>BIGGEST GAIN</small><b>${gain?esc(driver(gain.row)):'—'}</b><span>${gain&&gain.gain>0?`+${gain.gain} places`:'—'}</span></div><div><small>BIGGEST LOSS</small><b>${loss?esc(driver(loss.row)):'—'}</b><span>${loss&&loss.gain<0?`${loss.gain} places`:'—'}</span></div><div><small>RETIREMENTS</small><b>${i.dnfs.length}</b><span>DNF / DNS / DSQ</span></div><div><small>PIT STOPS</small><b>${pitRows.length||'—'}</b><span>recorded stops</span></div><div><small>DATA</small><b>VALIDATED</b><span>${esc(healthLabel(state.dataHealth.results))}</span></div></div><div class="spacer"></div><div class="actions"><button class="external-btn" onclick="shareText('${esc(r.raceName)} result','${esc(driver(i.winner))} won the ${esc(r.raceName)}. ${leader?`Championship leader: ${esc(driverCode(leader.Driver))} ${esc(leader.points)} pts.`:''}')">SHARE RESULT</button></div></div>`;
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
  const ordered=q?rows.slice().sort((a,b)=>Number(a.position)-Number(b.position)):(Q?.sortResults(rows)||rows);
  const winner=ordered.find(x=>Number(x.position)===1)||ordered[0];
  return `<div class="card classification-card"><div class="eyebrow">${title}</div><div class="classification-head"><span>POS</span><span>DRIVER</span><span>${q?'TIME':'TIME / GAP'}</span></div><div class="classification-list">${ordered.map(x=>{
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
function validSessionPosition(row){const p=Number(row?.position);return Number.isFinite(p)&&p>0?p:null;}
function sortedSessionResults(rows){return Q?.sortResults(rows)||(rows||[]).slice();}
function sessionResultTable(rows,drivers,s){
  if(!rows?.length)return '<div class="card"><div class="empty">Classification not available yet.</div></div>';
  const dmap=openF1DriverMap(drivers);
  const sorted=sortedSessionResults(rows);
  return `<div class="card classification-card"><div class="classification-head"><span>POS</span><span>DRIVER</span><span>${s.key==='race'||s.key==='sprint'?'TIME / GAP':'BEST / GAP'}</span></div><div class="classification-list">${sorted.map(x=>{
    const d=dmap[String(x.driver_number)]||{},team=d.team_name||'',code=d.name_acronym||String(x.driver_number),name=d.last_name||d.full_name||`Car ${x.driver_number}`,gap=openF1Gap(x,s);
    return `<div class="classification-row ${Number(x.position)===1?'winner':''}"><div class="class-pos">${esc(x.position??'—')}</div><div class="driver-line"><i class="team-dot" style="background:${d.team_colour?'#'+d.team_colour:teamColour(team)}"></i><div><div class="driver-name">${esc(code)} · ${esc(name)}</div><div class="driver-meta">${esc(team)}${x.number_of_laps!=null?` · ${esc(x.number_of_laps)} laps`:''}</div></div></div><div class="class-time">${esc(openF1Timing(x,s))}${gap?`<small class="class-gap">${esc(gap)}</small>`:''}</div></div>`;
  }).join('')}</div></div>`;
}

function sessionRecapHtml(rows,drivers,s){
  if(!rows?.length)return '';
  const dmap=openF1DriverMap(drivers),sorted=sortedSessionResults(rows),classified=sorted.filter(x=>validSessionPosition(x)!==null),top=classified.slice(0,3);
  if(!top.length)return '';
  const who=x=>{const d=dmap[String(x.driver_number)]||{};return `${d.name_acronym||x.driver_number} · ${d.last_name||d.full_name||('Car '+x.driver_number)}`;};
  const leader=classified.find(x=>validSessionPosition(x)===1)||top[0],p2=classified.find(x=>validSessionPosition(x)===2)||top[1],dnfs=sorted.filter(x=>x.dnf||x.dns||x.dsq).length;
  const label=(s.key==='race'||s.key==='sprint')?'WINNER':(s.key==='quali'||s.key==='sprintq')?'POLE / P1':'FASTEST';
  const margin=p2?((s.key==='race'||s.key==='sprint')?openF1Timing(p2,s):openF1Gap(p2,s)):'—';
  return `<div class="card recap-card"><div class="eyebrow">SESSION RECAP</div><div class="recap-hero"><div><div class="recap-sub">${label}</div><div class="recap-main">${esc(who(leader))}</div><div class="recap-sub">${esc(openF1Timing(leader,s))}</div></div><div><div class="recap-sub">MARGIN TO P2</div><div class="recap-gap">${esc(margin||'—')}</div>${(s.key==='race'||s.key==='sprint')?`<div class="recap-sub">${dnfs} DNF / DNS / DSQ</div>`:''}</div></div><div class="recap-top3">${top.map(x=>`<div class="recap-line"><strong>P${esc(x.position)}</strong><span>${esc(who(x))}</span><b>${esc(openF1Timing(x,s))}</b></div>`).join('')}</div></div>`;
}
function tyreClass(comp){return String(comp||'UNKNOWN').toLowerCase().replace(/[^a-z]/g,'');}
function raceStrategyHtml(stints,drivers,results){
  if(!stints?.length)return '<div class="card"><div class="eyebrow">TYRE STRATEGY</div><div class="empty">Tyre stint data is not available yet.</div></div>';
  const dmap=openF1DriverMap(drivers),by={};for(const x of stints){(by[String(x.driver_number)]??=[]).push(x);}
  const order=sortedSessionResults(results||[]).map(x=>String(x.driver_number));
  const nums=[...new Set([...order,...Object.keys(by)])];
  return `<div class="card strategy-card"><div class="eyebrow">TYRE STRATEGY</div><div class="strategy-list">${nums.filter(n=>by[n]?.length).map(n=>{const d=dmap[n]||{},ss=by[n].slice().sort((a,b)=>Number(a.stint_number)-Number(b.stint_number));return `<div class="strategy-row"><div class="strategy-driver">${esc(d.name_acronym||n)}</div><div class="strategy-stints">${ss.map(x=>`<span class="tyre ${tyreClass(x.compound)}"><i>${esc((x.compound||'?').slice(0,1))}</i>${esc(x.lap_start??'?')}–${esc(x.lap_end??'?')}</span>`).join('<span class="strategy-arrow">→</span>')}</div><div class="strategy-stops">${Math.max(0,ss.length-1)} stop${ss.length===2?'':'s'}</div></div>`;}).join('')}</div></div>`;
}

async function fetchNoStoreJSON(url,timeoutMs=18000){
  const c=new AbortController(),t=setTimeout(()=>c.abort(),timeoutMs);
  try{const r=await fetch(url,{signal:c.signal,cache:'no-store'});if(!r.ok){const e=new Error(String(r.status));e.status=r.status;throw e;}return await r.json();}
  finally{clearTimeout(t);}
}
async function fetchNoStoreText(url,timeoutMs=18000){
  const c=new AbortController(),t=setTimeout(()=>c.abort(),timeoutMs);
  try{const r=await fetch(url,{signal:c.signal,cache:'no-store'});if(!r.ok){const e=new Error(String(r.status));e.status=r.status;throw e;}return await r.text();}
  finally{clearTimeout(t);}
}

function normaliseCompound(v=''){
  const s=String(v).toUpperCase();
  if(/\bSOFT\b/.test(s)||/^\s*S\b/.test(s))return 'SOFT';
  if(/\bMEDIUM\b/.test(s)||/^\s*M\b/.test(s))return 'MEDIUM';
  if(/\bHARD\b/.test(s)||/^\s*H\b/.test(s))return 'HARD';
  if(/\bINTER/.test(s)||/^\s*I\b/.test(s))return 'INTERMEDIATE';
  if(/\bWET\b/.test(s)||/^\s*W\b/.test(s))return 'WET';
  return '';
}
async function renderSessionResult(round,key){
  const r=state.schedule.find(x=>String(x.round)===String(round));if(!r)return setRoute('races');
  const s=sessions(r).find(x=>x.key===key);if(!s)return setRoute(`race:${round}`);
  if(sessionIsLive(s)){
    view.innerHTML=`<div class="actions"><button class="external-btn" onclick="history.length>1?history.back():setRoute('race:${r.round}')">← WEEKEND</button></div><div class="spacer"></div>${titleBlock(`${flag(r.Circuit.Location.country)} ${r.raceName}`,`${s.name} · LIVE`)}<div class="card"><div class="card-title">Session in progress</div><div class="muted" style="margin-top:7px">Results and telemetry will be available here after the session finishes.</div></div>`;
    return;
  }
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
  const s=cleanMarkdownInline(line).replace(/^[-•]+\s*/,'').trim();if(!s||s.length>90||/^\d/.test(s))return null;
  const tests=[
    [/visa cash app racing bulls|\bracing bulls\b/i,'Racing Bulls'],[/oracle red bull racing|\bred bull racing\b/i,'Red Bull Racing'],
    [/mclaren/i,'McLaren'],[/mercedes/i,'Mercedes'],[/scuderia ferrari|\bferrari\b/i,'Ferrari'],[/aston martin/i,'Aston Martin'],[/williams/i,'Williams'],
    [/\bhaas\b/i,'Haas F1 Team'],[/\balpine\b/i,'Alpine F1 Team'],[/\baudi\b/i,'Audi'],[/\bcadillac\b/i,'Cadillac F1 Team']
  ];
  for(const [rx,name] of tests)if(rx.test(s))return name;return null;
}
function updateBadge(reason,desc,diff){
  const t=`${reason||''} ${desc||''} ${diff||''}`.toLowerCase();
  if(/cooling|heat rejection|temperature/.test(t))return 'COOLING';
  if(/circuit specific|circuit-specific|track specific|track-specific|specific to this (event|circuit)|drag range/.test(t))return 'CIRCUIT';
  if(/previous version|revised|modified|reprofile|changed|updated|compared to/.test(t))return 'MODIFIED';
  return 'NEW';
}
function splitCarDifferenceDescription(rest){
  const s=cleanMarkdownInline(rest);if(!s)return {diff:'',desc:''};
  const sentence=s.match(/^(.{12,220}?[.!?])\s+(.{18,})$/);if(sentence)return {diff:sentence[1].trim(),desc:sentence[2].trim()};
  const cue=/\s+(?=(?:The|A |An |We |This |These |In order |In seeking |As part |Seen as |To improve |Removing |Revised geometry |The geometry |The aerodynamic )\b)/g;let m;
  while((m=cue.exec(s))){if(m.index>=16)return {diff:s.slice(0,m.index).trim(),desc:s.slice(m.index).trim()};}
  return {diff:'',desc:s};
}
function parseFlatCarRow(lines){
  const text=cleanMarkdownInline((lines||[]).join(' '));if(!text)return null;
  const rx=/\b(Performance|Circuit\s+Specific|Circuit\s+specific|Reliability)\b/i,m=rx.exec(text);if(!m)return {component:text.slice(0,80),reason:'',diff:'',desc:text.slice(80).trim(),badge:'NEW'};
  const component=text.slice(0,m.index).trim()||'Update';let tail=text.slice(m.index).trim(),reason='';
  const reasonMatch=tail.match(/^(Reliability|Performance\s*[-–—]?\s*(?:Drag Reduction|Flow Conditioning|Local Load|Balance Range|Drag Range|Cooling|Aerodynamic Performance)?|Circuit\s+Specific\s*[-–—]?\s*(?:Drag Range|Balance Range|Cooling|Local Load|Performance)?)/i);
  if(reasonMatch){reason=cleanMarkdownInline(reasonMatch[0]);tail=tail.slice(reasonMatch[0].length).trim();}else{reason=cleanMarkdownInline(m[0]);tail=tail.slice(m[0].length).trim();}
  const parts=splitCarDifferenceDescription(tail);return {component,reason,diff:parts.diff,desc:parts.desc,badge:updateBadge(reason,parts.desc,parts.diff)};
}
function parseFlatCarRows(lines){
  const rows=[];let cur=null,headerSeen=false;
  for(const raw of lines){const line=cleanMarkdownInline(raw);if(!line)continue;if(/updated\s+component|brief description|geometric differences|primary reason/i.test(line)){headerSeen=true;continue;}if(!headerSeen&&/car presentation/i.test(line))continue;
    const m=line.match(/^(\d{1,2})(?:\s+(.+))?$/);const n=m?Number(m[1]):0;const validStart=!!m&&n>=1&&n<=12&&!/max|words/i.test(line);
    if(validStart){if(cur){const row=parseFlatCarRow(cur.lines);if(row)rows.push(row);}cur={n,lines:[]};if(m[2])cur.lines.push(m[2]);continue;}if(cur)cur.lines.push(line);
  }
  if(cur){const row=parseFlatCarRow(cur.lines);if(row)rows.push(row);}return rows;
}
function parseCarPresentation(raw){
  let t=String(raw||'').replace(/\r/g,'');const marker=t.indexOf('Markdown Content:');if(marker>=0)t=t.slice(marker+'Markdown Content:'.length);
  t=t.replace(/<tr[^>]*>([\s\S]*?)<\/tr>/gi,(all,row)=>{const cells=[...row.matchAll(/<(?:td|th)[^>]*>([\s\S]*?)<\/(?:td|th)>/gi)].map(m=>cleanMarkdownInline(m[1]));return cells.length?`\n| ${cells.join(' | ')} |\n`:all;});
  const lines=t.split('\n'),blocks=[];let block=null;
  for(const line of lines){const maybe=carTeamName(line);if(maybe){if(!block||block.name!==maybe){block={name:maybe,lines:[],noUpdates:false};blocks.push(block);}continue;}if(!block)continue;if(/no updates submitted/i.test(line)){block.noUpdates=true;continue;}block.lines.push(line);}
  const teams=blocks.map(b=>{
    const pipe=[];for(const line of b.lines){if(!line.trim().startsWith('|'))continue;const cells=line.split('|').slice(1,-1).map(cleanMarkdownInline);if(cells.length<3||!/^\d+$/.test(cells[0]))continue;const component=cells[1]||'Update';if(/updated component/i.test(component))continue;const reason=cells[2]||'',diff=cells[3]||'',desc=cells.slice(4).join(' ')||'';pipe.push({component,reason,diff,desc,badge:updateBadge(reason,desc,diff)});}
    const updates=pipe.length?pipe:parseFlatCarRows(b.lines);return {name:b.name,updates,noUpdates:b.noUpdates,parseWarning:!b.noUpdates&&!updates.length};
  });
  return {teams,plain:cleanFiaDocument(t)};
}

function carTeamSlug(name){return String(name||'team').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');}
const OFFICIAL_SCHEMATIC_MARKERS={
  // Coordinates target the actual component on the supplied four-view 2026 reference.
  // The numbered label is offset from this pin so it does not obscure the drawing.
  'front-wing':{x:46.0,y:86.0,view:'SIDE',labelDx:1.2,labelDy:-3.2},
  'nose':{x:48.0,y:35.5,view:'TOP',labelDx:1.0,labelDy:-3.0},
  'front-corner':{x:28.5,y:80.5,view:'FRONT',labelDx:2.1,labelDy:-2.8},
  'floor-fences':{x:63.0,y:39.0,view:'TOP',labelDx:1.3,labelDy:-3.2},
  'sidepod':{x:67.0,y:83.5,view:'SIDE',labelDx:1.5,labelDy:-3.2},
  'floor':{x:73.0,y:91.0,view:'SIDE',labelDx:1.2,labelDy:-3.5},
  'cooling':{x:75.0,y:27.0,view:'TOP',labelDx:1.3,labelDy:-3.0},
  'cockpit':{x:69.0,y:35.0,view:'TOP',labelDx:1.3,labelDy:-3.2},
  'rear-corner':{x:88.0,y:85.0,view:'SIDE',labelDx:-2.0,labelDy:-3.0},
  'rear-body':{x:21.0,y:32.5,view:'REAR',labelDx:1.4,labelDy:-3.2},
  'diffuser':{x:21.0,y:43.5,view:'REAR',labelDx:1.6,labelDy:-2.8},
  'beam-wing':{x:21.0,y:29.5,view:'REAR',labelDx:1.5,labelDy:-3.0},
  'rear-wing':{x:21.0,y:19.3,view:'REAR',labelDx:1.4,labelDy:-3.2}
};
function schematicMarkerPoint(zoneId,stackIndex){
  const base=OFFICIAL_SCHEMATIC_MARKERS[zoneId]||{x:50,y:50,view:'MAP',labelDx:1.3,labelDy:-3};
  // Same-zone updates separate only slightly; the target pin stays on the real component.
  const offsets=[[0,0],[.7,.7],[-.7,-.7],[1.0,-.6],[-1.0,.6],[0,1.1]];
  const off=offsets[stackIndex%offsets.length]||[0,0];
  return {x:Math.max(4,Math.min(96,base.x+off[0])),y:Math.max(6,Math.min(94,base.y+off[1])),view:base.view,labelDx:base.labelDx||1.3,labelDy:base.labelDy||-3};
}
function carSchematicSvg(team,updates){
  const accent=teamColour(team);
  const mapped=CD?.mapUpdates(updates)||updates.map((u,i)=>({...u,maps:[u.map||{id:'unmapped',label:'Location not mapped',confidence:'LOW'}],mapIndex:i+1}));
  const perZoneCount={};
  const markers=mapped.flatMap(u=>{
    const zones=(u.maps?.length?u.maps:[u.map]).filter(z=>z?.id&&z.id!=='unmapped');
    return zones.map(z=>{
      const idx=perZoneCount[z.id]||0;perZoneCount[z.id]=idx+1;
      const pt=schematicMarkerPoint(z.id,idx),tag=`${u.mapIndex}`;
      const target=`car-${carTeamSlug(team)}-${u.mapIndex}`;
      return `<button class="schematic-pin-marker" style="left:${pt.x}%;top:${pt.y}%;--car-accent:${accent};--label-dx:${pt.labelDx}%;--label-dy:${pt.labelDy}%" onclick="focusCarUpdate('${target}')" aria-label="Update ${tag}: ${esc(z.label)} (${pt.view} view)" title="Update ${tag}: ${esc(z.label)} · ${pt.view} view"><i aria-hidden="true"></i><span>${tag}</span></button>`;
    });
  }).join('');
  return `<div class="car-schematic official-schematic" role="img" aria-label="Official-style 2026 Formula 1 reference schematic showing mapped update locations for ${esc(team)}" style="--car-accent:${accent}">
    <div class="official-schematic-labels"><span>REAR VIEW</span><span>TOP VIEW</span><span>FRONT VIEW</span><span>SIDE VIEW</span></div>
    <img class="official-schematic-img" src="tech-car-reference-clean2.png" alt="2026 Formula 1 multi-view technical reference schematic" loading="lazy">
    ${markers}
  </div>`;
}
function carMappingSummaryHtml(team,updates){
  const summary=CD?.mappingSummary(updates)||{coverage:0,known:0,total:updates.length,high:0,mapped:updates.map((u,i)=>({...u,map:{id:'unmapped',label:'Location not mapped',confidence:'LOW'},mapIndex:i+1}))};
  return `<div class="car-map-card"><div class="car-map-head"><div><div class="eyebrow">UPDATE LOCATION MAP</div><div class="card-title">${esc(team)} schematic</div></div><span class="map-coverage ${summary.coverage===100?'complete':''}">${summary.known}/${summary.total} mapped</span></div>${carSchematicSvg(team,updates)}<div class="map-note">The small coloured pin marks the component location; its numbered bubble is offset so it does not cover the technical drawing. Locations come from the FIA component name/description and are approximate, not team CAD geometry.</div></div>`;
}
function focusCarUpdate(id){const el=document.getElementById(id);if(!el)return;el.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'center'});el.classList.remove('update-flash');void el.offsetWidth;el.classList.add('update-flash');setTimeout(()=>el.classList.remove('update-flash'),1000);}
function filterCarUpdateTeams(team){document.querySelectorAll('[data-update-team]').forEach(el=>el.classList.toggle('hidden',team!=='ALL'&&el.dataset.updateTeam!==team));document.querySelectorAll('[data-car-filter]').forEach(b=>b.classList.toggle('active',b.dataset.carFilter===team));}
window.focusCarUpdate=focusCarUpdate;window.filterCarUpdateTeams=filterCarUpdateTeams;
function carUpdatesHtml(parsed,doc){
  if(parsed.teams.length){
    const fav=favouriteTeamName(),ordered=[...parsed.teams].sort((a,b)=>(b.name===fav)-(a.name===fav));
    const filter=fav&&ordered.some(x=>x.name===fav)?`<div class="tabs car-team-filter"><button class="tab active" data-car-filter="ALL" onclick="filterCarUpdateTeams('ALL')">ALL TEAMS</button><button class="tab" data-car-filter="${esc(fav)}" onclick="filterCarUpdateTeams('${esc(fav)}')">★ MY TEAM</button></div>`:'';
    const cards=ordered.map(g=>{
      const mapped=CD?.mapUpdates(g.updates)||g.updates.map((u,i)=>({...u,map:{id:'unmapped',label:'Location not mapped',confidence:'LOW'},mapIndex:i+1}));
      if(!g.updates.length){const declaredNone=g.noUpdates;return `<div class="card update-team-card no-team-updates ${g.name===fav?'favourite-update-team':''}" data-update-team="${esc(g.name)}" style="border-left-color:${teamColour(g.name)}"><div class="update-team-head"><div><div class="card-title">${g.name===fav?'★ ':''}${esc(g.name)}</div><div class="muted update-team-sub">FIA Car Presentation Submission</div></div><div class="update-count zero">${declaredNone?'0 updates':'CHECK DOC'}</div></div><div class="no-update-message"><b>${declaredNone?'NO UPDATES SUBMITTED':'UPDATE TABLE COULD NOT BE SPLIT'}</b><span>${declaredNone?'The team declared no new or revised components for this event.':'F1 Hub found the team in the FIA submission but could not safely split its update rows. Use the official document below rather than guessing.'}</span></div></div>`;}
      return `<div class="card update-team-card ${g.name===fav?'favourite-update-team':''}" data-update-team="${esc(g.name)}" style="border-left-color:${teamColour(g.name)}"><div class="update-team-head"><div><div class="card-title">${g.name===fav?'★ ':''}${esc(g.name)}</div><div class="muted update-team-sub">FIA-declared changes for this weekend</div></div><div class="update-count">${g.updates.length} update${g.updates.length===1?'':'s'}</div></div>${carMappingSummaryHtml(g.name,g.updates)}<div class="team-update-list">${mapped.map(u=>{const ref=`car-${carTeamSlug(g.name)}-${u.mapIndex}`;return `<div id="${ref}" class="update-item"><div class="update-item-top"><span class="update-number">${u.mapIndex}</span><b>${esc(u.component)}</b><span class="update-badge ${u.badge.toLowerCase()}">${esc(u.badge)}</span></div><button class="car-zone-chip confidence-${String(u.map.confidence||'low').toLowerCase()}" onclick="focusCarUpdate('${ref}')">⌖ ${esc((u.maps?.length?u.maps.map(z=>z.label).join(' + '):u.map.label))} · ${esc(u.map.confidence||'LOW')}</button>${u.reason?`<div class="update-reason">${esc(u.reason)}</div>`:''}${u.desc?`<div class="update-desc">${esc(u.desc)}</div>`:''}${u.diff?`<details class="update-details"><summary>Geometry / difference</summary><div>${esc(u.diff)}</div></details>`:''}</div>`;}).join('')}</div></div>`;
    }).join('');
    return `${filter}<div class="update-team-list">${cards}</div><div class="source-note">Official FIA Car Presentation Submission. Location markers are a broad schematic interpretation of the declared component name; the FIA text remains the source of truth for the actual geometry.</div><div class="spacer"></div><div class="actions"><a class="external-btn" target="_blank" rel="noopener" href="${esc(doc.url)}">OFFICIAL FIA DOCUMENT ↗</a></div>`;
  }
  if(parsed.plain){
    return `<div class="card fia-text-card">${renderFiaText(parsed.plain)}</div><div class="source-note">The FIA document was found, but its table layout could not be split reliably into team cards. The readable official text is shown instead.</div><div class="spacer"></div><div class="actions"><a class="external-btn" target="_blank" rel="noopener" href="${esc(doc.url)}">OFFICIAL FIA DOCUMENT ↗</a></div>`;
  }
  return '<div class="card"><div class="empty">No update rows could be read from the FIA document.</div></div>';
}

function fiaCarPresentationEventNames(r){
  const aliases={
    'Chinese Grand Prix':['Grand Prix of China','Chinese Grand Prix'],
    'Spanish Grand Prix':['Spanish Grand Prix','Barcelona-Catalunya Grand Prix'],
    'Barcelona-Catalunya Grand Prix':['Barcelona-Catalunya Grand Prix','Spanish Grand Prix'],
    'United States Grand Prix':['United States Grand Prix','US Grand Prix'],
    'Mexico City Grand Prix':['Mexico City Grand Prix','Mexican Grand Prix'],
    'São Paulo Grand Prix':['São Paulo Grand Prix','Sao Paulo Grand Prix','Brazilian Grand Prix']
  };
  return [...new Set([r?.raceName,...(aliases[r?.raceName]||[])].filter(Boolean))];
}
function fiaDirectCarPresentationUrls(r){
  const slugName=n=>String(n||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/&/g,'and').replace(/[^a-z0-9]+/g,'_').replace(/^_+|_+$/g,'');
  return fiaCarPresentationEventNames(r).map(n=>`https://www.fia.com/system/files/decision-document/${YEAR}_${slugName(n)}_-_car_presentation_submissions.pdf`);
}
function findAnyCarPresentationLink(raw){
  const lines=String(raw||'').split('\n');
  for(const line of lines){
    if(!/Car Presentation Submissions/i.test(line))continue;
    const m=line.match(/\[([^\]]*Car Presentation Submissions[^\]]*)\]\(([^)]+)\)/i);
    if(m)return {title:m[1],url:absoluteFiaUrl(m[2]),score:1};
  }
  return null;
}
async function discoverHistoricalCarPresentation(r){
  // FIA keeps event-specific decision-document pages after a weekend has left the main documents page.
  for(const eventName of fiaCarPresentationEventNames(r)){
    const eventUrl=`https://www.fia.com/documents/championship/event/${encodeURIComponent(eventName)}`;
    try{
      const raw=await fetchText(JINA+eventUrl,`fia-event-${YEAR}-${r.round}-${eventName}`,7*24*3600e3);
      const found=findCarPresentationLink(raw,r)||findAnyCarPresentationLink(raw);
      if(found)return {...found,eventUrl,archive:true};
    }catch{}
  }
  // FIA decision PDFs use a predictable filename. Probe those only after the event-page discovery route.
  for(const url of fiaDirectCarPresentationUrls(r)){
    try{
      const raw=await fetchText(JINA+url,`fia-car-probe-${YEAR}-${r.round}-${url.split('/').pop()}`,30*24*3600e3);
      if(/Car Presentation Submissions|FIA FORMULA 1 WORLD CHAMPIONSHIP/i.test(raw))return {title:'Car Presentation Submissions',url,score:1,archive:true};
    }catch{}
  }
  return null;
}
async function getCarUpdateDoc(r){
  const cached=state.carUpdateDocs[String(r.round)];if(cached)return cached;
  let doc=null;
  // The main FIA documents page is fastest for the current weekend.
  try{
    const text=await fetchText(JINA+FIA_DOCS,'fia-docs',20*60e3);
    doc=findCarPresentationLink(text,r);
  }catch{}
  // Historical rounds live on their FIA event archive pages, not the current documents landing page.
  if(!doc)doc=await discoverHistoricalCarPresentation(r);
  if(doc)state.carUpdateDocs[String(r.round)]=doc;
  return doc;
}
async function drawCarUpdates(root,r){
  root.innerHTML=`<div class="loader">${raceSessionDone(r)?'Checking FIA event archive…':'Checking FIA car presentation submissions…'}</div>`;
  try{
    const doc=await getCarUpdateDoc(r);
    if(!doc)throw new Error('not-published');
    const raw=await fetchText(JINA+doc.url,`fia-car-updates-${r.round}`,6*3600e3);
    const parsed=parseCarPresentation(raw);
    root.innerHTML=titleBlock('TECHNICAL','Car Updates')+carUpdatesHtml(parsed,doc);
  }catch{
    root.innerHTML=`${titleBlock('TECHNICAL','Car Updates')}<div class="card"><div class="empty">A Car Presentation Submission could not be matched to this weekend. F1 Hub checked both the current FIA documents page and the FIA event archive.</div></div><div class="spacer"></div><div class="actions"><a class="external-btn" target="_blank" rel="noopener" href="${FIA_DOCS}">FIA DOCUMENTS ↗</a></div>`;
  }
}
function renderUpdates(){
  const now=Date.now();
  const available=[...state.schedule].filter(r=>{const first=sessions(r)[0]?.iso;return !!first&&new Date(first).getTime()<=now;}).reverse();
  const rows=available.map(r=>{
    const status=raceSessionDone(r)?'PAST WEEKEND':'CURRENT WEEKEND';
    return `<div class="card clickable development-race" onclick="setRoute('carupdates:${r.round}')"><div class="round-box"><small>ROUND</small><b>${esc(r.round)}</b></div><div><div class="race-name">${flag(r.Circuit.Location.country)} ${esc(r.raceName)}</div><div class="race-place">${esc(r.Circuit.circuitName)} · ${fmtDate(raceIso(r),{day:'numeric',month:'short'})}</div></div><div class="development-status">${status}<b>${raceSessionDone(r)?'FIA ARCHIVE ›':'UPDATES ›'}</b></div></div>`;
  }).join('');
  view.innerHTML=titleBlock(`${YEAR} SEASON`,'Car Development')+`<div class="card development-intro"><div class="eyebrow">OFFICIAL FIA SUBMISSIONS · VISUALISED</div><div class="card-title" style="margin-top:5px">See where every declared update sits on the car</div><div class="muted" style="margin-top:5px">F1 Hub reads the FIA Car Presentation Submission, keeps the team's own explanation, and maps recognised components onto an official-style 2026 FIA reference schematic. Tap a numbered marker to jump to the corresponding update.</div>${favouriteTeamName()?`<div class="development-my-team" style="--team:${teamColour(favouriteTeamName())}"><i></i><span>MY TEAM · ${esc(favouriteTeamName())} will be shown first</span></div>`:''}</div><div class="spacer"></div>${rows?`<div class="grid">${rows}</div>`:'<div class="empty">No race weekend has started yet this season.</div>'}<div class="source-note">The FIA submission is the primary technical source. Past rounds are resolved through FIA event archives; the current weekend may remain unavailable until its Car Presentation Submission is published. Diagram locations are component-level maps, not team CAD geometry.</div>`;
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
  u.searchParams.set('date>',start);u.searchParams.set('date<',end);
  return u.toString();
}
let telemetryQueue=Promise.resolve(),telemetryLastRequest=0;
function telemetryFetchJSON(url,key,maxAge=7*864e5,timeoutMs=35000){
  const fresh=cacheGet(key,maxAge);if(fresh&&(!Array.isArray(fresh)||fresh.length))return Promise.resolve(fresh);
  if(Array.isArray(fresh)&&!fresh.length){try{localStorage.removeItem('f1hub:'+key);}catch{}}
  const run=async()=>{
    const gap=Math.max(0,650-(Date.now()-telemetryLastRequest));if(gap)await sleep(gap);
    telemetryLastRequest=Date.now();
    let lastErr;
    for(let attempt=0;attempt<4;attempt++){
      const c=new AbortController(),timer=setTimeout(()=>c.abort(),timeoutMs);
      try{
        const r=await fetch(url,{signal:c.signal,cache:'no-store'});clearTimeout(timer);
        if(!r.ok){const e=new Error(String(r.status));e.status=r.status;if(r.status===429)e.retryAfter=Number(r.headers.get('Retry-After')||0);throw e;}
        const data=await r.json();
        if(!Array.isArray(data)||data.length)cachePut(key,data);
        return data;
      }catch(e){
        clearTimeout(timer);lastErr=e;const status=Number(e?.status||e?.message);
        if(status!==429)throw e;
        const wait=e?.retryAfter?Math.max(1000,e.retryAfter*1000):Math.min(15000,2500*(attempt+1));
        await sleep(wait);telemetryLastRequest=Date.now();
      }
    }
    throw lastErr||new Error('telemetry request failed');
  };
  const job=telemetryQueue.then(run,run);telemetryQueue=job.catch(()=>{});return job;
}
function median(nums){
  const a=nums.filter(Number.isFinite).sort((x,y)=>x-y);if(!a.length)return 0;const m=Math.floor(a.length/2);return a.length%2?a[m]:(a[m-1]+a[m])/2;
}
function nearestCarData(car,t,idx){
  while(idx+1<car.length&&Math.abs(new Date(car[idx+1].date).getTime()-t)<=Math.abs(new Date(car[idx].date).getTime()-t))idx++;
  return [car[idx]||{},idx];
}
function buildTelemetrySeries(car,loc,startMs){
  car=(car||[]).filter(x=>Number.isFinite(new Date(x.date).getTime())).slice().sort((a,b)=>new Date(a.date)-new Date(b.date));
  loc=(loc||[]).filter(x=>Number.isFinite(new Date(x.date).getTime())&&Number.isFinite(Number(x.x))&&Number.isFinite(Number(x.y))&&!(Number(x.x)===0&&Number(x.y)===0)).slice().sort((a,b)=>new Date(a.date)-new Date(b.date));
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
function telemetryWindow(lap){
  const exactStart=new Date(lap.date_start).getTime();if(!Number.isFinite(exactStart))throw new Error('lap start missing');
  const duration=Math.max(20,Number(lap.lap_duration)||120),exactEnd=exactStart+duration*1000;
  return {exactStart,exactEnd,duration,queryStart:exactStart-45000,queryEnd:exactEnd+45000};
}
function sliceTelemetryRows(rows,startMs,endMs){return (rows||[]).filter(x=>{const t=new Date(x.date).getTime();return Number.isFinite(t)&&t>=startMs&&t<=endMs;});}
function lapRowsFromFullSession(rows,approxStart,duration){
  const a=(rows||[]).filter(x=>Number.isFinite(new Date(x.date).getTime())).slice().sort((x,y)=>new Date(x.date)-new Date(y.date));
  if(!a.length)return [];
  let best=0,bestDiff=Infinity;
  for(let i=0;i<a.length;i++){const d=Math.abs(new Date(a[i].date).getTime()-approxStart);if(d<bestDiff){best=i;bestDiff=d;}else if(d>bestDiff+5000&&i>best+20)break;}
  if(bestDiff>120000)return [];
  const anchor=new Date(a[best].date).getTime(),end=anchor+(duration+5)*1000;
  const out=[];for(let i=best;i<a.length;i++){const t=new Date(a[i].date).getTime();if(t>end)break;out.push(a[i]);}
  return out;
}
async function fetchLapTelemetry(sessionKey,driverNumber,lap){
  const w=telemetryWindow(lap),s=new Date(w.queryStart).toISOString(),e=new Date(w.queryEnd).toISOString(),key=`telemetry-${sessionKey}-${driverNumber}-${lap.lap_number}-v4`;
  let car=[],loc=[];
  try{car=await telemetryFetchJSON(rangeUrl('car_data',sessionKey,driverNumber,s,e),`${key}-car`,7*864e5);}catch(e){const st=Number(e?.status||e?.message);if(st===401||st===402||st===403)throw e;}
  try{loc=await telemetryFetchJSON(rangeUrl('location',sessionKey,driverNumber,s,e),`${key}-loc`,7*864e5);}catch{}

  car=lapRowsFromFullSession(car,w.exactStart,w.duration);
  loc=lapRowsFromFullSession(loc,w.exactStart,w.duration);

  if(car.length<8){
    const full=await telemetryFetchJSON(`${OPENF1}/car_data?session_key=${encodeURIComponent(sessionKey)}&driver_number=${encodeURIComponent(driverNumber)}`,`telemetry-full-car-${sessionKey}-${driverNumber}-v4`,7*864e5,50000);
    car=lapRowsFromFullSession(full,w.exactStart,w.duration);
  }
  if(loc.length<5){
    try{
      const fullLoc=await telemetryFetchJSON(`${OPENF1}/location?session_key=${encodeURIComponent(sessionKey)}&driver_number=${encodeURIComponent(driverNumber)}`,`telemetry-full-loc-${sessionKey}-${driverNumber}-v4`,7*864e5,50000);
      loc=lapRowsFromFullSession(fullLoc,w.exactStart,w.duration);
    }catch{loc=[];}
  }
  if(car.length<8)return [];
  const actualStart=new Date(car[0].date).getTime();
  if(loc.length>=5){
    const actualEnd=new Date(car.at(-1).date).getTime()+1500;
    loc=sliceTelemetryRows(loc,actualStart-1500,actualEnd);
  }
  return buildTelemetrySeries(car,loc,actualStart);
}
function openF1LiveWindow(os){
  const st=new Date(os?.date_start).getTime(),en=new Date(os?.date_end||os?.date_start).getTime();
  return Number.isFinite(st)&&Number.isFinite(en)&&Date.now()>=st-30*60e3&&Date.now()<=en+30*60e3;
}
function archiveNorm(v){return String(v||'').toLowerCase().replace(/grand\s+prix/g,'').replace(/[^a-z0-9]/g,'');}
function archiveSessionAliases(s){
  if(s.key==='sprintq')return ['sprintqualifying','sprintshootout'];
  return [archiveNorm(s.openName||s.name)];
}
async function officialArchiveSession(r,s){
  let idx=null;
  try{idx=await archiveFetchJSON(`${F1_ARCHIVE}/${YEAR}/Index.json`,25000);}catch{}
  if(!idx){
    try{idx=await fetchNoStoreJSON(`${ARCHIVE_INDEX_FALLBACK_API}/history/${YEAR}`,12000);}catch{}
  }
  const meetings=idx?.Meetings||idx?.meetings||[];
  const raceKey=archiveNorm(r.raceName),locKey=archiveNorm(r.Circuit?.Location?.locality||r.Circuit?.circuitName);
  let meeting=meetings.find(m=>archiveNorm(m.Name||m.name)===raceKey);
  if(!meeting)meeting=meetings.find(m=>{const n=archiveNorm(m.Name||m.name);return n&&raceKey&&(n.includes(raceKey)||raceKey.includes(n));});
  if(!meeting&&locKey)meeting=meetings.find(m=>archiveNorm(m.Location||m.location||m.Circuit?.Name||m.circuit).includes(locKey));
  if(!meeting)return null;
  const aliases=archiveSessionAliases(s),list=meeting.Sessions||meeting.sessions||[];
  let sess=list.find(x=>aliases.includes(archiveNorm(x.Name||x.Type||x.name||x.type)));
  if(!sess&&s.key==='race')sess=list.find(x=>archiveNorm(x.Type||x.Name||x.type||x.name)==='race');
  if(!sess)return null;
  const path=String(sess.Path||sess.path||'').replace(/^\/+/, '');
  if(!path)return null;
  return {path,base:`${F1_ARCHIVE}/${path.endsWith('/')?path:path+'/'}`,session:sess,meeting};
}
function archiveProxyUrl(url){return `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`;}
async function archiveFetchText(url,timeoutMs=90000){
  const candidates=[url];
  if(String(url).startsWith(`${F1_ARCHIVE}/`))candidates.push(archiveProxyUrl(url));
  let lastErr=null;
  for(const target of candidates){
    const c=new AbortController(),timer=setTimeout(()=>c.abort(),timeoutMs);
    try{
      const r=await fetch(target,{signal:c.signal,cache:'no-store'});
      if(!r.ok){const e=new Error(String(r.status));e.status=r.status;throw e;}
      return (await r.text()).replace(/^\uFEFF/,'');
    }catch(e){lastErr=e;}
    finally{clearTimeout(timer);}
  }
  throw lastErr||new Error('archive-fetch');
}
async function archiveFetchJSON(url,timeoutMs=30000){
  return JSON.parse(await archiveFetchText(url,timeoutMs));
}
async function archiveFetchLines(url,timeoutMs=90000){
  state.archiveRawCache=state.archiveRawCache||{};
  if(state.archiveRawCache[url])return state.archiveRawCache[url];
  const text=await archiveFetchText(url,timeoutMs),lines=text.split(/\r?\n/).filter(Boolean);
  state.archiveRawCache[url]=lines;return lines;
}
function archiveLineMeta(line){
  const q1=line.indexOf('"');if(q1<1)return null;const q2=line.indexOf('"',q1+1);if(q2<0)return null;
  const t=line.slice(0,q1).trim(),m=t.match(/^(\d+):(\d+):(\d+(?:\.\d+)?)$/);if(!m)return null;
  return {elapsed:(Number(m[1])*3600+Number(m[2])*60+Number(m[3]))*1000,b64:line.slice(q1+1,q2)};
}
function base64Bytes(v){const bin=atob(v),out=new Uint8Array(bin.length);for(let i=0;i<bin.length;i++)out[i]=bin.charCodeAt(i);return out;}
async function inflateArchivePayload(b64){
  if(typeof DecompressionStream==='undefined')throw new Error('browser-decompression');
  const ds=new DecompressionStream('deflate-raw');
  const stream=new Blob([base64Bytes(b64)]).stream().pipeThrough(ds);
  const text=(await new Response(stream).text()).replace(/^\uFEFF/,'');
  return JSON.parse(text);
}
function archiveValues(v){return Array.isArray(v)?v:(v&&typeof v==='object'?Object.values(v):[]);}
function archivePayloadUtc(obj,kind){
  if(kind==='car'){for(const e of archiveValues(obj?.Entries))if(e?.Utc)return e.Utc;}
  if(kind==='pos'){for(const e of archiveValues(obj?.Position))if(e?.Timestamp||e?.Utc)return e.Timestamp||e.Utc;}
  return null;
}
async function archiveTimeOffset(lines,kind){
  for(let i=0;i<Math.min(lines.length,600);i++){
    const meta=archiveLineMeta(lines[i]);if(!meta)continue;
    try{const obj=await inflateArchivePayload(meta.b64),utc=archivePayloadUtc(obj,kind),ms=new Date(utc).getTime();if(Number.isFinite(ms))return ms-meta.elapsed;}catch{}
  }
  throw new Error('archive-timebase');
}
function archiveWindows(requests,padMs=45000){
  return requests.map(q=>{const w=telemetryWindow(q.lap);return {driver:String(q.driver),start:w.exactStart-padMs,end:w.exactEnd+padMs,w};});
}
function archiveLineWanted(utcApprox,windows){return windows.some(w=>utcApprox>=w.start&&utcApprox<=w.end);}
async function collectOfficialArchiveRows(lines,offset,requests,kind,onProgress){
  const windows=archiveWindows(requests),drivers=[...new Set(requests.map(x=>String(x.driver)))],out=Object.fromEntries(drivers.map(d=>[d,[]]));
  const selected=[];
  for(const line of lines){const meta=archiveLineMeta(line);if(!meta)continue;if(archiveLineWanted(offset+meta.elapsed,windows))selected.push(meta);}
  let done=0;
  for(const meta of selected){
    const obj=await inflateArchivePayload(meta.b64);done++;
    if(onProgress&&done%80===0)onProgress(done,selected.length,kind);
    if(kind==='car'){
      for(const e of archiveValues(obj?.Entries)){const date=e?.Utc,t=new Date(date).getTime();if(!Number.isFinite(t))continue;for(const d of drivers){if(!windows.some(w=>w.driver===d&&t>=w.start&&t<=w.end))continue;const ch=e?.Cars?.[d]?.Channels;if(!ch)continue;out[d].push({date,rpm:Number(ch['0']),speed:Number(ch['2']),n_gear:Number(ch['3']),throttle:Number(ch['4']),brake:Number(ch['5'])>0?100:0,drs:Number(ch['45'])});}}
    }else{
      for(const e of archiveValues(obj?.Position)){const date=e?.Timestamp||e?.Utc,t=new Date(date).getTime();if(!Number.isFinite(t))continue;for(const d of drivers){if(!windows.some(w=>w.driver===d&&t>=w.start&&t<=w.end))continue;const p=e?.Entries?.[d];if(!p)continue;out[d].push({date,x:Number(p.X),y:Number(p.Y),z:Number(p.Z)});}}
    }
  }
  return out;
}
async function fetchOfficialArchiveComparison(r,s,requests,onProgress){
  const arc=await officialArchiveSession(r,s);if(!arc){const e=new Error('archive-not-ready');e.code='archive-not-ready';throw e;}
  let idx;try{idx=await archiveFetchJSON(`${arc.base}Index.json`,30000);}catch(e){e.code=e.status===404?'archive-not-ready':'archive-fetch';throw e;}
  const carPath=idx?.Feeds?.['CarData.z']?.StreamPath||idx?.feeds?.['CarData.z']?.StreamPath;
  const posPath=idx?.Feeds?.['Position.z']?.StreamPath||idx?.feeds?.['Position.z']?.StreamPath;
  if(!carPath){const e=new Error('archive-not-ready');e.code='archive-not-ready';throw e;}
  onProgress?.(0,1,'download-car');
  const carLines=await archiveFetchLines(`${arc.base}${carPath}`),carOffset=await archiveTimeOffset(carLines,'car');
  const carBy=await collectOfficialArchiveRows(carLines,carOffset,requests,'car',onProgress);
  let posBy=Object.fromEntries(requests.map(q=>[String(q.driver),[]]));
  if(posPath){
    try{onProgress?.(0,1,'download-pos');const posLines=await archiveFetchLines(`${arc.base}${posPath}`),posOffset=await archiveTimeOffset(posLines,'pos');posBy=await collectOfficialArchiveRows(posLines,posOffset,requests,'pos',onProgress);}catch{}
  }
  return requests.map(q=>{
    const w=telemetryWindow(q.lap),d=String(q.driver);let car=lapRowsFromFullSession(carBy[d]||[],w.exactStart,w.duration),loc=lapRowsFromFullSession(posBy[d]||[],w.exactStart,w.duration);
    if(car.length<8)return [];
    const actualStart=new Date(car[0].date).getTime(),actualEnd=new Date(car.at(-1).date).getTime()+1500;
    if(loc.length>=5)loc=sliceTelemetryRows(loc,actualStart-1500,actualEnd);
    return buildTelemetrySeries(car,loc,actualStart);
  });
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
function deltaChart(a,b,names,lapA,lapB){
  const durA=Number(lapA?.lap_duration),durB=Number(lapB?.lap_duration),useOfficial=Number.isFinite(durA)&&durA>0&&Number.isFinite(durB)&&durB>0;
  const pts=[];for(let i=0;i<=100;i++){const p=i/100,ta=useOfficial?normalisedElapsed(a,p,durA):interpElapsed(a,p),tb=useOfficial?normalisedElapsed(b,p,durB):interpElapsed(b,p);if(Number.isFinite(ta)&&Number.isFinite(tb))pts.push({p,delta:ta-tb});}
  if(!pts.length)return '';
  if(useOfficial){const start=pts[0].delta;for(const pt of pts)pt.delta-=start;pts[0].delta=0;pts.at(-1).delta=durA-durB;}
  const finish=pts.at(-1).delta,mx=Math.max(.05,...pts.map(x=>Math.abs(x.delta))),W=720,H=210,path=chartPath(pts,x=>x.delta,-mx,mx,W,H);
  const zero=H/2,finishText=`${finish>0?'+':''}${finish.toFixed(3)} s`;
  return `<div class="card telemetry-chart delta-chart"><div class="telemetry-chart-head"><div><div class="eyebrow">LAP DELTA</div><div class="chart-unit">+ = ${esc(names[0])} slower · − = ${esc(names[0])} faster</div></div></div><svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="none"><line x1="36" y1="${zero}" x2="${W-36}" y2="${zero}" stroke="#777" stroke-dasharray="6 6"/><path d="${path}" fill="none" stroke="#ff4141" stroke-width="4" vector-effect="non-scaling-stroke"/></svg><div class="distance-axis"><span>START · 0.000 s</span><span>LAP DELTA</span><span>FINISH · ${esc(finishText)}</span></div></div>`;
}
function interpXY(series,p){
  const pts=series.filter(x=>Number.isFinite(x.p)&&Number.isFinite(x.x)&&Number.isFinite(x.y));if(pts.length<2)return null;
  let i=1;while(i<pts.length&&pts[i].p<p)i++;if(i>=pts.length)return {x:pts.at(-1).x,y:pts.at(-1).y};
  const a=pts[Math.max(0,i-1)],b=pts[i],span=b.p-a.p;if(span<=0)return {x:b.x,y:b.y};const t=(p-a.p)/span;return {x:a.x+(b.x-a.x)*t,y:a.y+(b.y-a.y)*t};
}
function normalisedElapsed(series,p,lapDuration){
  if(!series.length)return null;const raw=interpElapsed(series,p),start=interpElapsed(series,0),end=interpElapsed(series,1);
  if(!Number.isFinite(raw)||!Number.isFinite(start)||!Number.isFinite(end)||end<=start)return null;
  return (raw-start)/(end-start)*Number(lapDuration);
}
function deltaGainColour(gain,scale){
  const strength=Math.min(1,Math.abs(gain)/Math.max(.001,scale));
  if(Math.abs(gain)<.0015)return '#555';
  return gain<0?mixHex('#6a2020','#ff3232',strength):mixHex('#17354d','#36aef5',strength);
}
function trackDeltaMapSvg(a,b,names,lapA,lapB){
  const base=a.filter(p=>Number.isFinite(p.x)&&Number.isFinite(p.y)).length>=8?a:b;
  if(base.filter(p=>Number.isFinite(p.x)&&Number.isFinite(p.y)).length<8)return `<div class="telemetry-map-empty">Track location unavailable for this comparison.</div>`;
  const bins=180,samples=[];for(let i=0;i<=bins;i++){const p=i/bins,xy=interpXY(base,p),ta=normalisedElapsed(a,p,lapA.lap_duration),tb=normalisedElapsed(b,p,lapB.lap_duration);if(xy&&Number.isFinite(ta)&&Number.isFinite(tb))samples.push({p,x:xy.x,y:xy.y,delta:ta-tb});}
  if(samples.length<20)return `<div class="telemetry-map-empty">Not enough matched track points for a time-gain map.</div>`;
  let gains=[];for(let i=1;i<samples.length;i++)gains.push(samples[i].delta-samples[i-1].delta);
  const smooth=gains.map((_,i)=>{let n=0,sum=0;for(let j=Math.max(0,i-3);j<=Math.min(gains.length-1,i+3);j++){sum+=gains[j];n++;}return sum/Math.max(1,n);});
  const abs=smooth.map(Math.abs).sort((x,y)=>x-y),scale=abs[Math.floor(abs.length*.88)]||.01;
  const xs=samples.map(p=>p.x),ys=samples.map(p=>p.y),xmin=Math.min(...xs),xmax=Math.max(...xs),ymin=Math.min(...ys),ymax=Math.max(...ys),W=720,H=430,pad=28,scl=Math.min((W-pad*2)/Math.max(1,xmax-xmin),(H-pad*2)/Math.max(1,ymax-ymin)),ox=(W-(xmax-xmin)*scl)/2,oy=(H-(ymax-ymin)*scl)/2,xy=p=>[ox+(p.x-xmin)*scl,H-(oy+(p.y-ymin)*scl)];
  let shadow='',lines='';for(let i=1;i<samples.length;i++){const [x1,y1]=xy(samples[i-1]),[x2,y2]=xy(samples[i]),c=deltaGainColour(smooth[i-1]||0,scale);shadow+=`<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}"/>`;lines+=`<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="${c}" stroke-width="8" stroke-linecap="round"/>`;}
  const finish=Number(lapA.lap_duration)-Number(lapB.lap_duration),faster=finish<0?names[0]:finish>0?names[1]:'EVEN',margin=Math.abs(finish);
  return `<div class="telemetry-map-title">${esc(names[0])} vs ${esc(names[1])}</div><div class="delta-map-summary"><b>${esc(faster)}${faster==='EVEN'?'':' faster'}</b><span>${faster==='EVEN'?'Same selected-lap time':margin.toFixed(3)+' s over the lap'}</span></div><svg class="speed-map delta-track-map" viewBox="0 0 ${W} ${H}" role="img" aria-label="Circuit map showing which driver gains time around the lap"><g stroke="#fff" stroke-width="14" opacity=".15" stroke-linecap="round">${shadow}</g>${lines}</svg><div class="delta-map-legend"><span><i class="a"></i>${esc(names[0])} faster</span><span><i class="neutral"></i>similar</span><span><i class="b"></i>${esc(names[1])} faster</span></div><div class="source-note compact">Colour is based on local change in cumulative lap delta, so braking zones and corners where one driver gains time stand out directly on the circuit.</div>`;
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
async function fetchTelemetryComparisonSmart(r,s,os,requests,onProgress){
  let openErr=null;
  try{
    onProgress?.(0,1,'openf1-a');
    const A=await fetchLapTelemetry(os.session_key,requests[0].driver,requests[0].lap);
    onProgress?.(0,1,'openf1-b');
    const B=await fetchLapTelemetry(os.session_key,requests[1].driver,requests[1].lap);
    if(A.length>=8&&B.length>=8)return {series:[A,B],source:'OPENF1 HISTORICAL'};
    const e=new Error('openf1-empty');e.code='openf1-empty';throw e;
  }catch(e){openErr=e;}

  try{
    const series=await fetchOfficialArchiveComparison(r,s,requests,onProgress);
    if(series[0]?.length>=8&&series[1]?.length>=8)return {series,source:'FORMULA 1 TIMING ARCHIVE'};
    const e=new Error('archive-empty');e.code='archive-empty';throw e;
  }catch(archiveErr){
    const status=Number(openErr?.status||openErr?.message);
    if(status===401||status===402||status===403||isOpenF1LockError(openErr)){
      openErr.code='openf1-live-lock';openErr.archiveError=archiveErr;throw openErr;
    }
    if(openErr){openErr.archiveError=archiveErr;throw openErr;}
    throw archiveErr;
  }
}
function openF1LockMessage(){
  return 'OpenF1 did not allow this telemetry request and the Formula 1 timing-archive fallback also failed. Try again shortly; F1 Hub will automatically retry both sources.';
}
function isOpenF1LockError(e){
  const st=Number(e?.status||e?.message);
  return e?.code==='openf1-live-lock'||st===401||st===402||st===403||/session in progress|authenticated users|restricted/i.test(String(e?.message||''));
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
    root.innerHTML=`<div class="card telemetry-controls"><div class="grid two"><label><div class="eyebrow">DRIVER A</div><select id="tel-driver-a">${options}</select></label><label><div class="eyebrow">DRIVER B</div><select id="tel-driver-b">${options}</select></label><label><div class="eyebrow">LAP A</div><select id="tel-lap-a"></select></label><label><div class="eyebrow">LAP B</div><select id="tel-lap-b"></select></label></div><div class="spacer"></div><button id="tel-load" class="external-btn red">LOAD COMPARISON</button></div><div id="telemetry-output"><div class="loader">Loading fastest laps…</div></div><div class="source-note">Telemetry tries OpenF1 historical car/location data first, then Formula 1's official CarData/Position timing archive if OpenF1 is unavailable. The archive also has a free browser read-through fallback for networks that block the F1 static host.</div>`;
    const sa=document.getElementById('tel-driver-a'),sb=document.getElementById('tel-driver-b'),la=document.getElementById('tel-lap-a'),lb=document.getElementById('tel-lap-b'),load=document.getElementById('tel-load'),output=document.getElementById('telemetry-output');
    sa.value=String(da.driver_number);sb.value=String(db.driver_number);
    const fillLaps=(sel,driver,chosen)=>{sel.innerHTML=lapSelectOptions(laps,driver,chosen);};
    fillLaps(la,sa.value,fa?.lap_number);fillLaps(lb,sb.value,fb?.lap_number);
    sa.onchange=()=>fillLaps(la,sa.value);sb.onchange=()=>fillLaps(lb,sb.value);
    const run=async()=>{
      const na=sa.value,nb=sb.value,lpa=validTelemetryLaps(laps,na).find(x=>String(x.lap_number)===la.value),lpb=validTelemetryLaps(laps,nb).find(x=>String(x.lap_number)===lb.value);
      if(!lpa||!lpb)return;output.innerHTML='<div class="loader">Loading car and track data…</div>';load.disabled=true;
      try{
        const progress=(n,total,kind)=>{const label=kind==='openf1-a'?'Loading Driver A from OpenF1…':kind==='openf1-b'?'Loading Driver B from OpenF1…':kind==='download-car'?'Downloading official car-data archive…':kind==='download-pos'?'Downloading official position archive…':kind==='car'?'Decoding car telemetry…':'Decoding track position…';output.innerHTML=`<div class="loader">${label}${total>1?` ${Math.min(100,Math.round(n/total*100))}%`:''}</div>`;};
        const got=await fetchTelemetryComparisonSmart(r,s,os,[{driver:na,lap:lpa},{driver:nb,lap:lpb}],progress),[A,B]=got.series;
        if(!A.length||!B.length){const e=new Error('telemetry-empty');e.code='telemetry-empty';throw e;}
        const nameA=(dmap[String(na)]?.name_acronym||na),nameB=(dmap[String(nb)]?.name_acronym||nb),names=[nameA,nameB],rpmMax=Math.max(10000,...A.map(x=>x.rpm),...B.map(x=>x.rpm));
        output.innerHTML=`<div class="spacer"></div><div class="grid two">${telemetrySummary(A,lpa,nameA)}${telemetrySummary(B,lpb,nameB)}</div><div class="spacer"></div>${sectorComparison(lpa,lpb,names)}<div class="spacer"></div>${titleBlock('TIME GAIN MAP','Who is faster where')}<div class="card speed-map-card delta-map-card">${trackDeltaMapSvg(A,B,names,lpa,lpb)}</div><div class="spacer"></div>${telemetryLineChart('SPEED',A,B,x=>x.speed,'km/h',0,Math.max(360,...A.map(x=>x.speed),...B.map(x=>x.speed)),names)}<div class="spacer"></div>${deltaChart(A,B,names,lpa,lpb)}<div class="spacer"></div>${telemetryLineChart('THROTTLE',A,B,x=>x.throttle,'%',0,100,names)}<div class="spacer"></div>${telemetryLineChart('BRAKE',A,B,x=>x.brake,'0 / 100',0,100,names)}<div class="spacer"></div>${telemetryLineChart('GEAR',A,B,x=>x.gear,'gear',0,8,names)}<div class="spacer"></div>${telemetryLineChart('RPM',A,B,x=>x.rpm,'rpm',0,rpmMax,names)}<div class="spacer"></div><div class="actions"><button class="external-btn" onclick="shareText('F1 Hub telemetry','${nameA} ${formatLapSeconds(lpa.lap_duration)} vs ${nameB} ${formatLapSeconds(lpb.lap_duration)} · ${esc(r.raceName)} ${esc(s.name)}')">SHARE COMPARISON</button></div>`;
      }catch(e){
        let msg='Telemetry could not be loaded for one of these laps. Try another completed lap or try again shortly.';
        const st=Number(e?.status||e?.message);
        if(isOpenF1LockError(e))msg=openF1LockMessage();
        else if(e?.code==='openf1-empty')msg='OpenF1 returned no usable car telemetry for one of these selected laps. Try another completed lap; if every lap fails, the session telemetry has not been published yet.';
        else if(e?.message==='browser-decompression')msg='This browser cannot decode the fallback archive format. Update Chrome/Samsung Internet and try again.';
        output.innerHTML=`<div class="error-box">${esc(msg)}</div>`;
      }
      finally{load.disabled=false;}
    };
    load.onclick=run;output.innerHTML='<div class="card"><div class="empty">Choose two laps and tap Load Comparison.</div></div>';
  }catch(e){
    const msg=isOpenF1LockError(e)?openF1LockMessage():'Post-session lap data is not available yet. Try again shortly after the session results have been published.';
    root.innerHTML=`<div class="card"><div class="empty">${esc(msg)}</div></div>`;
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

async function fetchSeasonSprints(){
  const out=[];
  for(const r of state.schedule.filter(x=>x.Sprint&&raceSessionDone(x))){
    try{const j=await fetchJSON(`${JOLPICA}/${YEAR}/${r.round}/sprint/?limit=100`,`sprint-season-${r.round}`,60*60e3),rr=j?.MRData?.RaceTable?.Races?.[0];if(rr?.SprintResults?.length)out.push({...rr,Results:rr.SprintResults});}catch{}
  }
  return out;
}
function pointsEvolution(ids,races,sprints=[]){
  const rounds=[...new Set([...races,...sprints].map(r=>Number(r.round)).filter(Number.isFinite))].sort((a,b)=>a-b),totals=Object.fromEntries(ids.map(id=>[id,0])),series=Object.fromEntries(ids.map(id=>[id,[]]));
  for(const round of rounds){for(const r of [...races,...sprints].filter(x=>Number(x.round)===round)){for(const id of ids){const x=(r.Results||[]).find(z=>z.Driver?.driverId===id);totals[id]+=Number(x?.points||0);}}for(const id of ids)series[id].push({round,points:totals[id]});}
  return {rounds,series};
}
function evolutionChart(seriesMap,labels,colours){
  const entries=Object.entries(seriesMap).filter(([,v])=>v?.length);if(!entries.length)return '';
  const W=760,H=300,p=38,maxR=Math.max(...entries.flatMap(([,v])=>v.map(x=>x.round))),maxP=Math.max(1,...entries.flatMap(([,v])=>v.map(x=>x.points))),x=r=>p+(r-1)/Math.max(1,maxR-1)*(W-p*2),y=v=>H-p-v/maxP*(H-p*2);
  const grid=[0,.25,.5,.75,1].map(t=>{const yy=p+(H-p*2)*t,val=Math.round(maxP*(1-t));return `<line x1="${p}" y1="${yy}" x2="${W-p}" y2="${yy}"/><text x="4" y="${yy+4}">${val}</text>`;}).join('');
  const paths=entries.map(([id,v],i)=>`<path d="${v.map((pt,j)=>`${j?'L':'M'}${x(pt.round).toFixed(1)},${y(pt.points).toFixed(1)}`).join(' ')}" style="--line:${colours[id]||['#ff3535','#eee','#00d2be','#ff8700','#3671c6'][i%5]}"/>`).join('');
  const legend=entries.map(([id],i)=>`<span><i style="--line:${colours[id]||['#ff3535','#eee','#00d2be','#ff8700','#3671c6'][i%5]}"></i>${esc(labels[id]||id)}</span>`).join('');
  return `<div class="card evolution-card"><div class="eyebrow">POINTS EVOLUTION</div><div class="evolution-legend">${legend}</div><svg class="evolution-svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="Championship points by round"><g class="evolution-grid">${grid}</g>${paths}</svg><div class="distance-axis"><span>R1</span><span>ROUND</span><span>R${maxR}</span></div></div>`;
}
function pairHeadToHead(a,b,races,quali){let raceA=0,raceB=0,qA=0,qB=0;for(const r of races){const x=(r.Results||[]).find(z=>z.Driver.driverId===a),y=(r.Results||[]).find(z=>z.Driver.driverId===b);if(x&&y){if(Number(x.position)<Number(y.position))raceA++;else if(Number(y.position)<Number(x.position))raceB++;}}for(const r of quali){const x=(r.QualifyingResults||[]).find(z=>z.Driver.driverId===a),y=(r.QualifyingResults||[]).find(z=>z.Driver.driverId===b);if(x&&y){if(Number(x.position)<Number(y.position))qA++;else if(Number(y.position)<Number(x.position))qB++;}}return {raceA,raceB,qA,qB};}
async function renderTrends(){
  view.innerHTML=titleBlock(`${YEAR} CHAMPIONSHIP`,'Trends')+'<div class="loader">Building championship trends…</div>';
  try{
    const [races,,sprints]=await Promise.all([getSeasonData(),Promise.resolve(null),fetchSeasonSprints()]).then(([season,_,sp])=>[season[0],season[1],sp]);
    const top=state.drivers.slice(0,5),ids=top.map(x=>x.Driver.driverId),evo=pointsEvolution(ids,races,sprints),labels=Object.fromEntries(top.map(x=>[x.Driver.driverId,driverCode(x.Driver)])),colours=Object.fromEntries(top.map(x=>[x.Driver.driverId,teamColour(x.Constructors?.at(-1)?.name||'')]));
    const contributions=state.constructors.map(c=>{const team=c.Constructor.name,total=Number(c.points||0),members=state.drivers.filter(d=>(d.Constructors?.at(-1)?.name||'')===team).map(d=>({code:driverCode(d.Driver),pts:Number(d.points||0)}));return {team,total,members};});
    view.innerHTML=titleBlock(`${YEAR} CHAMPIONSHIP`,'Trends')+evolutionChart(evo.series,labels,colours)+`<div class="spacer"></div>${titleBlock('CONSTRUCTORS','Driver Contribution')}<div class="grid two">${contributions.map(c=>`<div class="card contribution-card" style="border-top:4px solid ${teamColour(c.team)}"><div class="eyebrow">${esc(c.team)}</div><div class="stat-big">${c.total}<small> pts</small></div><div class="contribution-bar" style="color:${teamColour(c.team)}">${c.members.map((m,i)=>`<i style="width:${c.total?Math.max(2,m.pts/c.total*100):0}%;opacity:${i?0.55:1}"></i>`).join('')}</div>${c.members.map(m=>`<div class="history-leader"><b>${esc(m.code)}</b><span>${m.pts} pts · ${c.total?Math.round(m.pts/c.total*100):0}%</span></div>`).join('')}</div>`).join('')}</div><div class="source-note">Points evolution uses published race and sprint classifications. Constructor contribution compares the current points held by each team's listed drivers with the constructor total.</div>`;
  }catch{view.innerHTML=titleBlock(`${YEAR} CHAMPIONSHIP`,'Trends')+'<div class="error-box">Championship trends could not be calculated right now.</div>';}
}
function formatCompareValue(label,value){
  const v=Number(value);if(!Number.isFinite(v))return '—';
  return /^AVG\b/i.test(String(label||''))?v.toFixed(1):String(Number.isInteger(v)?v:Math.round(v*10)/10);
}
function compareMetricBar(label,a,b,options={}){
  const higher=options.higher!==false;
  const av=Number(a)||0,bv=Number(b)||0,max=Math.max(1,av,bv);
  const aw=max?av/max*100:0,bw=max?bv/max*100:0;
  const aWin=higher?av>bv:av<bv,bWin=higher?bv>av:bv<av,tie=av===bv;
  return `<div class="compare-metric"><div class="compare-metric-top"><span>${esc(label)}</span><b>${tie?'EVEN':aWin?esc(options.aCode||'A'):bWin?esc(options.bCode||'B'):'—'}</b></div><div class="compare-metric-values"><strong class="${aWin&&!tie?'winner':''}">${formatCompareValue(label,av)}</strong><small>${options.aCode||'A'}</small><div class="compare-bar-track"><i class="a" style="width:${aw}%"></i><i class="b" style="width:${bw}%"></i></div><small>${options.bCode||'B'}</small><strong class="${bWin&&!tie?'winner':''}">${formatCompareValue(label,bv)}</strong></div></div>`;
}
function compareDriverStatChip(label,value,sub=''){
  return `<div class="compare-driver-chip"><b>${esc(String(value))}</b><small>${esc(label)}</small>${sub?`<span>${esc(sub)}</span>`:''}</div>`;
}
function compareDriverHero(stat,standing,accent){
  const imgs=driverPhotoUrls(standing),img=imgs[0];
  return `<div class="card compare-driver-card" style="--team:${accent}"><div class="compare-driver-head"><div><div class="eyebrow">#${esc(standing.Driver.permanentNumber||'—')} · ${esc(stat.code)}</div><div class="compare-driver-name">${esc(stat.name)}</div><div class="compare-driver-meta">${esc(stat.nationality)} · ${esc(stat.team)}</div></div><div class="compare-champ-pill"><b>P${esc(stat.champPos||'—')}</b><small>CHAMP</small></div></div><div class="compare-driver-body"><div class="compare-driver-stats">${[
    compareDriverStatChip('POINTS',stat.points),
    compareDriverStatChip('WINS',stat.wins),
    compareDriverStatChip('PODIUMS',stat.pod),
    compareDriverStatChip('AVG FIN',stat.avgF),
    compareDriverStatChip('POLES',stat.poles),
    compareDriverStatChip('DNFS',stat.dnfs)
  ].join('')}</div><div class="compare-driver-media">${img?`<img class="compare-driver-photo" ${driverPhotoAttrs(imgs,stat.code)} onerror="driverPhotoError(this)" alt="${esc(stat.name)}" loading="lazy">`:`<div class="compare-driver-photo avatar">${esc(stat.code)}</div>`}</div></div></div>`;
}
function compareOverviewGraphic(a,b,colours){
  const rows=[
    ['POINTS',Number(a.points||0),Number(b.points||0)],
    ['WINS',Number(a.wins||0),Number(b.wins||0)],
    ['PODIUMS',Number(a.pod||0),Number(b.pod||0)],
    ['POLES',Number(a.poles||0),Number(b.poles||0)]
  ];
  const bars=rows.map(([label,av,bv])=>{const max=Math.max(1,av,bv),ap=max?av/max*100:0,bp=max?bv/max*100:0;return `<div class="compare-overview-row"><div class="compare-overview-label">${esc(label)}</div><div class="compare-overview-values"><b>${av}</b><div class="compare-overview-track"><i class="a" style="width:${ap}%;--team:${colours.a}"></i><i class="b" style="width:${bp}%;--team:${colours.b}"></i></div><b>${bv}</b></div></div>`;}).join('');
  return `<div class="card compare-overview-card"><div class="eyebrow">AT A GLANCE</div><div class="compare-overview-duel"><span><i style="background:${colours.a}"></i>${esc(a.code)}</span><b>VS</b><span><i style="background:${colours.b}"></i>${esc(b.code)}</span></div>${bars}</div>`;
}
function compareRadarSvg(a,b,colours){
  const metrics=[
    ['POINTS',Number(a.points||0),Number(b.points||0),true],
    ['WINS',Number(a.wins||0),Number(b.wins||0),true],
    ['PODIUMS',Number(a.pod||0),Number(b.pod||0),true],
    ['POLES',Number(a.poles||0),Number(b.poles||0),true],
    ['AVG FIN',Number(a.avgFNum||0),Number(b.avgFNum||0),false],
    ['AVG Q',Number(a.avgQNum||0),Number(b.avgQNum||0),false]
  ];
  const cx=180,cy=180,rMax=118;
  const ptsFor=(idx,val,max,invert=false)=>{const ang=(-90+(360/metrics.length)*idx)*Math.PI/180;const norm=max<=0?.1:(invert?(1-((val-1)/Math.max(1,max-1))):(val/max));const rr=28+Math.max(.08,Math.min(.98,norm))*rMax;return [cx+Math.cos(ang)*rr,cy+Math.sin(ang)*rr];};
  const outer=metrics.map((m,idx)=>{const ang=(-90+(360/metrics.length)*idx)*Math.PI/180;return [cx+Math.cos(ang)*(rMax+18),cy+Math.sin(ang)*(rMax+18),m[0],ang];});
  const poly=(side)=>metrics.map((m,idx)=>{const max=Math.max(1,m[1],m[2]);const val=side==='a'?m[1]:m[2];const invert=m[3]===false;const [x,y]=ptsFor(idx,val,max,invert);return `${x.toFixed(1)},${y.toFixed(1)}`;}).join(' ');
  const grid=[.25,.5,.75,1].map(level=>`<polygon points="${metrics.map((m,idx)=>{const ang=(-90+(360/metrics.length)*idx)*Math.PI/180;const rr=28+level*rMax;return `${(cx+Math.cos(ang)*rr).toFixed(1)},${(cy+Math.sin(ang)*rr).toFixed(1)}`;}).join(' ')}"></polygon>`).join('');
  const spokes=metrics.map((m,idx)=>{const ang=(-90+(360/metrics.length)*idx)*Math.PI/180;return `<line x1="${cx}" y1="${cy}" x2="${(cx+Math.cos(ang)*(rMax+8)).toFixed(1)}" y2="${(cy+Math.sin(ang)*(rMax+8)).toFixed(1)}"></line>`;}).join('');
  const labels=outer.map(([x,y,label,ang])=>`<text x="${x.toFixed(1)}" y="${y.toFixed(1)}" text-anchor="${Math.abs(Math.cos(ang))<0.25?'middle':Math.cos(ang)>0?'start':'end'}">${esc(label)}</text>`).join('');
  return `<div class="card compare-radar-card"><div class="eyebrow">SEASON PROFILE</div><svg class="compare-radar" viewBox="0 0 360 360" role="img" aria-label="Driver comparison radar chart"><g class="compare-radar-grid">${grid}${spokes}</g><polygon class="compare-radar-poly a" points="${poly('a')}" style="--team:${colours.a}"></polygon><polygon class="compare-radar-poly b" points="${poly('b')}" style="--team:${colours.b}"></polygon><circle cx="${cx}" cy="${cy}" r="5" class="compare-radar-centre"></circle><g class="compare-radar-labels">${labels}</g></svg><div class="compare-radar-legend"><span><i style="background:${colours.a}"></i>${esc(a.code)} · ${esc(a.team)}</span><span><i style="background:${colours.b}"></i>${esc(b.code)} · ${esc(b.team)}</span></div></div>`;
}
function compareSummaryCard(a,b,h){
  const pointDiff=Math.abs(Number(a.points||0)-Number(b.points||0));
  const leader=Number(a.points||0)===Number(b.points||0)?'Points level':`${Number(a.points||0)>Number(b.points||0)?a.code:b.code} leads by ${pointDiff} point${pointDiff===1?'':'s'}`;
  return `<div class="card compare-summary-card"><div class="eyebrow">HEAD TO HEAD</div><div class="compare-summary-lead">${esc(leader)}</div><div class="compare-summary-grid"><div><b>${h.qA}</b><small>${esc(a.code)} QUALI WINS</small></div><div><b>${h.qB}</b><small>${esc(b.code)} QUALI WINS</small></div><div><b>${h.raceA}</b><small>${esc(a.code)} RACE WINS</small></div><div><b>${h.raceB}</b><small>${esc(b.code)} RACE WINS</small></div></div></div>`;
}
function renderCompare(){
  const opts=state.drivers.map(s=>`<option value="${esc(s.Driver.driverId)}">${esc(fullName(s.Driver))}</option>`).join('');
  const defaultA=state.drivers[0]?.Driver?.driverId||'',defaultB=state.drivers[1]?.Driver?.driverId||defaultA;
  if(!state.compareA)state.compareA=defaultA;
  if(!state.compareB||state.compareB===state.compareA)state.compareB=defaultB;
  view.innerHTML=`<div class="compare-page" data-no-swipe>${titleBlock(`${YEAR} SEASON`,'Driver Compare')}<div class="card compare-form-card"><div class="grid two"><label><div class="eyebrow">DRIVER A</div><select id="cmp-a">${opts}</select></label><label><div class="eyebrow">DRIVER B</div><select id="cmp-b">${opts}</select></label></div><div class="spacer"></div><button id="cmp-go" class="external-btn red">COMPARE</button></div><div id="cmp-out" class="spacer">${state.compareBusy?'<div class="loader">Comparing…</div>':state.compareResultHtml}</div></div>`;
  const a=document.getElementById('cmp-a'),b=document.getElementById('cmp-b'),out=document.getElementById('cmp-out');
  if(a&&[...a.options].some(o=>o.value===state.compareA))a.value=state.compareA;
  if(b&&[...b.options].some(o=>o.value===state.compareB))b.value=state.compareB;
  a?.addEventListener('change',()=>{state.compareA=a.value});
  b?.addEventListener('change',()=>{state.compareB=b.value});
  document.getElementById('cmp-go').onclick=async()=>{
    state.compareA=a.value;state.compareB=b.value;
    if(a.value===b.value){state.compareResultHtml='<div class="error-box">Choose two different drivers.</div>';out.innerHTML=state.compareResultHtml;return;}
    state.compareBusy=true;out.innerHTML='<div class="loader">Comparing…</div>';
    out.scrollIntoView?.({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'});
    try{
      const [[races,quali],sprints]=await Promise.all([getSeasonData(),fetchSeasonSprints()]);
      const byId=Object.fromEntries(state.drivers.map(s=>[s.Driver.driverId,s]));
      const sa=byId[a.value],sb=byId[b.value],aa=simpleDriverStats(a.value,races,quali,byId),bb=simpleDriverStats(b.value,races,quali,byId),h=pairHeadToHead(a.value,b.value,races,quali),evo=pointsEvolution([a.value,b.value],races,sprints),labels={[a.value]:aa.code,[b.value]:bb.code};
      const teamA=teamColour(sa?.Constructors?.at(-1)?.name||''),teamBRaw=teamColour(sb?.Constructors?.at(-1)?.name||''),teamB=teamA.toLowerCase()===teamBRaw.toLowerCase()?'#f1f1f1':teamBRaw,colours={a:teamA,b:teamB,[a.value]:teamA,[b.value]:teamB};
      const metrics=[
        compareMetricBar('POINTS',aa.points,bb.points,{aCode:aa.code,bCode:bb.code}),
        compareMetricBar('WINS',aa.wins,bb.wins,{aCode:aa.code,bCode:bb.code}),
        compareMetricBar('PODIUMS',aa.pod,bb.pod,{aCode:aa.code,bCode:bb.code}),
        compareMetricBar('POLES',aa.poles,bb.poles,{aCode:aa.code,bCode:bb.code}),
        compareMetricBar('DNFS',aa.dnfs,bb.dnfs,{aCode:aa.code,bCode:bb.code,higher:false}),
        compareMetricBar('AVG FINISH',aa.avgFNum,bb.avgFNum,{aCode:aa.code,bCode:bb.code,higher:false}),
        compareMetricBar('AVG QUALI',aa.avgQNum,bb.avgQNum,{aCode:aa.code,bCode:bb.code,higher:false})
      ].join('');
      state.compareResultHtml=`${compareOverviewGraphic(aa,bb,colours)}<div class="spacer"></div>${compareSummaryCard(aa,bb,h)}<div class="spacer"></div><div class="grid desktop-two compare-deck"><div>${compareRadarSvg(aa,bb,colours)}</div><div class="card compare-metrics-card"><div class="eyebrow">METRICS</div>${metrics}</div></div><div class="spacer"></div><div class="grid two compare-hero-grid">${compareDriverHero(aa,sa,colours.a)}${compareDriverHero(bb,sb,colours.b)}</div><div class="spacer"></div>${evolutionChart(evo.series,labels,colours)}<div class="spacer"></div><div class="actions"><button class="external-btn" onclick="shareText('F1 Hub driver comparison','${aa.code} vs ${bb.code}: ${aa.points}-${bb.points} pts, qualifying H2H ${h.qA}-${h.qB}, race H2H ${h.raceA}-${h.raceB}.')">SHARE COMPARISON</button></div>`;
      out.innerHTML=state.compareResultHtml;
    }catch{state.compareResultHtml='<div class="error-box">Could not load season history.</div>';out.innerHTML=state.compareResultHtml;}
    finally{state.compareBusy=false;}
  };
}
function simpleDriverStats(id,races,quali,byId){
  let pod=0,dnfs=0,poles=0,fin=[],qpos=[];
  for(const r of races){const x=(r.Results||[]).find(z=>z.Driver.driverId===id);if(x){if(Number(x.position)<=3)pod++;if(dnf(x))dnfs++;if(Number(x.position))fin.push(Number(x.position));}}
  for(const q of quali){const x=(q.QualifyingResults||[]).find(z=>z.Driver.driverId===id);if(x&&Number(x.position))qpos.push(Number(x.position));if(Number(x?.position)===1)poles++;}
  const s=byId[id],team=s?.Constructors?.at(-1)?.name||'';
  const avgF=fin.length?(fin.reduce((a,b)=>a+b,0)/fin.length):null,avgQ=qpos.length?(qpos.reduce((a,b)=>a+b,0)/qpos.length):null;
  return {id,name:fullName(s.Driver),nationality:s.Driver.nationality,team,champPos:Number(s.position||0),code:driverCode(s.Driver),points:Number(s.points||0),wins:Number(s.wins||0),pod,poles,dnfs,avgF:avgF!==null?avgF.toFixed(1):'—',avgFNum:avgF||0,avgQ:avgQ!==null?avgQ.toFixed(1):'—',avgQNum:avgQ||0};
}

function setupPullToRefresh(){
  const indicator=document.getElementById('pull-indicator');
  let startY=0,startX=0,pulling=false,dist=0;
  const reset=()=>{
    pulling=false;dist=0;
    view.classList.remove('pulling');
    view.style.transform='';
    if(indicator)indicator.classList.remove('show','ready');
  };
  window.addEventListener('touchstart',e=>{
    if(e.target?.closest?.('.leaflet-container,select,input,textarea,[data-no-pull]'))return;
    if(window.scrollY<=0&&!state.refreshing&&e.touches?.length===1){
      startY=e.touches[0].clientY;startX=e.touches[0].clientX;pulling=true;dist=0;view.classList.add('pulling');
    }
  },{passive:true});
  window.addEventListener('touchmove',e=>{
    if(!pulling||!e.touches?.length)return;
    const dy=e.touches[0].clientY-startY,dx=e.touches[0].clientX-startX;if(Math.abs(dx)>Math.abs(dy)*1.15){dist=0;return;}dist=Math.max(0,dy);
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

function setupSwipeNavigation(){
  let startX=0,startY=0,lastX=0,lastT=0,velocityX=0,tracking=false,horizontal=false,frame=0,target=null,visualSerial=0,snapshot=null,finishTimer=0;
  const preview=document.createElement('div');preview.className='swipe-preview';preview.setAttribute('aria-hidden','true');document.getElementById('app-shell')?.insertBefore?.(preview,view);
  const stopVisual=()=>{visualSerial++;clearTimeout(finishTimer);if(snapshot){snapshot.remove();snapshot=null;}view.style.transition='none';view.style.transform='';view.classList.remove('swipe-dragging');preview.className='swipe-preview';preview.style.removeProperty('--swipe-progress');};
  const resetGesture=()=>{cancelAnimationFrame(frame);tracking=false;horizontal=false;target=null;velocityX=0;window.__f1SwipeActive=false;view.classList.remove('swipe-dragging');};
  const paint=(dx,tgt)=>{cancelAnimationFrame(frame);frame=requestAnimationFrame(()=>{const width=Math.max(1,window.innerWidth),edge=tgt?Math.max(-width,Math.min(width,dx)):dx*.16,progress=Math.min(1,Math.abs(edge)/width);view.classList.add('swipe-dragging');view.style.transition='none';view.style.transform=`translate3d(${edge}px,0,0)`;if(tgt){const meta=SWIPE_META[tgt]||['',''];preview.innerHTML=`<span>${meta[0]}</span><b>${meta[1]}</b><small>RELEASE TO OPEN</small>`;preview.classList.add('show');preview.classList.toggle('from-right',dx<0);preview.classList.toggle('from-left',dx>0);preview.style.setProperty('--swipe-progress',String(progress));}else preview.classList.remove('show');});};
  const cancelSwipe=()=>{const id=++visualSerial;resetGesture();view.style.transition='transform .14s cubic-bezier(.2,.82,.2,1)';view.style.transform='translate3d(0,0,0)';preview.classList.remove('show');finishTimer=setTimeout(()=>{if(id!==visualSerial)return;view.style.transition='none';view.style.transform='';preview.className='swipe-preview';},150);};
  const makeSnapshot=()=>{const rect=view.getBoundingClientRect();let snap;if(state.route==='news'){snap=document.createElement('div');snap.className='swipe-snapshot swipe-news-snapshot';snap.innerHTML='<div class="swipe-news-ghost"><small>MULTI-SOURCE</small><b>LATEST NEWS</b><i></i><i></i><i></i><i></i></div>';}else{snap=view.cloneNode(true);snap.removeAttribute('id');snap.querySelectorAll('[id]').forEach(x=>x.removeAttribute('id'));snap.className='swipe-snapshot';}snap.style.top=`${Math.max(0,rect.top)}px`;snap.style.height=`${Math.max(120,window.innerHeight-Math.max(0,rect.top)-72)}px`;snap.style.transform=view.style.transform||'translate3d(0,0,0)';document.body.appendChild(snap);return snap;};
  const commitSwipe=(route,dx)=>{
    const dir=dx<0?-1:1,id=++visualSerial,width=Math.max(320,window.innerWidth);clearTimeout(finishTimer);if(snapshot)snapshot.remove();snapshot=makeSnapshot();resetGesture();preview.classList.remove('show');
    state.route=route;state.routeMotionDirection='';if(location.hash!==`#${encodeURIComponent(route)}`)history.pushState({route},'',`#${encodeURIComponent(route)}`);document.querySelectorAll('.nav-btn').forEach(b=>b.classList.toggle('active',route===b.dataset.route));window.scrollTo({top:0,behavior:'instant'});
    view.style.transition='none';view.style.transform=`translate3d(${-dir*Math.min(72,width*.12)}px,0,0)`;render();
    requestAnimationFrame(()=>requestAnimationFrame(()=>{if(id!==visualSerial)return;view.style.transition='transform .15s cubic-bezier(.16,.9,.22,1)';view.style.transform='translate3d(0,0,0)';if(snapshot){snapshot.style.transition='transform .15s cubic-bezier(.4,0,.2,1),opacity .15s ease';snapshot.style.transform=`translate3d(${dir*width}px,0,0)`;snapshot.style.opacity='0';}finishTimer=setTimeout(()=>{if(id!==visualSerial)return;if(snapshot){snapshot.remove();snapshot=null;}view.style.transition='none';view.style.transform='';},165);}));
    if(route==='news'&&!state.news.length&&!state.newsRefreshing)setTimeout(()=>refreshNewsOnly(true),0);
  };
  const swipeBlockedTarget=el=>{
    const interactive=el?.closest?.('button,input,select,textarea,.tabs,.news-source-tabs,.weather-session-tabs,.leaflet-container,.car-schematic [data-no-swipe],[data-no-swipe]');
    // More is made almost entirely from menu buttons: let a horizontal drag start on those cards.
    if(interactive?.classList?.contains('menu-card'))return false;
    return !!interactive;
  };
  window.addEventListener('click',e=>{if(Number(window.__f1SuppressSwipeClickUntil||0)>performance.now()){const c=e.target?.closest?.('.menu-card,.news-link');if(c){e.preventDefault();e.stopPropagation();}}},true);
  window.addEventListener('touchstart',e=>{
    if(!TOP_LEVEL_ROUTES.includes(state.route)||e.touches?.length!==1)return;if(swipeBlockedTarget(e.target))return;
    stopVisual();const p=e.touches[0];startX=lastX=p.clientX;startY=p.clientY;lastT=performance.now();velocityX=0;tracking=true;horizontal=false;target=null;
  },{passive:true});
  window.addEventListener('touchmove',e=>{if(!tracking||!e.touches?.length)return;const p=e.touches[0],dx=p.clientX-startX,dy=p.clientY-startY;if(!horizontal){if(Math.abs(dx)<5&&Math.abs(dy)<5)return;if(Math.abs(dx)<=Math.abs(dy)*1.08){tracking=false;return;}horizontal=true;window.__f1SwipeActive=true;view.classList.add('swipe-dragging');}e.preventDefault();target=swipeTarget(state.route,dx);const now=performance.now(),moveDt=Math.max(6,now-lastT);velocityX=.65*velocityX+.35*((p.clientX-lastX)/moveDt);lastX=p.clientX;lastT=now;paint(dx,target);},{passive:false});
  window.addEventListener('touchend',e=>{if(!tracking){if(horizontal)cancelSwipe();return;}const p=e.changedTouches?.[0],endX=p?.clientX??lastX,endY=p?.clientY??startY,dx=endX-startX,dy=endY-startY,width=Math.max(320,window.innerWidth),quickTarget=target||swipeTarget(state.route,dx),elapsed=Math.max(1,performance.now()-lastT),velocityGuess=Math.max(Math.abs(velocityX),Math.abs(endX-lastX)/elapsed,Math.abs(dx)/Math.max(1,performance.now()-(lastT-16))),mostlyHorizontal=Math.abs(dx)>Math.abs(dy)*(state.route==='more'?0.92:1.04),distanceThreshold=Math.min(state.route==='more'?58:78,width*(state.route==='more'?.13:.17)),flickThreshold=state.route==='more'?.22:.28,commit=quickTarget&&mostlyHorizontal&&(Math.abs(dx)>=distanceThreshold||(Math.abs(dx)>=20&&velocityGuess>flickThreshold));if(commit){window.__f1SuppressSwipeClickUntil=performance.now()+360;commitSwipe(quickTarget,dx);}else cancelSwipe();},{passive:true});
  window.addEventListener('touchcancel',()=>{if(tracking||horizontal)cancelSwipe();},{passive:true});
}
function enhanceAccessibility(){
  view.querySelectorAll('.clickable[onclick],.steward-link[onclick]').forEach(el=>{if(el.tagName==='BUTTON'||el.tagName==='A')return;if(!el.hasAttribute('role'))el.setAttribute('role','button');if(!el.hasAttribute('tabindex'))el.tabIndex=0;if(!el.dataset.keyReady){el.dataset.keyReady='1';el.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();el.click();}});}});
}
new MutationObserver(enhanceAccessibility).observe(view,{childList:true,subtree:true});
async function checkForUpdate(){
  if(location.protocol==='file:')return;
  try{const r=await fetch(`./version.json?_=${Date.now()}`,{cache:'no-store'});if(!r.ok)return;const v=(await r.json())?.version;if(v&&v!==APP_VERSION){state.updateAvailable=true;document.getElementById('update-banner')?.classList.remove('hidden');}}catch{}
}
async function applyAppUpdate(){
  try{if('caches' in window){for(const k of await caches.keys())if(k.startsWith('f1-hub-'))await caches.delete(k);}const reg=await navigator.serviceWorker?.getRegistration?.();await reg?.update?.();}catch{}location.reload();
}
window.applyAppUpdate=applyAppUpdate;

function launchWeekendSummary(){
  if(!state.schedule.length)return {eyebrow:'F1 HUB',title:'RACE WEEKEND COMPANION',detail:'Loading the season…'};
  const r=currentRace(),live=r?sessions(r).find(sessionIsLive):null,ns=r?nextSession(r):null;
  if(!r)return {eyebrow:'F1 HUB',title:`${YEAR} SEASON`,detail:'Race weekend companion'};
  if(live)return {eyebrow:`${flag(r.Circuit.Location.country)} RACE WEEKEND · LIVE`,title:r.raceName.toUpperCase(),detail:`${live.name} is in progress`};
  if(ns)return {eyebrow:`${flag(r.Circuit.Location.country)} NEXT · ROUND ${r.round}`,title:r.raceName.toUpperCase(),detail:`${ns.name} · ${fmtDateTime(ns.iso)} UK`};
  return {eyebrow:`${flag(r.Circuit.Location.country)} ROUND ${r.round}`,title:r.raceName.toUpperCase(),detail:'Weekend complete'};
}
function updateLaunchContent(){
  const el=document.getElementById('launch-screen');if(!el)return;const info=launchWeekendSummary();
  const eyebrow=el.querySelector?.('[data-launch-eyebrow]'),title=el.querySelector?.('[data-launch-title]'),detail=el.querySelector?.('[data-launch-detail]');if(eyebrow)eyebrow.textContent=info.eyebrow;if(title)title.textContent=info.title;if(detail)detail.textContent=info.detail;
}
function showLaunchSequence(short=false){
  const el=document.getElementById('launch-screen');if(!el)return;updateLaunchContent();
  const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.body.classList.add('launching');document.body.classList.remove('launch-revealing');
  el.classList.remove('hidden','leaving','short');if(short)el.classList.add('short');
  clearTimeout(showLaunchSequence._timer);clearTimeout(showLaunchSequence._hideTimer);
  const displayMs=reduced?520:(short?1550:2350),hideMs=reduced?120:700;
  showLaunchSequence._timer=setTimeout(()=>{
    el.classList.add('leaving');document.body.classList.remove('launching');document.body.classList.add('launch-revealing');
    showLaunchSequence._hideTimer=setTimeout(()=>{el.classList.add('hidden');document.body.classList.remove('launch-revealing');},hideMs);
  },displayMs);
}
window.setRoute=setRoute;
window.refreshNewsOnly=refreshNewsOnly;
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
document.getElementById('connection-pill')?.addEventListener('click',()=>setRoute('datahealth'));
document.getElementById('update-now')?.addEventListener('click',applyAppUpdate);
document.getElementById('install-app-btn')?.addEventListener('click',requestInstall);
window.addEventListener('popstate',()=>{state.route=decodeURIComponent(location.hash.slice(1)||'home');document.querySelectorAll('.nav-btn').forEach(b=>b.classList.toggle('active',parentNav(state.route)===b.dataset.route));render();requestAnimationFrame(animateRouteContent);});
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
if('serviceWorker' in navigator && location.protocol!=='file:')navigator.serviceWorker.register('./service-worker.js',{updateViaCache:'none'}).then(r=>{r.update();checkForUpdate();}).catch(()=>{});
if(!navigator.onLine){document.getElementById('connection-pill').textContent='OFFLINE';document.getElementById('connection-pill').className='pill warn';}
updateInstallUI();
setupPullToRefresh();
setupSwipeNavigation();
let newsBackgroundedAt=Date.now();
document.addEventListener('visibilitychange',()=>{
  if(document.hidden){newsBackgroundedAt=Date.now();return;}
  const awayFor=Date.now()-newsBackgroundedAt;if(awayFor>10*60e3)showLaunchSequence(true);
  const age=Date.now()-(state.newsUpdatedAt||0);
  if(age>3*60e3||Date.now()-newsBackgroundedAt>3*60e3)refreshNewsOnly(true);
  if(state.loaded&&latestCompletedRace()&&Date.now()-(state.standingsUpdatedAt||0)>5*60e3)refreshChampionshipOnly();
});
window.addEventListener('pageshow',()=>{if(state.loaded&&Date.now()-(state.newsUpdatedAt||0)>3*60e3)refreshNewsOnly(true);if(state.loaded&&latestCompletedRace()&&Date.now()-(state.standingsUpdatedAt||0)>5*60e3)refreshChampionshipOnly();});
setInterval(()=>{if(!document.hidden&&state.loaded&&Date.now()-(state.newsUpdatedAt||0)>10*60e3)refreshNewsOnly(true);},60e3);
setInterval(()=>{if(!document.hidden)checkForUpdate();},15*60e3);
hydrateBaseFromCache();
applyPersonalTheme();
showLaunchSequence(false);
loadBase();

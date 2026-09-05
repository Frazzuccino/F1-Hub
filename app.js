'use strict';

const YEAR = new Date().getFullYear();
const UK_TZ = 'Europe/London';
const JOLPICA = 'https://api.jolpi.ca/ergast/f1';
const OPENF1 = 'https://api.openf1.org/v1';
const NEWS_URL = 'https://api.rss2json.com/v1/api.json?rss_url=' + encodeURIComponent('https://feeds.bbci.co.uk/sport/formula1/rss.xml');
const FIA_DOCS = 'https://www.fia.com/documents/formula-1';
const PENALTY_SOURCE = 'https://racingnews365.com/penalty-points-f1-drivers';
const REPRIMAND_SOURCE = 'https://timepenalty.com/guide/reprimand';
const JINA = 'https://r.jina.ai/';
const WIKI_API = 'https://en.wikipedia.org/w/api.php';
const APP_VERSION = '1.1';

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
  route:'home', schedule:[], drivers:[], constructors:[], photos:{}, wikiPhotos:{}, news:[], penaltyPoints:{...FALLBACK_POINTS}, reprimands:{...FALLBACK_REPRIMANDS},
  loaded:false, refreshing:false, installPrompt:null, countdownTimer:null, dataStamp:null
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
  const raw=[['FP1',r.FirstPractice],['FP2',r.SecondPractice],['FP3',r.ThirdPractice],['SPRINT QUALI',r.SprintQualifying],['SPRINT',r.Sprint],['QUALIFYING',r.Qualifying],['RACE',{date:r.date,time:r.time}]];
  return raw.filter(([,x])=>x?.date).map(([name,x])=>({name,iso:isoOf(x)})).sort((a,b)=>new Date(a.iso)-new Date(b.iso));
}
function currentRace(){
  const now=Date.now(); return state.schedule.find(r=>{const ss=sessions(r);const start=new Date(ss[0]?.iso||raceIso(r)).getTime()-12*3600e3;const end=new Date(raceIso(r)).getTime()+5*3600e3;return now>=start&&now<=end;}) || state.schedule.find(r=>new Date(raceIso(r)).getTime()+5*3600e3>now) || state.schedule.at(-1);
}
function nextSession(r){ const now=Date.now(); return sessions(r).find(s=>new Date(s.iso).getTime()>now) || null; }
function raceStatus(r){ const now=Date.now(),t=new Date(raceIso(r)).getTime(); if(t+5*3600e3<now)return 'DONE'; if(currentRace()?.round===r.round)return 'NEXT'; return 'UPCOMING'; }
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
function driverPhotoUrls(s){ const d=s?.Driver||s; const of=state.photos[driverCode(d)]?.headshot_url; const wiki=state.wikiPhotos[d?.driverId]; return [...new Set([of,wiki].filter(Boolean))]; }
function driverPhotoError(img){ const fb=img.dataset.fallback; if(fb){img.dataset.fallback='';img.src=fb;return;} const holder=img.closest('.driver-photo-holder, .profile-photo-holder'); if(holder){holder.innerHTML=`<div class="avatar ${holder.classList.contains('profile-photo-holder')?'profile-avatar':''}">${esc(img.dataset.code||'---')}</div>`;} else {img.style.display='none';} }
window.driverPhotoError=driverPhotoError;

async function loadBase(force=false){
  state.refreshing=true; if(force){['schedule','drivers','constructors','photos','wiki-photos-'+YEAR,'news'].forEach(k=>localStorage.removeItem('f1hub:'+k));}
  try{
    const [sched,ds,cs,of1,news] = await Promise.allSettled([
      fetchJSON(`${JOLPICA}/${YEAR}/?limit=100`,'schedule',force?1:30*60e3),
      fetchJSON(`${JOLPICA}/${YEAR}/driverstandings/?limit=100`,'drivers',force?1:15*60e3),
      fetchJSON(`${JOLPICA}/${YEAR}/constructorstandings/?limit=100`,'constructors',force?1:15*60e3),
      fetchJSON(`${OPENF1}/drivers?session_key=latest`,'photos',force?1:6*3600e3),
      fetchJSON(NEWS_URL,'news',force?1:10*60e3)
    ]);
    if(sched.status==='fulfilled')state.schedule=sched.value?.MRData?.RaceTable?.Races||[];
    if(ds.status==='fulfilled')state.drivers=ds.value?.MRData?.StandingsTable?.StandingsLists?.[0]?.DriverStandings||[];
    if(cs.status==='fulfilled')state.constructors=cs.value?.MRData?.StandingsTable?.StandingsLists?.[0]?.ConstructorStandings||[];
    if(of1.status==='fulfilled')state.photos=Object.fromEntries((of1.value||[]).filter(x=>x.name_acronym).map(x=>[x.name_acronym,x]));
    if(news.status==='fulfilled' && news.value?.status==='ok')state.news=news.value.items||[];
    await loadWikipediaPhotos(force);
    state.loaded=true;state.dataStamp=new Date();
  } finally { state.refreshing=false; render(); }
  refreshPenaltyData();
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
  const map={}; const names=state.drivers.map(x=>fullName(x.Driver));
  const rx=/Reprimand:\s*([A-Za-zÀ-ÖØ-öø-ÿ'-]+)/gi; let m;
  while((m=rx.exec(text))){ const sn=m[1].toLowerCase(); const full=names.find(n=>n.split(' ').at(-1).toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu,'')===sn.normalize('NFD').replace(/\p{Diacritic}/gu,'')); if(full)map[full]=(map[full]||0)+1; }
  return map;
}

function parentNav(route){ if(route==='home'||route==='races'||route==='standings'||route==='news'||route==='more')return route; if(route.startsWith('race:')||route.startsWith('circuit:')||route.startsWith('radar:'))return 'races'; return 'more'; }
function setRoute(route,push=true){ if(!route)return; state.route=route; if(push && location.hash!==`#${encodeURIComponent(route)}`)history.pushState({route},'',`#${encodeURIComponent(route)}`); window.scrollTo({top:0,behavior:'instant'}); const parent=parentNav(route);document.querySelectorAll('.nav-btn').forEach(b=>b.classList.toggle('active',parent===b.dataset.route)); render(); }
function render(){
  clearInterval(state.countdownTimer);
  if(!state.loaded){view.innerHTML='<div class="loader">Loading F1 Hub…</div>';return;}
  const r=state.route;
  if(r==='home')return renderHome(); if(r==='races')return renderRaces(); if(r==='standings')return renderStandings(); if(r==='news')return renderNews(); if(r==='more')return renderMore();
  if(r.startsWith('race:'))return renderRaceDetail(r.split(':')[1]); if(r.startsWith('driver:'))return renderDriver(r.slice(7)); if(r.startsWith('circuit:'))return renderCircuit(r.split(':')[1]); if(r.startsWith('radar:'))return renderRadar(r.split(':')[1]);
  if(r==='drivers')return renderDrivers(); if(r==='teams')return renderTeams(); if(r==='circuits')return renderCircuits(); if(r==='penalties')return renderPenalties(); if(r==='battles')return renderBattles(); if(r==='stewards')return renderStewards(); if(r==='stats')return renderStats(); if(r==='compare')return renderCompare();
  renderHome();
}
function titleBlock(eyebrow,title,right=''){ return `<div class="section-head"><div><div class="eyebrow">${esc(eyebrow)}</div><h1>${esc(title)}</h1></div>${right}</div>`; }
function countdownHtml(iso){ return `<div class="countdown" data-countdown="${esc(iso)}"><div class="count-cell"><b data-c="d">00</b><small>DAYS</small></div><div class="count-cell"><b data-c="h">00</b><small>HOURS</small></div><div class="count-cell"><b data-c="m">00</b><small>MIN</small></div><div class="count-cell"><b data-c="s">00</b><small>SEC</small></div></div>`; }
function startCountdown(){ const el=document.querySelector('[data-countdown]'); if(!el)return; const tick=()=>{let d=Math.max(0,new Date(el.dataset.countdown)-new Date()),days=Math.floor(d/864e5);d%=864e5;let h=Math.floor(d/36e5);d%=36e5;let m=Math.floor(d/6e4);let s=Math.floor((d%6e4)/1000);[['d',days],['h',h],['m',m],['s',s]].forEach(([k,v])=>{const x=el.querySelector(`[data-c="${k}"]`);if(x)x.textContent=String(v).padStart(2,'0');});};tick();state.countdownTimer=setInterval(tick,1000); }
function standingsMini(){ return state.drivers.slice(0,3).map(s=>standingRow(s)).join(''); }
function standingRow(s){ const team=s.Constructors?.at(-1)?.name||'';return `<div class="standing-row"><div class="pos">${esc(s.position)}</div><div class="driver-line"><i class="team-dot" style="background:${teamColour(team)}"></i><div><div class="driver-name">${esc(driverCode(s.Driver))} · ${esc(s.Driver.familyName)}</div><div class="driver-meta">${esc(team)} · ${esc(s.wins)} wins</div></div></div><div class="points">${esc(s.points)}<small>PTS</small></div></div>`; }
function sessionRows(r){ const ns=nextSession(r); return sessions(r).map(s=>`<div class="session-row ${ns?.iso===s.iso?'next':''}"><div><div class="session-name">${esc(s.name)}</div><div class="day">${fmtDate(s.iso,{weekday:'short',day:'numeric',month:'short'})}</div></div><div class="clock">${fmtTime(s.iso)}</div><div class="state">${new Date(s.iso)<new Date()?'DONE':ns?.iso===s.iso?'NEXT':''}</div></div>`).join(''); }

function renderHome(){
  const r=currentRace(); if(!r){view.innerHTML='<div class="empty">No race calendar available.</div>';return;} const ns=nextSession(r); const isWeekend=raceStatus(r)==='NEXT';
  view.innerHTML=`
    <section class="hero"><div class="hero-top"><span class="pill ${isWeekend?'live':'subtle'}">${isWeekend?'RACE WEEKEND':'NEXT ROUND'}</span><span>${flag(r.Circuit.Location.country)} ROUND ${esc(r.round)}</span></div>
      <h1>${esc(r.raceName.toUpperCase())}</h1><div class="circuit">${esc(r.Circuit.circuitName)} · ${esc(r.Circuit.Location.locality)}</div>
      ${ns?`<div class="next-session"><div class="label">NEXT SESSION</div><div class="name">${esc(ns.name)}</div><div class="time">${fmtDateTime(ns.iso)} · UK</div></div>${countdownHtml(ns.iso)}`:`<div class="next-session"><div class="name">Race weekend complete</div></div>`}
    </section>
    <div class="grid desktop-two"><div>
      ${titleBlock('WEEKEND','Schedule')}<div class="schedule-list">${sessionRows(r)}</div>
      <div class="spacer"></div><div class="actions"><button class="external-btn red" onclick="setRoute('race:${r.round}')">RACE HUB</button><button class="external-btn" onclick="setRoute('radar:${r.round}')">RAIN RADAR</button></div>
    </div><div>
      ${titleBlock('CHAMPIONSHIP','Top 3')}<div class="card">${standingsMini()}</div>
      <div class="spacer"></div>${weatherCard(r)}
      <div class="spacer"></div>${latestHeadline()}
    </div></div>`;
  startCountdown(); loadWeatherIntoCard(r);
}
function latestHeadline(){ const n=state.news[0]; if(!n)return `<div class="card"><div class="card-title">Latest news</div><div class="muted" style="margin-top:7px">News feed unavailable.</div></div>`; return `<a class="card clickable news-link" href="${esc(n.link)}" target="_blank" rel="noopener"><div class="eyebrow">LATEST NEWS</div><div class="card-title" style="margin-top:6px">${esc(n.title)}</div><div class="news-meta">BBC SPORT · ${fmtNewsTime(n.pubDate)}</div></a>`; }
function weatherCard(r){return `<div id="weather-card" class="card"><div class="eyebrow">RACE WEATHER</div><div class="stat-big">—</div><div class="muted">Checking forecast…</div></div>`;}
async function loadWeatherIntoCard(r){
  const el=document.getElementById('weather-card');if(!el)return;try{const l=r.Circuit.Location;const url=`https://api.open-meteo.com/v1/forecast?latitude=${l.lat}&longitude=${l.long}&hourly=temperature_2m,precipitation_probability,weather_code,wind_speed_10m&timezone=${encodeURIComponent(UK_TZ)}&forecast_days=16`;const w=await fetchJSON(url,`weather-${r.Circuit.circuitId}`,30*60e3);const target=new Date(raceIso(r));const times=w.hourly?.time||[];let i=times.reduce((best,x,j)=>Math.abs(new Date(x)-target)<Math.abs(new Date(times[best]||0)-target)?j:best,0);if(!times.length||Math.abs(new Date(times[i])-target)>20*3600e3){el.innerHTML='<div class="eyebrow">RACE WEATHER</div><div class="card-title" style="margin-top:7px">Forecast not available yet</div><div class="muted" style="margin-top:5px">Weather appears when the race is inside the forecast window.</div>';return;}const temp=Math.round(w.hourly.temperature_2m?.[i]??0),rain=w.hourly.precipitation_probability?.[i]??0,wind=Math.round(w.hourly.wind_speed_10m?.[i]??0);el.innerHTML=`<div class="eyebrow">RACE WEATHER</div><div class="stat-big">${temp}°C</div><div class="muted">Rain ${rain}% · Wind ${wind} km/h</div>`;}catch{el.innerHTML='<div class="eyebrow">RACE WEATHER</div><div class="muted" style="margin-top:7px">Forecast unavailable.</div>';}
}

function renderRaces(){ view.innerHTML=titleBlock(`${YEAR} SEASON`,'Race Calendar')+`<div class="grid">${state.schedule.map(r=>`<div class="card clickable race-card" onclick="setRoute('race:${r.round}')"><div class="round-box"><small>ROUND</small><b>${esc(r.round)}</b></div><div><div class="race-name">${flag(r.Circuit.Location.country)} ${esc(r.raceName)}</div><div class="race-place">${esc(r.Circuit.circuitName)}</div></div><div class="date-chip"><div>${fmtDate(raceIso(r),{day:'numeric',month:'short'})}</div><div class="${raceStatus(r).toLowerCase()}">${raceStatus(r)}</div></div></div>`).join('')}</div>`; }
function renderStandings(){ view.innerHTML=titleBlock(`${YEAR} CHAMPIONSHIP`,'Standings')+`<div class="tabs"><button class="tab active" data-stand="drivers">DRIVERS</button><button class="tab" data-stand="constructors">CONSTRUCTORS</button></div><div id="stand-list" class="card">${state.drivers.map(standingRow).join('')}</div>`;document.querySelectorAll('[data-stand]').forEach(b=>b.onclick=()=>{document.querySelectorAll('[data-stand]').forEach(x=>x.classList.remove('active'));b.classList.add('active');const el=document.getElementById('stand-list');el.innerHTML=b.dataset.stand==='drivers'?state.drivers.map(standingRow).join(''):state.constructors.map(c=>`<div class="standing-row"><div class="pos">${esc(c.position)}</div><div class="driver-line"><i class="team-dot" style="background:${teamColour(c.Constructor.name)}"></i><div><div class="driver-name">${esc(c.Constructor.name)}</div><div class="driver-meta">${esc(c.wins)} wins</div></div></div><div class="points">${esc(c.points)}<small>PTS</small></div></div>`).join('');}); }
function fmtNewsTime(d){ if(!d)return ''; const x=new Date(d),mins=Math.round((Date.now()-x)/60000);if(mins<60)return `${Math.max(1,mins)}m`;if(mins<1440)return `${Math.floor(mins/60)}h`;return fmtDate(x.toISOString()); }
function renderNews(){ view.innerHTML=titleBlock('BBC SPORT','Latest News')+`<div class="grid news-grid">${state.news.length?state.news.map(n=>`<a class="card news-card news-link" href="${esc(n.link)}" target="_blank" rel="noopener">${n.thumbnail?`<img class="news-img" src="${esc(n.thumbnail)}" alt="" loading="lazy">`:''}<div class="news-body"><div class="news-title">${esc(n.title)}</div><div class="news-meta">BBC SPORT · ${fmtNewsTime(n.pubDate)}</div></div></a>`).join(''):'<div class="empty">News feed unavailable. Use Refresh to try again.</div>'}</div>`; }
function renderMore(){ const installed=isStandalone(); const install=!installed?`<div class="spacer"></div><div class="card app-mode-card"><div><div class="eyebrow">APP MODE</div><div class="card-title" style="margin-top:5px">${state.installPrompt?'Install F1 Hub':'Open F1 Hub from your installed home-screen icon'}</div><div class="muted" style="margin-top:5px">Installed mode removes the Chrome address bar and browser controls.</div></div>${state.installPrompt?'<button id="install-btn" class="external-btn red">INSTALL</button>':''}</div>`:`<div class="spacer"></div><div class="pill good">APP MODE · INSTALLED</div>`; view.innerHTML=titleBlock('F1 HUB','Explore')+`<div class="menu-grid">
  ${menu('👤','Drivers','Profiles, photos & season stats','drivers')}${menu('🏎','Teams','Constructors & points','teams')}${menu('🗺','Circuits','Layouts & track facts','circuits')}${menu('🟨','Penalty Points','Licence points & reprimands','penalties')}
  ${menu('⚔️','Teammate Battles','Qualifying & race H2H','battles')}${menu('🚨','Stewards','Latest FIA decisions','stewards')}${menu('📊','Season Stats','Wins, podiums & DNFs','stats')}${menu('↔','Driver Compare','Compare two drivers','compare')}
  </div>${install}<div class="source-note">F1 Hub v${APP_VERSION} · Personal unofficial Formula 1 companion. Live/current data comes from free public sources and is cached locally.</div>`;
  document.getElementById('install-btn')?.addEventListener('click',async()=>{state.installPrompt.prompt();await state.installPrompt.userChoice;state.installPrompt=null;renderMore();});
}
function menu(icon,title,sub,route){return `<div class="menu-card" onclick="setRoute('${route}')"><div class="icon">${icon}</div><b>${esc(title)}</b><small>${esc(sub)}</small></div>`;}

function renderDrivers(){ view.innerHTML=titleBlock(`${YEAR} GRID`,'Drivers')+`<div class="driver-grid">${state.drivers.map(s=>driverCard(s)).join('')}</div>`; }
function driverCard(s){ const team=s.Constructors?.at(-1)?.name||'',imgs=driverPhotoUrls(s),img=imgs[0],fb=imgs[1]||'';return `<div class="card driver-card clickable" onclick="setRoute('driver:${s.Driver.driverId}')"><i class="team-strip" style="background:${teamColour(team)}"></i><div class="driver-photo-holder">${img?`<img class="driver-photo" src="${esc(img)}" data-fallback="${esc(fb)}" data-code="${esc(driverCode(s.Driver))}" onerror="driverPhotoError(this)" alt="${esc(fullName(s.Driver))}" loading="lazy">`:`<div class="avatar">${esc(driverCode(s.Driver))}</div>`}</div><div class="driver-copy"><div class="driver-code">#${esc(s.Driver.permanentNumber||'—')} · ${esc(driverCode(s.Driver))}</div><div class="driver-full">${esc(fullName(s.Driver))}</div><div class="driver-bottom"><span>${esc(team)}</span><span><b>${esc(s.points)}</b> pts</span></div></div></div>`; }
function renderDriver(id){ const s=state.drivers.find(x=>x.Driver.driverId===id);if(!s)return setRoute('drivers');const d=s.Driver,team=s.Constructors?.at(-1)?.name||'',imgs=driverPhotoUrls(s),img=imgs[0],fb=imgs[1]||'';view.innerHTML=`<div class="actions"><button class="external-btn" onclick="history.length>1?history.back():setRoute('drivers')">← DRIVERS</button></div><div class="spacer"></div><div class="card" style="overflow:hidden"><div style="display:grid;grid-template-columns:1fr 1fr;align-items:end;background:linear-gradient(135deg,#181818,#0d0d0d);border-left:6px solid ${teamColour(team)}"><div style="padding:20px"><div class="eyebrow">#${esc(d.permanentNumber||'—')} · ${esc(driverCode(d))}</div><h1 style="font-size:34px;margin:6px 0">${esc(fullName(d))}</h1><div class="muted">${esc(d.nationality)} · ${esc(team)}</div></div><div class="profile-photo-holder">${img?`<img src="${esc(img)}" data-fallback="${esc(fb)}" data-code="${esc(driverCode(d))}" onerror="driverPhotoError(this)" alt="${esc(fullName(d))}">`:`<div class="avatar profile-avatar">${esc(driverCode(d))}</div>`}</div></div><div style="padding:14px"><div class="facts"><div class="fact"><b>${esc(s.position)}</b><small>CHAMP POS</small></div><div class="fact"><b>${esc(s.points)}</b><small>POINTS</small></div><div class="fact"><b>${esc(s.wins)}</b><small>WINS</small></div><div class="fact"><b>${age(d.dateOfBirth)}</b><small>AGE</small></div><div class="fact"><b>${fmtDate(d.dateOfBirth+'T12:00:00Z',{day:'numeric',month:'short',year:'numeric'})}</b><small>BORN</small></div><div class="fact"><b>${esc(d.nationality)}</b><small>NATIONALITY</small></div></div><div class="spacer"></div><div class="actions"><a class="external-btn" href="${esc(d.url||'#')}" target="_blank" rel="noopener">PROFILE SOURCE ↗</a></div><div class="source-note">Driver photo uses the OpenF1 headshot where available, with a Wikipedia/Wikimedia fallback.</div></div></div>`; }
function renderTeams(){ view.innerHTML=titleBlock(`${YEAR} GRID`,'Teams')+`<div class="grid two">${state.constructors.map(c=>`<div class="card" style="border-left:5px solid ${teamColour(c.Constructor.name)}"><div class="eyebrow">P${esc(c.position)}</div><div class="card-title" style="font-size:20px;margin-top:5px">${esc(c.Constructor.name)}</div><div class="stat-big">${esc(c.points)} <span class="muted" style="font-size:11px">PTS</span></div><div class="muted">${esc(c.wins)} wins · ${esc(c.Constructor.nationality||'')}</div></div>`).join('')}</div>`; }
function renderCircuits(){ view.innerHTML=titleBlock(`${YEAR} CALENDAR`,'Circuits')+`<div class="grid two">${state.schedule.map(r=>{const src=circuitSvg(r.Circuit.circuitId);return `<div class="card clickable" onclick="setRoute('circuit:${r.round}')">${src?`<div class="track-img-wrap"><img class="track-img" src="${src}" alt="${esc(r.Circuit.circuitName)} layout" loading="lazy"></div>`:''}<div class="eyebrow">${flag(r.Circuit.Location.country)} ${esc(r.Circuit.Location.country)}</div><div class="card-title" style="margin-top:5px">${esc(r.Circuit.circuitName)}</div><div class="muted" style="margin-top:3px">${esc(r.Circuit.Location.locality)}</div></div>`}).join('')}</div>`; }
function renderCircuit(round){ const r=state.schedule.find(x=>x.round===round);if(!r)return setRoute('circuits');const c=CIRCUITS[r.Circuit.circuitId]||{},src=circuitSvg(r.Circuit.circuitId);view.innerHTML=`<div class="actions"><button class="external-btn" onclick="setRoute('circuits')">← CIRCUITS</button></div><div class="spacer"></div>${titleBlock(flag(r.Circuit.Location.country)+' '+r.Circuit.Location.country,r.Circuit.circuitName)}<div class="card">${src?`<div class="track-img-wrap" style="height:240px"><img class="track-img" src="${src}" alt="track layout"></div>`:''}<div class="facts"><div class="fact"><b>${c.length?c.length.toFixed(3)+' km':'—'}</b><small>LENGTH</small></div><div class="fact"><b>${c.laps??'—'}</b><small>LAPS</small></div><div class="fact"><b>${c.turns??'—'}</b><small>TURNS</small></div><div class="fact"><b>${c.first??'—'}</b><small>FIRST GP</small></div><div class="fact"><b>${c.length&&c.laps?(c.length*c.laps).toFixed(1)+' km':'—'}</b><small>RACE DIST.</small></div><div class="fact"><b>${fmtDate(raceIso(r),{day:'numeric',month:'short'})}</b><small>${YEAR} RACE</small></div></div><div class="spacer"></div><div class="actions"><button class="external-btn red" onclick="setRoute('radar:${r.round}')">RAIN RADAR</button><button class="external-btn" onclick="setRoute('race:${r.round}')">RACE HUB</button></div><div class="source-note">Circuit layout: community SVG source; track facts are bundled with the app.</div></div>`; }

async function renderRadar(round){ const r=state.schedule.find(x=>x.round===round);if(!r)return setRoute('races');const l=r.Circuit.Location;view.innerHTML=`<div class="actions"><button class="external-btn" onclick="history.length>1?history.back():setRoute('race:${r.round}')">← BACK</button></div><div class="spacer"></div>${titleBlock('LIVE WEATHER RADAR',r.Circuit.circuitName)}<div class="radar-card"><iframe class="radar-frame" src="${esc(radarEmbedUrl(r))}" title="Weather radar for ${esc(r.Circuit.circuitName)}" loading="eager" allowfullscreen></iframe></div><div class="spacer"></div><div class="actions"><a class="external-btn red" href="${esc(radarUrl(r))}" target="_blank" rel="noopener">OPEN FULL RADAR ↗</a><button class="external-btn" onclick="setRoute('race:${r.round}')">RACE HUB</button></div><div class="source-note">Radar is centred on ${esc(l.locality)}, ${esc(l.country)} using the circuit coordinates.</div>`; }

function renderRaceDetail(round){ const r=state.schedule.find(x=>x.round===round);if(!r)return setRoute('races');const c=CIRCUITS[r.Circuit.circuitId]||{},src=circuitSvg(r.Circuit.circuitId);view.innerHTML=`<div class="actions"><button class="external-btn" onclick="setRoute('races')">← CALENDAR</button></div><div class="spacer"></div><section class="hero" style="min-height:190px"><div class="hero-top"><span class="pill ${raceStatus(r)==='NEXT'?'live':'subtle'}">ROUND ${esc(r.round)}</span><span>${flag(r.Circuit.Location.country)}</span></div><h1>${esc(r.raceName.toUpperCase())}</h1><div class="circuit">${esc(r.Circuit.circuitName)}</div></section><div class="tabs"><button class="tab active" data-racetab="weekend">WEEKEND</button><button class="tab" data-racetab="results">RESULTS</button><button class="tab" data-racetab="control">RACE CONTROL</button><button class="tab" data-racetab="radio">RADIO</button></div><div id="race-tab-content"></div>`;
  const root=document.getElementById('race-tab-content'); const drawWeekend=()=>{root.innerHTML=`<div class="grid desktop-two"><div><div class="schedule-list">${sessionRows(r)}</div><div class="spacer"></div><div class="actions"><button class="external-btn red" onclick="setRoute('radar:${r.round}')">RAIN RADAR</button><button class="external-btn" onclick="setRoute('circuit:${r.round}')">TRACK INFO</button></div></div><div>${weatherCard(r)}${src?`<div class="spacer"></div><div class="card"><div class="track-img-wrap"><img class="track-img" src="${src}" alt="track layout"></div><div class="facts"><div class="fact"><b>${c.length||'—'} km</b><small>LENGTH</small></div><div class="fact"><b>${c.laps||'—'}</b><small>LAPS</small></div><div class="fact"><b>${c.turns||'—'}</b><small>TURNS</small></div></div></div>`:''}</div></div>`;loadWeatherIntoCard(r);}; drawWeekend();
  document.querySelectorAll('[data-racetab]').forEach(b=>b.onclick=async()=>{document.querySelectorAll('[data-racetab]').forEach(x=>x.classList.remove('active'));b.classList.add('active');const t=b.dataset.racetab;if(t==='weekend')drawWeekend();else if(t==='results')await drawResults(root,r);else if(t==='control')await drawRaceControl(root,r);else await drawRadio(root,r);});
}
async function drawResults(root,r){ root.innerHTML='<div class="loader">Loading classification…</div>';try{const [res,q]=await Promise.allSettled([fetchJSON(`${JOLPICA}/${YEAR}/${r.round}/results/?limit=100`,`result-${r.round}`,15*60e3),fetchJSON(`${JOLPICA}/${YEAR}/${r.round}/qualifying/?limit=100`,`quali-${r.round}`,15*60e3)]);const rr=res.status==='fulfilled'?res.value?.MRData?.RaceTable?.Races?.[0]:null,qq=q.status==='fulfilled'?q.value?.MRData?.RaceTable?.Races?.[0]:null;root.innerHTML=`${resultTable('RACE RESULT',rr?.Results||[])}<div class="spacer"></div>${resultTable('QUALIFYING',qq?.QualifyingResults||[],true)}`;}catch{root.innerHTML='<div class="error-box">Results are not available yet.</div>';}}
function resultTable(title,rows,q=false){if(!rows.length)return `<div class="card"><div class="eyebrow">${title}</div><div class="empty">Not available yet.</div></div>`;return `<div class="card"><div class="eyebrow">${title}</div><div style="margin-top:8px">${rows.map(x=>`<div class="standing-row"><div class="pos">${esc(x.position)}</div><div class="driver-line"><i class="team-dot" style="background:${teamColour(x.Constructor?.name)}"></i><div><div class="driver-name">${esc(driverCode(x.Driver))} · ${esc(x.Driver.familyName)}</div><div class="driver-meta">${esc(x.Constructor?.name||'')}${q&&x.Q3?' · '+esc(x.Q3):''}</div></div></div><div class="points">${q?'':esc(x.points||'')}<small>${q?'':x.points?'PTS':''}</small></div></div>`).join('')}</div></div>`;}
async function openF1RaceSession(r){const country=({'USA':'United States','UK':'Great Britain','UAE':'United Arab Emirates'})[r.Circuit.Location.country]||r.Circuit.Location.country;const ss=await fetchJSON(`${OPENF1}/sessions?year=${YEAR}&country_name=${encodeURIComponent(country)}&session_name=Race`,`of1-sess-${r.round}`,6*3600e3);if(!ss?.length)return null;const target=new Date(raceIso(r));return ss.sort((a,b)=>Math.abs(new Date(a.date_start)-target)-Math.abs(new Date(b.date_start)-target))[0];}
async function drawRaceControl(root,r){root.innerHTML='<div class="loader">Loading race control…</div>';try{const s=await openF1RaceSession(r);if(!s)throw 0;const rows=await fetchJSON(`${OPENF1}/race_control?session_key=${s.session_key}`,`rc-${r.round}`,10*60e3);if(!rows.length)throw 0;root.innerHTML=`<div class="card">${rows.slice().reverse().slice(0,120).map(x=>`<div class="steward-item"><div class="steward-kind">${esc((x.flag||x.category||'RACE CONTROL').toUpperCase())} · LAP ${esc(x.lap_number??'—')}</div><div class="steward-title">${esc(x.message||'')}</div><div class="news-meta">${x.date?fmtTime(x.date):''}</div></div>`).join('')}</div>`;}catch{root.innerHTML='<div class="card"><div class="empty">Race-control data becomes available through the free OpenF1 feed after sessions are published.</div></div>';}}
async function drawRadio(root,r){root.innerHTML='<div class="loader">Loading team radio…</div>';try{const s=await openF1RaceSession(r);if(!s)throw 0;const rows=await fetchJSON(`${OPENF1}/team_radio?session_key=${s.session_key}`,`radio-${r.round}`,20*60e3);if(!rows.length)throw 0;root.innerHTML=`<div class="card">${rows.slice().reverse().slice(0,60).map(x=>`<div class="steward-item"><div class="steward-kind">CAR ${esc(x.driver_number)}</div><audio controls preload="none" style="width:100%;height:36px" src="${esc(x.recording_url)}"></audio><div class="news-meta">${x.date?fmtTime(x.date):''}</div></div>`).join('')}</div>`;}catch{root.innerHTML='<div class="card"><div class="empty">Team radio is unavailable for this session on the free feed.</div></div>';}}

function activePenaltyEvents(events){const today=new Date();today.setHours(0,0,0,0);return (events||[]).filter(x=>new Date(x[1]+'T23:59:59Z')>=today);}
function lookupPenaltyName(name){if(state.penaltyPoints[name])return name;const aliases={'Andrea Kimi Antonelli':'Kimi Antonelli','Alexander Albon':'Alex Albon','Alex Albon':'Alexander Albon','Sergio Pérez':'Sergio Perez','Nico Hülkenberg':'Nico Hulkenberg'};const alt=aliases[name];return alt&&state.penaltyPoints[alt]?alt:name;}
function renderPenalties(){ const names=state.drivers.map(s=>fullName(s.Driver));const rows=names.map(name=>{const key=lookupPenaltyName(name),ev=activePenaltyEvents(state.penaltyPoints[key]||[]),pts=ev.reduce((a,x)=>a+x[0],0),rep=state.reprimands[name]??state.reprimands[key]??state.reprimands[{'Andrea Kimi Antonelli':'Kimi Antonelli','Sergio Pérez':'Sergio Perez','Nico Hülkenberg':'Nico Hulkenberg'}[name]]??0;return {name,pts,rep,ev};}).sort((a,b)=>b.pts-a.pts||b.rep-a.rep||a.name.localeCompare(b.name));view.innerHTML=titleBlock('SUPER LICENCE','Penalty Points')+`<div class="card">${rows.map(x=>`<div class="penalty-row"><div class="penalty-head"><div class="penalty-name">${esc(x.name)} ${x.rep?`<span class="reprimand-badge">${x.rep} REP</span>`:''}</div><div class="penalty-count">${x.pts} / 12</div></div><div class="penalty-bar"><div class="penalty-fill" style="width:${Math.min(100,x.pts/12*100)}%"></div></div><div class="penalty-meta">${x.ev.length?x.ev.map(e=>`${e[0]} pt${e[0]>1?'s':''} expires ${fmtDate(e[1]+'T12:00:00Z',{day:'numeric',month:'short',year:'numeric'})}`).join(' · '):'No active penalty points'}</div></div>`).join('')}</div><div class="source-note">The app attempts a live refresh from RacingNews365 and timepenalty, with a bundled fallback if the browser blocks either source. Expired points are removed locally by date.</div><div class="spacer"></div><div class="actions"><a class="external-btn" target="_blank" rel="noopener" href="${PENALTY_SOURCE}">PENALTY SOURCE ↗</a><a class="external-btn" target="_blank" rel="noopener" href="${REPRIMAND_SOURCE}">REPRIMANDS ↗</a></div>`; }

async function fetchPaged(type){const cacheKey='all-'+type;const cached=cacheGet(cacheKey,60*60e3);if(cached)return cached;let offset=0,total=Infinity,parts=[];while(offset<total){const j=await fetchJSON(`${JOLPICA}/${YEAR}/${type}/?limit=100&offset=${offset}`,`${cacheKey}-${offset}`,60*60e3);const mr=j.MRData||{},rs=mr.RaceTable?.Races||[];parts.push(...rs);total=Number(mr.total||offset+100);if(!rs.length||offset+100>=total)break;offset+=100;await sleep(330);}const by={};for(const r of parts){const k=r.round;if(!by[k])by[k]={...r,Results:[],QualifyingResults:[]};by[k].Results.push(...(r.Results||[]));by[k].QualifyingResults.push(...(r.QualifyingResults||[]));}const out=Object.values(by).map(r=>({...r,Results:uniqueBy(r.Results,x=>x.Driver.driverId),QualifyingResults:uniqueBy(r.QualifyingResults,x=>x.Driver.driverId)}));return cachePut(cacheKey,out);}
function uniqueBy(a,fn){const s=new Set();return a.filter(x=>{const k=fn(x);if(s.has(k))return false;s.add(k);return true;});}
async function getSeasonData(){return Promise.all([fetchPaged('results'),fetchPaged('qualifying')]);}
function dnf(x){return x?.status && x.status!=='Finished' && !String(x.status).startsWith('+');}
async function renderBattles(){view.innerHTML=titleBlock(`${YEAR} SEASON`,'Teammate Battles')+'<div class="loader">Calculating head-to-heads…</div>';try{const [races,quali]=await getSeasonData();const latest=[...races].sort((a,b)=>Number(b.round)-Number(a.round))[0];let teams={};(latest?.Results||[]).forEach(x=>{(teams[x.Constructor.name]??=[]).push(x.Driver.driverId)});const byId=Object.fromEntries(state.drivers.map(s=>[s.Driver.driverId,s]));const cards=[];for(const [team,ids0] of Object.entries(teams)){const ids=[...new Set(ids0)].filter(x=>byId[x]).slice(0,2);if(ids.length<2)continue;const a=battleStats(ids[0],ids[1],team,races,quali,byId),b=battleStats(ids[1],ids[0],team,races,quali,byId);cards.push(battleCard(team,a,b));}view.innerHTML=titleBlock(`${YEAR} SEASON`,'Teammate Battles')+`<div class="grid two">${cards.join('')}</div>`;}catch(e){view.innerHTML+=`<div class="error-box">Could not load the season result history.</div>`;}}
function battleStats(id,mate,team,races,quali,byId){let podiums=0,dnfs=0,rh=0,qh=0,starts=[],fin=[];for(const r of races){const me=(r.Results||[]).find(x=>x.Driver.driverId===id&&x.Constructor.name===team),m=(r.Results||[]).find(x=>x.Driver.driverId===mate&&x.Constructor.name===team);if(me){const p=Number(me.position);if(p){fin.push(p);if(p<=3)podiums++;}const g=Number(me.grid);if(Number.isFinite(g))starts.push(g);if(dnf(me))dnfs++;}if(me&&m&&Number(me.position)<Number(m.position))rh++;}for(const q of quali){const me=(q.QualifyingResults||[]).find(x=>x.Driver.driverId===id&&x.Constructor.name===team),m=(q.QualifyingResults||[]).find(x=>x.Driver.driverId===mate&&x.Constructor.name===team);if(me&&m&&Number(me.position)<Number(m.position))qh++;}const s=byId[id];return {code:driverCode(s.Driver),points:s.points,wins:s.wins,podiums,dnfs,rh,qh,avgS:starts.length?(starts.reduce((a,b)=>a+b)/starts.length).toFixed(1):'—',avgF:fin.length?(fin.reduce((a,b)=>a+b)/fin.length).toFixed(1):'—'};}
function battleCard(team,a,b){const row=(label,x,y)=>`<div class="battle-stat"><b>${esc(x)}</b><div class="mid">${label}</div><b>${esc(y)}</b></div>`;return `<div class="card battle-card" style="border-top:4px solid ${teamColour(team)}"><div class="battle-team">${esc(team.toUpperCase())}</div><div class="battle-head"><div class="battle-driver">${esc(a.code)}</div><div class="battle-vs">VS</div><div class="battle-driver">${esc(b.code)}</div></div>${row('POINTS',a.points,b.points)}${row('WINS',a.wins,b.wins)}${row('PODIUMS',a.podiums,b.podiums)}${row('QUALI H2H',a.qh,b.qh)}${row('RACE H2H',a.rh,b.rh)}${row('AVG START',a.avgS,b.avgS)}${row('AVG FINISH',a.avgF,b.avgF)}${row('DNFs',a.dnfs,b.dnfs)}</div>`;}

async function renderStewards(){view.innerHTML=titleBlock('FIA','Stewards & Decisions')+'<div class="loader">Checking FIA documents…</div>';try{const text=await fetchText(JINA+FIA_DOCS,'fia-docs',20*60e3);const items=[];for(const line of text.split('\n')){if(!/(Decision|Infringement|Summons)/i.test(line))continue;const m=line.match(/\[([^\]]*(?:Decision|Infringement|Summons)[^\]]*)\]\((https?:\/\/[^)]+)\)/i);if(m)items.push({title:m[1],url:m[2],kind:/summons/i.test(m[1])?'SUMMONS':/infringement/i.test(m[1])?'INFRINGEMENT':'DECISION'});}const uniq=uniqueBy(items,x=>x.url).slice(0,80);view.innerHTML=titleBlock('FIA','Stewards & Decisions')+`<div class="card">${uniq.length?uniq.map(x=>`<a class="news-link" href="${esc(x.url)}" target="_blank" rel="noopener"><div class="steward-item"><div class="steward-kind">${x.kind}</div><div class="steward-title">${esc(x.title)}</div></div></a>`).join(''):'<div class="empty">No decision links could be parsed automatically.</div>'}</div><div class="spacer"></div><a class="external-btn red" href="${FIA_DOCS}" target="_blank" rel="noopener">OPEN FIA DOCUMENTS ↗</a>`;}catch{view.innerHTML=titleBlock('FIA','Stewards & Decisions')+`<div class="card"><div class="empty">The FIA page could not be read automatically. You can still open the official documents page.</div></div><div class="spacer"></div><a class="external-btn red" href="${FIA_DOCS}" target="_blank" rel="noopener">OPEN FIA DOCUMENTS ↗</a>`;}}

async function renderStats(){view.innerHTML=titleBlock(`${YEAR} SEASON`,'Season Stats')+'<div class="loader">Calculating season stats…</div>';try{const [races,quali]=await getSeasonData();const stats=state.drivers.map(s=>{let pod=0,dnfs=0,poles=0;for(const r of races){const x=(r.Results||[]).find(z=>z.Driver.driverId===s.Driver.driverId);if(x){if(Number(x.position)<=3)pod++;if(dnf(x))dnfs++;}}for(const q of quali){const x=(q.QualifyingResults||[]).find(z=>z.Driver.driverId===s.Driver.driverId);if(Number(x?.position)===1)poles++;}return {s,pod,dnfs,poles};});const leaders=(key,label)=>`<div class="card"><div class="eyebrow">${label}</div>${[...stats].sort((a,b)=>Number(b[key]??b.s[key])-Number(a[key]??a.s[key])).slice(0,5).map((x,i)=>`<div class="standing-row"><div class="pos">${i+1}</div><div class="driver-name">${esc(driverCode(x.s.Driver))} · ${esc(x.s.Driver.familyName)}</div><div class="points">${esc(x[key]??x.s[key])}</div></div>`).join('')}</div>`;view.innerHTML=titleBlock(`${YEAR} SEASON`,'Season Stats')+`<div class="grid two">${leaders('wins','MOST WINS')}${leaders('pod','MOST PODIUMS')}${leaders('poles','MOST POLES')}${leaders('dnfs','MOST DNFs')}</div>`;}catch{view.innerHTML+='<div class="error-box">Season history is unavailable.</div>';}}

function renderCompare(){const opts=state.drivers.map(s=>`<option value="${esc(s.Driver.driverId)}">${esc(fullName(s.Driver))}</option>`).join('');view.innerHTML=titleBlock(`${YEAR} SEASON`,'Driver Compare')+`<div class="card"><div class="grid two"><label><div class="eyebrow">DRIVER A</div><select id="cmp-a" style="width:100%;margin-top:8px;background:#0d0d0d;color:white;border:1px solid #333;border-radius:12px;padding:12px">${opts}</select></label><label><div class="eyebrow">DRIVER B</div><select id="cmp-b" style="width:100%;margin-top:8px;background:#0d0d0d;color:white;border:1px solid #333;border-radius:12px;padding:12px">${opts}</select></label></div><div class="spacer"></div><button id="cmp-go" class="external-btn red">COMPARE</button></div><div id="cmp-out" class="spacer"></div>`;const a=document.getElementById('cmp-a'),b=document.getElementById('cmp-b');b.selectedIndex=Math.min(1,b.options.length-1);document.getElementById('cmp-go').onclick=async()=>{const out=document.getElementById('cmp-out');out.innerHTML='<div class="loader">Comparing…</div>';try{const [races,quali]=await getSeasonData();const byId=Object.fromEntries(state.drivers.map(s=>[s.Driver.driverId,s]));const aa=simpleDriverStats(a.value,races,quali,byId),bb=simpleDriverStats(b.value,races,quali,byId);out.innerHTML=`<div class="card battle-card"><div class="battle-head"><div class="battle-driver">${aa.code}</div><div class="battle-vs">VS</div><div class="battle-driver">${bb.code}</div></div>${[['POINTS','points'],['WINS','wins'],['PODIUMS','pod'],['POLES','poles'],['DNFs','dnfs'],['AVG FINISH','avgF']].map(([l,k])=>`<div class="battle-stat"><b>${aa[k]}</b><div class="mid">${l}</div><b>${bb[k]}</b></div>`).join('')}</div>`;}catch{out.innerHTML='<div class="error-box">Could not load season history.</div>';}};}
function simpleDriverStats(id,races,quali,byId){let pod=0,dnfs=0,poles=0,fin=[];for(const r of races){const x=(r.Results||[]).find(z=>z.Driver.driverId===id);if(x){if(Number(x.position)<=3)pod++;if(dnf(x))dnfs++;if(Number(x.position))fin.push(Number(x.position));}}for(const q of quali){const x=(q.QualifyingResults||[]).find(z=>z.Driver.driverId===id);if(Number(x?.position)===1)poles++;}const s=byId[id];return {code:driverCode(s.Driver),points:s.points,wins:s.wins,pod,poles,dnfs,avgF:fin.length?(fin.reduce((a,b)=>a+b)/fin.length).toFixed(1):'—'};}

// Navigation / lifecycle
window.setRoute=setRoute;
state.route=decodeURIComponent(location.hash.slice(1)||'home');
document.body.classList.toggle('standalone',isStandalone());
document.querySelectorAll('.nav-btn').forEach(b=>b.addEventListener('click',()=>setRoute(b.dataset.route)));
document.getElementById('brand-btn').addEventListener('click',()=>setRoute('home'));
window.addEventListener('popstate',()=>{state.route=decodeURIComponent(location.hash.slice(1)||'home');document.querySelectorAll('.nav-btn').forEach(b=>b.classList.toggle('active',parentNav(state.route)===b.dataset.route));render();});
document.getElementById('refresh-btn').addEventListener('click',async()=>{if(state.refreshing)return;toast('Refreshing…');await loadBase(true);toast('Updated');});
window.addEventListener('online',()=>{document.getElementById('connection-pill').textContent='ONLINE';document.getElementById('connection-pill').className='pill good';});
window.addEventListener('offline',()=>{document.getElementById('connection-pill').textContent='OFFLINE';document.getElementById('connection-pill').className='pill warn';});
window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();state.installPrompt=e;showInstallSheet();if(state.route==='more')renderMore();});
window.addEventListener('appinstalled',()=>{state.installPrompt=null;document.body.classList.add('standalone');hideInstallSheet();toast('F1 Hub installed');});
function showInstallSheet(){if(isStandalone()||sessionStorage.getItem('f1hub-install-dismissed'))return;const s=document.getElementById('install-sheet');if(s)s.classList.remove('hidden');}
function hideInstallSheet(){document.getElementById('install-sheet')?.classList.add('hidden');}
document.getElementById('install-now')?.addEventListener('click',async()=>{if(!state.installPrompt)return;state.installPrompt.prompt();await state.installPrompt.userChoice;state.installPrompt=null;hideInstallSheet();});
document.getElementById('install-later')?.addEventListener('click',()=>{sessionStorage.setItem('f1hub-install-dismissed','1');hideInstallSheet();});
if('serviceWorker' in navigator && location.protocol!=='file:')navigator.serviceWorker.register('./sw.js',{updateViaCache:'none'}).then(r=>r.update()).catch(()=>{});
if(!navigator.onLine){document.getElementById('connection-pill').textContent='OFFLINE';document.getElementById('connection-pill').className='pill warn';}
loadBase();

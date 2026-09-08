(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports)module.exports=api;
  root.F1HubDriverCareer=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';
  function pageOffsets(total,pageSize=100){
    const n=Math.max(0,Number(total)||0),size=Math.max(1,Math.min(100,Number(pageSize)||100)),out=[];
    for(let offset=0;offset<n;offset+=size)out.push(offset);
    return out.length?out:[0];
  }
  function build(races,expectedTotal=0){
    const dedup=new Map();
    for(const race of (races||[])){
      const key=`${race?.season||''}:${race?.round||''}`;
      if(race?.Results?.length&&!dedup.has(key))dedup.set(key,race);
    }
    const rows=[...dedup.values()].sort((a,b)=>Number(a.season)-Number(b.season)||Number(a.round)-Number(b.round));
    const seasons=new Map(),teams=new Map();let wins=0,podiums=0,best=Infinity;
    for(const race of rows){
      const res=race.Results?.[0];if(!res)continue;
      const season=Number(race.season),team=res.Constructor?.name||'Unknown',pos=Number(res.position);
      if(pos===1)wins++;if(pos>0&&pos<=3)podiums++;if(pos>0)best=Math.min(best,pos);
      if(!seasons.has(season))seasons.set(season,{season,starts:0,wins:0,podiums:0,teams:[]});
      const s=seasons.get(season);s.starts++;if(pos===1)s.wins++;if(pos>0&&pos<=3)s.podiums++;if(!s.teams.includes(team))s.teams.push(team);
      if(!teams.has(team))teams.set(team,{team,first:season,last:season,starts:0});
      const q=teams.get(team);q.first=Math.min(q.first,season);q.last=Math.max(q.last,season);q.starts++;
    }
    const expected=Math.max(0,Number(expectedTotal)||0);
    return {starts:rows.length,wins,podiums,best:Number.isFinite(best)?best:null,debut:rows[0]||null,last:rows.at(-1)||null,seasons:[...seasons.values()].sort((a,b)=>b.season-a.season),teams:[...teams.values()].sort((a,b)=>a.first-b.first||a.team.localeCompare(b.team)),expectedTotal:expected,complete:!expected||rows.length>=expected};
  }
  function attachStandings(career,standingsBySeason){
    if(!career)return career;
    const by=standingsBySeason||{};
    return {...career,seasons:(career.seasons||[]).map(s=>{
      const row=by[String(s.season)]||by[s.season]||null;
      return {...s,champPosition:row?.position?Number(row.position):null,champPoints:row?.points??null,champWins:row?.wins??null};
    })};
  }
  return {pageOffsets,build,attachStandings};
});

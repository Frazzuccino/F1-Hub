(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports)module.exports=api;
  if(root)root.F1HubQuality=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';

  function num(v,fallback=null){const n=Number(v);return Number.isFinite(n)?n:fallback;}
  function validPosition(row){const p=num(row?.position);return p!==null&&p>0?p:null;}
  function resultStatus(row){
    if(row?.dsq||/disqual/i.test(String(row?.status||'')))return 'DSQ';
    if(row?.dns||/did not start|dns/i.test(String(row?.status||'')))return 'DNS';
    if(row?.dnf||/retired|did not finish|accident|collision|mechanical|engine|gearbox|hydraulic|electrical|brakes|spun|puncture/i.test(String(row?.status||'')))return 'DNF';
    return 'CLASSIFIED';
  }
  function statusRank(row){const s=resultStatus(row);return s==='CLASSIFIED'?0:s==='DNF'?1:s==='DNS'?2:3;}
  function sortResults(rows){
    return (rows||[]).slice().sort((a,b)=>{
      const pa=validPosition(a),pb=validPosition(b);
      if(pa!==null||pb!==null){if(pa===null)return 1;if(pb===null)return -1;if(pa!==pb)return pa-pb;}
      const la=num(a?.number_of_laps,num(a?.laps,-1)),lb=num(b?.number_of_laps,num(b?.laps,-1));
      if(la!==lb)return lb-la;
      return statusRank(a)-statusRank(b);
    });
  }
  function validateResults(rows,{minEntries=10}={}){
    const issues=[];const list=rows||[];if(list.length<minEntries)issues.push('too-few-entries');
    const numeric=list.map(validPosition).filter(x=>x!==null);const unique=new Set(numeric);
    if(unique.size!==numeric.length)issues.push('duplicate-position');
    if(numeric.length&&numeric.filter(x=>x===1).length!==1)issues.push('invalid-p1');
    const sorted=sortResults(list);let seenUnclassified=false;
    for(const r of sorted){if(validPosition(r)===null)seenUnclassified=true;else if(seenUnclassified)issues.push('classified-after-unclassified');}
    const leader=sorted.find(r=>validPosition(r)===1);
    if(numeric.length&&!leader)issues.push('missing-winner');
    const score=Math.max(0,100-issues.length*22-(list.length<minEntries?12:0));
    return {ok:issues.length===0,issues,score,sorted,leader};
  }
  function validateStandings(rows,{minEntries=10}={}){
    const issues=[];const list=rows||[];if(list.length<minEntries)issues.push('too-few-entries');
    const pos=list.map(x=>num(x?.position)).filter(x=>x!==null);if(new Set(pos).size!==pos.length)issues.push('duplicate-position');
    if(pos.length&&Math.min(...pos)!==1)issues.push('no-leader');
    if(list.some(x=>num(x?.points,-1)<0))issues.push('negative-points');
    if(list.some(x=>num(x?.wins,-1)<0))issues.push('negative-wins');
    for(let i=1;i<list.length;i++)if(num(list[i]?.points,0)>num(list[i-1]?.points,0)+1e-9){issues.push('points-out-of-order');break;}
    const score=Math.max(0,100-issues.length*20-(list.length<minEntries?10:0));
    return {ok:issues.length===0,issues,score};
  }
  function freshness(updatedAt,maxAgeMs,now=Date.now()){
    const t=updatedAt instanceof Date?updatedAt.getTime():num(updatedAt,0);const age=Math.max(0,now-t);
    if(!t)return {state:'unknown',ageMs:Infinity,score:20};
    if(age<=maxAgeMs)return {state:'fresh',ageMs:age,score:100};
    if(age<=maxAgeMs*3)return {state:'aging',ageMs:age,score:70};
    return {state:'stale',ageMs:age,score:35};
  }
  function ageLabel(updatedAt,now=Date.now()){
    const t=updatedAt instanceof Date?updatedAt.getTime():num(updatedAt,0);if(!t)return 'unknown';
    const m=Math.max(0,Math.floor((now-t)/60000));if(m<1)return 'just now';if(m<60)return `${m}m ago`;const h=Math.floor(m/60);if(h<24)return `${h}h ago`;return `${Math.floor(h/24)}d ago`;
  }
  function calculateRaceInsights(rows){
    const sorted=sortResults(rows);const classified=sorted.filter(x=>validPosition(x)!==null);const winner=classified.find(x=>validPosition(x)===1)||null;
    let biggestGainer=null,biggestLoser=null;
    for(const r of classified){const finish=validPosition(r),grid=num(r?.grid,num(r?.grid_position));if(grid===null||grid<=0||finish===null)continue;const gain=grid-finish;const item={row:r,gain};if(!biggestGainer||gain>biggestGainer.gain)biggestGainer=item;if(!biggestLoser||gain<biggestLoser.gain)biggestLoser=item;}
    const dnfs=sorted.filter(r=>resultStatus(r)!=='CLASSIFIED');
    let fastest=null;for(const r of rows||[]){const rank=num(r?.FastestLap?.rank);if(rank===1){fastest=r;break;}}
    return {winner,podium:classified.slice(0,3),biggestGainer,biggestLoser,dnfs,fastest,sorted};
  }
  function provisionalStandings(rows,pointsByKey,winsByKey,keyFn){
    const updated=(rows||[]).map(x=>{const k=keyFn(x);return {...x,points:String(num(x.points,0)+num(pointsByKey?.[k],0)),wins:String(num(x.wins,0)+num(winsByKey?.[k],0))};});
    updated.sort((a,b)=>num(b.points,0)-num(a.points,0)||num(b.wins,0)-num(a.wins,0));
    return updated.map((x,i)=>({...x,position:String(i+1),positionText:String(i+1)}));
  }
  function overallQualityScore(parts){
    const weights={data:0.24,reliability:0.18,performance:0.14,ux:0.13,features:0.12,pwa:0.08,accessibility:0.07,tests:0.04};
    let total=0,w=0;for(const [k,weight] of Object.entries(weights)){if(Number.isFinite(Number(parts?.[k]))){total+=Number(parts[k])*weight;w+=weight;}}
    return w?Math.round(total/w*100)/100:0;
  }
  return {num,validPosition,resultStatus,sortResults,validateResults,validateStandings,freshness,ageLabel,calculateRaceInsights,provisionalStandings,overallQualityScore};
});

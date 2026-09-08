(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports)module.exports=api;
  root.F1HubCarDevelopment=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';
  const ZONES=[
    {id:'front-wing',label:'Front wing',top:[88,158],side:[505,196],aliases:['front wing','frontwing','front flap','front wing flap','front wing endplate','front wing tip']},
    {id:'nose',label:'Nose',top:[151,158],side:[549,171],aliases:['nose','nosecone','nose cone']},
    {id:'front-corner',label:'Front corner',top:[187,117],side:[582,194],aliases:['front suspension','front corner','front brake duct','front brake','front wheel bodywork','front wheel assembly','front drum','front drum exit']},
    {id:'floor-fences',label:'Floor fences / inlet',top:[236,139],side:[625,177],aliases:['floor fence','floor fences','floor furniture','floor inlet','floor leading edge','floor front','floor edge wing','forward floorboard','forward floor board','forward floor board stay','floorboard','floor board','board geometry']},
    {id:'sidepod',label:'Sidepod / inlet',top:[282,121],side:[674,155],aliases:['sidepod','side pod','sidepod inlet','side pod inlet','radiator inlet','sidepod bodywork']},
    {id:'floor',label:'Floor / floor edge',top:[307,169],side:[690,197],aliases:['floor edge','floor body','floor bodywork','floor','edge wing']},
    {id:'cooling',label:'Cooling / engine cover',top:[346,126],side:[715,132],aliases:['sidepod louvre','sidepod louver','cooling louvre','cooling louver','cooling louvres','cooling louvers','cooling outlet','engine cover','coke engine cover','coke cover','bodywork cooling','rear cooling','central bodywork']},
    {id:'cockpit',label:'Cockpit / halo',top:[320,158],side:[680,122],aliases:['halo','cockpit','mirror','mirror stay','mirror rear stay','rear view mirror','headrest']},
    {id:'rear-corner',label:'Rear corner',top:[399,117],side:[751,194],aliases:['rear suspension','rear corner','rear brake duct','rear brake','rear wheel bodywork']},
    {id:'rear-body',label:'Rear body / impact structure',top:[429,158],side:[789,150],aliases:['rear impact structure','impact structure','exhaust tailpipe bracket','exhaust tailpipe','tailpipe','exhaust bracket','exhaust']},
    {id:'diffuser',label:'Diffuser',top:[443,158],side:[786,191],aliases:['diffuser','floor exit','rear floor','diffuser edge']},
    {id:'beam-wing',label:'Beam wing',top:[467,158],side:[807,160],aliases:['beam wing','beamwing']},
    {id:'rear-wing',label:'Rear wing',top:[507,158],side:[835,135],aliases:['rear wing','rearwing','rear wing endplate','rear wing flap','rear wing mainplane']}
  ];
  function norm(v){return String(v||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,' ').replace(/\s+/g,' ').trim();}
  function matchZones(update){
    const component=norm(update?.component),rest=norm(`${update?.reason||''} ${update?.diff||''} ${update?.desc||''}`);
    const matches=[];
    function collect(hay,confidence,base,source){
      for(const z of ZONES){
        let zoneBest=null;
        for(const alias of z.aliases){
          const a=norm(alias);
          if(hay===a||hay.startsWith(a+' ')||hay.includes(a)){
            const score=base+a.length;if(!zoneBest||score>zoneBest.score)zoneBest={...z,confidence,score,matched:a,source};
          }
        }
        if(zoneBest)matches.push(zoneBest);
      }
    }
    collect(component,'HIGH',100,'component');
    if(!matches.length)collect(rest,'MEDIUM',50,'description');
    if(!matches.length)return [];
    matches.sort((a,b)=>b.score-a.score);const best=matches[0].score;
    return matches.filter((z,i,a)=>z.score>=best-8&&a.findIndex(x=>x.id===z.id)===i).slice(0,3);
  }
  function matchZone(update){
    const zones=matchZones(update);return zones[0]||{id:'unmapped',label:'Location not mapped',top:null,side:null,confidence:'LOW',score:0,matched:'',source:'none'};
  }
  function mapUpdates(updates){return (updates||[]).map((u,i)=>{const maps=matchZones(u),map=maps[0]||matchZone(u);return {...u,maps,map,mapIndex:i+1};});}
  function mappingSummary(updates){
    const mapped=mapUpdates(updates),known=mapped.filter(x=>x.maps.length).length,high=mapped.filter(x=>x.maps.some(z=>z.confidence==='HIGH')).length;
    return {mapped,known,total:mapped.length,high,coverage:mapped.length?Math.round(100*known/mapped.length):0};
  }
  return {ZONES,norm,matchZones,matchZone,mapUpdates,mappingSummary};
});

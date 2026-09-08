(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports)module.exports=api;
  root.F1HubCarDevelopment=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';
  const ZONES=[
    {id:'front-wing',label:'Front wing',top:[105,120],side:[103,357],perspective:[142,458],aliases:['front wing','frontwing','front flap','front wing flap','front wing endplate','front wing tip']},
    {id:'nose',label:'Nose',top:[205,120],side:[184,338],perspective:[272,414],aliases:['nose','nosecone','nose cone']},
    {id:'front-corner',label:'Front corner',top:[302,68],side:[282,347],perspective:[365,390],aliases:['front suspension','front corner','front brake duct','front brake','front wheel bodywork','front wheel assembly','front drum','front drum exit']},
    {id:'floor-fences',label:'Floor fences / inlet',top:[382,95],side:[400,348],perspective:[482,425],aliases:['floor fence','floor fences','floor furniture','floor inlet','floor leading edge','floor front','floor edge wing','forward floorboard','forward floor board','forward floor board stay','floorboard','floor board','board geometry']},
    {id:'sidepod',label:'Sidepod / inlet',top:[472,82],side:[520,310],perspective:[590,384],aliases:['sidepod','side pod','sidepod inlet','side pod inlet','radiator inlet','sidepod bodywork']},
    {id:'floor',label:'Floor / floor edge',top:[560,166],side:[590,362],perspective:[604,466],aliases:['floor edge','floor body','floor bodywork','floor','edge wing']},
    {id:'cooling',label:'Cooling / engine cover',top:[610,92],side:[633,287],perspective:[664,318],aliases:['sidepod louvre','sidepod louver','cooling louvre','cooling louver','cooling louvres','cooling louvers','cooling outlet','engine cover','coke engine cover','coke cover','bodywork cooling','rear cooling','central bodywork']},
    {id:'cockpit',label:'Cockpit / halo',top:[485,120],side:[493,276],perspective:[548,305],aliases:['halo','cockpit','mirror','mirror stay','mirror rear stay','rear view mirror','headrest']},
    {id:'rear-corner',label:'Rear corner',top:[768,66],side:[773,345],perspective:[808,374],aliases:['rear suspension','rear corner','rear brake duct','rear brake','rear wheel bodywork']},
    {id:'rear-body',label:'Rear body / impact structure',top:[805,120],side:[805,309],perspective:[764,331],aliases:['rear impact structure','impact structure','exhaust tailpipe bracket','exhaust tailpipe','tailpipe','exhaust bracket','exhaust']},
    {id:'diffuser',label:'Diffuser',top:[842,154],side:[832,368],perspective:[842,458],aliases:['diffuser','floor exit','rear floor','diffuser edge']},
    {id:'beam-wing',label:'Beam wing',top:[861,120],side:[860,311],perspective:[847,295],aliases:['beam wing','beamwing']},
    {id:'rear-wing',label:'Rear wing',top:[912,120],side:[905,278],perspective:[862,236],aliases:['rear wing','rearwing','rear wing endplate','rear wing flap','rear wing mainplane']}
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

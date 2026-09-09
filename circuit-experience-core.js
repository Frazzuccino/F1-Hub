'use strict';
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.F1HubCircuitExperience=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){
  function viewBox(svg){
    const vb=svg?.viewBox?.baseVal;if(vb&&Number.isFinite(vb.width)&&vb.width>0)return [vb.x,vb.y,vb.width,vb.height];
    const raw=String(svg?.getAttribute?.('viewBox')||'').trim().split(/[ ,]+/).map(Number);if(raw.length===4&&raw.every(Number.isFinite)&&raw[2]>0&&raw[3]>0)return raw;
    const w=Number(String(svg?.getAttribute?.('width')||'').replace(/[^0-9.]/g,''))||1000,h=Number(String(svg?.getAttribute?.('height')||'').replace(/[^0-9.]/g,''))||700;return [0,0,w,h];
  }
  function longestPath(svg){let best=null,bestLen=0;for(const el of svg.querySelectorAll('path,polyline,polygon')){try{const len=el.getTotalLength();if(Number.isFinite(len)&&len>bestLen){best=el;bestLen=len;}}catch{}}return best?{path:best,length:bestLen}:null;}
  function pathPoint(path,s){const p=path.getPointAtLength(s);try{const svg=path.ownerSVGElement,root=svg?.getCTM?.(),own=path.getCTM?.();if(svg&&root&&own&&typeof root.inverse==='function'){const m=root.inverse().multiply(own),q=svg.createSVGPoint();q.x=p.x;q.y=p.y;const z=q.matrixTransform(m);return {x:z.x,y:z.y};}}catch{}return {x:p.x,y:p.y};}
  function turnCandidates(path,length,count){
    const samples=Math.max(360,count*28),pts=[];for(let i=0;i<=samples;i++){const s=length*i/samples,p=pathPoint(path,s);pts.push({s,x:p.x,y:p.y,score:0});}
    for(let i=3;i<samples-3;i++){const a=pts[i-3],b=pts[i],c=pts[i+3],v1x=b.x-a.x,v1y=b.y-a.y,v2x=c.x-b.x,v2y=c.y-b.y,dot=v1x*v2x+v1y*v2y,cross=v1x*v2y-v1y*v2x;pts[i].score=Math.abs(Math.atan2(cross,dot));}
    const peaks=[];for(let i=4;i<samples-4;i++)if(pts[i].score>=pts[i-1].score&&pts[i].score>pts[i+1].score&&pts[i].score>.018)peaks.push(pts[i]);
    peaks.sort((a,b)=>b.score-a.score);const chosen=[],minGap=length/Math.max(28,count*1.65),circularGap=(a,b)=>Math.min(Math.abs(a-b),length-Math.abs(a-b));
    for(const p of peaks){if(chosen.every(x=>circularGap(x.s,p.s)>=minGap)){chosen.push(p);if(chosen.length===count)break;}}
    if(chosen.length<count){for(let i=0;i<count;i++){const s=length*(i+.35)/count;if(chosen.every(x=>circularGap(x.s,s)>=minGap*.55)){const p=pathPoint(path,s);chosen.push({s,x:p.x,y:p.y,score:0});if(chosen.length===count)break;}}}
    while(chosen.length<count){const s=length*(chosen.length+.5)/count,p=pathPoint(path,s);chosen.push({s,x:p.x,y:p.y,score:0});}
    return chosen.sort((a,b)=>a.s-b.s).slice(0,count).map((p,i)=>({...p,turn:i+1,progress:p.s/length}));
  }
  function sector(turn,total){return Math.min(3,Math.floor((turn-1)/Math.max(1,total/3))+1);}
  function focusBox(full,point,zoom=2.28){const [x0,y0,w0,h0]=full,w=w0/zoom,h=h0/zoom,cx=Math.max(x0+w/2,Math.min(x0+w0-w/2,point.x)),cy=Math.max(y0+h/2,Math.min(y0+h0-h/2,point.y));return [cx-w/2,cy-h/2,w,h];}
  return {viewBox,longestPath,turnCandidates,sector,focusBox};
});

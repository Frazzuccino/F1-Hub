'use strict';
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.F1HubCircuitExperience=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){
  function finite(v){return Number.isFinite(Number(v));}
  function norm(v){return String(v||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,' ').replace(/\s+/g,' ').trim();}
  function meetingScore(meeting,race){
    const hay=norm([meeting?.meeting_name,meeting?.meeting_official_name,meeting?.circuit_short_name,meeting?.location,meeting?.country_name].filter(Boolean).join(' '));
    const terms=[race?.raceName,race?.Circuit?.circuitName,race?.Circuit?.Location?.locality,race?.Circuit?.Location?.country].map(norm).filter(x=>x.length>2);
    return terms.reduce((s,t)=>s+(hay.includes(t)?Math.min(20,t.length):0),0);
  }
  function bestMeeting(meetings,race,circuitKey){
    const list=(meetings||[]).filter(m=>!m.is_cancelled);
    if(circuitKey){const exact=list.filter(m=>String(m.circuit_key)===String(circuitKey));if(exact.length)return exact.sort((a,b)=>meetingScore(b,race)-meetingScore(a,race))[0];}
    return list.map(m=>({m,s:meetingScore(m,race)})).sort((a,b)=>b.s-a.s)[0]?.m||null;
  }
  function chooseSession(sessions,nowMs=Date.now()){
    const rank={Race:6,Qualifying:5,'Practice 3':4,'Practice 2':3,'Practice 1':2,Sprint:5,'Sprint Qualifying':4};
    return (sessions||[]).filter(s=>new Date(s.date_start||0).getTime()<nowMs-5*60e3).sort((a,b)=>(rank[b.session_name]||rank[b.session_type]||0)-(rank[a.session_name]||rank[a.session_type]||0)||new Date(b.date_start||0)-new Date(a.date_start||0))[0]||null;
  }
  function corners(payload){
    return (payload?.corners||[]).map(c=>({
      number:Number(c.number||0),letter:String(c.letter||''),angle:Number(c.angle||0),distanceM:finite(c.length)?Number(c.length)/10:null,
      x:Number(c.trackPosition?.x),y:Number(c.trackPosition?.y)
    })).filter(c=>c.number>0&&finite(c.x)&&finite(c.y)).sort((a,b)=>(a.distanceM??1e12)-(b.distanceM??1e12)||a.number-b.number||a.letter.localeCompare(b.letter));
  }
  function tracingCorners(payload){
    const nums=payload?.CornerNumber||[],xs=payload?.X||[],ys=payload?.Y||[],angles=payload?.Angle||[],dist=payload?.Distance||[];
    return nums.map((n,i)=>({number:Number(n||0),letter:'',angle:Number(angles[i]||0),distanceM:finite(dist[i])?Number(dist[i]):null,x:Number(xs[i]),y:Number(ys[i])})).filter(c=>c.number>0&&finite(c.x)&&finite(c.y)).sort((a,b)=>(a.distanceM??1e12)-(b.distanceM??1e12)||a.number-b.number);
  }
  function catmullClosed(points,steps=16){
    const p=points||[];if(p.length<3)return p;const out=[];const n=p.length;
    for(let i=0;i<n;i++){const p0=p[(i-1+n)%n],p1=p[i],p2=p[(i+1)%n],p3=p[(i+2)%n];for(let s=0;s<steps;s++){const tt=s/steps,t2=tt*tt,t3=t2*tt;out.push({x:.5*((2*p1.x)+(-p0.x+p2.x)*tt+(2*p0.x-5*p1.x+4*p2.x-p3.x)*t2+(-p0.x+3*p1.x-3*p2.x+p3.x)*t3),y:.5*((2*p1.y)+(-p0.y+p2.y)*tt+(2*p0.y-5*p1.y+4*p2.y-p3.y)*t2+(-p0.y+3*p1.y-3*p2.y+p3.y)*t3)});}}out.push({...out[0]});return out;
  }
  function trackFromLocations(rows,maxPoints=900){
    const pts=(rows||[]).filter(r=>finite(r.x)&&finite(r.y)&&r.date).map(r=>({x:Number(r.x),y:Number(r.y),date:r.date,t:new Date(r.date).getTime()})).filter(p=>Number.isFinite(p.t)).sort((a,b)=>a.t-b.t);
    if(pts.length<=maxPoints)return pts;const step=Math.ceil(pts.length/maxPoints);return pts.filter((_,i)=>i%step===0||i===pts.length-1);
  }
  function rotatePoints(points,deg){
    const a=Number(deg||0)*Math.PI/180,ca=Math.cos(a),sa=Math.sin(a);return (points||[]).map(p=>({...p,x:p.x*ca-p.y*sa,y:p.x*sa+p.y*ca}));
  }
  function cumulative(points){const out=[0];for(let i=1;i<(points||[]).length;i++)out[i]=out[i-1]+Math.hypot(points[i].x-points[i-1].x,points[i].y-points[i-1].y);return out;}
  function nearestIndexByTime(points,targetMs){let best=0,bd=Infinity;(points||[]).forEach((p,i)=>{const d=Math.abs(Number(p.t)-targetMs);if(d<bd){bd=d;best=i;}});return best;}
  function bounds(all,pad=.08){const xs=all.map(p=>p.x),ys=all.map(p=>p.y),xmin=Math.min(...xs),xmax=Math.max(...xs),ymin=Math.min(...ys),ymax=Math.max(...ys),w=Math.max(1,xmax-xmin),h=Math.max(1,ymax-ymin);return [xmin-w*pad,ymin-h*pad,w*(1+2*pad),h*(1+2*pad)];}
  function projector(all,rotation=0,W=1000,H=700,pad=55){
    const rotated=rotatePoints(all,rotation),[xmin,ymin,w,h]=bounds(rotated,.02),scale=Math.min((W-pad*2)/w,(H-pad*2)/h),ox=(W-w*scale)/2-xmin*scale,oy=(H-h*scale)/2+ymin*scale;
    return {W,H,point:p=>{const [q]=rotatePoints([p],rotation);return {...p,x:ox+q.x*scale,y:H-(oy+q.y*scale)};}};
  }
  function officialExperience(trackRows,cornerRows,rotation,lapLengthM,lap){
    const track=trackFromLocations(trackRows);if(track.length<20||!cornerRows?.length)return null;
    const all=[...track,...cornerRows],pr=projector(all,rotation),pt=track.map(pr.point),pc=cornerRows.map(pr.point),cum=cumulative(pt),total=cum.at(-1)||1;
    const startMs=new Date(lap?.date_start||track[0].date).getTime(),s1Ms=startMs+Number(lap?.duration_sector_1||0)*1000,s2Ms=s1Ms+Number(lap?.duration_sector_2||0)*1000;
    const i1=lap?.duration_sector_1?nearestIndexByTime(track,s1Ms):-1,i2=lap?.duration_sector_2?nearestIndexByTime(track,s2Ms):-1;
    const sectorProgress=[i1>=0?cum[i1]/total:null,i2>=0?cum[i2]/total:null].filter(v=>v!==null);
    const length=Number(lapLengthM||0)||total;
    const turns=pc.map((c,i)=>{const raw=cornerRows[i],progress=raw.distanceM!==null&&length>0?Math.max(0,Math.min(1,raw.distanceM/length)):null;const prog=progress??0;const sector=sectorProgress.length===2?(prog<sectorProgress[0]?1:prog<sectorProgress[1]?2:3):null;return {...c,turn:raw.number,label:`${raw.number}${raw.letter||''}`,letter:raw.letter,distanceM:raw.distanceM,progress:prog,sector};});
    const sectors=[];if(i1>=0)sectors.push({...pt[i1],label:'S1',progress:sectorProgress[0]});if(i2>=0)sectors.push({...pt[i2],label:'S2',progress:sectorProgress[1]});
    return {track:pt,turns,sectors,start:pt[0],full:[0,0,pr.W,pr.H],trackLengthPx:total};
  }
  function cornerOnlyExperience(cornerRows,rotation,lapLengthM){
    if(!cornerRows?.length)return null;const pr=projector(cornerRows,rotation),pc=cornerRows.map(pr.point),track=catmullClosed(pc,18),length=Number(lapLengthM||0)||Math.max(...cornerRows.map(c=>Number(c.distanceM||0)),1);const turns=pc.map((c,i)=>{const raw=cornerRows[i],progress=raw.distanceM!==null&&length>0?Math.max(0,Math.min(1,raw.distanceM/length)):i/pc.length;return {...c,turn:raw.number,label:`${raw.number}${raw.letter||''}`,letter:raw.letter,distanceM:raw.distanceM,progress,sector:null};});return {track,turns,sectors:[],start:track[0]||pc[0],full:[0,0,pr.W,pr.H],trackLengthPx:cumulative(track).at(-1)||1};
  }
  function longStraights(cornerRows,lapLengthM,count=4){
    const cs=(cornerRows||[]).filter(c=>c.distanceM!==null).slice().sort((a,b)=>a.distanceM-b.distanceM);if(cs.length<2||!lapLengthM)return[];const out=[];
    for(let i=0;i<cs.length;i++){const a=cs[i],b=cs[(i+1)%cs.length],end=i===cs.length-1?Number(lapLengthM)+b.distanceM:b.distanceM,gap=end-a.distanceM;if(gap>120)out.push({from:`${a.number}${a.letter||''}`,to:`${b.number}${b.letter||''}`,distanceM:gap});}
    return out.sort((a,b)=>b.distanceM-a.distanceM).slice(0,count);
  }
  function focusBox(full,point,zoom=2.35){const [x0,y0,w0,h0]=full,w=w0/zoom,h=h0/zoom,cx=Math.max(x0+w/2,Math.min(x0+w0-w/2,point.x)),cy=Math.max(y0+h/2,Math.min(y0+h0-h/2,point.y));return [cx-w/2,cy-h/2,w,h];}
  return {norm,meetingScore,bestMeeting,chooseSession,corners,tracingCorners,trackFromLocations,nearestIndexByTime,officialExperience,cornerOnlyExperience,longStraights,focusBox};
});

'use strict';
const fs=require('fs'),vm=require('vm'),path=require('path');
global.F1HubQuality=require('../quality-core.js');
const dummy=()=>({
  textContent:'',className:'',innerHTML:'',dataset:{},style:{},classList:{add(){},remove(){},toggle(){},contains(){return false}},
  addEventListener(){},removeEventListener(){},querySelector(){return null},querySelectorAll(){return []},closest(){return null},appendChild(){},remove(){},setAttribute(){},hasAttribute(){return false},
  get value(){return this._value||''},set value(v){this._value=v},options:[],disabled:false
});
const elems=new Map();['view','toast','connection-pill','refresh-btn','brand-btn','install-app-btn','install-sheet','install-now','install-later','update-banner','update-now','pull-indicator'].forEach(id=>elems.set(id,dummy()));
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
global.requestAnimationFrame=(fn)=>fn();
try{
  const code=fs.readFileSync(path.join(__dirname,'..','app.js'),'utf8');vm.runInThisContext(code,{filename:'app.js'});
  const sorted=vm.runInThisContext("sortedSessionResults([{driver_number:18,dnf:true,position:null,number_of_laps:20},{driver_number:12,position:1,number_of_laps:53},{driver_number:63,position:2,number_of_laps:53}]).map(x=>x.driver_number)");
  if(JSON.stringify(sorted)!=='[12,63,18]')throw new Error('runtime DNF ordering failed: '+JSON.stringify(sorted));
  const route=vm.runInThisContext("parentNav('datahealth')");if(route!=='more')throw new Error('data health nav route failed');
  console.log('RUNTIME SMOKE: PASS');
}catch(e){console.error('RUNTIME SMOKE: FAIL',e.stack||e);process.exit(1);}

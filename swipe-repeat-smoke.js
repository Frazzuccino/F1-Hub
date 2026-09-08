'use strict';
const fs=require('fs'),vm=require('vm'),path=require('path');
global.F1HubQuality=require('../quality-core.js');
global.F1HubCarDevelopment=require('../car-development-core.js');
global.F1HubDriverCareer=require('../driver-career-core.js');
const listeners={};
function classes(){const s=new Set();return {add(...a){a.forEach(x=>s.add(x))},remove(...a){a.forEach(x=>s.delete(x))},toggle(x,v){if(v===undefined){s.has(x)?s.delete(x):s.add(x)}else v?s.add(x):s.delete(x)},contains(x){return s.has(x)}};}
const dummy=()=>({textContent:'',className:'',innerHTML:'',dataset:{},style:{cssText:'',setProperty(){},removeProperty(){}},classList:classes(),addEventListener(){},removeEventListener(){},querySelector(){return null},querySelectorAll(){return []},closest(){return null},appendChild(){},insertBefore(){},remove(){},setAttribute(){},removeAttribute(){},hasAttribute(){return false},cloneNode(){return dummy()},getBoundingClientRect(){return {top:70}},scrollIntoView(){},get value(){return this._value||''},set value(v){this._value=v},options:[],disabled:false});
const elems=new Map();['view','toast','connection-pill','refresh-btn','brand-btn','install-app-btn','install-sheet','install-now','install-later','update-banner','update-now','pull-indicator','app-shell','launch-screen'].forEach(id=>elems.set(id,dummy()));
global.document={hidden:false,body:dummy(),head:dummy(),documentElement:dummy(),getElementById(id){if(!elems.has(id))elems.set(id,dummy());return elems.get(id)},querySelector(){return null},querySelectorAll(){return []},createElement(){return dummy()},addEventListener(){},removeEventListener(){}};
global.window=global;window.innerWidth=420;window.innerHeight=850;window.scrollY=0;window.scrollTo=()=>{};window.addEventListener=(n,fn)=>{(listeners[n]??=[]).push(fn)};window.removeEventListener=()=>{};window.matchMedia=()=>({matches:false,addEventListener(){}});global.matchMedia=window.matchMedia;
Object.defineProperty(global,'navigator',{value:{onLine:true},configurable:true});Object.defineProperty(global,'location',{value:{hash:'#home',protocol:'file:',href:'file:///swipe/index.html'},configurable:true});global.history={pushState(_s,_t,h){location.hash=h},length:1,back(){}};global.localStorage={getItem(){return null},setItem(){},removeItem(){}};global.sessionStorage={getItem(){return null},setItem(){}};global.MutationObserver=class{constructor(){}observe(){}};global.DOMParser=class{parseFromString(){return {querySelector(){return null},getElementsByTagName(){return []}}}};global.fetch=async()=>{throw new Error('offline')};global.AbortController=class{constructor(){this.signal={}}abort(){}};global.setInterval=()=>0;global.clearInterval=()=>{};global.setTimeout=()=>0;global.clearTimeout=()=>{};global.requestAnimationFrame=(fn)=>{fn();return 1};global.cancelAnimationFrame=()=>{};global.performance={now:(()=>{let n=0;return()=>n+=16})()};global.CSS={escape:s=>String(s)};
vm.runInThisContext(fs.readFileSync(path.join(__dirname,'..','app.js'),'utf8'),{filename:'app.js'});
vm.runInThisContext("state.loaded=true;state.route='home';state.schedule=[];state.drivers=[];state.constructors=[];state.news=[];");
function ev(x,y){return {touches:[{clientX:x,clientY:y}],changedTouches:[{clientX:x,clientY:y}],target:{closest(){return null}},preventDefault(){}};}
function swipeLeft(){listeners.touchstart.at(-1)(ev(330,320));listeners.touchmove.at(-1)(ev(205,322));listeners.touchend.at(-1)({changedTouches:[{clientX:205,clientY:322}]});}
swipeLeft();let r1=vm.runInThisContext('state.route');
if(r1!=='races')throw new Error('first swipe failed: '+r1);
// Deliberately do not execute any transition timeout. The second gesture must still work.
swipeLeft();let r2=vm.runInThisContext('state.route');
if(r2!=='standings')throw new Error('second immediate swipe blocked: '+r2);
console.log('REPEAT SWIPE SMOKE: PASS');

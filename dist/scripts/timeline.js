// Scroll the document naturally. A sticky viewport frames five overlapping shots.
const stage=document.querySelector('.stage');
const scenes=Array.from(stage.querySelectorAll("section"));
const stops=[0,1.36,2.74,4.03,5.35];
const duration=5.9;
const wipeDuration=.53;
const staticMode=matchMedia('(prefers-reduced-motion: reduce), (max-height:520px)');
const bound=(v,min=0,max=1)=>Math.max(min,Math.min(max,v));
const smooth=v=>v*v*(3-2*v);
const percent=n=>n.toFixed(2)+'%';
const layers=Object.fromEntries(['.object','.name','.bio','#grid','.screen','.caption','.terminal','.rack.left','.rack.right','#city','.signal>div','.end','.wall.left','.wall.right'].map(sel=>[sel,document.querySelector(sel)]));
const place=(sel,transform)=>{layers[sel].style.transform=transform;};
const sheet=document.querySelector('main');
const chapterLinks=document.querySelectorAll('.chapters a');
function maxScroll(){return Math.max(1,sheet.offsetHeight-stage.offsetHeight);}
function animate(){
 if(staticMode.matches)return;
 const t=bound(scrollY/maxScroll())*duration;
 stage.style.setProperty('--read',t/duration);
 const active=scenes.findLastIndex((_,i)=>t>=stops[i]-wipeDuration/2);
 for(const [i,link] of chapterLinks.entries()){
  if(i===active)link.setAttribute('aria-current','step');else link.removeAttribute('aria-current');
 }
 scenes.forEach((scene,i)=>{
  const start=stops[i],next=stops[i+1]??Infinity;
  const enter=i===0?1:bound((t-start+wipeDuration)/wipeDuration);
  const leave=bound((t-next+wipeDuration)/wipeDuration);
  const visible=enter>0&&leave<1;
  scene.hidden=!visible;
  scene.inert=!visible||enter<.55||leave>.45;
  if(!visible)return;
  const e=smooth(enter),l=smooth(leave);
  scene.style.zIndex=String(i);
  // Each cut opens from a different edge, revealing the incoming scene in depth.
  const edge=percent(100*(1-e));
  scene.style.clipPath=i===1?'inset('+edge+' 0 0)':i===2?'inset(0 '+edge+' 0 0)':i===3?'inset('+edge+' 0 0)':i===4?'inset(0 0 0 '+edge+')':'none';
  const progress=bound((t-start)/(Number.isFinite(next)?next-start:duration-start));
  if(i===0){
   place('.object','translate3d('+percent(-13*progress)+','+percent(-7*progress)+',0) scale('+(1+progress*1.55)+') rotate('+(-progress*22)+'deg)');
   place('#grid','scale('+(1+progress*.85)+') rotate('+progress*6+'deg)');
   place('.name','translateX('+percent(-120*progress)+')');place('.bio','translateX('+percent(115*progress)+')');
  }else if(i===1){
   place('.screen','translate3d('+percent((1-e)*80-progress*15)+','+percent((1-e)*27-progress*8)+',0) rotateY('+(-40+e*28+progress*22)+'deg) rotateZ('+(12-e*8-progress*8)+'deg) scale('+(.66+e*.34+l*1.75)+')');
   place('.caption','translateX('+percent(-(1-e)*60-l*110)+')');
  }else if(i===2){
   place('.terminal','translate3d(0,'+percent((1-e)*12)+','+(-380*(1-e)+progress*90)+'px) scale('+(.8+.2*e)+')');
   for(const [side,sign] of [['left',-1],['right',1]])place('.rack.'+side,'translateX('+percent(sign*(progress*33-(1-e)*25))+') rotateY('+(-sign*58)+'deg) scale('+(1+progress*.52)+')');
  }else if(i===3){
   place('#city','translate('+percent(12*(1-e)-progress*6)+','+percent(progress*3)+') rotate('+(-12*(1-e)+progress*5)+'deg) scale('+(1.32+.48*l-progress*.15)+')');
   place('.signal>div','translateX('+percent(-(1-e)*115)+')');
  }else{
   place('.end','translateZ('+(-380*(1-e)+progress*45)+'px) scale('+(.8+.2*e)+')');
   for(const [side,sign] of [['left',-1],['right',1]])place('.wall.'+side,'translateX('+percent(sign*(e*18+progress*16))+') rotateY('+(-sign*60)+'deg) scale('+(1+progress*.28)+')');
  }
 });
}
let frame=0;
function schedule(){if(!frame)frame=requestAnimationFrame(()=>{frame=0;animate();});}
function go(hash,behavior){
 const i=scenes.findIndex(scene=>'#'+scene.id===hash);
 if(i<0||staticMode.matches)return;
 window.scrollTo({top:maxScroll()*stops[i]/duration,behavior});
}
function configure(){
 document.documentElement.classList.toggle('travel',!staticMode.matches);
 for(const scene of scenes){scene.hidden=false;scene.inert=false;scene.removeAttribute('style');}
 for(const layer of Object.values(layers))layer.style.removeProperty('transform');
 animate();
}
document.addEventListener('click',event=>{
 const link=event.target.closest('a[href^="#"]');
 if(!link||staticMode.matches||event.metaKey||event.ctrlKey||event.shiftKey)return;
 event.preventDefault();history.pushState(null,'',link.hash);go(link.hash,'smooth');
});
window.addEventListener('popstate',()=>go(location.hash||'#home','instant'));
window.addEventListener('scroll',schedule,{passive:true});
window.addEventListener('resize',schedule);
staticMode.addEventListener('change',configure);
configure();if(location.hash)go(location.hash,'instant');

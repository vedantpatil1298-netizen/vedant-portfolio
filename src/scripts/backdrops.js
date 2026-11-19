(() => {
function fit(canvas) {
 const w=canvas.clientWidth,h=canvas.clientHeight,d=Math.min(devicePixelRatio,2);
 canvas.width=w*d;canvas.height=h*d;
 const ctx=canvas.getContext('2d');ctx.scale(d,d);return {w,h,ctx};
}
function grid(){
 const {w,h,ctx}=fit(document.querySelector('#grid'));
 const step=Math.max(42,w/20);
 function point(x,y){
  const u=(x-w*.5)/w,v=(y-h*.5)/h;
  return [x+Math.sin(2.8*v+u*4)*step*.37,y+Math.cos(u*4.4)*step*.4+(u*u)*v*step*4];
 }
 function line(x,y,dx,dy,n){
  ctx.beginPath();
  for(let j=0;j<=n;j++){const p=point(x+dx*j/n,y+dy*j/n);if(j)ctx.lineTo(...p);else ctx.moveTo(...p);}
  ctx.stroke();
 }
 ctx.lineWidth=.85;ctx.strokeStyle='#627072';
 for(let x=-step;x<w+step;x+=step) line(x,-2*step,0,h+4*step,35);
 for(let y=-step;y<h+step;y+=step) line(-2*step,y,w+4*step,0,40);
 ctx.strokeStyle='#526066';
 for(let x=0;x<w;x+=step)for(let y=0;y<h;y+=step){
  if(Math.cos(x*4+y*9)>.55){line(x+step/2,y,0,step,4);line(x,y+step/2,step,0,4);}
 }
}
function city(){
 const {w,h,ctx}=fit(document.querySelector('#city'));
 const s=Math.min(w/30,h/16);
 function pos(x,y,z){return [w*.5+(x-y)*s,h*.55+(x+y)*s*.43-z*s];}
 function face(coords,color){ctx.beginPath();coords.forEach(([x,y,z],i)=>{const p=pos(x,y,z);if(i)ctx.lineTo(...p);else ctx.moveTo(...p);});ctx.closePath();ctx.fillStyle=color;ctx.fill();ctx.strokeStyle='#69fa8260';ctx.lineWidth=.7;ctx.stroke();}
 for(let x=-10;x<=10;x++)for(let y=-7;y<=7;y++){
  face([[x,y,0],[x+1,y,0],[x+1,y+1,0],[x,y+1,0]],'#061c0d');
  const val=Math.sin(x*29+y*11.23)*1347.63;
  const height=(val-Math.floor(val))*4.8;
  if(height<.75)continue;
  const a=x+.13,b=y+.13,c=x+.87,d=y+.87,z=height;
  face([[c,b,0],[c,d,0],[c,d,z],[c,b,z]],'#136937');
  face([[a,d,0],[c,d,0],[c,d,z],[a,d,z]],'#2a9f49');
  face([[a,b,z],[c,b,z],[c,d,z],[a,d,z]],'#70f777');
 }
}
grid();city();
for(const [id,draw] of [['grid',grid],['city',city]]){
 const canvas=document.getElementById(id);
 new ResizeObserver(()=>{if(canvas.clientWidth && canvas.clientHeight)draw();}).observe(canvas);
}
})();

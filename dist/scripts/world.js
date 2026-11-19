(() => {
  if (!window.THREE) return;
  const T = window.THREE;
  const canvas = document.querySelector('#world');
  let renderer;
  try {
    renderer = new T.WebGLRenderer({canvas, antialias:true, powerPreference:'low-power'});
  } catch { return; }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1,1.6));
  renderer.outputColorSpace = T.SRGBColorSpace;
  const world = new T.Scene();
  world.background = new T.Color();
  world.fog = new T.FogExp2(0x0b1116,.046);
  const camera = new T.PerspectiveCamera(44,1,.08,100);
  world.add(new T.HemisphereLight(0xe1efff,0x474337,2));
  const sun = new T.DirectionalLight(0xe8f3ff,2.8);
  sun.position.set(-4,7,6); world.add(sun);
  const rim = new T.DirectionalLight(0xffac74,1.2);
  rim.position.set(4,2,-4); world.add(rim);
  const group = z => {const g=new T.Group(); g.position.z=z; world.add(g); return g;};
  const matte = (color,metalness=.15,roughness=.4) => new T.MeshStandardMaterial({color,metalness,roughness});
  const glow = color => new T.MeshBasicMaterial({color});
  const cube=new T.BoxGeometry(1,1,1);
  function mesh(parent,geo,mat,x=0,y=0,z=0){
    const obj=new T.Mesh(geo,mat);obj.position.set(x,y,z);parent.add(obj);return obj;
  }
  function box(parent,mat,x,y,z,w,h,d){
    const obj=mesh(parent,cube,mat,x,y,z);obj.scale.set(w,h,d);return obj;
  }
  const opening=group(0);
  const wire=mesh(opening,new T.PlaneGeometry(40,23,45,26),new T.MeshBasicMaterial({color:0x425455,wireframe:true,transparent:true,opacity:.44}),0,0,-5);
  const pos=wire.geometry.attributes.position;
  for(let i=0;i<pos.count;i++)pos.setZ(i,Math.sin(pos.getX(i)*.32)*Math.cos(pos.getY(i)*.4)*1.3);

  const gallery=group(-15),monitor=new T.Group();gallery.add(monitor);
  const graphite=matte(0x1c2429,.4,.35);
  box(monitor,graphite,0,0,0,6,3.55,.19);
  box(monitor,graphite,0,-2,-.08,.35,.55,.2);
  box(monitor,graphite,0,-2.28,.06,1.8,.1,.75);
  const panel=document.createElement('canvas');panel.width=1200;panel.height=680;
  const pen=panel.getContext('2d'),gradient=pen.createLinearGradient(0,0,1200,680);
  gradient.addColorStop(0,'#242989');gradient.addColorStop(.63,'#4c67dc');gradient.addColorStop(1,'#9cd7f7');
  pen.fillStyle=gradient;pen.fillRect(0,0,1200,680);pen.fillStyle='white';
  pen.font='24px monospace';pen.fillText('CATALYST   /   SOLO BUILD',60,82);
  pen.font='bold 114px Arial';pen.fillText('CareCircle',56,320);
  pen.font='32px Arial';pen.fillText('Elderly care & medication management',62,395);
  pen.font='160px Arial';pen.fillText('♡',910,340);
  pen.fillRect(60,565,1080,2);pen.font='23px monospace';pen.fillText('VEDANT PATIL',60,618);pen.fillText('2026',1065,618);
  const texture=new T.CanvasTexture(panel);texture.colorSpace=T.SRGBColorSpace;
  mesh(monitor,new T.PlaneGeometry(5.8,3.32),new T.MeshBasicMaterial({map:texture}),0,0,.104);
  const floor=new T.GridHelper(36,30,0x8d9290,0xa5a8a0);floor.position.y=-2.35;gallery.add(floor);

  // Batch repeated structures so rows of servers and city blocks use few draw calls.
  function batch(parent,material,items){
    const inst=new T.InstancedMesh(cube,material,items.length),dummy=new T.Object3D();
    items.forEach(([x,y,z,w,h,d],i)=>{dummy.position.set(x,y,z);dummy.scale.set(w,h,d);dummy.updateMatrix();inst.setMatrixAt(i,dummy.matrix);});
    parent.add(inst);return inst;
  }
  const server=group(-31),racks=[],trays=[],leds=[],rails=[];
  for(const side of [-1,1])for(let n=0;n<7;n++){
    const z=6-n*1.8;racks.push([side*3.6,0,z,1.08,5.1,1.64]);
    for(let k=0;k<11;k++){trays.push([side*3.03,-2.15+k*.41,z,.09,.32,1.48]);leds.push([side*2.97,-2.12+k*.41,z+.52,.045,.035,.08]);}
    rails.push([side*3.4,2.78,z,.06,.08,1.65]);
  }
  batch(server,graphite,racks);batch(server,matte(0x394650),trays);batch(server,glow(0x92ffaa),leds);batch(server,glow(0xaccdda),rails);
  box(server,matte(0x212a2c),0,-2.62,0,10,.15,27);
  const cityGroup=group(-49),blocks=[];
  for(let x=-9;x<=9;x++)for(let z=-6;z<=5;z++){
    const v=Math.sin(x*97+z*59)*5371,h=.12+(v-Math.floor(v))**2*3.4;
    blocks.push([x*.67,h/2-2,z*.67,.54,h,.54]);
  }
  batch(cityGroup,matte(0x48db68),blocks);
  const cityFloor=new T.GridHelper(26,38,0x32ab58,0x155431);cityFloor.position.y=-2.01;cityGroup.add(cityFloor);
  const ending=group(-70),panels=[];
  for(const side of [-1,1])for(let z=-6;z<7;z+=2)for(let y=-2;y<=2;y++)panels.push([side*5.1,y*.86,z,.12,.73,1.54]);
  batch(ending,matte(0xba5428),panels);
  const groups=[opening,gallery,server,cityGroup,ending];
  const colors=[0x080d10,0xd5d6cf,0x091117,0x031c12,0x240f0a].map(c=>new T.Color(c));
  const beats=[...stops,duration];
  const eyes=[[.65,.23,6.7],[.9,.48,-6.8],[.15,.08,-27],[6.2,4.7,-38],[.55,.25,-63],[0,.12,-66]];
  const aims=[[0,0,0],[-1.5,-.18,-15],[0,-.2,-35],[0,-.65,-49],[0,0,-70],[0,0,-73]];
  const points=a=>a.map(v=>new T.Vector3(...v));
  const eyePath=new T.CatmullRomCurve3(points(eyes)),aimPath=new T.CatmullRomCurve3(points(aims));
  const target=new T.Vector3(), frame=document.querySelector('.stage'), main=document.querySelector('main');
  let ticket=0, lastWidth=0, lastHeight=0;
  function render(){
    ticket=0;
    if(!document.documentElement.classList.contains('travel')||renderer.getContext().isContextLost())return;
    const w=frame.clientWidth,h=frame.clientHeight;
    if(!w||!h)return;
    if(w!==lastWidth||h!==lastHeight){renderer.setSize(w,h,false);lastWidth=w;lastHeight=h;}
    camera.aspect=w/h;
    camera.fov=w/h<.85?58:44;camera.updateProjectionMatrix();
    const time=Math.min(5.9,Math.max(0,scrollY/(main.offsetHeight-h)*5.9));
    let i=0;while(i<4&&time>=beats[i+1])i++;
    const local=(time-beats[i])/(beats[i+1]-beats[i]);
    // Linger at each subject, then carry the camera into the next space.
    const t=local*local*(3-2*local),u=(i+t)/5;
    eyePath.getPoint(u,camera.position);aimPath.getPoint(u,target);
    if(w/h<.85){
      const focus=1-Math.min(1,Math.abs(time-1.36)/.8);
      target.x+=1.5*focus;target.y+=1.05*focus;camera.position.z+=2.6*focus;
    }
    camera.lookAt(target);
    monitor.rotation.set(-.035,-.15+Math.sin(time*2.2)*.15,.035);
    function drawShot(index){
      groups.forEach((group,k)=>{group.visible=k===index;});
      world.background.copy(colors[index]);world.fog.color.copy(colors[index]);
      renderer.render(world,camera);
    }
    drawShot(i);
    if(i===groups.length-1)return;
    const reveal=smooth(bound((time-beats[i+1]+wipeDuration)/wipeDuration));
    if(reveal===0)return;
    // Match the incoming section’s CSS inset using WebGL’s bottom-left origin.
    const incoming=i+1;
    if(incoming===1||incoming===3)renderer.setScissor(0,0,w,h*reveal);
    else if(incoming===2)renderer.setScissor(0,0,w*reveal,h);
    else renderer.setScissor(w*(1-reveal),0,w*reveal,h);
    renderer.setScissorTest(true);
    drawShot(incoming);
    renderer.setScissorTest(false);
  }
  function queue(){if(!ticket)ticket=requestAnimationFrame(render);}
  canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();document.documentElement.classList.remove('webgl');});
  canvas.addEventListener('webglcontextrestored',()=>{document.documentElement.classList.add('webgl');queue();});
  window.addEventListener('scroll',queue,{passive:true});window.addEventListener('resize',queue);
  staticMode.addEventListener('change',queue);
  render();document.documentElement.classList.add('webgl');queue();
})();

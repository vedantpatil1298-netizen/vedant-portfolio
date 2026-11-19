(() => {
// Draw the helmet as layers, then sample its tones into a halftone print.
const helmet = document.querySelector('#helmet');
helmet.width = 700;
helmet.height = 700;
const plate = document.createElement('canvas');
plate.width = plate.height = 700;
const ink = plate.getContext('2d');
ink.scale(1.4, 1.4);
function shape(path, fill, outline, weight = 1) {
  const line = new Path2D(path);
  if (fill) { ink.fillStyle = fill; ink.fill(line); }
  if (outline) { ink.strokeStyle = outline; ink.lineWidth = weight; ink.stroke(line); }
}
function silver(stops) {
  const grad = ink.createLinearGradient(65,65,425,455);
  stops.forEach(([offset,color]) => grad.addColorStop(offset,color));
  return grad;
}
const metal = silver([[0,'#37404c'],[.21,'#b7c4d3'],[.37,'#edf3fb'],[.53,'#566473'],[.74,'#a5b2c4'],[1,'#29333e']]);
shape('M49 279 Q39 162 102 98 Q154 36 259 37 Q353 35 394 101 Q417 135 420 164 L446 205 L425 246 L439 291 Q457 324 449 349 L425 386 L320 444 Q294 458 256 455 L117 420 Q76 392 62 338 Z',metal,'#cbd9e2',3);
shape('M59 226 Q69 103 166 65 Q250 29 321 57 Q210 46 137 109 Q97 145 74 215 Z','#e2eaf4');
shape('M96 183 Q147 92 232 71 Q270 58 295 62 Q189 88 142 148 L123 173 Z','#364454');
shape('M125 180 Q211 117 332 113 L393 121 L419 160 Q282 145 178 194 Z','#1a2530');
shape('M129 205 Q255 142 416 152 L439 198 L421 239 Q329 223 267 248 Q215 270 169 290 Q139 278 126 250 Z','#151e24','#cad7e5',5);
shape('M147 208 Q252 155 405 158 L412 167 Q262 165 158 223 Z','#8397a9');
shape('M170 234 Q275 177 414 181 Q280 187 181 247 Z','#465463');
shape('M173 293 Q244 258 298 246 Q375 224 416 244 L431 281 Q365 268 304 295 L238 331 Z',metal,'#3b4652',3);
shape('M189 314 L245 344 Q329 288 431 290 L439 314 Q353 306 277 365 L234 392 L145 344 Z','#354552');
shape('M255 390 Q344 317 433 320 L426 335 Q345 337 282 389 L256 410 Z','#bac7d4');
shape('M68 301 Q83 365 126 392 L270 434 Q311 445 425 369 L413 388 L318 442 Q288 458 257 451 L119 415 Q77 388 68 338 Z','#222c36');
for (let i=0;i<5;i++) shape('M'+(322+i*17)+' '+(383-i*9)+' l11 -5 -4 15 -12 7 Z','#19232b');
for (const [r,color] of [[35,'#27323c'],[29,'#9caab9'],[22,'#485768'],[14,'#182530'],[7,'#abb9c6']]) {
 ink.beginPath();ink.ellipse(128,247,r*.85,r,.12,0,2*Math.PI);ink.fillStyle=color;ink.fill();
}
const pixels=ink.getImageData(0,0,700,700).data;
const print=helmet.getContext('2d');
for(let y=0;y<700;y+=3){
 for(let x=(y%2);x<700;x+=3){
  const i=(y*700+x)*4;
  if(pixels[i+3]<90)continue;
  const light=pixels[i]/255,grain=(Math.sin(x*19.17+y*73.3)*43758.54)%1;
  print.fillStyle='rgb('+[148,167,191].map(v=>Math.round(v*(.56+.52*light)+grain*11)).join(',')+')';
  print.fillRect(x+grain*.5,y,.42+2.61*light,.65+2.45*light);
 }
}
})();

/* ============================================================
   520 Story — Animation Film Player
   Single canvas · Timeline-driven · Fade transitions
   ============================================================ */

/* ---------- Utility ---------- */
function roundRect(ctx,x,y,w,h,r){
  ctx.beginPath();ctx.moveTo(x+r,y);ctx.lineTo(x+w-r,y);
  ctx.quadraticCurveTo(x+w,y,x+w,y+r);ctx.lineTo(x+w,y+h-r);
  ctx.quadraticCurveTo(x+w,y+h,x+w-r,y+h);ctx.lineTo(x+r,y+h);
  ctx.quadraticCurveTo(x,y+h,x,y+h-r);ctx.lineTo(x,y+r);
  ctx.quadraticCurveTo(x,y,x+r,y);ctx.closePath();
}

function drawBubble(ctx,x,y,text,opts){
  opts=opts||{};
  var fs=Math.max(13,Math.min(W*.038,18));
  var font=opts.font||(fs+'px "PingFang SC",sans-serif');
  var color=opts.color||'rgba(60,40,30,.9)';
  var bg=opts.bg||'rgba(255,255,255,.88)';
  var border=opts.border||'rgba(160,120,80,.4)';
  var thought=opts.thought||false;
  var alpha=opts.alpha===undefined?1:opts.alpha;
  ctx.save();ctx.globalAlpha*=alpha;
  ctx.font=font;var tw=ctx.measureText(text).width;
  var pw=tw+20,ph=fs+12,px=x-pw/2,py=y-ph;
  // shadow
  ctx.shadowColor='rgba(0,0,0,.15)';ctx.shadowBlur=8;ctx.shadowOffsetY=2;
  if(thought){
    ctx.setLineDash([4,4]);ctx.strokeStyle=border;ctx.lineWidth=1;
    roundRect(ctx,px,py,pw,ph,ph/2);ctx.fillStyle=bg;ctx.fill();ctx.stroke();ctx.setLineDash([]);
    ctx.shadowBlur=0;
    ctx.fillStyle=bg;
    ctx.beginPath();ctx.arc(x-4,y+3,3,0,6.28);ctx.fill();
    ctx.beginPath();ctx.arc(x-1,y+8,2,0,6.28);ctx.fill();
  }else{
    roundRect(ctx,px,py,pw,ph,ph/2);ctx.fillStyle=bg;ctx.fill();
    ctx.strokeStyle=border;ctx.lineWidth=.8;ctx.stroke();
    ctx.shadowBlur=0;
    ctx.fillStyle=bg;
    ctx.beginPath();ctx.moveTo(x-4,y);ctx.lineTo(x,y+7);ctx.lineTo(x+4,y);ctx.fill();
  }
  ctx.shadowBlur=0;ctx.shadowColor='transparent';
  ctx.fillStyle=color;ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(text,x,py+ph/2);
  ctx.restore();
}

/* ---------- Responsive font helper ---------- */
function sf(base){ return Math.max(base, Math.min(W*base/375, base*2.2)); }
// sf(12) on 375px screen = 12px, on 750px = 24px, capped at 26px

/* ---------- Characters ---------- */

function drawBoy(ctx,x,y,t,walk,alpha){
  var a=alpha===undefined?1:alpha;
  ctx.save();ctx.globalAlpha*=a;
  var bob=walk?Math.sin(t*3)*1.5:0,legSwing=walk?Math.sin(t*4)*3.5:0,armSwing=walk?Math.sin(t*4)*.25:0;
  var hairBlow=Math.sin(t*2)*.8+(walk?Math.sin(t*3.5)*1.2:0);
  var feetY=y,headCY=feetY-35+bob;
  ctx.fillStyle='#f0f0f0';
  ctx.beginPath();ctx.ellipse(x-4-legSwing,feetY-2,4,2.2,0,0,Math.PI*2);ctx.fill();
  ctx.beginPath();ctx.ellipse(x+4+legSwing,feetY-2,4,2.2,0,0,Math.PI*2);ctx.fill();
  ctx.strokeStyle='#bbb';ctx.lineWidth=.5;
  ctx.beginPath();ctx.ellipse(x-4-legSwing,feetY-1,3.8,1,0,0,Math.PI);ctx.stroke();
  ctx.beginPath();ctx.ellipse(x+4+legSwing,feetY-1,3.8,1,0,0,Math.PI);ctx.stroke();
  ctx.fillStyle='#2a3050';ctx.lineWidth=3.8;ctx.lineCap='round';ctx.strokeStyle='#2a3050';
  ctx.beginPath();ctx.moveTo(x-3,headCY+18+bob);ctx.lineTo(x-4-legSwing,feetY-4);ctx.stroke();
  ctx.beginPath();ctx.moveTo(x+3,headCY+18+bob);ctx.lineTo(x+4+legSwing,feetY-4);ctx.stroke();
  ctx.fillStyle='#4a6ab5';ctx.beginPath();
  ctx.moveTo(x-9,headCY+5);ctx.quadraticCurveTo(x-10,headCY+12,x-8,headCY+19+bob);
  ctx.lineTo(x+8,headCY+19+bob);ctx.quadraticCurveTo(x+10,headCY+12,x+9,headCY+5);ctx.closePath();ctx.fill();
  ctx.strokeStyle='rgba(255,255,255,.15)';ctx.lineWidth=.6;
  ctx.beginPath();ctx.moveTo(x,headCY+6);ctx.lineTo(x,headCY+18+bob);ctx.stroke();
  ctx.fillStyle='#3d5a9e';ctx.beginPath();
  ctx.moveTo(x-6,headCY+14+bob);ctx.lineTo(x+6,headCY+14+bob);ctx.lineTo(x+5,headCY+17+bob);ctx.lineTo(x-5,headCY+17+bob);ctx.closePath();ctx.fill();
  ctx.strokeStyle='rgba(255,255,255,.1)';ctx.lineWidth=.4;
  ctx.beginPath();ctx.moveTo(x-5,headCY+14+bob);ctx.lineTo(x+5,headCY+14+bob);ctx.stroke();
  ctx.strokeStyle='#3a5a9e';ctx.lineWidth=.8;
  ctx.beginPath();ctx.moveTo(x-3,headCY+5);ctx.lineTo(x,headCY+8);ctx.lineTo(x+3,headCY+5);ctx.stroke();
  ctx.save();ctx.translate(x-9,headCY+7);ctx.rotate(-.15+armSwing);
  ctx.fillStyle='#4a6ab5';ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(-2,9);ctx.lineTo(2,9);ctx.lineTo(3,0);ctx.closePath();ctx.fill();
  ctx.fillStyle='#fce4c8';ctx.beginPath();ctx.arc(0,11,2.2,0,Math.PI*2);ctx.fill();ctx.restore();
  ctx.save();ctx.translate(x+9,headCY+7);ctx.rotate(.15-armSwing);
  ctx.fillStyle='#4a6ab5';ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(-2,9);ctx.lineTo(2,9);ctx.lineTo(3,0);ctx.closePath();ctx.fill();
  ctx.fillStyle='#fce4c8';ctx.beginPath();ctx.arc(0,11,2.2,0,Math.PI*2);ctx.fill();ctx.restore();
  ctx.fillStyle='#fce4c8';ctx.fillRect(x-2,headCY+2,4,4);
  ctx.fillStyle='#fce4c8';ctx.beginPath();ctx.ellipse(x,headCY,7,7.5,0,0,Math.PI*2);ctx.fill();
  ctx.fillStyle='#1e2d5a';ctx.beginPath();
  ctx.moveTo(x-8,headCY+1);ctx.quadraticCurveTo(x-9,headCY-6,x-5,headCY-10+hairBlow*.3);
  ctx.quadraticCurveTo(x-1,headCY-13,x+1,headCY-12.5+hairBlow*.2);
  ctx.quadraticCurveTo(x+5,headCY-13,x+7,headCY-9+hairBlow*.4);
  ctx.quadraticCurveTo(x+9,headCY-5,x+8,headCY+1);ctx.closePath();ctx.fill();
  ctx.fillStyle='#243468';ctx.beginPath();
  ctx.moveTo(x-7,headCY-2);ctx.quadraticCurveTo(x-5,headCY-7,x-3,headCY-5+hairBlow*.2);
  ctx.quadraticCurveTo(x-1,headCY-8,x+1,headCY-6);ctx.quadraticCurveTo(x+3,headCY-9,x+5,headCY-4+hairBlow*.3);
  ctx.quadraticCurveTo(x+7,headCY-6,x+7,headCY-1);ctx.lineTo(x+6,headCY-1);
  ctx.quadraticCurveTo(x+3,headCY-5,x+1,headCY-4);ctx.quadraticCurveTo(x-2,headCY-6,x-4,headCY-3);
  ctx.lineTo(x-6,headCY-1);ctx.closePath();ctx.fill();
  ctx.strokeStyle='rgba(100,140,220,.25)';ctx.lineWidth=.5;
  ctx.beginPath();ctx.moveTo(x-3,headCY-9);ctx.quadraticCurveTo(x-1,headCY-11,x+2,headCY-10);ctx.stroke();
  ctx.fillStyle='#4a6ab5';ctx.beginPath();
  ctx.moveTo(x-5,headCY+4);ctx.quadraticCurveTo(x-8,headCY+2,x-7,headCY+8);
  ctx.lineTo(x+7,headCY+8);ctx.quadraticCurveTo(x+8,headCY+2,x+5,headCY+4);ctx.closePath();ctx.fill();
  ctx.fillStyle='#1a1a3a';ctx.beginPath();ctx.ellipse(x-3,headCY+.5,1.6,2.2,0,0,Math.PI*2);ctx.fill();
  ctx.fillStyle='#2a4a8a';ctx.beginPath();ctx.ellipse(x-3,headCY+.8,1.1,1.5,0,0,Math.PI*2);ctx.fill();
  ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(x-2.3,headCY-.2,.7,0,Math.PI*2);ctx.fill();
  ctx.beginPath();ctx.arc(x-3.3,headCY+1.5,.35,0,Math.PI*2);ctx.fill();
  ctx.fillStyle='#1a1a3a';ctx.beginPath();ctx.ellipse(x+3,headCY+.5,1.6,2.2,0,0,Math.PI*2);ctx.fill();
  ctx.fillStyle='#2a4a8a';ctx.beginPath();ctx.ellipse(x+3,headCY+.8,1.1,1.5,0,0,Math.PI*2);ctx.fill();
  ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(x+3.7,headCY-.2,.7,0,Math.PI*2);ctx.fill();
  ctx.beginPath();ctx.arc(x+2.7,headCY+1.5,.35,0,Math.PI*2);ctx.fill();
  ctx.fillStyle='rgba(220,180,160,.5)';ctx.beginPath();ctx.arc(x,headCY+2.5,.6,0,Math.PI*2);ctx.fill();
  ctx.strokeStyle='#c49080';ctx.lineWidth=.7;ctx.lineCap='round';
  ctx.beginPath();ctx.moveTo(x-1.8,headCY+4);ctx.quadraticCurveTo(x,headCY+5.5,x+1.8,headCY+4);ctx.stroke();
  ctx.restore();
}

function drawGirl(ctx,x,y,t,walk,alpha){
  var a=alpha===undefined?1:alpha;
  ctx.save();ctx.globalAlpha*=a;
  var bob=walk?Math.sin(t*3)*1.5:0,legSwing=walk?Math.sin(t*4)*2.8:0,armSwing=walk?Math.sin(t*4)*.2:0;
  var skirtSway=walk?Math.sin(t*3.5)*2:Math.sin(t*.8)*.5;
  var tailSwing=Math.sin(t*2.2)*4+(walk?Math.sin(t*3)*2:0);
  var hairBlow=Math.sin(t*1.8)*1+(walk?Math.sin(t*2.5)*1.5:0);
  var feetY=y,headCY=feetY-35+bob,shoeY=feetY-1.5;
  ctx.fillStyle='#d45070';
  ctx.beginPath();ctx.ellipse(x-3.5-legSwing,shoeY,3.5,2,0,0,Math.PI*2);ctx.fill();
  ctx.beginPath();ctx.ellipse(x+3.5+legSwing,shoeY,3.5,2,0,0,Math.PI*2);ctx.fill();
  ctx.strokeStyle='#c04060';ctx.lineWidth=.4;
  ctx.beginPath();ctx.ellipse(x-3.5-legSwing,shoeY-.5,2.5,1,0,Math.PI,0);ctx.stroke();
  ctx.beginPath();ctx.ellipse(x+3.5+legSwing,shoeY-.5,2.5,1,0,Math.PI,0);ctx.stroke();
  ctx.strokeStyle='#fce4c8';ctx.lineWidth=2.8;ctx.lineCap='round';
  ctx.beginPath();ctx.moveTo(x-3,headCY+22+bob);ctx.lineTo(x-3.5-legSwing,shoeY-2);ctx.stroke();
  ctx.beginPath();ctx.moveTo(x+3,headCY+22+bob);ctx.lineTo(x+3.5+legSwing,shoeY-2);ctx.stroke();
  var skirtTop=headCY+12+bob,skirtBot=headCY+24+bob;
  ctx.fillStyle='#ff9cb8';ctx.beginPath();
  ctx.moveTo(x-6,skirtTop);ctx.quadraticCurveTo(x-11-skirtSway,skirtBot-3,x-10-skirtSway,skirtBot);
  ctx.lineTo(x+10+skirtSway,skirtBot);ctx.quadraticCurveTo(x+11+skirtSway,skirtBot-3,x+6,skirtTop);
  ctx.closePath();ctx.fill();
  ctx.strokeStyle='rgba(200,80,120,.2)';ctx.lineWidth=.5;
  for(var i=-4;i<=4;i+=2.5){ctx.beginPath();ctx.moveTo(x+i,skirtTop+2);ctx.lineTo(x+i*1.4+skirtSway*.3,skirtBot-1);ctx.stroke();}
  ctx.strokeStyle='rgba(255,255,255,.35)';ctx.lineWidth=.7;ctx.beginPath();
  for(var i=-9;i<=8;i+=3){var sx2=x+i+skirtSway*((i>0)?.3:-.3);ctx.moveTo(sx2,skirtBot);ctx.lineTo(sx2+1.5,skirtBot+1.5);ctx.lineTo(sx2+3,skirtBot);}
  ctx.stroke();
  ctx.fillStyle='#ffb3c6';ctx.beginPath();
  ctx.moveTo(x-7,headCY+5);ctx.quadraticCurveTo(x-8,headCY+10,x-6,skirtTop);
  ctx.lineTo(x+6,skirtTop);ctx.quadraticCurveTo(x+8,headCY+10,x+7,headCY+5);ctx.closePath();ctx.fill();
  ctx.strokeStyle='#e8a0b0';ctx.lineWidth=.6;
  ctx.beginPath();ctx.moveTo(x-3,headCY+4.5);ctx.lineTo(x,headCY+7);ctx.lineTo(x+3,headCY+4.5);ctx.stroke();
  ctx.fillStyle='#ffd0dd';ctx.beginPath();
  ctx.moveTo(x-4,headCY+4);ctx.lineTo(x-1,headCY+6);ctx.lineTo(x,headCY+5);ctx.lineTo(x+1,headCY+6);ctx.lineTo(x+4,headCY+4);
  ctx.quadraticCurveTo(x+2,headCY+3,x,headCY+3.5);ctx.quadraticCurveTo(x-2,headCY+3,x-4,headCY+4);ctx.closePath();ctx.fill();
  ctx.save();ctx.translate(x-7,headCY+6);ctx.rotate(-.12+armSwing);
  ctx.fillStyle='#ffb3c6';ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(-1.5,8);ctx.lineTo(1.5,8);ctx.lineTo(2.5,0);ctx.closePath();ctx.fill();
  ctx.fillStyle='#fce4c8';ctx.beginPath();ctx.arc(0,10,2,0,Math.PI*2);ctx.fill();ctx.restore();
  ctx.save();ctx.translate(x+7,headCY+6);ctx.rotate(.12-armSwing);
  ctx.fillStyle='#ffb3c6';ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(-1.5,8);ctx.lineTo(1.5,8);ctx.lineTo(2.5,0);ctx.closePath();ctx.fill();
  ctx.fillStyle='#fce4c8';ctx.beginPath();ctx.arc(0,10,2,0,Math.PI*2);ctx.fill();ctx.restore();
  ctx.fillStyle='#fce4c8';ctx.fillRect(x-1.5,headCY+2,3,3.5);
  ctx.fillStyle='#5a3828';ctx.beginPath();
  ctx.moveTo(x-7,headCY-2);ctx.quadraticCurveTo(x-9,headCY+5,x-7,headCY+14+hairBlow*.5);
  ctx.lineTo(x-5,headCY+14+hairBlow*.3);ctx.quadraticCurveTo(x-7,headCY+4,x-6,headCY-1);ctx.closePath();ctx.fill();
  ctx.beginPath();ctx.moveTo(x+6,headCY);ctx.quadraticCurveTo(x+8,headCY+4,x+6,headCY+10+hairBlow*.4);
  ctx.lineTo(x+5,headCY+10+hairBlow*.2);ctx.quadraticCurveTo(x+7,headCY+3,x+5,headCY+1);ctx.closePath();ctx.fill();
  ctx.fillStyle='#fce4c8';ctx.beginPath();ctx.ellipse(x,headCY,6.5,7,0,0,Math.PI*2);ctx.fill();
  ctx.fillStyle='rgba(255,140,150,.3)';
  ctx.beginPath();ctx.ellipse(x-4.5,headCY+3,2,1.2,0,0,Math.PI*2);ctx.fill();
  ctx.beginPath();ctx.ellipse(x+4.5,headCY+3,2,1.2,0,0,Math.PI*2);ctx.fill();
  ctx.fillStyle='#5a3828';ctx.beginPath();
  ctx.moveTo(x-7.5,headCY+1);ctx.quadraticCurveTo(x-9,headCY-5,x-5,headCY-10+hairBlow*.2);
  ctx.quadraticCurveTo(x-2,headCY-13,x,headCY-12);ctx.quadraticCurveTo(x+3,headCY-13,x+6,headCY-9+hairBlow*.3);
  ctx.quadraticCurveTo(x+8.5,headCY-4,x+7.5,headCY+1);ctx.closePath();ctx.fill();
  ctx.fillStyle='#6a4232';ctx.beginPath();
  ctx.moveTo(x-7,headCY-1);ctx.quadraticCurveTo(x-5,headCY-6,x-3,headCY-4+hairBlow*.15);
  ctx.quadraticCurveTo(x-1,headCY-7,x+1,headCY-5);ctx.quadraticCurveTo(x+3,headCY-7.5,x+5,headCY-3+hairBlow*.2);
  ctx.lineTo(x+6,headCY-1);ctx.lineTo(x+5,headCY-.5);
  ctx.quadraticCurveTo(x+3,headCY-4,x+1,headCY-3);ctx.quadraticCurveTo(x-1,headCY-5,x-3,headCY-2);
  ctx.lineTo(x-6,headCY);ctx.closePath();ctx.fill();
  ctx.strokeStyle='rgba(180,140,100,.2)';ctx.lineWidth=.5;
  ctx.beginPath();ctx.moveTo(x-2,headCY-9);ctx.quadraticCurveTo(x,headCY-11,x+3,headCY-9.5);ctx.stroke();
  ctx.strokeStyle='#5a3828';ctx.lineWidth=4;ctx.lineCap='round';
  ctx.beginPath();ctx.moveTo(x+6,headCY-3);
  ctx.quadraticCurveTo(x+14+tailSwing*.7,headCY+2+tailSwing*.2,x+12+tailSwing,headCY+15);ctx.stroke();
  ctx.lineWidth=2.5;ctx.beginPath();ctx.moveTo(x+12+tailSwing,headCY+15);
  ctx.quadraticCurveTo(x+13+tailSwing*1.2,headCY+18,x+11+tailSwing*1.1,headCY+20);ctx.stroke();
  ctx.fillStyle='#ff8fab';ctx.beginPath();ctx.arc(x+6,headCY-4,1.5,0,Math.PI*2);ctx.fill();
  ctx.beginPath();ctx.moveTo(x+6,headCY-4);ctx.quadraticCurveTo(x+3,headCY-7,x+4.5,headCY-4);ctx.closePath();ctx.fill();
  ctx.beginPath();ctx.moveTo(x+6,headCY-4);ctx.quadraticCurveTo(x+9,headCY-7.5,x+7.5,headCY-4);ctx.closePath();ctx.fill();
  ctx.strokeStyle='#ff8fab';ctx.lineWidth=.8;
  ctx.beginPath();ctx.moveTo(x+5.5,headCY-3);ctx.lineTo(x+4.5,headCY-.5);ctx.stroke();
  ctx.beginPath();ctx.moveTo(x+6.5,headCY-3);ctx.lineTo(x+7,headCY-.5);ctx.stroke();
  ctx.fillStyle='#1a1a3a';ctx.beginPath();ctx.ellipse(x-2.8,headCY+.5,1.8,2.5,0,0,Math.PI*2);ctx.fill();
  ctx.fillStyle='#6a3828';ctx.beginPath();ctx.ellipse(x-2.8,headCY+.8,1.2,1.7,0,0,Math.PI*2);ctx.fill();
  ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(x-2,headCY-.3,.8,0,Math.PI*2);ctx.fill();
  ctx.beginPath();ctx.arc(x-3.2,headCY+1.6,.4,0,Math.PI*2);ctx.fill();
  ctx.strokeStyle='#1a1a3a';ctx.lineWidth=.6;
  ctx.beginPath();ctx.moveTo(x-4.2,headCY-1.2);ctx.lineTo(x-1.5,headCY-1.5);ctx.stroke();
  ctx.beginPath();ctx.moveTo(x-4.5,headCY-.5);ctx.lineTo(x-4.2,headCY-1.2);ctx.stroke();
  ctx.fillStyle='#1a1a3a';ctx.beginPath();ctx.ellipse(x+2.8,headCY+.5,1.8,2.5,0,0,Math.PI*2);ctx.fill();
  ctx.fillStyle='#6a3828';ctx.beginPath();ctx.ellipse(x+2.8,headCY+.8,1.2,1.7,0,0,Math.PI*2);ctx.fill();
  ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(x+3.6,headCY-.3,.8,0,Math.PI*2);ctx.fill();
  ctx.beginPath();ctx.arc(x+2.4,headCY+1.6,.4,0,Math.PI*2);ctx.fill();
  ctx.strokeStyle='#1a1a3a';ctx.lineWidth=.6;
  ctx.beginPath();ctx.moveTo(x+1.5,headCY-1.5);ctx.lineTo(x+4.2,headCY-1.2);ctx.stroke();
  ctx.beginPath();ctx.moveTo(x+4.2,headCY-1.2);ctx.lineTo(x+4.5,headCY-.5);ctx.stroke();
  ctx.fillStyle='rgba(220,180,160,.4)';ctx.beginPath();ctx.arc(x,headCY+2.8,.5,0,Math.PI*2);ctx.fill();
  ctx.strokeStyle='#d4847a';ctx.lineWidth=.6;ctx.lineCap='round';
  ctx.beginPath();ctx.moveTo(x-1.5,headCY+4.2);ctx.quadraticCurveTo(x,headCY+5.5,x+1.5,headCY+4.2);ctx.stroke();
  ctx.restore();
}

function drawBystander(ctx,x,y,t,walk,alpha){
  var a=alpha||.4;
  ctx.save();ctx.globalAlpha*=a;
  var b=walk?Math.sin(t*3)*1.2:0,l=walk?Math.sin(t*4)*3:0;
  var headY=y-22+b;
  ctx.fillStyle='#8890a8';ctx.beginPath();ctx.arc(x,headY,5,0,6.28);ctx.fill();
  ctx.strokeStyle='#7880a0';ctx.lineWidth=2;ctx.lineCap='round';
  ctx.beginPath();ctx.moveTo(x,headY+5);ctx.lineTo(x,headY+18+b);ctx.stroke();
  ctx.beginPath();ctx.moveTo(x-6,headY+10);ctx.lineTo(x+6,headY+10);ctx.stroke();
  ctx.beginPath();ctx.moveTo(x,headY+18+b);ctx.lineTo(x-3-l,headY+27);ctx.stroke();
  ctx.beginPath();ctx.moveTo(x,headY+18+b);ctx.lineTo(x+3+l,headY+27);ctx.stroke();
  ctx.restore();
}

/* ============================================================
   SCENE DEFINITIONS
   ============================================================ */
var SCENES=[
  {id:'prologue',  label:'序章',               chapter:0, dur:5},
  {id:'primary',   label:'第一章 · 小学',      chapter:1, dur:10},
  {id:'middle',    label:'第一章 · 初中',      chapter:1, dur:10},
  {id:'high',      label:'第一章 · 高中',      chapter:1, dur:10},
  {id:'mountain',  label:'第一章 · 毕业徒步',  chapter:1, dur:12},
  {id:'burst',     label:'第一章 · 从此不再平行', chapter:1, dur:4},
  {id:'summer',    label:'第二章 · 暑假群聊',  chapter:2, dur:10},
  {id:'parting',   label:'第二章 · 分别',      chapter:2, dur:10},
  {id:'typing',    label:'第二章 · 反复措辞',  chapter:2, dur:12},
  {id:'waiting',   label:'第二章 · 等待回复',  chapter:2, dur:10},
  {id:'reunion',   label:'第二章 · 一年后',    chapter:2, dur:10},
  {id:'ending',    label:'第三章 · 即将揭开',  chapter:3, dur:5}
];


/* ============================================================
   PLAYER ENGINE + ALL SCENE RENDER FUNCTIONS
   ============================================================ */

var FADE_DUR=1; // seconds
var totalDur=0;
for(var i=0;i<SCENES.length;i++) totalDur+=SCENES[i].dur;

// precompute start times
var sceneStarts=[];
var acc=0;
for(var i=0;i<SCENES.length;i++){sceneStarts.push(acc);acc+=SCENES[i].dur;}

// Background stars (persistent)
// Scene background helper — each scene draws its own bg
function drawSceneBg(ctx,W,H,id,t){
  switch(id){
    case 'prologue':
      // soft warm gradient (dawn)
      var g=ctx.createLinearGradient(0,0,0,H);
      g.addColorStop(0,'#1a1230');g.addColorStop(.4,'#2d1f4e');g.addColorStop(.7,'#6b3a6e');g.addColorStop(1,'#c47a5a');
      ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
      break;
    case 'primary':
      // sunny morning — blue sky + warm
      var g=ctx.createLinearGradient(0,0,0,H);
      g.addColorStop(0,'#87CEEB');g.addColorStop(.35,'#B0E0F0');g.addColorStop(.65,'#F0E6D0');g.addColorStop(1,'#E8D5B8');
      ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
      // sun
      ctx.beginPath();ctx.arc(W*.82,H*.12,22,0,6.28);ctx.fillStyle='rgba(255,230,120,.7)';ctx.fill();
      var sg=ctx.createRadialGradient(W*.82,H*.12,22,W*.82,H*.12,60);sg.addColorStop(0,'rgba(255,230,120,.2)');sg.addColorStop(1,'transparent');ctx.fillStyle=sg;ctx.fillRect(W*.5,0,W*.5,H*.4);
      // clouds
      for(var i=0;i<3;i++){var cx=W*(.15+i*.3)+Math.sin(t*.3+i)*8,cy=H*(.08+i*.04);ctx.fillStyle='rgba(255,255,255,.5)';ctx.beginPath();ctx.arc(cx,cy,12,0,6.28);ctx.arc(cx+14,cy-3,10,0,6.28);ctx.arc(cx+8,cy-8,9,0,6.28);ctx.fill();}
      break;
    case 'middle':
      // late afternoon — warm orange
      var g=ctx.createLinearGradient(0,0,0,H);
      g.addColorStop(0,'#4a6fa5');g.addColorStop(.4,'#d4956a');g.addColorStop(.7,'#e8b87a');g.addColorStop(1,'#c2956e');
      ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
      // setting sun
      ctx.beginPath();ctx.arc(W*.85,H*.35,18,0,6.28);ctx.fillStyle='rgba(255,160,80,.6)';ctx.fill();
      break;
    case 'high':
      // dusk — purple orange
      var g=ctx.createLinearGradient(0,0,0,H);
      g.addColorStop(0,'#2c2248');g.addColorStop(.3,'#5c3d6e');g.addColorStop(.6,'#c4705a');g.addColorStop(1,'#e8a870');
      ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
      break;
    case 'mountain':
      // sunrise hike — bright warm
      var g=ctx.createLinearGradient(0,0,0,H);
      g.addColorStop(0,'#fad4a0');g.addColorStop(.25,'#f0a868');g.addColorStop(.5,'#d4e8b0');g.addColorStop(1,'#8cbe78');
      ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
      // rising sun
      ctx.beginPath();ctx.arc(W*.5,H*.18,28,0,6.28);ctx.fillStyle='rgba(255,220,100,.65)';ctx.fill();
      var rg=ctx.createRadialGradient(W*.5,H*.18,28,W*.5,H*.18,80);rg.addColorStop(0,'rgba(255,220,100,.15)');rg.addColorStop(1,'transparent');ctx.fillStyle=rg;ctx.fillRect(0,0,W,H*.6);
      break;
    case 'burst':
      // warm gold
      var g=ctx.createRadialGradient(W/2,H/2,10,W/2,H/2,W*.5);
      g.addColorStop(0,'#fff5e0');g.addColorStop(.5,'#ffd68a');g.addColorStop(1,'#c47a3a');
      ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
      break;
    case 'summer':
      // summer afternoon — bright
      var g=ctx.createLinearGradient(0,0,0,H);
      g.addColorStop(0,'#5bbce8');g.addColorStop(.5,'#88d4f0');g.addColorStop(1,'#f0e8d0');
      ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
      break;
    case 'parting':
      // autumn dusk at train station
      var g=ctx.createLinearGradient(0,0,0,H);
      g.addColorStop(0,'#4a3858');g.addColorStop(.35,'#a06048');g.addColorStop(.6,'#d4956a');g.addColorStop(1,'#8a6850');
      ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
      break;
    case 'typing':
      // late night — dark blue room
      var g=ctx.createLinearGradient(0,0,0,H);
      g.addColorStop(0,'#0c0c20');g.addColorStop(.6,'#141428');g.addColorStop(1,'#1e1a30');
      ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
      break;
    case 'waiting':
      // quiet evening — soft indigo
      var g=ctx.createLinearGradient(0,0,0,H);
      g.addColorStop(0,'#1a1838');g.addColorStop(.5,'#2a2850');g.addColorStop(1,'#3a3060');
      ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
      break;
    case 'reunion':
      // night campus — dark blue with city lights
      var g=ctx.createLinearGradient(0,0,0,H);
      g.addColorStop(0,'#0e1028');g.addColorStop(.4,'#1a1e3e');g.addColorStop(1,'#222840');
      ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
      // stars (sparse)
      for(var i=0;i<20;i++){var sx=Math.sin(i*7.3+.5)*W*.45+W*.5,sy=Math.sin(i*3.1+1.2)*H*.2+H*.08;ctx.fillStyle='rgba(200,210,255,'+(0.2+Math.sin(t+i)*.1)+')';ctx.beginPath();ctx.arc(sx,sy,1,0,6.28);ctx.fill();}
      break;
    case 'ending':
      // warm fade
      var g=ctx.createLinearGradient(0,0,0,H);
      g.addColorStop(0,'#1a1230');g.addColorStop(.5,'#3a2848');g.addColorStop(1,'#5a3860');
      ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
      break;
  }
}

// State
var canvas,ctx,W,H;
var globalTime=0;
var paused=false;
var lastFrame=0;

function resize(){
  canvas=document.getElementById('main-canvas');
  var dpr=Math.min(window.devicePixelRatio||1,2);
  W=window.innerWidth;H=window.innerHeight;
  canvas.width=W*dpr;canvas.height=H*dpr;
  canvas.style.width=W+'px';canvas.style.height=H+'px';
  ctx=canvas.getContext('2d');
  ctx.scale(dpr,dpr);
  // no bgStars needed
}

// Get current scene index + local progress
function getSceneAt(gt){
  for(var i=SCENES.length-1;i>=0;i--){
    if(gt>=sceneStarts[i]) return {idx:i, local:gt-sceneStarts[i], progress:(gt-sceneStarts[i])/SCENES[i].dur};
  }
  return {idx:0,local:0,progress:0};
}

// Scene renderers map
var renderers={
  prologue: renderPrologue,
  primary: renderPrimary,
  middle: renderMiddle,
  high: renderHigh,
  mountain: renderMountain,
  burst: renderBurst,
  summer: renderSummer,
  parting: renderParting,
  typing: renderTyping,
  waiting: renderWaiting,
  reunion: renderReunion,
  ending: renderEnding
};

// Main loop
function mainLoop(ts){
  try{
  if(!lastFrame) lastFrame=ts;
  var dt=(ts-lastFrame)/1000;
  if(dt>0.5) dt=0.016; // cap huge jumps
  lastFrame=ts;
  if(!paused) globalTime+=dt;
  if(globalTime>totalDur) globalTime=totalDur-.01;

  ctx.clearRect(0,0,W,H);

  var sc=getSceneAt(globalTime);
  var scene=SCENES[sc.idx];
  var localT=sc.local;
  var prog=sc.progress;

  // Scene-specific background (replaces starfield)
  var scene0=SCENES[sc.idx];
  drawSceneBg(ctx,W,H,scene0.id,globalTime);

  var fadeIn=Math.min(1,localT/FADE_DUR);
  var fadeOut=Math.min(1,(scene.dur-localT)/FADE_DUR);
  var alpha=Math.min(fadeIn,fadeOut);

  ctx.save();
  ctx.globalAlpha=alpha;
  var fn=renderers[scene.id];
  if(fn) fn(ctx,W,H,localT,prog);
  ctx.restore();

  var pFill=document.getElementById('progress-fill');
  if(pFill) pFill.style.width=(globalTime/totalDur*100)+'%';
  var sTitle=document.getElementById('scene-title');
  if(sTitle) sTitle.textContent=scene.label;
  }catch(e){console.error('mainLoop error:',e);}
  requestAnimationFrame(mainLoop);
}

// Click to pause/resume
function togglePause(){
  paused=!paused;
  var icon=document.getElementById('pause-icon');
  if(paused){icon.textContent='❚❚';icon.classList.add('show');}
  else{icon.textContent='▶';icon.classList.add('show');setTimeout(function(){icon.classList.remove('show');},600);}
}

// Init
window.addEventListener('resize',resize);

function startAnimation(){
  var ss=document.getElementById('start-screen');
  if(ss) ss.style.display='none';
  document.getElementById('main-canvas').style.display='block';
  document.getElementById('controls').style.display='block';
  resize();
  requestAnimationFrame(mainLoop);
}

// Start screen click
var ss=document.getElementById('start-screen');
if(ss){
  ss.addEventListener('click',startAnimation);
  ss.addEventListener('touchend',function(e){e.preventDefault();startAnimation();});
}
document.getElementById('main-canvas').addEventListener('click',togglePause);
document.getElementById('main-canvas').addEventListener('touchend',function(e){e.preventDefault();togglePause();});

/* ============================================================
   SCENE RENDER FUNCTIONS
   Each: function(ctx, W, H, t, progress)
   t = local time in scene (seconds)
   progress = 0→1
   ============================================================ */

// Helper: centered text
function drawCenterText(ctx,W,H,text,opts){
  opts=opts||{};
  ctx.save();
  var defSize=Math.max(18,Math.min(W*.065,32));
  ctx.fillStyle=opts.color||'rgba(255,240,230,.9)';
  ctx.font=opts.font||(defSize+'px "PingFang SC","Hiragino Sans GB","Microsoft YaHei",sans-serif');
  ctx.textAlign='center';ctx.textBaseline='middle';
  // text shadow for readability
  ctx.shadowColor='rgba(0,0,0,.3)';ctx.shadowBlur=6;ctx.shadowOffsetY=2;
  var lines=text.split('\n');
  var lh=opts.lineHeight||Math.max(36,defSize*1.8);
  var startY=H/2-(lines.length-1)*lh/2;
  for(var i=0;i<lines.length;i++){
    ctx.fillText(lines[i],W/2,startY+i*lh);
  }
  ctx.shadowBlur=0;ctx.shadowColor='transparent';
  ctx.restore();
}

/* ----- 序章 ----- */
function renderPrologue(ctx,W,H,t,p){
  var a=t<1?t:t>4?5-t:1;
  drawCenterText(ctx,W,H,'有些人，走了很远的路\n才发现一直在彼此身边',{color:'rgba(255,240,230,'+Math.max(0,a)+')',lineHeight:45});
}

/* ----- 小学 ----- */
function renderPrimary(ctx,W,H,t,p){
  var bY=H*.42;
  // 建筑 — warm beige school
  ctx.fillStyle='#d4c4a8';ctx.fillRect(W*.08,bY,W*.35,H*.42);ctx.fillRect(W*.57,bY,W*.35,H*.42);
  // rooftops
  ctx.fillStyle='#b8543a';
  ctx.beginPath();ctx.moveTo(W*.05,bY);ctx.lineTo(W*.255,bY-22);ctx.lineTo(W*.46,bY);ctx.fill();
  ctx.beginPath();ctx.moveTo(W*.54,bY);ctx.lineTo(W*.745,bY-22);ctx.lineTo(W*.95,bY);ctx.fill();
  // windows
  var wc='rgba(135,206,235,'+(0.4+Math.sin(t*1.5)*.15)+')';ctx.fillStyle=wc;
  for(var i=0;i<3;i++){ctx.fillRect(W*.12+i*W*.09,bY+H*.07,W*.055,H*.08);ctx.fillRect(W*.12+i*W*.09,bY+H*.2,W*.055,H*.08);}
  for(var i=0;i<3;i++){ctx.fillRect(W*.61+i*W*.09,bY+H*.07,W*.055,H*.08);ctx.fillRect(W*.61+i*W*.09,bY+H*.2,W*.055,H*.08);}
  // labels
  ctx.fillStyle='rgba(100,60,30,.7)';ctx.font=sf(15)+'px sans-serif';ctx.textAlign='center';
  ctx.fillText('1 班',W*.255,bY-28);ctx.fillText('2 班',W*.745,bY-28);
  // divider
  ctx.setLineDash([4,4]);ctx.strokeStyle='rgba(100,80,60,.2)';ctx.beginPath();ctx.moveTo(W*.5,bY);ctx.lineTo(W*.5,bY+H*.42);ctx.stroke();ctx.setLineDash([]);
  // ground
  ctx.fillStyle='#c8b898';ctx.fillRect(0,bY+H*.42,W,H);
  // 角色
  drawBoy(ctx,W*.255,bY+H*.3,t,false);
  drawGirl(ctx,W*.745,bY+H*.3,t+1,false);
  // 对话气泡
  if(t>2&&t<8){
    var ba=Math.min(1,(t-2)*.5)*Math.min(1,(8-t));
    drawBubble(ctx,W*.745,bY+H*.1,'那个男生好厉害…',{thought:true,alpha:ba,bg:'rgba(255,180,200,.12)',border:'rgba(255,180,200,.25)',color:'rgba(255,200,220,.8)'});
  }
}

/* ----- 初中 ----- */
function renderMiddle(ctx,W,H,t,p){
  var gY=H*.65;
  // street lamps (warm)
  for(var i=0;i<3;i++){var lx=W*.2+i*W*.3;ctx.strokeStyle='rgba(100,80,60,.5)';ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(lx,gY);ctx.lineTo(lx,gY-40);ctx.stroke();ctx.beginPath();ctx.arc(lx,gY-43,3.5,0,6.28);ctx.fillStyle='rgba(255,200,100,'+(0.6+Math.sin(t*2+i)*.2)+')';ctx.fill();var lg=ctx.createRadialGradient(lx,gY-43,0,lx,gY-43,30);lg.addColorStop(0,'rgba(255,200,100,.12)');lg.addColorStop(1,'transparent');ctx.fillStyle=lg;ctx.fillRect(lx-30,gY-73,60,60);}
  // buildings
  ctx.fillStyle='#8a7a65';ctx.fillRect(W*.02,gY-55,W*.25,55);
  ctx.fillStyle='#907a68';ctx.fillRect(W*.73,gY-50,W*.25,50);
  ctx.fillStyle='rgba(255,200,100,'+(0.5+Math.sin(t*1.3)*.15)+')';ctx.fillRect(W*.78,gY-40,12,14);ctx.fillRect(W*.88,gY-40,12,14);
  ctx.fillStyle='rgba(80,50,30,.65)';ctx.font=sf(13)+'px sans-serif';ctx.textAlign='center';ctx.fillText('她的学校',W*.14,gY-60);ctx.fillText('他的家',W*.85,gY-55);
  // street
  ctx.fillStyle='#a09080';ctx.fillRect(0,gY,W,H*.3);
  // 角色
  var sx=W*.15+Math.sin(t*.4)*W*.08;
  drawGirl(ctx,sx,gY+8,t,true,.7);
  drawBoy(ctx,W*.83,gY+8,t,false,.5);
  // 气泡
  if(t>3&&t<8){
    var ba=Math.min(1,(t-3)*.4)*Math.min(1,(8-t));
    drawBubble(ctx,W*.5,gY-70,'只隔一条街，却不知道彼此',{thought:true,alpha:ba*.6,bg:'rgba(180,190,255,.1)',border:'rgba(180,190,255,.15)',color:'rgba(180,190,230,.6)'});
  }
}

/* ----- 高中 ----- */
function renderHigh(ctx,W,H,t,p){
  var gY=H*.68;
  // school building
  ctx.fillStyle='#8a7060';ctx.fillRect(W*.6,gY-60,W*.35,60);ctx.fillRect(W*.65,gY-80,W*.15,20);
  ctx.fillStyle='rgba(80,40,30,.6)';ctx.font=sf(13)+'px sans-serif';ctx.textAlign='center';ctx.fillText('高中',W*.77,gY-85);
  // windows
  for(var wi=0;wi<4;wi++){ctx.fillStyle='rgba(255,200,120,'+(0.4+Math.sin(t+wi)*.15)+')';ctx.fillRect(W*.64+wi*W*.07,gY-50,W*.04,12);}
  // bus stop
  ctx.strokeStyle='rgba(100,80,60,.6)';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(W*.3,gY);ctx.lineTo(W*.3,gY-48);ctx.stroke();
  ctx.fillStyle='#6a5a48';ctx.fillRect(W*.25,gY-54,W*.1,16);ctx.fillStyle='rgba(240,220,180,.8)';ctx.font=sf(12)+'px sans-serif';ctx.fillText('公交站',W*.3,gY-44);
  // ground
  ctx.fillStyle='#7a6858';ctx.fillRect(0,gY,W,H*.3);
  // 公交车
  if(t>3){var bx=Math.min(W*.4,-W*.3+(t-3)*W*.12);ctx.fillStyle='rgba(55,75,125,.8)';roundRect(ctx,bx,gY-36,W*.32,30,4);ctx.fill();ctx.fillStyle='rgba(200,220,255,.3)';for(var i=0;i<4;i++)ctx.fillRect(bx+8+i*(W*.07),gY-32,W*.05,13);ctx.fillStyle='rgba(40,40,60,.9)';ctx.beginPath();ctx.arc(bx+W*.07,gY-2,5,0,6.28);ctx.fill();ctx.beginPath();ctx.arc(bx+W*.26,gY-2,5,0,6.28);ctx.fill();}
  // 角色
  drawBoy(ctx,W*.2,gY+8,t,false);
  drawGirl(ctx,W*.42,gY+8,t+.5,false);
  // 气泡
  if(t>2&&t<5){var a1=Math.min(1,(t-2))*Math.min(1,(5-t));drawBubble(ctx,W*.42,gY-40,'…嗨',{alpha:a1,bg:'rgba(255,230,240,.85)',border:'rgba(200,120,150,.5)',color:'rgba(180,50,90,.9)'});}
  if(t>4&&t<7){var a2=Math.min(1,(t-4))*Math.min(1,(7-t));drawBubble(ctx,W*.2,gY-40,'…嗯',{alpha:a2,bg:'rgba(220,235,255,.85)',border:'rgba(100,140,200,.5)',color:'rgba(40,70,140,.9)'});}
  if(t>6){var a3=Math.min(1,(t-6)*.5);drawBubble(ctx,W*.31,gY-65,'打个招呼，坐同一趟车，但不讲话',{thought:true,alpha:a3*.6,bg:'rgba(255,255,255,.75)',border:'rgba(120,100,80,.3)',color:'rgba(80,60,50,.7)'});}
}

/* ----- 毕业徒步 ----- */
function renderMountain(ctx,W,H,t,p){
  // far mountains (green)
  ctx.fillStyle='#6a9a60';ctx.beginPath();ctx.moveTo(0,H*.5);ctx.quadraticCurveTo(W*.15,H*.25,W*.3,H*.4);ctx.quadraticCurveTo(W*.45,H*.2,W*.6,H*.35);ctx.quadraticCurveTo(W*.75,H*.15,W*.9,H*.33);ctx.lineTo(W,H*.38);ctx.lineTo(W,H);ctx.lineTo(0,H);ctx.fill();
  // near hills
  ctx.fillStyle='#4a7a40';ctx.beginPath();ctx.moveTo(0,H*.65);ctx.quadraticCurveTo(W*.2,H*.52,W*.4,H*.58);ctx.quadraticCurveTo(W*.6,H*.5,W*.8,H*.56);ctx.lineTo(W,H*.6);ctx.lineTo(W,H);ctx.lineTo(0,H);ctx.fill();
  // trail
  ctx.strokeStyle='rgba(180,150,100,.4)';ctx.lineWidth=2;ctx.setLineDash([4,3]);ctx.beginPath();ctx.moveTo(0,H*.68);ctx.quadraticCurveTo(W*.3,H*.6,W*.5,H*.62);ctx.quadraticCurveTo(W*.75,H*.58,W,H*.63);ctx.stroke();ctx.setLineDash([]);
  // trees
  for(var i=0;i<5;i++){var tx=W*(.08+i*.22),ty=H*(.63-Math.sin(i*1.3)*.04);ctx.fillStyle='#3a6830';ctx.beginPath();ctx.moveTo(tx,ty);ctx.lineTo(tx-7,ty+13);ctx.lineTo(tx+7,ty+13);ctx.fill();ctx.fillStyle='#5a3a20';ctx.fillRect(tx-1,ty+12,2,6);}
  // 徒步者靠近
  var approach=Math.min(1,p*1.2);
  var heX=W*.2+(W*.45-W*.2)*approach;
  var sheX=W*.8-(W*.8-W*.55)*approach;
  var trY=H*.62;
  drawBystander(ctx,W*.08,trY+8,t,true,.3);drawBystander(ctx,W*.36,trY+5,t+2,true,.3);drawBystander(ctx,W*.92,trY+7,t+4,true,.3);
  drawBoy(ctx,heX,trY+8,t,true);drawGirl(ctx,sheX,trY+8,t+1.5,true);
  // 气泡
  if(approach>.4&&approach<.75){var ba=(approach-.4)/.35*Math.min(1,(.75-approach)/.1);drawBubble(ctx,sheX,trY-35,'这次终于说上话了！',{alpha:ba,bg:'rgba(255,230,240,.85)',border:'rgba(200,120,150,.5)',color:'rgba(180,50,90,.9)'});}
  if(approach>.6&&approach<.9){var bb=(approach-.6)/.3*Math.min(1,(.9-approach)/.1);drawBubble(ctx,heX,trY-35,'加个微信吧',{alpha:bb,bg:'rgba(220,235,255,.85)',border:'rgba(100,140,200,.5)',color:'rgba(40,70,140,.9)'});}
  // 交汇光芒
  if(approach>.8){var a2=(approach-.8)/.2;var mx=(heX+sheX)/2;var cg=ctx.createRadialGradient(mx,trY-5,0,mx,trY-5,15+a2*15);cg.addColorStop(0,'rgba(255,200,120,'+a2*.4+')');cg.addColorStop(1,'transparent');ctx.fillStyle=cg;ctx.beginPath();ctx.arc(mx,trY-5,15+a2*15,0,6.28);ctx.fill();}
}

/* ----- 爆发 ----- */
var burstParticles=null;
function renderBurst(ctx,W,H,t,p){
  if(!burstParticles){burstParticles=[];for(var i=0;i<60;i++){var a=Math.random()*6.28,sp=Math.random()*80+30;burstParticles.push({angle:a,speed:sp,r:Math.random()*3+1,h:25+Math.random()*35});}}
  // 粒子扩散
  for(var i=0;i<burstParticles.length;i++){
    var bp=burstParticles[i];var dist=bp.speed*t;
    var px=W/2+Math.cos(bp.angle)*dist;var py=H/2+Math.sin(bp.angle)*dist;
    var life=Math.max(0,1-t/3.5);
    ctx.beginPath();ctx.arc(px,py,bp.r*life,0,6.28);ctx.fillStyle='hsla('+bp.h+',80%,70%,'+life+')';ctx.fill();
  }
  drawCenterText(ctx,W,H,'从此，不再平行',{color:'rgba(140,60,20,'+(t<.5?t*2:t>3?Math.max(0,(4-t)):1)+')',font:Math.min(W*.07,28)+'px "PingFang SC",sans-serif'});
}

/* ----- 暑假群聊 ----- */
function renderSummer(ctx,W,H,t,p){
  var msgs=[
    {who:'she',text:'今天爬山好开心啊！😆',at:.5},
    {who:'he',text:'哈哈 下次还去',at:1.5},
    {who:'other',text:'同意+1 腿都软了',at:2.3},
    {who:'she',text:'你们暑假啥安排呀',at:3.2},
    {who:'he',text:'在家 无聊死了',at:4},
    {who:'she',text:'我也是哈哈哈',at:4.8},
    {who:'other',text:'组队打游戏！',at:5.5},
    {who:'he',text:'走 晚上开黑',at:6.3},
    {who:'she',text:'我也要！',at:7},
    {who:'he',text:'那晚上群里喊',at:7.8}
  ];
  // 手机
  var px=W*.2,py=H*.08,pw=W*.6,ph=H*.84;
  roundRect(ctx,px-4,py-4,pw+8,ph+8,20);ctx.fillStyle='#222230';ctx.fill();
  roundRect(ctx,px,py,pw,ph,16);ctx.fillStyle='#0c0c16';ctx.fill();
  // 状态栏
  ctx.fillStyle='rgba(200,200,220,.35)';ctx.font=sf(12)+'px sans-serif';ctx.textAlign='left';ctx.fillText('19:32',px+10,py+13);
  // 导航栏
  ctx.fillStyle='rgba(25,25,40,.95)';ctx.fillRect(px,py+18,pw,28);
  ctx.fillStyle='rgba(220,220,240,.8)';ctx.font='bold '+sf(14)+'px sans-serif';ctx.textAlign='center';ctx.fillText('我们五个人🏔️',px+pw/2,py+36);
  ctx.strokeStyle='rgba(80,80,120,.3)';ctx.lineWidth=.5;ctx.beginPath();ctx.moveTo(px,py+46);ctx.lineTo(px+pw,py+46);ctx.stroke();
  // 消息
  ctx.save();ctx.beginPath();ctx.rect(px,py+48,pw,ph-80);ctx.clip();
  var cy=py+55;
  for(var i=0;i<msgs.length;i++){
    if(t<msgs[i].at) break;
    var m=msgs[i];var age=t-m.at;var alpha=Math.min(1,age*3);
    var isR=m.who==='she';
    var avC=m.who==='he'?'#4a6ab5':m.who==='she'?'#d4587a':'#606880';
    var bubC=isR?'#3d7a4a':m.who==='he'?'#2a3a5a':'#2a2a40';
    ctx.globalAlpha=alpha;ctx.font=sf(13)+'px sans-serif';var tw2=ctx.measureText(m.text).width;var bw2=Math.min(tw2+16,pw-50),bh2=22;
    if(isR){
      roundRect(ctx,px+pw-14,cy+1,12,12,3);ctx.fillStyle=avC;ctx.fill();
      ctx.fillStyle='#fff';ctx.font=sf(10)+'px sans-serif';ctx.textAlign='center';ctx.fillText('她',px+pw-8,cy+10);
      roundRect(ctx,px+pw-18-bw2,cy,bw2,bh2,6);ctx.fillStyle=bubC;ctx.fill();
      ctx.fillStyle='rgba(255,255,255,.88)';ctx.font=sf(13)+'px sans-serif';ctx.textAlign='left';ctx.fillText(m.text,px+pw-14-bw2,cy+15);
    }else{
      roundRect(ctx,px+6,cy+1,12,12,3);ctx.fillStyle=avC;ctx.fill();
      ctx.fillStyle='#fff';ctx.font=sf(10)+'px sans-serif';ctx.textAlign='center';ctx.fillText(m.who==='he'?'他':'友',px+12,cy+10);
      roundRect(ctx,px+22,cy,bw2,bh2,6);ctx.fillStyle=bubC;ctx.fill();
      ctx.fillStyle='rgba(255,255,255,.88)';ctx.font=sf(13)+'px sans-serif';ctx.textAlign='left';ctx.fillText(m.text,px+28,cy+15);
    }
    ctx.globalAlpha=1;cy+=bh2+8;
  }
  ctx.restore();
  // 底部输入框
  ctx.fillStyle='rgba(25,25,40,.95)';ctx.fillRect(px,py+ph-34,pw,34);
  roundRect(ctx,px+8,py+ph-30,pw-50,22,8);ctx.fillStyle='rgba(40,40,60,.8)';ctx.fill();
}

/* ----- 分别（火车站）----- */
function renderParting(ctx,W,H,t,p){
  var gY=H*.65;
  // platform
  ctx.fillStyle='#6a6058';ctx.fillRect(0,gY,W,10);ctx.fillStyle='#c8b840';ctx.fillRect(0,gY,W,2);
  ctx.fillStyle='#5a5048';ctx.fillRect(0,gY+10,W,H);
  // pillars + lamps
  for(var i=0;i<3;i++){var cx2=W*.15+i*W*.35;ctx.fillStyle='#7a7068';ctx.fillRect(cx2-3,gY-50,6,50);ctx.fillStyle='#686058';ctx.fillRect(cx2-22,gY-54,44,5);ctx.beginPath();ctx.arc(cx2,gY-48,3.5,0,6.28);ctx.fillStyle='rgba(255,210,120,'+(0.55+Math.sin(t*1.5+i)*.15)+')';ctx.fill();var lg=ctx.createRadialGradient(cx2,gY-48,2,cx2,gY-48,25);lg.addColorStop(0,'rgba(255,210,120,.1)');lg.addColorStop(1,'transparent');ctx.fillStyle=lg;ctx.fillRect(cx2-25,gY-73,50,50);}
  // tracks
  ctx.strokeStyle='rgba(80,70,60,.5)';ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(0,gY+16);ctx.lineTo(W,gY+16);ctx.stroke();ctx.beginPath();ctx.moveTo(0,gY+22);ctx.lineTo(W,gY+22);ctx.stroke();
  // 火车
  var trainX=t>2?Math.min(W*.05,-W*.5+(t-2)*W*.15):-W*.6;
  if(trainX>-W*.5){ctx.fillStyle='#e8e8f0';roundRect(ctx,trainX,gY-30,W*.8,28,4);ctx.fill();ctx.fillStyle='#4a6aa0';ctx.fillRect(trainX,gY-30,W*.8,4);ctx.fillRect(trainX,gY-6,W*.8,4);for(var i=0;i<7;i++){ctx.fillStyle='rgba(160,200,240,.5)';ctx.fillRect(trainX+15+i*W*.1,gY-24,W*.07,14);}}
  // 角色
  var spread=Math.min(W*.35,Math.max(0,(t-4)*W*.06));
  if(t<4){drawGirl(ctx,W*.4,gY-2,t,false);drawBoy(ctx,W*.6,gY-2,t,false);
    if(t>1){var ba=Math.min(1,(t-1));drawBubble(ctx,W*.4,gY-48,'我要去上大学了…',{alpha:ba*.85,bg:'rgba(255,230,240,.85)',border:'rgba(200,120,150,.5)',color:'rgba(180,50,90,.9)'});}
    if(t>2.5){var bb=Math.min(1,(t-2.5));drawBubble(ctx,W*.6,gY-48,'我留下来复读',{alpha:bb*.85,bg:'rgba(220,235,255,.85)',border:'rgba(100,140,200,.5)',color:'rgba(40,70,140,.9)'});}
  }else{drawGirl(ctx,W*.4-spread,gY-2,t,true);drawBoy(ctx,W*.6+spread,gY-2,t,true);}
  // 落叶
  for(var i=0;i<6;i++){var lx=(W*.05+i*W*.18+t*12+i*30)%(W*1.1);var ly=H*.1+Math.sin(t*.8+i*2.3)*H*.2+i*10;ctx.save();ctx.translate(lx,ly);ctx.rotate(t*.5+i*1.2);ctx.fillStyle='rgba(200,140,60,'+(0.12+Math.sin(t+i)*.06)+')';ctx.beginPath();ctx.moveTo(0,-3);ctx.quadraticCurveTo(4,0,0,4);ctx.quadraticCurveTo(-4,0,0,-3);ctx.fill();ctx.restore();}
}

/* ----- 反复措辞 ----- */
function renderTyping(ctx,W,H,t,p){
  var drafts=['加油啊，复读辛苦了，我会一直支持你的','最近还好吗？别太累了','加油！'];
  // 深夜房间
  ctx.fillStyle='rgba(15,12,28,.5)';ctx.fillRect(0,0,W,H);
  // 窗户
  ctx.fillStyle='rgba(20,20,40,.8)';ctx.fillRect(W*.65,H*.05,W*.3,H*.35);ctx.strokeStyle='rgba(60,60,90,.5)';ctx.lineWidth=1;ctx.strokeRect(W*.65,H*.05,W*.3,H*.35);
  ctx.beginPath();ctx.moveTo(W*.8,H*.05);ctx.lineTo(W*.8,H*.4);ctx.stroke();ctx.beginPath();ctx.moveTo(W*.65,H*.22);ctx.lineTo(W*.95,H*.22);ctx.stroke();
  ctx.beginPath();ctx.arc(W*.88,H*.12,7,0,6.28);ctx.fillStyle='rgba(255,240,200,.5)';ctx.fill();ctx.beginPath();ctx.arc(W*.88+3,H*.12-2,6,0,6.28);ctx.fillStyle='rgba(15,12,28,1)';ctx.fill();
  // 桌面
  ctx.fillStyle='rgba(45,40,60,.9)';ctx.fillRect(0,H*.58,W,H*.42);
  // 台灯
  ctx.strokeStyle='rgba(120,110,140,.5)';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(W*.12,H*.58);ctx.lineTo(W*.12,H*.36);ctx.lineTo(W*.2,H*.3);ctx.stroke();
  ctx.beginPath();ctx.arc(W*.2,H*.3,5,0,6.28);ctx.fillStyle='rgba(255,230,170,.6)';ctx.fill();
  var lg=ctx.createRadialGradient(W*.2,H*.3,3,W*.2,H*.48,W*.2);lg.addColorStop(0,'rgba(255,230,180,.06)');lg.addColorStop(1,'transparent');ctx.fillStyle=lg;ctx.fillRect(0,H*.2,W*.5,H*.5);
  // 手机
  ctx.save();ctx.translate(W*.45,H*.52);ctx.rotate(-.1);
  var mpx=-W*.18,mpy=-H*.28,mpw=W*.36,mph=H*.5;
  roundRect(ctx,mpx-2,mpy-2,mpw+4,mph+4,12);ctx.fillStyle='#1a1a2a';ctx.fill();
  roundRect(ctx,mpx,mpy,mpw,mph,10);ctx.fillStyle='#080812';ctx.fill();
  ctx.fillStyle='rgba(100,140,255,.5)';ctx.font='bold '+sf(12)+'px sans-serif';ctx.textAlign='center';ctx.fillText('他',mpx+mpw/2,mpy+14);
  // 打字动画
  var cycle=t%8;var draftIdx=cycle<3.5?0:cycle<6.5?1:2;var draft=drafts[draftIdx];
  var localCycle=cycle<3.5?cycle:cycle<6.5?cycle-3.5:cycle-6.5;
  var isLast=draftIdx===2;
  var chars,isDel=false;
  if(!isLast){if(localCycle<2){chars=Math.floor(localCycle/2*draft.length);}else{isDel=true;chars=Math.floor(Math.max(0,1-(localCycle-2)/1.2)*draft.length);}}
  else{chars=Math.floor(Math.min(1,localCycle/1)*draft.length);}
  var curText=draft.substring(0,chars||0);
  var ibY=mpy+mph-22;
  roundRect(ctx,mpx+4,ibY,mpw-8,16,5);ctx.fillStyle='rgba(30,30,50,.9)';ctx.fill();
  if(isDel){ctx.fillStyle='rgba(255,80,80,'+(0.1+Math.sin(t*8)*.08)+')';roundRect(ctx,mpx+4,ibY,mpw-8,16,5);ctx.fill();}
  var display=curText.length>14?curText.substring(curText.length-14):curText;
  ctx.fillStyle='rgba(200,210,240,.8)';ctx.font=sf(11)+'px sans-serif';ctx.textAlign='left';ctx.fillText(display,mpx+8,ibY+11);
  if(Math.sin(t*5)>0){var twm=ctx.measureText(display).width;ctx.fillStyle='rgba(200,210,240,.5)';ctx.fillRect(mpx+9+twm,ibY+3,1,10);}
  // 发送后
  if(isLast&&localCycle>1.2){
    var sa=Math.min(1,(localCycle-1.2)*2);ctx.globalAlpha=sa;
    var msgT='加油！';ctx.font=sf(11)+'px sans-serif';var tw3=ctx.measureText(msgT).width;
    roundRect(ctx,mpx+mpw-6-tw3-10,mpy+30,tw3+10,16,5);ctx.fillStyle='rgba(80,180,100,.85)';ctx.fill();
    ctx.fillStyle='#fff';ctx.textAlign='right';ctx.fillText(msgT,mpx+mpw-11,mpy+41);ctx.globalAlpha=1;
  }
  ctx.restore();
  // 时钟
  ctx.fillStyle='rgba(140,150,190,.2)';ctx.font=sf(13)+'px sans-serif';ctx.textAlign='right';ctx.fillText('23:47',W*.95,H*.63);
}

/* ----- 等待 ----- */
function renderWaiting(ctx,W,H,t,p){
  // 天色循环
  var dp=(t%8)/8;var sr=15+Math.sin(dp*6.28)*12,sg2=15+Math.sin(dp*6.28)*10,sb=35+Math.sin(dp*6.28)*8;
  ctx.fillStyle='rgb('+Math.floor(sr)+','+Math.floor(sg2)+','+Math.floor(sb)+')';ctx.fillRect(0,0,W,H*.3);
  // 手机
  var px=W*.22,py=H*.15,pw=W*.56,ph=H*.65;
  roundRect(ctx,px-3,py-3,pw+6,ph+6,14);ctx.fillStyle='#1e1e2e';ctx.fill();
  roundRect(ctx,px,py,pw,ph,11);ctx.fillStyle='#0a0a14';ctx.fill();
  // 她发的消息
  ctx.font=sf(13)+'px sans-serif';var mtxt='加油！';var mtw=ctx.measureText(mtxt).width;
  roundRect(ctx,px+pw-10-mtw-12,py+30,mtw+12,20,6);ctx.fillStyle='rgba(80,180,100,.8)';ctx.fill();
  ctx.fillStyle='#fff';ctx.textAlign='right';ctx.fillText(mtxt,px+pw-16,py+43);
  ctx.fillStyle='rgba(140,150,190,.3)';ctx.font=sf(10)+'px sans-serif';ctx.textAlign='right';ctx.fillText('已读',px+pw-10,py+58);
  // 等待中
  if(t<7){for(var i=0;i<3;i++){var dy=Math.sin(t*3+i*.9)*4;ctx.fillStyle='rgba(150,160,200,'+(0.2+Math.sin(t*2+i)*.1)+')';ctx.beginPath();ctx.arc(px+pw/2-8+i*8,py+ph/2+dy,3,0,6.28);ctx.fill();}
    if(Math.sin(t*.5)>.7){ctx.fillStyle='rgba(150,160,200,.18)';ctx.font=sf(11)+'px sans-serif';ctx.textAlign='center';ctx.fillText('对方正在输入...',px+pw/2,py+ph/2+20);}
  }else{
    var ra=Math.min(1,(t-7)*1.5);ctx.globalAlpha=ra;
    var reply='谢谢 我会努力的';ctx.font=sf(13)+'px sans-serif';var rw=ctx.measureText(reply).width;
    roundRect(ctx,px+10,py+80,rw+12,20,6);ctx.fillStyle='rgba(50,60,90,.85)';ctx.fill();
    ctx.fillStyle='#fff';ctx.textAlign='left';ctx.fillText(reply,px+16,py+93);ctx.globalAlpha=1;
    // 小光芒
    for(var i=0;i<5;i++){var sx=px+10+rw/2+Math.cos(t*2+i*1.26)*20*ra;var sy=py+88+Math.sin(t*2+i*1.26)*12*ra;ctx.fillStyle='rgba(255,210,140,'+(0.12+Math.sin(t*3+i)*.08)+')';ctx.beginPath();ctx.arc(sx,sy,1.5,0,6.28);ctx.fill();}
  }
  // 她在窗边
  ctx.globalAlpha=.25;drawGirl(ctx,W*.88,H*.72,t,false,.25);ctx.globalAlpha=1;
}

/* ----- 一年后 ----- */
function renderReunion(ctx,W,H,t,p){
  var gY=H*.62;
  // left campus
  ctx.fillStyle='#3a3858';ctx.fillRect(W*.02,gY-60,W*.22,60);ctx.fillRect(W*.08,gY-78,W*.12,18);
  for(var r=0;r<2;r++)for(var c=0;c<3;c++){ctx.fillStyle='rgba(255,210,120,'+(0.4+Math.sin(t*1.2+r+c)*.15)+')';ctx.fillRect(W*.04+c*W*.06,gY-52+r*24,6,10);}
  ctx.fillStyle='rgba(180,190,220,.55)';ctx.font=sf(11)+'px sans-serif';ctx.textAlign='center';ctx.fillText('她的大学',W*.15,gY-82);
  // right campus
  ctx.fillStyle='#3a3858';ctx.fillRect(W*.76,gY-60,W*.22,60);ctx.fillRect(W*.8,gY-78,W*.12,18);
  for(var r=0;r<2;r++)for(var c=0;c<3;c++){ctx.fillStyle='rgba(255,210,120,'+(0.4+Math.sin(t*1.5+r+c+2)*.15)+')';ctx.fillRect(W*.78+c*W*.06,gY-52+r*24,6,10);}
  ctx.fillStyle='rgba(180,190,220,.55)';ctx.font=sf(11)+'px sans-serif';ctx.fillText('他的大学',W*.87,gY-82);
  // ground
  ctx.fillStyle='#2a2840';ctx.fillRect(0,gY,W,H*.38);
  // 人物
  drawGirl(ctx,W*.16,gY+8,t,false);drawBoy(ctx,W*.84,gY+8,t,false);
  // 虚线纽带
  var da=0.1+Math.sin(t*.7)*.05;ctx.setLineDash([3,7]);ctx.strokeStyle='rgba(200,180,255,'+da+')';ctx.lineWidth=1;
  ctx.beginPath();ctx.moveTo(W*.25,gY-8);ctx.quadraticCurveTo(W*.5,gY-22-Math.sin(t*.5)*8,W*.75,gY-8);ctx.stroke();ctx.setLineDash([]);
  // 脉搏光点
  var pulseX=W*.5+Math.sin(t*.6)*W*.15;ctx.beginPath();ctx.arc(pulseX,gY-14,3,0,6.28);ctx.fillStyle='rgba(255,180,200,'+(0.12+Math.sin(t*2)*.08)+')';ctx.fill();
  // 文字
  if(t>3){var ta=Math.min(1,(t-3)*.5);ctx.fillStyle='rgba(180,190,220,'+ta*.5+')';ctx.font='italic '+sf(14)+'px sans-serif';ctx.textAlign='center';ctx.fillText('好像差了那么一点点',W*.5,gY+H*.2);}
}

/* ----- 结尾 ----- */
function renderEnding(ctx,W,H,t,p){
  var a=t<1?t:t>4?Math.max(0,5-t):1;
  drawCenterText(ctx,W,H,'第三章\n心照不宣\n\n即将揭开',{color:'rgba(255,240,230,'+a+')',lineHeight:38,font:Math.min(W*.05,22)+'px "PingFang SC",sans-serif'});
}


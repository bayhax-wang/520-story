/* ============================================================
   520 Story — Canvas Animation Film + Image Scenes
   ============================================================ */

/* ---------- Utility ---------- */
function roundRect(ctx,x,y,w,h,r){
  ctx.beginPath();ctx.moveTo(x+r,y);ctx.lineTo(x+w-r,y);
  ctx.quadraticCurveTo(x+w,y,x+w,y+r);ctx.lineTo(x+w,y+h-r);
  ctx.quadraticCurveTo(x+w,y+h,x+w-r,y+h);ctx.lineTo(x+r,y+h);
  ctx.quadraticCurveTo(x,y+h,x,y+h-r);ctx.lineTo(x,y+r);
  ctx.quadraticCurveTo(x,y,x+r,y);ctx.closePath();
}

function sf(base){ return Math.max(base, Math.min(W*base/375, base*2)); }

function drawBubble(ctx,x,y,text,opts){
  opts=opts||{};
  var fs=Math.max(14,Math.min(W*.042,20));
  var font=opts.font||(fs+'px "PingFang SC","Hiragino Sans GB",sans-serif');
  var color=opts.color||'rgba(50,35,20,.92)';
  var bg=opts.bg||'rgba(255,255,255,.9)';
  var border=opts.border||'rgba(140,110,70,.3)';
  var thought=opts.thought||false;
  var alpha=opts.alpha===undefined?1:opts.alpha;
  ctx.save();ctx.globalAlpha*=alpha;
  ctx.font=font;
  // Multi-line support
  var lines=text.split('\n');
  var maxTw=0;
  for(var li=0;li<lines.length;li++){var tw=ctx.measureText(lines[li]).width;if(tw>maxTw)maxTw=tw;}
  var lh=fs*1.4;
  var pw=maxTw+24,ph=lh*lines.length+16,px=x-pw/2,py=y-ph;
  ctx.shadowColor='rgba(0,0,0,.2)';ctx.shadowBlur=10;ctx.shadowOffsetY=3;
  if(thought){
    ctx.setLineDash([4,4]);ctx.strokeStyle=border;ctx.lineWidth=1;
    roundRect(ctx,px,py,pw,ph,ph/3);ctx.fillStyle=bg;ctx.fill();ctx.stroke();ctx.setLineDash([]);
    ctx.shadowBlur=0;
    ctx.fillStyle=bg;ctx.beginPath();ctx.arc(x-5,y+4,3.5,0,6.28);ctx.fill();
    ctx.beginPath();ctx.arc(x-2,y+10,2,0,6.28);ctx.fill();
  }else{
    roundRect(ctx,px,py,pw,ph,ph/3);ctx.fillStyle=bg;ctx.fill();
    ctx.strokeStyle=border;ctx.lineWidth=.8;ctx.stroke();
    ctx.shadowBlur=0;
    ctx.fillStyle=bg;ctx.beginPath();ctx.moveTo(x-5,y);ctx.lineTo(x,y+8);ctx.lineTo(x+5,y);ctx.fill();
  }
  ctx.shadowBlur=0;ctx.shadowColor='transparent';
  ctx.fillStyle=color;ctx.textAlign='center';ctx.textBaseline='middle';
  for(var li=0;li<lines.length;li++){
    ctx.fillText(lines[li],x,py+8+lh/2+li*lh);
  }
  ctx.restore();
}

function drawCenterText(ctx,W,H,text,opts){
  opts=opts||{};
  var defSize=Math.max(20,Math.min(W*.07,34));
  ctx.save();
  ctx.fillStyle=opts.color||'rgba(255,240,230,.95)';
  ctx.font=opts.font||(defSize+'px "PingFang SC","Hiragino Sans GB","Microsoft YaHei",sans-serif');
  ctx.textAlign='center';ctx.textBaseline='middle';
  ctx.shadowColor='rgba(0,0,0,.35)';ctx.shadowBlur=8;ctx.shadowOffsetY=2;
  var lines=text.split('\n');
  var lh=opts.lineHeight||Math.max(38,defSize*1.7);
  var startY=H/2-(lines.length-1)*lh/2;
  for(var i=0;i<lines.length;i++) ctx.fillText(lines[i],W/2,startY+i*lh);
  ctx.restore();
}

function drawImageCover(ctx,img,W,H,zoom){
  if(!img||!img.complete||!img.naturalWidth) return;
  zoom=zoom||1;
  var iw=img.naturalWidth, ih=img.naturalHeight;
  var scale=Math.max(W/iw, H/ih)*zoom;
  var sw=iw*scale, sh=ih*scale;
  ctx.drawImage(img,(W-sw)/2,(H-sh)/2,sw,sh);
}

/* ============================================================
   SCENES
   ============================================================ */
var SCENES=[
  {id:'prologue',  label:'序章',               dur:6},
  {id:'primary',   label:'第一章 · 小学',      dur:10, img:'images/01-primary.jpg'},
  {id:'middle',    label:'第一章 · 初中',      dur:8},
  {id:'high',      label:'第一章 · 高中',      dur:10, img:'images/02-high.jpg'},
  {id:'mountain',  label:'第一章 · 毕业徒步',  dur:12, img:'images/03-mountain.jpg'},
  {id:'burst',     label:'从此，不再平行',      dur:5},
  {id:'summer',    label:'第二章 · 暑假群聊',  dur:8},
  {id:'parting',   label:'第二章 · 分别',      dur:10, img:'images/04-parting.jpg'},
  {id:'typing',    label:'第二章 · 反复措辞',  dur:10},
  {id:'waiting',   label:'第二章 · 等待',      dur:8},
  {id:'reunion',   label:'第二章 · 两所大学',  dur:8},
  {id:'confession',label:'第三章 · 心照不宣',  dur:10, img:'images/05-confession.jpg'},
  {id:'proposal',  label:'第四章 · 烟花',      dur:10, img:'images/06-proposal.jpg'},
  {id:'ending',    label:'尾声',               dur:8,  img:'images/07-seaside-real.jpg'}
];

// Preload
var sceneImages={};
(function(){
  for(var i=0;i<SCENES.length;i++){
    if(SCENES[i].img){var im=new Image();im.src=SCENES[i].img;sceneImages[SCENES[i].id]=im;}
  }
})();

var FADE_DUR=1;
var totalDur=0, sceneStarts=[], acc=0;
for(var i=0;i<SCENES.length;i++){sceneStarts.push(acc);acc+=SCENES[i].dur;}
totalDur=acc;

// State
var canvas,ctx,W,H;
var globalTime=0, paused=false, lastFrame=0;

function resize(){
  canvas=document.getElementById('main-canvas');
  if(!canvas) return;
  var dpr=Math.min(window.devicePixelRatio||1,2);
  W=window.innerWidth;H=window.innerHeight;
  canvas.width=W*dpr;canvas.height=H*dpr;
  canvas.style.width=W+'px';canvas.style.height=H+'px';
  ctx=canvas.getContext('2d');
  ctx.scale(dpr,dpr);
}

function getSceneAt(gt){
  for(var i=SCENES.length-1;i>=0;i--){
    if(gt>=sceneStarts[i]) return {idx:i,local:gt-sceneStarts[i],progress:(gt-sceneStarts[i])/SCENES[i].dur};
  }
  return {idx:0,local:0,progress:0};
}

/* ============================================================
   SCENE BG — gradient for text scenes, image for image scenes
   ============================================================ */
var sceneBgs={
  prologue:'linear-gradient(135deg,#1a1230,#2d1f4e 40%,#6b3a6e 70%,#c47a5a)',
  middle:  'linear-gradient(180deg,#4a6fa5,#d4956a 60%,#c2956e)',
  burst:   'radial-gradient(circle,#fff5e0,#ffd68a 50%,#b86a30)',
  summer:  'linear-gradient(180deg,#5bbce8,#88d4f0 50%,#f0e8d0)',
  typing:  'linear-gradient(180deg,#0c0c20,#141428 60%,#1e1a30)',
  waiting: 'linear-gradient(180deg,#1a1838,#2a2850 50%,#3a3060)',
  reunion: 'linear-gradient(180deg,#0e1028,#1a1e3e 50%,#222840)'
};

function drawSceneBg(ctx,W,H,id,t){
  // Image scene
  var img=sceneImages[id];
  if(img){
    var zoom=1+t*0.005; // subtle Ken Burns
    drawImageCover(ctx,img,W,H,zoom);
    return;
  }
  // Gradient scene — draw manually
  switch(id){
    case 'prologue':
      var g=ctx.createLinearGradient(0,0,W,H);
      g.addColorStop(0,'#1a1230');g.addColorStop(.4,'#2d1f4e');g.addColorStop(.7,'#6b3a6e');g.addColorStop(1,'#c47a5a');
      ctx.fillStyle=g;ctx.fillRect(0,0,W,H);break;
    case 'middle':
      var g=ctx.createLinearGradient(0,0,0,H);
      g.addColorStop(0,'#4a6fa5');g.addColorStop(.5,'#d4956a');g.addColorStop(1,'#c2956e');
      ctx.fillStyle=g;ctx.fillRect(0,0,W,H);break;
    case 'burst':
      var g=ctx.createRadialGradient(W/2,H/2,10,W/2,H/2,W*.5);
      g.addColorStop(0,'#fff5e0');g.addColorStop(.5,'#ffd68a');g.addColorStop(1,'#b86a30');
      ctx.fillStyle=g;ctx.fillRect(0,0,W,H);break;
    case 'summer':
      var g=ctx.createLinearGradient(0,0,0,H);
      g.addColorStop(0,'#5bbce8');g.addColorStop(.5,'#88d4f0');g.addColorStop(1,'#f0e8d0');
      ctx.fillStyle=g;ctx.fillRect(0,0,W,H);break;
    case 'typing':
      var g=ctx.createLinearGradient(0,0,0,H);
      g.addColorStop(0,'#0c0c20');g.addColorStop(.6,'#141428');g.addColorStop(1,'#1e1a30');
      ctx.fillStyle=g;ctx.fillRect(0,0,W,H);break;
    case 'waiting':
      var g=ctx.createLinearGradient(0,0,0,H);
      g.addColorStop(0,'#1a1838');g.addColorStop(.5,'#2a2850');g.addColorStop(1,'#3a3060');
      ctx.fillStyle=g;ctx.fillRect(0,0,W,H);break;
    case 'reunion':
      var g=ctx.createLinearGradient(0,0,0,H);
      g.addColorStop(0,'#0e1028');g.addColorStop(.4,'#1a1e3e');g.addColorStop(1,'#222840');
      ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
      for(var i=0;i<15;i++){var sx=Math.sin(i*7.3+.5)*W*.45+W*.5,sy=Math.sin(i*3.1+1.2)*H*.15+H*.08;
        ctx.fillStyle='rgba(200,210,255,'+(0.15+Math.sin(t+i)*.1)+')';ctx.beginPath();ctx.arc(sx,sy,1,0,6.28);ctx.fill();}
      break;
    default:
      ctx.fillStyle='#0a0a14';ctx.fillRect(0,0,W,H);
  }
}

/* ============================================================
   SCENE RENDERERS
   ============================================================ */

function renderPrologue(ctx,W,H,t,p){
  var a=t<1.5?t/1.5:t>4.5?Math.max(0,(6-t)/1.5):1;
  drawCenterText(ctx,W,H,'有些人，走了很远的路\n才发现一直在彼此身边',{color:'rgba(255,240,230,'+a+')'});
}

function renderPrimary(ctx,W,H,t,p){
  // Image bg already drawn. Only bubbles.
  if(t>2&&t<8){var a=Math.min(1,(t-2)*.6)*Math.min(1,(8-t)*.8);
    drawBubble(ctx,W*.65,H*.13,'那个男生好厉害…',{thought:true,alpha:a});}
  if(t>5){var a=Math.min(1,(t-5)*.5);
    drawBubble(ctx,W*.35,H*.85,'同一所小学 · 他在 1 班，她在 2 班',{thought:true,alpha:a,bg:'rgba(0,0,0,.5)',color:'rgba(255,240,230,.9)',border:'rgba(255,255,255,.15)'});}
}

function renderMiddle(ctx,W,H,t,p){
  drawCenterText(ctx,W,H,'初中，不同校\n只隔一条街\n却不知道彼此',{color:'rgba(255,240,230,'+(t<1?t:t>6?Math.max(0,8-t):1)+')'});
}

function renderHigh(ctx,W,H,t,p){
  if(t>1.5&&t<5){var a=Math.min(1,(t-1.5)*.6)*Math.min(1,(5-t)*.8);
    drawBubble(ctx,W*.7,H*.18,'…嗨',{alpha:a});}
  if(t>3.5&&t<7){var a=Math.min(1,(t-3.5)*.6)*Math.min(1,(7-t)*.8);
    drawBubble(ctx,W*.3,H*.25,'…嗯',{alpha:a});}
  if(t>6){var a=Math.min(1,(t-6)*.4);
    drawBubble(ctx,W*.5,H*.88,'高中同校 · 公交站偶遇 · 从不讲话',{thought:true,alpha:a,bg:'rgba(0,0,0,.5)',color:'rgba(255,240,230,.9)',border:'rgba(255,255,255,.15)'});}
}

function renderMountain(ctx,W,H,t,p){
  if(t>2&&t<7){var a=Math.min(1,(t-2)*.5)*Math.min(1,(7-t)*.6);
    drawBubble(ctx,W*.65,H*.12,'这次终于说上话了！',{alpha:a});}
  if(t>5&&t<10){var a=Math.min(1,(t-5)*.5)*Math.min(1,(10-t)*.6);
    drawBubble(ctx,W*.35,H*.2,'加个微信吧',{alpha:a});}
  if(t>8){var a=Math.min(1,(t-8)*.4);
    drawBubble(ctx,W*.5,H*.88,'毕业徒步 · 命运的交汇点',{thought:true,alpha:a,bg:'rgba(0,0,0,.5)',color:'rgba(255,240,230,.9)',border:'rgba(255,255,255,.15)'});}
}

var burstParticles=null;
function renderBurst(ctx,W,H,t,p){
  if(!burstParticles){burstParticles=[];for(var i=0;i<50;i++){burstParticles.push({a:Math.random()*6.28,sp:Math.random()*60+20,r:Math.random()*3+1,h:20+Math.random()*40});}}
  for(var i=0;i<burstParticles.length;i++){
    var bp=burstParticles[i],dist=bp.sp*t;
    var px=W/2+Math.cos(bp.a)*dist,py=H/2+Math.sin(bp.a)*dist;
    var life=Math.max(0,1-t/4);
    ctx.beginPath();ctx.arc(px,py,bp.r*life,0,6.28);ctx.fillStyle='hsla('+bp.h+',80%,65%,'+life+')';ctx.fill();
  }
  var a=t<.5?t*2:t>3.5?Math.max(0,(5-t)/1.5):1;
  drawCenterText(ctx,W,H,'从此，不再平行',{color:'rgba(120,50,10,'+a+')',font:Math.min(W*.08,32)+'px "PingFang SC",sans-serif'});
}

function renderSummer(ctx,W,H,t,p){
  var a=t<1?t:t>6?Math.max(0,8-t):1;
  drawCenterText(ctx,W,H,'暑假\n五个人的群聊\n从群聊到私聊',{color:'rgba(40,60,100,'+a+')'});
}

function renderParting(ctx,W,H,t,p){
  if(t>1.5&&t<5){var a=Math.min(1,(t-1.5)*.5)*Math.min(1,(5-t)*.6);
    drawBubble(ctx,W*.35,H*.12,'我要去上大学了…',{alpha:a});}
  if(t>3.5&&t<7){var a=Math.min(1,(t-3.5)*.5)*Math.min(1,(7-t)*.6);
    drawBubble(ctx,W*.65,H*.2,'我留下来复读',{alpha:a});}
  if(t>7){var a=Math.min(1,(t-7)*.4);
    drawBubble(ctx,W*.5,H*.88,'九月 · 她上大学，他复读一年',{thought:true,alpha:a,bg:'rgba(0,0,0,.5)',color:'rgba(255,240,230,.9)',border:'rgba(255,255,255,.15)'});}
}

function renderTyping(ctx,W,H,t,p){
  // Deep night scene - text only with typing animation
  var drafts=['加油啊，复读辛苦了\n我会一直支持你的','最近还好吗？\n别太累了','加油！'];
  var cycle=t%8;var draftIdx=cycle<3?0:cycle<6?1:2;
  var a=t<1?t:t>8?Math.max(0,10-t):1;

  // Clock
  ctx.fillStyle='rgba(180,190,220,'+a*.3+')';ctx.font=sf(14)+'px sans-serif';ctx.textAlign='center';
  ctx.fillText('23:47',W*.5,H*.1);

  // Phone frame
  var px=W*.2,py=H*.18,pw=W*.6,ph=H*.55;
  ctx.fillStyle='rgba(30,30,45,'+a*.8+')';roundRect(ctx,px-3,py-3,pw+6,ph+6,12);ctx.fill();
  ctx.fillStyle='rgba(15,15,25,'+a*.9+')';roundRect(ctx,px,py,pw,ph,10);ctx.fill();

  // Draft text
  var draft=drafts[draftIdx];
  var localC=cycle<3?cycle:cycle<6?cycle-3:cycle-6;
  var isLast=draftIdx===2;
  var chars;
  if(!isLast){chars=localC<1.8?Math.floor(localC/1.8*draft.replace(/\n/g,'').length):Math.floor(Math.max(0,1-(localC-1.8)/1)*draft.replace(/\n/g,'').length);}
  else{chars=Math.floor(Math.min(1,localC/1)*draft.replace(/\n/g,'').length);}
  var flat=draft.replace(/\n/g,'');
  var curText=flat.substring(0,chars||0);

  ctx.fillStyle='rgba(200,210,240,'+a*.8+')';ctx.font=sf(13)+'px sans-serif';ctx.textAlign='left';
  ctx.fillText(curText.length>16?'…'+curText.substring(curText.length-16):curText,px+12,py+ph-16);

  // Cursor blink
  if(Math.sin(t*5)>0){var tw=ctx.measureText(curText.length>16?curText.substring(curText.length-16):curText).width;
    ctx.fillStyle='rgba(200,210,240,'+a*.5+')';ctx.fillRect(px+13+tw,py+ph-24,1.5,14);}

  // Sent message
  if(isLast&&localC>1.2){var sa=Math.min(1,(localC-1.2)*2)*a;
    drawBubble(ctx,W*.62,py+40,'加油！',{alpha:sa,bg:'rgba(80,180,100,.85)',color:'#fff',border:'rgba(60,140,80,.5)'});}

  // Bottom caption
  drawCenterText(ctx,W,H*1.7,'深夜 · 写了删，删了写',{color:'rgba(180,190,220,'+a*.4+')',font:sf(13)+'px sans-serif'});
}

function renderWaiting(ctx,W,H,t,p){
  var a=t<1?t:t>6?Math.max(0,8-t):1;

  // Phone
  var px=W*.22,py=H*.2,pw=W*.56,ph=H*.5;
  ctx.fillStyle='rgba(25,25,40,'+a*.8+')';roundRect(ctx,px-3,py-3,pw+6,ph+6,12);ctx.fill();
  ctx.fillStyle='rgba(10,10,20,'+a*.9+')';roundRect(ctx,px,py,pw,ph,10);ctx.fill();

  // Sent msg
  drawBubble(ctx,px+pw*.7,py+40,'加油！',{alpha:a,bg:'rgba(80,180,100,.85)',color:'#fff',border:'rgba(60,140,80,.5)'});

  // "已读"
  ctx.fillStyle='rgba(140,150,190,'+a*.3+')';ctx.font=sf(10)+'px sans-serif';ctx.textAlign='right';
  ctx.fillText('已读',px+pw-8,py+65);

  // Waiting dots
  if(t<5){for(var i=0;i<3;i++){var dy=Math.sin(t*3+i*.9)*3;
    ctx.fillStyle='rgba(150,160,200,'+(.2+Math.sin(t*2+i)*.1)+')';ctx.beginPath();ctx.arc(px+pw/2-8+i*8,py+ph/2+dy,3,0,6.28);ctx.fill();}}

  // Reply
  if(t>5){var ra=Math.min(1,(t-5)*1.5)*a;
    drawBubble(ctx,px+pw*.3,py+100,'谢谢 我会努力的',{alpha:ra});}

  drawCenterText(ctx,W,H*1.7,'等了很久',{color:'rgba(180,190,220,'+a*.3+')',font:sf(13)+'px sans-serif'});
}

function renderReunion(ctx,W,H,t,p){
  var a=t<1?t:t>6?Math.max(0,8-t):1;
  drawCenterText(ctx,W,H,'他也上了大学\n联系恢复了\n但总差那么一点点',{color:'rgba(180,190,220,'+a+')'});

  // Subtle pulsing line
  if(t>2){var la=Math.min(1,(t-2)*.3)*a;
    ctx.setLineDash([4,8]);ctx.strokeStyle='rgba(200,180,255,'+la*.15+')';ctx.lineWidth=1;
    ctx.beginPath();ctx.moveTo(W*.15,H*.7);ctx.quadraticCurveTo(W*.5,H*.6-Math.sin(t*.5)*10,W*.85,H*.7);ctx.stroke();ctx.setLineDash([]);}
}

function renderConfession(ctx,W,H,t,p){
  if(t>2.5&&t<7){var a=Math.min(1,(t-2.5)*.5)*Math.min(1,(7-t)*.6);
    drawBubble(ctx,W*.6,H*.12,'其实…\n从那时候就喜欢你了',{alpha:a});}
  if(t>5&&t<9){var a=Math.min(1,(t-5)*.5)*Math.min(1,(9-t)*.6);
    drawBubble(ctx,W*.4,H*.22,'我也是',{alpha:a});}
  if(t>7){var a=Math.min(1,(t-7)*.4);
    drawBubble(ctx,W*.5,H*.88,'2023 年初 · 河套 · 护栏旁',{thought:true,alpha:a,bg:'rgba(0,0,0,.5)',color:'rgba(255,240,230,.9)',border:'rgba(255,255,255,.15)'});}
}

function renderProposal(ctx,W,H,t,p){
  if(t>2&&t<6){var a=Math.min(1,(t-2)*.5)*Math.min(1,(6-t)*.6);
    drawBubble(ctx,W*.4,H*.1,'嫁给我吧',{alpha:a});}
  if(t>5&&t<9){var a=Math.min(1,(t-5)*.5)*Math.min(1,(9-t)*.6);
    drawBubble(ctx,W*.6,H*.2,'😭 我愿意',{alpha:a});}
  if(t>7){var a=Math.min(1,(t-7)*.4);
    drawBubble(ctx,W*.5,H*.88,'乌兰察布 · 露营 · 烟花',{thought:true,alpha:a,bg:'rgba(0,0,0,.5)',color:'rgba(255,240,230,.9)',border:'rgba(255,255,255,.15)'});}
}

function renderEnding(ctx,W,H,t,p){
  // Real photo bg drawn by drawSceneBg
  var a=t<2?t/2:1;
  drawCenterText(ctx,W,H,'2023.11.09\n从此，每一天\n都是我们的故事',{color:'rgba(255,255,255,'+a+')',font:Math.min(W*.06,26)+'px "PingFang SC",sans-serif'});
  if(t>4){var ha=Math.min(1,(t-4)*.3);
    drawCenterText(ctx,W,H*.6+H*.35,'—— 520 快乐 ❤️',{color:'rgba(255,200,200,'+ha+')',font:Math.min(W*.05,22)+'px "PingFang SC",sans-serif'});}
}

var renderers={
  prologue:renderPrologue, primary:renderPrimary, middle:renderMiddle,
  high:renderHigh, mountain:renderMountain, burst:renderBurst,
  summer:renderSummer, parting:renderParting, typing:renderTyping,
  waiting:renderWaiting, reunion:renderReunion,
  confession:renderConfession, proposal:renderProposal, ending:renderEnding
};

/* ============================================================
   MAIN LOOP
   ============================================================ */
function mainLoop(ts){
  try{
    if(!lastFrame) lastFrame=ts;
    var dt=(ts-lastFrame)/1000;
    if(dt>0.5) dt=0.016;
    lastFrame=ts;
    if(!paused) globalTime+=dt;
    if(globalTime>totalDur) globalTime=totalDur-.01;

    ctx.clearRect(0,0,W,H);

    var sc=getSceneAt(globalTime);
    var scene=SCENES[sc.idx];

    // Draw scene bg
    drawSceneBg(ctx,W,H,scene.id,sc.local);

    // Fade
    var fadeIn=Math.min(1,sc.local/FADE_DUR);
    var fadeOut=Math.min(1,(scene.dur-sc.local)/FADE_DUR);
    var alpha=Math.min(fadeIn,fadeOut);

    ctx.save();ctx.globalAlpha=alpha;
    var fn=renderers[scene.id];
    if(fn) fn(ctx,W,H,sc.local,sc.progress);
    ctx.restore();

    // Progress
    var pf=document.getElementById('progress-fill');
    if(pf) pf.style.width=(globalTime/totalDur*100)+'%';
    var st=document.getElementById('scene-title');
    if(st) st.textContent=scene.label;
  }catch(e){console.error('mainLoop:',e);}
  requestAnimationFrame(mainLoop);
}

function togglePause(){
  paused=!paused;
  var icon=document.getElementById('pause-icon');
  if(paused){icon.textContent='\u275a\u275a';icon.classList.add('show');}
  else{icon.textContent='\u25b6';icon.classList.add('show');setTimeout(function(){icon.classList.remove('show');},600);}
}

function startAnimation(){
  var ss=document.getElementById('start-screen');
  if(ss) ss.style.display='none';
  document.getElementById('main-canvas').style.display='block';
  document.getElementById('controls').style.display='block';
  resize();
  requestAnimationFrame(mainLoop);
}

// Events
window.addEventListener('resize',resize);
var ss=document.getElementById('start-screen');
if(ss){ss.addEventListener('click',startAnimation);ss.addEventListener('touchend',function(e){e.preventDefault();startAnimation();});}
document.getElementById('main-canvas').addEventListener('click',togglePause);
document.getElementById('main-canvas').addEventListener('touchend',function(e){e.preventDefault();togglePause();});
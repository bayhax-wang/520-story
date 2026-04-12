/* ===== 工具 ===== */
function initCanvas(id){
  var c=document.getElementById(id),ctx=c.getContext('2d');
  var dpr=Math.min(window.devicePixelRatio||1,2);
  var r=c.parentElement.getBoundingClientRect();
  c.width=r.width*dpr;c.height=r.height*dpr;
  ctx.scale(dpr,dpr);
  return{c:c,ctx:ctx,W:r.width,H:r.height};
}

/* 他：蓝色卫衣少年 */
function drawBoy(ctx,x,y,t,walk,alpha){
  var a=alpha||1;
  ctx.save(); ctx.globalAlpha=a;
  var b=walk?Math.sin(t*3)*1.5:0;
  var legL=walk?Math.sin(t*4)*3:0;
  var armSwing=walk?Math.sin(t*4)*8:0;
  var headY=y-26+b;
  // 头发（深蓝短发）
  ctx.fillStyle='#2a3a6a';
  ctx.beginPath();ctx.arc(x,headY-1,7.5,Math.PI,0);ctx.fill();
  // 脸
  ctx.fillStyle='#fce4c8';
  ctx.beginPath();ctx.arc(x,headY,6.5,0,6.28);ctx.fill();
  // 眼睛
  ctx.fillStyle='#2a2a4a';
  ctx.beginPath();ctx.arc(x-2.5,headY-.5,1.2,0,6.28);ctx.fill();
  ctx.beginPath();ctx.arc(x+2.5,headY-.5,1.2,0,6.28);ctx.fill();
  // 嘴巴（微笑）
  ctx.strokeStyle='#c49080';ctx.lineWidth=.8;ctx.lineCap='round';
  ctx.beginPath();ctx.arc(x,headY+2.5,2,.1,Math.PI-.1);ctx.stroke();
  // 脖子
  ctx.fillStyle='#fce4c8';ctx.fillRect(x-1.5,headY+6,3,3);
  // 卫衣身体
  ctx.fillStyle='#4a6ab5';
  ctx.beginPath();
  ctx.moveTo(x-8,headY+9);ctx.lineTo(x+8,headY+9);
  ctx.lineTo(x+7,headY+24+b);ctx.lineTo(x-7,headY+24+b);ctx.closePath();ctx.fill();
  // 卫衣帽子轮廓
  ctx.fillStyle='#4a6ab5';
  ctx.beginPath();ctx.arc(x,headY-1,8.5,Math.PI+.3,-.3);ctx.lineWidth=2.5;ctx.strokeStyle='#4a6ab5';ctx.stroke();
  // 卫衣口袋
  ctx.fillStyle='#3d5a9e';ctx.fillRect(x-5,headY+18+b,10,4);
  // 手臂
  ctx.strokeStyle='#4a6ab5';ctx.lineWidth=3;ctx.lineCap='round';
  ctx.beginPath();ctx.moveTo(x-8,headY+12);ctx.lineTo(x-11-armSwing*.3,headY+22+b);ctx.stroke();
  ctx.beginPath();ctx.moveTo(x+8,headY+12);ctx.lineTo(x+11+armSwing*.3,headY+22+b);ctx.stroke();
  // 手（肤色小圆）
  ctx.fillStyle='#fce4c8';
  ctx.beginPath();ctx.arc(x-11-armSwing*.3,headY+23+b,2,0,6.28);ctx.fill();
  ctx.beginPath();ctx.arc(x+11+armSwing*.3,headY+23+b,2,0,6.28);ctx.fill();
  // 裤子
  ctx.fillStyle='#2a3050';
  ctx.beginPath();ctx.moveTo(x-7,headY+24+b);ctx.lineTo(x-6,headY+34+b);ctx.lineTo(x-1,headY+34+b);ctx.lineTo(x,headY+26+b);ctx.closePath();ctx.fill();
  ctx.beginPath();ctx.moveTo(x+7,headY+24+b);ctx.lineTo(x+6,headY+34+b);ctx.lineTo(x+1,headY+34+b);ctx.lineTo(x,headY+26+b);ctx.closePath();ctx.fill();
  // 腿部动画
  ctx.strokeStyle='#2a3050';ctx.lineWidth=4;
  ctx.beginPath();ctx.moveTo(x-3,headY+33+b);ctx.lineTo(x-4-legL,headY+40);ctx.stroke();
  ctx.beginPath();ctx.moveTo(x+3,headY+33+b);ctx.lineTo(x+4+legL,headY+40);ctx.stroke();
  // 鞋子
  ctx.fillStyle='#f0f0f0';
  ctx.beginPath();ctx.ellipse(x-4-legL,headY+41,3.5,2,0,0,6.28);ctx.fill();
  ctx.beginPath();ctx.ellipse(x+4+legL,headY+41,3.5,2,0,0,6.28);ctx.fill();
  ctx.restore();
}

/* 她：粉色马尾少女 */
function drawGirl(ctx,x,y,t,walk,alpha){
  var a=alpha||1;
  ctx.save(); ctx.globalAlpha=a;
  var b=walk?Math.sin(t*3)*1.5:0;
  var legL=walk?Math.sin(t*4)*2.5:0;
  var armSwing=walk?Math.sin(t*4)*6:0;
  var headY=y-26+b;
  // 头发（深棕长发 + 马尾）
  ctx.fillStyle='#5a3828';
  ctx.beginPath();ctx.arc(x,headY,8,0,6.28);ctx.fill();
  // 马尾辫（右侧飘动）
  ctx.strokeStyle='#5a3828';ctx.lineWidth=4;ctx.lineCap='round';
  var tailSwing=Math.sin(t*2)*3;
  ctx.beginPath();ctx.moveTo(x+5,headY-3);ctx.quadraticCurveTo(x+14+tailSwing,headY+2,x+12+tailSwing,headY+14);ctx.stroke();
  // 发带
  ctx.fillStyle='#ff8fab';ctx.beginPath();ctx.arc(x+5,headY-4,2.5,0,6.28);ctx.fill();
  // 脸
  ctx.fillStyle='#fce4c8';
  ctx.beginPath();ctx.arc(x,headY+1,6,0,6.28);ctx.fill();
  // 刘海
  ctx.fillStyle='#5a3828';
  ctx.beginPath();ctx.arc(x,headY-2,7,Math.PI+.5,-.5);ctx.fill();
  // 腮红
  ctx.fillStyle='rgba(255,150,150,.3)';
  ctx.beginPath();ctx.arc(x-4,headY+2.5,2,0,6.28);ctx.fill();
  ctx.beginPath();ctx.arc(x+4,headY+2.5,2,0,6.28);ctx.fill();
  // 眼睛（大一点，更可爱）
  ctx.fillStyle='#2a2a4a';
  ctx.beginPath();ctx.arc(x-2.5,headY+.5,1.4,0,6.28);ctx.fill();
  ctx.beginPath();ctx.arc(x+2.5,headY+.5,1.4,0,6.28);ctx.fill();
  // 眼睛高光
  ctx.fillStyle='#fff';
  ctx.beginPath();ctx.arc(x-2,headY+.2,.5,0,6.28);ctx.fill();
  ctx.beginPath();ctx.arc(x+3,headY+.2,.5,0,6.28);ctx.fill();
  // 嘴巴
  ctx.strokeStyle='#d4847a';ctx.lineWidth=.7;ctx.lineCap='round';
  ctx.beginPath();ctx.arc(x,headY+3.5,1.5,.2,Math.PI-.2);ctx.stroke();
  // 脖子
  ctx.fillStyle='#fce4c8';ctx.fillRect(x-1.5,headY+6.5,3,2.5);
  // 连衣裙上身
  ctx.fillStyle='#ffb3c6';
  ctx.beginPath();
  ctx.moveTo(x-7,headY+9);ctx.lineTo(x+7,headY+9);
  ctx.lineTo(x+6,headY+18+b);ctx.lineTo(x-6,headY+18+b);ctx.closePath();ctx.fill();
  // 裙摆（A字型）
  ctx.fillStyle='#ff9cb8';
  ctx.beginPath();
  ctx.moveTo(x-6,headY+18+b);
  ctx.quadraticCurveTo(x-10,headY+28+b,x-9,headY+30+b);
  ctx.lineTo(x+9,headY+30+b);
  ctx.quadraticCurveTo(x+10,headY+28+b,x+6,headY+18+b);
  ctx.closePath();ctx.fill();
  // 裙摆花边
  ctx.strokeStyle='rgba(255,255,255,.3)';ctx.lineWidth=.8;
  ctx.beginPath();
  for(var i=-8;i<=8;i+=3){ctx.moveTo(x+i,headY+30+b);ctx.lineTo(x+i+1.5,headY+32+b);ctx.lineTo(x+i+3,headY+30+b);}
  ctx.stroke();
  // 手臂
  ctx.strokeStyle='#fce4c8';ctx.lineWidth=2.5;ctx.lineCap='round';
  ctx.beginPath();ctx.moveTo(x-7,headY+11);ctx.lineTo(x-10-armSwing*.3,headY+20+b);ctx.stroke();
  ctx.beginPath();ctx.moveTo(x+7,headY+11);ctx.lineTo(x+10+armSwing*.3,headY+20+b);ctx.stroke();
  // 手
  ctx.fillStyle='#fce4c8';
  ctx.beginPath();ctx.arc(x-10-armSwing*.3,headY+21+b,1.8,0,6.28);ctx.fill();
  ctx.beginPath();ctx.arc(x+10+armSwing*.3,headY+21+b,1.8,0,6.28);ctx.fill();
  // 腿
  ctx.strokeStyle='#fce4c8';ctx.lineWidth=2.5;
  ctx.beginPath();ctx.moveTo(x-3,headY+30+b);ctx.lineTo(x-3.5-legL,headY+38);ctx.stroke();
  ctx.beginPath();ctx.moveTo(x+3,headY+30+b);ctx.lineTo(x+3.5+legL,headY+38);ctx.stroke();
  // 小皮鞋
  ctx.fillStyle='#d45070';
  ctx.beginPath();ctx.ellipse(x-3.5-legL,headY+39,3,1.8,0,0,6.28);ctx.fill();
  ctx.beginPath();ctx.ellipse(x+3.5+legL,headY+39,3,1.8,0,0,6.28);ctx.fill();
  ctx.restore();
}

/* 路人（灰调简化人物） */
function drawBystander(ctx,x,y,t,walk,alpha){
  var a=alpha||.4;
  ctx.save();ctx.globalAlpha=a;
  var b=walk?Math.sin(t*3)*1.2:0;
  var l=walk?Math.sin(t*4)*3:0;
  var headY=y-22+b;
  ctx.fillStyle='#8890a8';ctx.beginPath();ctx.arc(x,headY,5,0,6.28);ctx.fill();
  ctx.strokeStyle='#7880a0';ctx.lineWidth=2;ctx.lineCap='round';
  ctx.beginPath();ctx.moveTo(x,headY+5);ctx.lineTo(x,headY+18+b);ctx.stroke();
  ctx.beginPath();ctx.moveTo(x-6,headY+10);ctx.lineTo(x+6,headY+10);ctx.stroke();
  ctx.beginPath();ctx.moveTo(x,headY+18+b);ctx.lineTo(x-3-l,headY+27);ctx.stroke();
  ctx.beginPath();ctx.moveTo(x,headY+18+b);ctx.lineTo(x+3+l,headY+27);ctx.stroke();
  ctx.restore();
}

/* 兼容旧调用 */
function drawPerson(ctx,x,y,color,t,walk){
  if(color.indexOf('255,140,180')!==-1) drawGirl(ctx,x,y,t,walk);
  else if(color.indexOf('100,140,255')!==-1) drawBoy(ctx,x,y,t,walk);
  else drawBystander(ctx,x,y,t,walk);
}

function roundRect(ctx,x,y,w,h,r){
  ctx.beginPath();ctx.moveTo(x+r,y);ctx.lineTo(x+w-r,y);ctx.quadraticCurveTo(x+w,y,x+w,y+r);
  ctx.lineTo(x+w,y+h-r);ctx.quadraticCurveTo(x+w,y+h,x+w-r,y+h);ctx.lineTo(x+r,y+h);
  ctx.quadraticCurveTo(x,y+h,x,y+h-r);ctx.lineTo(x,y+r);ctx.quadraticCurveTo(x,y,x+r,y);ctx.closePath();
}

/* ===== 星空 ===== */
(function(){
  var c=document.getElementById('starfield'),ctx=c.getContext('2d'),stars=[],W,H;
  function resize(){W=c.width=innerWidth;H=c.height=innerHeight;mk();}
  function mk(){stars=[];for(var i=0;i<180;i++)stars.push({x:Math.random()*W,y:Math.random()*H,r:Math.random()*1.4+.3,a:Math.random()*.7+.2,s:Math.random()*.015+.004,p:Math.random()*6.28});}
  var f=0;
  function draw(){ctx.clearRect(0,0,W,H);f++;for(var i=0;i<stars.length;i++){var s=stars[i],fl=Math.sin(f*s.s+s.p)*.3+.7;ctx.beginPath();ctx.arc(s.x,s.y,s.r,0,6.28);ctx.fillStyle='rgba(200,210,255,'+s.a*fl+')';ctx.fill();}requestAnimationFrame(draw);}
  addEventListener('resize',resize);resize();draw();
})();

/* ===== 流星 ===== */
(function(){
  function spawn(){var s=document.createElement('div');s.className='shooting-star';var x=Math.random()*innerWidth*.7,y=Math.random()*innerHeight*.35,a=25+Math.random()*20,d=.5+Math.random()*.4;s.style.cssText='left:'+x+'px;top:'+y+'px;transform:rotate('+a+'deg);transition:opacity .2s,left '+d+'s linear,top '+d+'s linear';document.body.appendChild(s);requestAnimationFrame(function(){s.style.opacity='.7';s.style.left=(x+Math.cos(a*Math.PI/180)*280)+'px';s.style.top=(y+Math.sin(a*Math.PI/180)*280)+'px';setTimeout(function(){s.style.opacity='0';setTimeout(function(){s.remove();},300);},d*700);});setTimeout(spawn,4e3+Math.random()*7e3);}
  setTimeout(spawn,2e3);
})();

/* ===== 滚动触发 ===== */
var obs=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('visible');var s=e.target.dataset.scene;if(s)startScene(s);if(e.target.classList.contains('burst-container'))triggerBurst();}});},{threshold:.25});
document.querySelectorAll('[data-reveal]').forEach(function(el){obs.observe(el);});

var started={};
function startScene(n){if(started[n])return;started[n]=true;var fn={primary:scenePrimary,middle:sceneMiddle,high:sceneHigh,mountain:sceneMountain};fn[n]();}

/* ===== 小学：月夜教室 ===== */
function scenePrimary(){
  var o=initCanvas('cv-primary'),ctx=o.ctx,W=o.W,H=o.H,t=0;
  (function draw(){
    ctx.clearRect(0,0,W,H);t+=.02;
    var g=ctx.createLinearGradient(0,0,0,H);
    g.addColorStop(0,'#0c0c28');g.addColorStop(.6,'#141432');g.addColorStop(1,'#1a1a3a');
    ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
    // 月亮
    ctx.beginPath();ctx.arc(W*.8,H*.18,16,0,6.28);ctx.fillStyle='rgba(255,240,200,.85)';ctx.fill();
    ctx.beginPath();ctx.arc(W*.8+5,H*.18-3,13,0,6.28);ctx.fillStyle='#0c0c28';ctx.fill();
    // 小星
    for(var i=0;i<8;i++){var sx=W*(.1+i*.11),sy=H*(.08+Math.sin(i*1.7)*.12);ctx.beginPath();ctx.arc(sx,sy,1,0,6.28);ctx.fillStyle='rgba(220,230,255,'+(0.3+Math.sin(t+i)*.2)+')';ctx.fill();}
    // 建筑+屋顶
    var bY=H*.45;
    ctx.fillStyle='rgba(40,40,70,.9)';ctx.fillRect(W*.08,bY,W*.35,H*.42);ctx.fillRect(W*.57,bY,W*.35,H*.42);
    ctx.fillStyle='rgba(50,50,80,.9)';
    ctx.beginPath();ctx.moveTo(W*.05,bY);ctx.lineTo(W*.255,bY-18);ctx.lineTo(W*.46,bY);ctx.fill();
    ctx.beginPath();ctx.moveTo(W*.54,bY);ctx.lineTo(W*.745,bY-18);ctx.lineTo(W*.95,bY);ctx.fill();
    // 窗户
    var wc='rgba(255,220,150,'+(0.55+Math.sin(t*1.5)*.15)+')';ctx.fillStyle=wc;
    for(var i=0;i<3;i++){ctx.fillRect(W*.12+i*W*.09,bY+H*.08,W*.055,H*.09);ctx.fillRect(W*.12+i*W*.09,bY+H*.22,W*.055,H*.09);}
    for(var i=0;i<3;i++){ctx.fillRect(W*.61+i*W*.09,bY+H*.08,W*.055,H*.09);ctx.fillRect(W*.61+i*W*.09,bY+H*.22,W*.055,H*.09);}
    // 标签
    ctx.fillStyle='rgba(180,190,230,.65)';ctx.font='11px sans-serif';ctx.textAlign='center';
    ctx.fillText('1 班',W*.255,bY-22);ctx.fillText('2 班',W*.745,bY-22);
    // 小人
    drawBoy(ctx,W*.255,bY+H*.28,t,false);
    drawGirl(ctx,W*.745,bY+H*.28,t+1,false);
    // 虚线
    ctx.setLineDash([4,4]);ctx.strokeStyle='rgba(100,120,200,.15)';ctx.beginPath();ctx.moveTo(W*.5,bY);ctx.lineTo(W*.5,bY+H*.42);ctx.stroke();ctx.setLineDash([]);
    // 地面
    ctx.fillStyle='rgba(25,28,50,.8)';ctx.fillRect(0,bY+H*.42,W,H);
    requestAnimationFrame(draw);
  })();
}

/* ===== 初中：街道路灯 ===== */
function sceneMiddle(){
  var o=initCanvas('cv-middle'),ctx=o.ctx,W=o.W,H=o.H,t=0;
  (function draw(){
    ctx.clearRect(0,0,W,H);t+=.015;
    var g=ctx.createLinearGradient(0,0,0,H);g.addColorStop(0,'#10102a');g.addColorStop(1,'#1c1c40');ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
    var gY=H*.7;
    // 路灯
    for(var i=0;i<3;i++){var lx=W*.2+i*W*.3;ctx.strokeStyle='rgba(120,120,160,.5)';ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(lx,gY);ctx.lineTo(lx,gY-35);ctx.stroke();ctx.beginPath();ctx.arc(lx,gY-38,3,0,6.28);ctx.fillStyle='rgba(255,230,150,'+(0.5+Math.sin(t*2+i)*.2)+')';ctx.fill();var lg=ctx.createRadialGradient(lx,gY-38,0,lx,gY-38,28);lg.addColorStop(0,'rgba(255,230,150,.08)');lg.addColorStop(1,'transparent');ctx.fillStyle=lg;ctx.fillRect(lx-28,gY-66,56,56);}
    // 建筑
    ctx.fillStyle='rgba(40,40,65,.8)';ctx.fillRect(W*.02,gY-50,W*.25,50);
    ctx.fillStyle='rgba(45,40,65,.8)';ctx.fillRect(W*.73,gY-45,W*.25,45);
    ctx.fillStyle='rgba(255,220,150,'+(0.4+Math.sin(t*1.3)*.15)+')';ctx.fillRect(W*.78,gY-35,10,12);ctx.fillRect(W*.88,gY-35,10,12);
    ctx.fillStyle='rgba(180,190,230,.5)';ctx.font='9px sans-serif';ctx.textAlign='center';ctx.fillText('她的学校',W*.14,gY-55);
    ctx.fillStyle='rgba(180,190,230,.4)';ctx.fillText('他的家',W*.85,gY-50);
    // 街道
    ctx.fillStyle='rgba(50,50,80,.6)';ctx.fillRect(0,gY,W,H*.3);
    ctx.setLineDash([6,6]);ctx.strokeStyle='rgba(100,100,140,.25)';ctx.beginPath();ctx.moveTo(0,gY+12);ctx.lineTo(W,gY+12);ctx.stroke();ctx.setLineDash([]);
    ctx.fillStyle='rgba(140,150,190,.35)';ctx.font='9px sans-serif';ctx.textAlign='center';ctx.fillText('← 只隔一条街 →',W*.5,gY+25);
    // 小人
    var sx=W*.15+Math.sin(t*.5)*W*.08;
    drawGirl(ctx,sx,gY+6,t,true,.7);
    drawBoy(ctx,W*.83,gY+6,t,false,.5);
    requestAnimationFrame(draw);
  })();
}

/* ===== 高中：车站 ===== */
function sceneHigh(){
  var o=initCanvas('cv-high'),ctx=o.ctx,W=o.W,H=o.H,t=0,busX=-W*.4;
  (function draw(){
    ctx.clearRect(0,0,W,H);t+=.015;
    var g=ctx.createLinearGradient(0,0,0,H);g.addColorStop(0,'#1a1030');g.addColorStop(.4,'#2a1840');g.addColorStop(.7,'#3a2050');g.addColorStop(1,'#201535');ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
    var gY=H*.72;
    // 校舍
    ctx.fillStyle='rgba(30,25,50,.8)';ctx.fillRect(W*.6,gY-55,W*.35,55);ctx.fillRect(W*.65,gY-75,W*.15,20);
    ctx.fillStyle='rgba(180,170,210,.35)';ctx.font='9px sans-serif';ctx.textAlign='center';ctx.fillText('高中',W*.77,gY-80);
    // 夕阳
    var sg=ctx.createRadialGradient(W*.85,gY-55,5,W*.85,gY-55,60);sg.addColorStop(0,'rgba(255,140,80,.08)');sg.addColorStop(1,'transparent');ctx.fillStyle=sg;ctx.fillRect(W*.5,gY-115,W*.5,80);
    // 车站牌
    ctx.strokeStyle='rgba(140,130,170,.6)';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(W*.3,gY);ctx.lineTo(W*.3,gY-42);ctx.stroke();
    ctx.fillStyle='rgba(60,55,90,.9)';ctx.fillRect(W*.25,gY-48,W*.1,14);ctx.fillStyle='rgba(200,190,230,.6)';ctx.font='8px sans-serif';ctx.textAlign='center';ctx.fillText('公交站',W*.3,gY-39);
    // 地面
    ctx.fillStyle='rgba(35,30,55,.7)';ctx.fillRect(0,gY,W,H*.3);
    // 公交车
    if(t>2){busX=Math.min(W*.42,busX+1);ctx.fillStyle='rgba(55,75,125,.8)';roundRect(ctx,busX,gY-32,W*.3,26,4);ctx.fill();ctx.fillStyle='rgba(200,220,255,'+(0.3+Math.sin(t)*.1)+')';for(var i=0;i<4;i++)ctx.fillRect(busX+7+i*(W*.065),gY-28,W*.045,11);ctx.fillStyle='rgba(40,40,60,.9)';ctx.beginPath();ctx.arc(busX+W*.06,gY-2,4.5,0,6.28);ctx.fill();ctx.beginPath();ctx.arc(busX+W*.24,gY-2,4.5,0,6.28);ctx.fill();}
    // 小人
    drawBoy(ctx,W*.2,gY+6,t,false);
    drawGirl(ctx,W*.42,gY+6,t+.5,false);
    // 省略号
    var da=.2+Math.sin(t*1.5)*.1;ctx.fillStyle='rgba(180,180,210,'+da+')';
    for(var i=0;i<3;i++){ctx.beginPath();ctx.arc(W*.29+i*6,gY-15,1.5,0,6.28);ctx.fill();}
    requestAnimationFrame(draw);
  })();
}

/* ===== 毕业：山脉徒步 ===== */
function sceneMountain(){
  var o=initCanvas('cv-mountain'),ctx=o.ctx,W=o.W,H=o.H,t=0;
  (function draw(){
    ctx.clearRect(0,0,W,H);t+=.012;
    // 黎明
    var g=ctx.createLinearGradient(0,0,0,H);g.addColorStop(0,'#0e1028');g.addColorStop(.3,'#1a1540');g.addColorStop(.6,'#2a2050');g.addColorStop(.85,'#3a2848');g.addColorStop(1,'#2a2040');ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
    // 朝阳光晕
    var sunY=H*.28+Math.sin(t*.3)*3;var sg=ctx.createRadialGradient(W*.5,sunY,5,W*.5,sunY,80);sg.addColorStop(0,'rgba(255,180,100,.2)');sg.addColorStop(.5,'rgba(255,140,80,.06)');sg.addColorStop(1,'transparent');ctx.fillStyle=sg;ctx.fillRect(0,0,W,H);
    // 远山
    ctx.fillStyle='rgba(30,25,55,.7)';ctx.beginPath();ctx.moveTo(0,H*.55);ctx.quadraticCurveTo(W*.15,H*.3,W*.3,H*.45);ctx.quadraticCurveTo(W*.45,H*.25,W*.6,H*.4);ctx.quadraticCurveTo(W*.75,H*.2,W*.9,H*.38);ctx.quadraticCurveTo(W*.95,H*.32,W,H*.42);ctx.lineTo(W,H);ctx.lineTo(0,H);ctx.fill();
    // 近山
    ctx.fillStyle='rgba(35,30,60,.8)';ctx.beginPath();ctx.moveTo(0,H*.7);ctx.quadraticCurveTo(W*.2,H*.58,W*.4,H*.63);ctx.quadraticCurveTo(W*.6,H*.56,W*.8,H*.62);ctx.quadraticCurveTo(W*.95,H*.58,W,H*.65);ctx.lineTo(W,H);ctx.lineTo(0,H);ctx.fill();
    // 小路
    ctx.strokeStyle='rgba(100,90,140,.3)';ctx.lineWidth=2;ctx.setLineDash([4,3]);ctx.beginPath();ctx.moveTo(0,H*.72);ctx.quadraticCurveTo(W*.25,H*.64,W*.5,H*.66);ctx.quadraticCurveTo(W*.75,H*.62,W,H*.67);ctx.stroke();ctx.setLineDash([]);
    // 树
    for(var i=0;i<5;i++){var tx=W*(.08+i*.22),ty=H*(.68-Math.sin(i*1.3)*.04);ctx.fillStyle='rgba(40,55,70,.6)';ctx.beginPath();ctx.moveTo(tx,ty);ctx.lineTo(tx-6,ty+11);ctx.lineTo(tx+6,ty+11);ctx.fill();ctx.fillStyle='rgba(50,40,60,.5)';ctx.fillRect(tx-.8,ty+11,1.6,5);}
    // 五个徒步者 — 他(蓝)和她(粉)逐渐靠近
    var approach=Math.min(1,Math.max(0,(t-0.8)*.12));
    var heX=W*.22+(W*.46-W*.22)*approach;
    var sheX=W*.78-(W*.78-W*.54)*approach;
    var trailY=H*.65;
    // 路人
    drawBystander(ctx,W*.1,trailY+8,t,true,.35);
    drawBystander(ctx,W*.38,trailY+4,t+2,true,.35);
    drawBystander(ctx,W*.9,trailY+7,t+4,true,.35);
    // 他和她
    drawBoy(ctx,heX,trailY+6,t,true);
    drawGirl(ctx,sheX,trailY+6,t+1.5,true);
    // 靠近后出现连线光芒
    if(approach>.7){
      var midX=(heX+sheX)/2,a2=(approach-.7)/.3;
      ctx.beginPath();ctx.arc(midX,trailY-10,3+a2*8,0,6.28);
      var cg=ctx.createRadialGradient(midX,trailY-10,0,midX,trailY-10,3+a2*8);
      cg.addColorStop(0,'rgba(255,200,120,'+a2*.5+')');cg.addColorStop(1,'transparent');
      ctx.fillStyle=cg;ctx.fill();
    }
    // 靠近后出现粒子
    if(approach>.85){
      var a3=(approach-.85)/.15;
      for(var i=0;i<6;i++){
        var px=(heX+sheX)/2+Math.cos(t*2+i*1.05)*15*a3;
        var py=trailY-10+Math.sin(t*2+i*1.05)*10*a3;
        ctx.beginPath();ctx.arc(px,py,1.2,0,6.28);
        ctx.fillStyle='rgba(255,210,140,'+a3*.7+')';ctx.fill();
      }
    }
    requestAnimationFrame(draw);
  })();
}

/* ===== 爆发动画 ===== */
function triggerBurst(){
  var c=document.getElementById('burst-canvas'),ctx=c.getContext('2d');
  var cx=c.width/2,cy=c.height/2,ps=[];
  for(var i=0;i<50;i++){var a=Math.random()*6.28,sp=Math.random()*3+1;ps.push({x:cx,y:cy,vx:Math.cos(a)*sp,vy:Math.sin(a)*sp,life:1,d:Math.random()*.015+.008,r:Math.random()*2.5+1,h:30+Math.random()*30});}
  (function anim(){
    ctx.clearRect(0,0,c.width,c.height);var alive=false;
    for(var i=0;i<ps.length;i++){var p=ps[i];if(p.life<=0)continue;alive=true;p.x+=p.vx;p.y+=p.vy;p.vx*=.98;p.vy*=.98;p.life-=p.d;ctx.beginPath();ctx.arc(p.x,p.y,p.r*p.life,0,6.28);ctx.fillStyle='hsla('+p.h+',80%,70%,'+p.life+')';ctx.fill();}
    if(alive)requestAnimationFrame(anim);
  })();
}

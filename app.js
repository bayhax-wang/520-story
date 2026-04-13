/* ===== 工具 ===== */
function initCanvas(id){
  var c=document.getElementById(id),ctx=c.getContext('2d');
  var dpr=Math.min(window.devicePixelRatio||1,2);
  var r=c.parentElement.getBoundingClientRect();
  c.width=r.width*dpr;c.height=r.height*dpr;
  ctx.scale(dpr,dpr);
  return{c:c,ctx:ctx,W:r.width,H:r.height};
}

/* 他：蓝色卫衣少年（日漫风） */
function drawBoy(ctx,x,y,t,walk,alpha){
  var a=alpha===undefined?1:alpha;
  ctx.save(); ctx.globalAlpha=a;

  // 动画参数
  var bob=walk?Math.sin(t*3)*1.5:0;
  var legSwing=walk?Math.sin(t*4)*3.5:0;
  var armSwing=walk?Math.sin(t*4)*0.25:0;
  var hairBlow=Math.sin(t*2)*0.8+(walk?Math.sin(t*3.5)*1.2:0);

  // 基准：脚底y，角色总高约43px
  var feetY=y;
  var headCY=feetY-35+bob; // 头部中心

  // ── 鞋子 ──
  var shoeY=feetY-2;
  ctx.fillStyle='#f0f0f0';
  // 左鞋
  ctx.beginPath();ctx.ellipse(x-4-legSwing,shoeY,4,2.2,0,0,Math.PI*2);ctx.fill();
  // 右鞋
  ctx.beginPath();ctx.ellipse(x+4+legSwing,shoeY,4,2.2,0,0,Math.PI*2);ctx.fill();
  // 鞋底线
  ctx.strokeStyle='#bbb';ctx.lineWidth=0.5;
  ctx.beginPath();ctx.ellipse(x-4-legSwing,shoeY+1,3.8,1,0,0,Math.PI);ctx.stroke();
  ctx.beginPath();ctx.ellipse(x+4+legSwing,shoeY+1,3.8,1,0,0,Math.PI);ctx.stroke();

  // ── 腿/裤子 ──
  ctx.fillStyle='#2a3050';
  ctx.lineWidth=3.8;ctx.lineCap='round';ctx.strokeStyle='#2a3050';
  // 左腿
  ctx.beginPath();ctx.moveTo(x-3,headCY+18+bob);ctx.lineTo(x-4-legSwing,shoeY-2);ctx.stroke();
  // 右腿
  ctx.beginPath();ctx.moveTo(x+3,headCY+18+bob);ctx.lineTo(x+4+legSwing,shoeY-2);ctx.stroke();

  // ── 卫衣身体 ──
  // 主体
  ctx.fillStyle='#4a6ab5';
  ctx.beginPath();
  ctx.moveTo(x-9,headCY+5);
  ctx.quadraticCurveTo(x-10,headCY+12,x-8,headCY+19+bob);
  ctx.lineTo(x+8,headCY+19+bob);
  ctx.quadraticCurveTo(x+10,headCY+12,x+9,headCY+5);
  ctx.closePath();ctx.fill();
  // 中间拉链线
  ctx.strokeStyle='rgba(255,255,255,0.15)';ctx.lineWidth=0.6;
  ctx.beginPath();ctx.moveTo(x,headCY+6);ctx.lineTo(x,headCY+18+bob);ctx.stroke();
  // 口袋（横向矩形）
  ctx.fillStyle='#3d5a9e';
  ctx.beginPath();
  ctx.moveTo(x-6,headCY+14+bob);ctx.lineTo(x+6,headCY+14+bob);
  ctx.lineTo(x+5,headCY+17+bob);ctx.lineTo(x-5,headCY+17+bob);ctx.closePath();ctx.fill();
  // 口袋线
  ctx.strokeStyle='rgba(255,255,255,0.1)';ctx.lineWidth=0.4;
  ctx.beginPath();ctx.moveTo(x-5,headCY+14+bob);ctx.lineTo(x+5,headCY+14+bob);ctx.stroke();
  // 领口V
  ctx.strokeStyle='#3a5a9e';ctx.lineWidth=0.8;
  ctx.beginPath();ctx.moveTo(x-3,headCY+5);ctx.lineTo(x,headCY+8);ctx.lineTo(x+3,headCY+5);ctx.stroke();

  // ── 手臂 ──
  // 左臂
  ctx.save();
  ctx.translate(x-9,headCY+7);
  ctx.rotate(-0.15+armSwing);
  // 袖子
  ctx.fillStyle='#4a6ab5';
  ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(-2,9);ctx.lineTo(2,9);ctx.lineTo(3,0);ctx.closePath();ctx.fill();
  // 手
  ctx.fillStyle='#fce4c8';
  ctx.beginPath();ctx.arc(0,11,2.2,0,Math.PI*2);ctx.fill();
  ctx.restore();
  // 右臂
  ctx.save();
  ctx.translate(x+9,headCY+7);
  ctx.rotate(0.15-armSwing);
  ctx.fillStyle='#4a6ab5';
  ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(-2,9);ctx.lineTo(2,9);ctx.lineTo(3,0);ctx.closePath();ctx.fill();
  ctx.fillStyle='#fce4c8';
  ctx.beginPath();ctx.arc(0,11,2.2,0,Math.PI*2);ctx.fill();
  ctx.restore();

  // ── 脖子 ──
  ctx.fillStyle='#fce4c8';
  ctx.fillRect(x-2,headCY+2,4,4);

  // ── 头部 ──
  // 脸
  ctx.fillStyle='#fce4c8';
  ctx.beginPath();ctx.ellipse(x,headCY,7,7.5,0,0,Math.PI*2);ctx.fill();

  // ── 头发（深蓝蓬松短发）──
  ctx.fillStyle='#1e2d5a';
  // 后层头发（比脸宽）
  ctx.beginPath();
  ctx.moveTo(x-8,headCY+1);
  ctx.quadraticCurveTo(x-9,headCY-6,x-5,headCY-10+hairBlow*0.3);
  ctx.quadraticCurveTo(x-1,headCY-13,x+1,headCY-12.5+hairBlow*0.2);
  ctx.quadraticCurveTo(x+5,headCY-13,x+7,headCY-9+hairBlow*0.4);
  ctx.quadraticCurveTo(x+9,headCY-5,x+8,headCY+1);
  ctx.closePath();ctx.fill();
  // 刘海层次
  ctx.fillStyle='#243468';
  ctx.beginPath();
  ctx.moveTo(x-7,headCY-2);
  ctx.quadraticCurveTo(x-5,headCY-7,x-3,headCY-5+hairBlow*0.2);
  ctx.quadraticCurveTo(x-1,headCY-8,x+1,headCY-6);
  ctx.quadraticCurveTo(x+3,headCY-9,x+5,headCY-4+hairBlow*0.3);
  ctx.quadraticCurveTo(x+7,headCY-6,x+7,headCY-1);
  ctx.lineTo(x+6,headCY-1);
  ctx.quadraticCurveTo(x+3,headCY-5,x+1,headCY-4);
  ctx.quadraticCurveTo(x-2,headCY-6,x-4,headCY-3);
  ctx.lineTo(x-6,headCY-1);
  ctx.closePath();ctx.fill();
  // 发丝高光
  ctx.strokeStyle='rgba(100,140,220,0.25)';ctx.lineWidth=0.5;
  ctx.beginPath();ctx.moveTo(x-3,headCY-9);ctx.quadraticCurveTo(x-1,headCY-11,x+2,headCY-10);ctx.stroke();

  // 帽衫帽子轮廓（挂在脖子后）
  ctx.fillStyle='#4a6ab5';
  ctx.beginPath();
  ctx.moveTo(x-5,headCY+4);
  ctx.quadraticCurveTo(x-8,headCY+2,x-7,headCY+8);
  ctx.lineTo(x+7,headCY+8);
  ctx.quadraticCurveTo(x+8,headCY+2,x+5,headCY+4);
  ctx.closePath();ctx.fill();

  // ── 眼睛（日漫风大眼）──
  // 左眼
  ctx.fillStyle='#1a1a3a';
  ctx.beginPath();ctx.ellipse(x-3,headCY+0.5,1.6,2.2,0,0,Math.PI*2);ctx.fill();
  // 左眼虹膜
  ctx.fillStyle='#2a4a8a';
  ctx.beginPath();ctx.ellipse(x-3,headCY+0.8,1.1,1.5,0,0,Math.PI*2);ctx.fill();
  // 左眼高光
  ctx.fillStyle='#fff';
  ctx.beginPath();ctx.arc(x-2.3,headCY-0.2,0.7,0,Math.PI*2);ctx.fill();
  ctx.beginPath();ctx.arc(x-3.3,headCY+1.5,0.35,0,Math.PI*2);ctx.fill();

  // 右眼
  ctx.fillStyle='#1a1a3a';
  ctx.beginPath();ctx.ellipse(x+3,headCY+0.5,1.6,2.2,0,0,Math.PI*2);ctx.fill();
  ctx.fillStyle='#2a4a8a';
  ctx.beginPath();ctx.ellipse(x+3,headCY+0.8,1.1,1.5,0,0,Math.PI*2);ctx.fill();
  ctx.fillStyle='#fff';
  ctx.beginPath();ctx.arc(x+3.7,headCY-0.2,0.7,0,Math.PI*2);ctx.fill();
  ctx.beginPath();ctx.arc(x+2.7,headCY+1.5,0.35,0,Math.PI*2);ctx.fill();

  // 小鼻子
  ctx.fillStyle='rgba(220,180,160,0.5)';
  ctx.beginPath();ctx.arc(x,headCY+2.5,0.6,0,Math.PI*2);ctx.fill();

  // 微笑嘴巴
  ctx.strokeStyle='#c49080';ctx.lineWidth=0.7;ctx.lineCap='round';
  ctx.beginPath();
  ctx.moveTo(x-1.8,headCY+4);
  ctx.quadraticCurveTo(x,headCY+5.5,x+1.8,headCY+4);
  ctx.stroke();

  ctx.restore();
}

/* 她：粉色马尾少女（日漫风） */
function drawGirl(ctx,x,y,t,walk,alpha){
  var a=alpha===undefined?1:alpha;
  ctx.save(); ctx.globalAlpha=a;

  // 动画参数
  var bob=walk?Math.sin(t*3)*1.5:0;
  var legSwing=walk?Math.sin(t*4)*2.8:0;
  var armSwing=walk?Math.sin(t*4)*0.2:0;
  var skirtSway=walk?Math.sin(t*3.5)*2:Math.sin(t*0.8)*0.5;
  var tailSwing=Math.sin(t*2.2)*4+(walk?Math.sin(t*3)*2:0);
  var hairBlow=Math.sin(t*1.8)*1+(walk?Math.sin(t*2.5)*1.5:0);

  var feetY=y;
  var headCY=feetY-35+bob;

  // ── 鞋子 ──
  var shoeY=feetY-1.5;
  ctx.fillStyle='#d45070';
  ctx.beginPath();ctx.ellipse(x-3.5-legSwing,shoeY,3.5,2,0,0,Math.PI*2);ctx.fill();
  ctx.beginPath();ctx.ellipse(x+3.5+legSwing,shoeY,3.5,2,0,0,Math.PI*2);ctx.fill();
  // 鞋面装饰线
  ctx.strokeStyle='#c04060';ctx.lineWidth=0.4;
  ctx.beginPath();ctx.ellipse(x-3.5-legSwing,shoeY-0.5,2.5,1,0,Math.PI,0);ctx.stroke();
  ctx.beginPath();ctx.ellipse(x+3.5+legSwing,shoeY-0.5,2.5,1,0,Math.PI,0);ctx.stroke();

  // ── 腿 ──
  ctx.strokeStyle='#fce4c8';ctx.lineWidth=2.8;ctx.lineCap='round';
  ctx.beginPath();ctx.moveTo(x-3,headCY+22+bob);ctx.lineTo(x-3.5-legSwing,shoeY-2);ctx.stroke();
  ctx.beginPath();ctx.moveTo(x+3,headCY+22+bob);ctx.lineTo(x+3.5+legSwing,shoeY-2);ctx.stroke();

  // ── 裙子（A字型）──
  var skirtTop=headCY+12+bob;
  var skirtBot=headCY+24+bob;
  // 裙子主体
  ctx.fillStyle='#ff9cb8';
  ctx.beginPath();
  ctx.moveTo(x-6,skirtTop);
  ctx.quadraticCurveTo(x-11-skirtSway,skirtBot-3,x-10-skirtSway,skirtBot);
  ctx.lineTo(x+10+skirtSway,skirtBot);
  ctx.quadraticCurveTo(x+11+skirtSway,skirtBot-3,x+6,skirtTop);
  ctx.closePath();ctx.fill();
  // 褶皱线
  ctx.strokeStyle='rgba(200,80,120,0.2)';ctx.lineWidth=0.5;
  for(var i=-4;i<=4;i+=2.5){
    ctx.beginPath();
    ctx.moveTo(x+i,skirtTop+2);
    ctx.lineTo(x+i*1.4+skirtSway*0.3,skirtBot-1);
    ctx.stroke();
  }
  // 裙摆花边
  ctx.strokeStyle='rgba(255,255,255,0.35)';ctx.lineWidth=0.7;
  ctx.beginPath();
  for(var i=-9;i<=8;i+=3){
    var sx2=x+i+skirtSway*((i>0)?0.3:-0.3);
    ctx.moveTo(sx2,skirtBot);
    ctx.lineTo(sx2+1.5,skirtBot+1.5);
    ctx.lineTo(sx2+3,skirtBot);
  }
  ctx.stroke();

  // ── 连衣裙上身 ──
  ctx.fillStyle='#ffb3c6';
  ctx.beginPath();
  ctx.moveTo(x-7,headCY+5);
  ctx.quadraticCurveTo(x-8,headCY+10,x-6,skirtTop);
  ctx.lineTo(x+6,skirtTop);
  ctx.quadraticCurveTo(x+8,headCY+10,x+7,headCY+5);
  ctx.closePath();ctx.fill();
  // 小领口
  ctx.strokeStyle='#e8a0b0';ctx.lineWidth=0.6;
  ctx.beginPath();ctx.moveTo(x-3,headCY+4.5);ctx.lineTo(x,headCY+7);ctx.lineTo(x+3,headCY+4.5);ctx.stroke();
  // 领子
  ctx.fillStyle='#ffd0dd';
  ctx.beginPath();
  ctx.moveTo(x-4,headCY+4);
  ctx.lineTo(x-1,headCY+6);
  ctx.lineTo(x,headCY+5);
  ctx.lineTo(x+1,headCY+6);
  ctx.lineTo(x+4,headCY+4);
  ctx.quadraticCurveTo(x+2,headCY+3,x,headCY+3.5);
  ctx.quadraticCurveTo(x-2,headCY+3,x-4,headCY+4);
  ctx.closePath();ctx.fill();

  // ── 手臂 ──
  // 左臂
  ctx.save();
  ctx.translate(x-7,headCY+6);
  ctx.rotate(-0.12+armSwing);
  ctx.fillStyle='#ffb3c6';
  ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(-1.5,8);ctx.lineTo(1.5,8);ctx.lineTo(2.5,0);ctx.closePath();ctx.fill();
  ctx.fillStyle='#fce4c8';
  ctx.beginPath();ctx.arc(0,10,2,0,Math.PI*2);ctx.fill();
  ctx.restore();
  // 右臂
  ctx.save();
  ctx.translate(x+7,headCY+6);
  ctx.rotate(0.12-armSwing);
  ctx.fillStyle='#ffb3c6';
  ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(-1.5,8);ctx.lineTo(1.5,8);ctx.lineTo(2.5,0);ctx.closePath();ctx.fill();
  ctx.fillStyle='#fce4c8';
  ctx.beginPath();ctx.arc(0,10,2,0,Math.PI*2);ctx.fill();
  ctx.restore();

  // ── 脖子 ──
  ctx.fillStyle='#fce4c8';
  ctx.fillRect(x-1.5,headCY+2,3,3.5);

  // ── 头部 ──
  // 后层长发（垂下的部分，画在脸后面）
  ctx.fillStyle='#5a3828';
  ctx.beginPath();
  ctx.moveTo(x-7,headCY-2);
  ctx.quadraticCurveTo(x-9,headCY+5,x-7,headCY+14+hairBlow*0.5);
  ctx.lineTo(x-5,headCY+14+hairBlow*0.3);
  ctx.quadraticCurveTo(x-7,headCY+4,x-6,headCY-1);
  ctx.closePath();ctx.fill();
  // 右侧后层发
  ctx.beginPath();
  ctx.moveTo(x+6,headCY);
  ctx.quadraticCurveTo(x+8,headCY+4,x+6,headCY+10+hairBlow*0.4);
  ctx.lineTo(x+5,headCY+10+hairBlow*0.2);
  ctx.quadraticCurveTo(x+7,headCY+3,x+5,headCY+1);
  ctx.closePath();ctx.fill();

  // 脸
  ctx.fillStyle='#fce4c8';
  ctx.beginPath();ctx.ellipse(x,headCY,6.5,7,0,0,Math.PI*2);ctx.fill();

  // 腮红
  ctx.fillStyle='rgba(255,140,150,0.3)';
  ctx.beginPath();ctx.ellipse(x-4.5,headCY+3,2,1.2,0,0,Math.PI*2);ctx.fill();
  ctx.beginPath();ctx.ellipse(x+4.5,headCY+3,2,1.2,0,0,Math.PI*2);ctx.fill();

  // ── 头发（深棕色）──
  ctx.fillStyle='#5a3828';
  // 头顶发型
  ctx.beginPath();
  ctx.moveTo(x-7.5,headCY+1);
  ctx.quadraticCurveTo(x-9,headCY-5,x-5,headCY-10+hairBlow*0.2);
  ctx.quadraticCurveTo(x-2,headCY-13,x,headCY-12);
  ctx.quadraticCurveTo(x+3,headCY-13,x+6,headCY-9+hairBlow*0.3);
  ctx.quadraticCurveTo(x+8.5,headCY-4,x+7.5,headCY+1);
  ctx.closePath();ctx.fill();

  // 刘海（分层感）
  ctx.fillStyle='#6a4232';
  ctx.beginPath();
  ctx.moveTo(x-7,headCY-1);
  ctx.quadraticCurveTo(x-5,headCY-6,x-3,headCY-4+hairBlow*0.15);
  ctx.quadraticCurveTo(x-1,headCY-7,x+1,headCY-5);
  ctx.quadraticCurveTo(x+3,headCY-7.5,x+5,headCY-3+hairBlow*0.2);
  ctx.lineTo(x+6,headCY-1);
  ctx.lineTo(x+5,headCY-0.5);
  ctx.quadraticCurveTo(x+3,headCY-4,x+1,headCY-3);
  ctx.quadraticCurveTo(x-1,headCY-5,x-3,headCY-2);
  ctx.lineTo(x-6,headCY);
  ctx.closePath();ctx.fill();
  // 发丝高光
  ctx.strokeStyle='rgba(180,140,100,0.2)';ctx.lineWidth=0.5;
  ctx.beginPath();ctx.moveTo(x-2,headCY-9);ctx.quadraticCurveTo(x,headCY-11,x+3,headCY-9.5);ctx.stroke();

  // ── 侧马尾（右侧）──
  ctx.strokeStyle='#5a3828';ctx.lineWidth=4;ctx.lineCap='round';
  ctx.beginPath();
  ctx.moveTo(x+6,headCY-3);
  ctx.quadraticCurveTo(x+14+tailSwing*0.7,headCY+2+tailSwing*0.2,x+12+tailSwing,headCY+15);
  ctx.stroke();
  // 马尾尖端（变细）
  ctx.lineWidth=2.5;
  ctx.beginPath();
  ctx.moveTo(x+12+tailSwing,headCY+15);
  ctx.quadraticCurveTo(x+13+tailSwing*1.2,headCY+18,x+11+tailSwing*1.1,headCY+20);
  ctx.stroke();

  // ── 粉色蝴蝶结/发带 ──
  ctx.fillStyle='#ff8fab';
  // 中心结
  ctx.beginPath();ctx.arc(x+6,headCY-4,1.5,0,Math.PI*2);ctx.fill();
  // 左翼
  ctx.beginPath();
  ctx.moveTo(x+6,headCY-4);
  ctx.quadraticCurveTo(x+3,headCY-7,x+4.5,headCY-4);
  ctx.closePath();ctx.fill();
  // 右翼
  ctx.beginPath();
  ctx.moveTo(x+6,headCY-4);
  ctx.quadraticCurveTo(x+9,headCY-7.5,x+7.5,headCY-4);
  ctx.closePath();ctx.fill();
  // 下垂带子
  ctx.strokeStyle='#ff8fab';ctx.lineWidth=0.8;
  ctx.beginPath();ctx.moveTo(x+5.5,headCY-3);ctx.lineTo(x+4.5,headCY-0.5);ctx.stroke();
  ctx.beginPath();ctx.moveTo(x+6.5,headCY-3);ctx.lineTo(x+7,headCY-0.5);ctx.stroke();

  // ── 眼睛（日漫风，比男生稍大）──
  // 左眼
  ctx.fillStyle='#1a1a3a';
  ctx.beginPath();ctx.ellipse(x-2.8,headCY+0.5,1.8,2.5,0,0,Math.PI*2);ctx.fill();
  // 左眼虹膜
  ctx.fillStyle='#6a3828';
  ctx.beginPath();ctx.ellipse(x-2.8,headCY+0.8,1.2,1.7,0,0,Math.PI*2);ctx.fill();
  // 左眼双高光
  ctx.fillStyle='#fff';
  ctx.beginPath();ctx.arc(x-2,headCY-0.3,0.8,0,Math.PI*2);ctx.fill();
  ctx.beginPath();ctx.arc(x-3.2,headCY+1.6,0.4,0,Math.PI*2);ctx.fill();
  // 左眼睫毛
  ctx.strokeStyle='#1a1a3a';ctx.lineWidth=0.6;
  ctx.beginPath();ctx.moveTo(x-4.2,headCY-1.2);ctx.lineTo(x-1.5,headCY-1.5);ctx.stroke();
  ctx.beginPath();ctx.moveTo(x-4.5,headCY-0.5);ctx.lineTo(x-4.2,headCY-1.2);ctx.stroke();

  // 右眼
  ctx.fillStyle='#1a1a3a';
  ctx.beginPath();ctx.ellipse(x+2.8,headCY+0.5,1.8,2.5,0,0,Math.PI*2);ctx.fill();
  ctx.fillStyle='#6a3828';
  ctx.beginPath();ctx.ellipse(x+2.8,headCY+0.8,1.2,1.7,0,0,Math.PI*2);ctx.fill();
  ctx.fillStyle='#fff';
  ctx.beginPath();ctx.arc(x+3.6,headCY-0.3,0.8,0,Math.PI*2);ctx.fill();
  ctx.beginPath();ctx.arc(x+2.4,headCY+1.6,0.4,0,Math.PI*2);ctx.fill();
  // 右眼睫毛
  ctx.strokeStyle='#1a1a3a';ctx.lineWidth=0.6;
  ctx.beginPath();ctx.moveTo(x+1.5,headCY-1.5);ctx.lineTo(x+4.2,headCY-1.2);ctx.stroke();
  ctx.beginPath();ctx.moveTo(x+4.2,headCY-1.2);ctx.lineTo(x+4.5,headCY-0.5);ctx.stroke();

  // 小鼻子
  ctx.fillStyle='rgba(220,180,160,0.4)';
  ctx.beginPath();ctx.arc(x,headCY+2.8,0.5,0,Math.PI*2);ctx.fill();

  // 微笑嘴巴
  ctx.strokeStyle='#d4847a';ctx.lineWidth=0.6;ctx.lineCap='round';
  ctx.beginPath();
  ctx.moveTo(x-1.5,headCY+4.2);
  ctx.quadraticCurveTo(x,headCY+5.5,x+1.5,headCY+4.2);
  ctx.stroke();

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

/* 漫画对话气泡 */
function drawBubble(ctx,x,y,text,opts){
  opts=opts||{};
  var font=opts.font||'10px sans-serif';
  var color=opts.color||'rgba(255,255,255,.9)';
  var bg=opts.bg||'rgba(255,255,255,.12)';
  var border=opts.border||'rgba(255,255,255,.2)';
  var thought=opts.thought||false;
  var alpha=opts.alpha===undefined?1:opts.alpha;
  ctx.save();ctx.globalAlpha=alpha;
  ctx.font=font;var tw=ctx.measureText(text).width;
  var pw=tw+16,ph=20,px=x-pw/2,py=y-ph;
  if(thought){
    ctx.setLineDash([3,3]);ctx.strokeStyle=border;ctx.lineWidth=.8;
    roundRect(ctx,px,py,pw,ph,10);ctx.fillStyle=bg;ctx.fill();ctx.stroke();ctx.setLineDash([]);
    // 小圆点
    ctx.fillStyle=bg;
    ctx.beginPath();ctx.arc(x-3,y+2,2,0,6.28);ctx.fill();
    ctx.beginPath();ctx.arc(x-1,y+6,1.2,0,6.28);ctx.fill();
  }else{
    roundRect(ctx,px,py,pw,ph,10);ctx.fillStyle=bg;ctx.fill();
    ctx.strokeStyle=border;ctx.lineWidth=.6;ctx.stroke();
    // 尖角
    ctx.fillStyle=bg;
    ctx.beginPath();ctx.moveTo(x-3,y);ctx.lineTo(x,y+5);ctx.lineTo(x+3,y);ctx.fill();
  }
  ctx.fillStyle=color;ctx.textAlign='center';ctx.fillText(text,x,py+13.5);
  ctx.restore();
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
function startScene(n){if(started[n])return;started[n]=true;var fn={primary:scenePrimary,middle:sceneMiddle,high:sceneHigh,mountain:sceneMountain,summer:sceneSummer,parting:sceneParting,typing:sceneTyping,waiting:sceneWaiting,reunion:sceneReunion};if(fn[n])fn[n]();}

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
    // 💬 对话气泡
    var bubA=Math.min(1,Math.max(0,(t-1.5)*.5));
    if(bubA>0) drawBubble(ctx,W*.745,bY+H*.12,'那个男生好厉害…',{thought:true,alpha:bubA,bg:'rgba(255,180,200,.12)',border:'rgba(255,180,200,.25)',color:'rgba(255,200,220,.8)'});
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
    // 💬
    var bubA=Math.min(1,Math.max(0,(t-2)*.4));
    if(bubA>0) drawBubble(ctx,W*.5,gY-20,'只隔一条街，却不知道彼此',{thought:true,alpha:bubA*.6,bg:'rgba(180,190,255,.1)',border:'rgba(180,190,255,.15)',color:'rgba(180,190,230,.6)'});
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
    // 💬 对话
    var ba1=Math.min(1,Math.max(0,(t-1.5)*.5));
    if(ba1>0&&t<5) drawBubble(ctx,W*.42,gY-38,'…嘿',{alpha:ba1,bg:'rgba(255,180,200,.12)',border:'rgba(255,180,200,.2)',color:'rgba(255,200,220,.7)'});
    var ba2=Math.min(1,Math.max(0,(t-3)*.5));
    if(ba2>0&&t<7) drawBubble(ctx,W*.2,gY-38,'…',{alpha:ba2,bg:'rgba(120,160,255,.12)',border:'rgba(120,160,255,.2)',color:'rgba(160,190,255,.7)'});
    // 循环提示
    var ba3=Math.min(1,Math.max(0,(t-5)*.3));
    if(ba3>0) drawBubble(ctx,W*.31,gY-55,'打个招呼，坐同一趟车，但不讲话',{thought:true,alpha:ba3*.5,bg:'rgba(180,170,220,.08)',border:'rgba(180,170,220,.15)',color:'rgba(180,170,220,.5)'});
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
    // 💬
    if(approach>.5&&approach<.85){
      var ba=(approach-.5)/.35;
      drawBubble(ctx,sheX,trailY-38,'这次终于说上话了！',{alpha:ba,bg:'rgba(255,180,200,.12)',border:'rgba(255,180,200,.2)',color:'rgba(255,200,220,.8)'});
    }
    if(approach>.65&&approach<.95){
      var bb=(approach-.65)/.3;
      drawBubble(ctx,heX,trailY-38,'加个微信吧',{alpha:bb,bg:'rgba(120,160,255,.12)',border:'rgba(120,160,255,.2)',color:'rgba(160,190,255,.8)'});
    }
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


/* ===== 第二章 · 交汇 ===== */

/* 暑假群聊：仿微信界面 + 头像 + 时间戳 */
function sceneSummer(){
  var o=initCanvas('cv-summer'),ctx=o.ctx,W=o.W,H=o.H,t=0;
  var msgs=[
    {who:'she',name:'她',text:'今天爬山好开心啊！😆',time:'18:32'},
    {who:'he',name:'他',text:'哈哈 下次还去',time:'18:33'},
    {who:'other',name:'朋友A',text:'同意+1 腿都软了',time:'18:33'},
    {who:'she',name:'她',text:'你们暑假啥安排呀',time:'18:35'},
    {who:'he',name:'他',text:'在家 无聊死了',time:'18:36'},
    {who:'she',name:'她',text:'我也是哈哈哈',time:'18:36'},
    {who:'other2',name:'朋友B',text:'组队打游戏！',time:'18:37'},
    {who:'he',name:'他',text:'走 晚上开黑',time:'18:37'},
    {who:'she',name:'她',text:'我也要！',time:'18:38'},
    {who:'he',name:'他',text:'那晚上群里喊',time:'18:38'}
  ];
  var shown=0,lastT=-1;
  (function draw(){
    ctx.clearRect(0,0,W,H);t+=.018;
    // 背景
    ctx.fillStyle='#0e0e22';ctx.fillRect(0,0,W,H);
    // 手机
    var px=W*.15,py=H*.05,pw=W*.7,ph=H*.9;
    // 手机外壳
    roundRect(ctx,px-4,py-4,pw+8,ph+8,18);ctx.fillStyle='#2a2a3a';ctx.fill();
    // 屏幕
    roundRect(ctx,px,py,pw,ph,14);ctx.fillStyle='#111118';ctx.fill();
    // 状态栏
    ctx.fillStyle='rgba(200,200,220,.4)';ctx.font='8px sans-serif';ctx.textAlign='left';
    ctx.fillText('19:32',px+10,py+12);ctx.textAlign='right';
    ctx.fillText('📶 🔋',px+pw-10,py+12);
    // 导航栏
    ctx.fillStyle='rgba(30,30,45,.95)';ctx.fillRect(px,py+16,pw,28);
    ctx.fillStyle='rgba(140,160,255,.5)';ctx.font='8px sans-serif';ctx.textAlign='left';ctx.fillText('← ',px+8,py+33);
    ctx.fillStyle='rgba(220,220,240,.8)';ctx.font='bold 11px sans-serif';ctx.textAlign='center';
    ctx.fillText('我们五个人🏔️',px+pw/2,py+34);
    ctx.fillStyle='rgba(140,140,160,.4)';ctx.font='8px sans-serif';ctx.fillText('(5)',px+pw/2+52,py+34);
    ctx.strokeStyle='rgba(80,80,120,.3)';ctx.lineWidth=.5;
    ctx.beginPath();ctx.moveTo(px,py+44);ctx.lineTo(px+pw,py+44);ctx.stroke();
    // 消息区域
    var chatTop=py+48,chatH=ph-80;
    ctx.save();ctx.beginPath();ctx.rect(px,chatTop,pw,chatH);ctx.clip();
    // 生成消息
    if(t-lastT>1&&shown<msgs.length){lastT=t;shown++;}
    var cy=chatTop+8;
    for(var i=0;i<shown;i++){
      var m=msgs[i];
      var isRight=m.who==='she';
      // 头像颜色
      var avColor=m.who==='he'?'#4a6ab5':m.who==='she'?'#d4587a':'#606880';
      var avLabel=m.who==='he'?'他':m.who==='she'?'她':m.name.charAt(m.name.length-1);
      var bubbleColor=isRight?'#3d7a4a':'#2a2a40';
      if(m.who==='he')bubbleColor='#2a3a5a';
      ctx.font='10px sans-serif';var tw=ctx.measureText(m.text).width;
      var bw=Math.min(tw+16,pw-50),bh=22;
      // 气泡出现动画
      var age=t-lastT+((shown-i)*1);
      var alpha=Math.min(1,Math.max(0,(shown-i)*0.3));
      ctx.globalAlpha=alpha;
      if(isRight){
        // 右侧（她）
        var bx=px+pw-12-bw;
        // 头像
        ctx.fillStyle=avColor;ctx.beginPath();ctx.arc(px+pw-8,cy+bh/2+2,0,0,0);
        roundRect(ctx,px+pw-14,cy+1,12,12,3);ctx.fillStyle=avColor;ctx.fill();
        ctx.fillStyle='#fff';ctx.font='7px sans-serif';ctx.textAlign='center';ctx.fillText(avLabel,px+pw-8,cy+10);
        // 气泡
        roundRect(ctx,bx-4,cy,bw,bh,6);ctx.fillStyle=bubbleColor;ctx.fill();
        ctx.fillStyle='rgba(255,255,255,.88)';ctx.font='10px sans-serif';ctx.textAlign='left';
        ctx.fillText(m.text,bx+4,cy+15);
      }else{
        // 左侧
        roundRect(ctx,px+18,cy+1,12,12,3);ctx.fillStyle=avColor;ctx.fill();
        ctx.fillStyle='#fff';ctx.font='7px sans-serif';ctx.textAlign='center';ctx.fillText(avLabel,px+24,cy+10);
        roundRect(ctx,px+34,cy,bw,bh,6);ctx.fillStyle=bubbleColor;ctx.fill();
        ctx.fillStyle='rgba(255,255,255,.88)';ctx.font='10px sans-serif';ctx.textAlign='left';
        ctx.fillText(m.text,px+42,cy+15);
      }
      ctx.globalAlpha=1;
      cy+=bh+8;
    }
    ctx.restore();
    // 底部输入框
    ctx.fillStyle='rgba(25,25,40,.95)';ctx.fillRect(px,py+ph-32,pw,32);
    roundRect(ctx,px+8,py+ph-28,pw-50,20,8);ctx.fillStyle='rgba(40,40,60,.9)';ctx.fill();
    ctx.strokeStyle='rgba(80,80,120,.3)';ctx.lineWidth=.5;ctx.stroke();
    // 输入框闪烁光标
    if(shown>=msgs.length&&Math.sin(t*4)>0){
      ctx.fillStyle='rgba(200,200,220,.5)';ctx.fillRect(px+14,py+ph-23,1,11);
    }
    // 循环
    if(shown>=msgs.length&&t-lastT>4){shown=0;lastT=t;}
    requestAnimationFrame(draw);
  })();
}

/* 分别：火车站月台 */
function sceneParting(){
  var o=initCanvas('cv-parting'),ctx=o.ctx,W=o.W,H=o.H,t=0;
  var trainX=-W*.6;
  (function draw(){
    ctx.clearRect(0,0,W,H);t+=.01;
    // 傍晚天空
    var g=ctx.createLinearGradient(0,0,0,H);
    g.addColorStop(0,'#1a1030');g.addColorStop(.3,'#2a1838');g.addColorStop(.55,'#3a2545');g.addColorStop(.7,'#2a2040');g.addColorStop(1,'#1a1830');
    ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
    // 晚霞
    var sg=ctx.createRadialGradient(W*.3,H*.35,10,W*.3,H*.35,W*.4);
    sg.addColorStop(0,'rgba(255,120,60,.06)');sg.addColorStop(1,'transparent');
    ctx.fillStyle=sg;ctx.fillRect(0,0,W,H);
    var gY=H*.68;
    // 月台地面
    ctx.fillStyle='rgba(50,45,70,.85)';ctx.fillRect(0,gY,W,8);
    ctx.fillStyle='rgba(40,38,60,.7)';ctx.fillRect(0,gY+8,W,H);
    // 月台边缘黄线
    ctx.fillStyle='rgba(220,200,80,.4)';ctx.fillRect(0,gY,W,2);
    // 月台柱子
    for(var i=0;i<3;i++){
      var cx2=W*.15+i*W*.35;
      ctx.fillStyle='rgba(60,55,80,.7)';ctx.fillRect(cx2-3,gY-45,6,45);
      // 顶棚
      ctx.fillStyle='rgba(55,50,75,.6)';ctx.fillRect(cx2-20,gY-48,40,5);
      // 灯
      ctx.beginPath();ctx.arc(cx2,gY-42,3,0,6.28);
      ctx.fillStyle='rgba(255,230,150,'+(0.4+Math.sin(t*1.5+i)*.15)+')';ctx.fill();
      var lg=ctx.createRadialGradient(cx2,gY-42,0,cx2,gY-42,20);
      lg.addColorStop(0,'rgba(255,230,150,.06)');lg.addColorStop(1,'transparent');
      ctx.fillStyle=lg;ctx.fillRect(cx2-20,gY-62,40,40);
    }
    // 铁轨
    ctx.strokeStyle='rgba(100,95,130,.4)';ctx.lineWidth=1.5;
    ctx.beginPath();ctx.moveTo(0,gY+14);ctx.lineTo(W,gY+14);ctx.stroke();
    ctx.beginPath();ctx.moveTo(0,gY+20);ctx.lineTo(W,gY+20);ctx.stroke();
    // 枕木
    for(var i=0;i<15;i++){
      ctx.fillStyle='rgba(80,70,100,.3)';ctx.fillRect(i*W/14,gY+12,4,10);
    }
    // 火车驶来
    if(t>1.5){
      trainX=Math.min(W*.05,trainX+2);
      // 车身
      ctx.fillStyle='rgba(220,225,235,.9)';
      roundRect(ctx,trainX,gY-35+8,W*.8,28,4);ctx.fill();
      // 车窗
      for(var i=0;i<7;i++){
        ctx.fillStyle='rgba(180,210,255,'+(0.3+Math.sin(t+i)*.08)+')';
        ctx.fillRect(trainX+15+i*W*.1,gY-35+12,W*.07,14);
      }
      // 蓝色条纹
      ctx.fillStyle='rgba(60,100,180,.7)';ctx.fillRect(trainX,gY-35+8,W*.8,4);
      ctx.fillRect(trainX,gY-35+32,W*.8,4);
      // 车轮
      for(var i=0;i<4;i++){
        ctx.fillStyle='rgba(50,50,70,.9)';ctx.beginPath();
        ctx.arc(trainX+W*.1+i*W*.2,gY+4,5,0,6.28);ctx.fill();
      }
    }
    // 人物（火车没来时在月台上）
    if(trainX<-W*.2){
      // 她拖着行李箱
      drawGirl(ctx,W*.35,gY-2,t,false);
      // 行李箱
      ctx.fillStyle='rgba(200,120,140,.7)';roundRect(ctx,W*.35+12,gY-12,10,14,2);ctx.fill();
      ctx.strokeStyle='rgba(180,100,120,.5)';ctx.lineWidth=.8;
      ctx.beginPath();ctx.moveTo(W*.35+17,gY-12);ctx.lineTo(W*.35+17,gY-18);ctx.stroke();
      // 他站在旁边
      drawBoy(ctx,W*.55,gY-2,t,false);
    }else{
      // 火车停了，她走向车门
      var boardProgress=Math.min(1,(t-3)*.3);
      var sheX=W*.35-(W*.35-W*.15)*boardProgress;
      if(boardProgress<1){
        drawGirl(ctx,sheX,gY-2,t,boardProgress>.1);
        ctx.fillStyle='rgba(200,120,140,.7)';roundRect(ctx,sheX+12,gY-12,10,14,2);ctx.fill();
      }
      // 他留在原地，微微抬手
      drawBoy(ctx,W*.55,gY-2,t,false);
      // 他抬手挥别
      if(boardProgress>.3){
        ctx.strokeStyle='rgba(100,140,255,.6)';ctx.lineWidth=2;ctx.lineCap='round';
        var wave=Math.sin(t*5)*5;
        ctx.beginPath();ctx.moveTo(W*.55+8,gY-2-26+9+3);ctx.lineTo(W*.55+14+wave,gY-2-26+3);ctx.stroke();
      }
    }
    // 落叶（秋天氛围）
    for(var i=0;i<6;i++){
      var lx=(W*.05+i*W*.18+t*12+i*30)%W;
      var ly=H*.1+Math.sin(t*.8+i*2.3)*H*.2+i*8;
      ctx.save();ctx.translate(lx,ly);ctx.rotate(t*.5+i*1.2);
      ctx.fillStyle='rgba(200,140,60,'+(0.15+Math.sin(t+i)*.08)+')';
      ctx.beginPath();ctx.moveTo(0,-3);ctx.quadraticCurveTo(4,0,0,4);ctx.quadraticCurveTo(-4,0,0,-3);ctx.fill();
      ctx.restore();
    }
    requestAnimationFrame(draw);
  })();
}

/* 反复措辞：深夜台灯下 + 真实手机打字 */
function sceneTyping(){
  var o=initCanvas('cv-typing'),ctx=o.ctx,W=o.W,H=o.H,t=0;
  var drafts=[
    '加油啊，复读辛苦了，我会一直支持你的',
    '最近还好吗？别太累了，注意身体',
    '加油！'
  ];
  var phase=0,charIdx=0,curText='',deleting=false,pauseT=0,sent=false;
  (function draw(){
    ctx.clearRect(0,0,W,H);t+=.022;
    // 深夜房间背景
    var g=ctx.createLinearGradient(0,0,0,H);g.addColorStop(0,'#0a0a1a');g.addColorStop(1,'#101028');ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
    // 窗户（远处夜景）
    ctx.fillStyle='rgba(20,20,40,.8)';ctx.fillRect(W*.65,H*.05,W*.3,H*.35);
    ctx.strokeStyle='rgba(60,60,90,.5)';ctx.lineWidth=1;ctx.strokeRect(W*.65,H*.05,W*.3,H*.35);
    // 窗框十字
    ctx.beginPath();ctx.moveTo(W*.8,H*.05);ctx.lineTo(W*.8,H*.4);ctx.stroke();
    ctx.beginPath();ctx.moveTo(W*.65,H*.22);ctx.lineTo(W*.95,H*.22);ctx.stroke();
    // 窗外月亮
    ctx.beginPath();ctx.arc(W*.88,H*.12,6,0,6.28);ctx.fillStyle='rgba(255,240,200,.6)';ctx.fill();
    ctx.beginPath();ctx.arc(W*.88+2.5,H*.12-1.5,5,0,6.28);ctx.fillStyle='#0a0a1a';ctx.fill();
    // 窗外小星
    for(var i=0;i<4;i++){ctx.fillStyle='rgba(200,210,255,'+(0.2+Math.sin(t+i)*.1)+')';ctx.beginPath();ctx.arc(W*.7+i*W*.07,H*.1+Math.sin(i)*H*.05,0.8,0,6.28);ctx.fill();}
    // 桌面
    ctx.fillStyle='rgba(45,40,60,.9)';ctx.fillRect(0,H*.6,W,H*.4);
    ctx.fillStyle='rgba(55,50,72,.8)';ctx.fillRect(0,H*.6,W,3);
    // 台灯
    ctx.strokeStyle='rgba(120,110,140,.6)';ctx.lineWidth=2;
    ctx.beginPath();ctx.moveTo(W*.12,H*.6);ctx.lineTo(W*.12,H*.38);ctx.lineTo(W*.2,H*.32);ctx.stroke();
    // 灯光
    var lampG=ctx.createRadialGradient(W*.2,H*.32,3,W*.2,H*.5,W*.25);
    lampG.addColorStop(0,'rgba(255,230,180,'+(0.08+Math.sin(t)*.02)+')');lampG.addColorStop(1,'transparent');
    ctx.fillStyle=lampG;ctx.fillRect(0,H*.2,W*.5,H*.5);
    // 灯泡
    ctx.beginPath();ctx.arc(W*.2,H*.32,4,0,6.28);ctx.fillStyle='rgba(255,230,170,.7)';ctx.fill();
    // 手机（斜放在桌上，被手握着）
    ctx.save();ctx.translate(W*.45,H*.55);ctx.rotate(-.1);
    var px=-W*.2,py=-H*.3,pw=W*.4,ph2=H*.55;
    roundRect(ctx,px-2,py-2,pw+4,ph2+4,12);ctx.fillStyle='#1a1a2a';ctx.fill();
    roundRect(ctx,px,py,pw,ph2,10);ctx.fillStyle='#0a0a16';ctx.fill();
    // 手机聊天界面
    ctx.fillStyle='rgba(25,25,38,.95)';ctx.fillRect(px+2,py+2,pw-4,20);
    ctx.fillStyle='rgba(100,140,255,.6)';ctx.font='bold 8px sans-serif';ctx.textAlign='center';
    ctx.fillText('他',px+pw/2,py+14);
    // 输入框
    var ibY=py+ph2-25;
    roundRect(ctx,px+5,ibY,pw-10,18,6);ctx.fillStyle='rgba(30,30,50,.9)';ctx.fill();
    // 打字逻辑
    if(phase<2){
      var draft=drafts[phase];
      if(!deleting){
        if(pauseT>0)pauseT-=.022;
        else if(charIdx<draft.length){if(Math.floor(t*8)%2===0)charIdx++;curText=draft.substring(0,charIdx);}
        else{pauseT=1;deleting=true;}
      }else{
        if(pauseT>0)pauseT-=.022;
        else if(charIdx>0){if(Math.floor(t*14)%2===0)charIdx--;curText=draft.substring(0,charIdx);}
        else{phase++;charIdx=0;deleting=false;pauseT=.6;}
      }
    }else if(phase===2){
      var draft=drafts[2];
      if(charIdx<draft.length){if(Math.floor(t*5)%2===0)charIdx++;curText=draft.substring(0,charIdx);}
      else if(!sent){pauseT+=.022;if(pauseT>1.8)sent=true;}
    }
    if(!sent){
      // 正在输入的文字
      ctx.fillStyle='rgba(200,210,240,.8)';ctx.font='8px sans-serif';ctx.textAlign='left';
      var displayText=curText.length>18?curText.substring(curText.length-18):curText;
      ctx.fillText(displayText,px+10,ibY+12);
      // 光标
      if(Math.sin(t*5)>0){var twm=ctx.measureText(displayText).width;ctx.fillStyle='rgba(200,210,240,.6)';ctx.fillRect(px+11+twm,ibY+4,1,11);}
      // 删除时的红色闪烁
      if(deleting){ctx.fillStyle='rgba(255,80,80,'+(0.2+Math.sin(t*8)*.15)+')';roundRect(ctx,px+5,ibY,pw-10,18,6);ctx.fill();}
    }else{
      // 已发送
      var sa=Math.min(1,(pauseT-1.8)*2);
      ctx.globalAlpha=sa;
      var msgT='加油！';ctx.font='8px sans-serif';var tw3=ctx.measureText(msgT).width;
      roundRect(ctx,px+pw-8-tw3-10,py+35,tw3+10,16,5);ctx.fillStyle='rgba(80,180,100,.85)';ctx.fill();
      ctx.fillStyle='#fff';ctx.textAlign='right';ctx.fillText(msgT,px+pw-13,py+46);
      ctx.globalAlpha=1;
      // 发送成功提示
      ctx.fillStyle='rgba(100,200,120,.5)';ctx.font='7px sans-serif';ctx.textAlign='center';
      ctx.fillText('✓ 已送达',px+pw/2,py+60);
      pauseT+=.022;
      if(pauseT>5){phase=0;charIdx=0;curText='';deleting=false;pauseT=0;sent=false;}
    }
    ctx.restore();
    // 手的轮廓（简化）
    ctx.fillStyle='rgba(252,228,200,.15)';
    ctx.beginPath();ctx.ellipse(W*.52,H*.82,18,10,-.3,0,6.28);ctx.fill();
    // 深夜时钟
    ctx.fillStyle='rgba(140,150,190,.25)';ctx.font='9px sans-serif';ctx.textAlign='right';
    ctx.fillText('23:47',W*.95,H*.65);
    requestAnimationFrame(draw);
  })();
}

/* 等待回复：从白天到黑夜的时间流逝 */
function sceneWaiting(){
  var o=initCanvas('cv-waiting'),ctx=o.ctx,W=o.W,H=o.H,t=0;
  var phase2=0; // 0=等待 1=回复
  (function draw(){
    ctx.clearRect(0,0,W,H);t+=.012;
    // 天色随时间变化
    var dayProgress=(t%10)/10; // 0→1 循环
    var skyR,skyG,skyB;
    if(dayProgress<.3){skyR=15;skyG=15;skyB=35;} // 夜
    else if(dayProgress<.5){var p=(dayProgress-.3)/.2;skyR=15+p*25;skyG=15+p*20;skyB=35+p*15;} // 晨
    else if(dayProgress<.7){skyR=40;skyG=35;skyB=50;} // 日
    else{var p2=(dayProgress-.7)/.3;skyR=40-p2*25;skyG=35-p2*20;skyB=50-p2*15;} // 暮
    ctx.fillStyle='rgb('+Math.floor(skyR)+','+Math.floor(skyG)+','+Math.floor(skyB)+')';ctx.fillRect(0,0,W,H);
    // 手机居中
    var px=W*.22,py=H*.15,pw=W*.56,ph=H*.7;
    roundRect(ctx,px-3,py-3,pw+6,ph+6,14);ctx.fillStyle='#222230';ctx.fill();
    roundRect(ctx,px,py,pw,ph,11);ctx.fillStyle='#0c0c18';ctx.fill();
    // 她发的消息
    var msgT='加油！';ctx.font='9px sans-serif';var tw=ctx.measureText(msgT).width;
    roundRect(ctx,px+pw-10-tw-12,py+30,tw+12,18,6);ctx.fillStyle='rgba(80,180,100,.8)';ctx.fill();
    ctx.fillStyle='rgba(255,255,255,.85)';ctx.textAlign='right';ctx.fillText(msgT,px+pw-16,py+42);
    // 已读
    ctx.fillStyle='rgba(140,150,190,.3)';ctx.font='7px sans-serif';ctx.textAlign='right';ctx.fillText('已读',px+pw-10,py+55);
    // 时间流逝标记
    var hours=['23:47','00:15','06:30','12:00','18:20','22:00'];
    var hIdx=Math.floor(dayProgress*hours.length)%hours.length;
    ctx.fillStyle='rgba(140,150,190,.35)';ctx.font='8px sans-serif';ctx.textAlign='center';
    ctx.fillText(hours[hIdx],px+pw/2,py+70);
    // 等待的三个点
    var waitPhase=t%10;
    if(waitPhase<7){
      // 三个点跳动
      for(var i=0;i<3;i++){
        var dy=Math.sin(t*3+i*.9)*3;
        ctx.fillStyle='rgba(150,160,200,'+(0.25+Math.sin(t*2+i)*.12)+')';
        ctx.beginPath();ctx.arc(px+pw/2-8+i*8,py+ph/2+dy,2.5,0,6.28);ctx.fill();
      }
      // "对方正在输入..." 偶尔闪现
      if(Math.sin(t*0.5)>.7){
        ctx.fillStyle='rgba(150,160,200,.2)';ctx.font='7px sans-serif';ctx.textAlign='center';
        ctx.fillText('对方正在输入...',px+pw/2,py+ph/2+18);
      }
    }else{
      // 回复出现
      var ra=Math.min(1,(waitPhase-7)*1.5);
      ctx.globalAlpha=ra;
      var reply='谢谢 我会努力的';ctx.font='9px sans-serif';var rw=ctx.measureText(reply).width;
      roundRect(ctx,px+10,py+85,rw+12,18,6);ctx.fillStyle='rgba(50,60,90,.85)';ctx.fill();
      ctx.fillStyle='rgba(255,255,255,.85)';ctx.textAlign='left';ctx.fillText(reply,px+16,py+97);
      ctx.globalAlpha=1;
      // 开心的小光芒
      for(var i=0;i<5;i++){
        var sx=px+10+rw/2+Math.cos(t*2+i*1.26)*18*ra;
        var sy=py+92+Math.sin(t*2+i*1.26)*10*ra;
        ctx.fillStyle='rgba(255,210,140,'+(0.15+Math.sin(t*3+i)*.1)+')';
        ctx.beginPath();ctx.arc(sx,sy,1.2,0,6.28);ctx.fill();
      }
    }
    // 手机外的她（坐在窗边看手机的剪影）
    ctx.globalAlpha=.3;
    drawGirl(ctx,W*.85,H*.7,t,false,.3);
    ctx.globalAlpha=1;
    requestAnimationFrame(draw);
  })();
}

/* 重逢：两所大学夜景 */
function sceneReunion(){
  var o=initCanvas('cv-reunion'),ctx=o.ctx,W=o.W,H=o.H,t=0;
  (function draw(){
    ctx.clearRect(0,0,W,H);t+=.01;
    // 夜空
    var g=ctx.createLinearGradient(0,0,0,H);g.addColorStop(0,'#0a0a20');g.addColorStop(.5,'#121230');g.addColorStop(1,'#181838');
    ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
    // 星星
    for(var i=0;i<15;i++){
      var sx=W*(.05+i*.065),sy=H*(.04+Math.sin(i*2.3)*.12);
      ctx.fillStyle='rgba(200,210,255,'+(0.2+Math.sin(t*.8+i)*.15)+')';
      ctx.beginPath();ctx.arc(sx,sy,0.8+Math.sin(i)*.3,0,6.28);ctx.fill();
    }
/* sceneReunion 续 — 粘到 ch2.js 末尾 */
    var gY=H*.65;
    // 左侧大学建筑群
    ctx.fillStyle='rgba(35,32,55,.85)';
    ctx.fillRect(W*.02,gY-55,W*.2,55);ctx.fillRect(W*.08,gY-72,W*.12,17);
    // 窗户亮灯
    for(var r=0;r<2;r++)for(var c=0;c<3;c++){
      ctx.fillStyle='rgba(255,220,150,'+(0.25+Math.sin(t*1.2+r+c)*.1)+')';
      ctx.fillRect(W*.04+c*W*.06,gY-50+r*22,5,8);
    }
    // 校门
    ctx.strokeStyle='rgba(100,90,140,.4)';ctx.lineWidth=1;
    ctx.beginPath();ctx.moveTo(W*.12,gY);ctx.lineTo(W*.12,gY-10);ctx.lineTo(W*.2,gY-10);ctx.lineTo(W*.2,gY);ctx.stroke();
    ctx.fillStyle='rgba(160,155,200,.4)';ctx.font='7px sans-serif';ctx.textAlign='center';ctx.fillText('她的大学',W*.15,gY-14);
    // 右侧大学
    ctx.fillStyle='rgba(35,32,55,.85)';
    ctx.fillRect(W*.78,gY-55,W*.2,55);ctx.fillRect(W*.8,gY-72,W*.12,17);
    for(var r=0;r<2;r++)for(var c=0;c<3;c++){
      ctx.fillStyle='rgba(255,220,150,'+(0.25+Math.sin(t*1.5+r+c+2)*.1)+')';
      ctx.fillRect(W*.8+c*W*.06,gY-50+r*22,5,8);
    }
    ctx.strokeStyle='rgba(100,90,140,.4)';ctx.lineWidth=1;
    ctx.beginPath();ctx.moveTo(W*.82,gY);ctx.lineTo(W*.82,gY-10);ctx.lineTo(W*.9,gY-10);ctx.lineTo(W*.9,gY);ctx.stroke();
    ctx.fillStyle='rgba(160,155,200,.4)';ctx.font='7px sans-serif';ctx.textAlign='center';ctx.fillText('他的大学',W*.86,gY-14);
    // 地面
    ctx.fillStyle='rgba(25,25,45,.7)';ctx.fillRect(0,gY,W,H*.35);
    // 人物
    drawGirl(ctx,W*.16,gY+6,t,false);
    drawBoy(ctx,W*.84,gY+6,t,false);
    // 虚线纽带（呼吸感）
    var dashA=0.12+Math.sin(t*.7)*.06;
    ctx.setLineDash([3,7]);ctx.strokeStyle='rgba(200,180,255,'+dashA+')';ctx.lineWidth=1;
    ctx.beginPath();ctx.moveTo(W*.25,gY-8);
    ctx.quadraticCurveTo(W*.5,gY-20-Math.sin(t*.5)*8,W*.75,gY-8);ctx.stroke();ctx.setLineDash([]);
    // 中间的脉搏光点
    var pulseX=W*.5+Math.sin(t*.6)*W*.15;
    var pulseA=0.15+Math.sin(t*2)*.1;
    ctx.beginPath();ctx.arc(pulseX,gY-14-Math.sin(t*.5)*4,2.5,0,6.28);
    ctx.fillStyle='rgba(255,180,200,'+pulseA+')';ctx.fill();
    var pg=ctx.createRadialGradient(pulseX,gY-14,0,pulseX,gY-14,12);
    pg.addColorStop(0,'rgba(255,180,200,.06)');pg.addColorStop(1,'transparent');
    ctx.fillStyle=pg;ctx.fillRect(pulseX-12,gY-26,24,24);
    // "差那么一点点" — 手写感
    ctx.fillStyle='rgba(180,170,215,'+(0.18+Math.sin(t*.6)*.06)+')';ctx.font='italic 9px sans-serif';ctx.textAlign='center';
    ctx.fillText('好像差了那么一点点',W*.5,gY+H*.22);
    // 偶尔的手机亮屏（她在看手机）
    if(Math.sin(t*.4)>.5){
      ctx.fillStyle='rgba(180,200,255,.08)';ctx.fillRect(W*.13,gY-8,6,10);
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

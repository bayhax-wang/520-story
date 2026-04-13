/* ═══════════════════════════════════════════
   520 Love Runner — 双人联网跑酷
   ═══════════════════════════════════════════ */
(function () {
'use strict';

var SCENES = [
  { name:'小学', dist:3000, sky:['#87CEEB','#B0E0E6'], gnd:'#4CAF50', gnd2:'#388E3C',
    obs:['📚','🎒'], item:'✈️', bg:'school', desc:'那年我们还小' },
  { name:'高中', dist:3500, sky:['#FF8C42','#FFD700'], gnd:'#8D6E63', gnd2:'#6D4C41',
    obs:['📝','⏰'], item:'❤️', bg:'bus', desc:'课间操偷看你' },
  { name:'毕业徒步', dist:4000, sky:['#0D1B2A','#1B2838'], gnd:'#37474F', gnd2:'#263238',
    obs:['🪨','🌿'], item:'⭐', bg:'mountain', desc:'星空下并肩走过' },
  { name:'分别', dist:3500, sky:['#546E7A','#78909C'], gnd:'#455A64', gnd2:'#37474F',
    obs:['🧳','☂️'], item:'💌', bg:'train', sp:'apart', desc:'各自远行' },
  { name:'表白', dist:3000, sky:['#2C1810','#4A2C2A'], gnd:'#2E7D32', gnd2:'#1B5E20',
    obs:['💭','😊'], item:'🌹', bg:'river', sp:'closer', desc:'鼓起勇气对你说' },
  { name:'求婚', dist:3000, sky:['#1A0533','#2D1B69'], gnd:'#2E7D32', gnd2:'#1B5E20',
    obs:['😰'], item:'💍', bg:'firework', sp:'fireworks', desc:'嫁给我好吗' },
  { name:'结局', dist:2500, sky:['#FF9800','#FFB74D'], gnd:'#FFCC80', gnd2:'#FFB74D',
    obs:[], item:'❤️', bg:'beach', sp:'finale', desc:'从此在一起' }
];

var GRV=0.6, JV=-12.5, DJV=-10.5, BSPD=4.2, GYR=0.78;
var CW=26, CH=40, HITD=120, HITSLOW=0.4;
var canvas,ctx,W,H,gY;
var myRole='liang', isHost=false, isSolo=false;
var conn=null, peer=null, roomCode='';
var running=false, fN=0, score=0;
var sIdx=0, sDist=0, camX=0;
var localC, remoteC;
var parts=[], obs=[], items=[], plats=[], stars=[], fwP=[];
var finPhase=0, finTimer=0;
var scTxtAlpha=0, scTxtStr='';
var endConfetti=[];

/* Audio */
var ac=null;
function snd(t){try{
  if(!ac)ac=new(window.AudioContext||window.webkitAudioContext)();
  var o=ac.createOscillator(),g=ac.createGain();
  o.connect(g);g.connect(ac.destination);var n=ac.currentTime;
  if(t==='jump'){o.type='sine';o.frequency.setValueAtTime(400,n);o.frequency.linearRampToValueAtTime(800,n+.1);g.gain.setValueAtTime(.12,n);g.gain.linearRampToValueAtTime(0,n+.15);o.start(n);o.stop(n+.15);}
  if(t==='collect'){o.type='sine';o.frequency.setValueAtTime(800,n);o.frequency.linearRampToValueAtTime(1200,n+.08);g.gain.setValueAtTime(.1,n);g.gain.linearRampToValueAtTime(0,n+.2);o.start(n);o.stop(n+.2);}
  if(t==='hit'){o.type='square';o.frequency.setValueAtTime(150,n);o.frequency.linearRampToValueAtTime(50,n+.2);g.gain.setValueAtTime(.08,n);g.gain.linearRampToValueAtTime(0,n+.25);o.start(n);o.stop(n+.25);}
  if(t==='scene'){o.type='triangle';o.frequency.setValueAtTime(300,n);o.frequency.linearRampToValueAtTime(600,n+.3);g.gain.setValueAtTime(.08,n);g.gain.linearRampToValueAtTime(0,n+.5);o.start(n);o.stop(n+.5);}
}catch(e){}}

function mkC(role,x){return{role:role,x:x,y:0,vy:0,onG:true,jmp:0,spd:BSPD,slT:0,blT:0,rF:0,rT:0,rot:0,isL:false,tx:x,ty:0};}

/* DOM refs */
var $lob=document.getElementById('lobby');
var $gm=document.getElementById('game-container');
var $end=document.getElementById('ending');
var $bc=document.getElementById('btn-create');
var $bj=document.getElementById('btn-join');
var $bs=document.getElementById('btn-solo');
var $ri=document.getElementById('room-input');
var $rinfo=document.getElementById('room-info');
var $rc=document.getElementById('room-code-value');
var $bcp=document.getElementById('btn-copy');
var $st=document.getElementById('status-msg');
var $sn=document.getElementById('scene-name');
var $sd=document.getElementById('score-display');
var $pf=document.getElementById('progress-fill');
var $tz=document.getElementById('touch-zone');
var $br=document.getElementById('btn-replay');
var $es=document.getElementById('ending-score');

document.querySelectorAll('.role-btn').forEach(function(b){
  b.addEventListener('click',function(){
    document.querySelectorAll('.role-btn').forEach(function(r){r.classList.remove('active');});
    b.classList.add('active');myRole=b.dataset.role;
  });
});

/* Networking */
function gc(){return Math.random().toString(36).substring(2,6).toUpperCase();}
function showSt(m,c){$st.textContent=m;$st.className=c||'';$st.classList.remove('hidden');}
function setupConn(c){conn=c;conn.on('data',onD);conn.on('close',function(){if(running){isSolo=true;conn=null;}});}
function txSend(o){if(conn&&conn.open)try{conn.send(o);}catch(e){}}

function onD(d){
  if(!d||!d.type)return;
  if(d.type==='start')startG();
  if(d.type==='jump'&&remoteC)doJ(remoteC);
  if(d.type==='pos'&&remoteC){remoteC.tx=d.x;remoteC.ty=d.y;}
  if(d.type==='hit'&&remoteC)apH(remoteC);
  if(d.type==='collect')colR(d.id);
  if(d.type==='finish')showEnd();
}

$bc.addEventListener('click',function(){
  roomCode=gc();
  peer=new Peer('runner520-'+roomCode);
  peer.on('open',function(){
    $rc.textContent=roomCode;$rinfo.classList.remove('hidden');isHost=true;
  });
  peer.on('connection',function(c){
    setupConn(c);
    c.on('open',function(){
      txSend({type:'role',role:myRole});
      setTimeout(function(){txSend({type:'start'});startG();},500);
    });
  });
  peer.on('error',function(e){showSt('连接失败: '+e.type,'error');});
});

$bj.addEventListener('click',function(){
  var code=$ri.value.trim().toUpperCase();if(!code)return;roomCode=code;
  peer=new Peer('runner520-'+roomCode+'-p2');
  peer.on('open',function(){
    showSt('正在连接…');
    var c=peer.connect('runner520-'+roomCode,{reliable:true});
    c.on('open',function(){setupConn(c);txSend({type:'role',role:myRole});showSt('已连接！','ok');});
    c.on('error',function(){showSt('连接失败','error');});
  });
  peer.on('error',function(e){showSt('连接失败: '+e.type,'error');});
});

$bs.addEventListener('click',function(){isSolo=true;startG();});
$bcp.addEventListener('click',function(){
  navigator.clipboard.writeText(roomCode).catch(function(){});
  $bcp.textContent='✅';setTimeout(function(){$bcp.textContent='📋';},1500);
});
$br.addEventListener('click',function(){$end.classList.add('hidden');resetG();startG();});

/* Canvas init */
function initC(){
  canvas=document.getElementById('game-canvas');ctx=canvas.getContext('2d');
  doRsz();window.addEventListener('resize',doRsz);
}
function doRsz(){W=window.innerWidth;H=window.innerHeight;canvas.width=W;canvas.height=H;gY=Math.floor(H*GYR);}

function resetG(){
  sIdx=0;sDist=0;score=0;fN=0;camX=0;finPhase=0;finTimer=0;
  parts=[];obs=[];items=[];plats=[];fwP=[];stars=[];endConfetti=[];
  mkStars();
  localC=mkC(myRole,100);localC.isL=true;localC.y=gY-CH;
  var rr=myRole==='liang'?'ruyue':'liang';
  remoteC=mkC(rr,170);remoteC.y=gY-CH;remoteC.ty=remoteC.y;
  genLvl();
}

function startG(){
  $lob.classList.add('hidden');$gm.classList.remove('hidden');$end.classList.add('hidden');
  initC();resetG();running=true;requestAnimationFrame(loop);
}

/* Level gen */
function genLvl(){
  obs=[];items=[];plats=[];
  var sc=SCENES[sIdx];if(!sc)return;
  var d=sc.dist,off=500;
  if(sc.obs.length>0){
    var n=Math.floor(d/250);
    for(var i=0;i<n;i++){
      var ox=off+i*(d/n)+(Math.random()*100-50);
      var em=sc.obs[Math.floor(Math.random()*sc.obs.length)];
      var air=Math.random()<0.28;
      obs.push({x:ox,y:air?gY-CH-65:gY-50,emoji:em,w:50,h:50,hit:false});
    }
  }
  var cn=Math.floor(d/280);
  for(var i=0;i<cn;i++){
    var cx=400+i*(d/cn)+(Math.random()*100);
    var cy=gY-55-(Math.random()<0.4?45:0);
    items.push({id:sIdx*1000+i,x:cx,y:cy,emoji:sc.item,w:40,h:40,got:false,ph:Math.random()*6.28});
  }
  var pn=Math.floor(d/650);
  for(var i=0;i<pn;i++){
    var px=600+i*(d/pn)+(Math.random()*80);
    plats.push({x:px,y:gY-70-Math.random()*35,w:80+Math.random()*30,h:12});
  }
}

function mkStars(){
  stars=[];
  for(var i=0;i<80;i++)
    stars.push({x:Math.random()*5000,y:Math.random()*(H?H*0.5:300),s:Math.random()*2+0.5,p:Math.random()*6.28});
}

/* Input */
function hJump(){if(!running||finPhase>0)return;doJ(localC);txSend({type:'jump'});snd('jump');}
$tz.addEventListener('mousedown',function(e){e.preventDefault();hJump();});
$tz.addEventListener('touchstart',function(e){e.preventDefault();hJump();},{passive:false});
document.addEventListener('keydown',function(e){
  if(e.code==='Space'||e.code==='ArrowUp'){e.preventDefault();hJump();}
});

/* Physics */
function doJ(c){if(c.jmp<2){c.vy=c.jmp===0?JV:DJV;c.onG=false;c.jmp++;}}
function apH(c){c.slT=HITD;c.blT=HITD;snd('hit');}
function colR(id){
  for(var i=0;i<items.length;i++){
    if(items[i].id===id&&!items[i].got){items[i].got=true;score++;spP(items[i].x-camX,items[i].y,'#ff6b9d');break;}
  }
}

function updC(c){
  var sc=SCENES[sIdx];
  if(c.isL||(isSolo&&c===remoteC)){
    var spd=BSPD;
    if(sc&&sc.sp==='apart'&&c===remoteC)spd=BSPD*0.7;
    if(sc&&sc.sp==='closer'&&c===remoteC)spd=BSPD*1.4;
    if(c.slT>0){spd*=HITSLOW;c.slT--;}
    if(c.blT>0)c.blT--;
    c.spd=spd;
    c.vy+=GRV;c.y+=c.vy;
    // platform collision
    if(c.vy>=0){
      for(var i=0;i<plats.length;i++){
        var p=plats[i];
        if(c.x+CW>p.x&&c.x<p.x+p.w&&c.y+CH>=p.y&&c.y+CH<=p.y+14){
          c.y=p.y-CH;c.vy=0;c.onG=true;c.jmp=0;break;
        }
      }
    }
    // ground
    if(c.y+CH>=gY){c.y=gY-CH;c.vy=0;c.onG=true;c.jmp=0;}
    c.x+=spd;
    // run anim
    c.rT++;if(c.rT>8){c.rF=1-c.rF;c.rT=0;}
    if(!c.onG)c.rot+=0.05;else c.rot*=0.8;
    // obstacle collision
    for(var i=0;i<obs.length;i++){
      var o=obs[i];if(o.hit)continue;
      if(c.x+CW>o.x+4&&c.x<o.x+o.w-4&&c.y+CH>o.y+4&&c.y<o.y+o.h-4){
        o.hit=true;apH(c);if(c.isL)txSend({type:'hit'});
      }
    }
    // item collection
    for(var i=0;i<items.length;i++){
      var co=items[i];if(co.got)continue;
      if(c.x+CW>co.x&&c.x<co.x+co.w&&c.y+CH>co.y&&c.y<co.y+co.h){
        co.got=true;score++;snd('collect');spP(co.x-camX,co.y,'#ff6b9d');
        if(c.isL)txSend({type:'collect',id:co.id});
      }
    }
    if(isSolo&&c===remoteC)aiT(c);
  }else{
    // remote interpolation
    c.x+=(c.tx-c.x)*0.15;c.y+=(c.ty-c.y)*0.15;
    if(c.blT>0)c.blT--;if(c.slT>0)c.slT--;
    c.rT++;if(c.rT>8){c.rF=1-c.rF;c.rT=0;}
  }
}

function aiT(c){
  for(var i=0;i<obs.length;i++){
    var o=obs[i];if(o.hit)continue;var dx=o.x-c.x;
    if(dx>0&&dx<140&&o.y>gY-50&&c.onG)doJ(c);
  }
  for(var i=0;i<items.length;i++){
    var co=items[i];if(co.got)continue;var dx=co.x-c.x;
    if(dx>0&&dx<110&&co.y<gY-50&&c.onG)doJ(c);
  }
}

/* Particles */
function spP(sx,sy,col){
  for(var i=0;i<10;i++)
    parts.push({x:sx,y:sy,vx:(Math.random()-.5)*5,vy:(Math.random()-.5)*5-2,
      l:30+Math.random()*15,col:col,sz:2+Math.random()*3});
}
function updP(){
  for(var i=parts.length-1;i>=0;i--){
    var p=parts[i];p.x+=p.vx;p.y+=p.vy;p.vy+=0.1;p.l--;
    if(p.l<=0)parts.splice(i,1);
  }
}
function spFW(){
  var x=Math.random()*W,y=Math.random()*(gY*0.4),h=Math.random()*360;
  for(var i=0;i<25;i++){
    var a=(i/25)*6.28,sp=2+Math.random()*3;
    fwP.push({x:x,y:y,vx:Math.cos(a)*sp,vy:Math.sin(a)*sp,
      l:35+Math.random()*15,col:'hsl('+h+',100%,'+(55+Math.random()*30)+'%)',sz:2+Math.random()*2});
  }
}
function updFW(){
  for(var i=fwP.length-1;i>=0;i--){
    var p=fwP[i];p.x+=p.vx;p.y+=p.vy;p.vy+=0.04;p.vx*=0.98;p.l--;
    if(p.l<=0)fwP.splice(i,1);
  }
}

/* Draw: sky */
function drSky(sc){
  var g=ctx.createLinearGradient(0,0,0,gY);
  g.addColorStop(0,sc.sky[0]);g.addColorStop(1,sc.sky[1]);
  ctx.fillStyle=g;ctx.fillRect(0,0,W,gY);
}

/* Draw: background elements */
function drBg(sc){
  var px=camX,t=sc.bg;
  ctx.save();

  if(t==='school'){
    ctx.fillStyle='rgba(0,0,0,0.12)';
    for(var i=0;i<6;i++){
      var bx=((i*280)-px*0.15)%1600;
      if(bx<-150)bx+=1600;if(bx>W+50)continue;
      ctx.fillRect(bx,gY-110,90,110);
      ctx.fillRect(bx+15,gY-135,60,25);
      ctx.fillStyle='rgba(255,255,200,0.25)';
      for(var r=0;r<3;r++)
        for(var c2=0;c2<3;c2++)
          ctx.fillRect(bx+12+c2*25,gY-100+r*30,14,18);
      ctx.fillStyle='rgba(0,0,0,0.12)';
    }
  }

  if(t==='bus'){
    ctx.fillStyle='rgba(0,0,0,0.1)';
    for(var i=0;i<4;i++){
      var bx=((i*450)-px*0.12)%1800;
      if(bx<-100)bx+=1800;if(bx>W+50)continue;
      ctx.fillRect(bx+35,gY-90,5,90);
      ctx.fillRect(bx,gY-90,80,7);
      ctx.fillRect(bx+8,gY-25,60,5);
    }
  }

  if(t==='mountain'){
    for(var i=0;i<stars.length;i++){
      var s=stars[i];var sx=((s.x-px*0.03)%W+W)%W;
      var al=0.3+0.4*Math.sin(s.p+fN*0.02);
      ctx.fillStyle='rgba(255,255,255,'+al+')';
      ctx.beginPath();ctx.arc(sx,s.y,s.s,0,6.28);ctx.fill();
    }
    ctx.fillStyle='rgba(0,0,0,0.2)';ctx.beginPath();ctx.moveTo(0,gY);
    for(var x=0;x<=W;x+=40){
      var mx=(x+px*0.08)*0.008;
      var h2=Math.sin(mx)*70+Math.sin(mx*2.5)*35+90;
      ctx.lineTo(x,gY-h2);
    }
    ctx.lineTo(W,gY);ctx.fill();
  }

  if(t==='train'){
    ctx.strokeStyle='rgba(180,200,220,0.25)';ctx.lineWidth=1;
    for(var i=0;i<50;i++){
      var rx=(i*31+fN*1.5)%W,ry=(i*47+fN*7)%gY;
      ctx.beginPath();ctx.moveTo(rx,ry);ctx.lineTo(rx-1,ry+12);ctx.stroke();
    }
    ctx.strokeStyle='rgba(150,150,150,0.25)';ctx.lineWidth=2;
    ctx.beginPath();ctx.moveTo(0,gY-3);ctx.lineTo(W,gY-3);ctx.stroke();
    for(var x2=0;x2<W;x2+=30){
      var tx2=((x2-px*0.5)%W+W)%W;
      ctx.fillStyle='rgba(120,120,120,0.2)';ctx.fillRect(tx2,gY-6,18,3);
    }
  }

  if(t==='river'){
    ctx.fillStyle='rgba(255,240,200,0.9)';
    ctx.beginPath();ctx.arc(W*0.75,gY*0.2,35,0,6.28);ctx.fill();
    ctx.fillStyle='rgba(255,240,200,0.15)';
    ctx.beginPath();ctx.arc(W*0.75,gY*0.2,55,0,6.28);ctx.fill();
    ctx.fillStyle='rgba(100,140,200,0.2)';ctx.fillRect(0,gY-10,W,10);
  }

  if(t==='firework'){
    for(var i=0;i<stars.length;i++){
      var s=stars[i];var sx=((s.x-px*0.02)%W+W)%W;
      var al=0.2+0.3*Math.sin(s.p+fN*0.015);
      ctx.fillStyle='rgba(255,255,255,'+al+')';
      ctx.beginPath();ctx.arc(sx,s.y,s.s,0,6.28);ctx.fill();
    }
    for(var i=0;i<fwP.length;i++){
      var p=fwP[i];ctx.globalAlpha=p.l/50;ctx.fillStyle=p.col;
      ctx.beginPath();ctx.arc(p.x,p.y,p.sz,0,6.28);ctx.fill();
    }
    ctx.globalAlpha=1;
  }

  if(t==='beach'){
    ctx.fillStyle='rgba(255,200,50,0.8)';
    ctx.beginPath();ctx.arc(W*0.5,gY*0.3,45,0,6.28);ctx.fill();
    ctx.fillStyle='rgba(255,200,50,0.15)';
    ctx.beginPath();ctx.arc(W*0.5,gY*0.3,80,0,6.28);ctx.fill();
    ctx.strokeStyle='rgba(100,180,255,0.3)';ctx.lineWidth=2;
    for(var w=0;w<3;w++){
      ctx.beginPath();
      for(var x=0;x<=W;x+=5){
        var wy=gY-8+w*4+Math.sin((x+fN*1.5+w*50)*0.02)*4;
        if(x===0)ctx.moveTo(x,wy);else ctx.lineTo(x,wy);
      }
      ctx.stroke();
    }
  }

  ctx.restore();
}

/* Draw: ground, platforms, obstacles, items */
function drGnd(sc){
  ctx.fillStyle=sc.gnd;ctx.fillRect(0,gY,W,H-gY);
  ctx.fillStyle=sc.gnd2;ctx.fillRect(0,gY,W,4);
}

function drPlats(){
  for(var i=0;i<plats.length;i++){
    var p=plats[i],px=p.x-camX;
    if(px>W+50||px<-150)continue;
    ctx.fillStyle='rgba(160,120,80,0.7)';ctx.fillRect(px,p.y,p.w,p.h);
    ctx.fillStyle='rgba(130,100,60,0.5)';ctx.fillRect(px,p.y+p.h,p.w,3);
  }
}

function drObs(){
  for(var i=0;i<obs.length;i++){
    var o=obs[i];if(o.hit)continue;
    var ox=o.x-camX;if(ox>W+50||ox<-80)continue;
    /* danger glow */
    ctx.save();
    ctx.shadowColor='rgba(255,60,60,0.6)';ctx.shadowBlur=12;
    /* base block */
    var bx=ox,by=o.y,bw=o.w,bh=o.h;
    ctx.fillStyle='rgba(80,20,20,0.45)';
    roundRect(ctx,bx,by,bw,bh,8);ctx.fill();
    /* warning stripes */
    ctx.strokeStyle='rgba(255,200,0,0.5)';ctx.lineWidth=2;
    ctx.beginPath();ctx.moveTo(bx+4,by+bh-4);ctx.lineTo(bx+bw-4,by+4);ctx.stroke();
    ctx.beginPath();ctx.moveTo(bx+12,by+bh-4);ctx.lineTo(bx+bw-4,by+12);ctx.stroke();
    ctx.restore();
    /* emoji on top, bigger */
    ctx.font='40px serif';ctx.textAlign='center';ctx.textBaseline='middle';
    ctx.fillText(o.emoji,ox+bw/2,by+bh/2);
  }
}
function roundRect(c,x,y,w,h,r){
  c.beginPath();c.moveTo(x+r,y);c.lineTo(x+w-r,y);
  c.quadraticCurveTo(x+w,y,x+w,y+r);c.lineTo(x+w,y+h-r);
  c.quadraticCurveTo(x+w,y+h,x+w-r,y+h);c.lineTo(x+r,y+h);
  c.quadraticCurveTo(x,y+h,x,y+h-r);c.lineTo(x,y+r);
  c.quadraticCurveTo(x,y,x+r,y);c.closePath();
}

function drItems(){
  for(var i=0;i<items.length;i++){
    var c=items[i];if(c.got)continue;
    var cx=c.x-camX;if(cx>W+50||cx<-60)continue;
    var fl=Math.sin(c.ph+fN*0.06)*6;
    /* golden glow */
    ctx.save();
    ctx.shadowColor='rgba(255,215,0,0.7)';ctx.shadowBlur=15;
    ctx.font='36px serif';ctx.textAlign='center';ctx.textBaseline='middle';
    ctx.fillText(c.emoji,cx+c.w/2,c.y+c.h/2+fl);
    ctx.restore();
  }
}

/* Draw: character */
function drChar(c){
  var sx=c.x-camX,sy=c.y;
  if(sx<-50||sx>W+50)return;
  if(c.blT>0&&Math.floor(c.blT/4)%2===0)return;
  ctx.save();
  ctx.translate(sx+CW/2,sy+CH/2);
  if(!c.onG)ctx.rotate(c.rot);
  var isL=c.role==='liang';
  var hd=isL?'#4a9eff':'#ff6b9d';
  var bd=isL?'#2d7dd2':'#e84393';
  // head
  ctx.fillStyle=hd;
  ctx.fillRect(-10,-CH/2,20,18);
  // eyes
  ctx.fillStyle='#fff';
  ctx.fillRect(-6,-CH/2+5,5,5);
  ctx.fillRect(2,-CH/2+5,5,5);
  ctx.fillStyle='#333';
  ctx.fillRect(-5,-CH/2+6,3,3);
  ctx.fillRect(3,-CH/2+6,3,3);
  // blush for ruyue
  if(!isL){
    ctx.fillStyle='rgba(255,150,150,0.5)';
    ctx.fillRect(-8,-CH/2+11,4,3);
    ctx.fillRect(5,-CH/2+11,4,3);
  }
  // body
  ctx.fillStyle=bd;
  ctx.fillRect(-8,-CH/2+18,16,14);
  // skirt for ruyue
  if(!isL){
    ctx.fillStyle='#e84393';
    ctx.beginPath();
    ctx.moveTo(-10,-CH/2+30);
    ctx.lineTo(10,-CH/2+30);
    ctx.lineTo(12,-CH/2+38);
    ctx.lineTo(-12,-CH/2+38);
    ctx.closePath();ctx.fill();
  }
  // legs
  ctx.fillStyle=isL?'#1a5276':'#c0392b';
  var legBase=-CH/2+(isL?32:38);
  var legH=CH/2-Math.abs(legBase+CH/2)+CH/2;
  var legOff=c.rF?3:-3;
  ctx.fillRect(-6,legBase,5,8+legOff);
  ctx.fillRect(2,legBase,5,8-legOff);
  ctx.restore();
}

/* Draw: particles */
function drParts(){
  for(var i=0;i<parts.length;i++){
    var p=parts[i];
    ctx.globalAlpha=Math.max(0,p.l/45);
    ctx.fillStyle=p.col;
    ctx.beginPath();ctx.arc(p.x,p.y,p.sz,0,6.28);ctx.fill();
  }
  ctx.globalAlpha=1;
}

/* Draw: scene transition text */
function showScTxt(s){scTxtStr=s;scTxtAlpha=1;}
function drScTxt(){
  if(scTxtAlpha<=0)return;
  ctx.save();ctx.globalAlpha=Math.min(1,scTxtAlpha);
  ctx.fillStyle='rgba(0,0,0,0.5)';ctx.fillRect(0,H*0.35,W,H*0.3);
  ctx.fillStyle='#fff';ctx.font='bold 28px sans-serif';
  ctx.textAlign='center';ctx.textBaseline='middle';
  ctx.fillText(scTxtStr,W/2,H/2);
  ctx.restore();
  scTxtAlpha-=0.008;
}

/* Draw: finale overlay */
function drFinale(){
  if(finPhase<2)return;
  var cx=W/2,cy=gY-CH;
  ctx.save();
  ctx.font=(30+Math.sin(fN*0.1)*5)+'px serif';
  ctx.textAlign='center';ctx.textBaseline='middle';
  ctx.fillText('\uD83D\uDC95',cx,cy-30-Math.sin(fN*0.05)*10);
  ctx.font='20px serif';
  for(var i=0;i<6;i++){
    var a=(i/6)*6.28+fN*0.02;
    var r=40+Math.sin(fN*0.03+i)*10;
    ctx.fillText('\u2764\uFE0F',cx+Math.cos(a)*r,cy-20+Math.sin(a)*r);
  }
  ctx.restore();
}

/* Ending */
function showEnd(){
  running=false;
  $gm.classList.add('hidden');
  $end.classList.remove('hidden');
  $es.textContent='共收集 \u2764\uFE0F \u00D7 '+score;
  // Ending canvas confetti
  var ec=document.getElementById('ending-canvas');
  var ectx=ec.getContext('2d');
  ec.width=W||window.innerWidth;
  ec.height=H||window.innerHeight;
  endConfetti=[];
  for(var i=0;i<80;i++){
    endConfetti.push({
      x:Math.random()*ec.width,y:Math.random()*ec.height-ec.height,
      vx:(Math.random()-0.5)*2,vy:1+Math.random()*3,
      sz:4+Math.random()*6,
      col:'hsl('+(Math.random()*360)+',80%,65%)',
      rot:Math.random()*6.28,rv:0.02+Math.random()*0.05
    });
  }
  function animEnd(){
    ectx.clearRect(0,0,ec.width,ec.height);
    // gradient bg
    var g=ectx.createLinearGradient(0,0,0,ec.height);
    g.addColorStop(0,'#1a0533');g.addColorStop(1,'#0f3460');
    ectx.fillStyle=g;ectx.fillRect(0,0,ec.width,ec.height);
    for(var i=0;i<endConfetti.length;i++){
      var c=endConfetti[i];
      c.x+=c.vx;c.y+=c.vy;c.rot+=c.rv;
      if(c.y>ec.height+10){c.y=-10;c.x=Math.random()*ec.width;}
      ectx.save();ectx.translate(c.x,c.y);ectx.rotate(c.rot);
      ectx.fillStyle=c.col;ectx.fillRect(-c.sz/2,-c.sz/2,c.sz,c.sz);
      ectx.restore();
    }
    if(!running)requestAnimationFrame(animEnd);
  }
  animEnd();
}

/* Main game loop */
function loop(){
  if(!running)return;
  fN++;
  var sc=SCENES[sIdx];if(!sc){showEnd();return;}

  // Finale scene logic
  if(sc.sp==='finale'){
    if(finPhase===0){
      finPhase=1;finTimer=0;
      // Position chars at edges
      localC.x=camX+50;
      remoteC.x=camX+W-50-CW;
      remoteC.tx=remoteC.x;remoteC.ty=gY-CH;
    }
    if(finPhase===1){
      finTimer++;
      var center=camX+W/2-CW/2;
      // Move both towards center
      var moveSpd=2;
      if(localC.x<center-5)localC.x+=moveSpd;
      if(remoteC.x>center+5)remoteC.x-=moveSpd;
      remoteC.tx=remoteC.x;remoteC.ty=remoteC.y;
      // Check if met
      if(Math.abs(localC.x-remoteC.x)<CW+10){
        finPhase=2;finTimer=0;
        snd('scene');
        // Spawn lots of hearts
        for(var i=0;i<30;i++)spP(W/2,gY-CH,'#ff6b9d');
        txSend({type:'finish'});
      }
    }
    if(finPhase===2){
      finTimer++;
      if(finTimer>180){showEnd();return;}
    }
  } else {
    // Normal gameplay
    // Update characters
    updC(localC);
    updC(remoteC);

    // Sync position to peer every N frames
    if(fN%3===0){
      txSend({type:'pos',x:localC.x,y:localC.y});
    }

    // Track distance via local char
    sDist=localC.x-100; // started at x=100

    // Check scene completion
    if(sDist>=sc.dist){
      sIdx++;
      if(sIdx<SCENES.length){
        snd('scene');
        var nsc=SCENES[sIdx];
        showScTxt(nsc.name+' — '+nsc.desc);
        txSend({type:'scene',idx:sIdx});
        // Reset positions for new scene
        var baseX=localC.x;
        localC.x=100;localC.y=gY-CH;localC.vy=0;localC.onG=true;localC.jmp=0;
        remoteC.x=170;remoteC.y=gY-CH;remoteC.vy=0;remoteC.onG=true;remoteC.jmp=0;
        remoteC.tx=170;remoteC.ty=gY-CH;
        camX=0;sDist=0;
        genLvl();mkStars();
      } else {
        showEnd();return;
      }
    }

    // Camera follows local char
    var targetCam=localC.x-W*0.3;
    if(targetCam<0)targetCam=0;
    camX+=(targetCam-camX)*0.1;
  }

  // Fireworks in scene 5 (index 5)
  if(sc.sp==='fireworks'&&fN%30===0)spFW();
  updFW();
  updP();

  // Update HUD
  $sn.textContent=sc.name;
  $sd.textContent='\u2764\uFE0F \u00D7 '+score;
  var totalDist=0,coveredDist=0;
  for(var i=0;i<SCENES.length;i++){totalDist+=SCENES[i].dist;if(i<sIdx)coveredDist+=SCENES[i].dist;}
  coveredDist+=Math.min(sDist,sc.dist);
  $pf.style.width=Math.min(100,Math.floor(coveredDist/totalDist*100))+'%';

  // Draw
  ctx.clearRect(0,0,W,H);
  drSky(sc);
  drBg(sc);
  drGnd(sc);
  drPlats();
  drObs();
  drItems();
  // Draw remote char behind local
  drChar(remoteC);
  drChar(localC);
  drParts();
  drFinale();
  drScTxt();

  requestAnimationFrame(loop);
}

})();

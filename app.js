(function(){
'use strict';

// ═══════ SCENE CONFIG ═══════
var SCENES = [
  {id:'prologue',dur:6,type:'text',title:'序章',
   lines:['时间拉回到很久以前…','那时候，我们还不认识'],bg:[0x1a0a2e,0x0d0520]},
  {id:'primary',dur:10,type:'image',img:'images/01-primary.jpg',
   caption:'同一所小学 · 他在1班，她在2班',
   bubbles:[{t:'那个男生好厉害…',d:2,th:1}]},
  {id:'middle',dur:8,type:'text',title:'时光匆匆',
   lines:['小学毕业，各奔东西','却不知命运早已埋下伏笔'],bg:[0x0a1628,0x1a0a3e]},
  {id:'high',dur:10,type:'image',img:'images/02-high.jpg',
   caption:'高中同校 · 公交站偶遇',
   bubbles:[{t:'…嗨',d:2},{t:'…嗯',d:4}]},
  {id:'mountain',dur:12,type:'image',img:'images/03-mountain.jpg',
   caption:'毕业徒步 · 命运的交汇点',
   bubbles:[{t:'这次终于说上话了！',d:2.5},{t:'加个微信吧',d:5}]},
  {id:'burst',dur:5,type:'burst',title:'心动的瞬间',bg:[0x2d0a1e,0x0a0a2e]},
  {id:'summer',dur:8,type:'text',title:'那年夏天',
   lines:['聊天记录越来越长','晚安变成了每天的仪式'],bg:[0x1a2a0a,0x0a1a2e]},
  {id:'parting',dur:10,type:'image',img:'images/04-parting.jpg',
   caption:'九月 · 她上大学，他复读一年',
   bubbles:[{t:'我要去上大学了…',d:2},{t:'我留下来复读',d:4}]},
  {id:'typing',dur:10,type:'typing',title:'异地',
   lines:['每天的消息，跨越千里','打字、删除、重新打字…','想你'],bg:[0x0d1a2e,0x1a0d2e]},
  {id:'waiting',dur:8,type:'waiting',title:'等待',
   lines:['等一个人回复的心情','你不会懂'],bg:[0x0a0a20,0x1a1a3e]},
  {id:'reunion',dur:8,type:'text',title:'重逢',
   lines:['终于，等到了那一天','见面的那一刻','所有等待都值得了'],bg:[0x2e1a0a,0x1a0a2e]},
  {id:'confession',dur:10,type:'image',img:'images/05-confession.jpg',
   caption:'2023年初 · 河套 · 护栏旁',
   bubbles:[{t:'其实…从那时候就喜欢你了',d:3},{t:'我也是',d:6}]},
  {id:'proposal',dur:10,type:'image',img:'images/06-proposal.jpg',
   caption:'乌兰察布 · 露营 · 烟花',
   bubbles:[{t:'嫁给我吧',d:3},{t:'😭 我愿意',d:6}]},
  {id:'ending',dur:8,type:'image',img:'images/07-seaside-real.jpg',
   caption:'2023.11.09 · 从此，每一天都是我们的故事 · 520快乐❤️',bubbles:[]}
];

var TDUR = 1.5;
var FT = '"PingFang SC","Hiragino Sans GB","Microsoft YaHei",sans-serif';
var totalDur = 0;
for (var i = 0; i < SCENES.length; i++) totalDur += SCENES[i].dur;

// ═══════ PIXI APP ═══════
var pixi = new PIXI.Application({
  resizeTo: window, backgroundColor: 0x000000,
  antialias: true, resolution: Math.min(window.devicePixelRatio || 1, 2),
  autoDensity: true
});
document.getElementById('app').appendChild(pixi.view);
function W() { return pixi.screen.width; }
function H() { return pixi.screen.height; }

// ═══════ STATE ═══════
var started = false, paused = false;
var curIdx = -1, scnT = 0, totEl = 0;
var tring = false, trProg = 0;
var globalTime = 0;

// ═══════ LAYERS ═══════
var sLayer = new PIXI.Container();
var nLayer = new PIXI.Container();
var pLayer = new PIXI.Container();
pixi.stage.addChild(sLayer, nLayer, pLayer);

// ═══════ TEXTURE CACHE ═══════
var texC = {};
function loadTex(src) {
  if (texC[src]) return Promise.resolve(texC[src]);
  return new Promise(function(ok, no) {
    var img = new Image(); img.crossOrigin = 'anonymous';
    img.onload = function() { texC[src] = PIXI.Texture.from(img); ok(texC[src]); };
    img.onerror = no; img.src = src;
  });
}
function preload() {
  var p = [];
  for (var i = 0; i < SCENES.length; i++)
    if (SCENES[i].img) p.push(loadTex(SCENES[i].img));
  return Promise.all(p);
}

// ═══════ GENERATED TEXTURES ═══════
function makeVignette() {
  var c = document.createElement('canvas'); c.width = 512; c.height = 512;
  var ctx = c.getContext('2d');
  var g = ctx.createRadialGradient(256,256,80,256,256,360);
  g.addColorStop(0,'rgba(0,0,0,0)');
  g.addColorStop(0.7,'rgba(0,0,0,0.15)');
  g.addColorStop(1,'rgba(0,0,0,0.65)');
  ctx.fillStyle = g; ctx.fillRect(0,0,512,512);
  return PIXI.Texture.from(c);
}
var vigTex = makeVignette();

function makeGlow(r, col) {
  var c = document.createElement('canvas'), s = r*4;
  c.width = s; c.height = s;
  var ctx = c.getContext('2d');
  var g = ctx.createRadialGradient(s/2,s/2,0,s/2,s/2,r);
  g.addColorStop(0, col || 'rgba(255,255,240,0.8)');
  g.addColorStop(0.5, col || 'rgba(255,220,200,0.3)');
  g.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = g; ctx.fillRect(0,0,s,s);
  return PIXI.Texture.from(c);
}
var dustTex = makeGlow(16);
var burstTex = makeGlow(8, 'rgba(255,140,180,0.9)');

function makeHeartTex(sz) {
  var c = document.createElement('canvas'); c.width=sz; c.height=sz;
  var ctx = c.getContext('2d'); ctx.save();
  ctx.translate(sz/2, sz*0.4);
  var sc=sz/30;
  ctx.beginPath(); ctx.moveTo(0,sc*3);
  ctx.bezierCurveTo(0,sc,-sc*6,-sc*2,-sc*10,-sc*2);
  ctx.bezierCurveTo(-sc*15,-sc*2,-sc*15,sc*3.5,-sc*15,sc*3.5);
  ctx.bezierCurveTo(-sc*15,sc*7,-sc*8,sc*10,0,sc*14);
  ctx.bezierCurveTo(sc*8,sc*10,sc*15,sc*7,sc*15,sc*3.5);
  ctx.bezierCurveTo(sc*15,sc*3.5,sc*15,-sc*2,sc*10,-sc*2);
  ctx.bezierCurveTo(sc*6,-sc*2,0,sc,0,sc*3);
  ctx.closePath();
  ctx.shadowColor='rgba(255,100,150,0.8)'; ctx.shadowBlur=12;
  ctx.fillStyle='rgba(255,80,130,0.9)'; ctx.fill();
  ctx.restore();
  return PIXI.Texture.from(c);
}
var heartTex = makeHeartTex(48);

function makeLightLeak() {
  var c = document.createElement('canvas'); c.width=256; c.height=256;
  var ctx = c.getContext('2d');
  var g = ctx.createRadialGradient(128,128,0,128,128,180);
  g.addColorStop(0,'rgba(255,200,100,0.35)');
  g.addColorStop(0.3,'rgba(255,150,80,0.15)');
  g.addColorStop(0.7,'rgba(255,100,150,0.08)');
  g.addColorStop(1,'rgba(255,255,255,0)');
  ctx.fillStyle=g; ctx.fillRect(0,0,256,256);
  return PIXI.Texture.from(c);
}
var lightLeakTex = makeLightLeak();

// ═══════ GLSL SHADER SOURCES ═══════
var dissolveFS = 'precision mediump float;\nvarying vec2 vTextureCoord;\nuniform sampler2D uSampler;\nuniform float uProgress;\nuniform float uTime;\nvec3 mod289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}\nvec2 mod289v(vec2 x){return x-floor(x*(1.0/289.0))*289.0;}\nvec3 permute(vec3 x){return mod289(((x*34.0)+1.0)*x);}\nfloat snoise(vec2 v){\nconst vec4 C=vec4(0.211324865405187,0.366025403784439,-0.577350269189626,0.024390243902439);\nvec2 i=floor(v+dot(v,C.yy));vec2 x0=v-i+dot(i,C.xx);\nvec2 i1=(x0.x>x0.y)?vec2(1.0,0.0):vec2(0.0,1.0);\nvec4 x12=x0.xyxy+C.xxzz;x12.xy-=i1;\ni=mod289v(i);\nvec3 p=permute(permute(i.y+vec3(0.0,i1.y,1.0))+i.x+vec3(0.0,i1.x,1.0));\nvec3 m=max(0.5-vec3(dot(x0,x0),dot(x12.xy,x12.xy),dot(x12.zw,x12.zw)),0.0);\nm=m*m;m=m*m;\nvec3 x=2.0*fract(p*C.www)-1.0;vec3 h=abs(x)-0.5;\nvec3 ox=floor(x+0.5);vec3 a0=x-ox;\nm*=1.79284291400159-0.85373472095314*(a0*a0+h*h);\nvec3 g;g.x=a0.x*x0.x+h.x*x0.y;g.yz=a0.yz*x12.xz+h.yz*x12.yw;\nreturn 130.0*dot(m,g);}\nvoid main(){\nvec4 col=texture2D(uSampler,vTextureCoord);\nfloat n=snoise(vTextureCoord*6.0+uTime*0.3)*0.5+0.5;\nfloat e=0.08;\nfloat a=smoothstep(uProgress-e,uProgress+e,n);\nfloat glow=1.0-smoothstep(0.0,e*2.0,abs(n-uProgress));\nvec3 gc=mix(vec3(1.0,0.6,0.8),vec3(0.6,0.4,1.0),vTextureCoord.y);\ncol.rgb=mix(col.rgb,col.rgb+gc*0.5,glow*step(0.01,uProgress)*step(uProgress,0.99));\ncol.a*=a;\ngl_FragColor=col;}';

var rippleFS = 'precision mediump float;\nvarying vec2 vTextureCoord;\nuniform sampler2D uSampler;\nuniform float uProgress;\nvoid main(){\nvec2 uv=vTextureCoord;\nvec2 center=vec2(0.5);\nfloat dist=distance(uv,center);\nfloat amp=0.035*(1.0-uProgress);\nfloat waves=dist*25.0-uProgress*15.0;\nfloat ripple=sin(waves)*amp*smoothstep(0.0,0.3,uProgress);\nvec2 off=normalize(uv-center+0.001)*ripple;\nvec4 col=texture2D(uSampler,uv+off);\ncol.a*=uProgress;\ngl_FragColor=col;}';

var chromaticFS = 'precision mediump float;\nvarying vec2 vTextureCoord;\nuniform sampler2D uSampler;\nuniform float uProgress;\nvoid main(){\nfloat intensity=sin(uProgress*3.14159)*0.025;\nvec2 dir=vTextureCoord-vec2(0.5);\nfloat r=texture2D(uSampler,vTextureCoord+dir*intensity).r;\nfloat g=texture2D(uSampler,vTextureCoord).g;\nfloat b=texture2D(uSampler,vTextureCoord-dir*intensity).b;\nfloat a=texture2D(uSampler,vTextureCoord).a;\ngl_FragColor=vec4(r,g,b,a*uProgress);}';

var pixelateFS = 'precision mediump float;\nvarying vec2 vTextureCoord;\nuniform sampler2D uSampler;\nuniform float uProgress;\nuniform vec2 uRes;\nvoid main(){\nfloat phase;\nif(uProgress<0.5){phase=uProgress*2.0;}\nelse{phase=(1.0-uProgress)*2.0;}\nfloat pixels=mix(max(uRes.x,uRes.y),4.0,phase);\nvec2 gs=vec2(pixels)/uRes;\nvec2 snapped=gs*floor(vTextureCoord/gs)+gs*0.5;\nvec4 col=texture2D(uSampler,snapped);\ngl_FragColor=vec4(col.rgb,col.a*uProgress);}';

var vignetteFS = 'precision mediump float;\nvarying vec2 vTextureCoord;\nuniform sampler2D uSampler;\nuniform float uBreath;\nvoid main(){\nvec4 col=texture2D(uSampler,vTextureCoord);\nvec2 uv=vTextureCoord-0.5;\nfloat d=length(uv)*1.4;\nfloat vig=smoothstep(0.2+uBreath*0.08,1.1,d);\ncol.rgb*=1.0-vig*0.7;\ngl_FragColor=col;}';

var grainFS = 'precision mediump float;\nvarying vec2 vTextureCoord;\nuniform sampler2D uSampler;\nuniform float uTime;\nuniform float uIntensity;\nfloat rand(vec2 co){return fract(sin(dot(co,vec2(12.9898,78.233)))*43758.5453);}\nvoid main(){\nvec4 col=texture2D(uSampler,vTextureCoord);\nfloat grain=rand(vTextureCoord*1024.0+vec2(uTime*100.0,uTime*77.0));\ncol.rgb+=(grain-0.5)*uIntensity;\ngl_FragColor=col;}';

var glitchFS = 'precision mediump float;\nvarying vec2 vTextureCoord;\nuniform sampler2D uSampler;\nuniform float uTime;\nuniform float uIntensity;\nfloat rand(vec2 co){return fract(sin(dot(co,vec2(12.9898,78.233)))*43758.5453);}\nvoid main(){\nvec2 uv=vTextureCoord;\nfloat scan=sin(uv.y*800.0+uTime*10.0)*0.02*uIntensity;\nfloat by=floor(uv.y*20.0)/20.0;\nfloat bg=step(0.95-uIntensity*0.3,rand(vec2(by,floor(uTime*8.0))))*0.02*uIntensity;\nfloat r=texture2D(uSampler,uv+vec2(0.008*uIntensity+bg,scan)).r;\nfloat g=texture2D(uSampler,uv+vec2(-0.004*uIntensity,0.0)).g;\nfloat b=texture2D(uSampler,uv+vec2(bg,-scan)).b;\nfloat a=texture2D(uSampler,uv).a;\ngl_FragColor=vec4(r,g,b,a);}';

var shockFS = 'precision mediump float;\nvarying vec2 vTextureCoord;\nuniform sampler2D uSampler;\nuniform float uProgress;\nuniform vec2 uCenter;\nvoid main(){\nvec2 uv=vTextureCoord;\nfloat dist=distance(uv,uCenter);\nfloat radius=uProgress*0.8;\nfloat thick=0.04;\nfloat str=0.025*(1.0-uProgress);\nfloat diff=dist-radius;\nfloat wave=1.0-smoothstep(0.0,thick,abs(diff));\nvec2 dir=normalize(uv-uCenter+0.001);\nuv+=dir*wave*str;\ngl_FragColor=texture2D(uSampler,uv);}';

// ═══════ FILTER INSTANCES ═══════
var fDissolve = new PIXI.Filter(null, dissolveFS, {uProgress:0,uTime:0});
var fRipple = new PIXI.Filter(null, rippleFS, {uProgress:0});
var fChromatic = new PIXI.Filter(null, chromaticFS, {uProgress:0});
var fPixelate = new PIXI.Filter(null, pixelateFS, {uProgress:0,uRes:[800,600]});
var fVignette = new PIXI.Filter(null, vignetteFS, {uBreath:0});
var fGrain = new PIXI.Filter(null, grainFS, {uTime:0,uIntensity:0.06});
var fGlitch = new PIXI.Filter(null, glitchFS, {uTime:0,uIntensity:0});
var fShockwave = new PIXI.Filter(null, shockFS, {uProgress:0,uCenter:[0.5,0.5]});

var shaderTr = [fDissolve, fRipple, fChromatic, fPixelate];

// ═══════ HELPERS ═══════
function lerp(a,b,t){return a+(b-a)*t;}
function eio(t){return t<0.5?2*t*t:-1+(4-2*t)*t;}
function eo(t){return 1-Math.pow(1-t,3);}
function fitCover(tw,th,sw,sh){
  if(tw/th>sw/sh)return{w:sh*(tw/th),h:sh};
  return{w:sw,h:sw/(tw/th)};
}
function makeGrad(c1,c2){
  var g=new PIXI.Graphics(),steps=48,sh=Math.ceil(H()/steps)+1;
  for(var i=0;i<steps;i++){
    var t=i/(steps-1);
    var r=lerp((c1>>16)&0xff,(c2>>16)&0xff,t);
    var gr=lerp((c1>>8)&0xff,(c2>>8)&0xff,t);
    var b=lerp(c1&0xff,c2&0xff,t);
    g.beginFill((Math.round(r)<<16)|(Math.round(gr)<<8)|Math.round(b));
    g.drawRect(0,i*sh,W(),sh);g.endFill();
  }
  return g;
}
function fc(cont,name){
  for(var i=0;i<cont.children.length;i++)
    if(cont.children[i].name===name)return cont.children[i];
  return null;
}

// ═══════ ENHANCED PARTICLES (Firefly + Comet Trails) ═══════
var aParts = null;
function FloatP(cont,n,tex,spd){
  this.sp=[];this.d=[];this.trails=[];
  var w=W(),h=H();
  for(var i=0;i<n;i++){
    var s=new PIXI.Sprite(tex);
    s.anchor.set(0.5);s.blendMode=PIXI.BLEND_MODES.ADD;
    var bs=0.3+Math.random()*0.7;
    s.scale.set(bs);s.alpha=0;
    s.x=Math.random()*w;s.y=Math.random()*h;
    cont.addChild(s);this.sp.push(s);
    this.d.push({
      vx:(Math.random()-0.5)*(spd||0.3),
      vy:-0.1-Math.random()*(spd||0.3),
      lf:Math.random()*Math.PI*2,
      ba:0.15+Math.random()*0.45,
      dr:(Math.random()-0.5)*0.5,
      cp:Math.random()*Math.PI*2,bs:bs
    });
    var ta=[];
    for(var j=0;j<3;j++){
      var ts=new PIXI.Sprite(tex);
      ts.anchor.set(0.5);ts.blendMode=PIXI.BLEND_MODES.ADD;
      ts.scale.set(bs*(0.6-j*0.15));ts.alpha=0;
      ts.x=s.x;ts.y=s.y;cont.addChild(ts);
      ta.push({sprite:ts,x:s.x,y:s.y});
    }
    this.trails.push(ta);
  }
}
FloatP.prototype.update=function(dt){
  var w=W(),h=H();
  for(var i=0;i<this.sp.length;i++){
    var s=this.sp[i],d=this.d[i];
    d.lf+=dt*0.8;d.cp+=dt*0.5;
    var ct=Math.sin(d.cp)*0.5+0.5;
    var cr=lerp(1.0,1.0,ct),cg=lerp(0.85,0.55,ct),cb=lerp(0.35,0.7,ct);
    s.tint=(Math.round(cr*255)<<16)|(Math.round(cg*255)<<8)|Math.round(cb*255);
    var px=s.x,py=s.y;
    s.x+=d.vx+Math.sin(d.lf)*d.dr*dt*30;
    s.y+=d.vy;
    s.alpha=d.ba*(0.5+0.5*Math.sin(d.lf));
    s.scale.set(d.bs*(0.8+0.2*Math.sin(d.lf*1.3)));
    if(s.y<-20){s.y=h+20;s.x=Math.random()*w;}
    if(s.x<-20)s.x=w+20;
    if(s.x>w+20)s.x=-20;
    var tr=this.trails[i];
    for(var j=tr.length-1;j>0;j--){tr[j].x=tr[j-1].x;tr[j].y=tr[j-1].y;}
    if(tr.length>0){tr[0].x=px;tr[0].y=py;}
    for(var j=0;j<tr.length;j++){
      tr[j].sprite.x=tr[j].x;tr[j].sprite.y=tr[j].y;
      tr[j].sprite.alpha=s.alpha*(0.4-j*0.12);
      tr[j].sprite.tint=s.tint;
    }
  }
};
FloatP.prototype.destroy=function(){
  var i;
  for(i=0;i<this.sp.length;i++)this.sp[i].destroy();
  for(i=0;i<this.trails.length;i++)
    for(var j=0;j<this.trails[i].length;j++)this.trails[i][j].sprite.destroy();
  this.sp=[];this.d=[];this.trails=[];
};

// ═══════ BURST (Heart Explosion + Physics) ═══════
var aBurst = null;
function BurstP(cont,n){
  this.sp=[];this.d=[];
  var cx=W()/2,cy=H()/2;
  for(var i=0;i<n;i++){
    var useH=i<n*0.4;
    var s=new PIXI.Sprite(useH?heartTex:burstTex);
    s.anchor.set(0.5);s.blendMode=PIXI.BLEND_MODES.ADD;
    s.scale.set(useH?0.3+Math.random()*0.5:0.5+Math.random());
    s.alpha=0;s.x=cx;s.y=cy;
    cont.addChild(s);this.sp.push(s);
    var a=Math.random()*Math.PI*2,sp=2+Math.random()*8;
    this.d.push({
      vx:Math.cos(a)*sp,vy:Math.sin(a)*sp-2,
      grav:0.15,bounce:0.5+Math.random()*0.3,
      lf:0,ml:2+Math.random()*2.5,dl:Math.random()*0.4,
      rot:0,rv:(Math.random()-0.5)*0.2,isH:useH
    });
  }
}
BurstP.prototype.update=function(dt,el){
  var floorY=H()*0.85;
  for(var i=0;i<this.sp.length;i++){
    var s=this.sp[i],d=this.d[i];
    if(el<d.dl)continue;
    d.lf+=dt;var t=Math.min(d.lf/d.ml,1);
    d.vy+=d.grav;
    s.x+=d.vx*(1-t*0.3);s.y+=d.vy;
    if(s.y>floorY&&d.vy>0){s.y=floorY;d.vy=-d.vy*d.bounce;d.vx*=0.8;}
    d.rot+=d.rv;s.rotation=d.rot;
    s.alpha=t<0.1?t/0.1:Math.max(0,1-(t-0.1)/0.9);
    s.scale.set((d.isH?0.3:0.5)*(1-t*0.4));
    d.vx*=0.995;
  }
};
BurstP.prototype.destroy=function(){
  for(var i=0;i<this.sp.length;i++)this.sp[i].destroy();
  this.sp=[];this.d=[];
};

// ═══════ SCREEN SHAKE ═══════
var shakeState={active:false,intensity:0,decay:0.92};
function triggerShake(i){shakeState.active=true;shakeState.intensity=i||8;}
function updateShake(dt){
  if(!shakeState.active)return;
  shakeState.intensity*=shakeState.decay;
  pixi.stage.x=(Math.random()-0.5)*shakeState.intensity*2;
  pixi.stage.y=(Math.random()-0.5)*shakeState.intensity*2;
  if(shakeState.intensity<0.3){shakeState.active=false;pixi.stage.x=0;pixi.stage.y=0;}
}

// ═══════ SHOCKWAVE RING ═══════
var shockRing={active:false,progress:0,sprite:null};
function triggerShockwave(){
  shockRing.active=true;shockRing.progress=0;
  if(!shockRing.sprite){
    var g=new PIXI.Graphics();
    g.lineStyle(3,0xff80bf,0.8);
    g.drawCircle(0,0,1);
    shockRing.sprite=g;
  }
  shockRing.sprite.x=W()/2;shockRing.sprite.y=H()/2;
  shockRing.sprite.scale.set(1);shockRing.sprite.alpha=1;
  pLayer.addChild(shockRing.sprite);
}
function updateShockRing(dt){
  if(!shockRing.active)return;
  shockRing.progress+=dt*0.6;
  var p=shockRing.progress;
  if(p>=1){
    shockRing.active=false;
    if(shockRing.sprite.parent)shockRing.sprite.parent.removeChild(shockRing.sprite);
    return;
  }
  var r=eo(p)*Math.max(W(),H())*0.5;
  shockRing.sprite.scale.set(r);
  shockRing.sprite.alpha=1-p;
}

// ═══════ LIGHT LEAK ═══════
var lightLeak = null;
function createLightLeak(cont){
  var s=new PIXI.Sprite(lightLeakTex);
  s.anchor.set(0.5);s.blendMode=PIXI.BLEND_MODES.ADD;
  s.width=W()*0.6;s.height=H()*0.6;
  s.alpha=0;s.name='lleak';
  cont.addChild(s);
  return s;
}
function updateLightLeak(dt,el){
  var ll=fc(sLayer,'lleak');
  if(!ll)return;
  var t=el*0.3;
  ll.x=W()*0.3+Math.sin(t)*W()*0.3;
  ll.y=H()*0.3+Math.cos(t*0.7)*H()*0.2;
  ll.alpha=0.15+0.1*Math.sin(t*1.5);
  ll.rotation=t*0.1;
}

// ═══════ SCENE STATE ═══════
var aBubs=[],tyState=null,waState=null;
function clearAll(){
  if(aParts){aParts.destroy();aParts=null;}
  if(aBurst){aBurst.destroy();aBurst=null;}
  pLayer.removeChildren();
  aBubs=[];tyState=null;waState=null;
  lightLeak=null;
  // Reset filters
  sLayer.filters=null;nLayer.filters=null;
}

// ═══════ BUBBLE ═══════
function mkBub(text,italic){
  var c=new PIXI.Container();
  var fs=Math.min(W()*0.045,24);
  var tx=new PIXI.Text(text,{
    fontFamily:FT,fontSize:fs,fill:italic?'#e0d0ff':'#fff',
    fontStyle:italic?'italic':'normal',wordWrap:true,
    wordWrapWidth:W()*0.7,align:'center'
  });
  tx.anchor.set(0.5);
  var p=16,bg=new PIXI.Graphics();
  bg.beginFill(0x000000,0.45);
  bg.drawRoundedRect(-tx.width/2-p,-tx.height/2-p*0.7,tx.width+p*2,tx.height+p*1.4,16);
  bg.endFill();
  c.addChild(bg,tx);c.alpha=0;
  return c;
}

// ═══════ SCENE BUILDERS ═══════
function buildImage(cont,sc){
  var tex=texC[sc.img];if(!tex)return;
  var w=W(),h=H(),f=fitCover(tex.width,tex.height,w,h);
  var sp=new PIXI.Sprite(tex);
  sp.anchor.set(0.5);sp.width=f.w;sp.height=f.h;
  sp.x=w/2;sp.y=h/2;sp.name='mi';
  cont.addChild(sp);
  // vignette
  var v=new PIXI.Sprite(vigTex);v.width=w;v.height=h;v.alpha=0.9;
  cont.addChild(v);
  // light leak
  createLightLeak(cont);
  // Apply vignette breathing + film grain filters
  cont.filters=[fVignette,fGrain];
  // More particles: 60
  aParts=new FloatP(pLayer,60,dustTex,0.3);
  // bubbles
  var bs=sc.bubbles||[],yo=h*0.25;
  for(var i=0;i<bs.length;i++){
    var b=mkBub(bs[i].t,bs[i].th);
    b.x=w/2;b.y=yo+i*Math.min(65,h*0.08);
    b.name='b'+i;b._dl=bs[i].d;
    cont.addChild(b);aBubs.push(b);
  }
}

function buildText(cont,sc){
  var w=W(),h=H();
  cont.addChild(makeGrad(sc.bg[0],sc.bg[1]));
  var ts=Math.min(w*0.09,48);
  var ti=new PIXI.Text(sc.title||'',{
    fontFamily:FT,fontSize:ts,fill:'#fff',fontWeight:'700',align:'center'
  });
  ti.anchor.set(0.5);ti.x=w/2;ti.y=h*0.3;
  ti.alpha=0;ti.name='ti';cont.addChild(ti);
  var ls=Math.min(w*0.05,22),ll=sc.lines||[];
  for(var i=0;i<ll.length;i++){
    var t=new PIXI.Text(ll[i],{
      fontFamily:FT,fontSize:ls,fill:'rgba(255,255,255,0.85)',
      align:'center',wordWrap:true,wordWrapWidth:w*0.8
    });
    t.anchor.set(0.5);t.x=w/2;t.y=h*0.45+i*(ls+16);
    t.alpha=0;t.name='l'+i;cont.addChild(t);
  }
  // Glitch filter for certain text scenes
  var isGlitchy=(sc.id==='reunion'||sc.id==='middle');
  if(isGlitchy){cont.filters=[fGlitch];}
  aParts=new FloatP(pLayer,20,dustTex,0.15);
}

function buildTyping(cont,sc){
  var w=W(),h=H();
  cont.addChild(makeGrad(sc.bg[0],sc.bg[1]));
  var ts=Math.min(w*0.08,40);
  var ti=new PIXI.Text(sc.title,{fontFamily:FT,fontSize:ts,fill:'#fff',fontWeight:'700'});
  ti.anchor.set(0.5);ti.x=w/2;ti.y=h*0.22;
  ti.alpha=0;ti.name='ti';cont.addChild(ti);
  var pw=Math.min(w*0.7,300),ph=pw*0.5;
  var px=w/2-pw/2,py=h*0.38;
  var pg=new PIXI.Graphics();
  pg.lineStyle(2,0x444466);
  pg.beginFill(0x111122,0.6);
  pg.drawRoundedRect(px,py,pw,ph,16);
  pg.endFill();cont.addChild(pg);
  var ls=Math.min(w*0.045,20);
  var tt=new PIXI.Text('',{fontFamily:FT,fontSize:ls,fill:'#fff',wordWrap:true,wordWrapWidth:pw-30});
  tt.x=px+15;tt.y=py+15;tt.name='tt';cont.addChild(tt);
  var cu=new PIXI.Graphics();
  cu.beginFill(0xffffff);cu.drawRect(0,0,2,ls+4);cu.endFill();
  cu.name='cu';cont.addChild(cu);
  // Typewriter with realistic timing
  tyState={texts:sc.lines||[],cl:0,ci:0,timer:0,
    cd:0.07,ld:1.0,waiting:false,wt:0,built:'',to:tt,co:cu};
  aParts=new FloatP(pLayer,15,dustTex,0.1);
}

function buildWaiting(cont,sc){
  var w=W(),h=H();
  cont.addChild(makeGrad(sc.bg[0],sc.bg[1]));
  var ts=Math.min(w*0.08,40);
  var ti=new PIXI.Text(sc.title,{fontFamily:FT,fontSize:ts,fill:'#fff',fontWeight:'700'});
  ti.anchor.set(0.5);ti.x=w/2;ti.y=h*0.22;
  ti.alpha=0;ti.name='ti';cont.addChild(ti);
  var pw=Math.min(w*0.5,220),ph=pw*1.6;
  var px=w/2-pw/2,py=h*0.32;
  var pg=new PIXI.Graphics();
  pg.lineStyle(2,0x444466);
  pg.beginFill(0x0a0a1e,0.7);
  pg.drawRoundedRect(px,py,pw,ph,24);
  pg.endFill();
  pg.beginFill(0x111133,0.5);
  pg.drawRoundedRect(px+8,py+40,pw-16,ph-80,8);
  pg.endFill();cont.addChild(pg);
  var ds=Math.min(w*0.06,28);
  var dt=new PIXI.Text('',{fontFamily:FT,fontSize:ds,fill:'#aaaacc',align:'center'});
  dt.anchor.set(0.5);dt.x=w/2;dt.y=py+ph/2;
  dt.name='dots';cont.addChild(dt);
  var ls=Math.min(w*0.04,18),ll=sc.lines||[];
  for(var i=0;i<ll.length;i++){
    var t=new PIXI.Text(ll[i],{fontFamily:FT,fontSize:ls,fill:'rgba(255,255,255,0.7)',
      align:'center',wordWrap:true,wordWrapWidth:w*0.8});
    t.anchor.set(0.5);t.x=w/2;t.y=py+ph+30+i*(ls+12);
    t.alpha=0;t.name='l'+i;cont.addChild(t);
  }
  waState={el:0};
  aParts=new FloatP(pLayer,15,dustTex,0.12);
}

function buildBurst(cont,sc){
  var w=W(),h=H();
  cont.addChild(makeGrad(sc.bg[0],sc.bg[1]));
  var ts=Math.min(w*0.1,52);
  var ti=new PIXI.Text(sc.title,{fontFamily:FT,fontSize:ts,fill:'#ff8fbf',fontWeight:'700'});
  ti.anchor.set(0.5);ti.x=w/2;ti.y=h*0.35;
  ti.alpha=0;ti.name='ti';cont.addChild(ti);
  var ht=new PIXI.Text('\u2764\ufe0f',{fontFamily:FT,fontSize:Math.min(w*0.2,100)});
  ht.anchor.set(0.5);ht.x=w/2;ht.y=h*0.55;
  ht.alpha=0;ht.name='ht';ht.scale.set(0.3);cont.addChild(ht);
  // Heart particle explosion: 100 particles
  aBurst=new BurstP(pLayer,100);
  // Shockwave + shake triggered on build
  triggerShake(12);
  triggerShockwave();
  // Apply shockwave filter
  cont.filters=[fShockwave];
}

function buildScene(cont,idx){
  var sc=SCENES[idx];if(!sc)return;
  switch(sc.type){
    case'image':buildImage(cont,sc);break;
    case'typing':buildTyping(cont,sc);break;
    case'waiting':buildWaiting(cont,sc);break;
    case'burst':buildBurst(cont,sc);break;
    default:buildText(cont,sc);
  }
}

// ═══════ SHADER TRANSITIONS ═══════
var trCount=0,trData=null,trShader=null;

function startTr(from,to,ti){
  tring=true;trProg=0;
  trData={f:from,t:to};
  // Cycle through 4 GLSL shader transitions
  var shaderIdx=ti%4;
  trShader=shaderTr[shaderIdx];
  // Reset shader uniform
  trShader.uniforms.uProgress=0;
  if(shaderIdx===0)trShader.uniforms.uTime=globalTime;
  if(shaderIdx===3){
    trShader.uniforms.uRes=[W()||800,H()||600];
  }
  // Old scene fades via alpha, new scene uses shader
  from.alpha=1;from.visible=true;from.filters=null;
  to.alpha=1;to.visible=true;to.filters=[trShader];
}

function finishTr(){
  if(!trData)return;
  tring=false;
  sLayer.removeChildren();sLayer.filters=null;
  while(nLayer.children.length>0){
    var c=nLayer.children[0];nLayer.removeChild(c);sLayer.addChild(c);
  }
  sLayer.alpha=1;sLayer.scale.set(1);sLayer.visible=true;
  // Transfer filters from transition target
  nLayer.alpha=1;nLayer.scale.set(1);nLayer.visible=true;
  nLayer.filters=null;nLayer.removeChildren();
  // Apply scene-appropriate filters
  var sc=SCENES[curIdx];
  if(sc&&sc.type==='image'){sLayer.filters=[fVignette,fGrain];}
  else if(sc&&sc.type==='burst'){sLayer.filters=[fShockwave];}
  else if(sc&&(sc.id==='reunion'||sc.id==='middle')){sLayer.filters=[fGlitch];}
  trData=null;trShader=null;
}

function updateTr(dt){
  if(!tring||!trData)return;
  trProg+=dt/TDUR;
  if(trProg>=1){trProg=1;finishTr();return;}
  var t=eio(trProg);
  // Update shader uniform
  if(trShader){
    trShader.uniforms.uProgress=t;
    if(trShader===fDissolve)trShader.uniforms.uTime=globalTime;
  }
  // Fade out old scene
  trData.f.alpha=1-t;
}

// ═══════ SCENE UPDATE ═══════
function updateScene(dt,el){
  var sc=SCENES[curIdx];if(!sc)return;

  // title fade
  var ti=fc(sLayer,'ti');
  if(ti)ti.alpha=eo(Math.min(el/1.0,1));

  // line stagger
  for(var i=0;i<10;i++){
    var ln=fc(sLayer,'l'+i);
    if(!ln)break;
    ln.alpha=eo(Math.max(0,Math.min((el-0.8-i*0.6)/0.8,1)));
  }

  // Ken Burns
  if(sc.type==='image'){
    var im=fc(sLayer,'mi');
    if(im&&texC[sc.img]){
      var p=el/sc.dur,s=1+p*0.08;
      var px=Math.sin(p*Math.PI*0.5)*W()*0.01;
      var py=Math.cos(p*Math.PI*0.3)*H()*0.005;
      var f=fitCover(texC[sc.img].width,texC[sc.img].height,W(),H());
      im.width=f.w*s;im.height=f.h*s;
      im.x=W()/2+px;im.y=H()/2+py;
    }
    // Update animated vignette breathing
    fVignette.uniforms.uBreath=Math.sin(globalTime*1.2)*0.5+0.5;
    // Update film grain time
    fGrain.uniforms.uTime=globalTime;
    // Update light leak
    updateLightLeak(dt,el);
  }

  // Glitch effect for text scenes
  if(sc.id==='reunion'||sc.id==='middle'){
    fGlitch.uniforms.uTime=globalTime;
    // Pulse glitch intensity
    var gi=Math.sin(globalTime*3)*0.3+0.3;
    // Brief intense bursts
    if(Math.sin(globalTime*7)>0.9)gi=0.8;
    fGlitch.uniforms.uIntensity=gi;
  }

  // bubble fade-in
  for(var j=0;j<aBubs.length;j++){
    var b=aBubs[j];
    if(el>=b._dl&&b.alpha<1)b.alpha=Math.min(b.alpha+dt*1.5,1);
  }

  // burst heart + shockwave
  if(sc.type==='burst'){
    var ht=fc(sLayer,'ht');
    if(ht){
      var bt=Math.min(el/0.8,1);
      ht.alpha=eo(bt);ht.scale.set(0.3+bt*1.2);
    }
    // Animate shockwave filter
    fShockwave.uniforms.uProgress=Math.min(el/2.0,1);
    fShockwave.uniforms.uCenter=[0.5,0.5];
  }

  // typing effect with realistic timing
  if(tyState){
    var ts=tyState;
    if(!ts.waiting){
      if(ts.cl<ts.texts.length){
        ts.timer+=dt;
        var line=ts.texts[ts.cl];
        var ch=line.charAt(ts.ci);
        // Variable speed: slow on punctuation
        var delay=ts.cd;
        if(ch==='，'||ch===','||ch==='。'||ch==='.'||ch==='…')delay=0.25;
        else if(ch==='！'||ch==='!'||ch==='？'||ch==='?')delay=0.3;
        else if(ch===' ')delay=0.05;
        if(ts.timer>=delay){
          ts.timer=0;ts.ci++;
          if(ts.ci>line.length){
            ts.waiting=true;ts.wt=0;ts.ci=0;
            ts.cl++;ts.built+=line+'\n';
          }else{
            ts.to.text=ts.built+line.substring(0,ts.ci);
          }
        }
      }
    }else{
      ts.wt+=dt;
      if(ts.wt>=ts.ld&&ts.cl<ts.texts.length){ts.waiting=false;ts.timer=0;}
    }
    if(ts.co){
      ts.co.x=ts.to.x+ts.to.width+2;
      ts.co.y=ts.to.y+ts.to.height-ts.co.height;
      ts.co.alpha=Math.sin(el*4)>0?1:0;
    }
  }

  // waiting dots
  if(waState){
    waState.el+=dt;
    var dc=Math.floor(waState.el*2)%4;
    var ds='';for(var k=0;k<dc;k++)ds+='.';
    var dObj=fc(sLayer,'dots');
    if(dObj)dObj.text='对方正在输入'+ds;
  }

  // particles
  if(aParts)aParts.update(dt);
  if(aBurst)aBurst.update(dt,el);
}

// ═══════ NAVIGATION ═══════
function goScene(idx){
  if(idx<0||idx>=SCENES.length)return;
  var prev=curIdx;
  curIdx=idx;scnT=0;
  clearAll();
  if(prev<0){
    sLayer.removeChildren();
    buildScene(sLayer,idx);
  }else{
    nLayer.removeChildren();
    buildScene(nLayer,idx);
    startTr(sLayer,nLayer,trCount++);
  }
  var sc=SCENES[idx];
  var lb=document.getElementById('scene-label');
  if(lb){
    if(sc.caption){lb.textContent=sc.caption;lb.classList.remove('hidden');}
    else{lb.classList.add('hidden');}
  }
}

// ═══════ UI ═══════
var startScr=document.getElementById('start-screen');
var pauseInd=document.getElementById('pause-indicator');
var progFill=document.getElementById('progress-fill');

function doStart(){
  if(started)return;
  started=true;
  startScr.classList.add('hidden');
  preload().then(function(){goScene(0);}).catch(function(e){
    console.error('preload err',e);goScene(0);
  });
}

startScr.addEventListener('click',doStart);
startScr.addEventListener('touchend',function(e){e.preventDefault();doStart();});

pixi.view.addEventListener('click',function(){
  if(!started)return;
  paused=!paused;
  if(paused)pauseInd.classList.remove('hidden');
  else pauseInd.classList.add('hidden');
});
pixi.view.addEventListener('touchend',function(e){
  if(!started)return;
  e.preventDefault();
  paused=!paused;
  if(paused)pauseInd.classList.remove('hidden');
  else pauseInd.classList.add('hidden');
});

// ═══════ MAIN LOOP ═══════
pixi.ticker.add(function(delta){
  if(!started||paused)return;
  var dt=delta/60;
  globalTime+=dt;

  scnT+=dt;totEl+=dt;

  // Screen shake
  updateShake(dt);
  // Shockwave ring
  updateShockRing(dt);

  if(tring){updateTr(dt);return;}

  // progress bar
  if(progFill){
    var p=0;
    for(var i=0;i<curIdx;i++)p+=SCENES[i].dur;
    p+=scnT;
    progFill.style.width=Math.min(p/totalDur*100,100)+'%';
  }

  updateScene(dt,scnT);

  // auto-advance
  if(curIdx>=0&&curIdx<SCENES.length&&scnT>=SCENES[curIdx].dur){
    if(curIdx<SCENES.length-1){
      goScene(curIdx+1);
    }else{
      paused=true;
      pauseInd.innerHTML='\u2728 故事结束 \u00b7 520快乐 \u2764\ufe0f<br><br><a href="game.html" style="display:inline-block;padding:12px 28px;background:linear-gradient(135deg,#ff6b9d,#ff9cc2);color:#fff;border-radius:12px;text-decoration:none;font-size:16px;font-weight:600;box-shadow:0 4px 20px rgba(255,107,157,0.3);animation:pulse 2s infinite">\ud83e\udde9 一起拼图</a>';
      pauseInd.classList.remove('hidden');
    }
  }
});

// ═══════ RESIZE ═══════
window.addEventListener('resize',function(){
  if(curIdx>=0&&!tring){
    var idx=curIdx;
    clearAll();sLayer.removeChildren();
    buildScene(sLayer,idx);
  }
  // Update pixelate resolution
  fPixelate.uniforms.uRes=[W()||800,H()||600];
});

// ═══════ PROGRAMMER EASTER EGG ═══════

// Console love letter (he WILL open devtools)
(function(){
  var s='color:#ff6b9d;font-size:14px;font-weight:bold;text-shadow:0 0 5px rgba(255,107,157,0.5)';
  var s2='color:#ff9cc2;font-size:12px';
  var s3='color:#888;font-size:11px;font-style:italic';
  console.log('%c\n'+
    '    ♥♥♥       ♥♥♥\n'+
    '  ♥♥♥♥♥♥   ♥♥♥♥♥♥\n'+
    '♥♥♥♥♥♥♥♥ ♥♥♥♥♥♥♥♥\n'+
    ' ♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥\n'+
    '  ♥♥♥♥♥♥♥♥♥♥♥♥♥\n'+
    '    ♥♥♥♥♥♥♥♥♥\n'+
    '      ♥♥♥♥♥\n'+
    '        ♥\n', s);
  console.log('%c// written for you, line by line', s3);
  console.log('%c\n'+
    'class Love {\n'+
    '  constructor() {\n'+
    '    this.personA = "如月";\n'+
    '    this.personB = "粮哥";\n'+
    '    this.since = new Date("2023-11-09");\n'+
    '    this.status = "married"; // 💍\n'+
    '  }\n'+
    '\n'+
    '  getDaysTogether() {\n'+
    '    return Math.floor((Date.now() - this.since) / 86400000);\n'+
    '  }\n'+
    '\n'+
    '  async forever() {\n'+
    '    while (true) {\n'+
    '      await this.nextDay();\n'+
    '      this.love++;\n'+
    '      // no break;\n'+
    '      // no return;\n'+
    '      // no exit;\n'+
    '    }\n'+
    '  }\n'+
    '}\n'+
    '\n'+
    'const us = new Love();\n'+
    'us.forever(); // since 2023.11.09\n', s2);
  var d=Math.floor((Date.now()-new Date('2023-11-09').getTime())/86400000);
  console.log('%c// 在一起第 '+d+' 天 ❤️', s);
  console.log('%c// 520 快乐，粮哥', s);
  console.log('%c\n// P.S. 如果你在看这段代码\n// 说明你果然是个程序员\n// 这整个项目都是为你写的\n// WebGL + GLSL + PixiJS\n// 就像我们的故事\n// 每一帧都不想跳过 ❤️\n', s3);
})();

// Hidden: tap ending 5 times for secret
var _eTaps=0,_eTimer=null;
function _eggCheck(){
  _eTaps++;
  clearTimeout(_eTimer);
  _eTimer=setTimeout(function(){_eTaps=0;},2000);
  if(_eTaps>=5){
    _eTaps=0;
    var d=Math.floor((Date.now()-new Date('2023-11-09').getTime())/86400000);
    var ov=document.createElement('div');
    ov.style.cssText='position:fixed;inset:0;z-index:9999;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,0.92);opacity:0;transition:opacity 0.8s;cursor:pointer';
    ov.innerHTML='<div style="text-align:center;font-family:monospace;color:#ff9cc2;padding:20px">'+
      '<pre style="font-size:clamp(10px,2.5vw,16px);line-height:1.6;color:#ffb3d0">'+
      'class OurStory {\n'+
      '  started = "小学";\n'+
      '  plot_twist = "毕业徒步";\n'+
      '  confession = "河套护栏";\n'+
      '  proposal = "乌兰察布烟花";\n'+
      '  married = "2023.11.09";\n'+
      '  days = '+d+';\n'+
      '\n'+
      '  while (true) {\n'+
      '    love(粮哥);\n'+
      '    // no break\n'+
      '    // no exit\n'+
      '    // just us\n'+
      '  }\n'+
      '}\n'+
      '</pre>'+
      '<p style="margin-top:24px;font-size:clamp(14px,4vw,22px);color:#fff">520 快乐 ❤️</p>'+
      '<p style="margin-top:8px;font-size:12px;color:#666">// 点击关闭</p>'+
      '</div>';
    document.body.appendChild(ov);
    setTimeout(function(){ov.style.opacity='1';},50);
    ov.addEventListener('click',function(){ov.style.opacity='0';setTimeout(function(){ov.remove();},800);});
  }
}
// Hook into ending scene - listen when last scene is playing
// Always listen for taps - egg only triggers on last scene
pixi.view.addEventListener('click',_eggTap);
pixi.view.addEventListener('touchstart',function(e){
  if(curIdx===SCENES.length-1) _eggCheck();
});
function _eggTap(){if(curIdx===SCENES.length-1) _eggCheck();}

})();

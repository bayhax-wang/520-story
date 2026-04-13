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

var TDUR = 1.2; // transition duration
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
var tring = false, trProg = 0; // transitioning

// ═══════ LAYERS ═══════
var sLayer = new PIXI.Container(); // current scene
var nLayer = new PIXI.Container(); // next scene (for transition)
var pLayer = new PIXI.Container(); // particles
pixi.stage.addChild(sLayer, nLayer, pLayer);

// ═══════ TEXTURE CACHE ═══════
var texC = {};
function loadTex(src) {
  if (texC[src]) return Promise.resolve(texC[src]);
  return new Promise(function(ok, no) {
    var img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = function() { texC[src] = PIXI.Texture.from(img); ok(texC[src]); };
    img.onerror = no;
    img.src = src;
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
  var g = ctx.createRadialGradient(256,256,80, 256,256,360);
  g.addColorStop(0, 'rgba(0,0,0,0)');
  g.addColorStop(0.7, 'rgba(0,0,0,0.15)');
  g.addColorStop(1, 'rgba(0,0,0,0.65)');
  ctx.fillStyle = g; ctx.fillRect(0,0,512,512);
  return PIXI.Texture.from(c);
}
var vigTex = makeVignette();

function makeGlow(r, col) {
  var c = document.createElement('canvas'), s = r*4;
  c.width = s; c.height = s;
  var ctx = c.getContext('2d');
  var g = ctx.createRadialGradient(s/2,s/2,0, s/2,s/2,r);
  g.addColorStop(0, col || 'rgba(255,255,240,0.8)');
  g.addColorStop(0.5, col || 'rgba(255,220,200,0.3)');
  g.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = g; ctx.fillRect(0,0,s,s);
  return PIXI.Texture.from(c);
}
var dustTex = makeGlow(16);
var burstTex = makeGlow(8, 'rgba(255,140,180,0.9)');

// ═══════ HELPERS ═══════
function lerp(a,b,t) { return a+(b-a)*t; }
function eio(t) { return t < 0.5 ? 2*t*t : -1+(4-2*t)*t; } // ease in-out
function eo(t) { return 1 - Math.pow(1-t, 3); } // ease out

function fitCover(tw,th,sw,sh) {
  if (tw/th > sw/sh) return { w: sh*(tw/th), h: sh };
  return { w: sw, h: sw/(tw/th) };
}

function makeGrad(c1, c2) {
  var g = new PIXI.Graphics(), steps = 48, sh = Math.ceil(H()/steps)+1;
  for (var i = 0; i < steps; i++) {
    var t = i/(steps-1);
    var r = lerp((c1>>16)&0xff, (c2>>16)&0xff, t);
    var gr = lerp((c1>>8)&0xff, (c2>>8)&0xff, t);
    var b = lerp(c1&0xff, c2&0xff, t);
    g.beginFill((Math.round(r)<<16)|(Math.round(gr)<<8)|Math.round(b));
    g.drawRect(0, i*sh, W(), sh);
    g.endFill();
  }
  return g;
}

function fc(cont, name) { // find child by name
  for (var i = 0; i < cont.children.length; i++)
    if (cont.children[i].name === name) return cont.children[i];
  return null;
}

// ═══════ FLOATING PARTICLES ═══════
var aParts = null; // active particles
function FloatP(cont, n, tex, spd) {
  this.sp = []; this.d = [];
  var w = W(), h = H();
  for (var i = 0; i < n; i++) {
    var s = new PIXI.Sprite(tex);
    s.anchor.set(0.5); s.blendMode = PIXI.BLEND_MODES.ADD;
    s.scale.set(0.3 + Math.random()*0.7); s.alpha = 0;
    s.x = Math.random()*w; s.y = Math.random()*h;
    cont.addChild(s); this.sp.push(s);
    this.d.push({ vx:(Math.random()-0.5)*(spd||0.3),
      vy:-0.1-Math.random()*(spd||0.3), lf:Math.random()*Math.PI*2,
      ba:0.15+Math.random()*0.35, dr:(Math.random()-0.5)*0.5 });
  }
}
FloatP.prototype.update = function(dt) {
  var w = W(), h = H();
  for (var i = 0; i < this.sp.length; i++) {
    var s = this.sp[i], d = this.d[i];
    d.lf += dt*0.8;
    s.x += d.vx + Math.sin(d.lf)*d.dr*dt*30;
    s.y += d.vy;
    s.alpha = d.ba * (0.5 + 0.5*Math.sin(d.lf));
    if (s.y < -20) { s.y = h+20; s.x = Math.random()*w; }
    if (s.x < -20) s.x = w+20;
    if (s.x > w+20) s.x = -20;
  }
};
FloatP.prototype.destroy = function() {
  for (var i = 0; i < this.sp.length; i++) this.sp[i].destroy();
  this.sp = []; this.d = [];
};

// ═══════ BURST PARTICLES ═══════
var aBurst = null;
function BurstP(cont, n) {
  this.sp = []; this.d = [];
  var cx = W()/2, cy = H()/2;
  for (var i = 0; i < n; i++) {
    var s = new PIXI.Sprite(burstTex);
    s.anchor.set(0.5); s.blendMode = PIXI.BLEND_MODES.ADD;
    s.scale.set(0.5+Math.random()); s.alpha = 0;
    s.x = cx; s.y = cy;
    cont.addChild(s); this.sp.push(s);
    var a = Math.random()*Math.PI*2, sp = 2+Math.random()*6;
    this.d.push({ vx:Math.cos(a)*sp, vy:Math.sin(a)*sp,
      lf:0, ml:1.5+Math.random()*2, dl:Math.random()*0.5 });
  }
}
BurstP.prototype.update = function(dt, el) {
  for (var i = 0; i < this.sp.length; i++) {
    var s = this.sp[i], d = this.d[i];
    if (el < d.dl) continue;
    d.lf += dt;
    var t = Math.min(d.lf/d.ml, 1);
    s.x += d.vx*(1-t*0.5); s.y += d.vy*(1-t*0.5);
    s.alpha = t < 0.1 ? t/0.1 : Math.max(0, 1-(t-0.1)/0.9);
    s.scale.set((0.5+Math.random()*0.3)*(1-t*0.5));
    d.vx *= 0.99; d.vy *= 0.99;
  }
};
BurstP.prototype.destroy = function() {
  for (var i = 0; i < this.sp.length; i++) this.sp[i].destroy();
  this.sp = []; this.d = [];
};

// ═══════ SCENE STATE ═══════
var aBubs = [], tyState = null, waState = null;
function clearAll() {
  if (aParts) { aParts.destroy(); aParts = null; }
  if (aBurst) { aBurst.destroy(); aBurst = null; }
  pLayer.removeChildren();
  aBubs = []; tyState = null; waState = null;
}

// ═══════ BUBBLE ═══════
function mkBub(text, italic) {
  var c = new PIXI.Container();
  var fs = Math.min(W()*0.045, 24);
  var tx = new PIXI.Text(text, {
    fontFamily:FT, fontSize:fs, fill:italic?'#e0d0ff':'#fff',
    fontStyle:italic?'italic':'normal', wordWrap:true,
    wordWrapWidth:W()*0.7, align:'center'
  });
  tx.anchor.set(0.5);
  var p = 16, bg = new PIXI.Graphics();
  bg.beginFill(0x000000, 0.45);
  bg.drawRoundedRect(-tx.width/2-p, -tx.height/2-p*0.7,
    tx.width+p*2, tx.height+p*1.4, 16);
  bg.endFill();
  c.addChild(bg, tx); c.alpha = 0;
  return c;
}

// ═══════ SCENE BUILDERS ═══════
function buildImage(cont, sc) {
  var tex = texC[sc.img]; if (!tex) return;
  var w = W(), h = H(), f = fitCover(tex.width, tex.height, w, h);
  var sp = new PIXI.Sprite(tex);
  sp.anchor.set(0.5); sp.width = f.w; sp.height = f.h;
  sp.x = w/2; sp.y = h/2; sp.name = 'mi';
  cont.addChild(sp);
  // vignette
  var v = new PIXI.Sprite(vigTex); v.width = w; v.height = h; v.alpha = 0.9;
  cont.addChild(v);
  // particles
  aParts = new FloatP(pLayer, 30, dustTex, 0.3);
  // bubbles
  var bs = sc.bubbles || [], yo = h * 0.25;
  for (var i = 0; i < bs.length; i++) {
    var b = mkBub(bs[i].t, bs[i].th);
    b.x = w/2; b.y = yo + i*Math.min(65, h*0.08);
    b.name = 'b'+i; b._dl = bs[i].d;
    cont.addChild(b); aBubs.push(b);
  }
}

function buildText(cont, sc) {
  var w = W(), h = H();
  cont.addChild(makeGrad(sc.bg[0], sc.bg[1]));
  var ts = Math.min(w*0.09, 48);
  var ti = new PIXI.Text(sc.title||'', {
    fontFamily:FT, fontSize:ts, fill:'#fff', fontWeight:'700', align:'center'
  });
  ti.anchor.set(0.5); ti.x = w/2; ti.y = h*0.3;
  ti.alpha = 0; ti.name = 'ti'; cont.addChild(ti);
  var ls = Math.min(w*0.05, 22), ll = sc.lines || [];
  for (var i = 0; i < ll.length; i++) {
    var t = new PIXI.Text(ll[i], {
      fontFamily:FT, fontSize:ls, fill:'rgba(255,255,255,0.85)',
      align:'center', wordWrap:true, wordWrapWidth:w*0.8
    });
    t.anchor.set(0.5); t.x = w/2; t.y = h*0.45 + i*(ls+16);
    t.alpha = 0; t.name = 'l'+i; cont.addChild(t);
  }
  aParts = new FloatP(pLayer, 15, dustTex, 0.15);
}

function buildTyping(cont, sc) {
  var w = W(), h = H();
  cont.addChild(makeGrad(sc.bg[0], sc.bg[1]));
  var ts = Math.min(w*0.08, 40);
  var ti = new PIXI.Text(sc.title, {fontFamily:FT,fontSize:ts,fill:'#fff',fontWeight:'700'});
  ti.anchor.set(0.5); ti.x = w/2; ti.y = h*0.22;
  ti.alpha = 0; ti.name = 'ti'; cont.addChild(ti);
  // phone frame
  var pw = Math.min(w*0.7, 300), ph = pw*0.5;
  var px = w/2-pw/2, py = h*0.38;
  var pg = new PIXI.Graphics();
  pg.lineStyle(2, 0x444466);
  pg.beginFill(0x111122, 0.6);
  pg.drawRoundedRect(px, py, pw, ph, 16);
  pg.endFill(); cont.addChild(pg);
  // text
  var ls = Math.min(w*0.045, 20);
  var tt = new PIXI.Text('', {fontFamily:FT,fontSize:ls,fill:'#fff',wordWrap:true,wordWrapWidth:pw-30});
  tt.x = px+15; tt.y = py+15; tt.name = 'tt'; cont.addChild(tt);
  // cursor
  var cu = new PIXI.Graphics();
  cu.beginFill(0xffffff); cu.drawRect(0,0,2,ls+4); cu.endFill();
  cu.name = 'cu'; cont.addChild(cu);
  tyState = { texts:sc.lines||[], cl:0, ci:0, timer:0,
    cd:0.08, ld:1.2, waiting:false, wt:0, built:'', to:tt, co:cu };
  aParts = new FloatP(pLayer, 10, dustTex, 0.1);
}

function buildWaiting(cont, sc) {
  var w = W(), h = H();
  cont.addChild(makeGrad(sc.bg[0], sc.bg[1]));
  var ts = Math.min(w*0.08, 40);
  var ti = new PIXI.Text(sc.title, {fontFamily:FT,fontSize:ts,fill:'#fff',fontWeight:'700'});
  ti.anchor.set(0.5); ti.x = w/2; ti.y = h*0.22;
  ti.alpha = 0; ti.name = 'ti'; cont.addChild(ti);
  // phone
  var pw = Math.min(w*0.5, 220), ph = pw*1.6;
  var px = w/2-pw/2, py = h*0.32;
  var pg = new PIXI.Graphics();
  pg.lineStyle(2, 0x444466);
  pg.beginFill(0x0a0a1e, 0.7);
  pg.drawRoundedRect(px, py, pw, ph, 24);
  pg.endFill();
  pg.beginFill(0x111133, 0.5);
  pg.drawRoundedRect(px+8, py+40, pw-16, ph-80, 8);
  pg.endFill(); cont.addChild(pg);
  // dots
  var ds = Math.min(w*0.06, 28);
  var dt = new PIXI.Text('', {fontFamily:FT,fontSize:ds,fill:'#aaaacc',align:'center'});
  dt.anchor.set(0.5); dt.x = w/2; dt.y = py+ph/2;
  dt.name = 'dots'; cont.addChild(dt);
  // lines
  var ls = Math.min(w*0.04, 18), ll = sc.lines || [];
  for (var i = 0; i < ll.length; i++) {
    var t = new PIXI.Text(ll[i], {fontFamily:FT,fontSize:ls,fill:'rgba(255,255,255,0.7)',
      align:'center',wordWrap:true,wordWrapWidth:w*0.8});
    t.anchor.set(0.5); t.x = w/2; t.y = py+ph+30+i*(ls+12);
    t.alpha = 0; t.name = 'l'+i; cont.addChild(t);
  }
  waState = { el: 0 };
  aParts = new FloatP(pLayer, 12, dustTex, 0.12);
}

function buildBurst(cont, sc) {
  var w = W(), h = H();
  cont.addChild(makeGrad(sc.bg[0], sc.bg[1]));
  var ts = Math.min(w*0.1, 52);
  var ti = new PIXI.Text(sc.title, {fontFamily:FT,fontSize:ts,fill:'#ff8fbf',fontWeight:'700'});
  ti.anchor.set(0.5); ti.x = w/2; ti.y = h*0.35;
  ti.alpha = 0; ti.name = 'ti'; cont.addChild(ti);
  var ht = new PIXI.Text('\u2764\ufe0f', {fontFamily:FT,fontSize:Math.min(w*0.2,100)});
  ht.anchor.set(0.5); ht.x = w/2; ht.y = h*0.55;
  ht.alpha = 0; ht.name = 'ht'; ht.scale.set(0.3); cont.addChild(ht);
  aBurst = new BurstP(pLayer, 80);
}

function buildScene(cont, idx) {
  var sc = SCENES[idx]; if (!sc) return;
  switch(sc.type) {
    case 'image': buildImage(cont, sc); break;
    case 'typing': buildTyping(cont, sc); break;
    case 'waiting': buildWaiting(cont, sc); break;
    case 'burst': buildBurst(cont, sc); break;
    default: buildText(cont, sc);
  }
}

// ═══════ TRANSITIONS ═══════
var trIdx = 0, trData = null;

function startTr(from, to, ti) {
  tring = true; trProg = 0; trIdx = ti;
  trData = { f: from, t: to };
  to.alpha = 0; to.visible = true;
}

function finishTr() {
  if (!trData) return;
  tring = false;
  trData.f.visible = false; trData.f.alpha = 1; trData.f.scale.set(1);
  trData.t.alpha = 1; trData.t.scale.set(1);
  while (trData.t.children.length > 0) {
    var c = trData.t.children[0];
    trData.t.removeChild(c);
    sLayer.addChild(c);
  }
  nLayer.removeChildren();
  trData = null;
}

function updateTr(dt) {
  if (!tring || !trData) return;
  trProg += dt / TDUR;
  if (trProg >= 1) { trProg = 1; finishTr(); return; }
  var t = eio(trProg);
  switch (trIdx % 3) {
    case 0: // dissolve
      trData.f.alpha = 1 - t;
      trData.t.alpha = t;
      break;
    case 1: // ripple
      trData.f.scale.set(1 + Math.sin(trProg*Math.PI*4)*0.02*(1-t));
      trData.f.alpha = 1 - t;
      trData.t.alpha = t;
      trData.t.scale.set(1);
      break;
    case 2: // pixelate
      if (t < 0.5) {
        trData.f.scale.set(1 - t*0.06);
        trData.f.alpha = 1; trData.t.alpha = 0;
      } else {
        var p = (t-0.5)/0.5;
        trData.f.alpha = 1-p; trData.t.alpha = p;
        trData.t.scale.set(1);
      }
      break;
  }
}

// ═══════ SCENE UPDATE ═══════
function updateScene(dt, el) {
  var sc = SCENES[curIdx]; if (!sc) return;

  // title fade
  var ti = fc(sLayer, 'ti');
  if (ti) ti.alpha = eo(Math.min(el/1.0, 1));

  // line stagger
  for (var i = 0; i < 10; i++) {
    var ln = fc(sLayer, 'l'+i);
    if (!ln) break;
    ln.alpha = eo(Math.max(0, Math.min((el - 0.8 - i*0.6) / 0.8, 1)));
  }

  // Ken Burns
  if (sc.type === 'image') {
    var im = fc(sLayer, 'mi');
    if (im && texC[sc.img]) {
      var p = el / sc.dur;
      var s = 1 + p * 0.08;
      var px = Math.sin(p*Math.PI*0.5) * W()*0.01;
      var py = Math.cos(p*Math.PI*0.3) * H()*0.005;
      var f = fitCover(texC[sc.img].width, texC[sc.img].height, W(), H());
      im.width = f.w * s; im.height = f.h * s;
      im.x = W()/2 + px; im.y = H()/2 + py;
    }
  }

  // bubble fade-in
  for (var j = 0; j < aBubs.length; j++) {
    var b = aBubs[j];
    if (el >= b._dl && b.alpha < 1) b.alpha = Math.min(b.alpha + dt*1.5, 1);
  }

  // burst heart
  if (sc.type === 'burst') {
    var ht = fc(sLayer, 'ht');
    if (ht) {
      var bt = Math.min(el/0.8, 1);
      ht.alpha = eo(bt); ht.scale.set(0.3 + bt*1.2);
    }
  }

  // typing effect
  if (tyState) {
    var ts = tyState;
    if (!ts.waiting) {
      if (ts.cl < ts.texts.length) {
        ts.timer += dt;
        if (ts.timer >= ts.cd) {
          ts.timer = 0; ts.ci++;
          var line = ts.texts[ts.cl];
          if (ts.ci > line.length) {
            ts.waiting = true; ts.wt = 0; ts.ci = 0;
            ts.cl++; ts.built += line + '\n';
          } else {
            ts.to.text = ts.built + line.substring(0, ts.ci);
          }
        }
      }
    } else {
      ts.wt += dt;
      if (ts.wt >= ts.ld && ts.cl < ts.texts.length) {
        ts.waiting = false; ts.timer = 0;
      }
    }
    if (ts.co) {
      ts.co.x = ts.to.x + ts.to.width + 2;
      ts.co.y = ts.to.y + ts.to.height - ts.co.height;
      ts.co.alpha = Math.sin(el * 4) > 0 ? 1 : 0;
    }
  }

  // waiting dots
  if (waState) {
    waState.el += dt;
    var dc = Math.floor(waState.el * 2) % 4;
    var ds = '';
    for (var k = 0; k < dc; k++) ds += '.';
    var dObj = fc(sLayer, 'dots');
    if (dObj) dObj.text = '对方正在输入' + ds;
  }

  // particles
  if (aParts) aParts.update(dt);
  if (aBurst) aBurst.update(dt, el);
}

// ═══════ NAVIGATION ═══════
var trCount = 0;
function goScene(idx) {
  if (idx < 0 || idx >= SCENES.length) return;
  var prev = curIdx;
  curIdx = idx; scnT = 0;
  clearAll();
  if (prev < 0) {
    sLayer.removeChildren();
    buildScene(sLayer, idx);
  } else {
    nLayer.removeChildren();
    buildScene(nLayer, idx);
    startTr(sLayer, nLayer, trCount++);
  }
  var sc = SCENES[idx];
  var lb = document.getElementById('scene-label');
  if (lb) {
    if (sc.caption) { lb.textContent = sc.caption; lb.classList.remove('hidden'); }
    else { lb.classList.add('hidden'); }
  }
}

// ═══════ UI ═══════
var startScr = document.getElementById('start-screen');
var pauseInd = document.getElementById('pause-indicator');
var progFill = document.getElementById('progress-fill');

function doStart() {
  if (started) return;
  started = true;
  startScr.classList.add('hidden');
  preload().then(function() { goScene(0); }).catch(function(e) {
    console.error('preload err', e); goScene(0);
  });
}

startScr.addEventListener('click', doStart);
startScr.addEventListener('touchend', function(e) { e.preventDefault(); doStart(); });

pixi.view.addEventListener('click', function() {
  if (!started) return;
  paused = !paused;
  if (paused) pauseInd.classList.remove('hidden');
  else pauseInd.classList.add('hidden');
});
pixi.view.addEventListener('touchend', function(e) {
  if (!started) return;
  e.preventDefault();
  paused = !paused;
  if (paused) pauseInd.classList.remove('hidden');
  else pauseInd.classList.add('hidden');
});

// ═══════ MAIN LOOP ═══════
pixi.ticker.add(function(delta) {
  if (!started || paused) return;
  var dt = delta / 60;

  if (tring) { updateTr(dt); return; }

  scnT += dt; totEl += dt;

  // progress bar
  if (progFill) {
    var p = 0;
    for (var i = 0; i < curIdx; i++) p += SCENES[i].dur;
    p += scnT;
    progFill.style.width = Math.min(p / totalDur * 100, 100) + '%';
  }

  updateScene(dt, scnT);

  // auto-advance
  if (curIdx >= 0 && curIdx < SCENES.length && scnT >= SCENES[curIdx].dur) {
    if (curIdx < SCENES.length - 1) {
      goScene(curIdx + 1);
    } else {
      paused = true;
      pauseInd.textContent = '\u2728 故事结束 \u00b7 520快乐 \u2764\ufe0f';
      pauseInd.classList.remove('hidden');
    }
  }
});

// ═══════ RESIZE ═══════
window.addEventListener('resize', function() {
  if (curIdx >= 0 && !tring) {
    var idx = curIdx;
    clearAll(); sLayer.removeChildren();
    buildScene(sLayer, idx);
  }
});

})();

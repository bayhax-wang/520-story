(function(){
'use strict';

// ═══════ LEVEL DATA ═══════
var LEVELS = [
  {img:'images/01-primary.jpg',    caption:'同一所小学 · 他在1班，她在2班'},
  {img:'images/02-high.jpg',       caption:'高中同校 · 公交站偶遇'},
  {img:'images/03-mountain.jpg',   caption:'毕业徒步 · 命运的交汇点'},
  {img:'images/04-parting.jpg',    caption:'九月 · 她上大学，他复读一年'},
  {img:'images/05-confession.jpg', caption:'2023年初 · 河套 · 护栏旁'},
  {img:'images/06-proposal.jpg',   caption:'乌兰察布 · 露营 · 烟花'},
  {img:'images/07-seaside-real.jpg',caption:'从此，每一天都是我们的故事'}
];
var GRID_COLS = 4, GRID_ROWS = 4, TOTAL_PIECES = 16;

// ═══════ DOM REFS ═══════
function $(id){ return document.getElementById(id); }
var lobby      = $('lobby');
var gameUI     = $('game');
var celebrate  = $('celebrate');
var nameInput  = $('player-name');
var roomInput  = $('room-input');
var btnCreate  = $('btn-create');
var btnJoin    = $('btn-join');
var btnCopy    = $('btn-copy');
var roomInfo   = $('room-info');
var roomCodeVal= $('room-code-value');
var statusMsg  = $('status-msg');
var levelLabel = $('level-label');
var sceneCaption= $('scene-caption');
var progressCount= $('progress-count');
var timerEl    = $('timer');
var puzzleGrid = $('puzzle-grid');
var piecesContainer= $('pieces-container');
var refToggle  = $('ref-image-toggle');
var refPopup   = $('ref-image-popup');
var refImage   = $('ref-image');
var refClose   = refPopup.querySelector('.ref-close');
var btnNext    = $('btn-next');
var btnBackStory= $('btn-back-story');
var confettiCanvas= $('confetti-canvas');
var completeImgWrap= $('complete-image-wrap');
var completeCaption= $('complete-caption');
var completeTime= $('complete-time');

// ═══════ STATE ═══════
var myName = '';
var isHost = false;
var peer = null;
var conn = null;
var roomCode = '';
var currentLevel = 0;
var pieces = [];
var gridCells = [];
var lockedCount = 0;
var timerStart = 0;
var timerInterval = null;
var dragPiece = null;
var dragOffsetX = 0, dragOffsetY = 0;
var pieceSize = 0;
var gridRect = null;
var peerDragging = {};
var peerName = '';
var gameActive = false;
var confettiAnim = null;

// ═══════ HELPERS ═══════
function show(el){ el.classList.remove('hidden'); }
function hide(el){ el.classList.add('hidden'); }

function showStatus(msg, type){
  statusMsg.textContent = msg;
  statusMsg.className = type || 'info';
  show(statusMsg);
}

function genRoomCode(){
  var code = '';
  for(var i = 0; i < 6; i++) code += Math.floor(Math.random()*10);
  return code;
}

function formatTime(ms){
  var s = Math.floor(ms / 1000);
  var m = Math.floor(s / 60);
  s = s % 60;
  return (m < 10 ? '0' : '') + m + ':' + (s < 10 ? '0' : '') + s;
}

// ═══════ PEERJS CONNECTION ═══════
function createRoom(){
  myName = nameInput.value.trim() || '如月';
  roomCode = genRoomCode();
  isHost = true;

  showStatus('正在创建房间...', 'info');
  btnCreate.disabled = true;
  btnJoin.disabled = true;

  peer = new Peer('puzzle520-' + roomCode, {
    debug: 0,
    config: {
      iceServers: [
        {urls: 'stun:stun.l.google.com:19302'},
        {urls: 'stun:global.stun.twilio.com:3478'}
      ]
    }
  });

  peer.on('open', function(){
    statusMsg.className = '';
    hide(statusMsg);
    roomCodeVal.textContent = roomCode;
    show(roomInfo);
  });

  peer.on('connection', function(c){
    conn = c;
    setupDataChannel();
  });

  peer.on('error', function(err){
    if(err.type === 'unavailable-id'){
      roomCode = genRoomCode();
      peer.destroy();
      createRoom();
      return;
    }
    showStatus('连接错误: ' + err.message, 'error');
    btnCreate.disabled = false;
    btnJoin.disabled = false;
  });
}

function joinRoom(){
  myName = nameInput.value.trim() || '粮哥';
  roomCode = roomInput.value.trim();
  if(!roomCode || roomCode.length !== 6){
    showStatus('请输入6位房间码', 'error');
    return;
  }
  isHost = false;

  showStatus('连接中...', 'info');
  btnCreate.disabled = true;
  btnJoin.disabled = true;

  peer = new Peer(undefined, {
    debug: 0,
    config: {
      iceServers: [
        {urls: 'stun:stun.l.google.com:19302'},
        {urls: 'stun:global.stun.twilio.com:3478'}
      ]
    }
  });

  peer.on('open', function(){
    conn = peer.connect('puzzle520-' + roomCode, {reliable: true});
    conn.on('open', function(){
      setupDataChannel();
    });
    conn.on('error', function(err){
      showStatus('无法连接到房间', 'error');
      btnCreate.disabled = false;
      btnJoin.disabled = false;
    });
  });

  peer.on('error', function(err){
    showStatus('连接错误: ' + err.message, 'error');
    btnCreate.disabled = false;
    btnJoin.disabled = false;
  });
}

function setupDataChannel(){
  conn.on('open', function(){
    sendMsg({type: 'hello', name: myName, level: currentLevel});
    showStatus('已连接！准备开始...', 'success');
    setTimeout(function(){
      hide(lobby);
      show(gameUI);
      if(isHost) startLevel(currentLevel);
    }, 800);
  });

  conn.on('data', function(data){ handleMessage(data); });

  conn.on('close', function(){
    if(gameActive){
      gameActive = false;
      stopTimer();
      alert('对方已断开连接');
      window.location.reload();
    }
  });
}

function sendMsg(data){
  if(conn && conn.open){
    try { conn.send(data); } catch(e){}
  }
}

// ═══════ MESSAGE HANDLING ═══════
function handleMessage(data){
  if(!data || !data.type) return;

  switch(data.type){
    case 'hello':
      peerName = data.name || '对方';
      break;

    case 'start-level':
      currentLevel = data.level;
      startLevel(data.level, data.order);
      break;

    case 'pick':
      onPeerPick(data.id);
      break;

    case 'move':
      onPeerMove(data.id, data.x, data.y);
      break;

    case 'place':
      onPeerPlace(data.id, data.pos);
      break;

    case 'return':
      onPeerReturn(data.id);
      break;

    case 'lock':
      lockPiece(data.id, data.pos, true);
      break;

    case 'complete':
      onComplete();
      break;

    case 'next-level':
      currentLevel = data.level;
      hide(celebrate);
      show(gameUI);
      startLevel(data.level, data.order);
      break;
  }
}

// ═══════ LEVEL SETUP ═══════
function startLevel(levelIdx, shuffleOrder){
  if(levelIdx >= LEVELS.length){
    showFinalScreen();
    return;
  }
  gameActive = true;
  currentLevel = levelIdx;
  var lvl = LEVELS[levelIdx];

  levelLabel.textContent = '第 ' + (levelIdx + 1) + ' / ' + LEVELS.length + ' 关';
  sceneCaption.textContent = lvl.caption;
  progressCount.textContent = '0 / ' + TOTAL_PIECES;

  lockedCount = 0;
  pieces = [];
  gridCells = [];
  peerDragging = {};
  dragPiece = null;
  puzzleGrid.innerHTML = '';
  piecesContainer.innerHTML = '';
  refImage.src = lvl.img;

  var img = new Image();
  img.crossOrigin = 'anonymous';
  img.onload = function(){
    buildPuzzle(img, shuffleOrder);
    startTimer();

    if(isHost && !shuffleOrder){
      var order = pieces.map(function(p){ return p.id; });
      sendMsg({type: 'start-level', level: levelIdx, order: order});
    }
  };
  img.src = lvl.img;
}

function buildPuzzle(img, shuffleOrder){
  var areaW = window.innerWidth - 16;
  var areaH = window.innerHeight * 0.52;
  var maxGridW = Math.min(areaW, 400);
  var maxGridH = areaH - 16;
  var imgRatio = img.naturalWidth / img.naturalHeight;
  var gridW, gridH;

  if(maxGridW / maxGridH > imgRatio){
    gridH = maxGridH;
    gridW = gridH * imgRatio;
  } else {
    gridW = maxGridW;
    gridH = gridW / imgRatio;
  }

  pieceSize = Math.floor(Math.min(gridW / GRID_COLS, gridH / GRID_ROWS));
  gridW = pieceSize * GRID_COLS;
  gridH = pieceSize * GRID_ROWS;

  puzzleGrid.style.width = gridW + 'px';
  puzzleGrid.style.height = gridH + 'px';

  // create grid cells
  for(var i = 0; i < TOTAL_PIECES; i++){
    var cell = document.createElement('div');
    cell.className = 'grid-cell';
    cell.style.width = pieceSize + 'px';
    cell.style.height = pieceSize + 'px';
    cell.dataset.pos = i;
    puzzleGrid.appendChild(cell);
    gridCells.push(cell);
  }

  // create shuffled pieces
  var ids = [];
  for(var j = 0; j < TOTAL_PIECES; j++) ids.push(j);

  if(shuffleOrder){
    ids = shuffleOrder.slice();
  } else {
    for(var k = ids.length - 1; k > 0; k--){
      var r = Math.floor(Math.random() * (k + 1));
      var tmp = ids[k]; ids[k] = ids[r]; ids[r] = tmp;
    }
  }

  for(var p = 0; p < ids.length; p++){
    var id = ids[p];
    var el = makePieceEl(id, img, gridW, gridH);
    pieces.push({
      id: id,
      correctPos: id,
      currentPos: -1,
      locked: false,
      inTray: true,
      el: el
    });
    piecesContainer.appendChild(el);
  }

  setTimeout(function(){ gridRect = puzzleGrid.getBoundingClientRect(); }, 50);
}

function makePieceEl(id, img, gridW, gridH){
  var col = id % GRID_COLS;
  var row = Math.floor(id / GRID_COLS);
  var el = document.createElement('div');
  el.className = 'puzzle-piece in-tray';
  el.dataset.id = id;
  el.style.width = pieceSize + 'px';
  el.style.height = pieceSize + 'px';
  el.style.backgroundImage = 'url(' + img.src + ')';
  el.style.backgroundSize = gridW + 'px ' + gridH + 'px';
  el.style.backgroundPosition = (-col * pieceSize) + 'px ' + (-row * pieceSize) + 'px';

  el.addEventListener('mousedown', onDragStart);
  el.addEventListener('touchstart', onDragStart, {passive: false});
  return el;
}

// ═══════ DRAG & DROP ═══════
function onDragStart(e){
  if(!gameActive) return;
  var el = e.currentTarget;
  var id = parseInt(el.dataset.id);
  var piece = getPiece(id);
  if(!piece || piece.locked || peerDragging[id]) return;

  e.preventDefault();
  e.stopPropagation();
  dragPiece = piece;

  var touch = e.touches ? e.touches[0] : e;

  if(piece.inTray){
    liftFromTray(piece);
  } else if(piece.currentPos >= 0){
    liftFromGrid(piece);
  }

  dragOffsetX = touch.clientX - parseFloat(piece.el.style.left);
  dragOffsetY = touch.clientY - parseFloat(piece.el.style.top);

  piece.el.classList.add('dragging', 'mine-dragging');
  piece.el.style.zIndex = '200';

  sendMsg({type: 'pick', id: id});

  if(e.touches){
    document.addEventListener('touchmove', onDragMove, {passive: false});
    document.addEventListener('touchend', onDragEnd);
    document.addEventListener('touchcancel', onDragEnd);
  } else {
    document.addEventListener('mousemove', onDragMove);
    document.addEventListener('mouseup', onDragEnd);
  }
}

function liftFromTray(piece){
  var rect = piece.el.getBoundingClientRect();
  piece.inTray = false;
  piece.el.classList.remove('in-tray');

  var ph = document.createElement('div');
  ph.style.width = pieceSize + 'px';
  ph.style.height = pieceSize + 'px';
  ph.style.visibility = 'hidden';
  ph.className = 'puzzle-piece in-tray';
  ph.dataset.placeholder = piece.id;
  if(piece.el.parentNode === piecesContainer){
    piecesContainer.insertBefore(ph, piece.el);
  }

  piece.el.style.position = 'fixed';
  piece.el.style.left = rect.left + 'px';
  piece.el.style.top = rect.top + 'px';
  document.body.appendChild(piece.el);
}

function liftFromGrid(piece){
  if(piece.currentPos >= 0){
    gridCells[piece.currentPos].classList.remove('occupied');
  }
  var rect = piece.el.getBoundingClientRect();
  piece.currentPos = -1;
  piece.el.style.position = 'fixed';
  piece.el.style.left = rect.left + 'px';
  piece.el.style.top = rect.top + 'px';
  if(piece.el.parentNode !== document.body) document.body.appendChild(piece.el);
}

function onDragMove(e){
  if(!dragPiece) return;
  e.preventDefault();
  var touch = e.touches ? e.touches[0] : e;
  var x = touch.clientX - dragOffsetX;
  var y = touch.clientY - dragOffsetY;
  dragPiece.el.style.left = x + 'px';
  dragPiece.el.style.top = y + 'px';

  // highlight grid cell
  gridRect = puzzleGrid.getBoundingClientRect();
  var cx = touch.clientX - gridRect.left;
  var cy = touch.clientY - gridRect.top;
  for(var i = 0; i < gridCells.length; i++) gridCells[i].classList.remove('hover');

  if(cx >= 0 && cy >= 0 && cx < gridRect.width && cy < gridRect.height){
    var col = Math.floor(cx / pieceSize);
    var row = Math.floor(cy / pieceSize);
    if(col >= 0 && col < GRID_COLS && row >= 0 && row < GRID_ROWS){
      var idx = row * GRID_COLS + col;
      if(!gridCells[idx].classList.contains('locked')){
        gridCells[idx].classList.add('hover');
      }
    }
  }

  sendMsg({type: 'move', id: dragPiece.id, x: x, y: y});
}

function onDragEnd(e){
  if(!dragPiece) return;
  var piece = dragPiece;
  piece.el.classList.remove('dragging', 'mine-dragging');

  for(var i = 0; i < gridCells.length; i++) gridCells[i].classList.remove('hover');

  var t = e.changedTouches ? e.changedTouches[0] : e;
  gridRect = puzzleGrid.getBoundingClientRect();
  var cx = t.clientX - gridRect.left;
  var cy = t.clientY - gridRect.top;
  var placed = false;

  if(cx >= 0 && cy >= 0 && cx < gridRect.width && cy < gridRect.height){
    var col = Math.floor(cx / pieceSize);
    var row = Math.floor(cy / pieceSize);
    if(col >= 0 && col < GRID_COLS && row >= 0 && row < GRID_ROWS){
      var pos = row * GRID_COLS + col;
      if(!isCellOccupied(pos)){
        if(piece.id === pos){
          // correct!
          snapToGrid(piece, pos);
          lockPiece(piece.id, pos, false);
          sendMsg({type: 'lock', id: piece.id, pos: pos});
          placed = true;
        } else {
          // wrong but place it
          snapToGrid(piece, pos);
          sendMsg({type: 'place', id: piece.id, pos: pos});
          placed = true;
        }
      }
    }
  }

  if(!placed){
    returnToTray(piece);
    sendMsg({type: 'return', id: piece.id});
  }

  dragPiece = null;
  document.removeEventListener('mousemove', onDragMove);
  document.removeEventListener('mouseup', onDragEnd);
  document.removeEventListener('touchmove', onDragMove);
  document.removeEventListener('touchend', onDragEnd);
  document.removeEventListener('touchcancel', onDragEnd);
}

function snapToGrid(piece, pos){
  gridCells[pos].classList.add('occupied');
  piece.currentPos = pos;
  piece.inTray = false;
  piece.el.classList.remove('in-tray');
  piece.el.classList.add('placed');

  gridRect = puzzleGrid.getBoundingClientRect();
  var col = pos % GRID_COLS;
  var row = Math.floor(pos / GRID_COLS);
  piece.el.style.position = 'fixed';
  piece.el.style.left = (gridRect.left + col * pieceSize) + 'px';
  piece.el.style.top = (gridRect.top + row * pieceSize) + 'px';
  piece.el.style.zIndex = '5';

  removePlaceholder(piece.id);
  if(piece.el.parentNode !== document.body) document.body.appendChild(piece.el);
}

function returnToTray(piece){
  piece.currentPos = -1;
  piece.inTray = true;
  piece.el.classList.add('returning', 'in-tray');
  piece.el.classList.remove('placed');
  piece.el.style.position = '';
  piece.el.style.left = '';
  piece.el.style.top = '';
  piece.el.style.zIndex = '';

  var ph = piecesContainer.querySelector('[data-placeholder="' + piece.id + '"]');
  if(ph){
    piecesContainer.insertBefore(piece.el, ph);
    ph.remove();
  } else {
    piecesContainer.appendChild(piece.el);
  }
  setTimeout(function(){ piece.el.classList.remove('returning'); }, 300);
}

function removePlaceholder(id){
  var ph = piecesContainer.querySelector('[data-placeholder="' + id + '"]');
  if(ph) ph.remove();
}

function lockPiece(id, pos, fromPeer){
  var piece = getPiece(id);
  if(!piece || piece.locked) return;

  piece.locked = true;
  piece.currentPos = pos;
  piece.inTray = false;

  piece.el.classList.add('locked');
  piece.el.classList.remove('placed', 'dragging', 'mine-dragging', 'peer-dragging');

  var lbl = piece.el.querySelector('.peer-label');
  if(lbl) lbl.remove();

  snapToGrid(piece, pos);
  gridCells[pos].classList.add('locked', 'occupied');
  removePlaceholder(id);

  lockedCount++;
  progressCount.textContent = lockedCount + ' / ' + TOTAL_PIECES;

  // flash
  piece.el.style.boxShadow = '0 0 20px rgba(100,255,150,0.6)';
  setTimeout(function(){ piece.el.style.boxShadow = ''; }, 600);

  if(lockedCount >= TOTAL_PIECES){
    if(!fromPeer) sendMsg({type: 'complete'});
    setTimeout(onComplete, 500);
  }
}

function isCellOccupied(pos){
  for(var i = 0; i < pieces.length; i++){
    if(pieces[i].currentPos === pos) return true;
  }
  return false;
}

function getPiece(id){
  for(var i = 0; i < pieces.length; i++){
    if(pieces[i].id === id) return pieces[i];
  }
  return null;
}

// ═══════ PEER PIECE SYNC ═══════
function onPeerPick(id){
  var piece = getPiece(id);
  if(!piece || piece.locked) return;
  peerDragging[id] = true;

  piece.el.classList.add('peer-dragging');
  if(!piece.el.querySelector('.peer-label')){
    var lbl = document.createElement('span');
    lbl.className = 'peer-label';
    lbl.textContent = peerName || '对方';
    piece.el.appendChild(lbl);
  }

  if(piece.inTray){
    liftFromTray(piece);
  } else if(piece.currentPos >= 0){
    liftFromGrid(piece);
  }
}

function onPeerMove(id, x, y){
  var piece = getPiece(id);
  if(!piece || piece.locked) return;
  piece.el.style.left = x + 'px';
  piece.el.style.top = y + 'px';
}

function onPeerPlace(id, pos){
  var piece = getPiece(id);
  if(!piece || piece.locked) return;
  peerDragging[id] = false;
  piece.el.classList.remove('peer-dragging');
  var lbl = piece.el.querySelector('.peer-label');
  if(lbl) lbl.remove();
  snapToGrid(piece, pos);
}

function onPeerReturn(id){
  var piece = getPiece(id);
  if(!piece || piece.locked) return;
  peerDragging[id] = false;
  piece.el.classList.remove('peer-dragging');
  var lbl = piece.el.querySelector('.peer-label');
  if(lbl) lbl.remove();
  returnToTray(piece);
}

// ═══════ TIMER ═══════
function startTimer(){
  timerStart = Date.now();
  if(timerInterval) clearInterval(timerInterval);
  timerInterval = setInterval(function(){
    timerEl.textContent = formatTime(Date.now() - timerStart);
  }, 500);
}

function stopTimer(){
  if(timerInterval){ clearInterval(timerInterval); timerInterval = null; }
}

// ═══════ COMPLETION ═══════
function onComplete(){
  if(!gameActive) return;
  gameActive = false;
  stopTimer();
  var elapsed = Date.now() - timerStart;

  hide(gameUI);
  show(celebrate);

  var lvl = LEVELS[currentLevel];
  completeImgWrap.innerHTML = '<img src="' + lvl.img + '" alt="">';
  completeCaption.textContent = lvl.caption;
  completeTime.textContent = '🕐 用时 ' + formatTime(elapsed);

  if(currentLevel >= LEVELS.length - 1){
    btnNext.textContent = '🎉 全部完成！';
    btnNext.onclick = function(){ showFinalScreen(); };
  } else {
    btnNext.textContent = '下一关 →';
    btnNext.onclick = function(){
      var next = currentLevel + 1;
      hide(celebrate);
      show(gameUI);
      if(confettiAnim) cancelAnimationFrame(confettiAnim);
      if(isHost){
        startLevel(next);
      }
    };
    // host sends next-level on click; guest waits
    if(!isHost){
      btnNext.onclick = function(){
        hide(celebrate);
        show(gameUI);
        if(confettiAnim) cancelAnimationFrame(confettiAnim);
        // guest just waits for host's start-level message
      };
    }
  }

  runConfetti();
}

function showFinalScreen(){
  hide(gameUI);
  show(celebrate);
  if(confettiAnim) cancelAnimationFrame(confettiAnim);
  completeImgWrap.innerHTML = '<img src="images/07-seaside-real.jpg" alt="">';
  completeCaption.textContent = '🎉 所有拼图完成！520快乐 ❤️';
  completeTime.textContent = '从此，每一天都是我们的故事';
  btnNext.textContent = '🏠 回到故事';
  btnNext.onclick = function(){ window.location.href = 'index.html'; };
  runConfetti();
}

// ═══════ CONFETTI / HEARTS ═══════
function runConfetti(){
  var cvs = confettiCanvas;
  var ctx = cvs.getContext('2d');
  cvs.width = window.innerWidth;
  cvs.height = window.innerHeight;

  var colors = ['#ff6b9d','#ff9cc2','#ffb3d0','#ffd1e3','#88ffaa','#ffdd44','#ff4488','#ff88aa'];
  var particles = [];

  for(var i = 0; i < 100; i++){
    particles.push({
      x: Math.random() * cvs.width,
      y: Math.random() * cvs.height - cvs.height,
      vx: (Math.random() - 0.5) * 3,
      vy: Math.random() * 3 + 1.5,
      size: Math.random() * 8 + 3,
      color: colors[Math.floor(Math.random() * colors.length)],
      rot: Math.random() * 360,
      rv: (Math.random() - 0.5) * 8,
      heart: Math.random() > 0.6
    });
  }

  var frame = 0;
  function draw(){
    ctx.clearRect(0, 0, cvs.width, cvs.height);
    frame++;

    for(var i = 0; i < particles.length; i++){
      var p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.rot += p.rv;

      if(p.y > cvs.height + 20){
        p.y = -20;
        p.x = Math.random() * cvs.width;
      }

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot * Math.PI / 180);
      ctx.globalAlpha = 0.8;

      if(p.heart){
        drawHeart(ctx, 0, 0, p.size, p.color);
      } else {
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
      }
      ctx.restore();
    }

    if(frame < 600){
      confettiAnim = requestAnimationFrame(draw);
    }
  }
  draw();
}

function drawHeart(ctx, x, y, size, color){
  ctx.fillStyle = color;
  ctx.beginPath();
  var s = size * 0.5;
  ctx.moveTo(x, y + s * 0.3);
  ctx.bezierCurveTo(x, y - s * 0.3, x - s, y - s * 0.3, x - s, y + s * 0.1);
  ctx.bezierCurveTo(x - s, y + s * 0.6, x, y + s, x, y + s);
  ctx.bezierCurveTo(x, y + s, x + s, y + s * 0.6, x + s, y + s * 0.1);
  ctx.bezierCurveTo(x + s, y - s * 0.3, x, y - s * 0.3, x, y + s * 0.3);
  ctx.fill();
}

// ═══════ REF IMAGE TOGGLE ═══════
refToggle.addEventListener('click', function(){ show(refPopup); });
refClose.addEventListener('click', function(){ hide(refPopup); });
refPopup.addEventListener('click', function(e){
  if(e.target === refPopup) hide(refPopup);
});

// ═══════ LOBBY EVENTS ═══════
btnCreate.addEventListener('click', createRoom);
btnJoin.addEventListener('click', joinRoom);
btnCopy.addEventListener('click', function(){
  if(navigator.clipboard){
    navigator.clipboard.writeText(roomCode).then(function(){
      btnCopy.textContent = '✅';
      setTimeout(function(){ btnCopy.textContent = '📋'; }, 1500);
    });
  } else {
    // fallback
    var ta = document.createElement('textarea');
    ta.value = roomCode;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    ta.remove();
    btnCopy.textContent = '✅';
    setTimeout(function(){ btnCopy.textContent = '📋'; }, 1500);
  }
});

// enter key in room input
roomInput.addEventListener('keydown', function(e){
  if(e.key === 'Enter') joinRoom();
});

// back to story
btnBackStory.addEventListener('click', function(){
  window.location.href = 'index.html';
});

// handle resize
window.addEventListener('resize', function(){
  if(gameActive){
    setTimeout(function(){ gridRect = puzzleGrid.getBoundingClientRect(); }, 100);
  }
});

// prevent context menu on long-press
document.addEventListener('contextmenu', function(e){ e.preventDefault(); });

})();
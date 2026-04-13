/* ============================================================
   520 Story — Image-based Animation Film Player
   Image slideshow · Dialogue bubbles · Fade transitions
   ============================================================ */

var SCENES = [
  {
    id: 'prologue', label: '序章', dur: 6,
    img: null, // text-only scene
    caption: '有些人，走了很远的路\n才发现一直在彼此身边',
    bg: 'linear-gradient(135deg,#1a1230,#2d1f4e 40%,#6b3a6e 70%,#c47a5a)'
  },
  {
    id: 'primary', label: '第一章 · 小学', dur: 8,
    img: 'images/01-primary.jpg',
    bubbles: [
      { text: '那个男生背课文好厉害…', type: 'thought her', top: '12%', left: '55%', delay: 2 },
      { text: '被老师派来做示范的', type: 'him', top: '18%', right: '10%', delay: 4.5 }
    ],
    caption: '同一所小学，他在 1 班，她在 2 班'
  },
  {
    id: 'middle', label: '第一章 · 初中', dur: 7,
    img: null,
    caption: '初中不同校\n只隔一条街，却不知道彼此',
    bg: 'linear-gradient(180deg,#4a6fa5,#d4956a 60%,#e8b87a)'
  },
  {
    id: 'high', label: '第一章 · 高中', dur: 8,
    img: 'images/02-high.jpg',
    bubbles: [
      { text: '…嗨', type: 'her', top: '20%', right: '12%', delay: 2 },
      { text: '…嗯', type: 'him', top: '28%', left: '10%', delay: 4 },
      { text: '每天同一趟车，从不讲话', type: 'thought', bottom: '35%', left: '15%', delay: 5.5 }
    ],
    caption: '高中同校，公交站偶遇'
  },
  {
    id: 'mountain', label: '第一章 · 毕业徒步', dur: 10,
    img: 'images/03-mountain.jpg',
    bubbles: [
      { text: '这次终于说上话了！', type: 'her', top: '15%', right: '8%', delay: 2.5 },
      { text: '加个微信吧', type: 'him', top: '22%', left: '8%', delay: 5 }
    ],
    caption: '毕业徒步，命运交汇'
  },
  {
    id: 'burst', label: '第一章 · 从此不再平行', dur: 4,
    img: null,
    caption: '从此，不再平行',
    bg: 'radial-gradient(circle,#fff5e0,#ffd68a 50%,#c47a3a)'
  },
  {
    id: 'summer', label: '第二章 · 暑假群聊', dur: 7,
    img: null,
    caption: '暑假 · 五个人的群\n从群聊到私聊',
    bg: 'linear-gradient(180deg,#5bbce8,#88d4f0 50%,#f0e8d0)'
  },
  {
    id: 'parting', label: '第二章 · 分别', dur: 9,
    img: 'images/04-parting.jpg',
    bubbles: [
      { text: '我要去上大学了…', type: 'her', top: '12%', left: '10%', delay: 2 },
      { text: '我留下来复读', type: 'him', top: '20%', right: '10%', delay: 4 }
    ],
    caption: '她上大学，他复读一年'
  },
  {
    id: 'typing', label: '第二章 · 反复措辞', dur: 8,
    img: null,
    caption: '深夜 23:47\n写了删，删了写\n最后只发了两个字：加油！',
    bg: 'linear-gradient(180deg,#0c0c20,#141428 60%,#1e1a30)'
  },
  {
    id: 'waiting', label: '第二章 · 等待', dur: 7,
    img: null,
    caption: '已读\n等了很久\n"谢谢 我会努力的"',
    bg: 'linear-gradient(180deg,#1a1838,#2a2850 50%,#3a3060)'
  },
  {
    id: 'reunion', label: '第二章 · 两所大学', dur: 7,
    img: null,
    caption: '他也上了大学\n联系恢复了，但总差那么一点点',
    bg: 'linear-gradient(180deg,#0e1028,#1a1e3e 50%,#222840)'
  },
  {
    id: 'confession', label: '第三章 · 心照不宣', dur: 10,
    img: 'images/05-confession.jpg',
    bubbles: [
      { text: '其实…从那时候就喜欢你了', type: 'her', top: '12%', right: '8%', delay: 3 },
      { text: '我也是', type: 'him', top: '20%', left: '12%', delay: 6 }
    ],
    caption: '2023年初 · 河套 · 护栏旁'
  },
  {
    id: 'proposal', label: '第四章 · 烟花', dur: 10,
    img: 'images/06-proposal.jpg',
    bubbles: [
      { text: '嫁给我吧', type: 'him', top: '10%', left: '15%', delay: 3 },
      { text: '😭 我愿意', type: 'her', top: '18%', right: '12%', delay: 6 }
    ],
    caption: '乌兰察布 · 露营 · 烟花'
  },
  {
    id: 'ending', label: '尾声', dur: 8,
    img: 'images/07-seaside-real.jpg',
    caption: '2023.11.09\n从此，每一天都是我们的故事\n\n—— 520 快乐 ❤️',
    bubbles: []
  }
];

// Compute timing
var totalDur = 0;
var sceneStarts = [];
for (var i = 0; i < SCENES.length; i++) {
  sceneStarts.push(totalDur);
  totalDur += SCENES[i].dur;
}

// State
var globalTime = 0;
var paused = false;
var lastFrame = 0;
var currentSceneIdx = -1;
var started = false;

// DOM refs
var container, bubbleLayer, captionLayer, overlay, progressFill, sceneTitle, pauseIcon;

function init() {
  container = document.getElementById('scene-container');
  bubbleLayer = document.getElementById('bubble-layer');
  captionLayer = document.getElementById('caption-layer');
  overlay = document.getElementById('overlay');
  progressFill = document.getElementById('progress-fill');
  sceneTitle = document.getElementById('scene-title');
  pauseIcon = document.getElementById('pause-icon');

  // Create image elements for each scene
  for (var i = 0; i < SCENES.length; i++) {
    var s = SCENES[i];
    if (s.img) {
      var img = document.createElement('img');
      img.src = s.img;
      img.alt = s.label;
      img.dataset.idx = i;
      container.appendChild(img);
      s._imgEl = img;
    }
  }
}

function getSceneAt(gt) {
  for (var i = SCENES.length - 1; i >= 0; i--) {
    if (gt >= sceneStarts[i]) return { idx: i, local: gt - sceneStarts[i], progress: (gt - sceneStarts[i]) / SCENES[i].dur };
  }
  return { idx: 0, local: 0, progress: 0 };
}

function enterScene(idx) {
  if (idx === currentSceneIdx) return;
  var prev = currentSceneIdx;
  currentSceneIdx = idx;
  var scene = SCENES[idx];

  // Fade transition
  overlay.classList.add('fade');
  setTimeout(function () {
    // Hide previous scene image
    if (prev >= 0 && SCENES[prev]._imgEl) {
      SCENES[prev]._imgEl.classList.remove('active', 'zoom');
    }

    // Set background for text-only scenes
    if (scene.bg) {
      container.style.background = scene.bg;
    } else {
      container.style.background = '#0a0a14';
    }

    // Show current scene image
    if (scene._imgEl) {
      scene._imgEl.classList.add('active', 'zoom');
    }

    // Clear bubbles and captions
    bubbleLayer.innerHTML = '';
    captionLayer.innerHTML = '';

    // Schedule bubbles
    if (scene.bubbles) {
      for (var i = 0; i < scene.bubbles.length; i++) {
        scheduleBubble(scene.bubbles[i]);
      }
    }

    // Schedule caption
    if (scene.caption) {
      scheduleCaption(scene.caption, scene.img ? 1.5 : 1);
    }

    // Update title
    if (sceneTitle) sceneTitle.textContent = scene.label;

    // Unfade
    setTimeout(function () { overlay.classList.remove('fade'); }, 100);
  }, 800);
}

function scheduleBubble(b) {
  var el = document.createElement('div');
  el.className = 'bubble ' + (b.type || '');
  el.textContent = b.text;
  if (b.top) el.style.top = b.top;
  if (b.bottom) el.style.bottom = b.bottom;
  if (b.left) el.style.left = b.left;
  if (b.right) el.style.right = b.right;
  bubbleLayer.appendChild(el);
  setTimeout(function () { el.classList.add('show'); }, (b.delay || 1) * 1000);
}

function scheduleCaption(text, delay) {
  var el = document.createElement('div');
  el.className = 'caption';
  el.innerHTML = text.replace(/\n/g, '<br>');
  captionLayer.appendChild(el);
  setTimeout(function () { el.classList.add('show'); }, (delay || 1) * 1000);
}

function mainLoop(ts) {
  if (!lastFrame) lastFrame = ts;
  var dt = (ts - lastFrame) / 1000;
  if (dt > 0.5) dt = 0.016;
  lastFrame = ts;
  if (!paused) globalTime += dt;
  if (globalTime >= totalDur) globalTime = totalDur - 0.01;

  // Current scene
  var sc = getSceneAt(globalTime);
  if (sc.idx !== currentSceneIdx) {
    enterScene(sc.idx);
  }

  // Progress bar
  if (progressFill) progressFill.style.width = (globalTime / totalDur * 100) + '%';

  requestAnimationFrame(mainLoop);
}

function togglePause() {
  paused = !paused;
  if (paused) {
    pauseIcon.textContent = '❚❚';
    pauseIcon.classList.add('show');
  } else {
    pauseIcon.textContent = '▶';
    pauseIcon.classList.add('show');
    setTimeout(function () { pauseIcon.classList.remove('show'); }, 600);
  }
}

function startAnimation() {
  if (started) return;
  started = true;
  document.getElementById('start-screen').style.display = 'none';
  document.getElementById('player').style.display = 'block';
  init();
  requestAnimationFrame(mainLoop);
}

// Event listeners
document.getElementById('start-screen').addEventListener('click', startAnimation);
document.getElementById('start-screen').addEventListener('touchend', function (e) { e.preventDefault(); startAnimation(); });
document.getElementById('player').addEventListener('click', function () { if (started) togglePause(); });
document.getElementById('player').addEventListener('touchend', function (e) { e.preventDefault(); if (started) togglePause(); });

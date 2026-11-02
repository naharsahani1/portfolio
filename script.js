gsap.registerPlugin(ScrollTrigger);

// Phones/tablets detection
const lite = matchMedia('(max-width:800px),(pointer:coarse)').matches;
const SC = lite ? 0.35 : 0.6; // Ultra butter-smooth scrub damping

ScrollTrigger.config({
  ignoreMobileResize: true
});

const REPLAY = 'play reset play reset';
const SPEED = 2.0;


/* =========================================================
   HERO GSAP
========================================================= */

gsap.set('#hero h1, .main-portfolio-title', { opacity: 1, y: 0 });

gsap.from('.hero-center', {
  y: 50,
  opacity: 0,
  duration: 1.2,
  ease: 'power4.out'
});

if (!lite) {
  gsap.to('.hero-blob', {
    x: 30,
    y: -18,
    rotate: 6,
    scaleX: 1.06,
    duration: 5,
    yoyo: true,
    repeat: -1,
    ease: 'sine.inOut'
  });
}


/* =========================================================
   ABOUT
========================================================= */

const aboutTl = gsap.timeline({
  scrollTrigger: {
    trigger: '#about',
    start: 'top 85%',
    end: 'bottom 10%',
    toggleActions: REPLAY
  }
});

aboutTl
  .from('.about-blob', { opacity: 0, duration: 0.8, ease: 'power2.out' })
  .from('.me img', {
    y: 80,
    scale: 0.9,
    opacity: 0,
    duration: 0.9,
    ease: 'power3.out'
  }, '-=.6')
  .from('.intro small', { y: 20, opacity: 0, duration: 0.5, ease: 'power2.out' }, '-=.5')
  .from('.intro h2', {
    y: 30,
    scale: 0.95,
    opacity: 0,
    duration: 0.6,
    ease: 'power3.out'
  }, '-=.4')
  .from('.intro p', { y: 20, opacity: 0, duration: 0.5, ease: 'power2.out' }, '-=.4')
  .from('.info > h3', { x: 40, opacity: 0, duration: 0.5, ease: 'power2.out' }, '-=.6')
  .from('.bio', { y: 30, opacity: 0, duration: 0.6, ease: 'power2.out' }, '-=.4')
  .from('.cols h3', { y: 20, opacity: 0, stagger: 0.08, duration: 0.5, ease: 'power2.out' }, '-=.3')
  .from('.cols b,.cols p', { y: 20, opacity: 0, stagger: 0.04, duration: 0.5, ease: 'power2.out' }, '-=.3');

aboutTl.timeScale(SPEED);

if (!lite) {
  gsap.to('.about-blob', {
    scale: 1.05,
    duration: 4,
    yoyo: true,
    repeat: -1,
    ease: 'sine.inOut'
  });
}


/* =========================================================
   SOFTWARE SKILLS
========================================================= */

const CAPCUT = { name: 'CapCut', img: 'assets/logos/capcut.png' };
// '.jpg' extension hatakar saaf clean name
const davinci = { name: 'DaVinci Resolve', img: 'assets/logos/davinci resolve.jpg' };

const apps = [
  CAPCUT,
  { name: 'Premiere Pro', text: 'Pr', bg: '#00005b', color: '#9999ff' },
  { name: 'After Effects', text: 'Ae', bg: '#00005b', color: '#9999ff' },
  { name: 'Audition', text: 'Au', bg: '#00192f', color: '#00e4bb' },
  { name: 'Photoshop', text: 'Ps', bg: '#001e36', color: '#31a8ff' },
  { name: 'Illustrator', text: 'Ai', bg: '#330000', color: '#ff9a00' },
  davinci
];

const icons = document.getElementById('icons');
const label = document.getElementById('skill-label');
const skillsEl = document.getElementById('skills');

if (icons) {
  icons.innerHTML = '';
  apps.forEach(a => {
    const d = document.createElement('div');
    d.className = 'ico';

    if (a.img) {
      d.classList.add('img');
      d.innerHTML = `<img src="${a.img}" alt="${a.name}" loading="lazy" decoding="async">`;
    } else {
      d.textContent = a.text;
      d.style.background = a.bg;
      d.style.color = a.color;
    }
    icons.appendChild(d);
  });
}

const els = icons ? [...icons.children] : [];
const last = apps.length - 1;
const isMobile = () => innerWidth <= 800;

const iconSize = () => {
  return isMobile()
    ? Math.min(Math.max(innerWidth * 0.19, 60), 84)
    : Math.min(Math.max(innerWidth * 0.105, 96), 200);
};

let cur = 0;
let lastS = 0;
let lastName = '';

function layout(p) {
  if (!icons) return;
  cur = p;

  const m = isMobile();
  const s = iconSize();
  const h = innerHeight;
  const cy = m ? h * 0.64 : h / 2;
  const gap = m ? 0.9 : 0.92;
  const bend = m ? 0.12 : 0.17;
  const fade = m ? 3 : 4;

  if (s !== lastS && skillsEl) {
    skillsEl.style.setProperty('--s', s + 'px');
    lastS = s;
  }

  els.forEach((el, i) => {
    const d = i - p;
    const ad = Math.abs(d);

    gsap.set(el, {
      y: cy - s / 2 + d * s * gap,
      x: d * d * s * bend,
      rotate: -d * 5,
      scale: 1 + 0.3 * Math.max(0, 1 - ad),
      zIndex: 20 - Math.round(ad),
      opacity: ad > fade ? Math.max(0, fade + 1 - ad) : 1,
      force3D: true
    });
  });

  const name = apps[Math.max(0, Math.min(last, Math.round(p)))].name;
  if (name !== lastName && label) {
    label.textContent = name;
    lastName = name;
  }
}

layout(0);

ScrollTrigger.create({
  trigger: '#skills',
  start: 'top top',
  end: '+=' + (apps.length * 220),
  pin: true,
  anticipatePin: 1,
  scrub: SC,
  onUpdate: s => layout(s.progress * last)
});

gsap.from('#skills h2', {
  x: -60,
  opacity: 0,
  duration: 0.6,
  ease: 'power3.out',
  scrollTrigger: {
    trigger: '#skills',
    start: 'top 80%',
    toggleActions: 'play none none reverse'
  }
});

if (!lite) {
  gsap.to('.skills-blob', {
    x: -50,
    duration: 6,
    yoyo: true,
    repeat: -1,
    ease: 'sine.inOut'
  });
}

addEventListener('resize', () => layout(cur));


/* =========================================================
   SERVICES - VIDEO CAROUSEL
========================================================= */

const CLOUD_NAME = 'umxejinu';
const useCloud = CLOUD_NAME !== '';

const vidURL = id =>
  `https://res.cloudinary.com/${CLOUD_NAME}/video/upload/vc_h264,q_auto${lite ? ':eco' : ''},w_${lite ? 400 : 540},c_limit,ac_none/${id}.mp4`;

const posterURL = id =>
  `https://res.cloudinary.com/${CLOUD_NAME}/video/upload/so_0,w_${lite ? 320 : 540},c_limit,q_auto/${id}.jpg`;

const svc = [
  { id: 'v3', local: 'assets/videos/v3.mp4', fit: 'cover', pos: 'center' },
  { id: 'v4', local: 'assets/videos/v4.mp4', fit: 'cover', pos: 'center' },
  { id: 'v5', local: 'assets/videos/v5.mp4', fit: 'cover', pos: 'center' },
  { id: 'v6', local: '', fit: 'cover', pos: 'center' },
  { id: 'v7', local: '', fit: 'cover', pos: 'center' },
  { id: 'v8', local: '', fit: 'cover', pos: 'center' },
  { id: 'v9', local: '', fit: 'cover', pos: 'center' }
];

const stack = document.getElementById('stack');

if (stack) {
  stack.innerHTML = '';
  svc.forEach(s => {
    const c = document.createElement('div');
    c.className = 'card';

    const fromCloud = useCloud && !!s.id;
    const v = document.createElement('video');
    v.className = 'main';
    v.muted = true;
    v.loop = true;
    v.playsInline = true;
    v.setAttribute('muted', '');
    v.setAttribute('playsinline', '');
    v.setAttribute('webkit-playsinline', '');
    v.setAttribute('disableremoteplayback', '');
    v.disablePictureInPicture = true;
    v.preload = lite ? 'metadata' : 'auto';
    v.dataset.src = fromCloud ? vidURL(s.id) : s.local;

    if (fromCloud) v.poster = posterURL(s.id);
    v.style.objectFit = s.fit === 'contain' ? 'contain' : 'cover';
    v.style.objectPosition = s.pos || 'center';

    v.addEventListener('error', () => {
      if (!fromCloud || !s.local || !v.getAttribute('src') || v.dataset.fellBack) return;
      v.dataset.fellBack = '1';
      v.dataset.src = s.local;
      v.src = s.local;
      const p = v.play();
      if (p && p.catch) p.catch(() => {});
    });

    const shade = document.createElement('div');
    shade.className = 'shade';

    c.append(v, shade);
    stack.appendChild(c);
  });
}

const cards = stack ? [...stack.children] : [];
const vids = cards.map(c => c.querySelector('video'));
const shades = cards.map(c => c.querySelector('.shade'));
const N = cards.length;
const HALF = N / 2;

let CW = 0;
const measure = () => {
  CW = cards[0]?.offsetWidth || 200;
};
measure();

function carousel(p) {
  const m = isMobile();
  const X1 = CW * (m ? 0.70 : 0.78);
  const X2 = CW * (m ? 0.16 : 0.19);
  const Z1 = m ? 190 : 250;
  const Z2 = m ? 35 : 55;
  const ANG = m ? 52 : 60;

  for (let i = 0; i < N; i++) {
    let d = i - p;
    d = ((d + HALF) % N + N) % N - HALF;
    const ad = Math.abs(d);
    const c = cards[i];

    if (ad > 3.6) {
      if (!c._hid) {
        c.style.visibility = 'hidden';
        c._hid = true;
      }
      continue;
    }

    if (c._hid) {
      c.style.visibility = 'visible';
      c._hid = false;
    }

    const sg = d < 0 ? -1 : 1;
    const a1 = Math.min(ad, 1);
    const a2 = Math.max(ad - 1, 0);
    const a2c = Math.min(a2, 3);

    const x = sg * (X1 * a1 + X2 * a2);
    const z = -(Z1 * a1 + Z2 * a2c);
    const ry = sg * a1 * ANG;
    const s = 1 - a1 * 0.12 - a2c * 0.04;

    c.style.transform =
      `translate3d(-50%,-50%,0) ` +
      `translate3d(${x.toFixed(2)}px,0,${z.toFixed(2)}px) ` +
      `rotateY(${ry.toFixed(2)}deg) ` +
      `scale(${s.toFixed(3)})`;

    c.style.opacity = ad <= HALF - 0.5 ? 1 : Math.max(0, (HALF - ad) / 0.5);
    c.style.zIndex = 100 - Math.round(ad * 10);
    shades[i].style.opacity = Math.min(0.7, a1 * 0.32 + a2c * 0.10);
  }
}


/* =========================================================
   VIDEO SYNCHRONIZATION
========================================================= */

let lastIdx = -1;
let svcVisible = false;

function syncVideos(idx) {
  if (idx === lastIdx) return;
  lastIdx = idx;

  vids.forEach((v, i) => {
    if (!v) return;
    const diff = Math.abs(i - idx);
    const dist = Math.min(diff, N - diff);
    const loaded = lite ? dist === 0 : dist <= 1;

    if (loaded && !v.getAttribute('src')) {
      v.src = v.dataset.src;
      v.load();
    }

    if (!loaded && v.getAttribute('src')) {
      v.pause();
      v.removeAttribute('src');
      v.load();
    }

    if (i === idx) {
      v.muted = true;
      v.setAttribute('muted', '');
      v.setAttribute('playsinline', '');

      const playVideo = () => {
        const p = v.play();
        if (p && p.catch) p.catch(() => {});
      };

      if (v.readyState >= 2) {
        playVideo();
      } else {
        v.addEventListener('loadeddata', playVideo, { once: true });
      }
    } else {
      v.pause();
    }
  });
}

function pauseAll() {
  vids.forEach(v => v && v.pause());
  lastIdx = -1;
}

const idxOf = p => ((Math.round(p) % N) + N) % N;
let curP = () => 0;

document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    pauseAll();
  } else if (svcVisible) {
    syncVideos(idxOf(curP()));
  }
});


/* =========================================================
   DESKTOP / MOBILE CONTROLS
========================================================= */

if (!lite) {
  const SVC_SCROLL = Math.max(1200, N * 320);
  const proxy = { p: 0 };
  curP = () => proxy.p;

  gsap.to(proxy, {
    p: N - 1,
    ease: 'power1.out',
    onUpdate: () => {
      carousel(proxy.p);
      if (svcVisible) syncVideos(idxOf(proxy.p));
    },
    scrollTrigger: {
      trigger: '#services',
      start: 'top top',
      end: '+=' + SVC_SCROLL,
      pin: true,
      anticipatePin: 1,
      scrub: SC
    }
  });

  carousel(0);
  addEventListener('resize', () => {
    measure();
    carousel(proxy.p);
  });

  ScrollTrigger.create({
    trigger: '#services',
    start: 'top bottom+=800',
    end: () => '+=' + (SVC_SCROLL + innerHeight * 2 + 800),
    onToggle: self => {
      svcVisible = self.isActive;
      if (svcVisible) {
        syncVideos(idxOf(proxy.p));
      } else {
        pauseAll();
      }
    }
  });

  gsap.from('#stack', {
    y: 90,
    scale: 0.88,
    opacity: 0,
    duration: 1.1,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: '#services',
      start: 'top 85%',
      end: () => '+=' + (innerHeight * 0.85 + SVC_SCROLL + innerHeight),
      toggleActions: REPLAY
    }
  });

} else if (stack) {
  let pos = 0;
  let target = 0;
  let raf = 0;

  curP = () => pos;
  const STEP = () => CW * 0.55;
  const INERTIA = 220;

  function loop() {
    const diff = target - pos;
    if (Math.abs(diff) < 0.003) {
      pos = target;
      carousel(pos);
      raf = 0;
      if (svcVisible) syncVideos(idxOf(pos));
      return;
    }
    pos += diff * 0.18;
    carousel(pos);
    raf = requestAnimationFrame(loop);
  }

  const go = () => {
    if (!raf) raf = requestAnimationFrame(loop);
  };

  let dragging = false;
  let moved = false;
  let sx = 0;
  let startPos = 0;
  let lastX = 0;
  let lastT = 0;
  let vel = 0;

  stack.addEventListener('pointerdown', e => {
    dragging = true;
    moved = false;
    sx = lastX = e.clientX;
    startPos = pos;
    lastT = performance.now();
    vel = 0;
    target = pos;
    if (raf) {
      cancelAnimationFrame(raf);
      raf = 0;
    }
    pauseAll();
    try { stack.setPointerCapture(e.pointerId); } catch (_) {}
  });

  stack.addEventListener('pointermove', e => {
    if (!dragging) return;
    const dx = e.clientX - sx;
    if (Math.abs(dx) > 6) moved = true;

    const now = performance.now();
    const dt = Math.max(1, now - lastT);
    vel = vel * 0.6 + ((lastX - e.clientX) / STEP() / dt) * 0.4;
    lastX = e.clientX;
    lastT = now;

    pos = startPos - dx / STEP();
    target = pos;
    carousel(pos);
  });

  function release(e) {
    if (!dragging) return;
    dragging = false;

    if (moved) {
      let t = Math.round(pos + vel * INERTIA);
      const base = Math.round(pos);
      target = Math.max(base - 3, Math.min(base + 3, t));
    } else {
      const card = e.target.closest && e.target.closest('.card');
      const i = cards.indexOf(card);
      if (i > -1) {
        let d = i - Math.round(pos);
        d = ((d + HALF) % N + N) % N - HALF;
        target = Math.round(pos) + d;
      } else {
        target = Math.round(pos);
      }
    }
    go();
  }

  stack.addEventListener('pointerup', release);
  stack.addEventListener('pointercancel', release);

  carousel(0);
  addEventListener('resize', () => {
    measure();
    carousel(pos);
  });

  ScrollTrigger.create({
    trigger: '#services',
    start: 'top bottom+=300',
    end: 'bottom top-300',
    onToggle: self => {
      svcVisible = self.isActive;
      if (svcVisible) {
        syncVideos(idxOf(pos));
      } else {
        pauseAll();
      }
    }
  });
}

window.addEventListener('load', () => {
  measure();
  carousel(curP());
});


/* =========================================================
   EDITOR
========================================================= */

const ed = gsap.timeline({
  scrollTrigger: {
    trigger: '#editor',
    start: 'top 70%',
    end: 'bottom 20%',
    toggleActions: REPLAY
  }
});

ed.from('#editor p', { y: -60, opacity: 0, duration: 0.6, ease: 'power3.out' })
  .from('#editor h2', {
    scale: 0.6,
    opacity: 0,
    duration: 0.8,
    ease: 'power4.out'
  }, '-=.3');

ed.timeScale(SPEED);


/* =========================================================
   SEARCH SECTION
========================================================= */

const phrases = [
  'Fast Delivery',
  'Professional Editing',
  'Creative Storytelling',
  'Smooth Transitions',
  'Color Grading',
  'Motion Graphics',
  'Sound Design',
  'High-Quality Output',
  'Social Media Ready',
  'Client Satisfaction'
];

const searchEl = document.getElementById('search');
const oldFast = document.getElementById('fast');
if (oldFast) oldFast.remove();

const lines = searchEl ? phrases.map(t => {
  const h = document.createElement('h3');
  h.textContent = t;
  h.style.cssText = `
    position:absolute;
    text-align:center;
    padding:0 6vw;
    font:600 clamp(1.4rem,2.6vw,2.2rem) "Open Sans",sans-serif;
    color:#cfd6ea;
    opacity:0;
    letter-spacing:.01em
  `;
  searchEl.appendChild(h);
  return h;
}) : [];

const typed = document.getElementById('typed');
const obj = { n: 0 };

const type = (txt, t) =>
  gsap.fromTo(
    obj,
    { n: 0 },
    {
      n: txt.length,
      duration: t,
      ease: 'none',
      onUpdate: () => {
        if (typed) typed.textContent = txt.slice(0, Math.round(obj.n));
      }
    }
  );

if (searchEl) {
  const sq = gsap.timeline({
    scrollTrigger: {
      trigger: '#search',
      start: 'top top',
      end: '+=' + (900 + phrases.length * 130),
      pin: true,
      anticipatePin: 1,
      scrub: SC
    }
  });

  sq.from('.sbox,.mic', { opacity: 0, scaleX: 0.7, duration: 0.6, ease: 'power2.out' })
    .add(type('Need Pro Video Editing?', 1.6))
    .to({}, { duration: 0.4 })
    .add(() => { if (typed) typed.textContent = ''; })
    .add(type('Nahar Studio.', 1.1))
    .to({}, { duration: 0.4 })
    .to('.sbox,.mic', { opacity: 0, duration: 0.4 });

  lines.forEach((el, i) => {
    sq.fromTo(el, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' });
    if (i < lines.length - 1) {
      sq.to(el, { opacity: 0, y: -20, duration: 0.4, ease: 'power2.in' }, '+=.25');
    } else {
      sq.to({}, { duration: 0.5 });
    }
  });
}


/* =========================================================
   LOGO & FOOTER
========================================================= */

gsap.from('.mark', {
  scale: 1.4,
  opacity: 0,
  duration: 1.0,
  ease: 'power3.out',
  scrollTrigger: {
    trigger: '#logo',
    start: 'top 75%',
    end: 'bottom 20%',
    toggleActions: REPLAY
  }
});

gsap.fromTo(
  '#footer .f-title,#footer .f-sub,.f-item',
  { opacity: 0 },
  {
    opacity: 1,
    stagger: 0.05,
    duration: 0.6,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: '#footer',
      start: 'top 90%',
      end: 'bottom top',
      toggleActions: REPLAY
    }
  }
);

addEventListener('resize', () => ScrollTrigger.refresh());
window.addEventListener('load', () => ScrollTrigger.refresh());


/* =====================================================================
   AUTHENTIC THREEUI KAGE 3D ENVIRONMENT: BUTTER-SMOOTH RENDERING
===================================================================== */
(function () {
  'use strict';

  function initLiveClock() {
    const timeEl = document.getElementById('live-time');
    const dateEl = document.getElementById('live-date');
    if (!timeEl || !dateEl) return;

    function tick() {
      const now = new Date();
      timeEl.textContent = now.toLocaleTimeString('en-US', { hour12: false });
      dateEl.textContent = now.toLocaleDateString('en-US', {
        weekday: 'short',
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });
    }
    tick();
    setInterval(tick, 1000);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLiveClock);
  } else {
    initLiveClock();
  }

  const canvas = document.getElementById('gl');
  if (!canvas || typeof THREE === 'undefined') return;

  const TAU = Math.PI * 2;
  const vpW = () => window.innerWidth;
  const vpH = () => window.innerHeight;

  let renderer, scene, camera;
  const WORLD = {};

  function cvs(w, h) {
    const c = document.createElement('canvas');
    c.width = w; c.height = h;
    return c;
  }

  function tx(canvasEl) {
    const t = new THREE.CanvasTexture(canvasEl);
    t.wrapS = t.wrapT = THREE.ClampToEdgeWrapping;
    t.encoding = THREE.sRGBEncoding;
    t.needsUpdate = true;
    return t;
  }

  function texMoon() {
    const S = 512, c = cvs(S, S), x = c.getContext('2d');
    const R = S / 2 - 4;
    x.beginPath(); x.arc(S / 2, S / 2, R, 0, TAU); x.closePath();
    x.save(); x.clip();

    const g = x.createRadialGradient(S * .42, S * .42, S * .04, S / 2, S / 2, R);
    g.addColorStop(0, '#ffffff');
    g.addColorStop(0.18, '#ff9080');
    g.addColorStop(0.52, '#c8241a');
    g.addColorStop(0.85, '#690e09');
    g.addColorStop(1, '#330504');
    x.fillStyle = g;
    x.fillRect(0, 0, S, S);

    x.fillStyle = 'rgba(38, 6, 6, 0.4)';
    x.beginPath(); x.arc(S * 0.46, S * 0.38, 75, 0, TAU); x.fill();
    x.beginPath(); x.arc(S * 0.63, S * 0.54, 98, 0, TAU); x.fill();
    x.beginPath(); x.arc(S * 0.30, S * 0.62, 65, 0, TAU); x.fill();
    x.beginPath(); x.arc(S * 0.52, S * 0.72, 50, 0, TAU); x.fill();

    x.restore();
    return c;
  }

  function texGlow() {
    const S = 256, c = cvs(S, S), x = c.getContext('2d');
    const g = x.createRadialGradient(S / 2, S / 2, 0, S / 2, S / 2, S / 2);
    g.addColorStop(0, 'rgba(235, 45, 28, 0.9)');
    g.addColorStop(0.35, 'rgba(180, 25, 20, 0.38)');
    g.addColorStop(0.7, 'rgba(85, 12, 10, 0.12)');
    g.addColorStop(1, 'rgba(0, 0, 0, 0)');
    x.fillStyle = g;
    x.fillRect(0, 0, S, S);
    return c;
  }

  function texLeaf() {
    const S = 64, c = cvs(S, S), x = c.getContext('2d');
    x.fillStyle = '#c72418';
    x.beginPath();
    x.moveTo(S / 2, 4);
    x.quadraticCurveTo(S - 4, S * 0.4, S / 2, S - 6);
    x.quadraticCurveTo(4, S * 0.4, S / 2, 4);
    x.fill();
    return c;
  }

  function texPinkButterflyWing() {
    const S = 512, c = cvs(S, S), x = c.getContext('2d');
    x.clearRect(0, 0, S, S);

    x.beginPath();
    x.moveTo(S * 0.1, S * 0.5);
    x.bezierCurveTo(S * 0.15, S * 0.08, S * 0.65, S * 0.05, S * 0.95, S * 0.22);
    x.bezierCurveTo(S * 0.82, S * 0.55, S * 0.92, S * 0.78, S * 0.72, S * 0.96);
    x.bezierCurveTo(S * 0.52, S * 0.86, S * 0.24, S * 0.72, S * 0.1, S * 0.5);
    x.closePath();

    const g = x.createRadialGradient(S * 0.2, S * 0.5, 12, S * 0.6, S * 0.5, S * 0.5);
    g.addColorStop(0, '#ffffff');
    g.addColorStop(0.25, '#ff47b6');
    g.addColorStop(0.65, '#d8117a');
    g.addColorStop(0.88, '#800042');
    g.addColorStop(1, '#3a001d');
    x.fillStyle = g;
    x.fill();

    x.strokeStyle = 'rgba(255, 255, 255, 0.48)';
    x.lineWidth = 2.5;
    for (let i = 0; i < 7; i++) {
      x.beginPath();
      x.moveTo(S * 0.15, S * 0.5);
      x.quadraticCurveTo(S * 0.45, S * (0.2 + i * 0.1), S * (0.75 + (i % 2) * 0.15), S * (0.2 + i * 0.11));
      x.stroke();
    }

    x.strokeStyle = '#ff9ee2';
    x.lineWidth = 4;
    x.stroke();
    return c;
  }

  function texSmokePuff() {
    const S = 128, c = cvs(S, S), x = c.getContext('2d');
    const g = x.createRadialGradient(S / 2, S / 2, 0, S / 2, S / 2, S / 2);
    g.addColorStop(0, 'rgba(235, 170, 215, 0.4)');
    g.addColorStop(0.35, 'rgba(195, 130, 185, 0.2)');
    g.addColorStop(0.7, 'rgba(120, 85, 130, 0.06)');
    g.addColorStop(1, 'rgba(0, 0, 0, 0)');
    x.fillStyle = g;
    x.fillRect(0, 0, S, S);
    return c;
  }

  function init3D() {
    renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    renderer.setSize(vpW(), vpH());
    renderer.setClearColor(0x0a1118, 1);

    scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0c141d, 0.017);

    camera = new THREE.PerspectiveCamera(40, vpW() / vpH(), 0.1, 300);
    camera.position.set(0, 5.0, 13.5);

    scene.add(new THREE.AmbientLight(0x526d88, 1.35));

    const hemi = new THREE.HemisphereLight(0x405e7d, 0x091017, 1.4);
    scene.add(hemi);

    const softFill = new THREE.DirectionalLight(0x9cbde0, 0.45);
    softFill.position.set(0, 15, 20);
    scene.add(softFill);

    const moonBackLight = new THREE.PointLight(0xff3a22, 6.8, 65);
    moonBackLight.position.set(9.5, 14.5, -30);
    scene.add(moonBackLight);

    const stairLight = new THREE.PointLight(0xffaa44, 3.2, 24);
    stairLight.position.set(0, 4.4, -8);
    scene.add(stairLight);

    // Stone Steps
    const stairs = new THREE.Group();
    const stoneStepMat = new THREE.MeshStandardMaterial({
      color: 0x161d24,
      roughness: 0.82,
      metalness: 0.1
    });

    for (let i = 0; i < 28; i++) {
      const w = 11.5 + (28 - i) * 0.1;
      const step = new THREE.Mesh(new THREE.BoxGeometry(w, 0.24, 0.65), stoneStepMat);
      step.position.set(0, i * 0.22, -8.5 - i * 0.62);
      stairs.add(step);
    }
    scene.add(stairs);

    const podium = new THREE.Mesh(
      new THREE.BoxGeometry(22, 1.2, 12),
      new THREE.MeshStandardMaterial({ color: 0x121820, roughness: 0.9 })
    );
    podium.position.set(0, 6.2, -30);
    scene.add(podium);

    // Japanese Stone Lanterns
    const stoneLanternMat = new THREE.MeshStandardMaterial({ color: 0x1a2128, roughness: 0.85 });
    const lanternGlowMat = new THREE.MeshBasicMaterial({ color: 0xffaa33 });

    function addStoneLantern(x, z) {
      const g = new THREE.Group();
      const base = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.4, 0.8), stoneLanternMat);
      base.position.y = 0.2;
      g.add(base);

      const post = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.24, 2.2, 8), stoneLanternMat);
      post.position.y = 1.3;
      g.add(post);

      const lightBox = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.65, 0.65), lanternGlowMat);
      lightBox.position.y = 2.6;
      g.add(lightBox);

      const cap = new THREE.Mesh(new THREE.ConeGeometry(0.85, 0.5, 4), stoneLanternMat);
      cap.rotation.y = Math.PI / 4;
      cap.position.y = 3.1;
      g.add(cap);

      g.position.set(x, 0, z);
      scene.add(g);
    }
    addStoneLantern(-5.2, -7.5);
    addStoneLantern(5.2, -7.5);

    // Kyoto Temple
    const temple = new THREE.Group();
    const woodDarkMat = new THREE.MeshStandardMaterial({ color: 0x120e0d, roughness: 0.85 });
    const woodTrimMat = new THREE.MeshStandardMaterial({ color: 0x221714, roughness: 0.75 });
    const roofSlateMat = new THREE.MeshStandardMaterial({ color: 0x141b22, roughness: 0.6, metalness: 0.15 });
    const shojiGlowMat = new THREE.MeshBasicMaterial({ color: 0xffaa44 });

    const hall = new THREE.Mesh(new THREE.BoxGeometry(17, 5.2, 9), woodDarkMat);
    hall.position.set(0, 9.4, -30);
    temple.add(hall);

    for (let px = -7.5; px <= 7.5; px += 2.5) {
      const col = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.24, 5.4, 16), woodTrimMat);
      col.position.set(px, 9.4, -25.4);
      temple.add(col);
    }

    for (let wx = -6.2; wx <= 6.2; wx += 2.1) {
      const win = new THREE.Mesh(new THREE.PlaneGeometry(1.4, 2.7), shojiGlowMat);
      win.position.set(wx, 9.4, -25.35);
      temple.add(win);
      const frame = new THREE.Mesh(new THREE.BoxGeometry(1.45, 2.75, 0.05), woodDarkMat);
      frame.position.set(wx, 9.4, -25.32);
      temple.add(frame);
    }

    const lowerRoof = new THREE.Mesh(new THREE.ConeGeometry(15.5, 3.4, 4), roofSlateMat);
    lowerRoof.rotation.y = Math.PI / 4;
    lowerRoof.scale.set(1.15, 0.6, 0.85);
    lowerRoof.position.set(0, 12.8, -30);
    temple.add(lowerRoof);

    const upperBody = new THREE.Mesh(new THREE.BoxGeometry(13, 3.2, 7), woodDarkMat);
    upperBody.position.set(0, 14.6, -30);
    temple.add(upperBody);

    const upperRoof = new THREE.Mesh(new THREE.ConeGeometry(13.2, 3.6, 4), roofSlateMat);
    upperRoof.rotation.y = Math.PI / 4;
    upperRoof.scale.set(1.18, 0.65, 0.88);
    upperRoof.position.set(0, 17.1, -30);
    temple.add(upperRoof);

    scene.add(temple);
    WORLD.temple = temple;

    // Torii Gate
    const torii = new THREE.Group();
    const lacMat = new THREE.MeshStandardMaterial({ color: 0xba2218, roughness: 0.42, metalness: 0.1 });
    const blackWoodMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.65 });

    [-3.6, 3.6].forEach(x => {
      const col = new THREE.Mesh(new THREE.CylinderGeometry(0.36, 0.45, 9.5, 20), lacMat);
      col.position.set(x, 4.75, 0);
      torii.add(col);

      const base = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.65, 0.8, 20), blackWoodMat);
      base.position.set(x, 0.4, 0);
      torii.add(base);
    });

    const cross1 = new THREE.Mesh(new THREE.BoxGeometry(9.6, 0.6, 0.6), lacMat);
    cross1.position.set(0, 7.6, 0);
    torii.add(cross1);

    const cross2 = new THREE.Mesh(new THREE.BoxGeometry(11.2, 0.75, 0.75), blackWoodMat);
    cross2.position.set(0, 9.1, 0);
    torii.add(cross2);

    torii.position.set(0, 0, -6.0);
    scene.add(torii);
    WORLD.torii = torii;

    // Blood Moon
    const moon = new THREE.Mesh(
      new THREE.PlaneGeometry(17, 17),
      new THREE.MeshBasicMaterial({ map: tx(texMoon()), transparent: true })
    );
    const halo = new THREE.Mesh(
      new THREE.PlaneGeometry(42, 42),
      new THREE.MeshBasicMaterial({ map: tx(texGlow()), transparent: true, blending: THREE.AdditiveBlending, depthWrite: false })
    );
    halo.position.z = -0.5;

    const moonGroup = new THREE.Group();
    moonGroup.add(moon);
    moonGroup.add(halo);
    moonGroup.position.set(9.0, 13.8, -34);
    scene.add(moonGroup);
    WORLD.moon = moonGroup;

    // Falling Leaves
    const LEAF_COUNT = 36;
    const leaves = [];
    const leafTex = tx(texLeaf());
    for (let i = 0; i < LEAF_COUNT; i++) {
      const lf = new THREE.Mesh(
        new THREE.PlaneGeometry(0.48, 0.62),
        new THREE.MeshBasicMaterial({ map: leafTex, transparent: true, side: THREE.DoubleSide })
      );
      lf.position.set(
        (Math.random() - 0.5) * 32,
        Math.random() * 16,
        -15 + Math.random() * 25
      );
      lf.userData = {
        vy: 0.016 + Math.random() * 0.022,
        rotSpeed: 0.018 + Math.random() * 0.035,
        swaySpeed: 1 + Math.random() * 2,
        offset: Math.random() * 10
      };
      scene.add(lf);
      leaves.push(lf);
    }
    WORLD.leaves = leaves;

    // Flying Birds
    const birds = [];
    const birdMat = new THREE.MeshBasicMaterial({ color: 0x05070a, side: THREE.DoubleSide });
    for (let b = 0; b < 4; b++) {
      const bg = new THREE.Group();

      const wingL = new THREE.Mesh(new THREE.BufferGeometry(), birdMat);
      wingL.geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array([
        0, 0, 0,
        -0.65, 0.22, 0.2,
        -0.45, 0, -0.2
      ]), 3));
      bg.add(wingL);

      const wingR = new THREE.Mesh(new THREE.BufferGeometry(), birdMat);
      wingR.geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array([
        0, 0, 0,
        0.65, 0.22, 0.2,
        0.45, 0, -0.2
      ]), 3));
      bg.add(wingR);

      bg.position.set(-20 - b * 6, 12 + Math.random() * 4, -18 - b * 4);
      bg.scale.setScalar(0.75 + Math.random() * 0.35);
      bg.userData = {
        wingL: wingL,
        wingR: wingR,
        speed: 0.075 + Math.random() * 0.03,
        wingCycle: Math.random() * 5
      };
      scene.add(bg);
      birds.push(bg);
    }
    WORLD.birds = birds;

    // Compact Swallowtail Butterfly
    const bWingTex = tx(texPinkButterflyWing());
    const bWingMat = new THREE.MeshStandardMaterial({
      map: bWingTex,
      side: THREE.DoubleSide,
      transparent: true,
      roughness: 0.32,
      metalness: 0.12
    });

    const butterfly = new THREE.Group();

    const bWingL = new THREE.Mesh(new THREE.PlaneGeometry(1.2, 0.95), bWingMat);
    bWingL.geometry.translate(-0.6, 0, 0);
    butterfly.add(bWingL);

    const bWingR = new THREE.Mesh(new THREE.PlaneGeometry(1.2, 0.95), bWingMat);
    bWingR.geometry.translate(0.6, 0, 0);
    butterfly.add(bWingR);

    const bBody = new THREE.Mesh(
      new THREE.CylinderGeometry(0.035, 0.025, 0.7, 12),
      new THREE.MeshStandardMaterial({ color: 0x1a0510, roughness: 0.8 })
    );
    bBody.rotation.x = Math.PI / 2;
    butterfly.add(bBody);

    const bLight = new THREE.PointLight(0xff3399, 3.2, 10);
    butterfly.add(bLight);

    butterfly.position.set(0, 5, 8);
    butterfly.scale.setScalar(0.55);
    scene.add(butterfly);

    const SMOKE_COUNT = 32;
    const smokeGroup = new THREE.Group();
    const smokeMat = new THREE.MeshBasicMaterial({
      map: tx(texSmokePuff()),
      transparent: true,
      depthWrite: false,
      blending: THREE.NormalBlending
    });

    const smokeParticles = [];
    for (let i = 0; i < SMOKE_COUNT; i++) {
      const sp = new THREE.Mesh(new THREE.PlaneGeometry(0.85, 0.85), smokeMat.clone());
      sp.position.set(0, -100, 0);
      sp.userData = { life: 1.0, scale: 0.3, vx: 0, vy: 0, vz: 0 };
      smokeGroup.add(sp);
      smokeParticles.push(sp);
    }
    scene.add(smokeGroup);

    WORLD.butterfly = {
      mesh: butterfly,
      wingL: bWingL,
      wingR: bWingR,
      pos: new THREE.Vector3(0, 5, 8),
      targetPos: new THREE.Vector3(0, 5, 8),
      rot: new THREE.Vector3(0, 0, 0),
      smokeParticles: smokeParticles
    };

    // Embers
    const P_COUNT = 130;
    const pGeom = new THREE.BufferGeometry();
    const pPos = new Float32Array(P_COUNT * 3);
    for (let i = 0; i < P_COUNT * 3; i += 3) {
      pPos[i] = (Math.random() - 0.5) * 36;
      pPos[i + 1] = Math.random() * 16;
      pPos[i + 2] = -30 + Math.random() * 38;
    }
    pGeom.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
    const embers = new THREE.Points(
      pGeom,
      new THREE.PointsMaterial({ color: 0xff5522, size: 0.2, transparent: true, blending: THREE.AdditiveBlending })
    );
    scene.add(embers);
    WORLD.embers = embers;

    // Mouse Tracking Parallax
    let targetX = 0, targetY = 0;
    let curX = 0, curY = 0;

    window.addEventListener('mousemove', e => {
      targetX = (e.clientX / vpW() - 0.5) * 2;
      targetY = -(e.clientY / vpH() - 0.5) * 2;
    }, { passive: true });

    window.addEventListener('resize', () => {
      renderer.setSize(vpW(), vpH());
      camera.aspect = vpW() / vpH();
      camera.updateProjectionMatrix();
    });

    const fgWall = document.querySelector('.fg-wall');
    const fgPine = document.querySelector('.fg-pine');
    const fgGrass = document.querySelector('.fg-grass');

    let timeClock = 0;
    let smoothSvcProgress = 0;
    let smoothScrollP = 0;

    // Ultra-smooth 60-120fps render loop
    function renderLoop() {
      requestAnimationFrame(renderLoop);
      timeClock += 0.018;

      // Butter-smooth mouse inertia dampening
      curX += (targetX - curX) * 0.055;
      curY += (targetY - curY) * 0.055;

      const scrollY = window.pageYOffset || document.documentElement.scrollTop;
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - vpH());
      const rawScrollP = scrollY / maxScroll;
      smoothScrollP += (rawScrollP - smoothScrollP) * 0.08;

      // Soft Camera Zoom to Stairs at Video Section
      const svcSection = document.getElementById('services');
      let targetSvcProgress = 0;
      if (svcSection) {
        const rect = svcSection.getBoundingClientRect();
        const startY = window.innerHeight;
        const currentY = rect.top;
        targetSvcProgress = Math.max(0, Math.min(1, (startY - currentY) / (window.innerHeight * 1.25)));
      }
      smoothSvcProgress += (targetSvcProgress - smoothSvcProgress) * 0.065; // Makkhan smooth zoom lerp

      // Parallax Movement for Cutouts (Calculations fully intact)
      if (fgGrass) fgGrass.style.transform = `translate3d(calc(-50% + ${(-curX * 14).toFixed(2)}px), 0, 0)`;
      if (fgWall) fgWall.style.transform = `translate3d(${(curX * 10).toFixed(2)}px, 0, 0)`;
      if (fgPine) fgPine.style.transform = `translate3d(${(curX * 12).toFixed(2)}px, 0, 0)`;

      // Camera Fluid Translation & Zoom into Stairs
      const zoomFactor = smoothSvcProgress * 7.5;
      camera.position.x = curX * (3.5 - smoothSvcProgress * 1.5);
      camera.position.y = (5.0 + curY * 1.8 - smoothScrollP * 3.5) + (smoothSvcProgress * 0.8);
      camera.position.z = 13.5 - (smoothScrollP * 6.0) - zoomFactor;
      camera.lookAt(curX * 0.45, 5.8 - (smoothScrollP * 1.8) + (smoothSvcProgress * 0.4), -18);

      if (WORLD.torii) {
        WORLD.torii.rotation.y = curX * 0.22;
        WORLD.torii.rotation.x = -curY * 0.1;
      }

      if (WORLD.temple) {
        WORLD.temple.position.x = curX * 0.55;
      }

      if (WORLD.moon) {
        WORLD.moon.position.x = 9.0 - curX * 1.4;
        WORLD.moon.position.y = 13.8 - curY * 0.85;
      }

      // Leaves Falling
      if (WORLD.leaves) {
        WORLD.leaves.forEach(lf => {
          lf.position.y -= lf.userData.vy;
          lf.position.x += Math.sin(timeClock * lf.userData.swaySpeed + lf.userData.offset) * 0.018;
          lf.rotation.z += lf.userData.rotSpeed;
          lf.rotation.y += lf.userData.rotSpeed * 0.5;

          if (lf.position.y < 0.2) {
            lf.position.y = 16;
            lf.position.x = (Math.random() - 0.5) * 32;
          }
        });
      }

      // Birds Flapping
      if (WORLD.birds) {
        WORLD.birds.forEach(b => {
          b.position.x += b.userData.speed;
          b.position.y += Math.sin(timeClock * 2 + b.userData.wingCycle) * 0.01;

          const flap = Math.sin(timeClock * 12 + b.userData.wingCycle) * 0.45;
          b.userData.wingL.rotation.z = flap;
          b.userData.wingR.rotation.z = -flap;

          if (b.position.x > 25) {
            b.position.x = -25;
            b.position.y = 11 + Math.random() * 5;
          }
        });
      }

      // Butterfly Fluid Flying & Dampened Chasing
      if (WORLD.butterfly) {
        const b = WORLD.butterfly;

        const bTargetX = curX * 9.2 + Math.sin(timeClock * 3.0) * 1.4;
        const bTargetY = 5.0 + curY * 5.2 + Math.cos(timeClock * 2.6) * 1.1;
        const bTargetZ = 7.5 + Math.sin(timeClock * 1.8) * 1.2;

        b.pos.x += (bTargetX - b.pos.x) * 0.052;
        b.pos.y += (bTargetY - b.pos.y) * 0.052;
        b.pos.z += (bTargetZ - b.pos.z) * 0.052;
        b.mesh.position.copy(b.pos);

        const bDx = bTargetX - b.pos.x;
        const bDy = bTargetY - b.pos.y;
        b.rot.z += (bDx * 0.14 - b.rot.z) * 0.08;
        b.rot.y += (-bDx * 0.18 - b.rot.y) * 0.08;
        b.rot.x += (-bDy * 0.14 - b.rot.x) * 0.08;
        b.mesh.rotation.set(b.rot.x, b.rot.y, b.rot.z);

        const flap = Math.sin(timeClock * 22) * 0.85;
        b.wingL.rotation.y = flap;
        b.wingR.rotation.y = -flap;

        // Soft smoky trail
        const sPuffs = b.smokeParticles;
        for (let i = 0; i < sPuffs.length; i++) {
          const sp = sPuffs[i];
          sp.userData.life += 0.022;

          if (sp.userData.life > 1.0) {
            sp.userData.life = 0;
            sp.position.set(
              b.pos.x + (Math.random() - 0.5) * 0.16,
              b.pos.y - 0.07 + (Math.random() - 0.5) * 0.1,
              b.pos.z - 0.12
            );
            sp.userData.scale = 0.28;
            sp.userData.vx = (Math.random() - 0.5) * 0.012;
            sp.userData.vy = 0.004 + Math.random() * 0.008;
            sp.userData.vz = (Math.random() - 0.5) * 0.012;
          } else {
            sp.position.x += sp.userData.vx;
            sp.position.y += sp.userData.vy;
            sp.position.z += sp.userData.vz;
            sp.userData.scale += 0.012;
            sp.scale.setScalar(sp.userData.scale);
            sp.material.opacity = Math.max(0, (1 - sp.userData.life) * 0.38);
          }
        }
      }

      renderer.render(scene, camera);
    }
    renderLoop();
  }

  if (document.readyState === 'complete') init3D();
  else window.addEventListener('load', init3D);
})();
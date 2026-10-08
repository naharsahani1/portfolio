gsap.registerPlugin(ScrollTrigger);

// Phones/tablets = lite mode
const lite = matchMedia('(max-width:800px),(pointer:coarse)').matches;

// Mobile par animation smoothing ko halka rakha hai
const SC = lite ? 0.15 : 0.3;

ScrollTrigger.config({
  ignoreMobileResize: true
});

// Replay every time the section enters the screen
const REPLAY = 'play reset play reset';

// Animation speed
const SPEED = 2.2;


/* =========================================================
   HERO
========================================================= */

gsap.from('#hero h1', {
  y: 60,
  opacity: 0,
  duration: 0.8,
  ease: 'power3.out'
});

if (!lite) {
  gsap.to('.hero-blob', {
    x: 30,
    y: -18,
    rotate: 6,
    scaleX: 1.08,
    duration: 4,
    yoyo: true,
    repeat: -1,
    ease: 'sine.inOut'
  });
}

gsap.to('#hero', {
  opacity: 0,
  scale: 0.92,
  scrollTrigger: {
    trigger: '#hero',
    start: '60% top',
    end: 'bottom top',
    scrub: true
  }
});


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
  .from('.about-blob', {
    opacity: 0,
    duration: 0.6
  })

  .from('.me img', {
    y: 100,
    scale: 0.85,
    opacity: 0,
    duration: 0.7,
    ease: 'back.out(1.4)'
  }, '-=.5')

  .from('.intro small', {
    y: 25,
    opacity: 0,
    duration: 0.4
  }, '-=.4')

  .from('.intro h2', {
    y: 40,
    scale: 0.92,
    opacity: 0,
    duration: 0.5,
    ease: 'back.out(1.6)'
  }, '-=.3')

  .from('.intro p', {
    y: 25,
    opacity: 0,
    duration: 0.4
  }, '-=.3')

  .from('.info > h3', {
    x: 50,
    opacity: 0,
    duration: 0.4
  }, '-=.6')

  .from('.bio', {
    y: 40,
    opacity: 0,
    duration: 0.5
  }, '-=.3')

  .from('.cols h3', {
    y: 25,
    opacity: 0,
    stagger: 0.08,
    duration: 0.4
  }, '-=.2')

  .from('.cols b,.cols p', {
    y: 25,
    opacity: 0,
    stagger: 0.04,
    duration: 0.4
  }, '-=.2');

aboutTl.timeScale(SPEED);

if (!lite) {
  gsap.to('.about-blob', {
    scale: 1.07,
    duration: 3,
    yoyo: true,
    repeat: -1,
    ease: 'sine.inOut'
  });
}


/* =========================================================
   SOFTWARE SKILLS
========================================================= */

const CAPCUT = {
  name: 'CapCut',
  img: 'assets/logos/capcut.png'
};

const davinci = {
  name: 'DaVinci Resolve',
  img: 'assets/logos/davinci resolve.jpg'
};

const apps = [
  CAPCUT,

  {
    name: 'Premiere Pro',
    text: 'Pr',
    bg: '#00005b',
    color: '#9999ff'
  },

  {
    name: 'After Effects',
    text: 'Ae',
    bg: '#00005b',
    color: '#9999ff'
  },

  {
    name: 'Audition',
    text: 'Au',
    bg: '#00192f',
    color: '#00e4bb'
  },

  {
    name: 'Photoshop',
    text: 'Ps',
    bg: '#001e36',
    color: '#31a8ff'
  },

  {
    name: 'Illustrator',
    text: 'Ai',
    bg: '#330000',
    color: '#ff9a00'
  },

  davinci
];

const icons = document.getElementById('icons');
const label = document.getElementById('skill-label');
const skillsEl = document.getElementById('skills');

apps.forEach(a => {

  const d = document.createElement('div');

  d.className = 'ico';

  if (a.img) {

    d.classList.add('img');

    d.innerHTML = `
      <img
        src="${a.img}"
        alt="${a.name}"
        loading="lazy"
        decoding="async"
      >
    `;

  } else {

    d.textContent = a.text;
    d.style.background = a.bg;
    d.style.color = a.color;

  }

  icons.appendChild(d);
});

const els = [...icons.children];
const last = apps.length - 1;

const isMobile = () => innerWidth <= 800;

const iconSize = () => {

  return isMobile()

    ? Math.min(
        Math.max(innerWidth * 0.19, 60),
        84
      )

    : Math.min(
        Math.max(innerWidth * 0.105, 96),
        200
      );

};

let cur = 0;
let lastS = 0;
let lastName = '';

function layout(p) {

  cur = p;

  const m = isMobile();
  const s = iconSize();
  const h = innerHeight;

  const cy = m
    ? h * 0.64
    : h / 2;

  const gap = m
    ? 0.9
    : 0.92;

  const bend = m
    ? 0.12
    : 0.17;

  const fade = m
    ? 3
    : 4;

  if (s !== lastS) {

    skillsEl.style.setProperty(
      '--s',
      s + 'px'
    );

    lastS = s;

  }

  els.forEach((el, i) => {

    const d = i - p;
    const ad = Math.abs(d);

    gsap.set(el, {

      y:
        cy -
        s / 2 +
        d * s * gap,

      x:
        d * d * s * bend,

      rotate:
        -d * 5,

      scale:
        1 +
        0.3 *
        Math.max(0, 1 - ad),

      zIndex:
        20 -
        Math.round(ad),

      opacity:
        ad > fade
          ? Math.max(0, fade + 1 - ad)
          : 1

    });

  });

  const name =
    apps[
      Math.max(
        0,
        Math.min(
          last,
          Math.round(p)
        )
      )
    ].name;

  if (name !== lastName) {

    label.textContent = name;
    lastName = name;

  }

}

layout(0);


/* Skills scroll */

ScrollTrigger.create({

  trigger: '#skills',

  start: 'top top',

  end:
    '+=' +
    (apps.length * 220),

  pin: true,

  anticipatePin: 1,

  scrub: true,

  onUpdate: s => {

    layout(
      s.progress * last
    );

  }

});


/* Skills heading */

gsap.from('#skills h2', {

  x: -80,

  opacity: 0,

  duration: 0.5,

  scrollTrigger: {

    trigger: '#skills',

    start: 'top 80%',

    toggleActions:
      'play none none reverse'

  }

});


if (!lite) {

  gsap.to('.skills-blob', {

    x: -60,

    duration: 5,

    yoyo: true,

    repeat: -1,

    ease: 'sine.inOut'

  });

}

addEventListener('resize', () => {

  layout(cur);

});


/* =========================================================
   SERVICES - VIDEO CAROUSEL
========================================================= */

const CLOUD_NAME = 'umxejinu';

const useCloud =
  CLOUD_NAME !== '';


/* Cloudinary video URL */

const vidURL = id =>
  `https://res.cloudinary.com/${CLOUD_NAME}/video/upload/vc_h264,q_auto${lite ? ':eco' : ''},w_${lite ? 400 : 540},c_limit,ac_none/${id}.mp4`;


/* Cloudinary poster */

const posterURL = id =>
  `https://res.cloudinary.com/${CLOUD_NAME}/video/upload/so_0,w_${lite ? 320 : 540},c_limit,q_auto/${id}.jpg`;


/* =========================================================
   YOUR VIDEOS
========================================================= */

const svc = [

  {
    id: 'v1',
    local: 'assets/videos/v1.mp4',
    fit: 'cover',
    pos: 'center'
  },

  {
    id: 'v2',
    local: 'assets/videos/v2.mp4',
    fit: 'cover',
    pos: 'center'
  },

  {
    id: 'v3',
    local: 'assets/videos/v3.mp4',
    fit: 'cover',
    pos: 'center'
  },

  {
    id: 'v4',
    local: 'assets/videos/v4.mp4',
    fit: 'cover',
    pos: 'center'
  },

  {
    id: 'v5',
    local: 'assets/videos/v5.mp4',
    fit: 'cover',
    pos: 'center'
  },

  {
    id: 'v6',
    local: '',
    fit: 'cover',
    pos: 'center'
  },

  {
    id: 'v7',
    local: '',
    fit: 'cover',
    pos: 'center'
  },

  {
    id: 'v8',
    local: '',
    fit: 'cover',
    pos: 'center'
  },

  {
    id: 'v9',
    local: '',
    fit: 'cover',
    pos: 'center'
  }

];


/* =========================================================
   CREATE VIDEO CARDS
========================================================= */

const stack =
  document.getElementById('stack');

svc.forEach(s => {

  const c =
    document.createElement('div');

  c.className = 'card';


  const fromCloud =
    useCloud && !!s.id;


  const v =
    document.createElement('video');

  v.className = 'main';


  /* IMPORTANT:
     muted autoplay compatible settings
  */

  v.muted = true;
  v.loop = true;
  v.playsInline = true;

  v.setAttribute(
    'muted',
    ''
  );

  v.setAttribute(
    'playsinline',
    ''
  );

  v.setAttribute(
    'webkit-playsinline',
    ''
  );

  v.setAttribute(
    'disableremoteplayback',
    ''
  );

  v.disablePictureInPicture = true;


  /* Mobile = metadata only
     Desktop = auto
  */

  v.preload =
    lite
      ? 'metadata'
      : 'auto';


  v.dataset.src =
    fromCloud
      ? vidURL(s.id)
      : s.local;


  if (fromCloud) {

    v.poster =
      posterURL(s.id);

  }


  v.style.objectFit =
    s.fit === 'contain'
      ? 'contain'
      : 'cover';

  v.style.objectPosition =
    s.pos || 'center';


  /* Cloudinary error fallback */

  v.addEventListener(
    'error',
    () => {

      if (
        !fromCloud ||
        !s.local ||
        !v.getAttribute('src') ||
        v.dataset.fellBack
      ) {
        return;
      }

      v.dataset.fellBack = '1';

      v.dataset.src =
        s.local;

      v.src =
        s.local;

      const p =
        v.play();

      if (
        p &&
        p.catch
      ) {
        p.catch(() => {});
      }

    }
  );


  /* Dark shade */

  const shade =
    document.createElement('div');

  shade.className =
    'shade';


  c.append(
    v,
    shade
  );

  stack.appendChild(c);

});


const cards =
  [...stack.children];

const vids =
  cards.map(
    c =>
      c.querySelector('video')
  );

const shades =
  cards.map(
    c =>
      c.querySelector('.shade')
  );


const N =
  cards.length;

const HALF =
  N / 2;


/* =========================================================
   CAROUSEL
========================================================= */

let CW = 0;

const measure = () => {

  CW =
    cards[0]?.offsetWidth ||
    200;

};

measure();


function carousel(p) {

  const m =
    isMobile();


  const X1 =
    CW *
    (m ? 0.70 : 0.78);


  const X2 =
    CW *
    (m ? 0.16 : 0.19);


  const Z1 =
    m
      ? 190
      : 250;


  const Z2 =
    m
      ? 35
      : 55;


  const ANG =
    m
      ? 52
      : 60;


  for (
    let i = 0;
    i < N;
    i++
  ) {

    let d =
      i - p;


    /* Loop */

    d =
      (
        (
          d + HALF
        ) %
        N +
        N
      ) %
      N -
      HALF;


    const ad =
      Math.abs(d);


    const c =
      cards[i];


    /* Hide far cards */

    if (ad > 3.6) {

      if (!c._hid) {

        c.style.visibility =
          'hidden';

        c._hid = true;

      }

      continue;

    }


    if (c._hid) {

      c.style.visibility =
        'visible';

      c._hid = false;

    }


    const sg =
      d < 0
        ? -1
        : 1;


    const a1 =
      Math.min(ad, 1);


    const a2 =
      Math.max(
        ad - 1,
        0
      );


    const a2c =
      Math.min(
        a2,
        3
      );


    const x =
      sg *
      (
        X1 * a1 +
        X2 * a2
      );


    const z =
      -(
        Z1 * a1 +
        Z2 * a2c
      );


    const ry =
      sg *
      a1 *
      ANG;


    const s =
      1 -
      a1 * 0.12 -
      a2c * 0.04;


    c.style.transform =
      `translate3d(-50%,-50%,0) ` +
      `translate3d(${x.toFixed(1)}px,0,${z.toFixed(1)}px) ` +
      `rotateY(${ry.toFixed(1)}deg) ` +
      `scale(${s.toFixed(3)})`;


    c.style.opacity =
      ad <= HALF - 0.5
        ? 1
        : Math.max(
            0,
            (HALF - ad) / 0.5
          );


    c.style.zIndex =
      100 -
      Math.round(ad * 10);


    shades[i].style.opacity =
      Math.min(
        0.7,
        a1 * 0.32 +
        a2c * 0.10
      );

  }

}


/* =========================================================
   VIDEO SYNCHRONIZATION
========================================================= */

let lastIdx = -1;

let svcVisible = false;


/*
  IMPORTANT MOBILE OPTIMIZATION:

  Desktop:
  center + nearby videos loaded

  Mobile:
  ONLY center video loaded

  This greatly reduces:
  - RAM usage
  - network usage
  - decoding load
  - scrolling lag
*/


function syncVideos(idx) {

  if (idx === lastIdx) {
    return;
  }

  lastIdx =
    idx;


  vids.forEach(
    (v, i) => {

      const diff =
        Math.abs(
          i - idx
        );


      const dist =
        Math.min(
          diff,
          N - diff
        );


      /* Mobile:
         only center video

         Desktop:
         center + neighbours
      */

      const loaded =
        lite
          ? dist === 0
          : dist <= 1;


      /* Load video */

      if (
        loaded &&
        !v.getAttribute('src')
      ) {

        v.src =
          v.dataset.src;

        v.load();

      }


      /* Unload unnecessary video */

      if (
        !loaded &&
        v.getAttribute('src')
      ) {

        v.pause();

        v.removeAttribute(
          'src'
        );

        v.load();

      }


      /* Center video */

      if (i === idx) {

        v.muted = true;

        v.setAttribute(
          'muted',
          ''
        );

        v.setAttribute(
          'playsinline',
          ''
        );


        const playVideo = () => {

          const p =
            v.play();

          if (
            p &&
            p.catch
          ) {
            p.catch(
              () => {}
            );
          }

        };


        /*
          If already ready,
          play immediately.

          Otherwise wait for
          loadeddata.
        */

        if (
          v.readyState >= 2
        ) {

          playVideo();

        } else {

          v.addEventListener(
            'loadeddata',
            playVideo,
            {
              once: true
            }
          );

        }

      } else {

        v.pause();

      }

    }
  );

}


/* Pause everything */

function pauseAll() {

  vids.forEach(
    v => v.pause()
  );

  lastIdx = -1;

}


/* Convert carousel position to index */

const idxOf =
  p =>
    (
      (
        Math.round(p) %
        N
      ) +
      N
    ) %
    N;


/* Current position */

let curP =
  () => 0;


/* Browser tab / phone lock */

document.addEventListener(
  'visibilitychange',
  () => {

    if (document.hidden) {

      pauseAll();

    } else if (
      svcVisible
    ) {

      syncVideos(
        idxOf(
          curP()
        )
      );

    }

  }
);


/* =========================================================
   DESKTOP VIDEO CAROUSEL
========================================================= */

if (!lite) {

  const SVC_SCROLL =
    Math.max(
      1200,
      N * 320
    );


  const proxy = {
    p: 0
  };


  curP =
    () => proxy.p;


  gsap.to(
    proxy,
    {

      p: N - 1,

      ease: 'none',

      onUpdate: () => {

        carousel(
          proxy.p
        );


        if (
          svcVisible
        ) {

          syncVideos(
            idxOf(
              proxy.p
            )
          );

        }

      },


      scrollTrigger: {

        trigger:
          '#services',

        start:
          'top top',

        end:
          '+=' +
          SVC_SCROLL,

        pin: true,

        anticipatePin:
          1,

        scrub: SC

      }

    }
  );


  carousel(0);


  addEventListener(
    'resize',
    () => {

      measure();

      carousel(
        proxy.p
      );

    }
  );


  /* Visibility */

  ScrollTrigger.create({

    trigger:
      '#services',

    start:
      'top bottom+=800',

    end:
      () =>
        '+=' +
        (
          SVC_SCROLL +
          innerHeight * 2 +
          800
        ),

    onToggle:
      self => {

        svcVisible =
          self.isActive;


        if (
          svcVisible
        ) {

          syncVideos(
            idxOf(
              proxy.p
            )
          );

        } else {

          pauseAll();

        }

      }

  });


  /* Services entrance */

  gsap.from(
    '#stack',
    {

      y: 120,

      scale: 0.8,

      opacity: 0,

      duration: 0.8,

      ease:
        'back.out(1.4)',

      scrollTrigger: {

        trigger:
          '#services',

        start:
          'top 85%',

        end:
          () =>
            '+=' +
            (
              innerHeight * 0.85 +
              SVC_SCROLL +
              innerHeight
            ),

        toggleActions:
          REPLAY

      }

    }
  );


}


/* =========================================================
   MOBILE VIDEO CAROUSEL
========================================================= */

else {

  let pos = 0;

  let target = 0;

  let raf = 0;


  curP =
    () => pos;


  /*
    Smaller STEP =
    more sensitive swipe
  */

  const STEP =
    () =>
      CW * 0.55;


  /*
    Flick distance
  */

  const INERTIA =
    220;


  /* Smooth animation loop */

  function loop() {

    const diff =
      target - pos;


    if (
      Math.abs(diff) <
      0.003
    ) {

      pos =
        target;


      carousel(
        pos
      );


      raf = 0;


      if (
        svcVisible
      ) {

        syncVideos(
          idxOf(pos)
        );

      }


      return;

    }


    /*
      Mobile smoothness

      .22 = faster response
    */

    pos +=
      diff * 0.22;


    carousel(
      pos
    );


    raf =
      requestAnimationFrame(
        loop
      );

  }


  const go = () => {

    if (!raf) {

      raf =
        requestAnimationFrame(
          loop
        );

    }

  };


  /* Pointer variables */

  let dragging =
    false;

  let moved =
    false;

  let sx = 0;

  let startPos = 0;

  let lastX = 0;

  let lastT = 0;

  let vel = 0;


  /* =====================================================
     TOUCH START
  ===================================================== */

  stack.addEventListener(
    'pointerdown',
    e => {

      dragging = true;

      moved = false;


      sx =
        lastX =
          e.clientX;


      startPos =
        pos;


      lastT =
        performance.now();


      vel = 0;

      target =
        pos;


      if (raf) {

        cancelAnimationFrame(
          raf
        );

        raf = 0;

      }


      /*
        Pause video during swipe
        to reduce decoding load.
      */

      pauseAll();


      try {

        stack.setPointerCapture(
          e.pointerId
        );

      } catch (_) {}

    }
  );


  /* =====================================================
     TOUCH MOVE
  ===================================================== */

  stack.addEventListener(
    'pointermove',
    e => {

      if (!dragging) {
        return;
      }


      const dx =
        e.clientX - sx;


      if (
        Math.abs(dx) > 6
      ) {

        moved = true;

      }


      const now =
        performance.now();


      const dt =
        Math.max(
          1,
          now - lastT
        );


      vel =
        vel * 0.6 +
        (
          (
            lastX -
            e.clientX
          ) /
          STEP() /
          dt
        ) * 0.4;


      lastX =
        e.clientX;


      lastT =
        now;


      /*
        Move carousel
      */

      pos =
        startPos -
        dx / STEP();


      target =
        pos;


      carousel(
        pos
      );

    }
  );


  /* =====================================================
     TOUCH RELEASE
  ===================================================== */

  function release(e) {

    if (!dragging) {
      return;
    }


    dragging = false;


    if (moved) {

      let t =
        Math.round(
          pos +
          vel *
          INERTIA
        );


      const base =
        Math.round(
          pos
        );


      /*
        Maximum 3 videos
        per quick flick
      */

      target =
        Math.max(
          base - 3,
          Math.min(
            base + 3,
            t
          )
        );

    } else {

      /*
        Tap on side card
        brings it to center
      */

      const card =
        e.target.closest &&
        e.target.closest(
          '.card'
        );


      const i =
        cards.indexOf(
          card
        );


      if (i > -1) {

        let d =
          i -
          Math.round(
            pos
          );


        d =
          (
            (
              d + HALF
            ) %
            N +
            N
          ) %
          N -
          HALF;


        target =
          Math.round(
            pos
          ) +
          d;

      } else {

        target =
          Math.round(
            pos
          );

      }

    }


    go();

  }


  stack.addEventListener(
    'pointerup',
    release
  );


  stack.addEventListener(
    'pointercancel',
    release
  );


  /* Initial */

  carousel(0);


  addEventListener(
    'resize',
    () => {

      measure();

      carousel(
        pos
      );

    }
  );


  /* Services visibility */

  ScrollTrigger.create({

    trigger:
      '#services',

    start:
      'top bottom+=300',

    end:
      'bottom top-300',

    onToggle:
      self => {

        svcVisible =
          self.isActive;


        if (
          svcVisible
        ) {

          syncVideos(
            idxOf(pos)
          );

        } else {

          pauseAll();

        }

      }

  });

}


/* =========================================================
   PAGE LOAD
========================================================= */

window.addEventListener(
  'load',
  () => {

    measure();

    carousel(
      curP()
    );

  }
);


/* =========================================================
   EDITOR
========================================================= */

const ed =
  gsap.timeline({

    scrollTrigger: {

      trigger:
        '#editor',

      start:
        'top 70%',

      end:
        'bottom 20%',

      toggleActions:
        REPLAY

    }

  });


ed
  .from(
    '#editor p',
    {
      y: -80,
      opacity: 0,
      duration: 0.5
    }
  )

  .from(
    '#editor h2',
    {
      scale: 0.4,
      opacity: 0,
      duration: 0.7,
      ease:
        'back.out(1.6)'
    },
    '-=.2'
  );


ed.timeScale(
  SPEED
);


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


const searchEl =
  document.getElementById(
    'search'
  );


const oldFast =
  document.getElementById(
    'fast'
  );


if (oldFast) {

  oldFast.remove();

}


const lines =
  phrases.map(
    t => {

      const h =
        document.createElement(
          'h3'
        );


      h.textContent =
        t;


      h.style.cssText =
        `
        position:absolute;
        text-align:center;
        padding:0 6vw;
        font:600 clamp(1.4rem,2.6vw,2.2rem) "Open Sans",sans-serif;
        color:#cfd6ea;
        opacity:0;
        letter-spacing:.01em
        `;


      searchEl.appendChild(
        h
      );


      return h;

    }
  );


const typed =
  document.getElementById(
    'typed'
  );


const obj = {
  n: 0
};


const type =
  (txt, t) =>

    gsap.fromTo(

      obj,

      {
        n: 0
      },

      {

        n:
          txt.length,

        duration:
          t,

        ease:
          'none',

        onUpdate:
          () => {

            typed.textContent =
              txt.slice(
                0,
                Math.round(
                  obj.n
                )
              );

          }

      }

    );


/* Search timeline */

const sq =
  gsap.timeline({

    scrollTrigger: {

      trigger:
        '#search',

      start:
        'top top',

      end:
        '+=' +
        (
          900 +
          phrases.length *
          130
        ),

      pin: true,

      anticipatePin:
        1,

      scrub: SC

    }

  });


sq
  .from(
    '.sbox,.mic',
    {
      opacity: 0,
      scaleX: 0.6,
      duration: 0.5
    }
  )

  .add(
    type(
      'Need Pro Video Editing?',
      1.6
    )
  )

  .to(
    {},
    {
      duration: 0.4
    }
  )

  .add(
    () => {

      typed.textContent =
        '';

    }
  )

  .add(
    type(
      'Nahar Studio.',
      1.1
    )
  )

  .to(
    {},
    {
      duration: 0.4
    }
  )

  .to(
    '.sbox,.mic',
    {
      opacity: 0,
      duration: 0.4
    }
  );


lines.forEach(
  (el, i) => {

    sq.fromTo(

      el,

      {
        opacity: 0,
        y: 24
      },

      {
        opacity: 1,
        y: 0,
        duration: 0.35,
        ease:
          'power2.out'
      }

    );


    if (
      i <
      lines.length - 1
    ) {

      sq.to(
        el,
        {
          opacity: 0,
          y: -24,
          duration: 0.35,
          ease:
            'power2.in'
        },
        '+=.25'
      );

    } else {

      sq.to(
        {},
        {
          duration: 0.5
        }
      );

    }

  }
);


/* =========================================================
   LOGO
========================================================= */

gsap.from(
  '.mark',
  {

    scale: 1.6,

    opacity: 0,

    duration: 0.9,

    ease:
      'power3.out',

    scrollTrigger: {

      trigger:
        '#logo',

      start:
        'top 75%',

      end:
        'bottom 20%',

      toggleActions:
        REPLAY

    }

  }
);


/* =========================================================
   FOOTER
========================================================= */

gsap.fromTo(

  '#footer .f-title,#footer .f-sub,.f-item',

  {
    opacity: 0
  },

  {

    opacity: 1,

    stagger: 0.06,

    duration: 0.5,

    ease:
      'power2.out',

    scrollTrigger: {

      trigger:
        '#footer',

      start:
        'top 90%',

      end:
        'bottom top',

      toggleActions:
        REPLAY

    }

  }

);


/* =========================================================
   FINAL REFRESH
========================================================= */

addEventListener(
  'resize',
  () => {

    ScrollTrigger.refresh();

  }
);


window.addEventListener(
  'load',
  () => {

    ScrollTrigger.refresh();

  }
);
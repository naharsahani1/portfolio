gsap.registerPlugin(ScrollTrigger);

// Phones/tablets = "lite" mode (lighter animations)
const lite=matchMedia('(max-width:800px),(pointer:coarse)').matches;
const SC=lite?true:.3;                       // scroll-linked animation smoothing
ScrollTrigger.config({ignoreMobileResize:true}); // stops jumps when the phone address bar hides/shows

// Replay every time the section enters the screen (from top OR bottom)
const REPLAY='play reset play reset';

// ANIMATION SPEED: 1 = normal, 2 = twice as fast, 3 = very fast
const SPEED=2.2;

/* ---------- Hero: floating blob + title reveal ---------- */
gsap.from('#hero h1',{y:60,opacity:0,duration:.8,ease:'power3.out'});
if(!lite) gsap.to('.hero-blob',{x:30,y:-18,rotate:6,scaleX:1.08,duration:4,yoyo:true,repeat:-1,ease:'sine.inOut'});
gsap.to('#hero',{opacity:0,scale:.92,scrollTrigger:{trigger:'#hero',start:'60% top',end:'bottom top',scrub:true}});

/* ---------- About: photo + text POP UP every time ---------- */
const aboutTl=gsap.timeline({
  scrollTrigger:{trigger:'#about',start:'top 85%',end:'bottom 10%',toggleActions:REPLAY}
});
aboutTl
  .from('.about-blob',{opacity:0,duration:.6})
  .from('.me img',{y:100,scale:.85,opacity:0,duration:.7,ease:'back.out(1.4)'},'-=.5')
  .from('.intro small',{y:25,opacity:0,duration:.4},'-=.4')
  .from('.intro h2',{y:40,scale:.92,opacity:0,duration:.5,ease:'back.out(1.6)'},'-=.3')
  .from('.intro p',{y:25,opacity:0,duration:.4},'-=.3')
  .from('.info > h3',{x:50,opacity:0,duration:.4},'-=.6')
  .from('.bio',{y:40,opacity:0,duration:.5},'-=.3')
  .from('.cols h3',{y:25,opacity:0,stagger:.08,duration:.4},'-=.2')
  .from('.cols b,.cols p',{y:25,opacity:0,stagger:.04,duration:.4},'-=.2');
aboutTl.timeScale(SPEED);
if(!lite) gsap.to('.about-blob',{scale:1.07,duration:3,yoyo:true,repeat:-1,ease:'sine.inOut'});

/* ---------- Software skills: BIG icons on a curve (focused icon sticks out LEFT) ---------- */
// Letter tile: {name, text, bg, color}
// Image icon:  {name, img}
const CAPCUT={name:'CapCut', img:'assets/logos/capcut.png'};
const davinci={name:'DaVinci Resolve', img:'assets/logos/davinci resolve.jpg'};
const apps=[
  CAPCUT,
  {name:'Premiere Pro',  text:'Pr', bg:'#00005b', color:'#9999ff'},
  {name:'After Effects', text:'Ae', bg:'#00005b', color:'#9999ff'},
  {name:'Audition',      text:'Au', bg:'#00192f', color:'#00e4bb'},
  {name:'Photoshop',     text:'Ps', bg:'#001e36', color:'#31a8ff'},
  {name:'Illustrator',   text:'Ai', bg:'#330000', color:'#ff9a00'},
  davinci
];
const icons=document.getElementById('icons'),label=document.getElementById('skill-label'),skillsEl=document.getElementById('skills');
apps.forEach(a=>{
  const d=document.createElement('div');
  d.className='ico';
  if(a.img){
    d.classList.add('img');
    d.innerHTML=`<img src="${a.img}" alt="${a.name}" loading="lazy" decoding="async">`;
  }else{
    d.textContent=a.text;
    d.style.background=a.bg;
    d.style.color=a.color;
  }
  icons.appendChild(d);
});
const els=[...icons.children],last=apps.length-1;
const isMobile=()=>innerWidth<=800;
// ICON SIZE: desktop big, mobile smaller
const iconSize=()=> isMobile()
  ? Math.min(Math.max(innerWidth*0.19,60),84)
  : Math.min(Math.max(innerWidth*0.105,96),200);
let cur=0,lastS=0,lastName='';
function layout(p){ // p = fractional index of the focused icon (0 .. last)
  cur=p;
  const m=isMobile(), s=iconSize(), h=innerHeight;
  const cy = m ? h*0.64 : h/2;            // vertical centre of the focused icon
  const gap = m ? 0.9 : 0.92;             // spacing between icons
  const bend = m ? 0.12 : 0.17;           // how much the column curves
  const fade = m ? 3 : 4;                 // how many icons are visible above/below
  if(s!==lastS){ skillsEl.style.setProperty('--s',s+'px'); lastS=s; }
  els.forEach((el,i)=>{
    const d=i-p, ad=Math.abs(d);
    gsap.set(el,{
      y: cy - s/2 + d*s*gap,
      x: d*d*s*bend,                      // focused icon furthest LEFT, others curve RIGHT
      rotate: -d*5,
      scale: 1+0.3*Math.max(0,1-ad),      // focused icon is bigger
      zIndex: 20-Math.round(ad),
      opacity: ad>fade ? Math.max(0,fade+1-ad) : 1
    });
  });
  const name=apps[Math.max(0,Math.min(last,Math.round(p)))].name;
  if(name!==lastName){ label.textContent=name; lastName=name; }
}
layout(0);
// SCROLL LENGTH: smaller number = faster (less scrolling needed)
ScrollTrigger.create({trigger:'#skills',start:'top top',end:'+='+(apps.length*220),pin:true,anticipatePin:1,scrub:true,
  onUpdate:s=>layout(s.progress*last)});
// Heading stays visible for the whole pinned section
gsap.from('#skills h2',{x:-80,opacity:0,duration:.5,scrollTrigger:{trigger:'#skills',start:'top 80%',toggleActions:'play none none reverse'}});
if(!lite) gsap.to('.skills-blob',{x:-60,duration:5,yoyo:true,repeat:-1,ease:'sine.inOut'});
addEventListener('resize',()=>layout(cur));

/* ---------- Services: 3D video carousel (video only, no text) ---------- */

// Cloudinary cloud name (already set)
const CLOUD_NAME='umxejinu';
const useCloud=CLOUD_NAME!=='';
// phone-friendly: 540px wide, H.264 mp4, auto quality, audio removed
// (these two lines build the full link from the id, so do NOT replace them)
const vidURL   =id=>`https://res.cloudinary.com/${CLOUD_NAME}/video/upload/vc_h264,q_auto,w_540,c_limit,ac_none/${id}.mp4`;
const posterURL=id=>`https://res.cloudinary.com/${CLOUD_NAME}/video/upload/so_0,w_540,c_limit,q_auto/${id}.jpg`;

// ================== EDIT HERE: your videos (left to right order) ==================
// id    = Cloudinary Public ID (from the link: .../upload/v1791486870/v3.mp4  ->  id:'v3')
// local = backup file in assets/videos/ (can be '' if you deleted local files)
// To remove a video: delete its line. To add one: copy a line and change the id.
const svc=[
  {id:'v1', local:'assets/videos/v1.mp4', fit:'cover', pos:'center'},
  {id:'v2', local:'assets/videos/v2.mp4', fit:'cover', pos:'center'},
  {id:'v3', local:'assets/videos/v3.mp4', fit:'cover', pos:'center'},
  {id:'v4', local:'assets/videos/v4.mp4', fit:'cover', pos:'center'},
  {id:'v5', local:'assets/videos/v5.mp4', fit:'cover', pos:'center'},
  {id:'v6', local:'',                     fit:'cover', pos:'center'},
  {id:'v7', local:'',                     fit:'cover', pos:'center'},
  {id:'v8', local:'',                     fit:'cover', pos:'center'},
  {id:'v9', local:'',                     fit:'cover', pos:'center'}
];
// ==================================================================================

const stack=document.getElementById('stack');
svc.forEach(s=>{
  const c=document.createElement('div');
  c.className='card';

  const fromCloud=useCloud && !!s.id;          // this card uses Cloudinary?
  const v=document.createElement('video');     // ONE video per card, src is added only when needed
  v.className='main';
  v.muted=true; v.loop=true; v.playsInline=true;
  v.setAttribute('muted',''); v.setAttribute('playsinline',''); v.setAttribute('webkit-playsinline','');
  v.setAttribute('disableremoteplayback',''); v.disablePictureInPicture=true;
  v.preload='auto';
  v.dataset.src=fromCloud ? vidURL(s.id) : s.local;
  if(fromCloud) v.poster=posterURL(s.id);      // first frame shows on side cards (video not loaded)
  v.style.objectFit=s.fit==='contain'?'contain':'cover';
  v.style.objectPosition=s.pos||'center';

  // if the Cloudinary link fails, switch to the local file automatically
  v.addEventListener('error',()=>{
    if(!fromCloud || !s.local || !v.getAttribute('src') || v.dataset.fellBack) return;
    v.dataset.fellBack='1';
    v.dataset.src=s.local;
    v.src=s.local;
    const p=v.play(); if(p&&p.catch) p.catch(()=>{});
  });

  const shade=document.createElement('div');   // dark layer: side cards look dimmer
  shade.className='shade';

  c.append(v,shade);
  stack.appendChild(c);
  gsap.set(c,{xPercent:-50,yPercent:-50});
});
const cards=[...stack.children].filter(el=>el.classList.contains('card'));
const vids=cards.map(c=>c.querySelector('video'));
const shades=cards.map(c=>c.querySelector('.shade'));
const N=cards.length, HALF=N/2;

// LOOPING carousel: one video is always in the centre, with videos on BOTH sides.
// p = which video is in the centre (can be a fraction while scrolling).
function carousel(p){
  const m=isMobile(), cw=cards[0].offsetWidth;
  const X1=cw*(m?.70:.78);    // distance of the first neighbour from the centre
  const X2=cw*(m?.16:.19);    // gap between the cards further away
  const Z1=m?190:250;         // how far the first neighbour goes back (depth)
  const Z2=m?35:55;           // extra depth for cards further away
  const ANG=m?52:60;          // tilt angle of side cards (degrees)
  for(let i=0;i<N;i++){
    let d=i-p;
    d=((d+HALF)%N+N)%N-HALF;               // wrap around: gives each card a position from -HALF to +HALF
    const ad=Math.abs(d), sg=d<0?-1:1;
    const a1=Math.min(ad,1), a2=Math.max(ad-1,0), a2c=Math.min(a2,3);
    gsap.set(cards[i],{
      x: sg*(X1*a1+X2*a2),
      z: -(Z1*a1+Z2*a2c),
      rotationY: sg*a1*ANG,                 // outer edge of side cards turns away from you
      scale: 1-a1*.12-a2c*.04,
      autoAlpha: ad<=HALF-.5 ? 1 : Math.max(0,(HALF-ad)/.5),   // the far edge fades while it jumps to the other side
      zIndex: 100-Math.round(ad*10)
    });
    gsap.set(shades[i],{opacity:Math.min(.7,a1*.32+a2c*.10)});
  }
}

// ONLY the centre card plays. Its neighbours are loaded but PAUSED. Everything else is unloaded.
let lastIdx=-1,svcVisible=false;
function syncVideos(idx){
  if(idx===lastIdx) return;
  lastIdx=idx;
  vids.forEach((v,i)=>{
    const dist=Math.min(Math.abs(i-idx),N-Math.abs(i-idx));   // distance in the loop
    const loaded=dist<=1;
    if(loaded && !v.getAttribute('src')) v.src=v.dataset.src;
    if(!loaded && v.getAttribute('src')){ v.pause(); v.removeAttribute('src'); v.load(); }
    if(i===idx){
      v.currentTime=0;
      const p=v.play(); if(p&&p.catch) p.catch(()=>{});
    }else{
      v.pause();                              // every other video is stopped
    }
  });
}
function pauseAll(){ vids.forEach(v=>v.pause()); lastIdx=-1; }
// stop everything if you switch browser tab / lock the phone
document.addEventListener('visibilitychange',()=>{
  if(document.hidden) pauseAll();
  else if(svcVisible) syncVideos(Math.round(proxy.p));
});

// Scrolling down moves the carousel sideways
// SCROLL LENGTH: smaller number = faster (more videos = longer scroll)
const SVC_SCROLL=Math.max(1200,N*320);
const proxy={p:0};
gsap.to(proxy,{p:N-1,ease:'none',
  onUpdate:()=>{ carousel(proxy.p); if(svcVisible) syncVideos(Math.round(proxy.p)); },
  scrollTrigger:{trigger:'#services',start:'top top',end:'+='+SVC_SCROLL,pin:true,anticipatePin:1,scrub:SC}
});
carousel(0);
addEventListener('resize',()=>carousel(proxy.p));

// Start loading just before the section arrives, pause everything when it is far away
ScrollTrigger.create({
  trigger:'#services',
  start:'top bottom+=800',
  end:()=>'+='+(SVC_SCROLL+innerHeight*2+800),
  onToggle:self=>{
    svcVisible=self.isActive;
    if(svcVisible) syncVideos(Math.round(proxy.p));
    else pauseAll();
  }
});

// POP-UP entrance: replays every time the section comes into view (from top OR bottom)
gsap.from('#stack',{y:120,scale:.8,opacity:0,duration:.8,ease:'back.out(1.4)',
  scrollTrigger:{
    trigger:'#services',
    start:'top 85%',
    end:()=>'+='+(innerHeight*0.85+SVC_SCROLL+innerHeight),
    toggleActions:REPLAY
  }
});

/* ---------- Editor: giant type punches in every time ---------- */
const ed=gsap.timeline({scrollTrigger:{trigger:'#editor',start:'top 70%',end:'bottom 20%',toggleActions:REPLAY}});
ed.from('#editor p',{y:-80,opacity:0,duration:.5}).from('#editor h2',{scale:.4,opacity:0,duration:.7,ease:'back.out(1.6)'},'-=.2');
ed.timeScale(SPEED);

/* ---------- Search bar: typing, then your phrases one by one ---------- */
// Edit this list to change / add / remove phrases
const phrases=[
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
const searchEl=document.getElementById('search');
const oldFast=document.getElementById('fast');
if(oldFast) oldFast.remove();   // replaced by the phrases below
const lines=phrases.map(t=>{
  const h=document.createElement('h3');
  h.textContent=t;
  h.style.cssText='position:absolute;text-align:center;padding:0 6vw;font:600 clamp(1.4rem,2.6vw,2.2rem) "Open Sans",sans-serif;color:#cfd6ea;opacity:0;letter-spacing:.01em';
  searchEl.appendChild(h);
  return h;
});

const typed=document.getElementById('typed'),obj={n:0};
const type=(txt,t)=>gsap.fromTo(obj,{n:0},{n:txt.length,duration:t,ease:'none',onUpdate:()=>typed.textContent=txt.slice(0,Math.round(obj.n))});
// SCROLL LENGTH: base + extra per phrase (smaller numbers = faster)
const sq=gsap.timeline({scrollTrigger:{trigger:'#search',start:'top top',end:'+='+(900+phrases.length*130),pin:true,anticipatePin:1,scrub:SC}});
sq.from('.sbox,.mic',{opacity:0,scaleX:.6,duration:.5})
  .add(type('Need Pro Video Editing?',1.6))
  .to({},{duration:.4})
  .add(()=>{typed.textContent=''}).add(type('Nahar Studio.',1.1))
  .to({},{duration:.4})
  .to('.sbox,.mic',{opacity:0,duration:.4});
lines.forEach((el,i)=>{
  sq.fromTo(el,{opacity:0,y:24},{opacity:1,y:0,duration:.35,ease:'power2.out'});
  if(i<lines.length-1){
    sq.to(el,{opacity:0,y:-24,duration:.35,ease:'power2.in'},'+=.25');   // fades out, next one comes in
  }else{
    sq.to({},{duration:.5});                                              // last phrase stays on screen
  }
});

/* ---------- Logo reveal every time ---------- */
gsap.from('.mark',{scale:1.6,opacity:0,duration:.9,ease:'power3.out',
  scrollTrigger:{trigger:'#logo',start:'top 75%',end:'bottom 20%',toggleActions:REPLAY}});

/* ---------- Footer reveal every time (fade only, no movement) ---------- */
gsap.fromTo('#footer .f-title,#footer .f-sub,.f-item',
  {opacity:0},
  {opacity:1,stagger:.06,duration:.5,ease:'power2.out',
   scrollTrigger:{trigger:'#footer',start:'top 90%',end:'bottom top',toggleActions:REPLAY}});

addEventListener('resize',()=>ScrollTrigger.refresh());
window.addEventListener('load',()=>ScrollTrigger.refresh());
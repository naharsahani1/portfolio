gsap.registerPlugin(ScrollTrigger);

// Replay every time the section enters the screen (from top OR bottom)
const REPLAY='play reset play reset';

// ANIMATION SPEED: 1 = normal, 2 = twice as fast, 3 = very fast
const SPEED=2.2;

/* ---------- Hero: floating blob + title reveal ---------- */
gsap.from('#hero h1',{y:60,opacity:0,duration:.8,ease:'power3.out'});
gsap.to('.hero-blob',{x:30,y:-18,rotate:6,scaleX:1.08,duration:4,yoyo:true,repeat:-1,ease:'sine.inOut'});
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
gsap.to('.about-blob',{scale:1.07,duration:3,yoyo:true,repeat:-1,ease:'sine.inOut'});

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
    d.innerHTML=`<img src="${a.img}" alt="${a.name}">`;
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
let cur=0;
function layout(p){ // p = fractional index of the focused icon (0 .. last)
  cur=p;
  const m=isMobile(), s=iconSize(), h=innerHeight;
  const cy = m ? h*0.64 : h/2;            // vertical centre of the focused icon (mobile = lower, below the heading)
  const gap = m ? 0.9 : 0.92;             // spacing between icons
  const bend = m ? 0.12 : 0.17;           // how much the column curves
  const fade = m ? 3 : 4;                 // how many icons are visible above/below
  skillsEl.style.setProperty('--s',s+'px');
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
  label.textContent=apps[Math.max(0,Math.min(last,Math.round(p)))].name;
}
layout(0);
// SCROLL LENGTH: smaller number = faster (less scrolling needed)
ScrollTrigger.create({trigger:'#skills',start:'top top',end:'+='+(apps.length*220),pin:true,scrub:true,
  onUpdate:s=>layout(s.progress*last)});
// Heading stays visible for the whole pinned section
gsap.from('#skills h2',{x:-80,opacity:0,duration:.5,scrollTrigger:{trigger:'#skills',start:'top 80%',toggleActions:'play none none reverse'}});
gsap.to('.skills-blob',{x:-60,duration:5,yoyo:true,repeat:-1,ease:'sine.inOut'});
addEventListener('resize',()=>layout(cur));

/* ---------- Services: stacked VIDEO cards ---------- */
// fit:'contain' = show the whole video (blurred fill behind, nothing cut off)
// fit:'cover'   = fill the card and crop; pos picks the visible part ('center', 'center top', ...)
const svc=[
  {title:'',               video:'assets/videos/v1.mp4', fit:'contain', pos:'center'},
  {title:'',     video:'assets/videos/v2.mp4', fit:'contain', pos:'center'},
  {title:'',  video:'assets/videos/v3.mp4', fit:'contain', pos:'center'},
  {title:'',    video:'assets/videos/v4.mp4', fit:'contain', pos:'center'},
  {title:'',   video:'assets/videos/v5.mp4', fit:'contain', pos:'center'},
  {title:'',   video:'assets/videos/v6.mp4', fit:'contain', pos:'center'},
{title:'',   video:'assets/videos/v7.mp4', fit:'contain', pos:'center'},
{title:'',   video:'assets/videos/v8.mp4', fit:'contain', pos:'center'},
{title:'',   video:'assets/videos/v9.mp4', fit:'contain', pos:'center'}
];
const stack=document.getElementById('stack');
svc.forEach((s,i)=>{
  const c=document.createElement('div');
  c.className='card';
  c.style.zIndex=svc.length-i;
  const bg = s.fit==='contain'
    ? `<video class="bg" src="${s.video}" autoplay muted loop playsinline></video>` : '';
  c.innerHTML = `${bg}<video class="main" src="${s.video}" autoplay muted loop playsinline preload="auto"
    style="object-fit:${s.fit||'cover'};object-position:${s.pos||'center'}"></video><h2>${s.title}</h2>`;
  stack.appendChild(c);
  gsap.set(c,{y:i*-26,scale:1-i*.06,opacity:1-i*.12});
});
const cards=[...stack.children];

// Cards peel off one by one while you scroll
// SCROLL LENGTH: smaller number = faster
const SVC_SCROLL=1200;
const st=gsap.timeline({scrollTrigger:{trigger:'#services',start:'top top',end:'+='+SVC_SCROLL,pin:true,scrub:.3}});
cards.forEach((c,i)=>{
  if(i===cards.length-1) return; // the LAST card stays on screen (no empty screen)
  st.to(c,{yPercent:-130,rotateX:20,opacity:0,duration:1,ease:'power2.in'},i);
  cards.slice(i+1).forEach((n,k)=>st.to(n,{y:k*-26,scale:1-k*.06,opacity:1-k*.12,duration:1},i));
});
st.to({},{duration:.3}); // short hold on the last card

// POP-UP entrance: replays every time the section comes into view (from top OR bottom)
const popTl=gsap.timeline({
  scrollTrigger:{
    trigger:'#services',
    start:'top 85%',
    end:()=>'+='+(innerHeight*0.85+SVC_SCROLL+innerHeight), // stays "active" through the pinned scroll
    toggleActions:REPLAY
  }
});
popTl
  .from('#stack',{scale:.55,y:160,rotate:-4,opacity:0,duration:.8,ease:'back.out(1.6)'})   // video stack pops up
  .from('.card h2',{scale:.5,y:30,opacity:0,duration:.5,ease:'back.out(2)',stagger:.05},'-=.3'); // titles pop

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
const sq=gsap.timeline({scrollTrigger:{trigger:'#search',start:'top top',end:'+='+(900+phrases.length*130),pin:true,scrub:.3}});
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
gsap.from('.mark',{scale:1.6,filter:'blur(18px)',opacity:0,duration:.9,ease:'power3.out',
  scrollTrigger:{trigger:'#logo',start:'top 75%',end:'bottom 20%',toggleActions:REPLAY}});

/* ---------- Footer reveal every time (fade only, no movement) ---------- */
gsap.fromTo('#footer .f-title,#footer .f-sub,.f-item',
  {opacity:0},
  {opacity:1,stagger:.06,duration:.5,ease:'power2.out',
   scrollTrigger:{trigger:'#footer',start:'top 90%',end:'bottom top',toggleActions:REPLAY}});

addEventListener('resize',()=>ScrollTrigger.refresh());
window.addEventListener('load',()=>ScrollTrigger.refresh());
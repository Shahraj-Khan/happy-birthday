/* ============================================================
   1. CONFIGURATION — personalize everything here
   ============================================================ */
const birthdayConfig = {
  name: "Shahraj",

  openingLines: [
    "I made something for you…",
    "But first…"
  ],

  revealLines: [
    "Today is not just another day.",
    "Because someone amazing was born today."
  ],

  letterMessage:
`Dearest Shahraj,

I wanted today to feel like more than just another date on the calendar —
because you deserve a little more than that.

Thank you for the way you show up for the people you love,
for your laugh that makes rooms feel warmer,
and for being exactly, unapologetically yourself.

I hope this next year hands you everything you've been quietly hoping for.

Happy birthday.`,

  letterSign: "— with love",

  memories: [
    { date: "One to remember", caption: "That afternoon we couldn't stop laughing.", image: "" },
    { date: "A quiet favorite", caption: "The trip we still talk about.", image: "" },
    { date: "Small but big", caption: "The day everything just clicked.", image: "" },
    { date: "Unexpected", caption: "The one nobody saw coming.", image: "" },
    { date: "Just us", caption: "An ordinary evening that wasn't.", image: "" }
    // 👉 Add as many memories as you like: { date, caption, image: "assets/photos/yourphoto.jpg" }
    // Leave image empty ("") to keep the elegant placeholder.
  ],

  giftMessage: "You deserve more happiness than you realize.",

  finaleMessage:
    "May this year bring you more reasons to smile, more moments to remember, and everything you've been wishing for.",

  music: "assets/music/the_mountain-birthday.mp3", // 👉 point this at your own audio file

  secretMessage: "Psst — this whole thing took a while to build, because you're worth it.",

  holdSurpriseMessage: "Okay okay, you found the second secret. Happy birthday, truly."
};

/* ============================================================
   2. SETUP
   ============================================================ */
gsap.registerPlugin(ScrollTrigger);

const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (prefersReduced) document.body.classList.add('reduce-motion');

document.getElementById('nameDisplay').textContent = birthdayConfig.name;
document.getElementById('finaleTitle').textContent = `HAPPY BIRTHDAY, ${birthdayConfig.name.toUpperCase()} 🎂`;
document.getElementById('finaleSub').textContent = birthdayConfig.finaleMessage;
document.getElementById('introLine1').textContent = birthdayConfig.openingLines[0];
document.getElementById('introLine2').textContent = birthdayConfig.openingLines[1];
document.getElementById('rl1').textContent = birthdayConfig.revealLines[0];
document.getElementById('rl2').textContent = birthdayConfig.revealLines[1];

/* ============================================================
   3. CUSTOM CURSOR
   ============================================================ */
const cursorDot = document.getElementById('cursorDot');
const cursorRing = document.getElementById('cursorRing');
let mouseX = innerWidth/2, mouseY = innerHeight/2;
let ringX = mouseX, ringY = mouseY;

window.addEventListener('mousemove', e=>{
  mouseX = e.clientX; mouseY = e.clientY;
  cursorDot.style.transform = `translate(${mouseX}px,${mouseY}px) translate(-50%,-50%)`;
});
function animateRing(){
  ringX += (mouseX-ringX)*0.16;
  ringY += (mouseY-ringY)*0.16;
  cursorRing.style.transform = `translate(${ringX}px,${ringY}px) translate(-50%,-50%)`;
  requestAnimationFrame(animateRing);
}
animateRing();

document.querySelectorAll('button, .card, .gift-box, .memory-card, a').forEach(el=>{
  el.addEventListener('mouseenter', ()=> cursorRing.classList.add('hover'));
  el.addEventListener('mouseleave', ()=> cursorRing.classList.remove('hover'));
});

/* ============================================================
   4. AMBIENT BACKGROUND PARTICLES (subtle floating dust)
   ============================================================ */
const bgCanvas = document.getElementById('bg-canvas');
const bgCtx = bgCanvas.getContext('2d');
let bgParticles = [];

function resizeBg(){
  bgCanvas.width = innerWidth;
  bgCanvas.height = innerHeight;
}
function makeBgParticles(){
  const count = innerWidth < 700 ? 26 : 55;
  bgParticles = Array.from({length:count}, ()=>({
    x: Math.random()*innerWidth,
    y: Math.random()*innerHeight,
    r: Math.random()*1.6+.3,
    vy: Math.random()*.15+.03,
    vx: (Math.random()-.5)*.06,
    o: Math.random()*.35+.05
  }));
}
resizeBg(); makeBgParticles();
window.addEventListener('resize', ()=>{ resizeBg(); makeBgParticles(); });

function drawBg(){
  bgCtx.clearRect(0,0,bgCanvas.width,bgCanvas.height);
  bgCtx.fillStyle = '#c9a568';
  bgParticles.forEach(p=>{
    p.y -= p.vy; p.x += p.vx;
    if (p.y < -10){ p.y = bgCanvas.height+10; p.x = Math.random()*bgCanvas.width; }
    bgCtx.globalAlpha = p.o;
    bgCtx.beginPath();
    bgCtx.arc(p.x,p.y,p.r,0,Math.PI*2);
    bgCtx.fill();
  });
  bgCtx.globalAlpha = 1;
  if (!prefersReduced) requestAnimationFrame(drawBg);
}
drawBg();

/* ============================================================
   5. INTRO SEQUENCE
   ============================================================ */
const introTl = gsap.timeline({ delay:.4 });
introTl
  .to('#introSpark', { opacity:1, scale:1.6, duration:1.2, ease:'power2.out' })
  .to('#introLine1', { opacity:1, y:0, duration:1.1, ease:'power2.out' }, '-=.3')
  .to('#introLine1', { opacity:0, duration:.8, delay:1.4 })
  .to('#introLine2', { opacity:1, duration:1.1, ease:'power2.out' }, '-=.2')
  .to('#openBtn', { opacity:1, duration:1, ease:'power2.out' }, '-=.3');

document.getElementById('openBtn').addEventListener('click', openSurprise);

function openSurprise(){
  const tl = gsap.timeline();
  tl.to('#intro', {
      opacity:0, filter:'blur(18px)', scale:1.06, duration:1.3, ease:'power2.inOut',
      onComplete(){ document.getElementById('intro').style.display='none'; }
    })
    .call(runReveal);
}

/* ============================================================
   6. BIRTHDAY REVEAL
   ============================================================ */
function runReveal(){
  const tl = gsap.timeline({ delay:.2 });
  tl.to('#rl1', { opacity:1, y:0, filter:'blur(0px)', duration:1, ease:'power2.out' })
    .to('#rl1', { opacity:0, duration:.7, delay:1.1 })
    .to('#rl2', { opacity:1, duration:1, ease:'power2.out' }, '-=.1')
    .to('#rl2', { opacity:0, duration:.7, delay:1.1 })
    .to('#revealTitle', { opacity:1, duration:1.4, ease:'power2.out' }, '-=.1')
    .fromTo('#revealTitle h1',
        { letterSpacing:'.4em', filter:'blur(14px)' },
        { letterSpacing:'-.01em', filter:'blur(0px)', duration:1.6, ease:'power3.out' }, '-=1.2')
    .call(burstConfetti)
    .to('#revealHint', { opacity:1, duration:1 }, '-=.4');
}

/* small confetti burst on reveal, drawn on bg-canvas momentarily */
function burstConfetti(){
  const burst = Array.from({length:60}, ()=>({
    x: innerWidth/2, y: innerHeight*0.45,
    vx:(Math.random()-.5)*6, vy:(Math.random()-1.4)*6,
    r:Math.random()*2+1, life:1,
    color: Math.random()>.5 ? '#c9a568' : '#f2ece0'
  }));
  function step(){
    bgCtx.save();
    burst.forEach(p=>{
      p.x+=p.vx; p.y+=p.vy; p.vy+=0.05; p.life-=0.012;
      bgCtx.globalAlpha = Math.max(p.life,0)*.9;
      bgCtx.fillStyle = p.color;
      bgCtx.beginPath(); bgCtx.arc(p.x,p.y,p.r,0,Math.PI*2); bgCtx.fill();
    });
    bgCtx.restore();
    if (burst.some(p=>p.life>0) && !prefersReduced) requestAnimationFrame(step);
  }
  if (!prefersReduced) step();
}

/* ============================================================
   7. LETTER CARD
   ============================================================ */
document.getElementById('letterBody').textContent = ''; // filled on open (typewriter)
const cardEl = document.getElementById('card');
let letterTyped = false;

cardEl.addEventListener('click', ()=>{
  cardEl.classList.toggle('open');
  if (cardEl.classList.contains('open') && !letterTyped){
    letterTyped = true;
    setTimeout(typeLetter, 650);
  }
});

function typeLetter(){
  const target = document.getElementById('letterBody');
  const full = birthdayConfig.letterMessage + '\n\n' + birthdayConfig.letterSign;
  let i = 0;
  target.classList.add('cursor-typed');
  const speed = prefersReduced ? 0 : 14;
  function tick(){
    target.textContent = full.slice(0, i);
    i++;
    if (i <= full.length){
      setTimeout(tick, speed);
    } else {
      target.classList.remove('cursor-typed');
    }
  }
  if (prefersReduced){ target.textContent = full; }
  else tick();
}

/* ============================================================
   8. MEMORIES TRACK
   ============================================================ */
const track = document.getElementById('memoryTrack');
birthdayConfig.memories.forEach((m, idx)=>{
  const card = document.createElement('div');
  card.className = 'memory-card';
  card.innerHTML = `
    <div class="memory-photo">
      ${ m.image ? `<img src="${m.image}" alt="${m.caption}">` : `Photo ${idx+1}<br>replace me` }
    </div>
    <div class="memory-meta">
      <div class="memory-date">${m.date}</div>
      <div class="memory-caption">${m.caption}</div>
    </div>`;
  track.appendChild(card);
});

gsap.utils.toArray('.memory-card').forEach((card, i)=>{
  gsap.fromTo(card, { opacity:0, y:30 }, {
    opacity:1, y:0, duration:.9, ease:'power2.out',
    scrollTrigger: { trigger: card, start:'top 90%', containerAnimation: null }
  });
});

/* ============================================================
   9. SCROLL REVEALS (generic, for section headers)
   ============================================================ */
['#memories .memories-title', '#memories .memories-sub', '#memories .eyebrow',
 '#letter .letter-intro', '#gift .gift-lead'].forEach(sel=>{
  gsap.fromTo(sel, { opacity:0, y:26 }, {
    opacity:1, y:0, duration:1, ease:'power2.out',
    scrollTrigger:{ trigger: sel, start:'top 85%' }
  });
});

/* ============================================================
   10. GIFT BOX
   ============================================================ */
const giftWrap = document.getElementById('giftWrap');
const giftBox = document.getElementById('giftBox');
let giftOpened = false;

giftBox.addEventListener('click', ()=>{
  if (giftOpened) return;
  giftOpened = true;
  giftWrap.classList.add('opened');
  document.getElementById('giftHint').style.opacity = 0;
  giftParticleBurst();
  setTimeout(()=>{
    gsap.to('#giftMessage', { opacity:1, duration:1.2, ease:'power2.out' });
    document.getElementById('giftMessage').textContent = birthdayConfig.giftMessage;
  }, 600);
});

function giftParticleBurst(){
  if (prefersReduced) return;
  const rect = giftBox.getBoundingClientRect();
  const cx = rect.left + rect.width/2;
  const cy = rect.top + rect.height*0.35;
  const particles = Array.from({length:70}, ()=>({
    x:cx, y:cy,
    vx:(Math.random()-.5)*7,
    vy:(Math.random()*-6)-1,
    r:Math.random()*2.4+1,
    life:1,
    color: Math.random()>.4 ? '#e8b978' : '#f2ece0'
  }));
  function step(){
    bgCtx.save();
    particles.forEach(p=>{
      p.x+=p.vx; p.y+=p.vy; p.vy+=0.14; p.life-=0.011;
      bgCtx.globalAlpha = Math.max(p.life,0);
      bgCtx.fillStyle = p.color;
      bgCtx.shadowColor = p.color; bgCtx.shadowBlur = 8;
      bgCtx.beginPath(); bgCtx.arc(p.x,p.y,p.r,0,Math.PI*2); bgCtx.fill();
    });
    bgCtx.restore();
    if (particles.some(p=>p.life>0)) requestAnimationFrame(step);
  }
  step();
}

/* ============================================================
   11. FINALE FIREWORKS
   ============================================================ */
const fxCanvas = document.getElementById('fx-canvas');
const fxCtx = fxCanvas.getContext('2d');
let fxRunning = false;
let fireworks = [];

function resizeFx(){
  const finale = document.getElementById('finale');
  fxCanvas.width = finale.clientWidth;
  fxCanvas.height = finale.clientHeight;
}
resizeFx();
window.addEventListener('resize', resizeFx);

function spawnFirework(){
  const x = Math.random()*fxCanvas.width*0.7 + fxCanvas.width*0.15;
  const y = Math.random()*fxCanvas.height*0.5 + fxCanvas.height*0.1;
  const colors = ['#c9a568','#e8b978','#f2ece0'];
  const color = colors[Math.floor(Math.random()*colors.length)];
  const count = 34;
  const parts = Array.from({length:count}, (_,i)=>{
    const angle = (Math.PI*2*i)/count;
    const speed = Math.random()*2.2+1.2;
    return { x, y, vx:Math.cos(angle)*speed, vy:Math.sin(angle)*speed, life:1, color };
  });
  fireworks.push(parts);
}

function fxLoop(){
  fxCtx.clearRect(0,0,fxCanvas.width,fxCanvas.height);
  fireworks.forEach(parts=>{
    parts.forEach(p=>{
      p.x+=p.vx; p.y+=p.vy; p.vy+=0.02; p.life-=0.012;
      fxCtx.globalAlpha = Math.max(p.life,0);
      fxCtx.fillStyle = p.color;
      fxCtx.shadowColor = p.color; fxCtx.shadowBlur = 10;
      fxCtx.beginPath(); fxCtx.arc(p.x,p.y,1.8,0,Math.PI*2); fxCtx.fill();
    });
  });
  fxCtx.globalAlpha = 1;
  fireworks = fireworks.filter(parts=> parts.some(p=>p.life>0));
  if (fxRunning) requestAnimationFrame(fxLoop);
}

let fxInterval;
const finaleTrigger = ScrollTrigger.create({
  trigger:'#finale', start:'top 60%',
  onEnter(){
    if (fxRunning || prefersReduced) return;
    fxRunning = true;
    resizeFx();
    fxLoop();
    spawnFirework();
    fxInterval = setInterval(spawnFirework, 900);
  }
});

/* ============================================================
   12. MUSIC TOGGLE
   ============================================================ */
const audioEl = document.getElementById('bgAudio');
audioEl.src = birthdayConfig.music;
const musicBtn = document.getElementById('music-btn');
let playing = false;

musicBtn.addEventListener('click', ()=>{
  if (!playing){
    audioEl.play().then(()=>{
      playing = true;
      musicBtn.classList.add('playing');
      musicBtn.querySelector('span').textContent = '♪';
    }).catch(()=>{
      musicBtn.querySelector('span').textContent = '⚠';
      setTimeout(()=> musicBtn.querySelector('span').textContent = '♫', 1400);
    });
  } else {
    audioEl.pause();
    playing = false;
    musicBtn.classList.remove('playing');
    musicBtn.querySelector('span').textContent = '♫';
  }
});

/* ============================================================
   13. EASTER EGGS
   ============================================================ */
function showToast(message, duration=4200){
  const toast = document.getElementById('secretToast');
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(showToast._t);
  showToast._t = setTimeout(()=> toast.classList.remove('show'), duration);
}

/* 13a — tiny star reveals a secret message */
document.getElementById('starEgg').addEventListener('click', (e)=>{
  e.stopPropagation();
  showToast(birthdayConfig.secretMessage);
});

/* 13b — hold the open button for a few seconds */
let holdTimer = null;
const openBtn = document.getElementById('openBtn');
openBtn.addEventListener('mousedown', startHold);
openBtn.addEventListener('touchstart', startHold, { passive:true });
openBtn.addEventListener('mouseup', cancelHold);
openBtn.addEventListener('mouseleave', cancelHold);
openBtn.addEventListener('touchend', cancelHold);
function startHold(){
  holdTimer = setTimeout(()=>{
    showToast(birthdayConfig.holdSurpriseMessage);
  }, 2600);
}
function cancelHold(){ clearTimeout(holdTimer); }

/* 13c — konami-style sequence unlocks an extra flourish */
const konamiSeq = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight'];
let konamiPos = 0;
window.addEventListener('keydown', (e)=>{
  if (e.key === konamiSeq[konamiPos]){
    konamiPos++;
    if (konamiPos === konamiSeq.length){
      konamiPos = 0;
      triggerKonami();
    }
  } else {
    konamiPos = (e.key === konamiSeq[0]) ? 1 : 0;
  }
});
function triggerKonami(){
  const flash = document.getElementById('konamiFlash');
  gsap.fromTo(flash, { opacity:0 }, { opacity:1, duration:.4, yoyo:true, repeat:1, ease:'power2.out' });
  showToast('You found the hidden sequence. Extra confetti, on the house.', 3600);
  if (!prefersReduced){
    for (let i=0;i<3;i++) setTimeout(burstConfetti, i*220);
  }
}

/* ============================================================
   14. RESIZE HANDLING
   ============================================================ */
window.addEventListener('resize', ()=> ScrollTrigger.refresh());

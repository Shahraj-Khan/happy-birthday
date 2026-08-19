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
    // Add as many memories as you like: { date, caption, image: "assets/photos/yourphoto.jpg" }
    // Leave image empty ("") to keep the elegant placeholder.
  ],

  giftMessage: "You deserve more happiness than you realize.",

  finaleMessage:
    "May this year bring you more reasons to smile, more moments to remember, and everything you've been wishing for.",

  music: "assets/music/the_mountain-birthday.mp3",

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
document.getElementById('finaleSub').textContent = birthdayConfig.finaleMessage;
document.getElementById('introLine1').textContent = birthdayConfig.openingLines[0];
document.getElementById('introLine2').textContent = birthdayConfig.openingLines[1];
document.getElementById('rl1').textContent = birthdayConfig.revealLines[0];
document.getElementById('rl2').textContent = birthdayConfig.revealLines[1];

/* split finale title into chars */
(function splitFinaleTitle(){
  const el = document.getElementById('finaleTitle');
  const text = `HAPPY BIRTHDAY, ${birthdayConfig.name.toUpperCase()} 🎂`;
  el.textContent = '';
  text.split('').forEach(ch => {
    const span = document.createElement('span');
    span.className = 'char';
    span.textContent = ch === ' ' ? '\u00A0' : ch;
    el.appendChild(span);
  });
})();

/* split word-reveal helper */
function splitIntoWords(selector){
  const el = document.querySelector(selector);
  if (!el) return;
  const text = el.textContent;
  el.textContent = '';
  text.split(/(\s+)/).forEach(part => {
    if (/^\s+$/.test(part)){
      el.appendChild(document.createTextNode(' '));
    } else {
      const span = document.createElement('span');
      span.className = 'word';
      span.textContent = part;
      el.appendChild(span);
    }
  });
}
splitIntoWords('.letter-intro');
splitIntoWords('.memories-title');

/* ============================================================
   3. CUSTOM CURSOR (enhanced with click feedback + glow follow)
   ============================================================ */
const cursorDot = document.getElementById('cursorDot');
const cursorRing = document.getElementById('cursorRing');
const mouseGlow = document.getElementById('mouseGlow');
let mouseX = innerWidth/2, mouseY = innerHeight/2;
let ringX = mouseX, ringY = mouseY;
let glowX = mouseX, glowY = mouseY;

window.addEventListener('mousemove', e => {
  mouseX = e.clientX; mouseY = e.clientY;
  cursorDot.style.transform = `translate(${mouseX}px,${mouseY}px) translate(-50%,-50%)`;
});
window.addEventListener('mousedown', () => cursorRing.classList.add('clicking'));
window.addEventListener('mouseup', () => cursorRing.classList.remove('clicking'));

function animateCursor(){
  ringX += (mouseX - ringX) * 0.14;
  ringY += (mouseY - ringY) * 0.14;
  cursorRing.style.transform = `translate(${ringX}px,${ringY}px) translate(-50%,-50%)`;

  glowX += (mouseX - glowX) * 0.06;
  glowY += (mouseY - glowY) * 0.06;
  mouseGlow.style.transform = `translate(${glowX}px,${glowY}px) translate(-50%,-50%)`;

  requestAnimationFrame(animateCursor);
}
animateCursor();

document.querySelectorAll('button, .card, .gift-box, .memory-card, a').forEach(el => {
  el.addEventListener('mouseenter', () => cursorRing.classList.add('hover'));
  el.addEventListener('mouseleave', () => cursorRing.classList.remove('hover'));
});

/* ============================================================
   4. AMBIENT BACKGROUND PARTICLES (layered depth)
   ============================================================ */
const bgCanvas = document.getElementById('bg-canvas');
const bgCtx = bgCanvas.getContext('2d');
let bgParticles = [];

function resizeBg(){
  bgCanvas.width = innerWidth;
  bgCanvas.height = innerHeight;
}
function makeBgParticles(){
  const count = innerWidth < 700 ? 30 : 65;
  bgParticles = Array.from({length:count}, () => {
    const depth = Math.random();
    return {
      x: Math.random()*innerWidth,
      y: Math.random()*innerHeight,
      r: depth * 1.8 + .2,
      vy: depth * .18 + .02,
      vx: (Math.random()-.5) * .08,
      o: depth * .3 + .04,
      depth,
      baseX: 0
    };
  });
}
resizeBg(); makeBgParticles();
window.addEventListener('resize', () => { resizeBg(); makeBgParticles(); });

function drawBg(){
  bgCtx.clearRect(0, 0, bgCanvas.width, bgCanvas.height);
  const cx = mouseX / innerWidth - .5;
  const cy = mouseY / innerHeight - .5;
  bgParticles.forEach(p => {
    p.y -= p.vy;
    p.x += p.vx + cx * p.depth * .3;
    if (p.y < -10){ p.y = bgCanvas.height + 10; p.x = Math.random() * bgCanvas.width; }
    if (p.x < -10) p.x = bgCanvas.width + 10;
    if (p.x > bgCanvas.width + 10) p.x = -10;

    bgCtx.globalAlpha = p.o;
    bgCtx.fillStyle = p.depth > .6 ? '#e8b978' : '#c9a568';
    bgCtx.beginPath();
    bgCtx.arc(p.x, p.y, p.r, 0, Math.PI*2);
    bgCtx.fill();

    if (p.depth > .7){
      bgCtx.globalAlpha = p.o * .3;
      bgCtx.shadowColor = '#c9a568';
      bgCtx.shadowBlur = 6;
      bgCtx.beginPath();
      bgCtx.arc(p.x, p.y, p.r * 2, 0, Math.PI*2);
      bgCtx.fill();
      bgCtx.shadowBlur = 0;
    }
  });
  bgCtx.globalAlpha = 1;
  if (!prefersReduced) requestAnimationFrame(drawBg);
}
drawBg();

/* ============================================================
   5. INTRO SEQUENCE
   ============================================================ */
const introTl = gsap.timeline({ delay:.5 });
introTl
  .to('#introSpark', { opacity:1, scale:2, duration:1.4, ease:'power2.out' })
  .to('#introSpark', { boxShadow:'0 0 30px 12px rgba(201,165,104,.25), 0 0 80px 30px rgba(201,165,104,.08)', duration:1, ease:'power2.out' }, '-=.8')
  .to('#introLine1', { opacity:1, y:0, duration:1.2, ease:'power2.out' }, '-=.4')
  .to('#introLine1', { opacity:0, y:-10, filter:'blur(4px)', duration:.9, delay:1.6 })
  .to('#introLine2', { opacity:1, duration:1.2, ease:'power2.out' }, '-=.3')
  .to('#openBtn', { opacity:1, duration:1, ease:'power2.out' }, '-=.4');

/* magnetic button effect */
const openBtn = document.getElementById('openBtn');
if (!prefersReduced && window.matchMedia('(hover:hover)').matches){
  openBtn.addEventListener('mousemove', e => {
    const rect = openBtn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width/2;
    const y = e.clientY - rect.top - rect.height/2;
    openBtn.style.transform = `translate(${x*.25}px, ${y*.25}px)`;
  });
  openBtn.addEventListener('mouseleave', () => {
    openBtn.style.transform = '';
  });
}

openBtn.addEventListener('click', openSurprise);

function openSurprise(){
  const tl = gsap.timeline();
  tl.to('#intro', {
      opacity:0, filter:'blur(22px)', scale:1.08, duration:1.5, ease:'power3.inOut',
      onComplete(){ document.getElementById('intro').style.display = 'none'; }
    })
    .call(runReveal);
}

/* ============================================================
   6. BIRTHDAY REVEAL (enhanced with scale, blur, depth)
   ============================================================ */
function runReveal(){
  const tl = gsap.timeline({ delay:.3 });
  tl.to('#rl1', { opacity:1, y:0, filter:'blur(0px)', duration:1.2, ease:'power2.out' })
    .to('#rl1', { opacity:0, y:-8, filter:'blur(6px)', duration:.8, delay:1.2 })
    .to('#rl2', { opacity:1, filter:'blur(0px)', duration:1.2, ease:'power2.out' }, '-=.2')
    .to('#rl2', { opacity:0, y:-8, filter:'blur(6px)', duration:.8, delay:1.2 })
    .to('#revealTitle', { opacity:1, duration:1.6, ease:'power2.out' }, '-=.2')
    .fromTo('#revealTitle h1',
        { letterSpacing:'.5em', filter:'blur(16px)', scale:.9, opacity:0 },
        { letterSpacing:'-.01em', filter:'blur(0px)', scale:1, opacity:1, duration:1.8, ease:'power3.out' }, '-=1.4')
    .fromTo('.kicker',
        { letterSpacing:'.8em', opacity:0 },
        { letterSpacing:'.42em', opacity:1, duration:1.2, ease:'power2.out' }, '-=1.6')
    .call(burstConfetti)
    .to('#revealHint', { opacity:1, duration:1 }, '-=.4');
}

/* confetti burst with varied shapes and glow */
function burstConfetti(){
  if (prefersReduced) return;
  const colors = ['#c9a568','#e8b978','#f2ece0','#d4b87a'];
  const burst = Array.from({length:80}, () => ({
    x: innerWidth/2, y: innerHeight*0.42,
    vx: (Math.random()-.5)*8, vy: (Math.random()-1.5)*7,
    r: Math.random()*2.5+.8, life:1, decay: Math.random()*.008+.008,
    color: colors[Math.floor(Math.random()*colors.length)],
    rot: Math.random()*360, rotV: (Math.random()-.5)*8,
    type: Math.random() > .6 ? 'rect' : 'circle'
  }));
  function step(){
    bgCtx.save();
    burst.forEach(p => {
      p.x += p.vx; p.y += p.vy; p.vy += 0.06;
      p.life -= p.decay; p.rot += p.rotV;
      if (p.life <= 0) return;
      bgCtx.globalAlpha = p.life * .85;
      bgCtx.fillStyle = p.color;
      bgCtx.save();
      bgCtx.translate(p.x, p.y);
      bgCtx.rotate(p.rot * Math.PI/180);
      if (p.type === 'rect'){
        bgCtx.fillRect(-p.r, -p.r*.4, p.r*2, p.r*.8);
      } else {
        bgCtx.beginPath(); bgCtx.arc(0,0,p.r,0,Math.PI*2); bgCtx.fill();
      }
      bgCtx.restore();
    });
    bgCtx.restore();
    if (burst.some(p => p.life > 0)) requestAnimationFrame(step);
  }
  step();
}

/* ============================================================
   7. SCROLL-BASED SECTION REVEALS (word-by-word, parallax)
   ============================================================ */

/* word-by-word reveal for letter intro */
ScrollTrigger.create({
  trigger: '#letter',
  start: 'top 80%',
  onEnter(){
    document.querySelectorAll('.letter-intro .word').forEach((w, i) => {
      setTimeout(() => w.classList.add('visible'), i * 80);
    });
  }
});

/* word-by-word reveal for memories title */
ScrollTrigger.create({
  trigger: '#memories',
  start: 'top 80%',
  onEnter(){
    document.querySelectorAll('.memories-title .word').forEach((w, i) => {
      setTimeout(() => w.classList.add('visible'), i * 70);
    });
    gsap.to('.memories-sub', { opacity:1, y:0, duration:1, delay:.4, ease:'power2.out' });
  }
});

/* parallax section lines */
document.querySelectorAll('.section-line').forEach(line => {
  gsap.fromTo(line, { scaleY:0, opacity:0 }, {
    scaleY:1, opacity:1, duration:1.2, ease:'power2.out',
    scrollTrigger: { trigger:line, start:'top 90%' }
  });
});

/* gift lead text */
gsap.fromTo('#gift .gift-lead', { opacity:0, y:26 }, {
  opacity:1, y:0, duration:1, ease:'power2.out',
  scrollTrigger:{ trigger:'#gift .gift-lead', start:'top 85%' }
});

/* eyebrow */
gsap.fromTo('#memories .eyebrow', { opacity:0, y:16 }, {
  opacity:1, y:0, duration:.8, ease:'power2.out',
  scrollTrigger:{ trigger:'#memories .eyebrow', start:'top 85%' }
});

/* ============================================================
   8. LETTER CARD (enhanced 3D tilt, particles, typewriter)
   ============================================================ */
document.getElementById('letterBody').textContent = '';
const cardEl = document.getElementById('card');
let letterTyped = false;

/* perspective tilt on hover (desktop only) */
if (window.matchMedia('(hover:hover)').matches && !prefersReduced){
  cardEl.addEventListener('mousemove', e => {
    if (cardEl.classList.contains('open')) return;
    const rect = cardEl.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - .5;
    const y = (e.clientY - rect.top) / rect.height - .5;
    cardEl.style.transform = `rotateY(${x * 12}deg) rotateX(${-y * 8}deg)`;
  });
  cardEl.addEventListener('mouseleave', () => {
    if (!cardEl.classList.contains('open')){
      gsap.to(cardEl, { rotateY:0, rotateX:0, duration:.6, ease:'power2.out', clearProps:'transform' });
    }
  });
}

cardEl.addEventListener('click', () => {
  cardEl.classList.toggle('open');
  if (cardEl.classList.contains('open')){
    cardEl.style.transform = '';
    if (!letterTyped){
      letterTyped = true;
      setTimeout(typeLetter, 700);
      spawnLetterParticles();
    }
  }
});

function typeLetter(){
  const target = document.getElementById('letterBody');
  const full = birthdayConfig.letterMessage + '\n\n' + birthdayConfig.letterSign;
  let i = 0;
  target.classList.add('cursor-typed');
  const speed = prefersReduced ? 0 : 16;
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

/* letter opening particle effect */
function spawnLetterParticles(){
  if (prefersReduced) return;
  const canvas = document.getElementById('letter-particles');
  const section = document.getElementById('letter');
  canvas.width = section.clientWidth;
  canvas.height = section.clientHeight;
  const ctx = canvas.getContext('2d');
  const cx = canvas.width/2, cy = canvas.height/2;
  const particles = Array.from({length:40}, () => ({
    x: cx, y: cy,
    vx: (Math.random()-.5)*3, vy: (Math.random()-.5)*3,
    r: Math.random()*1.5+.4, life:1,
    color: Math.random() > .5 ? 'rgba(201,165,104,' : 'rgba(242,236,224,'
  }));
  function step(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    let alive = false;
    particles.forEach(p => {
      p.x += p.vx; p.y += p.vy; p.life -= .01;
      if (p.life <= 0) return;
      alive = true;
      ctx.globalAlpha = p.life * .6;
      ctx.fillStyle = p.color + (p.life * .6).toFixed(2) + ')';
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI*2); ctx.fill();
    });
    ctx.globalAlpha = 1;
    if (alive) requestAnimationFrame(step);
  }
  step();
}

/* ============================================================
   9. MEMORIES TRACK (stagger entrance, parallax depth)
   ============================================================ */
const track = document.getElementById('memoryTrack');
birthdayConfig.memories.forEach((m, idx) => {
  const card = document.createElement('div');
  card.className = 'memory-card';
  card.style.transitionDelay = `${idx * .08}s`;
  card.innerHTML = `
    <div class="memory-photo">
      ${ m.image ? `<img src="${m.image}" alt="${m.caption}" loading="lazy">` : `Photo ${idx+1}<br>replace me` }
    </div>
    <div class="memory-meta">
      <div class="memory-date">${m.date}</div>
      <div class="memory-caption">${m.caption}</div>
    </div>`;
  track.appendChild(card);
});

/* stagger reveal memory cards */
ScrollTrigger.create({
  trigger: '#memories',
  start: 'top 70%',
  onEnter(){
    document.querySelectorAll('.memory-card').forEach((card, i) => {
      setTimeout(() => card.classList.add('visible'), i * 120);
    });
  }
});

/* subtle parallax tilt on memory cards (desktop) */
if (window.matchMedia('(hover:hover)').matches && !prefersReduced){
  document.querySelectorAll('.memory-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - .5;
      const y = (e.clientY - rect.top) / rect.height - .5;
      card.style.transform = `translateY(-14px) scale(1.04) rotateY(${x*8}deg) rotateX(${-y*6}deg)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}

/* ============================================================
   10. GIFT BOX (cinematic opening)
   ============================================================ */
const giftWrap = document.getElementById('giftWrap');
const giftBox = document.getElementById('giftBox');
let giftOpened = false;

gsap.fromTo('#giftWrap', { opacity:0, y:40, scale:.92 }, {
  opacity:1, y:0, scale:1, duration:1.2, ease:'power2.out',
  scrollTrigger:{ trigger:'#gift', start:'top 70%' }
});
gsap.fromTo('#giftHint', { opacity:0 }, {
  opacity:1, duration:.8, delay:.6,
  scrollTrigger:{ trigger:'#gift', start:'top 70%' }
});

giftBox.addEventListener('click', () => {
  if (giftOpened) return;
  giftOpened = true;

  /* cinematic shake before opening */
  const shakeTl = gsap.timeline();
  shakeTl
    .to(giftBox, { x:3, duration:.06, ease:'none' })
    .to(giftBox, { x:-3, duration:.06, ease:'none' })
    .to(giftBox, { x:4, duration:.05, ease:'none' })
    .to(giftBox, { x:-4, duration:.05, ease:'none' })
    .to(giftBox, { x:2, duration:.05, ease:'none' })
    .to(giftBox, { x:0, duration:.04, ease:'none' })
    .call(() => {
      giftWrap.classList.add('opened');
      document.getElementById('giftHint').style.opacity = 0;
      giftParticleBurst();

      /* slight zoom on the section for cinematic feel */
      gsap.to('#gift', { scale:1.02, duration:1, ease:'power2.out' });
      gsap.to('#gift', { scale:1, duration:1.5, delay:1, ease:'power2.out' });

      setTimeout(() => {
        const msg = document.getElementById('giftMessage');
        msg.textContent = birthdayConfig.giftMessage;
        gsap.fromTo(msg, { opacity:0, y:20, filter:'blur(6px)' },
          { opacity:1, y:0, filter:'blur(0px)', duration:1.4, ease:'power2.out' });
      }, 700);
    });
});

function giftParticleBurst(){
  if (prefersReduced) return;
  const rect = giftBox.getBoundingClientRect();
  const cx = rect.left + rect.width/2;
  const cy = rect.top + rect.height*0.3;
  const colors = ['#e8b978','#f2ece0','#c9a568','#d4b87a'];
  const particles = Array.from({length:90}, () => ({
    x:cx, y:cy,
    vx:(Math.random()-.5)*9,
    vy:(Math.random()*-7)-2,
    r:Math.random()*2.6+.8,
    life:1, decay:Math.random()*.008+.006,
    color: colors[Math.floor(Math.random()*colors.length)],
    glow: Math.random() > .6
  }));

  /* ring burst */
  const rings = Array.from({length:3}, (_, i) => ({
    x:cx, y:cy, r:0, maxR:80+i*50,
    life:1, speed:2+i*.8
  }));

  function step(){
    bgCtx.save();
    /* expanding rings */
    rings.forEach(ring => {
      ring.r += ring.speed;
      ring.life -= .015;
      if (ring.life <= 0) return;
      bgCtx.globalAlpha = ring.life * .2;
      bgCtx.strokeStyle = '#c9a568';
      bgCtx.lineWidth = 1;
      bgCtx.beginPath();
      bgCtx.arc(ring.x, ring.y, ring.r, 0, Math.PI*2);
      bgCtx.stroke();
    });

    particles.forEach(p => {
      p.x += p.vx; p.y += p.vy; p.vy += 0.12; p.life -= p.decay;
      p.vx *= .99;
      if (p.life <= 0) return;
      bgCtx.globalAlpha = p.life;
      bgCtx.fillStyle = p.color;
      if (p.glow){
        bgCtx.shadowColor = p.color;
        bgCtx.shadowBlur = 10;
      }
      bgCtx.beginPath(); bgCtx.arc(p.x,p.y,p.r,0,Math.PI*2); bgCtx.fill();
      bgCtx.shadowBlur = 0;
    });
    bgCtx.restore();
    if (particles.some(p => p.life > 0) || rings.some(r => r.life > 0))
      requestAnimationFrame(step);
  }
  step();
}

/* ============================================================
   11. FINALE — fireworks + character reveal + ambient glow
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
  const y = Math.random()*fxCanvas.height*0.45 + fxCanvas.height*0.08;
  const colors = ['#c9a568','#e8b978','#f2ece0','#d4b87a'];
  const color = colors[Math.floor(Math.random()*colors.length)];
  const count = 40 + Math.floor(Math.random()*20);
  const parts = Array.from({length:count}, (_, i) => {
    const angle = (Math.PI*2*i)/count + (Math.random()-.5)*.3;
    const speed = Math.random()*2.8+1;
    return { x, y, vx:Math.cos(angle)*speed, vy:Math.sin(angle)*speed,
             life:1, decay:Math.random()*.008+.008, color, r:Math.random()*1.2+.8 };
  });
  fireworks.push(parts);
}

/* trailing sparks for firework launch */
function spawnRocket(){
  const startX = Math.random()*fxCanvas.width*0.6 + fxCanvas.width*0.2;
  const targetY = Math.random()*fxCanvas.height*0.4 + fxCanvas.height*0.08;
  const rocket = { x:startX, y:fxCanvas.height, targetY, vy:-6, trail:[] };

  function rStep(){
    rocket.y += rocket.vy;
    rocket.trail.push({ x:rocket.x+(Math.random()-.5)*2, y:rocket.y, life:1 });
    if (rocket.trail.length > 12) rocket.trail.shift();

    fxCtx.save();
    rocket.trail.forEach(t => {
      t.life -= .08;
      if (t.life <= 0) return;
      fxCtx.globalAlpha = t.life * .4;
      fxCtx.fillStyle = '#e8b978';
      fxCtx.beginPath(); fxCtx.arc(t.x,t.y,1,0,Math.PI*2); fxCtx.fill();
    });
    fxCtx.restore();

    if (rocket.y <= rocket.targetY){
      const colors = ['#c9a568','#e8b978','#f2ece0'];
      const color = colors[Math.floor(Math.random()*colors.length)];
      const count = 45;
      const parts = Array.from({length:count}, (_, i) => {
        const angle = (Math.PI*2*i)/count;
        const speed = Math.random()*3+1.2;
        return { x:rocket.x, y:rocket.y, vx:Math.cos(angle)*speed, vy:Math.sin(angle)*speed,
                 life:1, decay:Math.random()*.007+.007, color, r:Math.random()*1.4+.6 };
      });
      fireworks.push(parts);
    } else if (fxRunning){
      requestAnimationFrame(rStep);
    }
  }
  if (!prefersReduced) rStep();
}

function fxLoop(){
  fxCtx.clearRect(0,0,fxCanvas.width,fxCanvas.height);
  fireworks.forEach(parts => {
    parts.forEach(p => {
      p.x += p.vx; p.y += p.vy; p.vy += 0.025; p.life -= p.decay;
      p.vx *= .995;
      if (p.life <= 0) return;
      fxCtx.globalAlpha = Math.max(p.life,0);
      fxCtx.fillStyle = p.color;
      fxCtx.shadowColor = p.color;
      fxCtx.shadowBlur = p.life > .5 ? 12 : 4;
      fxCtx.beginPath(); fxCtx.arc(p.x,p.y,p.r,0,Math.PI*2); fxCtx.fill();
    });
  });
  fxCtx.shadowBlur = 0;
  fxCtx.globalAlpha = 1;
  fireworks = fireworks.filter(parts => parts.some(p => p.life > 0));
  if (fxRunning) requestAnimationFrame(fxLoop);
}

let fxInterval, rocketInterval;
const finaleTrigger = ScrollTrigger.create({
  trigger:'#finale', start:'top 60%',
  onEnter(){
    if (fxRunning || prefersReduced) return;
    fxRunning = true;
    resizeFx();
    fxLoop();

    /* character-by-character reveal of finale title */
    const chars = document.querySelectorAll('#finaleTitle .char');
    chars.forEach((ch, i) => {
      gsap.to(ch, {
        opacity:1, y:0, scale:1, duration:.8, ease:'back.out(1.7)',
        delay: i * .04
      });
    });
    document.getElementById('finaleTitle').style.opacity = 1;

    gsap.to('#finaleSub', { opacity:1, y:0, duration:1.2, delay:.8, ease:'power2.out' });
    gsap.to('.finale-signoff', { opacity:1, duration:1, delay:1.4, ease:'power2.out' });
    gsap.to('#finaleGlow', { opacity:1, scale:1.4, duration:2, ease:'power2.out' });

    /* staggered firework launches */
    setTimeout(() => spawnRocket(), 200);
    setTimeout(() => spawnRocket(), 600);
    setTimeout(() => spawnFirework(), 1000);
    fxInterval = setInterval(() => {
      if (Math.random() > .4) spawnRocket(); else spawnFirework();
    }, 1200);
  }
});

/* ============================================================
   12. SCROLL PARALLAX DEPTH (subtle scale/opacity)
   ============================================================ */
['#reveal','#letter','#memories','#gift'].forEach(sel => {
  gsap.fromTo(sel, { opacity:.7 }, {
    opacity:1, duration:1,
    scrollTrigger:{ trigger:sel, start:'top 80%', end:'top 30%', scrub:true }
  });
});

/* ============================================================
   13. MUSIC TOGGLE
   ============================================================ */
const audioEl = document.getElementById('bgAudio');
audioEl.src = birthdayConfig.music;
const musicBtn = document.getElementById('music-btn');
let playing = false;

musicBtn.addEventListener('click', () => {
  if (!playing){
    audioEl.play().then(() => {
      playing = true;
      musicBtn.classList.add('playing');
      musicBtn.querySelector('span').textContent = '♪';
    }).catch(() => {
      musicBtn.querySelector('span').textContent = '⚠';
      setTimeout(() => musicBtn.querySelector('span').textContent = '♫', 1400);
    });
  } else {
    audioEl.pause();
    playing = false;
    musicBtn.classList.remove('playing');
    musicBtn.querySelector('span').textContent = '♫';
  }
});

/* ============================================================
   14. EASTER EGGS (preserved + enhanced)
   ============================================================ */
function showToast(message, duration=4200){
  const toast = document.getElementById('secretToast');
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => toast.classList.remove('show'), duration);
}

/* 14a — tiny star */
document.getElementById('starEgg').addEventListener('click', e => {
  e.stopPropagation();
  showToast(birthdayConfig.secretMessage);
  /* mini burst from star */
  if (!prefersReduced){
    const rect = e.target.getBoundingClientRect();
    const sparks = Array.from({length:12}, () => ({
      x:rect.left+rect.width/2, y:rect.top+rect.height/2,
      vx:(Math.random()-.5)*4, vy:(Math.random()-.5)*4,
      life:1, r:.8
    }));
    function sStep(){
      bgCtx.save();
      sparks.forEach(s => {
        s.x+=s.vx; s.y+=s.vy; s.life-=.03;
        if (s.life<=0) return;
        bgCtx.globalAlpha=s.life*.6;
        bgCtx.fillStyle='#c9a568';
        bgCtx.beginPath(); bgCtx.arc(s.x,s.y,s.r,0,Math.PI*2); bgCtx.fill();
      });
      bgCtx.restore();
      if (sparks.some(s=>s.life>0)) requestAnimationFrame(sStep);
    }
    sStep();
  }
});

/* 14b — hold the open button */
let holdTimer = null;
openBtn.addEventListener('mousedown', startHold);
openBtn.addEventListener('touchstart', startHold, { passive:true });
openBtn.addEventListener('mouseup', cancelHold);
openBtn.addEventListener('mouseleave', cancelHold);
openBtn.addEventListener('touchend', cancelHold);
function startHold(){
  holdTimer = setTimeout(() => {
    showToast(birthdayConfig.holdSurpriseMessage);
  }, 2600);
}
function cancelHold(){ clearTimeout(holdTimer); }

/* 14c — konami */
const konamiSeq = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight'];
let konamiPos = 0;
window.addEventListener('keydown', e => {
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
    for (let i=0; i<4; i++) setTimeout(burstConfetti, i*200);
  }
}

/* ============================================================
   15. RESIZE HANDLING
   ============================================================ */
window.addEventListener('resize', () => ScrollTrigger.refresh());

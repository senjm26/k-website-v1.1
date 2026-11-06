function icon(name){
  const s = (d) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${d}</svg>`;
  const icons = {
    link: `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="currentColor" d="M10.6 13.4a1 1 0 0 1 0-1.4l3.6-3.6a3 3 0 0 1 4.2 4.2l-1.7 1.7a1 1 0 1 1-1.4-1.4l1.7-1.7a1 1 0 1 0-1.4-1.4l-3.6 3.6a1 1 0 0 1-1.4 0ZM13.4 10.6a1 1 0 0 1 0 1.4l-3.6 3.6a3 3 0 1 1-4.2-4.2l1.7-1.7a1 1 0 1 1 1.4 1.4L7 12.8a1 1 0 0 0 1.4 1.4l3.6-3.6a1 1 0 0 1 1.4 0Z"/></svg>`,
    download: `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="currentColor" d="M12 3a1 1 0 0 1 1 1v8.6l2.3-2.3a1 1 0 1 1 1.4 1.4l-4 4a1 1 0 0 1-1.4 0l-4-4a1 1 0 1 1 1.4-1.4L11 12.6V4a1 1 0 0 1 1-1Zm-7 16a1 1 0 0 1 1-1h12a1 1 0 1 1 0 2H6a1 1 0 0 1-1-1Z"/></svg>`,
    bolt: s('<path d="M13 3 5 13.5h6L10 21l8-10.5h-6L13 3Z"/>'),
    medal: s('<circle cx="12" cy="9" r="5.5"/><path d="M9 13.5 7.5 21l4.5-2.4 4.5 2.4-1.5-7.5"/>'),
    globe: s('<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.6 2.6 3.9 5.6 3.9 9s-1.3 6.4-3.9 9c-2.6-2.6-3.9-5.6-3.9-9S9.4 5.6 12 3Z"/>'),
    book: s('<path d="M5 4.5A1.5 1.5 0 0 1 6.5 3H19v15H6.5A1.5 1.5 0 0 0 5 19.5v-15Z"/><path d="M5 19.5A1.5 1.5 0 0 0 6.5 21H19v-3"/>'),
    briefcase: s('<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M9 7V5a1.5 1.5 0 0 1 1.5-1.5h3A1.5 1.5 0 0 1 15 5v2M3 13h18"/>'),
    people: s('<circle cx="9" cy="8" r="3.2"/><path d="M3 20c0-3.3 2.7-5.5 6-5.5s6 2.2 6 5.5"/><path d="M16 5.2a3 3 0 0 1 0 5.6M18.5 14.8c1.5.7 2.5 2.4 2.5 5.2"/>'),
  };
  return icons[name] || icons.link;
}

const HIGHLIGHT_ICONS = ['bolt', 'medal', 'globe', 'book', 'briefcase', 'people'];

function setText(id, txt){
  const el = document.getElementById(id);
  if(el) el.textContent = txt;
}

function escapeHtml(str){
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

/* Append one element per item into a container, rendered from an HTML string. */
function fill(rootId, items, className, render){
  const root = document.getElementById(rootId);
  if(!root) return;
  root.innerHTML = '';
  (items || []).forEach((it, i) => {
    const div = document.createElement('div');
    div.className = typeof className === 'function' ? className(i) : className;
    div.innerHTML = render(it, i);
    root.appendChild(div);
  });
}

function buildHighlights(items){
  const wide = [5]; // spans two columns in the 3-column grid
  fill('highlightsGrid', items,
    i => 'tile' + (i === 0 ? ' feature' : '') + (wide.includes(i) ? ' wide' : ''),
    (h, i) => {
      const body = `
        <div class="ico">${icon(HIGHLIGHT_ICONS[i % HIGHLIGHT_ICONS.length])}</div>
        <h4>${h.title}</h4>
        <p>${h.text.split('/').join('/<wbr>')}</p>
        ${h.linkUrl ? `<a class="textLink" href="${h.linkUrl}" target="_blank" rel="noreferrer">${h.linkLabel || 'Learn more'}</a>` : ''}
      `;
      if(i !== 0) return body;
      return `
        <div class="tileText">${body}</div>
        <div class="shot"><img src="./assets/img/sentransformer.jpg" alt="A Sen Transformer unit with cooling radiators, bushings, and control cabinet" loading="lazy"/></div>
      `;
    });
}

function buildStats(items){
  fill('stats', items, 'stat', s => `<dt>${s.label}</dt><dd>${s.value}</dd>`);
}

function buildTimeline(items){
  fill('timeline', items, i => 'job' + (i === 0 ? ' now' : ''), (t, i) => `
    <span class="when">${t.period}</span>
    <div class="what">${t.role}</div>
    <div class="where">${t.org}</div>
    <div class="details">${t.details}</div>
    ${i === 0 ? '<img class="orgLogo" src="./assets/img/S.png" alt="Sen Engineering Solutions logo" loading="lazy"/>' : ''}
  `);
}

function buildEducation(items){
  fill('educationList', items, 'entry', e => `
    <div class="t">${e.degree}<span class="y">${e.year}</span></div>
    <div class="s">${e.school}</div>
  `);
}

function buildBooks(items){
  fill('booksList', items, 'book', (b) => `
    ${b.image ? `<img class="bookImg" src="${b.image}" alt="Cover of ${escapeHtml(b.title)}" loading="lazy"/>` : ''}
    <div>
      <div class="bt">${b.title}</div>
      <div class="bm">${b.publisher}, <span>${b.year}</span><br>ISBN <span>${b.isbn}</span></div>
    </div>
  `);
}

function buildPatents(items){
  fill('patentsList', items, 'patent', p => `
    <div class="py">${p.year}</div>
    <div class="pt">${p.title}</div>
    <div class="pn">${p.note}</div>
  `);
}

function buildSpeaking(items){
  fill('speakingList', items, 'talk', s => `
    <div class="td">${s.date}</div>
    <div class="tt">${s.title}</div>
    <div class="ty">${s.type}</div>
  `);
}

function buildAwards(items){
  fill('awardsGrid', items, i => 'award' + (i === 0 ? ' feature' : ''), a => `
    <div class="yr">${a.year ? escapeHtml(a.year) : ''}</div>
    <h4>${escapeHtml(a.name)}</h4>
    <div class="issuer">${escapeHtml(a.issuer)}</div>
    ${a.note ? `<p>${escapeHtml(a.note)}</p>` : ''}
  `);
}

function buildService(items){
  fill('serviceBlocks', items, 'svc', block => `
    <h3>${block.area}</h3>
    <ul>${block.items.map(i => `<li>${i}</li>`).join('')}</ul>
  `);
}

/* Backdrop: particles tracing the magnetic flux around transformer cores. The flux is AC,
   so the flow slows, stops and reverses on a slow cycle. Amber particles stand in for current. */
function setupFlow(){
  document.querySelectorAll('canvas.flow').forEach(initFlow);
}

// Each core is a north/south pole pair, positioned as fractions of the canvas.
const FLOW_CORES = [
  {x: 0.60, y: 0.42, gap: 0.26, polarity:  1},
  {x: 0.99, y: 0.30, gap: 0.30, polarity: -1},
  {x: 0.80, y: 0.92, gap: 0.20, polarity: -1},
  {x: 0.30, y: 0.88, gap: 0.18, polarity:  1},
];

function initFlow(canvas){
  if(!canvas.getContext) return;
  const ctx = canvas.getContext('2d');
  // Visitors who ask for reduced motion get a slower, fainter version rather than a still frame.
  const calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const SPEED = calm ? 28 : 120;          // px per second at peak flux
  const OMEGA = calm ? 0.35 : 0.8;       // AC cycle, radians per second
  const GLOW  = calm ? 0.6 : 1;
  const FADE  = calm ? 0.025 : 0.035;      // how quickly trails fade each frame

  let w = 0, h = 0, poles = [], parts = [], t = 0, last = 0, raf = 0;

  function spawn(p){
    p.x = Math.random() * w;
    p.y = Math.random() * h;
    p.life = 0;
    p.max = 2.5 + Math.random() * 4;     // seconds
    p.amber = Math.random() < 0.12;
    return p;
  }

  function resize(){
    const r = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = r.width; h = r.height;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    poles = [];
    FLOW_CORES.forEach(c => {
      const half = (c.gap * h) / 2;
      poles.push({x: c.x * w, y: c.y * h - half, q:  c.polarity});
      poles.push({x: c.x * w, y: c.y * h + half, q: -c.polarity});
    });
    let n = Math.min(340, Math.round((w * h) / 4200));
    if(calm) n = Math.round(n * 0.6);
    parts = Array.from({length: n}, () => spawn({}));
  }

  // 2D field from the poles: points from north to south, strongest near the cores.
  function field(x, y){
    let fx = 0, fy = 0, near = Infinity;
    for(const p of poles){
      const dx = x - p.x, dy = y - p.y;
      const d2 = dx * dx + dy * dy + 40;
      fx += p.q * dx / d2;
      fy += p.q * dy / d2;
      near = Math.min(near, d2);
    }
    const mag = Math.hypot(fx, fy) || 1e-6;
    return {ux: fx / mag, uy: fy / mag, mag, near};
  }

  function step(dt){
    ctx.globalCompositeOperation = 'destination-out';
    // fade by elapsed time, not per frame, so trails look the same on 60Hz and 144Hz screens
    ctx.fillStyle = `rgba(0,0,0,${(1 - Math.pow(1 - FADE, dt * 60)).toFixed(4)})`;
    ctx.fillRect(0, 0, w, h);
    ctx.globalCompositeOperation = 'source-over';
    ctx.lineWidth = 1.2;
    ctx.lineCap = 'round';

    const ac = Math.cos(t * OMEGA);
    const v = SPEED * ac * dt;

    for(const p of parts){
      const f = field(p.x, p.y);
      const nx = p.x + f.ux * v;
      const ny = p.y + f.uy * v;
      const strength = Math.min(1, f.mag * h * 0.45);
      const life = Math.sin(Math.PI * Math.min(p.life / p.max, 1));
      const a = (0.35 + 0.65 * strength) * life * GLOW * (0.35 + 0.65 * Math.abs(ac));
      ctx.strokeStyle = p.amber
        ? `rgba(255,178,36,${(0.95 * a).toFixed(3)})`
        : `rgba(150,185,255,${(0.75 * a).toFixed(3)})`;
      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
      ctx.lineTo(nx, ny);
      ctx.stroke();
      p.x = nx; p.y = ny; p.life += dt;
      if(p.life > p.max || f.near < 90 || p.x < -20 || p.x > w + 20 || p.y < -20 || p.y > h + 20) spawn(p);
    }
    t += dt;
  }

  function loop(now){
    const dt = last ? Math.min((now - last) / 1000, 0.05) : 1 / 60;
    last = now;
    step(dt);
    raf = requestAnimationFrame(loop);
  }
  function start(){ if(!raf){ last = 0; raf = requestAnimationFrame(loop); } }
  function stop(){ cancelAnimationFrame(raf); raf = 0; }

  resize();
  let rt;
  window.addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(resize, 150); });

  if('IntersectionObserver' in window){
    new IntersectionObserver(entries => { entries[0].isIntersecting ? start() : stop(); }).observe(canvas);
  }else{
    start();
  }
}

function setupHeader(){
  const header = document.querySelector('.siteHeader');
  if(!header) return;
  // Clear only at the very top of the page; solid as soon as the visitor scrolls.
  function update(){
    header.classList.toggle('solid', window.scrollY > 8);
  }
  window.addEventListener('scroll', update, {passive: true});
  window.addEventListener('resize', update);
  update();
}

function setupNav(){
  const menuBtn = document.getElementById('menuBtn');
  const navList = document.getElementById('navList');
  function setMenu(open){
    navList.classList.toggle('open', open);
    menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    menuBtn.textContent = open ? 'Close' : 'Menu';
    document.querySelector('.siteHeader').classList.toggle('menuOpen', open);
  }
  menuBtn.addEventListener('click', () => setMenu(!navList.classList.contains('open')));
  navList.addEventListener('click', e => { if(e.target.closest('a')) setMenu(false); });
  document.addEventListener('keydown', e => { if(e.key === 'Escape') setMenu(false); });
  document.addEventListener('click', e => {
    if(!e.target.closest('.siteHeader')) setMenu(false);
  });
  window.matchMedia('(min-width: 981px)').addEventListener('change', e => { if(e.matches) setMenu(false); });

  const links = [...document.querySelectorAll('nav a')];
  const sections = links
    .map(a => document.querySelector(a.getAttribute('href')))
    .filter(Boolean);

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        links.forEach(l => l.classList.remove('active'));
        const id = '#' + entry.target.id;
        const active = links.find(l => l.getAttribute('href') === id);
        if(active) active.classList.add('active');
      }
    });
  }, {rootMargin: "-30% 0px -60% 0px", threshold: 0});

  sections.forEach(s => obs.observe(s));
}

(function init(){
  const data = window.SITE_DATA;
  if(!data){
    console.error('SITE_DATA not found. Ensure assets/data.js is loaded before main.js');
    return;
  }

  setText('heroName', `${data.person.name}`);
  setText('heroTitle', `${data.person.postnominals}`);
  setText('heroRole', `${data.person.title}`);
  setText('heroSubtitle', `${data.person.subtitle}`);
  setText('emailLinkText', data.person.email);
  document.getElementById('emailLink').href = `mailto:${data.person.email}`;

  // Primary links
  const linkRow = document.getElementById('linkRow');
  linkRow.innerHTML = '';
  data.person.links.forEach(l => {
    const a = document.createElement('a');
    a.className = 'btn';
    a.href = l.url;
    a.target = '_blank';
    a.rel = 'noreferrer';
    a.innerHTML = `${icon('link')}<span>${l.label}</span>`;
    linkRow.appendChild(a);
  });

  // CV download button (PDF only)
  const cvPdf = document.getElementById('cvPdf');
  if(cvPdf) cvPdf.innerHTML = `${icon('download')}<span>Download CV</span>`;

  buildHighlights(data.highlights);
  buildStats(data.stats);
  buildTimeline(data.timeline);
  buildEducation(data.education);
  buildBooks(data.books);
  fill('pubsList', data.selectedPubs, 'pub', p => p.citation);
  buildPatents(data.patents);
  buildSpeaking(data.speaking);
  buildAwards(data.awards);
  buildService(data.service);

  // Footer note
  setText('sourceNote', data.meta.sourceNote);

  setupFlow();
  setupHeader();
  setupNav();
})();

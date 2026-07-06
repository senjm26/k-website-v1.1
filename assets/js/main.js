function icon(name){
  const icons = {
    mail: `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="currentColor" d="M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2Zm0 4-8 5L4 8V6l8 5 8-5v2Z"/></svg>`,
    link: `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="currentColor" d="M10.6 13.4a1 1 0 0 1 0-1.4l3.6-3.6a3 3 0 0 1 4.2 4.2l-1.7 1.7a1 1 0 1 1-1.4-1.4l1.7-1.7a1 1 0 1 0-1.4-1.4l-3.6 3.6a1 1 0 0 1-1.4 0ZM13.4 10.6a1 1 0 0 1 0 1.4l-3.6 3.6a3 3 0 1 1-4.2-4.2l1.7-1.7a1 1 0 1 1 1.4 1.4L7 12.8a1 1 0 0 0 1.4 1.4l3.6-3.6a1 1 0 0 1 1.4 0Z"/></svg>`,
    download: `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="currentColor" d="M12 3a1 1 0 0 1 1 1v8.6l2.3-2.3a1 1 0 1 1 1.4 1.4l-4 4a1 1 0 0 1-1.4 0l-4-4a1 1 0 1 1 1.4-1.4L11 12.6V4a1 1 0 0 1 1-1Zm-7 16a1 1 0 0 1 1-1h12a1 1 0 1 1 0 2H6a1 1 0 0 1-1-1Z"/></svg>`,
    award: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false"><circle cx="12" cy="9" r="5.5" stroke="currentColor" stroke-width="1.4"/><path d="M9 13.5 7.5 21l4.5-2.4 4.5 2.4-1.5-7.5" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/></svg>`,
  };
  return icons[name] || icons.link;
}

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

function buildHighlights(items){
  const root = document.getElementById('highlightsGrid');
  root.innerHTML = '';
  items.forEach(h => {
    const div = document.createElement('div');
    div.className = 'card';
    div.innerHTML = `
      <h3>${h.title}</h3>
      <p>${h.text}</p>
      ${h.linkUrl ? `<a class="smallLink" href="${h.linkUrl}" target="_blank" rel="noreferrer">${h.linkLabel || 'Learn more'} →</a>` : ''}
    `;
    root.appendChild(div);
  });
}

function buildStats(items){
  const root = document.getElementById('stats');
  root.innerHTML = '';
  items.forEach(s => {
    const div = document.createElement('div');
    div.className = 'stat';
    div.innerHTML = `<div class="value">${s.value}</div><div class="label">${s.label}</div>`;
    root.appendChild(div);
  });
}

function buildTimeline(items){
  const root = document.getElementById('timeline');
  root.innerHTML = '';
  items.forEach(t => {
    const div = document.createElement('div');
    div.className = 'tItem';
    div.innerHTML = `
      <div class="when">${t.period}</div>
      <div>
        <div class="what">${t.role}</div>
        <div class="where">${t.org}</div>
        <div class="details">${t.details}</div>
      </div>
    `;
    root.appendChild(div);
  });
}

function buildSimpleList(rootId, items, formatter){
  const root = document.getElementById(rootId);
  root.innerHTML = '';
  const ul = document.createElement('ul');
  ul.className = 'list';
  items.forEach(it => {
    const li = document.createElement('li');
    li.innerHTML = formatter(it);
    ul.appendChild(li);
  });
  root.appendChild(ul);
}

function buildPatents(items){
  const root = document.getElementById('patentsList');
  root.innerHTML = '';
  items.forEach(p => {
    const row = document.createElement('div');
    row.className = 'patentRow';
    row.innerHTML = `
      <div class="pnum">${p.note}<div class="pyear">${p.year}</div></div>
      <div class="ptitle">${p.title}</div>
    `;
    root.appendChild(row);
  });
}

function buildAwards(items){
  const root = document.getElementById('awardsGrid');
  if(!root) return;
  root.innerHTML = '';
  (items || []).forEach(a => {
    const div = document.createElement('div');
    div.className = 'awardCard';
    div.innerHTML = `
      <div class="awardIcon">${icon('award')}</div>
      <div>
        <h3>${escapeHtml(a.name)}</h3>
        <div class="issuer">${escapeHtml(a.issuer)}${a.year ? ' · ' + escapeHtml(a.year) : ''}</div>
        ${a.note ? `<p>${escapeHtml(a.note)}</p>` : ''}
      </div>
    `;
    root.appendChild(div);
  });
}

function setupNav(){
  const menuBtn = document.getElementById('menuBtn');
  const navList = document.getElementById('navList');
  menuBtn.addEventListener('click', () => {
    navList.classList.toggle('open');
    menuBtn.setAttribute('aria-expanded', navList.classList.contains('open') ? 'true' : 'false');
  });

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

  buildSimpleList('educationList', data.education, (e) => `<strong>${e.degree}</strong> — ${e.school} <span style="color:var(--ink-faint)">(${e.year})</span>`);
  buildSimpleList('booksList', data.books, (b) => `<strong>${b.title}</strong> — ${b.publisher} <span style="color:var(--ink-faint)">(${b.year})</span><br><span style="color:var(--ink-soft)">ISBN: ${b.isbn}</span>`);
  buildSimpleList('pubsList', data.selectedPubs, (p) => `${p.citation}`);
  buildPatents(data.patents);
  buildSimpleList('speakingList', data.speaking, (s) => `<strong>${s.title}</strong> — ${s.type} <span style="color:var(--ink-faint)">(${s.date})</span>`);
  buildAwards(data.awards);

  // Service blocks
  const svcRoot = document.getElementById('serviceBlocks');
  svcRoot.innerHTML = '';
  data.service.forEach(block => {
    const div = document.createElement('div');
    div.className = 'card';
    div.innerHTML = `<h3>${block.area}</h3><ul class="list">${block.items.map(i => `<li>${i}</li>`).join('')}</ul>`;
    svcRoot.appendChild(div);
  });

  // Footer note
  setText('updated', data.meta.updated);
  setText('sourceNote', data.meta.sourceNote);
  setText('year', new Date().getFullYear());

  setupNav();
})();

/* =====================================================
   main.js — behaviour only. NOTE: $ and $$ are defined
   in render.js (which loads first) — do NOT declare
   them again here.
===================================================== */

/* ---------- toast ---------- */
let toastT;
function toast(msg){
  const t = $('#toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toastT);
  toastT = setTimeout(() => t.classList.remove('show'), 3400);
}

/* ---------- bind config into the static shell ---------- */
(function bindConfig(){
  const parts = CONFIG.name.trim().split(/\s+/);
  $('#heroName').innerHTML = `${esc(parts[0])} <span>${esc(parts.slice(1).join(' '))}</span>`;
  $('#brandName').textContent = CONFIG.name;
  $('#footName').textContent  = CONFIG.name;
  $('#heroRole').textContent  = CONFIG.role;
  $('#viewAll').href = CONFIG.githubUrl + '/?tab=repositories';
  $('#visitGh').href = CONFIG.githubUrl;
})();

/* esc is defined in render.js and reused here */
const escMain = window.esc; /* not needed — esc is global via render.js */

/* ---------- theme ---------- */
 $('#themeBtn').addEventListener('click', () => {
  const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
  document.documentElement.dataset.theme = next;
  try { localStorage.setItem('mr-theme', next); } catch(e){}
});

/* ---------- mobile menu ---------- */
const mnav = $('#mnav'), menuBtn = $('#menuBtn');
function setMenu(open){
  menuBtn.setAttribute('aria-expanded', open);
  menuBtn.classList.toggle('is-open', open);
  document.body.classList.toggle('lock', open);
  if (open){ mnav.hidden = false; requestAnimationFrame(() => mnav.classList.add('show')); }
  else { mnav.classList.remove('show'); setTimeout(() => { mnav.hidden = true; }, 380); }
}
menuBtn.addEventListener('click', () => setMenu(mnav.hidden));
mnav.addEventListener('click', e => { if (e.target.closest('a')) setMenu(false); });

/* ---------- scroll spy ---------- */
const spy = new IntersectionObserver(entries => {
  entries.forEach(en => {
    if (!en.isIntersecting) return;
    const id = '#' + en.target.id;
    $$('.nav a, .mnav a').forEach(a => a.classList.toggle('active', a.getAttribute('href') === id));
  });
}, { rootMargin: '-42% 0px -52% 0px' });
['home','about','projects','skills','contact','guestbook'].forEach(id => {
  const el = document.getElementById(id); if (el) spy.observe(el);
});

/* ---------- reveal on scroll ---------- */
const rio = new IntersectionObserver(entries => entries.forEach(en => {
  if (en.isIntersecting){ en.target.classList.add('in'); rio.unobserve(en.target); }
}), { threshold: .12 });
 $$('.reveal').forEach(el => rio.observe(el));

/* ---------- graceful image fallbacks ----------
   data-fb="avatar" → photo missing: use GitHub avatar, then remove
   data-fb="letter" → devicon failed: coloured letter tile
   data-fb="remove" → screenshot missing: keep drawn SVG mock       */
 $$('img[data-fb]').forEach(img => img.addEventListener('error', () => {
  if (img.dataset.fb === 'avatar'){
    img.src = 'https://avatars.githubusercontent.com/' + CONFIG.githubUser + '?s=800';
    img.dataset.fb = 'remove';                       // if even the avatar fails, next error removes it
  } else if (img.dataset.fb === 'letter'){
    const s = document.createElement('span');
    s.className = 'f-letter';
    s.style.background = img.dataset.color || '#1E88E5';
    s.textContent = img.dataset.abbr || '?';
    img.replaceWith(s);
  } else {
    img.remove();
  }
}));

/* ---------- unconfigured links → honest toast ---------- */
document.addEventListener('click', e => {
  const ph = e.target.closest('[data-placeholder]');
  if (!ph) return;
  e.preventDefault();
  const name = ph.dataset.name || '';
  toast(ph.dataset.placeholder === 'demo'
    ? `Add the live demo URL for ${name} in js/data.js (demo field)`
    : `Add your ${name} URL in js/config.js → socials`);
});

/* ---------- CV button (honest check when served over http) ---------- */
let cvMissing = false;
if (location.protocol.indexOf('http') === 0){
  fetch(CONFIG.cvPath, { method: 'HEAD' }).then(r => { cvMissing = !r.ok; }).catch(() => {});
}
 $('#cvBtn').addEventListener('click', e => {
  if (cvMissing){ e.preventDefault(); toast('CV not found — drop your PDF at ' + CONFIG.cvPath); }
});

/* ---------- live GitHub stats ---------- */
fetch('https://api.github.com/users/' + CONFIG.githubUser)
  .then(r => r.ok ? r.json() : Promise.reject())
  .then(u => { $('#ghMeta').textContent = `${u.public_repos} public repos · ${u.followers} followers`; })
  .catch(() => { /* offline: meta line just stays empty */ });

/* ---------- contact form → real, pre-filled drafts (no backend) ----------
   Gmail opens immediately in a new tab; WhatsApp + mail-app buttons
   remain visible below the form as alternatives.                       */
 $('#contactForm').addEventListener('submit', e => {
  e.preventDefault();
  const name  = $('#fName').value.trim(),
        email = $('#fEmail').value.trim(),
        msg   = $('#fMsg').value.trim();
  let ok = true;
  $('#w-name').classList.toggle('bad', !name);          ok = ok && !!name;
  const eOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  $('#w-email').classList.toggle('bad', !eOk);          ok = ok && eOk;
  $('#w-msg').classList.toggle('bad', msg.length < 10); ok = ok && msg.length >= 10;
  if (!ok){ toast('Check the highlighted fields'); return; }

  const subject = 'Portfolio enquiry — ' + name;
  const body    = msg + '\n\n— ' + name + ' (' + email + ')';

  const links = [];
  /* Gmail web compose — works for anyone signed into Gmail, no mail client needed */
  links.push(`<a class="fb-btn fb-hl" target="_blank" rel="noopener" href="https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(CONFIG.email)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}">Open in Gmail</a>`);
  /* WhatsApp — appears only if CONFIG.whatsapp is set */
  if (CONFIG.whatsapp){
    links.push(`<a class="fb-btn" target="_blank" rel="noopener" href="https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(msg + '\n\n— ' + name + ' (' + email + ')')}">Send on WhatsApp</a>`);
  }
  /* Classic mail app, for those who have one */
  links.push(`<a class="fb-btn" href="mailto:${CONFIG.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}">Default mail app</a>`);

  const row = $('#formFallback');
  row.innerHTML = links.join('');
  row.classList.add('show');
  row.querySelector('.fb-hl').click();   /* opens Gmail right away; if popup-blocked, buttons are visible */
  toast('Pre-filled draft ready — choose how to send');
});

/* ---------- footer year ---------- */
 $('#year').textContent = new Date().getFullYear();
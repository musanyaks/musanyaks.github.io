/* =====================================================
   comments.js — public visitor messages, stored in
   Firebase Firestore (free tier). Real-time: new posts
   appear for everyone without reloading.

   SETUP: paste the firebaseConfig values from your
   Firebase console into FB_CONFIG below. Until then the
   section shows a setup note and never breaks the page.
===================================================== */

const firebaseConfig = {
  apiKey: "AIzaSyB12V-71MMUhYs0SGZkQj5cZ6rx6-o8Ip0",
  authDomain: "portfolio-18cbb.firebaseapp.com",
  projectId: "portfolio-18cbb",
  storageBucket: "portfolio-18cbb.firebasestorage.app",
  messagingSenderId: "1004700306998",
  appId: "1:1004700306998:web:9e58ca611099e9698c1297",
  measurementId: "G-1XMK4JEGHV"
};

(function(){
  const form  = document.getElementById('commentForm');
  const list  = document.getElementById('commentList');
  const count = document.getElementById('commentCount');

  const isConfigured = !/PASTE_/.test(FB_CONFIG.apiKey);

  /* helpers — esc() comes from render.js, toast() from main.js */
  const PALETTE = ['#2196F3','#8B5CF6','#EC4899','#F59E0B','#10B981','#EF4444','#06B6D4'];
  const colorFor = name => {
    let h = 0;
    for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
    return PALETTE[h % PALETTE.length];
  };
  function timeAgo(t){
    if (!t) return 'just now';
    const s = Math.max(1, (Date.now() - t.toDate().getTime()) / 1000);
    if (s < 60)     return 'just now';
    if (s < 3600)   return Math.floor(s/60)   + ' min ago';
    if (s < 86400)  return Math.floor(s/3600) + ' hr ago';
    if (s < 2592e3) return Math.floor(s/86400)+ ' days ago';
    return t.toDate().toLocaleDateString();
  }

  function commentHTML(c){
    const name = (c.name || 'Anonymous').trim();
    return `
    <li class="gb-item">
      <span class="gb-avatar" style="background:${colorFor(name)}">${esc(name.charAt(0).toUpperCase())}</span>
      <div class="gb-body">
        <div class="gb-top"><b>${esc(name)}</b><time>${timeAgo(c.createdAt)}</time></div>
        <p>${esc(c.message || '')}</p>
      </div>
    </li>`;
  }

  function note(html){ list.innerHTML = `<li class="gb-note">${html}</li>`; }

  /* ---- not configured (or Firebase blocked): degrade gracefully ---- */
  if (typeof firebase === 'undefined' || !isConfigured){
    note(isConfigured
      ? 'Comments are temporarily unavailable.'
      : 'Comments are not set up yet — paste your Firebase config into <b>js/comments.js</b> (FB_CONFIG) and publish the Firestore rules.');
    form.addEventListener('submit', e => {
      e.preventDefault();
      toast(isConfigured ? 'Comments unavailable — check your connection'
                         : 'Set up Firebase first: paste your config into js/comments.js (FB_CONFIG)');
    });
    return;
  }

  const db  = firebase.firestore();
  const COL = 'comments';

  /* ---- live feed: latest 50, updates without reload ---- */
  db.collection(COL).orderBy('createdAt','desc').limit(50).onSnapshot(snap => {
    const items = [];
    snap.forEach(d => items.push(commentHTML(d.data())));
    list.innerHTML = items.length
      ? items.join('')
      : '<li class="gb-note">No messages yet — be the first to say hello.</li>';
    count.textContent = items.length ? `${items.length} message${items.length > 1 ? 's' : ''}` : '';
  }, err => {
    console.error(err);
    note("Couldn't load messages — check the Firestore rules are published.");
  });

  /* ---- post a message ---- */
  form.addEventListener('submit', e => {
    e.preventDefault();
    const name = document.getElementById('cName').value.trim();
    const msg  = document.getElementById('cMsg').value.trim();
    const honeypot = document.getElementById('cWeb').value;

    let ok = true;
    document.getElementById('w-cname').classList.toggle('bad', !name);        ok = ok && !!name;
    document.getElementById('w-cmsg').classList.toggle('bad', msg.length < 2); ok = ok && msg.length >= 2;
    if (!ok){ toast('Check the highlighted fields'); return; }
    if (honeypot) return;   /* hidden field filled = bot; silently dropped */

    const btn = form.querySelector('button[type=submit]');
    btn.disabled = true;
    db.collection(COL).add({
      name:      name.slice(0, 60),
      message:   msg.slice(0, 500),
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    }).then(() => {
      form.reset();
      toast('Message posted — visible to everyone');
    }).catch(err => {
      console.error(err);
      toast('Could not post — check the Firestore rules are published');
    }).finally(() => { btn.disabled = false; });
  });
})();
/* ============================================================
   Musa Rioba — core interactions
   preloader · cursor · nav · theme · reveal · hero · counters
   ============================================================ */
(() => {
  "use strict";
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- preloader ---------- */
  const pre = $("#preloader");
  const fill = $("#preloaderFill");
  const pct = $("#preloaderPct");
  let p = 0;
  const tick = setInterval(() => {
    p = Math.min(100, p + Math.random() * 18 + 6);
    fill.style.width = p + "%";
    pct.textContent = Math.floor(p) + "%";
    if (p >= 100) {
      clearInterval(tick);
      setTimeout(() => {
        pre.classList.add("is-done");
        document.body.classList.add("is-loaded");
      }, 250);
    }
  }, 90);

  /* ---------- custom cursor ---------- */
  const dot = $("#cursorDot");
  const ring = $("#cursorRing");
  if (matchMedia("(pointer: fine)").matches && !reduced) {
    let mx = -100, my = -100, rx = -100, ry = -100;
    addEventListener("mousemove", (e) => {
      mx = e.clientX; my = e.clientY;
      dot.style.transform = `translate(${mx}px, ${my}px) translate(-50%,-50%)`;
    });
    (function loop() {
      rx += (mx - rx) * 0.16;
      ry += (my - ry) * 0.16;
      ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%,-50%)`;
      requestAnimationFrame(loop);
    })();
    document.addEventListener("mouseover", (e) => {
      ring.classList.toggle(
        "is-hot",
        !!e.target.closest("a, button, input, textarea, .project, .filter")
      );
    });
  }

  /* ---------- scroll: progress + nav state ---------- */
  const progress = $("#scrollProgress");
  const nav = $("#nav");
  const onScroll = () => {
    const h = document.documentElement;
    const max = h.scrollHeight - h.clientHeight;
    progress.style.width = (max > 0 ? (h.scrollTop / max) * 100 : 0) + "%";
    nav.classList.toggle("is-scrolled", h.scrollTop > 30);
  };
  addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- mobile menu ---------- */
  const burger = $("#navBurger");
  const links = $("#navLinks");
  burger.addEventListener("click", () => {
    const open = links.classList.toggle("is-open");
    burger.classList.toggle("is-open", open);
    burger.setAttribute("aria-expanded", String(open));
  });
  links.addEventListener("click", (e) => {
    if (e.target.closest("a")) {
      links.classList.remove("is-open");
      burger.classList.remove("is-open");
      burger.setAttribute("aria-expanded", "false");
    }
  });

  /* ---------- theme ---------- */
  const root = document.documentElement;
  const savedTheme = localStorage.getItem("mr-theme");
  if (savedTheme) root.dataset.theme = savedTheme;
  const toggleTheme = () => {
    const next = root.dataset.theme === "dark" ? "light" : "dark";
    root.dataset.theme = next;
    localStorage.setItem("mr-theme", next);
  };
  $("#themeToggle").addEventListener("click", toggleTheme);

  /* ---------- active section: nav links + dots ---------- */
  const sections = $$("main section[id]");
  const navLinks = $$(".nav__link");
  const dots = $$("#dots a");
  const spy = new IntersectionObserver(
    (entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        const id = en.target.id;
        navLinks.forEach((a) => a.classList.toggle("is-active", a.getAttribute("href") === "#" + id));
        dots.forEach((a) => a.classList.toggle("is-active", a.dataset.section === id));
      });
    },
    { rootMargin: "-45% 0px -50% 0px" }
  );
  sections.forEach((s) => spy.observe(s));

  /* ---------- reveal on scroll ---------- */
  const revealObs = new IntersectionObserver(
    (entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) {
          en.target.classList.add("is-visible");
          revealObs.unobserve(en.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );
  $$("[data-reveal]").forEach((el) => revealObs.observe(el));

  /* ---------- skill bars ---------- */
  const skillObs = new IntersectionObserver(
    (entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        $$(".skill", en.target).forEach((s) => {
          $("i", s).style.width = (s.dataset.level || 0) + "%";
        });
        skillObs.unobserve(en.target);
      });
    },
    { threshold: 0.3 }
  );
  const skillsBox = $(".skills");
  if (skillsBox) skillObs.observe(skillsBox);

  /* ---------- counters ---------- */
  const counterObs = new IntersectionObserver(
    (entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        const el = en.target;
        const target = +el.dataset.count || 0;
        const dur = 1600;
        const t0 = performance.now();
        (function step(now) {
          const k = Math.min(1, (now - t0) / dur);
          const eased = 1 - Math.pow(1 - k, 3);
          el.textContent = Math.round(target * eased);
          if (k < 1) requestAnimationFrame(step);
        })(t0);
        counterObs.unobserve(el);
      });
    },
    { threshold: 0.6 }
  );
  $$("[data-count]").forEach((el) => counterObs.observe(el));

  /* ---------- typewriter roles ---------- */
  const typed = $("#roleTyped");
  const roles = [
    "Software Developer",
    "Data Enthusiast",
    "ML Practitioner",
    "Problem Solver",
  ];
  if (typed && !reduced) {
    let ri = 0, ci = 0, del = false;
    (function type() {
      const word = roles[ri];
      ci += del ? -1 : 1;
      typed.textContent = word.slice(0, ci);
      let wait = del ? 45 : 95;
      if (!del && ci === word.length) { wait = 1700; del = true; }
      else if (del && ci === 0) { del = false; ri = (ri + 1) % roles.length; wait = 350; }
      setTimeout(type, wait);
    })();
  }

  /* ---------- hero particles ---------- */
  const canvas = $("#particles");
  if (canvas && !reduced) {
    const ctx = canvas.getContext("2d");
    let w, h, pts = [];
    const resize = () => {
      w = canvas.width = canvas.offsetWidth;
      h = canvas.height = canvas.offsetHeight;
      const n = Math.min(70, Math.floor((w * h) / 22000));
      pts = Array.from({ length: n }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        r: Math.random() * 1.8 + 0.6,
      }));
    };
    resize();
    addEventListener("resize", resize);
    (function draw() {
      ctx.clearRect(0, 0, w, h);
      const accent = getComputedStyle(root).getPropertyValue("--accent").trim() || "#7c5cff";
      for (let i = 0; i < pts.length; i++) {
        const a = pts[i];
        a.x += a.vx; a.y += a.vy;
        if (a.x < 0 || a.x > w) a.vx *= -1;
        if (a.y < 0 || a.y > h) a.vy *= -1;
        ctx.beginPath();
        ctx.arc(a.x, a.y, a.r, 0, Math.PI * 2);
        ctx.fillStyle = accent;
        ctx.globalAlpha = 0.55;
        ctx.fill();
        ctx.globalAlpha = 1;
        for (let j = i + 1; j < pts.length; j++) {
          const b = pts[j];
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < 120) {
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = accent;
            ctx.globalAlpha = 0.14 * (1 - d / 120);
            ctx.stroke();
            ctx.globalAlpha = 1;
          }
        }
      }
      requestAnimationFrame(draw);
    })();
  }

  /* ---------- spotlight cards ---------- */
  document.addEventListener("mousemove", (e) => {
    const card = e.target.closest?.(".card-spotlight");
    if (!card) return;
    const r = card.getBoundingClientRect();
    card.style.setProperty("--mx", e.clientX - r.left + "px");
    card.style.setProperty("--my", e.clientY - r.top + "px");
  });

  /* ---------- magnetic buttons ---------- */
  if (matchMedia("(pointer: fine)").matches && !reduced) {
    $$(".magnetic").forEach((el) => {
      el.addEventListener("mousemove", (e) => {
        const r = el.getBoundingClientRect();
        const x = e.clientX - r.left - r.width / 2;
        const y = e.clientY - r.top - r.height / 2;
        el.style.transform = `translate(${x * 0.18}px, ${y * 0.3}px)`;
      });
      el.addEventListener("mouseleave", () => { el.style.transform = ""; });
    });
  }

  /* ---------- tilt ---------- */
  if (matchMedia("(pointer: fine)").matches && !reduced) {
    $$(".tilt").forEach((el) => {
      el.addEventListener("mousemove", (e) => {
        const r = el.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        el.style.transform = `perspective(800px) rotateY(${x * 14}deg) rotateX(${-y * 14}deg)`;
        el.style.transition = "transform 0.1s";
      });
      el.addEventListener("mouseleave", () => {
        el.style.transform = "";
        el.style.transition = "transform 0.5s";
      });
    });
  }

  /* ---------- Nairobi clock + year ---------- */
  const clock = $("#nairobiClock");
  const yearEl = $("#year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
  if (clock) {
    const fmt = new Intl.DateTimeFormat("en-GB", {
      timeZone: "Africa/Nairobi",
      hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false,
    });
    const upd = () => { clock.textContent = fmt.format(new Date()) + " EAT"; };
    upd();
    setInterval(upd, 1000);
  }

  /* ---------- back to top ---------- */
  $("#toTop")?.addEventListener("click", () =>
    scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" })
  );

  /* ---------- keyboard shortcuts ---------- */
  addEventListener("keydown", (e) => {
    const inField = /INPUT|TEXTAREA/.test(document.activeElement?.tagName || "");
    if (inField) return;
    if (e.key.toLowerCase() === "t" && !e.metaKey && !e.ctrlKey) toggleTheme();
  });
})();

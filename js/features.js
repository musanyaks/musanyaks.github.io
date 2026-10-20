/* ============================================================
   Musa Rioba — feature interactions
   project filters · modal · guestbook · contact · palette · heatmap
   ============================================================ */
(() => {
  "use strict";
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const esc = (s) =>
    String(s).replace(/[&<>"']/g, (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])
    );

  /* ---------- project data ---------- */
  const PROJECTS = {
    p1: {
      cat: "Machine Learning · Data",
      title: "Crop Yield Predictor",
      year: "2025",
      body: [
        "<strong>The problem:</strong> smallholder farmers make planting decisions with almost no forward-looking data.",
        "<strong>The approach:</strong> a regression pipeline over weather, soil and seasonal features, with feature-importance reports so every prediction can be explained rather than trusted blindly.",
        "<strong>The result:</strong> a lightweight model that runs on modest hardware and an interface designed for low-bandwidth use.",
      ],
      tags: ["Python", "Scikit-learn", "Pandas", "Matplotlib"],
    },
    p2: {
      cat: "Web · Data",
      title: "Nairobi Air Dashboard",
      year: "2025",
      body: [
        "<strong>The problem:</strong> air-quality readings existed, but nobody could see them in a useful way.",
        "<strong>The approach:</strong> a FastAPI ingestion service polls public sensor feeds, normalises readings into PostgreSQL, and a React front-end renders live maps, historical trends and threshold alerts.",
        "<strong>The result:</strong> a mobile-first dashboard that answers “is it safe to run outside today?” in under a second.",
      ],
      tags: ["React", "FastAPI", "PostgreSQL", "Mapbox"],
    },
    p3: {
      cat: "Data Analysis",
      title: "Market Basket Insights",
      year: "2024",
      body: [
        "<strong>The problem:</strong> retail transaction logs held untapped clues about how products are bought together.",
        "<strong>The approach:</strong> association-rule mining (Apriori) on thousands of transactions, combined with margin analysis and a Power BI report for stakeholders.",
        "<strong>The result:</strong> actionable shelf-placement and bundling recommendations, presented so non-technical teams can act on them.",
      ],
      tags: ["Python", "MLxtend", "Power BI", "SQL"],
    },
    p4: {
      cat: "Developer Tools",
      title: "csv-doctor",
      year: "2024",
      body: [
        "<strong>The problem:</strong> every data project starts the same way — an hour of poking at a messy CSV.",
        "<strong>The approach:</strong> a CLI that profiles any CSV instantly: inferred schema, null/duplicate detection, outlier flags and a human-readable report.",
        "<strong>The result:</strong> minutes instead of hours before real analysis begins. Open source and pip-installable.",
      ],
      tags: ["Python", "Click", "Pandas", "Open Source"],
    },
    p5: {
      cat: "Web",
      title: "Savanna Commerce",
      year: "2024",
      body: [
        "<strong>The problem:</strong> most storefronts assume fast connections and endless patience.",
        "<strong>The approach:</strong> a full-stack shop with cart, checkout, payments and admin analytics — server-rendered and aggressively optimised for slow mobile networks.",
        "<strong>The result:</strong> a checkout flow that stays smooth even on 3G, with an admin panel sellers actually enjoy using.",
      ],
      tags: ["Next.js", "Stripe", "Tailwind", "Prisma"],
    },
    p6: {
      cat: "Machine Learning · NLP",
      title: "Swahili Text Classifier",
      year: "2023",
      body: [
        "<strong>The problem:</strong> low-resource languages are systematically underserved by NLP tools.",
        "<strong>The approach:</strong> fine-tuned transformer models for East African news categorisation, trained on deliberately under-sourced data to stress-test robustness.",
        "<strong>The result:</strong> a benchmark and model that punch above their dataset size — and a write-up of what actually mattered in training.",
      ],
      tags: ["Transformers", "PyTorch", "NLP", "Hugging Face"],
    },
  };

  /* ---------- filters ---------- */
  const filters = $$(".filter");
  const cards = $$(".project");
  filters.forEach((btn) => {
    btn.addEventListener("click", () => {
      filters.forEach((b) => {
        b.classList.toggle("is-active", b === btn);
        b.setAttribute("aria-selected", String(b === btn));
      });
      const f = btn.dataset.filter;
      cards.forEach((c) => {
        const show = f === "all" || (c.dataset.cat || "").split(" ").includes(f);
        c.classList.toggle("is-hidden", !show);
        if (show) {
          c.style.animation = "none";
          void c.offsetWidth;
          c.style.animation = "msgIn 0.45s cubic-bezier(0.22,1,0.36,1)";
        }
      });
    });
  });

  /* ---------- modal ---------- */
  const modal = $("#projectModal");
  let lastFocus = null;
  const openModal = (id) => {
    const d = PROJECTS[id];
    if (!d) return;
    lastFocus = document.activeElement;
    $("#modalCat").textContent = d.cat;
    $("#modalTitle").textContent = d.title;
    $("#modalYear").textContent = d.year;
    $("#modalBody").innerHTML = d.body.map((p) => `<p>${p}</p>`).join("");
    $("#modalTags").innerHTML = d.tags.map((t) => `<span>${esc(t)}</span>`).join("");
    $("#modalActions").innerHTML = `
      <a class="btn btn--primary" href="https://github.com/musanyaks" target="_blank" rel="noopener">Source on GitHub</a>
      <button class="btn btn--ghost" data-close>Close</button>`;
    modal.hidden = false;
    document.body.style.overflow = "hidden";
    $(".modal__close", modal).focus();
  };
  const closeModal = () => {
    modal.hidden = true;
    document.body.style.overflow = "";
    lastFocus?.focus();
  };
  cards.forEach((c) => {
    c.addEventListener("click", () => openModal(c.dataset.project));
    c.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openModal(c.dataset.project);
      }
    });
  });
  modal.addEventListener("click", (e) => {
    if (e.target.closest("[data-close]")) closeModal();
  });

  /* ---------- guestbook ---------- */
  const KEY = "mr-messages";
  const box = $("#messages");
  const form = $("#msgForm");
  const load = () => {
    try { return JSON.parse(localStorage.getItem(KEY) || "[]"); }
    catch { return []; }
  };
  const save = (list) => localStorage.setItem(KEY, JSON.stringify(list));
  const timeAgo = (ts) => {
    const s = (Date.now() - ts) / 1000;
    if (s < 60) return "just now";
    if (s < 3600) return Math.floor(s / 60) + "m ago";
    if (s < 86400) return Math.floor(s / 3600) + "h ago";
    return Math.floor(s / 86400) + "d ago";
  };
  const render = () => {
    const list = load();
    if (!list.length) {
      box.innerHTML = `<p class="messages__empty">No messages yet — be the first to say hello 👋</p>`;
      return;
    }
    box.innerHTML = list
      .map(
        (m, i) => `
      <article class="msg">
        <div class="msg__avatar">${esc((m.name || "?").trim().charAt(0).toUpperCase())}</div>
        <div>
          <div class="msg__head">
            <span class="msg__name">${esc(m.name)}</span>
            ${m.title ? `<span class="msg__title">${esc(m.title)}</span>` : ""}
            <span class="msg__time">${timeAgo(m.ts)}</span>
            <button class="msg__del" data-del="${i}" title="Delete (saved in this browser)">delete</button>
          </div>
          <p class="msg__text">${esc(m.text)}</p>
        </div>
      </article>`
      )
      .join("");
  };
  setTimeout(render, 700); // brief "Loading messages…" moment

  const msgText = $("#msgText");
  msgText?.addEventListener("input", () => {
    $("#msgCount").textContent = msgText.value.length;
  });

  form?.addEventListener("submit", (e) => {
    e.preventDefault();
    const nameF = $("#msgName").closest(".field");
    const textF = $("#msgText").closest(".field");
    nameF.classList.remove("is-error");
    textF.classList.remove("is-error");
    const name = $("#msgName").value.trim();
    const text = msgText.value.trim();
    let ok = true;
    if (!name) { nameF.classList.add("is-error"); ok = false; }
    if (!text) { textF.classList.add("is-error"); ok = false; }
    if (!ok) return;
    const list = load();
    list.unshift({ name, title: $("#msgTitle").value.trim(), text, ts: Date.now() });
    save(list.slice(0, 30));
    form.reset();
    $("#msgCount").textContent = "0";
    render();
  });

  box.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-del]");
    if (!btn) return;
    const list = load();
    list.splice(+btn.dataset.del, 1);
    save(list);
    render();
  });

  /* ---------- contact form → email / WhatsApp ---------- */
  const cForm = $("#contactForm");
  const WA_NUMBER = "254704059015";
  const validateContact = () => {
    const fields = ["#cName", "#cEmail", "#cSubject", "#cMessage"];
    let ok = true;
    fields.forEach((sel) => {
      const el = $(sel);
      const f = el.closest(".field");
      const bad = !el.value.trim() || (el.type === "email" && !/^\S+@\S+\.\S+$/.test(el.value));
      f.classList.toggle("is-error", bad);
      if (bad) ok = false;
    });
    if (!ok) $("#formNote").textContent = "Please fill in every field correctly.";
    return ok;
  };
  cForm?.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!validateContact()) return;
    const subject = encodeURIComponent($("#cSubject").value.trim());
    const body = encodeURIComponent(
      `${$("#cMessage").value.trim()}\n\n— ${$("#cName").value.trim()} (${$("#cEmail").value.trim()})`
    );
    $("#formNote").textContent = "Opening your mail app…";
    location.href = `mailto:nyakerabachi@gmail.com?subject=${subject}&body=${body}`;
  });

  $("#sendWhatsApp")?.addEventListener("click", () => {
    if (!validateContact()) return;
    const text = encodeURIComponent(
      `Hi Musa, I'm ${$("#cName").value.trim()} (${$("#cEmail").value.trim()}).\n\n` +
      `*${$("#cSubject").value.trim()}*\n${$("#cMessage").value.trim()}`
    );
    $("#formNote").textContent = "Opening WhatsApp…";
    window.open(`https://wa.me/${WA_NUMBER}?text=${text}`, "_blank", "noopener");
  });

  /* ---------- copy email ---------- */
  const copyBtn = $("#copyEmail");
  const toast = $("#copiedToast");
  copyBtn?.addEventListener("click", async () => {
    const email = copyBtn.dataset.email;
    try {
      await navigator.clipboard.writeText(email);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = email;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      ta.remove();
    }
    toast.classList.add("is-show");
    setTimeout(() => toast.classList.remove("is-show"), 1600);
  });

  /* ---------- activity heatmap ---------- */
  const heat = $("#heatmap");
  if (heat) {
    const weeks = 52, cells = [];
    let seed = 42;
    const rnd = () => (seed = (seed * 1103515245 + 12345) % 2147483648) / 2147483648;
    for (let i = 0; i < weeks * 7; i++) {
      const weekend = i % 7 >= 5;
      const r = rnd();
      let lvl = r > 0.92 ? 4 : r > 0.8 ? 3 : r > 0.62 ? 2 : r > 0.42 ? 1 : 0;
      if (weekend && lvl > 0 && rnd() > 0.5) lvl--;
      cells.push(`<i class="l${lvl}"></i>`);
    }
    heat.innerHTML = cells.join("");
  }

  /* ---------- command palette ---------- */
  const palette = $("#palette");
  const pInput = $("#paletteInput");
  const pList = $("#paletteList");
  const COMMANDS = [
    { name: "Go to About", hint: "#about", run: () => go("#about") },
    { name: "Go to Projects", hint: "#projects", run: () => go("#projects") },
    { name: "Go to Journey", hint: "#journey", run: () => go("#journey") },
    { name: "Go to Messages", hint: "#guestbook", run: () => go("#guestbook") },
    { name: "Go to Contact", hint: "#contact", run: () => go("#contact") },
    { name: "View on GitHub", hint: "external", run: () => window.open("https://github.com/musanyaks", "_blank", "noopener") },
    { name: "Toggle theme", hint: "T", run: () => $("#themeToggle").click() },
    { name: "Back to top", hint: "home", run: () => scrollTo({ top: 0, behavior: "smooth" }) },
  ];
  const go = (hash) => {
    document.querySelector(hash)?.scrollIntoView({ behavior: "smooth" });
  };
  let sel = 0, visible = [];
  const renderList = (q = "") => {
    visible = COMMANDS.filter((c) => c.name.toLowerCase().includes(q.toLowerCase()));
    sel = 0;
    pList.innerHTML = visible
      .map(
        (c, i) =>
          `<li class="${i === 0 ? "is-sel" : ""}" data-i="${i}">${esc(c.name)}<kbd>${esc(c.hint)}</kbd></li>`
      )
      .join("") || `<li class="is-sel">No matches</li>`;
  };
  const openPalette = () => {
    palette.hidden = false;
    pInput.value = "";
    renderList();
    pInput.focus();
  };
  const closePalette = () => { palette.hidden = true; };
  $("#paletteBtn").addEventListener("click", openPalette);
  palette.addEventListener("click", (e) => {
    if (e.target.closest("[data-close]")) closePalette();
    const li = e.target.closest("li[data-i]");
    if (li) {
      visible[+li.dataset.i]?.run();
      closePalette();
    }
  });
  pInput.addEventListener("input", () => renderList(pInput.value));
  pInput.addEventListener("keydown", (e) => {
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      if (!visible.length) return;
      sel = (sel + (e.key === "ArrowDown" ? 1 : -1) + visible.length) % visible.length;
      $$("#paletteList li").forEach((li, i) => li.classList.toggle("is-sel", i === sel));
    } else if (e.key === "Enter") {
      visible[sel]?.run();
      closePalette();
    }
  });

  addEventListener("keydown", (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
      e.preventDefault();
      palette.hidden ? openPalette() : closePalette();
    }
    if (e.key === "Escape") {
      if (!palette.hidden) closePalette();
      else if (!modal.hidden) closeModal();
    }
  });
})();

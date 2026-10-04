/* skills.js - renders the Skills dashboard. Edit DATA below to add/remove tools.
   Item = "Name|devicon-slug|fallback-letters|colour"  (slug optional: leave empty for a letter tile) */
(function(){
  const DI = 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/';
  const DATA = [
   {t:'Programming Languages',d:'Core languages I use to build applications and solve problems.',g:'</>',c:'#2563eb',
    i:['Python|python|Py|#3776AB','Java|java|Jv|#E76F00','R|r|R|#276DC3','SQL||SQL|#3b82f6']},
   {t:'Data Engineering',d:'Tools for building and managing data pipelines, warehouses and ETL/ELT processes.',g:'◈',c:'#4f46e5',
    i:['Airflow|apacheairflow|Af|#00ad46','Spark|apachespark|Sp|#e25a1c','dbt||dbt|#ff694b','Snowflake|snowflake|Sn|#29b5e8','PostgreSQL|postgresql|Pg|#336791','ETL / ELT||⇄|#2f8cff','Data Pipelines||⛓|#2f8cff']},
   {t:'Backend & Application Development',d:'Frameworks and tools for building robust and scalable applications.',g:'▤',c:'#10b981',
    i:['Spring Boot|spring|Sb|#6DB33F','SQLAlchemy|sqlalchemy|Sa|#d71f00','Alembic||Al|#2f8cff','REST APIs||API|#2f8cff','Java 21|java|Jv|#E76F00','Python|python|Py|#3776AB']},
   {t:'Streaming & Distributed Systems',d:'Technologies for real-time data processing and event-driven architectures.',g:'⎈',c:'#7c3aed',
    i:['Kafka|apachekafka|Kf|#fff','MQTT||MQ|#7c3aed','TimescaleDB||Ts|#fdb515','Redis|redis|Rd|#dc382d']},
   {t:'Data Science & Analytics',d:'Libraries and tools for data analysis, visualization and statistical modelling.',g:'▥',c:'#0ea5e9',
    i:['Pandas|pandas|Pd|#7c6cf0','NumPy|numpy|Np|#4DABCF','Matplotlib|matplotlib|Mp|#11557c','Tidyverse||Tv|#e0457b','ggplot2||gg|#2f8cff','dplyr||dp|#f26b3a','R|r|R|#276DC3','Statistical Analysis||σ|#7c6cf0']},
   {t:'Databases',d:'Data storage and querying systems.',g:'▣',c:'#8b7cf6',
    i:['PostgreSQL|postgresql|Pg|#336791','TimescaleDB||Ts|#fdb515','Snowflake|snowflake|Sn|#29b5e8','Redis|redis|Rd|#dc382d','SQL||SQL|#3b82f6']},
   {t:'DevOps & Cloud',d:'Tools for deployment, monitoring and infrastructure.',g:'☁',c:'#06b6d4',w:1,
    i:['Docker|docker|Dk|#2496ED','Docker Compose|docker|Dc|#2496ED','Git|git|Gt|#F05033','GitHub Actions|githubactions|GA|#2088ff','Linux|linux|Lx|#fcc624','Prometheus|prometheus|Pm|#e6522c','Grafana|grafana|Gf|#f46800','CI/CD||∞|#2f8cff']},
   {t:'Actuarial / Statistical Computing',d:'Statistical methods and models for loss reserving and risk analysis.',g:'▦',c:'#8b5cf6',w:1,
    i:['Chain Ladder||CL|#6aa8ff','Mack||Mk|#6aa8ff','ODP Bootstrap||Bs|#6aa8ff','Bornhuetter-Ferguson||BF|#6aa8ff','Cape Cod||CC|#6aa8ff','Loss Reserving||LR|#6aa8ff','Statistical Modelling||SM|#6aa8ff']}
  ];
  const esc = s => String(s).replace(/[&<>"]/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[m]));
  const tile = x => {
    const [n, slug, ab, col] = x.split('|');
    const ft = `<span class="ft" style="background:${col}">${esc(ab)}</span>`;
    const ic = slug ? `<img src="${DI}${slug}/${slug}-original.svg" alt="" loading="lazy" data-ab="${esc(ab)}" data-c="${col}">` : ft;
    return `<li class="sk2-t">${ic}<span>${esc(n)}</span></li>`;
  };
  const host = document.getElementById('skillDash');
  if (!host) return;
  host.innerHTML = DATA.map(s => `
    <article class="sk2-card${s.w ? ' wide' : ''}">
      <div class="sk2-ch"><span class="sk2-ci" style="background:${s.c}">${esc(s.g)}</span>
        <div><h3>${esc(s.t)}</h3><p>${esc(s.d)}</p></div></div>
      <ul class="sk2-tiles" style="list-style:none;margin:0;padding:0">${s.i.map(tile).join('')}</ul>
    </article>`).join('');
  /* icon failed to load -> coloured letter tile */
  host.querySelectorAll('img[data-ab]').forEach(img => img.addEventListener('error', () => {
    const sp = document.createElement('span');
    sp.className = 'ft'; sp.style.background = img.dataset.c; sp.textContent = img.dataset.ab;
    img.replaceWith(sp);
  }));
})();

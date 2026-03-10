/* ============================================================
   READER — reader.html logic
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  // Mobile nav toggle
  const toggle = document.getElementById('navToggle');
  const nav = document.getElementById('mainNav');
  if (toggle && nav) toggle.addEventListener('click', () => nav.classList.toggle('open'));

  // Parse URL params
  const params = new URLSearchParams(window.location.search);
  const moduleId = params.get('module') || 'module-1';
  const module = APP_DATA.modules.find(m => m.id === moduleId);

  if (!module) {
    document.getElementById('readerMain').innerHTML = `
      <div class="alert alert-danger">Module not found. <a href="index.html">Back to dashboard</a></div>
    `;
    return;
  }

  document.title = `${module.title} — SW Learn`;

  renderSidebar(module);
  renderContent(module);
  renderQuicknav(module);
  setupIntersectionObserver(module);
});

/* ----------------------------------------------------------
   Sidebar
   ---------------------------------------------------------- */
function renderSidebar(module) {
  const container = document.getElementById('sidebarContent');
  if (!container) return;

  const moduleIndex = APP_DATA.modules.findIndex(m => m.id === module.id);
  const readPercent = Progress.getModuleReadPercent(module.id);

  const tocItems = module.sections.map(section => {
    const isRead = Progress.isSectionRead(module.id, section.id);
    return `
      <li class="toc-item">
        <a class="toc-link ${isRead ? 'read' : ''}"
           data-section="${section.id}"
           onclick="scrollToSection('${section.id}', event)">
          <span class="toc-dot"></span>
          <span>${section.title}</span>
        </a>
      </li>
    `;
  }).join('');

  // Other modules nav
  const otherModules = APP_DATA.modules
    .filter(m => m.id !== module.id)
    .map(m => `<a href="reader.html?module=${m.id}">${m.icon} ${m.title}</a>`)
    .join('');

  container.innerHTML = `
    <div class="sidebar-module-header">
      <div class="sidebar-module-icon">${module.icon}</div>
      <div class="sidebar-module-title">${module.title}</div>
      <div class="sidebar-module-progress mt-2">
        <div class="progress-label">
          <span style="font-size:0.75rem;color:var(--text-muted)">Reading progress</span>
          <span style="font-size:0.75rem;color:var(--text-muted)">${readPercent}%</span>
        </div>
        <div class="progress-wrap">
          <div class="progress-bar" id="sidebarProgress" style="width:${readPercent}%"></div>
        </div>
      </div>
    </div>
    <ul class="toc-list">${tocItems}</ul>
    <div class="sidebar-module-nav">
      <div style="font-size:0.75rem;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;color:var(--text-muted);margin-bottom:8px">Other Modules</div>
      ${otherModules}
    </div>
  `;
}

function updateTOC(module) {
  module.sections.forEach(section => {
    const link = document.querySelector(`.toc-link[data-section="${section.id}"]`);
    if (!link) return;
    const isRead = Progress.isSectionRead(module.id, section.id);
    link.classList.toggle('read', isRead);
  });
  // Update sidebar progress bar
  const bar = document.getElementById('sidebarProgress');
  if (bar) bar.style.width = Progress.getModuleReadPercent(module.id) + '%';
}

function scrollToSection(sectionId, e) {
  if (e) e.preventDefault();
  const card = document.getElementById('section-card-' + sectionId);
  if (!card) return;

  // Open the section if not open
  if (!card.classList.contains('open')) {
    toggleSection(sectionId);
  }

  setTimeout(() => {
    card.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, 100);
}

/* ----------------------------------------------------------
   Content
   ---------------------------------------------------------- */
function renderContent(module) {
  const main = document.getElementById('readerMain');
  if (!main) return;

  const moduleIndex = APP_DATA.modules.findIndex(m => m.id === module.id);
  const prevModule = APP_DATA.modules[moduleIndex - 1];
  const nextModule = APP_DATA.modules[moduleIndex + 1];

  const sectionsHtml = module.sections.map((section, i) => {
    const isRead = Progress.isSectionRead(module.id, section.id);
    const isFirst = i === 0;
    return `
      <div class="section-card ${isFirst ? 'open' : ''} ${isRead ? '' : ''}"
           id="section-card-${section.id}"
           data-section-id="${section.id}">
        <div class="section-header" onclick="toggleSection('${section.id}')">
          <div class="section-title-wrap">
            <span class="section-read-badge ${isRead ? 'read' : ''}" id="badge-${section.id}">
              ${isRead ? '✓' : (i + 1)}
            </span>
            <span class="section-title">${section.title}</span>
          </div>
          <span class="section-chevron">▼</span>
        </div>
        <div class="section-body">
          <div class="section-body-inner">
            ${section.content}
            ${isRead ? '<div class="section-complete-note">✓ Section marked as read</div>' : ''}
          </div>
        </div>
      </div>
    `;
  }).join('');

  const allRead = Progress.getModuleReadPercent(module.id) === 100;
  const completeBanner = allRead ? `
    <div class="module-complete-banner">
      <h3>🎉 Module Complete!</h3>
      <p>You've read all sections in ${module.title}.</p>
      <div class="btn-group">
        <a href="quiz.html?module=${module.id}" class="btn btn-primary btn-lg">Take Module Quiz</a>
        <a href="flashcards.html?module=${module.id}" class="btn btn-outline" style="color:#fff;border-color:#fff">Review Flashcards</a>
      </div>
    </div>
  ` : '';

  const prevNextHtml = `
    <div class="module-prev-next">
      ${prevModule
        ? `<a href="reader.html?module=${prevModule.id}" class="btn btn-ghost">← ${prevModule.title}</a>`
        : '<span></span>'}
      ${nextModule
        ? `<a href="reader.html?module=${nextModule.id}" class="btn btn-primary">${nextModule.title} →</a>`
        : `<a href="exam.html" class="btn btn-primary">Take Certification Exam →</a>`}
    </div>
  `;

  main.innerHTML = `
    <div class="reader-breadcrumb">
      <a href="index.html">Dashboard</a>
      <span>›</span>
      <span>${module.icon} ${module.title}</span>
    </div>
    ${sectionsHtml}
    ${completeBanner}
    ${prevNextHtml}
  `;

  // Highlight code with Prism
  if (typeof Prism !== 'undefined') {
    Prism.highlightAll();
  }
}

function toggleSection(sectionId) {
  const card = document.getElementById('section-card-' + sectionId);
  if (!card) return;
  card.classList.toggle('open');

  // Update TOC active state
  document.querySelectorAll('.toc-link').forEach(l => l.classList.remove('active'));
  if (card.classList.contains('open')) {
    const link = document.querySelector(`.toc-link[data-section="${sectionId}"]`);
    if (link) link.classList.add('active');
  }
}

/* ----------------------------------------------------------
   Quick Nav
   ---------------------------------------------------------- */
function renderQuicknav(module) {
  const nav = document.getElementById('readerQuicknav');
  if (!nav) return;

  const quizBest = Progress.getQuizBest(module.id);
  const flashcardCount = module.flashcards.length;
  const knownCount = (Progress.getAll().flashcards[module.id] || {}).known
    ? Progress.getAll().flashcards[module.id].known.length : 0;

  nav.innerHTML = `
    <div class="quicknav-card">
      <h4>This Module</h4>
      <a href="quiz.html?module=${module.id}" class="btn btn-primary btn-block btn-sm">
        ❓ Take Quiz
      </a>
      <a href="flashcards.html?module=${module.id}" class="btn btn-outline btn-block btn-sm">
        📚 Flashcards
      </a>
      <hr class="quicknav-divider" />
      <div class="quicknav-stat">Quiz best: <strong>${quizBest !== null ? quizBest + '/10' : 'Not attempted'}</strong></div>
      <div class="quicknav-stat">Flashcards: <strong>${knownCount}/${flashcardCount} known</strong></div>
    </div>
  `;
}

/* ----------------------------------------------------------
   IntersectionObserver — auto-mark sections as read
   ---------------------------------------------------------- */
function setupIntersectionObserver(module) {
  if (!('IntersectionObserver' in window)) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
        const sectionId = entry.target.dataset.sectionId;
        if (!sectionId) return;

        const wasRead = Progress.isSectionRead(module.id, sectionId);
        Progress.markSectionRead(module.id, sectionId);

        if (!wasRead) {
          // Update badge in DOM
          const badge = document.getElementById('badge-' + sectionId);
          if (badge) {
            badge.classList.add('read');
            badge.textContent = '✓';
          }
          // Update section to show complete note
          const body = entry.target.querySelector('.section-body-inner');
          if (body && !body.querySelector('.section-complete-note')) {
            const note = document.createElement('div');
            note.className = 'section-complete-note';
            note.textContent = '✓ Section marked as read';
            body.appendChild(note);
          }
          // Update TOC and sidebar progress
          updateTOC(module);
          // Check if module is now complete
          if (Progress.getModuleReadPercent(module.id) === 100) {
            const main = document.getElementById('readerMain');
            if (main && !main.querySelector('.module-complete-banner')) {
              const banner = document.createElement('div');
              banner.className = 'module-complete-banner';
              banner.innerHTML = `
                <h3>🎉 Module Complete!</h3>
                <p>You've read all sections in ${module.title}.</p>
                <div class="btn-group">
                  <a href="quiz.html?module=${module.id}" class="btn btn-primary btn-lg">Take Module Quiz</a>
                  <a href="flashcards.html?module=${module.id}" class="btn btn-outline" style="color:#fff;border-color:#fff">Review Flashcards</a>
                </div>
              `;
              main.querySelector('.module-prev-next')
                ? main.insertBefore(banner, main.querySelector('.module-prev-next'))
                : main.appendChild(banner);
            }
          }
        }
      }
    });
  }, { threshold: 0.5 });

  // Observe all open section bodies
  document.querySelectorAll('.section-card').forEach(card => {
    observer.observe(card);
  });
}

// Make functions available globally for inline onclick handlers
window.toggleSection = toggleSection;
window.scrollToSection = scrollToSection;

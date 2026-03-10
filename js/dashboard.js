/* ============================================================
   DASHBOARD — index.html logic
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  // Mobile nav toggle
  const toggle = document.getElementById('navToggle');
  const nav = document.getElementById('mainNav');
  if (toggle && nav) {
    toggle.addEventListener('click', () => nav.classList.toggle('open'));
  }

  renderModules();
  renderOverallProgress();
  renderExamStatus();
});

function renderModules() {
  const grid = document.getElementById('modulesGrid');
  if (!grid) return;

  grid.innerHTML = APP_DATA.modules.map((module, index) => {
    const readPercent = Progress.getModuleReadPercent(module.id);
    const quizBest = Progress.getQuizBest(module.id);
    const sectionCount = module.sections.length;
    const sectionsRead = Progress.getModule(module.id).sectionsRead.length;

    const quizBadgeHtml = quizBest !== null
      ? `<div class="module-quiz-badge text-success">✓ Quiz: ${quizBest}/10</div>`
      : `<div class="module-quiz-badge text-muted">Quiz not attempted</div>`;

    return `
      <div class="module-card">
        <div class="module-card-header">
          <div class="module-icon" style="background:${module.color}22; color:${module.color}; font-size:1.5rem">
            ${module.icon}
          </div>
          <div class="module-card-meta">
            <div class="module-number">Module ${index + 1}</div>
            <h3>${module.title}</h3>
          </div>
        </div>
        <div class="module-card-body">
          <p class="module-description">${module.description}</p>
          <div class="module-progress-area">
            <div class="progress-label">
              <span>${sectionsRead} of ${sectionCount} sections read</span>
              <span>${readPercent}%</span>
            </div>
            <div class="progress-wrap">
              <div class="progress-bar ${readPercent === 100 ? 'success' : ''}"
                   style="width:${readPercent}%"></div>
            </div>
            ${quizBadgeHtml}
          </div>
        </div>
        <div class="module-card-footer">
          <a href="reader.html?module=${module.id}" class="btn btn-primary">
            ${readPercent > 0 ? '📖 Continue' : '📖 Start Reading'}
          </a>
          <a href="quiz.html?module=${module.id}" class="btn btn-outline">
            ${quizBest !== null ? '🔄 Retry Quiz' : '❓ Take Quiz'}
          </a>
          <a href="flashcards.html?module=${module.id}" class="btn btn-ghost">
            📚
          </a>
        </div>
      </div>
    `;
  }).join('');
}

function renderOverallProgress() {
  const p = Progress.getOverallProgress();
  const ringFill = document.getElementById('ringFill');
  const ringText = document.getElementById('ringText');
  const title = document.getElementById('progressTitle');
  const subtitle = document.getElementById('progressSubtitle');

  // Calculate overall score: 40% reading + 40% quizzes + 20% exam
  const readScore = p.totalSections ? (p.readSections / p.totalSections) : 0;
  const quizScore = (p.quizzesComplete / p.totalQuizzes);
  const examScore = p.examPassed ? 1 : 0;
  const overall = Math.round((readScore * 0.4 + quizScore * 0.4 + examScore * 0.2) * 100);

  // Update SVG ring (circumference ≈ 163 for r=26)
  const circumference = 163;
  const offset = circumference - (overall / 100) * circumference;
  if (ringFill) {
    setTimeout(() => { ringFill.style.strokeDashoffset = offset; }, 100);
  }
  if (ringText) ringText.textContent = overall + '%';

  if (title && subtitle) {
    if (p.examPassed) {
      title.textContent = '🎉 Certification Complete!';
      subtitle.textContent = `Best exam score: ${p.bestExamScore}/${p.bestExamTotal} — You passed!`;
    } else if (overall >= 60) {
      title.textContent = 'Almost ready for the exam!';
      subtitle.textContent = `${p.readSections}/${p.totalSections} sections read · ${p.quizzesComplete}/4 quizzes done`;
    } else if (overall > 0) {
      title.textContent = 'Learning in progress…';
      subtitle.textContent = `${p.readSections}/${p.totalSections} sections read · ${p.quizzesComplete}/4 quizzes done`;
    } else {
      title.textContent = 'Start your learning journey';
      subtitle.textContent = 'Complete all 4 modules and take the certification exam';
    }
  }
}

function renderExamStatus() {
  const attempts = Progress.getExamAttempts();
  const best = Progress.getBestExamAttempt();
  const title = document.getElementById('examStatusTitle');
  const sub = document.getElementById('examStatusSub');
  const cta = document.getElementById('examCta');

  if (!attempts.length) return;

  if (best && best.passed) {
    title.textContent = '🏆 Exam Passed!';
    sub.textContent = `Best score: ${best.score}/${best.total} (${Math.round(best.score/best.total*100)}%) · ${attempts.length} attempt(s)`;
    cta.textContent = 'Retake Exam';
    cta.className = 'btn btn-outline';
  } else {
    const pct = Math.round(best.score / best.total * 100);
    title.textContent = `Last attempt: ${best.score}/50 (${pct}%)`;
    sub.textContent = `${attempts.length} attempt(s) · Need 35/50 (70%) to pass`;
    cta.textContent = 'Try Again';
  }
}

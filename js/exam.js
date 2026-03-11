/* ============================================================
   EXAM — exam.html logic
   ============================================================ */

const EXAM_DURATION = 30 * 60; // 30 minutes in seconds
const PASS_THRESHOLD = 0.7;    // 70%

let examState = {
  questions: [],
  currentIndex: 0,
  answers: [],       // null or selected option index
  timerInterval: null,
  timeLeft: EXAM_DURATION,
  startTime: null,
  submitted: false
};

document.addEventListener('DOMContentLoaded', () => {
  // Mobile nav
  const toggle = document.getElementById('navToggle');
  const nav = document.getElementById('mainNav');
  if (toggle && nav) toggle.addEventListener('click', () => nav.classList.toggle('open'));

  // Check for previous attempts and show intro if first time
  const attempts = Progress.getExamAttempts();

  // Shuffle questions
  const shuffled = [...APP_DATA.examQuestions].sort(() => Math.random() - 0.5);
  examState.questions = shuffled;
  examState.answers = new Array(shuffled.length).fill(null);
  examState.startTime = Date.now();

  renderExamQuestion();
  startTimer();
});

/* ----------------------------------------------------------
   Timer
   ---------------------------------------------------------- */
function startTimer() {
  examState.timerInterval = setInterval(() => {
    examState.timeLeft--;
    updateTimerDisplay();

    if (examState.timeLeft <= 300) {
      document.getElementById('examTimer').classList.add('warning');
    }
    if (examState.timeLeft <= 0) {
      clearInterval(examState.timerInterval);
      submitExam(true);
    }
  }, 1000);
}

function updateTimerDisplay() {
  const el = document.getElementById('examTimer');
  if (!el) return;
  const mins = Math.floor(examState.timeLeft / 60).toString().padStart(2, '0');
  const secs = (examState.timeLeft % 60).toString().padStart(2, '0');
  el.textContent = `${mins}:${secs}`;
}

/* ----------------------------------------------------------
   Question rendering
   ---------------------------------------------------------- */
function renderExamQuestion() {
  const { questions, currentIndex, answers } = examState;
  const q = questions[currentIndex];
  const total = questions.length;
  const answeredCount = answers.filter(a => a !== null).length;

  // Update header
  const counterEl = document.getElementById('examQCounter');
  if (counterEl) counterEl.textContent = `Question ${currentIndex + 1} of ${total}`;

  // Submit button: enable when all answered
  const submitBtn = document.getElementById('submitBtn');
  if (submitBtn) submitBtn.disabled = answeredCount < total;

  // Build dot grid
  const dotsHtml = questions.map((_, i) => {
    let cls = 'unanswered';
    if (i === currentIndex) cls = 'current';
    else if (answers[i] !== null) cls = 'answered';
    return `<div class="exam-dot ${cls}" onclick="jumpToQuestion(${i})" title="Q${i+1}"></div>`;
  }).join('');

  const optLetters = ['A', 'B', 'C', 'D'];
  const escHtml = s => s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  const optionsHtml = q.options.map((opt, i) => `
    <button class="option-btn ${answers[currentIndex] === i ? 'selected' : ''}"
            data-index="${i}"
            onclick="selectExamOption(${i})">
      <span class="option-letter">${optLetters[i]}</span>
      <span>${escHtml(opt)}</span>
    </button>
  `).join('');

  document.getElementById('examContainer').innerHTML = `
    <div class="exam-dots">${dotsHtml}</div>

    <div class="question-card">
      <div class="question-number">
        Question ${currentIndex + 1}
        <span class="badge badge-muted" style="margin-left:8px;font-size:0.7rem">
          ${getModuleLabel(q.moduleId)}
        </span>
      </div>
      <div class="question-text">${escHtml(q.question)}</div>
      <div class="options-list" id="examOptionsList">${optionsHtml}</div>
    </div>

    <div class="exam-nav">
      <button class="btn btn-ghost" onclick="navigateExam(-1)" ${currentIndex === 0 ? 'disabled' : ''}>
        ← Previous
      </button>
      <div>
        <div class="exam-answered-count">${answeredCount} / ${total} answered</div>
      </div>
      <button class="btn btn-primary" onclick="navigateExam(1)" ${currentIndex === total - 1 ? 'disabled' : ''}>
        Next →
      </button>
    </div>
  `;
}

function getModuleLabel(moduleId) {
  const m = APP_DATA.modules.find(m => m.id === moduleId);
  return m ? `${m.icon} M${APP_DATA.modules.indexOf(m) + 1}` : '';
}

function selectExamOption(index) {
  examState.answers[examState.currentIndex] = index;

  // Update button visuals
  document.querySelectorAll('.option-btn').forEach((btn, i) => {
    btn.classList.toggle('selected', i === index);
  });

  // Update answered count and submit button
  const answeredCount = examState.answers.filter(a => a !== null).length;
  const submitBtn = document.getElementById('submitBtn');
  if (submitBtn) submitBtn.disabled = answeredCount < examState.questions.length;

  // Update dot
  const dots = document.querySelectorAll('.exam-dot');
  if (dots[examState.currentIndex]) {
    dots[examState.currentIndex].classList.remove('unanswered');
    dots[examState.currentIndex].classList.add('answered');
  }
}

function navigateExam(direction) {
  const newIndex = examState.currentIndex + direction;
  if (newIndex < 0 || newIndex >= examState.questions.length) return;
  examState.currentIndex = newIndex;
  renderExamQuestion();
}

function jumpToQuestion(index) {
  examState.currentIndex = index;
  renderExamQuestion();
}

/* ----------------------------------------------------------
   Submit
   ---------------------------------------------------------- */
function submitExam(autoSubmit = false) {
  if (examState.submitted) return;
  examState.submitted = true;

  clearInterval(examState.timerInterval);

  const { questions, answers, startTime } = examState;
  const timeTaken = Math.round((Date.now() - startTime) / 1000);

  // Calculate score
  let score = 0;
  questions.forEach((q, i) => {
    if (answers[i] === q.correct) score++;
  });

  const total = questions.length;
  const attempt = Progress.saveExamAttempt(score, total, timeTaken);

  showExamResults(questions, answers, score, total, timeTaken);
}

/* ----------------------------------------------------------
   Results
   ---------------------------------------------------------- */
function showExamResults(questions, answers, score, total, timeTaken) {
  const pct = Math.round((score / total) * 100);
  const passed = pct >= 70;

  // Update header
  const counterEl = document.getElementById('examQCounter');
  if (counterEl) counterEl.textContent = `${score}/${total} Correct`;
  const timerEl = document.getElementById('examTimer');
  if (timerEl) {
    timerEl.classList.remove('warning');
    const mins = Math.floor(timeTaken / 60).toString().padStart(2, '0');
    const secs = (timeTaken % 60).toString().padStart(2, '0');
    timerEl.textContent = `${mins}:${secs}`;
    timerEl.style.color = 'var(--text-muted)';
    timerEl.style.background = '#f4f8fc';
    timerEl.style.borderColor = 'var(--sw-border)';
  }
  const submitBtn = document.getElementById('submitBtn');
  if (submitBtn) submitBtn.style.display = 'none';

  // SVG ring (r=45, circumference≈283)
  const circumference = 283;
  const offset = circumference - (pct / 100) * circumference;
  const ringColor = passed ? 'var(--sw-success)' : 'var(--sw-danger)';

  // Per-module breakdown
  const moduleScores = {};
  APP_DATA.modules.forEach(m => { moduleScores[m.id] = { correct: 0, total: 0 }; });
  questions.forEach((q, i) => {
    if (q.moduleId && moduleScores[q.moduleId]) {
      moduleScores[q.moduleId].total++;
      if (answers[i] === q.correct) moduleScores[q.moduleId].correct++;
    }
  });

  const breakdownHtml = APP_DATA.modules.map(m => {
    const ms = moduleScores[m.id];
    return `
      <div class="module-score-card">
        <div class="ms-icon">${m.icon}</div>
        <div class="ms-score">${ms.correct}/${ms.total}</div>
        <div class="ms-label">${m.title.split(' ').slice(0, 2).join(' ')}</div>
      </div>
    `;
  }).join('');

  // Format time taken
  const mins = Math.floor(timeTaken / 60);
  const secs = timeTaken % 60;
  const timeStr = `${mins}m ${secs}s`;

  // Review items (show all 50)
  const escHtml = s => s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  const reviewHtml = questions.map((q, i) => {
    const isOk = answers[i] === q.correct;
    const moduleLabel = getModuleLabel(q.moduleId);
    return `
      <div class="review-item">
        <div class="review-q-header">
          <div class="review-status ${isOk ? 'ok' : 'bad'}">${isOk ? '✓' : '✗'}</div>
          <div>
            <span class="badge badge-muted text-xs" style="margin-bottom:4px;display:inline-flex">${moduleLabel}</span>
            <div class="review-q-text">${escHtml(q.question)}</div>
          </div>
        </div>
        ${answers[i] !== null ? `
          <div class="review-answer ${isOk ? 'your-correct' : 'your-wrong'}">
            Your answer: ${escHtml(q.options[answers[i]])}
          </div>
          ${!isOk ? `<div class="review-answer correct-ans">Correct: ${escHtml(q.options[q.correct])}</div>` : ''}
        ` : '<div class="review-answer your-wrong">Not answered</div>'}
        <div class="review-explanation">${escHtml(q.explanation)}</div>
      </div>
    `;
  }).join('');

  document.getElementById('examContainer').innerHTML = `
    <div class="results-screen">
      <div class="results-hero">
        <div class="results-score-ring" style="width:100px;height:100px;margin:0 auto 16px">
          <svg width="100" height="100" viewBox="0 0 100 100">
            <circle class="ring-track" cx="50" cy="50" r="45" />
            <circle class="ring-fill" cx="50" cy="50" r="45"
              transform="rotate(-90 50 50)"
              style="stroke:${ringColor};stroke-dashoffset:${offset}" />
            <text class="ring-score" x="50" y="46" style="fill:${ringColor}">${score}/${total}</text>
            <text class="ring-label" x="50" y="60" style="fill:var(--text-muted)">${pct}%</text>
          </svg>
        </div>
        <div class="results-verdict ${passed ? 'pass' : 'fail'}">
          ${passed ? '🏆 Certified!' : '📚 Keep Practicing'}
        </div>
        <div class="results-detail">
          ${passed
            ? `Congratulations! You passed with ${score}/50 (${pct}%). Time: ${timeStr}`
            : `You scored ${score}/50 (${pct}%). Need 35/50 (70%) to pass. Time: ${timeStr}`}
        </div>

        <div class="module-breakdown">${breakdownHtml}</div>

        <div class="results-actions">
          <a href="index.html" class="btn btn-ghost">← Dashboard</a>
          <a href="flashcards.html" class="btn btn-outline">📚 Review Flashcards</a>
          <a href="exam.html" class="btn btn-primary">🔄 Retake Exam</a>
        </div>
      </div>

      <div class="review-section">
        <div class="review-section-header">
          <span>Full Question Review (${total} questions)</span>
          <span class="badge ${passed ? 'badge-green' : 'badge-red'}">${score} correct</span>
        </div>
        ${reviewHtml}
      </div>
    </div>
  `;

  // Animate ring after render
  setTimeout(() => {
    const fill = document.querySelector('.ring-fill');
    if (fill) fill.style.strokeDashoffset = offset;
  }, 100);
}

// Expose global functions
window.selectExamOption = selectExamOption;
window.navigateExam = navigateExam;
window.jumpToQuestion = jumpToQuestion;
window.submitExam = submitExam;

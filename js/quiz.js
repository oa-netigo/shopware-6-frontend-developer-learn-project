/* ============================================================
   QUIZ — quiz.html logic
   ============================================================ */

let quizState = {
  module: null,
  questions: [],
  currentIndex: 0,
  selectedAnswer: null,
  answered: false,
  answers: [],   // { selected, correct, isCorrect } per question
  score: 0
};

document.addEventListener('DOMContentLoaded', () => {
  // Mobile nav
  const toggle = document.getElementById('navToggle');
  const nav = document.getElementById('mainNav');
  if (toggle && nav) toggle.addEventListener('click', () => nav.classList.toggle('open'));

  const params = new URLSearchParams(window.location.search);
  const moduleId = params.get('module') || 'module-1';
  const module = APP_DATA.modules.find(m => m.id === moduleId);

  if (!module) {
    document.getElementById('quizContainer').innerHTML =
      `<div class="alert alert-danger">Module not found. <a href="index.html">Back</a></div>`;
    return;
  }

  document.title = `${module.title} Quiz — SW Learn`;

  // Shuffle questions
  const shuffled = [...module.quiz].sort(() => Math.random() - 0.5);

  quizState.module = module;
  quizState.questions = shuffled;
  quizState.answers = new Array(shuffled.length).fill(null);

  renderModuleBadge(module);
  renderQuestion();
});

function renderModuleBadge(module) {
  const badge = document.getElementById('quizModuleBadge');
  if (badge) badge.innerHTML = `${module.icon} ${module.title} — Practice Quiz`;
}

/* ----------------------------------------------------------
   Question rendering
   ---------------------------------------------------------- */
function renderQuestion() {
  const { questions, currentIndex } = quizState;
  const q = questions[currentIndex];
  const total = questions.length;

  // Update header
  document.getElementById('quizCounter').textContent = `Question ${currentIndex + 1} of ${total}`;
  document.getElementById('quizProgressFill').style.width = `${((currentIndex) / total) * 100}%`;

  const optLetters = ['A', 'B', 'C', 'D'];
  const escHtml = s => s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  const optionsHtml = q.options.map((opt, i) => `
    <button class="option-btn" data-index="${i}" onclick="selectOption(${i})">
      <span class="option-letter">${optLetters[i]}</span>
      <span>${escHtml(opt)}</span>
    </button>
  `).join('');

  const dotsHtml = questions.map((_, i) => {
    let cls = '';
    if (i < currentIndex && quizState.answers[i] !== null) {
      cls = quizState.answers[i].isCorrect ? 'correct' : 'incorrect';
    } else if (i === currentIndex) {
      cls = 'current';
    }
    return `<div class="q-dot ${cls}"></div>`;
  }).join('');

  document.getElementById('quizContainer').innerHTML = `
    <div class="question-dots">${dotsHtml}</div>
    <div class="question-card" id="questionCard">
      <div class="question-number">Question ${currentIndex + 1}</div>
      <div class="question-text">${q.question}</div>
      <div class="options-list" id="optionsList">${optionsHtml}</div>
      <div id="feedbackBox"></div>
    </div>
    <div class="quiz-nav" id="quizNav">
      <a href="index.html" class="btn btn-ghost">← Exit</a>
      <button class="btn btn-primary btn-next" id="nextBtn" onclick="nextQuestion()" disabled>
        ${currentIndex === total - 1 ? 'See Results' : 'Next →'}
      </button>
    </div>
  `;
}

function selectOption(index) {
  if (quizState.answered) return;
  quizState.selectedAnswer = index;

  // Visual selection
  document.querySelectorAll('.option-btn').forEach((btn, i) => {
    btn.classList.toggle('selected', i === index);
  });

  // Enable next
  document.getElementById('nextBtn').disabled = false;
}

function nextQuestion() {
  if (quizState.selectedAnswer === null) return;

  const { questions, currentIndex, selectedAnswer } = quizState;
  const q = questions[currentIndex];
  const isCorrect = selectedAnswer === q.correct;

  // Save answer
  quizState.answers[currentIndex] = { selected: selectedAnswer, correct: q.correct, isCorrect };
  if (isCorrect) quizState.score++;

  if (!quizState.answered) {
    // Show feedback
    quizState.answered = true;
    showFeedback(q, selectedAnswer, isCorrect);
    document.getElementById('nextBtn').disabled = false;
    document.getElementById('nextBtn').textContent =
      currentIndex === questions.length - 1 ? 'See Results' : 'Continue →';
    return;
  }

  // Move to next
  quizState.currentIndex++;
  quizState.selectedAnswer = null;
  quizState.answered = false;

  if (quizState.currentIndex >= questions.length) {
    showResults();
  } else {
    renderQuestion();
  }
}

function showFeedback(q, selected, isCorrect) {
  // Highlight options
  document.querySelectorAll('.option-btn').forEach((btn, i) => {
    btn.disabled = true;
    if (i === q.correct) btn.classList.add('correct');
    else if (i === selected && !isCorrect) btn.classList.add('incorrect');
  });

  // Feedback message
  const fb = document.getElementById('feedbackBox');
  fb.innerHTML = `
    <div class="feedback-box ${isCorrect ? 'correct-fb' : 'incorrect-fb'}">
      <span class="feedback-icon">${isCorrect ? '✅' : '❌'}</span>
      <div>
        <strong>${isCorrect ? 'Correct!' : 'Incorrect.'}</strong>
        ${!isCorrect ? `<br>The correct answer was: <strong>${q.options[q.correct].replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')}</strong><br>` : ''}
        <span style="opacity:0.85">${q.explanation}</span>
      </div>
    </div>
  `;
}

/* ----------------------------------------------------------
   Results
   ---------------------------------------------------------- */
function showResults() {
  const { module, questions, answers, score } = quizState;
  const total = questions.length;
  const pct = Math.round((score / total) * 100);
  const passed = pct >= 70; // 7/10

  Progress.saveQuizResult(module.id, score, total);
  document.title = `Quiz Results — SW Learn`;
  document.getElementById('quizProgressFill').style.width = '100%';
  document.getElementById('quizCounter').textContent = `Completed`;

  // SVG ring
  const circumference = 283; // 2π × r(45)
  const offset = circumference - (pct / 100) * circumference;
  const ringColor = passed ? 'var(--sw-success)' : 'var(--sw-danger)';

  // Review items
  const reviewHtml = questions.map((q, i) => {
    const ans = answers[i];
    const isOk = ans && ans.isCorrect;
    return `
      <div class="review-item">
        <div class="review-q-header">
          <div class="review-status ${isOk ? 'ok' : 'bad'}">${isOk ? '✓' : '✗'}</div>
          <div class="review-q-text">${q.question}</div>
        </div>
        ${ans ? `
          <div class="review-answer ${isOk ? 'your-correct' : 'your-wrong'}">
            Your answer: ${q.options[ans.selected]}
          </div>
          ${!isOk ? `<div class="review-answer correct-ans">Correct: ${q.options[q.correct]}</div>` : ''}
        ` : ''}
        <div class="review-explanation">${q.explanation}</div>
      </div>
    `;
  }).join('');

  document.getElementById('quizContainer').innerHTML = `
    <div class="results-screen">
      <div class="results-hero">
        <div class="results-score-ring" style="width:100px;height:100px;">
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
          ${passed ? '🎉 Passed!' : '📚 Keep Studying'}
        </div>
        <div class="results-detail">
          ${passed
            ? `You scored ${score} out of ${total}. Great job!`
            : `You scored ${score} out of ${total}. Need 7/10 to pass. Review the sections and try again.`}
        </div>
        <div class="results-actions">
          <a href="index.html" class="btn btn-ghost">← Dashboard</a>
          <a href="reader.html?module=${module.id}" class="btn btn-outline">📖 Review Content</a>
          <a href="quiz.html?module=${module.id}" class="btn btn-primary">🔄 Retry Quiz</a>
        </div>
      </div>

      <div class="review-section">
        <div class="review-section-header">
          <span>Question Review</span>
          <span class="badge ${passed ? 'badge-green' : 'badge-red'}">${score}/${total} correct</span>
        </div>
        ${reviewHtml}
      </div>
    </div>
  `;
}

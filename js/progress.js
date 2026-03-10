/* ============================================================
   PROGRESS — localStorage abstraction layer
   ============================================================ */

window.Progress = (function () {
  const KEY = 'sw_learn_progress';

  function _defaults() {
    return {
      modules: {
        'module-1': { sectionsRead: [], quizScore: null, quizAttempts: 0 },
        'module-2': { sectionsRead: [], quizScore: null, quizAttempts: 0 },
        'module-3': { sectionsRead: [], quizScore: null, quizAttempts: 0 },
        'module-4': { sectionsRead: [], quizScore: null, quizAttempts: 0 }
      },
      exam: { attempts: [] },
      flashcards: {
        'module-1': { known: [] },
        'module-2': { known: [] },
        'module-3': { known: [] },
        'module-4': { known: [] }
      }
    };
  }

  function _load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return _defaults();
      const parsed = JSON.parse(raw);
      // Merge with defaults to handle missing keys (e.g. new modules added later)
      const defaults = _defaults();
      return {
        modules: Object.assign(defaults.modules, parsed.modules || {}),
        exam: Object.assign(defaults.exam, parsed.exam || {}),
        flashcards: Object.assign(defaults.flashcards, parsed.flashcards || {})
      };
    } catch (e) {
      return _defaults();
    }
  }

  function _save(data) {
    try {
      localStorage.setItem(KEY, JSON.stringify(data));
    } catch (e) {
      console.warn('Progress save failed:', e);
    }
  }

  /* ----------------------------------------------------------
     Public API
     ---------------------------------------------------------- */

  /** Get entire progress object */
  function getAll() {
    return _load();
  }

  /** Get progress for one module */
  function getModule(moduleId) {
    const data = _load();
    return data.modules[moduleId] || { sectionsRead: [], quizScore: null, quizAttempts: 0 };
  }

  /** Mark a section as read */
  function markSectionRead(moduleId, sectionId) {
    const data = _load();
    if (!data.modules[moduleId]) data.modules[moduleId] = { sectionsRead: [], quizScore: null, quizAttempts: 0 };
    const list = data.modules[moduleId].sectionsRead;
    if (!list.includes(sectionId)) {
      list.push(sectionId);
      _save(data);
    }
  }

  /** Check if a section is marked read */
  function isSectionRead(moduleId, sectionId) {
    const m = getModule(moduleId);
    return m.sectionsRead.includes(sectionId);
  }

  /** Get 0-100 percentage of sections read for a module */
  function getModuleReadPercent(moduleId) {
    const module = (window.APP_DATA && window.APP_DATA.modules.find(m => m.id === moduleId));
    if (!module) return 0;
    const total = module.sections.length;
    if (total === 0) return 100;
    const read = getModule(moduleId).sectionsRead.length;
    return Math.round((read / total) * 100);
  }

  /** Save quiz result (score out of total) */
  function saveQuizResult(moduleId, score, total) {
    const data = _load();
    if (!data.modules[moduleId]) data.modules[moduleId] = { sectionsRead: [], quizScore: null, quizAttempts: 0 };
    const m = data.modules[moduleId];
    m.quizAttempts = (m.quizAttempts || 0) + 1;
    // Keep best score
    if (m.quizScore === null || score > m.quizScore) {
      m.quizScore = score;
    }
    _save(data);
  }

  /** Get best quiz score for a module (null if never attempted) */
  function getQuizBest(moduleId) {
    return getModule(moduleId).quizScore;
  }

  /** Save an exam attempt */
  function saveExamAttempt(score, total, timeTaken) {
    const data = _load();
    const passed = score >= Math.ceil(total * 0.7); // 70% pass mark
    data.exam.attempts.push({
      date: new Date().toISOString(),
      score,
      total,
      passed,
      timeTaken
    });
    _save(data);
    return { score, total, passed };
  }

  /** Get all exam attempts */
  function getExamAttempts() {
    return _load().exam.attempts;
  }

  /** Get best exam attempt (or null) */
  function getBestExamAttempt() {
    const attempts = getExamAttempts();
    if (!attempts.length) return null;
    return attempts.reduce((best, a) => (a.score > best.score ? a : best), attempts[0]);
  }

  /** Mark a flashcard as known */
  function markFlashcardKnown(moduleId, cardId) {
    const data = _load();
    if (!data.flashcards[moduleId]) data.flashcards[moduleId] = { known: [] };
    const known = data.flashcards[moduleId].known;
    if (!known.includes(cardId)) {
      known.push(cardId);
      _save(data);
    }
  }

  /** Unmark a flashcard as known */
  function unmarkFlashcardKnown(moduleId, cardId) {
    const data = _load();
    if (!data.flashcards[moduleId]) return;
    data.flashcards[moduleId].known = data.flashcards[moduleId].known.filter(id => id !== cardId);
    _save(data);
  }

  /** Check if a flashcard is known */
  function isFlashcardKnown(moduleId, cardId) {
    const data = _load();
    if (!data.flashcards[moduleId]) return false;
    return data.flashcards[moduleId].known.includes(cardId);
  }

  /** Get overall progress summary */
  function getOverallProgress() {
    const data = _load();
    const moduleIds = ['module-1', 'module-2', 'module-3', 'module-4'];
    let totalSections = 0, readSections = 0, quizzesComplete = 0;

    if (window.APP_DATA) {
      window.APP_DATA.modules.forEach(m => {
        totalSections += m.sections.length;
        readSections += (data.modules[m.id] || {}).sectionsRead
          ? (data.modules[m.id].sectionsRead || []).length
          : 0;
        if ((data.modules[m.id] || {}).quizScore !== null && (data.modules[m.id] || {}).quizScore !== undefined) {
          quizzesComplete++;
        }
      });
    }

    const examPassed = data.exam.attempts.some(a => a.passed);
    const examAttempts = data.exam.attempts.length;
    const bestExam = getBestExamAttempt();

    return {
      totalSections,
      readSections,
      readPercent: totalSections ? Math.round((readSections / totalSections) * 100) : 0,
      quizzesComplete,
      totalQuizzes: moduleIds.length,
      examPassed,
      examAttempts,
      bestExamScore: bestExam ? bestExam.score : null,
      bestExamTotal: bestExam ? bestExam.total : null
    };
  }

  /** Reset all progress (for testing/development) */
  function reset() {
    localStorage.removeItem(KEY);
  }

  return {
    getAll,
    getModule,
    markSectionRead,
    isSectionRead,
    getModuleReadPercent,
    saveQuizResult,
    getQuizBest,
    saveExamAttempt,
    getExamAttempts,
    getBestExamAttempt,
    markFlashcardKnown,
    unmarkFlashcardKnown,
    isFlashcardKnown,
    getOverallProgress,
    reset
  };
})();

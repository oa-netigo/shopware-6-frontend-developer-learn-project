/* ============================================================
   FLASHCARDS — flashcards.html logic
   ============================================================ */

let fcState = {
  allCards: [],       // All cards for current filter
  deck: [],           // Remaining (not-known) cards
  currentIndex: 0,
  currentModuleId: 'all',
  isFlipped: false
};

document.addEventListener('DOMContentLoaded', () => {
  // Mobile nav
  const toggle = document.getElementById('navToggle');
  const nav = document.getElementById('mainNav');
  if (toggle && nav) toggle.addEventListener('click', () => nav.classList.toggle('open'));

  // Populate module filter
  populateFilter();

  // Read URL param
  const params = new URLSearchParams(window.location.search);
  const moduleParam = params.get('module') || 'all';

  const filterEl = document.getElementById('moduleFilter');
  if (filterEl) filterEl.value = moduleParam;

  filterModule(moduleParam);
});

function populateFilter() {
  const select = document.getElementById('moduleFilter');
  if (!select) return;
  APP_DATA.modules.forEach(m => {
    const opt = document.createElement('option');
    opt.value = m.id;
    opt.textContent = `${m.icon} ${m.title} (${m.flashcards.length} cards)`;
    select.appendChild(opt);
  });
}

/* ----------------------------------------------------------
   Filter / load deck
   ---------------------------------------------------------- */
function filterModule(moduleId) {
  fcState.currentModuleId = moduleId;
  fcState.currentIndex = 0;
  fcState.isFlipped = false;

  // Build card list
  let allCards = [];
  if (moduleId === 'all') {
    APP_DATA.modules.forEach(m => {
      m.flashcards.forEach(fc => {
        allCards.push({ ...fc, _moduleId: m.id, _moduleTitle: m.title, _moduleIcon: m.icon });
      });
    });
  } else {
    const m = APP_DATA.modules.find(m => m.id === moduleId);
    if (m) {
      allCards = m.flashcards.map(fc => ({ ...fc, _moduleId: m.id, _moduleTitle: m.title, _moduleIcon: m.icon }));
    }
  }

  fcState.allCards = allCards;

  // Filter out known cards for the deck
  buildDeck();
  updateStats();
  renderCard();

  // Update URL without reload
  const url = new URL(window.location.href);
  url.searchParams.set('module', moduleId);
  window.history.replaceState({}, '', url);
}

function buildDeck() {
  fcState.deck = fcState.allCards.filter(card => {
    return !Progress.isFlashcardKnown(card._moduleId, card.id);
  });
  if (fcState.currentIndex >= fcState.deck.length) {
    fcState.currentIndex = 0;
  }
}

/* ----------------------------------------------------------
   Stats
   ---------------------------------------------------------- */
function updateStats() {
  const total = fcState.allCards.length;
  const known = fcState.allCards.filter(c => Progress.isFlashcardKnown(c._moduleId, c.id)).length;
  const remaining = total - known;

  document.getElementById('totalCount').textContent = total;
  document.getElementById('knownCount').textContent = known;
  document.getElementById('remainingCount').textContent = remaining;
}

/* ----------------------------------------------------------
   Card rendering
   ---------------------------------------------------------- */
function renderCard() {
  const body = document.getElementById('flashcardsBody');
  if (!body) return;

  const { deck, currentIndex, allCards } = fcState;
  const total = allCards.length;
  const known = allCards.filter(c => Progress.isFlashcardKnown(c._moduleId, c.id)).length;
  const remaining = deck.length;

  if (total === 0) {
    body.innerHTML = `
      <div class="fc-empty">
        <h3>No flashcards found</h3>
        <p>Select a different module or check your settings.</p>
        <a href="index.html" class="btn btn-primary">Back to Dashboard</a>
      </div>
    `;
    return;
  }

  if (remaining === 0) {
    body.innerHTML = `
      <div class="fc-all-known">
        <div style="font-size:3rem;margin-bottom:12px">🎉</div>
        <h3>All ${known} cards known!</h3>
        <p>You've marked all flashcards in this set as known.</p>
        <div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap">
          <button class="btn btn-outline" onclick="resetKnown()">↩ Reset & Review Again</button>
          <a href="exam.html" class="btn btn-primary">Take Exam →</a>
        </div>
      </div>
    `;
    updateStats();
    return;
  }

  const card = deck[currentIndex];
  const cardProgress = currentIndex + 1;

  const progressPct = total ? Math.round((known / total) * 100) : 0;

  body.innerHTML = `
    <div class="fc-progress-area">
      <div class="fc-progress-label">
        <span>Known: ${known}/${total}</span>
        <span>${progressPct}%</span>
      </div>
      <div class="progress-wrap">
        <div class="progress-bar success" style="width:${progressPct}%"></div>
      </div>
    </div>

    <div class="fc-counter">Card ${cardProgress} of ${remaining} remaining</div>

    <div class="flashcard-wrap" id="flashcard" onclick="flipCard()">
      <div class="flashcard-inner">
        <div class="flashcard-face flashcard-front">
          <span class="fc-module-tag">${card._moduleIcon} M${APP_DATA.modules.indexOf(APP_DATA.modules.find(m=>m.id===card._moduleId))+1}</span>
          <div class="fc-face-label">Question</div>
          <div class="fc-face-text">${card.front}</div>
          <div class="fc-flip-hint">Click to reveal answer</div>
        </div>
        <div class="flashcard-face flashcard-back">
          <span class="fc-module-tag" style="opacity:0.3">${card._moduleIcon}</span>
          <div class="fc-face-label">Answer</div>
          <div class="fc-face-text">${card.back}</div>
          <div class="fc-flip-hint">Click to flip back</div>
        </div>
      </div>
    </div>

    <div class="fc-nav">
      <button class="btn btn-ghost" onclick="prevCard()" ${currentIndex === 0 ? 'disabled' : ''}>
        ← Prev
      </button>
      <button class="btn btn-known" onclick="markKnown()">
        ✓ Known
      </button>
      <button class="btn btn-primary" onclick="nextCard()">
        Next →
      </button>
    </div>

    <div style="text-align:center;margin-top:8px">
      <button class="btn btn-ghost btn-sm" onclick="skipCard()" style="color:var(--text-muted)">
        Skip (keep in deck)
      </button>
    </div>
  `;
}

/* ----------------------------------------------------------
   Card actions
   ---------------------------------------------------------- */
function flipCard() {
  const card = document.getElementById('flashcard');
  if (!card) return;
  fcState.isFlipped = !fcState.isFlipped;
  card.classList.toggle('flipped', fcState.isFlipped);
}

function nextCard() {
  fcState.currentIndex = (fcState.currentIndex + 1) % fcState.deck.length;
  fcState.isFlipped = false;
  renderCard();
}

function prevCard() {
  fcState.currentIndex = Math.max(0, fcState.currentIndex - 1);
  fcState.isFlipped = false;
  renderCard();
}

function skipCard() {
  nextCard();
}

function markKnown() {
  const card = fcState.deck[fcState.currentIndex];
  if (!card) return;

  Progress.markFlashcardKnown(card._moduleId, card.id);

  // Remove from deck
  fcState.deck.splice(fcState.currentIndex, 1);

  // Adjust index
  if (fcState.currentIndex >= fcState.deck.length) {
    fcState.currentIndex = Math.max(0, fcState.deck.length - 1);
  }

  fcState.isFlipped = false;
  updateStats();
  renderCard();
}

function shuffleDeck() {
  fcState.deck = fcState.deck.sort(() => Math.random() - 0.5);
  fcState.currentIndex = 0;
  fcState.isFlipped = false;
  renderCard();
}

function resetKnown() {
  // Reset known for current filter
  if (fcState.currentModuleId === 'all') {
    APP_DATA.modules.forEach(m => {
      m.flashcards.forEach(fc => {
        Progress.unmarkFlashcardKnown(m.id, fc.id);
      });
    });
  } else {
    const m = APP_DATA.modules.find(m => m.id === fcState.currentModuleId);
    if (m) {
      m.flashcards.forEach(fc => {
        Progress.unmarkFlashcardKnown(m.id, fc.id);
      });
    }
  }

  fcState.currentIndex = 0;
  fcState.isFlipped = false;
  buildDeck();
  updateStats();
  renderCard();
}

// Expose globals
window.filterModule = filterModule;
window.flipCard = flipCard;
window.nextCard = nextCard;
window.prevCard = prevCard;
window.skipCard = skipCard;
window.markKnown = markKnown;
window.shuffleDeck = shuffleDeck;
window.resetKnown = resetKnown;

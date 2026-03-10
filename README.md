# SW Learn — Shopware 6 Certified Frontend Developer

An interactive, self-contained study app for the **Shopware 6 Certified Frontend Developer** certification exam. Open `index.html` directly in your browser — no server, no install, no build step required.

---

## Quick Start

```
open index.html   # macOS
# or double-click index.html in your file explorer
# or drag index.html into your browser
```

That's it. All progress is saved automatically in your browser's `localStorage`.

---

## What's Inside

### 5 Pages

| Page | URL | Description |
|------|-----|-------------|
| Dashboard | `index.html` | Overview of all 4 modules with progress tracking and exam access |
| Reader | `reader.html?module=module-N` | Full course content with collapsible sections and code highlighting |
| Quiz | `quiz.html?module=module-N` | 10-question practice quiz per module with instant feedback |
| Exam | `exam.html` | 50-question timed exam simulator (30 minutes, 70% to pass) |
| Flashcards | `flashcards.html?module=module-N` | 60 flip-cards for quick review, with "Known" tracking |

### 4 Learning Modules

| # | Module | Topics |
|---|--------|--------|
| 1 | **Shopware Storefront Templating** | Twig templating engine, `sw_extends`, `sw_include`, `parent()`, template inheritance, filters, functions |
| 2 | **SCSS and Storefront JavaScript** | 7-1 SCSS pattern, Bootstrap, `PluginManager`, custom JS plugins, async plugin override |
| 3 | **Shopware Theme Development** | `theme:create`, `theme.json`, theme settings/config, SCSS variable overrides |
| 4 | **Storefront Testing & Debugging** | `dump()`, Symfony Profiler, FroshDeveloperHelper, Playwright E2E tests |

### Content Summary

| Type | Count |
|------|-------|
| Course sections | 10 (across all modules) |
| Quiz questions | 40 (10 per module) |
| Certification exam questions | 50 (across all modules) |
| Flashcards | 60 (15 per module) |

---

## Features

### Dashboard
- Module cards with reading progress bars and quiz score badges
- Animated SVG progress ring showing overall study completion
- Quick access to exam, flashcards, and per-module quizzes
- Exam attempt history with best score display

### Course Reader
- Collapsible sections — click headers to expand/collapse
- Sections are **automatically marked as read** as you scroll through them (IntersectionObserver)
- Sidebar table of contents with read/unread dot indicators
- Syntax-highlighted code examples (Twig, SCSS, JavaScript, Bash, JSON) via Prism.js
- Module complete banner appears when all sections are read
- Previous / Next module navigation

### Module Quiz
- Questions are **shuffled** on every load
- No timer — take your time
- Select an option, then click "Next" to reveal:
  - ✅ Correct or ❌ Incorrect feedback
  - Full explanation for every question
- Dot progress bar tracks correct/incorrect per question
- Results screen shows score, pass/fail (≥7/10), and a full question review
- Best score is saved and displayed on the dashboard

### Certification Exam Simulator
- 50 questions drawn from all 4 modules, shuffled every time
- **30-minute countdown timer** — turns red and pulses in the last 5 minutes
- **Auto-submits** when the timer reaches zero
- 50-dot grid navigator — click any dot to jump to any question
- Free navigation: Previous / Next — change your answers anytime before submit
- "Submit Exam" activates only when all 50 questions are answered
- **Results screen includes:**
  - Animated score ring with percentage
  - Pass / Fail verdict (70% = 35/50 required)
  - Time taken
  - Per-module score breakdown
  - Full 50-question review with correct answers and explanations

### Flashcards
- **3D CSS flip animation** — click any card to reveal the answer
- "✓ Known" button removes the card from your current deck
- "Next →" / "← Prev" navigate without marking as known
- Progress bar shows how many cards you've mastered
- **Shuffle** randomizes the deck at any time
- **Reset Known** returns all cards to the deck for another pass
- **Module filter** lets you study one module at a time or all 60 cards

### Progress Tracking
All progress is saved automatically in `localStorage` — no account needed.

- Which sections you've read
- Best quiz score per module
- All exam attempts (date, score, pass/fail, time taken)
- Which flashcards you've marked as "Known"

To reset all progress: open browser DevTools → Application → Local Storage → delete `sw_learn_progress`.

---

## Certification Exam Details

| Property | Value |
|----------|-------|
| Questions | 50 multiple-choice |
| Time limit | 30 minutes |
| Pass mark | 70% (35 correct out of 50) |
| Each question | Exactly one correct answer |
| Topics | Twig, SCSS, JavaScript, Theme Dev, Testing & Debugging |

---

## File Structure

```
learn-shopware/
├── index.html          # Dashboard
├── reader.html         # Course content reader
├── quiz.html           # Practice quiz
├── exam.html           # Exam simulator
├── flashcards.html     # Flashcard study mode
│
├── css/
│   ├── main.css        # Design system (tokens, global layout, shared components)
│   ├── dashboard.css   # Dashboard-specific styles
│   ├── reader.css      # Reader layout, sidebar, collapsible sections
│   ├── quiz.css        # Quiz/exam cards, options, results
│   └── flashcards.css  # Flip animation, card layout
│
├── js/
│   ├── data.js         # All content: modules, quiz Qs, exam Qs, flashcards
│   ├── progress.js     # localStorage abstraction (Progress.* API)
│   ├── dashboard.js    # Dashboard rendering logic
│   ├── reader.js       # Reader: TOC, collapsible, IntersectionObserver
│   ├── quiz.js         # Quiz engine
│   ├── exam.js         # Exam engine: timer, navigator, auto-submit
│   └── flashcards.js   # Flashcard engine: flip, known, shuffle
│
├── PLAN.md             # Technical implementation plan
└── README.md           # This file
```

---

## Technical Notes

- **No framework** — vanilla HTML, CSS, JavaScript only
- **No build step** — works from `file://` protocol directly
- **No external dependencies** except Prism.js (CDN, loaded in `reader.html` only)
- **Fonts** — system font stack (`-apple-system`, `BlinkMacSystemFont`, `Segoe UI`, etc.)
- **Icons** — Unicode emoji only, no icon library
- **Responsive** — tested at 768px (tablet) and 480px (mobile) breakpoints
- **Browsers** — Chrome, Firefox, Safari, Edge (all modern versions)

### Adding or Editing Content

All course content, questions, and flashcards are in `js/data.js` as a single `window.APP_DATA` object. To edit content, add questions, or fix answers — that's the only file you need.

```js
// Question format:
{
  id: 'eq-51',
  moduleId: 'module-1',
  question: 'Your question text here?',
  options: ['Option A', 'Option B', 'Option C', 'Option D'],
  correct: 1,  // zero-based index
  explanation: 'Explanation shown after answering.'
}
```

---

## Source Material

Based on the official **Shopware Academy** learning path:

- `Shopware Frontend Development Essentials.txt`
- `01-Shopware Storefront Templating.txt`
- `02-SCSS and Storefront JavaScript.txt`
- `03-Shopware Theme Development.txt`
- `04-Shopware Storefront Testing and Debugging.txt`
- `Certification Test Shopware 6 Certified Frontend Developer – Certification.txt`

Community comments from each course section are incorporated into the content where they add clarification (e.g., `plugin:refresh` requirement before install, async plugin override pattern, CSS class name changes in Shopware 6.7).

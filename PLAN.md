# Project Plan: SW Learn — Shopware 6 Frontend Developer

## Goal

Build a self-contained, browser-openable interactive learning app (pure HTML/CSS/JS, no build step) that turns the 4 Shopware Academy course text files + certification info into a structured study experience. The goal is to help developers prepare for and pass the **Shopware 6 Certified Frontend Developer** exam (50 questions, 30 minutes, 70% to pass).

---

## Problem Statement

The source material exists as plain text files covering four courses:

1. Shopware Storefront Templating (Twig)
2. SCSS and Storefront JavaScript
3. Shopware Theme Development
4. Shopware Storefront Testing and Debugging

There is no interactive way to study, test knowledge, or simulate the actual certification exam. This project solves that.

---

## Architecture Decisions

### No Framework, No Build Step
The app uses vanilla HTML, CSS, and JavaScript only. It opens directly from `file://` in any browser without a local server, npm install, or build command. This keeps it portable and simple to maintain.

### Single Data File (`js/data.js`)
All content — course sections, quiz questions, exam questions, flashcards — lives in one `window.APP_DATA` object. This makes the content easy to update and keeps JavaScript logic separate from data.

### localStorage for Progress
User progress (sections read, quiz scores, exam attempts, flashcards known) is persisted in a single `sw_learn_progress` key via the `window.Progress` API abstraction in `progress.js`. No backend required.

### Shared CSS, Page-Specific CSS
`css/main.css` defines the design system (tokens, layout, shared components). Each page has its own CSS file for page-specific layout. This avoids specificity conflicts without requiring a CSS preprocessor.

---

## File & Folder Structure

```
/var/www/learn-shopware/
│
├── index.html          # Dashboard: module cards + overall progress
├── reader.html         # Course content reader
├── quiz.html           # Per-module practice quiz
├── exam.html           # Certification exam simulator
├── flashcards.html     # Flashcard flip mode
│
├── css/
│   ├── main.css        # Design tokens, global layout, shared components
│   ├── dashboard.css   # Module cards, progress ring, quick actions
│   ├── reader.css      # Sidebar TOC, collapsible sections, code blocks
│   ├── quiz.css        # Quiz/exam question cards, options, results
│   └── flashcards.css  # 3D flip animation, card layout
│
├── js/
│   ├── data.js         # ALL content: 4 modules, 50 exam Qs, 40 quiz Qs, 60 flashcards
│   ├── progress.js     # localStorage abstraction layer (Progress.* API)
│   ├── dashboard.js    # Renders cards with live progress data
│   ├── reader.js       # TOC, collapsible sections, IntersectionObserver, Prism.js
│   ├── quiz.js         # Quiz engine: shuffle, answer feedback, results screen
│   ├── exam.js         # Timer, 50-Q dot navigator, auto-submit, results
│   └── flashcards.js   # Flip animation, "known" tracking, shuffle, module filter
│
├── PLAN.md             # This file
└── README.md           # Project overview and usage guide
```

---

## Feature Specification

### 1. Dashboard (`index.html`)
- 4 module cards, each showing:
  - Reading progress bar (sections read / total sections)
  - Quiz best score badge (or "Not attempted")
  - "Read Module" button → `reader.html?module=module-N`
  - "Take Quiz" button → `quiz.html?module=module-N`
  - "Flashcards" icon button → `flashcards.html?module=module-N`
- Animated SVG progress ring showing weighted overall progress
- Quick action area: exam CTA + exam attempt history
- Mobile responsive (cards stack to 1 column)

### 2. Course Reader (`reader.html?module=module-N`)
- 3-column layout: Sidebar TOC | Content | Quick Nav
- Collapsible sections with chevron animation
- `IntersectionObserver` auto-marks sections as read when 50%+ visible
- Prism.js syntax highlighting (Twig, SCSS, JS, Bash, JSON)
- TOC dots: grey = unread, green = read, blue = active
- Module complete banner appears when all sections are read
- Previous/Next module navigation
- Responsive: sidebar collapses to top on mobile

### 3. Module Quiz (`quiz.html?module=module-N`)
- 10 questions per module, shuffled on each load
- No timer — untimed practice
- Option click highlights selection; "Next" button submits
- After submit: reveals correct/incorrect with explanation text
- Dot progress indicators (green = correct, red = incorrect)
- Results screen: score, pass/fail (≥7/10 = 70%), full question review
- Saves best score to progress; "Retry" reloads with reshuffled questions

### 4. Certification Exam Simulator (`exam.html`)
- 50 questions shuffled on each load, drawn from all 4 modules
- 30:00 countdown timer; turns red + pulses at 5 minutes remaining
- Auto-submits when timer reaches 0
- 50-dot grid navigator (grey = unanswered, dark = answered, blue = current)
  - Click any dot to jump to that question
- Free navigation: Previous / Next buttons
- Can change answer any time before submit
- "Submit Exam" button activates only when all 50 questions are answered (or on auto-submit)
- Results screen:
  - Animated score ring: score/50, percentage
  - Verdict: Pass (≥35/50 = 70%) or Fail
  - Time taken
  - Per-module score breakdown (4 cards)
  - Full 50-question review with correct answers + explanations

### 5. Flashcards (`flashcards.html`)
- URL param: `?module=module-N` or `?module=all`
- 60 total cards (15 per module)
- CSS 3D perspective flip animation on click (front = question, back = answer)
- "✓ Known" button removes card from current deck and persists to localStorage
- "Next →" / "← Prev" navigate without marking known
- Progress bar showing known / total
- "Shuffle" randomizes deck order
- "Reset Known" returns all marked cards to the deck (per current filter)
- Module filter dropdown changes active card set

---

## Data Model

All data lives in `js/data.js` as `window.APP_DATA`.

### Module Object
```js
{
  id: 'module-1',
  title: 'Shopware Storefront Templating',
  icon: '📄',
  color: '#189eff',
  description: '...',
  sections: [ SectionObject ],
  quiz: [ QuestionObject ],
  flashcards: [ FlashcardObject ]
}
```

### Section Object
```js
{
  id: 'section-1-1',
  title: 'Getting Started with Twig',
  content: '...HTML string with <pre><code class="language-twig"> blocks...'
}
```

### Question Object (quiz and exam)
```js
{
  id: 'q-m1-01',          // or 'eq-01' for exam
  moduleId: 'module-1',   // exam questions reference their source module
  question: 'What command creates a new Shopware plugin?',
  options: ['option A', 'option B', 'option C', 'option D'],
  correct: 1,             // zero-based index of correct option
  explanation: 'Explanation text shown after answering.'
}
```

### Flashcard Object
```js
{
  id: 'fc-m1-01',
  front: 'What is sw_extends?',
  back: 'Answer text...'
}
```

---

## Progress Tracking (`js/progress.js`)

**localStorage key:** `sw_learn_progress`

**Structure:**
```js
{
  modules: {
    'module-1': {
      sectionsRead: ['section-1-1', 'section-1-2'],
      quizScore: 8,         // best score out of 10
      quizAttempts: 2
    }
  },
  exam: {
    attempts: [
      { date, score, total, passed, timeTaken }
    ]
  },
  flashcards: {
    'module-1': { known: ['fc-m1-01', 'fc-m1-05'] }
  }
}
```

**Public API:**
```js
Progress.markSectionRead(moduleId, sectionId)
Progress.isSectionRead(moduleId, sectionId)
Progress.getModuleReadPercent(moduleId)      // 0–100
Progress.saveQuizResult(moduleId, score, total)
Progress.getQuizBest(moduleId)
Progress.saveExamAttempt(score, total, timeTaken)
Progress.getExamAttempts()
Progress.getBestExamAttempt()
Progress.markFlashcardKnown(moduleId, cardId)
Progress.unmarkFlashcardKnown(moduleId, cardId)
Progress.isFlashcardKnown(moduleId, cardId)
Progress.getOverallProgress()
Progress.reset()
```

---

## Design System

| Token              | Value        | Usage                        |
|--------------------|--------------|------------------------------|
| `--sw-blue`        | `#189eff`    | Primary actions, links       |
| `--sw-blue-dark`   | `#0f7acc`    | Hover states                 |
| `--sw-blue-light`  | `#e8f5ff`    | Selected state backgrounds   |
| `--sw-dark`        | `#0d2438`    | Header, dark backgrounds     |
| `--sw-dark-alt`    | `#1a3a52`    | Hero gradients               |
| `--sw-success`     | `#28a745`    | Correct answers, known cards |
| `--sw-danger`      | `#dc3545`    | Incorrect answers, fail      |
| `--sw-light-bg`    | `#f4f8fc`    | Page background              |
| `--sw-border`      | `#d0e4f5`    | Card borders, dividers       |

**Fonts:** System font stack (no external font loading)
**Icons:** Unicode emoji only (no icon library)
**Code highlighting:** Prism.js 1.29.0 via CDN (reader.html only)
**Responsive breakpoints:** 768px (tablet), 480px (mobile)

---

## Content Coverage

### Module 1 — Shopware Storefront Templating (3 sections)
- Getting Started with Twig: plugin:create, plugin:refresh, file mirroring, base.html.twig, Hello World verification, cache:clear
- Twig Blocks: sw_extends, parent(), sw_include, with keyword, ignore missing, template inheritance order, FroshDeveloperHelper
- Twig Features: set, if/else, for loop, loop.index, |default, |currency, |sw_sanitize, config(), dump()

### Module 2 — SCSS and Storefront JavaScript (2 sections)
- Custom SCSS: 7-1 pattern, base.scss entry, variables.scss, mixins.scss, @import vs @use (scssphp), Bootstrap grid/buttons/utils, theme:compile, watch-storefront.sh
- Custom JS: PluginManager.register/override, plugin.class, init(), data-* attribute linking, main.js entry, build-storefront.sh, extending vs overriding, async plugin dynamic import

### Module 3 — Shopware Theme Development (3 sections)
- Creating a Theme: theme:create, theme.json (views/style/script/asset/configInheritance), plugin theme vs app theme, theme:change, Admin location
- Theme Settings: config fields (color type), tabs/blocks/sections hierarchy, inherited fields from vendor/shopware/storefront/theme.json, theme CLI commands
- Override SCSS Variables: overrides.scss must be first, $btn-border-radius variants, $border-radius, direct CSS when no variable exists

### Module 4 — Shopware Storefront Testing and Debugging (2 sections)
- Debugging: APP_ENV=dev, dump(), FroshDeveloperHelper (HTML comments + Symfony Profiler tab), Symfony Profiler (Twig panel), HMR watcher for SCSS source maps, Browser DevTools, Meteor Shopware 6 Toolkit
- Playwright E2E: replaces Cypress since 6.7, tests/acceptance/ folder structure, playwright.config.ts, BaseTestFile.ts, test writing with TestDataService, run locally with --ui or CLI, CI GitHub Actions params

---

## Content Counts

| Type              | Count | Distribution                        |
|-------------------|-------|-------------------------------------|
| Course sections   | 10    | 3 + 2 + 3 + 2 per module            |
| Quiz questions    | 40    | 10 per module                       |
| Exam questions    | 50    | ~13 M1, ~13 M2, ~12 M3, ~12 M4     |
| Flashcards        | 60    | 15 per module                       |

---

## Implementation Order

The project was built in this order to respect dependencies:

1. **`css/main.css`** — design tokens and shared components (all pages depend on this)
2. **`js/data.js`** — all content (all page JS depends on this)
3. **`js/progress.js`** — localStorage API (all page JS depends on this)
4. **`index.html` + `css/dashboard.css` + `js/dashboard.js`**
5. **`reader.html` + `css/reader.css` + `js/reader.js`**
6. **`quiz.html` + `css/quiz.css` + `js/quiz.js`**
7. **`exam.html` + `js/exam.js`** (reuses `quiz.css`)
8. **`flashcards.html` + `css/flashcards.css` + `js/flashcards.js`**

---

## Verification Checklist

- [ ] Open `index.html` directly in Chrome/Firefox — dashboard loads with 4 module cards
- [ ] Click "Start Reading" on a module — reader loads with collapsible sections
- [ ] Scroll through all sections — TOC dots turn green, progress bar fills
- [ ] Click "Take Quiz" — 10 shuffled questions, feedback shown, score saved to dashboard
- [ ] Open `exam.html` — 50 questions load, timer counts down from 30:00
- [ ] Answer all 50 questions and submit — results screen shows score, pass/fail, review
- [ ] Let timer expire — exam auto-submits
- [ ] Open flashcards, flip a card — 3D CSS animation works
- [ ] Mark cards as "Known" — they disappear from deck; progress bar fills
- [ ] Refresh the page — all progress persists (localStorage)
- [ ] Open DevTools → Application → localStorage → clear `sw_learn_progress` — all progress resets
- [ ] Resize to 480px — responsive layout works on all pages

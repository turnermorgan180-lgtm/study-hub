# Study Hub HTML Style Guide

This guide is derived from:

- `Business-Economics-Exam-Hub.html`
- `lecture11.html`
- `lecture12-13.html`

It is intended for future agents creating or extending pages in this workspace.

## 1. Core Design Identity

The project uses a polished academic-editorial style rather than a generic app UI.

- Tone: premium revision guide, calm, structured, exam-focused.
- Layout: narrow reading column, generous vertical rhythm, high readability.
- Typography contrast: elegant serif for major headings, clean sans-serif for body, monospace for labels/meta.
- Visual language: restrained, paper-like lecture pages and a darker, more dashboard-like hub page.
- Motion: minimal and purposeful only. Small fade/slide reveals and subtle hover shifts are acceptable.

## 2. Page Archetypes

There are two distinct page types.

### A. Hub Page

Use for index/navigation pages like `Business-Economics-Exam-Hub.html`.

- Dark background.
- Dense but tidy overview structure.
- Card/button-driven navigation.
- Compact stats and status indicators.
- Slightly more app-like than the lecture pages.

### B. Lecture / Revision Guide Page

Use for content-heavy pages like `lecture11.html` and `lecture12-13.html`.

- Warm off-white background.
- Long-form, highly readable notes layout.
- Strong hero section followed by structured sections.
- Reusable callout components for definitions, evaluation, mistakes, exam questions, and diagram logic.

Future agents should preserve this split. Do not make lecture pages look like dashboards, and do not make hub pages look like long essay documents.

## 3. Typography System

### Hub Page Typography

- Main heading: `Playfair Display`
- Body: `DM Sans`
- Labels/meta: `DM Mono`

### Lecture Page Typography

- Main heading and section headings: `Cormorant Garamond`
- Body: `DM Sans`
- Labels/meta: `DM Mono`

### Typographic Roles

- `h1`: large, elegant, editorial, often split across two lines.
- `h2`: serif section title with bottom border.
- `h3`: smaller serif subheading, often italic.
- Small labels: uppercase monospace with increased letter spacing.
- Body copy: 14–16px range, relaxed line-height around `1.6–1.7`.

Do not replace these fonts with default system stacks unless external font loading is impossible.

## 4. Color System

### Lecture Pages

Base palette is warm and paper-like:

- Background: warm off-white
- Secondary background: light parchment
- Surface: white
- Text: deep brown/ink
- Muted text: soft taupe
- Border: warm beige

Semantic accents:

- Blue accent: structure, hero tag, info callouts, exam relevance
- Gold accent: definitions, key formulas, high-value concepts
- Teal accent: evaluation, insight, macro/micro chips
- Red accent: mistakes, warnings

### Hub Page

Base palette is dark and muted:

- Background: near-black charcoal
- Surfaces: layered dark greys
- Text: warm off-white
- Muted text: cool grey
- Accent gold: premium focal color

Secondary accents:

- Blue: microeconomics
- Purple: macroeconomics
- Green: completed/done states
- Red: high-priority/hot states

## 5. Layout Rules

### Lecture Pages

- Main content width: about `860px` max.
- Horizontal padding: `2rem`, reduced on mobile.
- Hero gets large top padding and a soft gradient wash.
- Sections are separated by generous vertical spacing.
- Reading flow is linear and calm, never cluttered.

### Hub Page

- Main content width: about `780px`.
- Use stacked content blocks with clear section headings.
- Buttons/cards should fill the width and align cleanly.

## 6. Component Library

Future agents should reuse these patterns instead of inventing new component styles for each page.

### Shared Lecture Components

`hero`

- Contains lecture tag, title, summary, and meta chips.
- Has a subtle top-down gradient background.

`back-btn`

- Circular floating back control.
- Minimal, light, slightly elevated.
- Keep implementation consistent across lecture pages.

`alert-box`

- Early-page exam relevance note.
- Blue-tinted, left-border emphasis.

`toc`

- Two-column contents grid on desktop, one column on mobile.
- Links use small numbered prefixes via `data-num`.

`section`

- Standard content block with fade-up entry animation.

`defn`

- Gold-toned box for definitions, formulas, and memory anchors.

`key-terms` / `term`

- Grid of compact definition cards.

`compare-table`

- Lightweight academic table.
- Monospace uppercase headers, restrained borders.

`eval-box`

- Teal box for evaluation, judgement, implications, exam insight.

`mistake-box`

- Red box for common mistakes and pitfalls.

`logic-box` / `diagram-box`

- Structured box for diagram explanation or process logic.

`steps`

- Numbered vertical process flow with oversized serif numerals.

`exam-q`

- Framed exam-style prompt with dark header bar and marks badge.

`footer`

- Thin, quiet, metadata-driven closing line.

### Shared Hub Components

`stats` / `stat`

- Small dashboard cards for key exam facts.

`alert`

- Compact status or exam-format messaging.

`section-head`

- Small label + colored pill to group lecture clusters.

`topic-btn`

- Full-width row button with lecture badge, optional status dot, text, and arrow.

`practice-btn`

- Compact action card for practice resources.
- Every module hub should include an `Exam Practice` section built from these buttons where assessment materials exist.
- Default local exam-practice set:
  - `exam-qs/mcq-drill.html`
  - `exam-qs/written-answers.html`
  - one walkthrough page per past-paper year when files are available
- Prefer local HTML practice pages over external AI links so transitions, back buttons, and module styling remain consistent.
- When real papers and solutions exist, practice pages should be grounded in those files rather than generic prompt-style placeholders.

`chip`

- Rounded lightweight filter or quick-link element.

`legend`

- Small supporting explanation for status dots.

`done-dot` and `hot-dot`

- Hub pages should follow the Business Economics convention:
- every completed lecture or seminar item keeps a green `done-dot`
- exam-important items show an additional red `hot-dot` alongside the green one, not instead of it
- include a small legend explaining `done-dot = completed` and `hot-dot = high exam priority`

## 7. Copywriting Style

The copy is as important as the visuals. Future agents should match the writing pattern closely.

- Write in a confident teaching voice.
- Prioritize exam usefulness over encyclopedic completeness.
- Lead with the core economic logic, then consequences, then evaluation.
- Prefer short, direct paragraphs over dense blocks.
- Use exact causal chains:
  `problem -> mechanism -> outcome -> exam interpretation`
- Frequently convert theory into exam language:
  `what to say`, `how to describe the diagram`, `common mistake`, `model answer`.

### Good Content Patterns

- “The market therefore underproduces the good.”
- “The stronger answer is…”
- “Do not stop at…”
- “In diagram terms…”
- “The mark-scoring step is…”

### Avoid

- Casual marketing language
- Generic productivity-app phrasing
- Overly technical jargon without exam payoff
- Large unstructured walls of text

## 8. Interaction and Motion

The current style uses restrained motion.

- Hover states should be subtle.

## 9. Standard Module Features

Future agents should treat the following as the default complete module package unless the user explicitly asks for something narrower:

- module hub page
- lecture note pages
- seminar answer pages where seminar materials exist
- `resources/` folder
- `exam-qs/` folder
- exam-practice section on the hub
- local random practice pages and past-paper walkthrough pages when exam materials exist

Exam-practice pages should match the same editorial tone as the rest of the module:

- concise exam labels in monospace
- clear year / question markers
- model answers written in the same teaching voice as lecture and seminar pages
- direct links back to uploaded paper and solution PDFs when available
- Translate or fade by a few pixels only.
- Avoid bouncy, flashy, or ornamental animation.
- Motion should support hierarchy, not draw attention to itself.

## 9. Responsiveness

Mobile behavior is simple and pragmatic.

- Collapse multi-column grids to one column.
- Reduce `h1` size significantly.
- Preserve generous side padding, but tighten from `2rem` to around `1.25rem`.
- Keep lecture pages highly readable rather than trying to fit more UI above the fold.

## 10. Implementation Rules for Future Agents

When adding a new lecture page:

1. Start from the lecture-page architecture already used in `lecture11.html` and `lecture12-13.html`.
2. Keep the same font trio and the same warm lecture palette.
3. Include, in order:
   lecture back button, hero, alert box, table of contents, key definitions, numbered sections, exam questions, evaluation/mistakes, footer.
4. Use existing callout classes where possible instead of inventing new ones.
5. Keep section headings elegant and concise.
6. Keep exam utility explicit throughout the prose.

When editing the hub page:

1. Preserve the dark-theme navigation identity.
2. Add content as buttons/cards, not dense prose blocks.
3. Keep status communication compact and scannable.
4. Use color semantically: gold for primary emphasis, blue/purple for topic grouping, green/red for state.

## 11. Consistency Notes

There is one visible implementation inconsistency in the current files:

- `lecture11.html` uses the back button class directly on the anchor.
- `lecture12-13.html` wraps the anchor inside a `.back-btn` div.

Future agents should standardize on the cleaner direct-anchor pattern used in `lecture11.html`.

## 12. Do / Don’t Summary

Do:

- Keep pages elegant, academic, and exam-oriented.
- Use serif headings + sans body + monospace labels.
- Reuse the existing semantic callout colors.
- Make content feel authored, not autogenerated.
- Maintain high information density without visual clutter.

Don’t:

- Introduce generic SaaS styling.
- Swap to bright gradients, neon colors, or oversized rounded UI.
- Over-animate.
- Flatten the hierarchy by making every block look the same.
- Write vague summaries when the page should teach exam logic.

## 13. Recommended Reuse Strategy

For future work, treat `lecture11.html` as the best lecture-page baseline and `Business-Economics-Exam-Hub.html` as the hub-page baseline. Extend them by copying structure first, then changing content, rather than designing each new page from scratch.

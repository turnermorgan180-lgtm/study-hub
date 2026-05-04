# Future Agent Instructions

This workspace has an internal build tracker at:

- `development-checklist.html`

Follow these rules on every relevant task:

## 1. Capture New User Ideas

If the user gives a new feature idea, structural change, content requirement, or build request for Study Hub, add it to the internal to-do system instead of leaving it only in chat.

That means you should update `development-checklist.html` to reflect the new requirement when appropriate.

## 2. Keep Lecture Status Accurate

The current `year 1 / sem 2 / mod1` module has **17 lectures**.

When you create a lecture HTML file for a module:

- update the relevant lecture entry in `development-checklist.html`
- change its status from `To do` to `Done`
- tick its checkbox

If one file covers multiple lectures, mark each covered lecture as complete and note the shared file in the checklist.

## 3. Reflect Real Folder Structure

Do not use placeholder paths if the real folder structure is already known.

Checklist paths and landing-page links should match the actual on-disk structure exactly.

## 4. Treat The Checklist As Operational State

`development-checklist.html` is not just documentation. It is the current build-status record for the project.

If you change:

- folder structure
- landing-page routing
- lecture coverage
- module completeness
- exam asset requirements

then update the checklist accordingly in the same task where practical.

## 5. Build Exam Practice For Every Module

Every module should include an exam-practice area as part of the standard build, not as an optional extra.

That means future agents should create and maintain:

- an `exam-qs/` folder inside each module directory when exam or revision materials exist
- a hub-page `Exam Practice` section using the existing `practice-btn` style
- a local `mcq-drill.html` page when the module has MCQ-style assessment or this can be usefully inferred from past papers
- a local `written-answers.html` page for longer-form exam practice when written questions exist
- local past-paper walkthrough pages for each uploaded paper year where question and/or solution files are available

When real past papers or solution guides are uploaded, exam-practice pages should be rebuilt from those real files rather than left as generic or style-matched placeholders.

If a module does not yet have exam papers, agents should still leave the folder structure ready and use the best available module materials to create practice pages where sensible.

## 6. Keep Exam Practice Wired Into Navigation

When adding or updating a module hub, make sure the exam-practice buttons point to local Study Hub pages rather than external AI links.

Use local HTML pages inside the module wherever practical so they inherit the project transition behaviour, back-button chain, and visual style.

## 7. Maintain Detailed Lecture Notes

Every new lecture-notes page should maintain the same high-detail standard as the strongest existing Study Hub lecture pages.

Do not create thin summaries unless the user explicitly asks for a brief revision-only page. For normal lecture pages, include:

- a clear lecture title, module context, and source-material references
- a structured contents section with navigable topic coverage
- detailed explanations of the lecture concepts in plain English
- definitions for key terms and formulas where relevant
- worked examples, calculation steps, or applied interpretation where the topic needs them
- links between lecture content, seminar questions, exam practice, formula sheets, and uploaded resources where useful
- common mistakes, exam angles, or revision priorities when they can be inferred from the materials

When source files are available, build from the actual uploaded slides, seminar sheets, readings, datasets, past papers, or solution files rather than inventing generic notes. The goal is for each lecture page to be useful as a complete study resource without the user needing to ask for extra depth.

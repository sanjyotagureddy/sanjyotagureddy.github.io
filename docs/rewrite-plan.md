# Portfolio Rewrite Plan

Date: 2026-07-31
Goal: Rebuild the portfolio from scratch with a modern stack while staying fully compatible with GitHub Pages static hosting.

## Constraints
- Must deploy to GitHub Pages.
- Final output must be static HTML/CSS/JS assets.
- Legacy text content must be preserved and reused.

## Chosen Direction
- Build tool: Vite
- Language: HTML, CSS, JavaScript (can upgrade to TypeScript later)
- Hosting: GitHub Pages using build output from dist

## Information Sources
- Legacy text backup: docs/legacy-content-backup.md
- Existing assets to reuse selectively: images/, docs/resume.pdf

## Phase 1: Setup and Structure
1. Initialize a clean Vite project in the current repository.
2. Create sections as modular files/components:
   - Hero
   - About
   - Experience
   - Projects
   - Education
   - Contact
3. Create a single source data file for timeline and links.

Done criteria:
- Local dev server runs.
- Static build generates dist.

## Phase 2: Design System
1. Define CSS variables for typography, spacing, colors, and motion.
2. Implement a strong visual theme that is modern and responsive.
3. Add accessible dark/light mode with local storage persistence.

Done criteria:
- Mobile and desktop layouts are complete.
- Color contrast passes basic accessibility checks.

## Phase 3: Content Migration
1. Move plain text from backup into the new sections.
2. Rewrite wording to be sharper and concise where needed.
3. Keep role history accurate and date ordered.

Done criteria:
- All legacy content represented.
- No placeholder text remains.

## Phase 4: Interactions and Performance
1. Smooth section reveal animations and polished navigation.
2. Optimize images and lazy-load heavy assets.
3. Remove unnecessary dependencies and legacy iframe risks if needed.

Done criteria:
- Lighthouse performance and accessibility improve from baseline.

## Phase 5: GitHub Pages Delivery
1. Add GitHub Actions workflow for build and deploy.
2. Configure base path for repo pages if required.
3. Validate all internal links and resume download path.

Done criteria:
- Successful deployment from main branch to Pages.

## Execution Order
1. Set up Vite scaffold and folder architecture.
2. Build new layout and visual system.
3. Migrate content from backup.
4. Add interactions and accessibility improvements.
5. Configure and verify GitHub Pages deployment.

## Risks and Mitigations
- Risk: Path issues in GitHub Pages.
  - Mitigation: Use relative paths or Vite base config for repository deployment.
- Risk: Content mismatch after rewrite.
  - Mitigation: Use docs/legacy-content-backup.md as migration checklist.
- Risk: Mobile regressions.
  - Mitigation: Test at common breakpoints during each phase.

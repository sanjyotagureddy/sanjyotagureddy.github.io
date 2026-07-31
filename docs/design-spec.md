# Portfolio Design and Tech Specification

Date: 2026-07-31
Status: Approved for implementation

## Final Decisions
- Design direction: Bold Editorial with enterprise polish.
- Tech stack: Vite + Vanilla JavaScript + Modular CSS (static output).
- Include projects section: Yes.
- Copy tone: Hybrid (professional + approachable).
- Color strategy: Warm theme with dark-mode toggle.

## Why This Is Best Long-Term
- Vite gives modern DX, fast local dev, and simple static output for GitHub Pages.
- Modular CSS keeps styling maintainable without framework lock-in.
- Data-driven sections allow easy updates to experience and projects.
- Bold editorial visual language helps the portfolio stand out while retaining senior-level credibility.

## Experience Goals
1. Clear personal brand in first screen.
2. Strong career narrative with measurable impact.
3. Fast page load and smooth interactions.
4. Easy content updates without layout rewrites.
5. Full responsiveness and accessibility.

## Site Architecture
1. Hero
- Name, role, short value proposition.
- Primary CTA: Contact.
- Secondary CTA: Download resume.

2. About
- 5-7 line profile summary.
- Core strengths chips (architecture, APIs, cloud, leadership).

3. Experience
- Data-driven timeline/cards.
- Role, company, year range, summary, responsibilities.

4. Projects
- 3-6 featured projects.
- Problem, solution, stack, impact, links.

5. Skills
- Grouped by backend, cloud, data, tooling.

6. Education
- Degree/institution details.

7. Contact
- Email, LinkedIn, GitHub, optional form-free CTA.

## Visual System
### Typography
- Heading: Sora (bold, modern geometric character).
- Body: Manrope (clean readability).
- Mono accents (optional): JetBrains Mono for tiny metadata labels.

### Color Tokens (Warm Primary)
- Background: soft warm ivory.
- Surface: warm white.
- Primary: burnt orange/terracotta.
- Accent: amber.
- Text: charcoal.
- Muted text: warm gray.

Dark mode tokens:
- Background: deep espresso/graphite.
- Surface: warm dark slate.
- Primary: copper/orange highlight.
- Text: warm off-white.

### Layout and Rhythm
- Max content width: 1120px.
- Spacing scale: 4, 8, 12, 16, 24, 32, 48, 64, 96.
- Card radius: 16px.
- Depth: soft layered shadows, stronger on hover.

### Motion
- Section reveal on scroll with subtle stagger.
- Card hover lift with reduced-motion fallback.
- Theme toggle transition for color variables only.

## Accessibility and Performance
- WCAG-conscious contrast for both themes.
- Keyboard-focus outlines on interactive elements.
- Respect prefers-reduced-motion.
- Lazy load non-critical images.
- Keep total JS lightweight and dependency-minimal.

## Content Model
Use plain data files for easy maintenance:
- src/data/profile.js
- src/data/experience.js
- src/data/projects.js
- src/data/skills.js
- src/data/contact.js

## GitHub Pages Compatibility
- Build output: dist
- Use relative asset paths or configured base path.
- Deploy through GitHub Actions workflow.

## Implementation Plan (Next)
1. Scaffold Vite structure in current repo.
2. Build design tokens and base layout.
3. Implement sections and data-driven rendering.
4. Migrate legacy text from docs/legacy-content-backup.md.
5. Add dark-mode persistence.
6. Configure GitHub Pages deployment workflow.

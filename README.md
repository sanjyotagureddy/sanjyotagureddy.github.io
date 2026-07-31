# Sanjyot Agureddy Portfolio

Modern static portfolio scaffold built with Vite and vanilla JavaScript.
This project is intentionally non-SPA: content is authored in static HTML and enhanced with lightweight JavaScript.

## Tech Stack
- Vite
- Vanilla JavaScript (ES Modules)
- Modular CSS

## Project Structure
- src/styles: tokens, base, layout, components, sections, utilities
- src/utils: theme handling and small UI utilities
- docs: content and planning sources
- images: reusable media assets

## Local Development
1. Install dependencies:
   npm install
2. Start dev server:
   npm run dev
3. Build for production:
   npm run build
4. Preview production build:
   npm run preview

## How To Update Content
- Main content: index.html
- Theme and layout styling: src/styles/
- Client-side enhancements only: src/main.js and src/utils/

## Why This Scaffold Is Maintainable
- Content and presentation are separated.
- Theme tokens are centralized in src/styles/tokens.css.
- Content is static and crawlable with no client-side rendering dependency.
- Build output stays static for GitHub Pages deployment.

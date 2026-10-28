# VEXORIA — Enter the Next Dimension

A responsive cyberpunk landing page built with React, Vite, and CSS. The experience combines a neon city hero, a cybernetic character, a compact navigation bar, social links, and a scroll-driven perspective tunnel with dimension cards.

## Features

- Responsive hero layout for desktop and mobile screens.
- Neon-pink visual theme with a translucent navigation bar.
- Animated hero entrance and subtle atmospheric effects.
- Mouse-based parallax on supported desktop pointers.
- Animated Home, About, and Games navigation borders.
- Cyberpunk-style Join Us button.
- Explore More image button that scrolls to the dimension section.
- Left-side social links rail.
- Scroll-driven perspective tunnel with nine staggered cards and a progress indicator.
- Mobile navigation menu and reduced-motion support.
- Locally stored image assets; no additional animation library is required.

## Requirements

- Node.js (an active LTS version is recommended)
- npm

## Run locally

1. Open a terminal in the project folder.
2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

4. Open the local URL printed by Vite in your terminal.

## Production build

Create an optimized production build:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

The generated production files are placed in `dist/`.

## Project structure

```text
vexora-landing-page/
├── index.html
├── package.json
├── README.md
├── LICENSE
└── src/
    ├── main.jsx
    ├── App.jsx
    ├── styles.css
    └── assets/
        ├── city-bg.png
        ├── city-lower-extension.png
        ├── char.png
        ├── vexora-text.png
        ├── hero_text.png
        ├── explore.png
        └── ship.png
```

## Important files

- `src/App.jsx` — React layout, navigation actions, image loading, hero entrance sequence, parallax input, and scroll-driven tunnel-card movement.
- `src/styles.css` — theme colours, layout, responsive breakpoints, button effects, and animations.
- `src/assets/` — local artwork used by the hero and tunnel cards.
- `index.html` — page title, viewport settings, theme colour, and description.
- `package.json` — project dependencies and npm scripts.

## Customization

### Theme and navigation

Open `src/styles.css` and look near the top for the CSS custom properties. These control the main pink accent, page colours, navigation transparency, blur, border, and hover-line appearance. The same file contains responsive rules and animation timings.

### Hero artwork

Replace the relevant image in `src/assets/` while keeping the filename the same, or update its import in `src/App.jsx` if you use a different filename.

- `city-bg.png` — hero city background.
- `char.png` — hero character and character cards.
- `hero_text.png` — main VEXORIA wordmark image.
- `explore.png` — Explore More button artwork.
- `ship.png` — spaceship used in the hero fly-by.
- `city-lower-extension.png` — lower-city background used by the tunnel section.
- `vexora-text.png` — wordmark artwork used in tunnel cards.

### Navigation and social links

The navigation actions are defined in `src/App.jsx`. The current social links point to each platform's general website. Replace the `href` values in the `socialLinks` array with the project's real profile URLs before publishing.

### Tunnel cards

The card titles and artwork mappings are listed in the `tunnelCards` array near the top of `src/App.jsx`. Scroll progress, card spacing, depth, and movement are handled by the scroll effect in the same file; card appearance is styled in `src/styles.css`.

## Notes

- The Join Us, About, and Games buttons currently scroll to the dimension-tunnel section. Update their handlers in `src/App.jsx` if they should open separate pages or external links.
- The character artwork determines which parts of the character are available to display. CSS can adjust positioning and cropping, but it cannot add missing artwork.
- Before deployment, test the page on actual mobile and desktop browsers and replace any placeholder social URLs.
- Keep image filenames consistent with the imports in `src/App.jsx` when replacing assets.

## Author and license

Copyright © 2026 Vrdeep101. All rights reserved.

See [`LICENSE`](./LICENSE) for the terms that apply to this project. Do not assume that third-party fonts, libraries, or separately sourced artwork are covered by this project's license; check their respective terms before redistributing them.

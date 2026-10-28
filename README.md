# VEXORIA Landing Page

A responsive cyberpunk landing page built with React, Vite, and regular CSS. The page has two main sections: the animated hero and the perspective tunnel.

## Run locally

```bash
npm install
npm run dev
```

To create a production build:

```bash
npm run build
```

## Included interactions

- A coordinated wordmark, character, and left social-rail entrance.
- A thin translucent navigation bar and desktop cursor parallax.
- The hero copy has been removed, leaving the VEXORIA artwork and a centered Explore More button.
- A thin neon divider connects the hero scene to the lower-city extension artwork.
- A scroll-driven handoff from the hero into the perspective tunnel.
- A perspective tunnel with nine staggered cards that reveal earlier and stay in view through the end of the section.
- Responsive navigation, touch-friendly layouts, and reduced-motion support.

The project keeps the existing React and Vite setup and uses standard CSS instead of adding another animation library.

## Navbar customization

The Home, About, and Games links use the Button 2-style hover animation. The top and bottom neon lines expand while the letter spacing increases. To customize it, edit these CSS variables near the top of `src/styles.css`:

- `--nav-background-opacity`: lower it for a more transparent navbar.
- `--nav-blur`: set the glass blur amount in pixels.
- `--nav-border-opacity`: control the thin navbar border visibility.
- `--nav-line-color`: change the hover-line color.
- `--nav-hover-letter-spacing`: change how far the letters spread on hover.
- `--nav-link-color`: change the normal navigation text color.

These settings affect the navbar only and do not change the global page animations.


### VEXORIA logo frames

The six transparent logo frames are in `src/assets/logo-frames/`. The hero cycles through them in an opening-and-closing sequence. To adjust the speed, change the `155` millisecond interval in `src/App.jsx`. The Explore More artwork position and spaceship size/height are controlled near the end of `src/styles.css`.


Hero wordmark asset: `src/assets/hero_text.png` (single transparent PNG with a soft fade-in; no frame animation).

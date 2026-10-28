import { useEffect, useRef, useState } from 'react';
import {
  ArrowDown,
  Facebook,
  Instagram,
  Linkedin,
  Menu,
  MessageCircle,
  X,
  Youtube,
  Gamepad2,
} from 'lucide-react';
import cityBackground from './assets/city-bg.png';
import lowerCityExtension from './assets/city-lower-extension.png';
import cyborgCharacter from './assets/char.png';
import vexoraWordmark from './assets/vexora-text.png';
import heroTextImage from './assets/hero_text.png';
import exploreButtonImage from './assets/explore.png';
import spaceshipImage from './assets/ship.png';

const tunnelCards = [
  { title: 'NEON DISTRICT', type: 'city', image: cityBackground },
  { title: 'CYBERNETIC LIFE', type: 'character', image: cyborgCharacter },
  { title: 'VEXORA CORE', type: 'wordmark', image: vexoraWordmark },
  { title: 'NIGHT PROTOCOL', type: 'city', image: cityBackground },
  { title: 'SYNTHETIC SOUL', type: 'character', image: cyborgCharacter },
  { title: 'PINK HORIZON', type: 'city', image: cityBackground },
  { title: 'NEXT DIMENSION', type: 'wordmark', image: vexoraWordmark },
  { title: 'AFTER THE FUTURE', type: 'character', image: cyborgCharacter },
  { title: 'SYSTEM ONLINE', type: 'city', image: cityBackground },
];

// These links use the official platform pages until the project's own profiles are available.
const socialLinks = [
  { name: 'Instagram', href: 'https://www.instagram.com/', icon: Instagram },
  { name: 'X', href: 'https://x.com/', icon: null },
  { name: 'LinkedIn', href: 'https://www.linkedin.com/', icon: Linkedin },
  { name: 'Facebook', href: 'https://www.facebook.com/', icon: Facebook },
  { name: 'YouTube', href: 'https://www.youtube.com/', icon: Youtube },
  { name: 'WhatsApp', href: 'https://www.whatsapp.com/', icon: MessageCircle },
  { name: 'Discord', href: 'https://discord.com/', icon: Gamepad2 },
];

function App() {
  const heroRef = useRef(null);
  const tunnelRef = useRef(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [pointer, setPointer] = useState({ x: 0, y: 0 });
  const [mouseEnabled, setMouseEnabled] = useState(false);
  const [assetsReady, setAssetsReady] = useState(false);
  const [introStage, setIntroStage] = useState('loading');

  // Load the main images before starting the coordinated entrance.
  useEffect(() => {
    let isMounted = true;
    let characterTimer;
    let readyTimer;

    Promise.all([cityBackground, cyborgCharacter, vexoraWordmark, heroTextImage, exploreButtonImage, spaceshipImage].map((path) => new Promise((resolve) => {
      const image = new Image();
      image.onload = resolve;
      image.onerror = resolve;
      image.src = path;
      if (image.complete) resolve();
    }))).then(() => {
      if (!isMounted) return;
      setAssetsReady(true);
      setIntroStage('wordmark');

      // The character and social rail start before the wordmark animation finishes.
      characterTimer = window.setTimeout(() => {
        if (isMounted) setIntroStage('character');
      }, 480);
      readyTimer = window.setTimeout(() => {
        if (isMounted) setIntroStage('ready');
      }, 1550);
    });

    return () => {
      isMounted = false;
      window.clearTimeout(characterTimer);
      window.clearTimeout(readyTimer);
    };
  }, []);


  // Check for a fine pointer so mouse parallax stays off on touch screens.
  useEffect(() => {
    const updatePointerSupport = () => {
      setMouseEnabled(window.matchMedia('(hover: hover) and (pointer: fine)').matches);
    };
    updatePointerSupport();
    window.addEventListener('resize', updatePointerSupport);
    return () => window.removeEventListener('resize', updatePointerSupport);
  }, []);

  // One scroll listener drives both the hero handoff and tunnel cards.
  useEffect(() => {
    let frameId = 0;
    const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

    const updateScrollScenes = () => {
      frameId = 0;
      const hero = heroRef.current;
      if (hero) {
        const rect = hero.getBoundingClientRect();
        const progress = clamp(-rect.top / Math.max(1, window.innerHeight * 0.82), 0, 1);
        hero.style.setProperty('--hero-progress', progress.toFixed(4));
        hero.style.setProperty('--hero-exit-distance', `${progress * Math.min(window.innerWidth * 0.22, 280)}px`);
      }

      const tunnel = tunnelRef.current;
      if (!tunnel) return;

      const rect = tunnel.getBoundingClientRect();
      // Start the card journey when the section is about halfway into the viewport.
      // The longer range keeps the cards moving throughout the pinned scene.
      const triggerPoint = window.innerHeight * 0.5;
      const distance = Math.max(1, tunnel.offsetHeight - triggerPoint);
      const progress = clamp((triggerPoint - rect.top) / distance, 0, 1);
      tunnel.style.setProperty('--tunnel-progress', progress.toFixed(4));
      tunnel.style.setProperty('--tunnel-progress-width', `${progress * 100}%`);

      tunnel.querySelectorAll('[data-tunnel-card]').forEach((card, index, cards) => {
        // Give each card a longer travel window and stagger the entrances gently.
        const start = index * 0.025;
        const end = Math.min(0.94, start + 0.72);
        const localProgress = clamp((progress - start) / (end - start), 0, 1);
        const angle = index * 137.5 * (Math.PI / 180);
        const radiusX = window.innerWidth < 700 ? window.innerWidth * 0.2 : window.innerWidth * 0.27;
        const radiusY = window.innerHeight * (index % 2 === 0 ? 0.17 : 0.22);
        const pointerX = Number(tunnel.dataset.pointerX || 0);
        const pointerY = Number(tunnel.dataset.pointerY || 0);
        // Keep the cards in front of the camera when they finish moving forward.
        const zStart = window.innerWidth < 700 ? -620 : -900;
        const zTravel = window.innerWidth < 700 ? 600 : 790;
        const z = zStart + localProgress * zTravel;
        const x = Math.cos(angle) * radiusX - pointerX * 18;
        const y = Math.sin(angle) * radiusY - pointerY * 18;
        const fadeIn = clamp(localProgress / 0.12, 0, 1);
        const rotation = (index % 2 === 0 ? 1 : -1) * (4 + (index % 4) * 2);

        card.style.transform = `translate3d(calc(-50% + ${x}px), calc(-50% + ${y}px), ${z}px) rotateZ(${rotation}deg)`;
        // Keep cards visible after they arrive instead of fading them away at the end.
        card.style.opacity = String(fadeIn);
        card.style.zIndex = String(cards.length - index);
      });
    };

    const requestUpdate = () => {
      if (!frameId) frameId = window.requestAnimationFrame(updateScrollScenes);
    };

    requestUpdate();
    window.addEventListener('scroll', requestUpdate, { passive: true });
    window.addEventListener('resize', requestUpdate);
    return () => {
      window.cancelAnimationFrame(frameId);
      window.removeEventListener('scroll', requestUpdate);
      window.removeEventListener('resize', requestUpdate);
    };
  }, []);

  function handleHeroMouseMove(event) {
    if (!mouseEnabled || !heroRef.current) return;
    const bounds = heroRef.current.getBoundingClientRect();
    setPointer({
      x: (event.clientX - bounds.left) / bounds.width - 0.5,
      y: (event.clientY - bounds.top) / bounds.height - 0.5,
    });
  }

  function resetPointer() {
    setPointer({ x: 0, y: 0 });
  }

  function handleTunnelPointerMove(event) {
    if (!mouseEnabled || !tunnelRef.current) return;
    const bounds = tunnelRef.current.getBoundingClientRect();
    tunnelRef.current.dataset.pointerX = String((event.clientX - bounds.left) / bounds.width - 0.5);
    tunnelRef.current.dataset.pointerY = String((event.clientY - bounds.top) / bounds.height - 0.5);
    window.dispatchEvent(new Event('scroll'));
  }

  function scrollToSection(id) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setMenuOpen(false);
  }

  function goToHome() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setMenuOpen(false);
  }

  return (
    <main>
      {!assetsReady && (
        <div className="loading-screen" role="status" aria-label="Loading VEXORA">
          <span className="loading-wordmark">VEXORIA</span>
          <span className="loading-line"><span /></span>
          <span className="loading-caption">INITIALIZING VISUAL SYSTEM</span>
        </div>
      )}

      <section
        className={`hero hero-${introStage}`}
        id="home"
        ref={heroRef}
        onMouseMove={handleHeroMouseMove}
        onMouseLeave={resetPointer}
        style={{ '--pointer-x': pointer.x, '--pointer-y': pointer.y }}
      >
        <div className="hero-city" style={{ backgroundImage: `url(${cityBackground})` }} />
        <div className="hero-vignette" />
        <div className="ambient-glow ambient-glow-one" />
        <div className="ambient-glow ambient-glow-two" />
        <div className="portal-ring" aria-hidden="true" />
        <div className="fog fog-one" aria-hidden="true" />
        <div className="fog fog-two" aria-hidden="true" />
        <div className="particle-field" aria-hidden="true" />
        <div className="spaceship-flyby" aria-hidden="true">
          <img src={spaceshipImage} alt="" draggable="false" />
        </div>

        <header className="site-header">
          <button className="brand" onClick={goToHome} aria-label="VEXORIA home">
            <span className="brand-name">VEXORIA<span className="brand-dot">.</span></span>
          </button>

          <button
            className="mobile-menu-button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>

          <nav className={`main-nav ${menuOpen ? 'main-nav-open' : ''}`} aria-label="Main navigation">
            <button className="nav-link" onClick={goToHome}>
              <svg className="nav-link-border" viewBox="0 0 140 48" aria-hidden="true" focusable="false">
                <polyline points="139,1 139,47 1,47 1,1 139,1" className="nav-border-bg" />
                <polyline points="139,1 139,47 1,47 1,1 139,1" className="nav-border-highlight" />
              </svg>
              <span className="nav-link-label">Home</span>
            </button>
            <button className="nav-link" onClick={() => scrollToSection('dimension-tunnel')}>
              <svg className="nav-link-border" viewBox="0 0 140 48" aria-hidden="true" focusable="false">
                <polyline points="139,1 139,47 1,47 1,1 139,1" className="nav-border-bg" />
                <polyline points="139,1 139,47 1,47 1,1 139,1" className="nav-border-highlight" />
              </svg>
              <span className="nav-link-label">About</span>
            </button>
            <button className="nav-link" onClick={() => scrollToSection('dimension-tunnel')}>
              <svg className="nav-link-border" viewBox="0 0 140 48" aria-hidden="true" focusable="false">
                <polyline points="139,1 139,47 1,47 1,1 139,1" className="nav-border-bg" />
                <polyline points="139,1 139,47 1,47 1,1 139,1" className="nav-border-highlight" />
              </svg>
              <span className="nav-link-label">Games</span>
            </button>
            <button
              className="nav-join cybr-btn mobile-join"
              onClick={() => scrollToSection('dimension-tunnel')}
              aria-label="Join us"
            >
              <span className="cybr-btn__label">Join us<span aria-hidden="true">_</span></span>
              <span aria-hidden="true" className="cybr-btn__glitch">Join us_</span>
            </button>
          </nav>

          <button
            className="nav-join cybr-btn desktop-join"
            onClick={() => scrollToSection('dimension-tunnel')}
            aria-label="Join us"
          >
            <span className="cybr-btn__label">Join us<span aria-hidden="true">_</span></span>
            <span aria-hidden="true" className="cybr-btn__glitch">Join us_</span>
          </button>
        </header>

        <div className="hero-content">
          <div className="hero-branding-scroll">
            <img className="hero-title-image" src={heroTextImage} alt="VEXORIA" draggable="false" />
          </div>

          <div className="character-scroll-wrap">
          <div
            className="character-wrap"
            style={{ '--character-x': `${pointer.x * -18}px`, '--character-y': `${pointer.y * -12}px` }}
          >
            <div className="character-halo" />
            <img className="hero-character" src={cyborgCharacter} alt="Cybernetic heroine wearing a translucent neon-pink visor" draggable="false" />
          </div>
          </div>

          <div className="hero-cta-wrap">
            <button
              className="explore-image-button"
              onClick={() => scrollToSection('dimension-tunnel')}
              aria-label="Explore more"
            >
              <img src={exploreButtonImage} alt="Explore more" draggable="false" />
            </button>
          </div>

          <div className="social-rail-exit">
            <nav className="social-rail" aria-label="Social links">
              {socialLinks.map(({ name, href, icon: Icon }) => (
                <a key={name} href={href} target="_blank" rel="noreferrer" aria-label={name} title={name}>
                  {Icon ? <Icon size={23} strokeWidth={2.1} /> : <span className="x-social-mark">𝕏</span>}
                </a>
              ))}
            </nav>
          </div>

        </div>
      </section>

      <section
        className="tunnel-section"
        id="dimension-tunnel"
        ref={tunnelRef}
        onMouseMove={handleTunnelPointerMove}
        onMouseLeave={() => {
          if (tunnelRef.current) {
            tunnelRef.current.dataset.pointerX = '0';
            tunnelRef.current.dataset.pointerY = '0';
            window.dispatchEvent(new Event('scroll'));
          }
        }}
      >
        <div className="tunnel-sticky">
          <div className="tunnel-skyline" style={{ backgroundImage: `url(${lowerCityExtension})` }} />
          <div className="tunnel-vignette" />
          <div className="tunnel-grid" />
          <div className="tunnel-ring tunnel-ring-one" />
          <div className="tunnel-ring tunnel-ring-two" />
          <div className="tunnel-headline">
            <p className="section-kicker">02 / ENTER THE VEXORIA CORE</p>
            <h2>Choose your<br /><span>dimension.</span></h2>
            <p>Scroll to travel through the VEXORIA universe.</p>
          </div>
          <div className="tunnel-card-stage" aria-label="VEXORIA dimensions">
            {tunnelCards.map((card, index) => (
              <article
                className={`tunnel-card tunnel-card-${card.type}`}
                data-tunnel-card
                key={`${card.title}-${index}`}
                style={{ '--card-index': index }}
              >
                <div className="tunnel-card-image-wrap">
                  <img src={card.image} alt="" draggable="false" loading="eager" />
                  <div className="tunnel-card-shade" />
                </div>
                <div className="tunnel-card-label">
                  <span>VXR / {String(index + 1).padStart(2, '0')}</span>
                  <h3>{card.title}</h3>
                </div>
              </article>
            ))}
          </div>
          <div className="tunnel-scroll-prompt"><span /> KEEP SCROLLING <ArrowDown size={14} /></div>
          <div className="tunnel-progress"><span /></div>
        </div>
      </section>
    </main>
  );
}

export default App;

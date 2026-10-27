import { useEffect, useRef, useState } from 'react';
import { ArrowRight, Menu, X } from 'lucide-react';
import cityBackground from './assets/city-bg.png';
import cyborgCharacter from './assets/char.png';
import vexoraWordmark from './assets/vexora-text.png';

function App() {
  const heroRef = useRef(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [pointer, setPointer] = useState({ x: 0, y: 0 });
  const [mouseEnabled, setMouseEnabled] = useState(false);
  const [assetsReady, setAssetsReady] = useState(false);
  const [introStage, setIntroStage] = useState('loading');

  // Wait until the city, wordmark, and character are loaded before showing the hero.
  useEffect(() => {
    let isMounted = true;
    let wordmarkTimer;
    let characterTimer;

    const imagePaths = [cityBackground, cyborgCharacter, vexoraWordmark];
    const imageLoads = imagePaths.map((path) => new Promise((resolve) => {
      const image = new Image();
      image.onload = resolve;
      image.onerror = resolve;
      image.src = path;
      if (image.complete) resolve();
    }));

    Promise.all(imageLoads).then(() => {
      if (!isMounted) return;

      setAssetsReady(true);
      setIntroStage('wordmark');

      // Let the VEXORA wordmark finish its reveal before the character appears.
      wordmarkTimer = window.setTimeout(() => {
        if (isMounted) setIntroStage('character');
      }, 1750);

      // Bring in the supporting copy after the character has settled into place.
      characterTimer = window.setTimeout(() => {
        if (isMounted) setIntroStage('ready');
      }, 3300);
    });

    return () => {
      isMounted = false;
      window.clearTimeout(wordmarkTimer);
      window.clearTimeout(characterTimer);
    };
  }, []);

  // Only enable cursor movement when the device has a mouse or trackpad.
  useEffect(() => {
    const updatePointerSupport = () => {
      setMouseEnabled(window.matchMedia('(hover: hover) and (pointer: fine)').matches);
    };

    updatePointerSupport();
    window.addEventListener('resize', updatePointerSupport);
    return () => window.removeEventListener('resize', updatePointerSupport);
  }, []);

  // Move the background layers by different amounts to create a light 3D effect.
  function handleHeroMouseMove(event) {
    if (!mouseEnabled || !heroRef.current) return;

    const bounds = heroRef.current.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;
    setPointer({ x, y });
  }

  function resetPointer() {
    setPointer({ x: 0, y: 0 });
  }

  function goToHome() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setMenuOpen(false);
  }

  return (
    <main>
      {!assetsReady && (
        <div className="loading-screen" role="status" aria-label="Loading VEXORA">
          <span className="loading-wordmark">VEXORA</span>
          <span className="loading-line"><span /></span>
          <span className="loading-caption">LOADING CITY // VISUAL SYSTEM</span>
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

        <header className="site-header">
          <button className="brand" onClick={goToHome} aria-label="VEXORA home">
            <span className="brand-name">VEXORA<span className="brand-dot">.</span></span>
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
            <button className="nav-link" onClick={goToHome}>Home</button>
            <button className="nav-link" onClick={() => { document.getElementById('hero-copy')?.scrollIntoView({ behavior: 'smooth', block: 'center' }); setMenuOpen(false); }}>About</button>
            <button className="nav-link" onClick={() => { document.getElementById('explore-button')?.scrollIntoView({ behavior: 'smooth', block: 'center' }); setMenuOpen(false); }}>Games</button>
            <button className="nav-join mobile-join" onClick={() => { document.getElementById('explore-button')?.scrollIntoView({ behavior: 'smooth', block: 'center' }); setMenuOpen(false); }}>
              Join us <ArrowRight size={16} />
            </button>
          </nav>

          <button className="nav-join desktop-join" onClick={() => document.getElementById('explore-button')?.scrollIntoView({ behavior: 'smooth', block: 'center' })}>
            Join us <ArrowRight size={17} />
          </button>
        </header>

        <div className="hero-content">
          <div className="hero-kicker">
            <span>ENTER THE</span>
            <span className="kicker-line" />
            <span>NEXT DIMENSION</span>
          </div>

          <img
            className="hero-title-image"
            src={vexoraWordmark}
            alt="VEXORA"
            draggable="false"
          />

          <div
            className="character-wrap"
            style={{
              '--character-x': `${pointer.x * -18}px`,
              '--character-y': `${pointer.y * -12}px`,
            }}
          >
            <div className="character-halo" />
            <img
              className="hero-character"
              src={cyborgCharacter}
              alt="Cybernetic heroine wearing a translucent neon-pink visor"
              draggable="false"
            />
          </div>

          <div className="hero-copy" id="hero-copy">
            <p className="eyebrow">THE FUTURE IS YOURS</p>
            <h1>Beyond human.<br /><span>Beyond limits.</span></h1>
            <p className="hero-description">
              A new dimension where cybernetics and imagination collide.
            </p>
            <button className="outline-button" id="explore-button" onClick={() => { const button = document.getElementById('explore-button'); if (button) { button.classList.remove('button-pulse'); void button.offsetWidth; button.classList.add('button-pulse'); } }}>
              Explore more <ArrowRight size={19} />
            </button>
          </div>

          <div className="hero-side-note" aria-hidden="true">
            <span className="side-note-line" />
            <span>VXR / 001</span>
          </div>
        </div>
      </section>
    </main>
  );
}

export default App;

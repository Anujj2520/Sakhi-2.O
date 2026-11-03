import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ShieldCheck,
  Activity,
  MapPin,
  BatteryFull,
  ArrowRight,
  Menu,
  X,
  Heart,
  Radio,
  Zap,
} from "lucide-react";
import "./Home.css";

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [sosOpen, setSosOpen] = useState(false);

  return (
    <div className="home-page">
      <header className="site-header">
        <Link to="/" className="brand">
          <span className="brand-icon">
            <ShieldCheck size={24} />
          </span>
          <span>
            <strong>Sakhi</strong>
            <small>SMART SAFETY TECHNOLOGY</small>
          </span>
        </Link>

        <button
          className="mobile-menu-button"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation"
        >
          {menuOpen ? <X /> : <Menu />}
        </button>

        <nav className={menuOpen ? "nav-links open" : "nav-links"}>
          <a href="#home" onClick={() => setMenuOpen(false)}>Home</a>
          <a href="#features" onClick={() => setMenuOpen(false)}>Features</a>
          <Link to="/device" onClick={() => setMenuOpen(false)}>Our Device</Link>
          <Link to="/how-it-works" onClick={() => setMenuOpen(false)}>How It Works</Link>
          <Link to="/about" onClick={() => setMenuOpen(false)}>About</Link>
          <Link to="/dashboard" className="nav-cta">Open Dashboard <ArrowRight size={16} /></Link>
        </nav>
      </header>

      <main>
        <section className="hero-section page-container" id="home">
          <div className="hero-copy">
            <div className="eyebrow">
              <span className="status-dot" />
              A SMARTER WAY TO FEEL SAFER
            </div>

            <h1>
              Safety that stays
              <span> close to you.</span>
            </h1>

            <p className="hero-description">
              Meet Sakhi — a concept for a compact wearable safety device
              designed to help users send an emergency alert and share their
              location through a connected safety platform.
            </p>

            <div className="hero-actions">
              <button className="primary-button" onClick={() => setSosOpen(true)}>
                <ShieldCheck size={19} />
                Try SOS Demo
              </button>

              <a href="#features" className="secondary-button">
                Explore Sakhi <ArrowRight size={17} />
              </a>
            </div>

            <div className="hero-trust">
              <span><ShieldCheck size={17} /> Safety-focused design</span>
              <span><Activity size={17} /> Connected dashboard concept</span>
            </div>
          </div>

          <div className="hero-visual">
            <div className="visual-glow" />
            <div className="orbit orbit-one" />
            <div className="orbit orbit-two" />

            <div className="device-stage">
              <div className="device-halo" />

              <div className="wearable">
                <div className="wearable-top">
                  <span className="device-light" />
                  <span className="device-light" />
                  <span className="device-light" />
                </div>

                <div className="wearable-face">
                  <div className="wearable-logo">
                    <ShieldCheck size={34} />
                  </div>
                  <div className="wearable-name">SAKHI</div>
                  <div className="wearable-subtitle">STAY CONNECTED</div>
                  <button
                    className="sos-button"
                    onClick={() => setSosOpen(true)}
                    aria-label="Open SOS demo"
                  >
                    SOS
                  </button>
                  <span className="device-caption">EMERGENCY BUTTON</span>
                </div>

                <div className="wearable-bottom">
                  <span />
                </div>
              </div>

              <div className="floating-card card-connectivity">
                <span className="mini-icon"><Radio size={18} /></span>
                <div><strong>Connected concept</strong><small>Device status preview</small></div>
                <span className="status-dot" />
              </div>

              <div className="floating-card card-battery">
                <span className="mini-icon"><BatteryFull size={18} /></span>
                <div><strong>Battery status</strong><small>Illustrative display</small></div>
                <span className="battery-value">82%</span>
              </div>
            </div>

            <div className="visual-caption">
              <span className="caption-line" />
              <span>SAKHI WEARABLE · CONCEPT DESIGN</span>
            </div>
          </div>
        </section>

        <section className="intro-strip">
          <div className="page-container intro-grid">
            <div><ShieldCheck /><span><strong>Emergency-first</strong><small>Designed around SOS access</small></span></div>
            <div><MapPin /><span><strong>Location-aware</strong><small>Connected location feature concept</small></span></div>
            <div><Activity /><span><strong>One platform</strong><small>Device and alert dashboard</small></span></div>
            <div><Heart /><span><strong>Built with care</strong><small>Safety-focused experience</small></span></div>
          </div>
        </section>

        <section className="content-section page-container section-padding" id="features">
          <div className="section-heading">
            <span className="eyebrow">THE SAKHI EXPERIENCE</span>
            <h2>Simple to use. Designed for safety.</h2>
            <p>
              A wearable concept paired with a web platform to make device
              status and emergency information easier to understand.
            </p>
          </div>

          <div className="technology-grid">
            <article className="tech-card">
              <div className="tech-icon"><Zap /></div>
              <span className="card-label">01 · QUICK ACCESS</span>
              <h3>SOS Alert Concept</h3>
              <p>A dedicated physical button is planned for initiating an emergency alert.</p>
              <div className="card-foot">Fast access design <ArrowRight size={16} /></div>
            </article>

            <article className="tech-card">
              <div className="tech-icon"><MapPin /></div>
              <span className="card-label">02 · LOCATION</span>
              <h3>Location Sharing</h3>
              <p>The platform is designed to display location data when a compatible device and backend provide it.</p>
              <div className="card-foot">Location-aware platform <ArrowRight size={16} /></div>
            </article>

            <article className="tech-card">
              <div className="tech-icon"><Activity /></div>
              <span className="card-label">03 · CONNECTIVITY</span>
              <h3>Safety Dashboard</h3>
              <p>A central place to view device status, alert history and connected safety features.</p>
              <div className="card-foot">One connected experience <ArrowRight size={16} /></div>
            </article>
          </div>
        </section>

        <section className="features-section">
          <div className="page-container features-layout section-padding">
            <div className="features-copy">
              <span className="eyebrow">MORE THAN A WEARABLE</span>
              <h2>A complete safety platform, built step by step.</h2>
              <p>
                Sakhi combines a wearable-device concept with a web dashboard.
                The current website is a development prototype; real-world
                alerts depend on compatible hardware and verified backend integration.
              </p>
              <Link to="/how-it-works" className="primary-button">
                Discover How It Works <ArrowRight size={17} />
              </Link>
            </div>

            <div className="feature-list">
              <div className="feature-item"><span className="feature-number">01</span><div><h3>Wearable device</h3><p>A compact design concept with a dedicated SOS control.</p></div></div>
              <div className="feature-item"><span className="feature-number">02</span><div><h3>Connected platform</h3><p>A planned communication path between device and backend.</p></div></div>
              <div className="feature-item"><span className="feature-number">03</span><div><h3>Alert management</h3><p>A dashboard concept for reviewing emergency events and status.</p></div></div>
              <div className="feature-item"><span className="feature-number">04</span><div><h3>Responsive experience</h3><p>Designed to adapt to mobile, tablet and desktop screens.</p></div></div>
            </div>
          </div>
        </section>

        <section className="contact-section page-container">
          <div className="contact-content">
            <span className="eyebrow">DISCOVER SAKHI 2.0</span>
            <h2>Technology with a purpose.</h2>
            <p>Explore the device concept, platform features and development roadmap.</p>
            <Link to="/technology" className="primary-button">
              Explore the Technology <ArrowRight size={17} />
            </Link>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="page-container footer-content">
          <Link to="/" className="brand footer-brand">
            <span className="brand-icon"><ShieldCheck size={22} /></span>
            <span><strong>Sakhi</strong><small>SMART SAFETY TECHNOLOGY</small></span>
          </Link>
          <p>Safety-focused technology, developed with care.</p>
          <span className="footer-note">Prototype · Not an emergency service</span>
        </div>
      </footer>

      {sosOpen && (
        <div className="demo-overlay" onClick={() => setSosOpen(false)}>
          <div className="demo-dialog" onClick={(event) => event.stopPropagation()}>
            <button
              className="demo-close"
              onClick={() => setSosOpen(false)}
              aria-label="Close demo"
            >
              <X />
            </button>

            <div className="demo-symbol"><ShieldCheck size={32} /></div>
            <span className="eyebrow">INTERACTIVE PREVIEW</span>
            <h2>SOS Demo</h2>
            <p>
              This is a website demonstration only. It does not contact family
              members, emergency services or transmit your real location.
            </p>
            <div className="demo-status">
              <span className="status-dot" />
              Demo mode — no alert sent
            </div>
            <button className="primary-button demo-confirm" onClick={() => setSosOpen(false)}>
              Got it, close demo
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
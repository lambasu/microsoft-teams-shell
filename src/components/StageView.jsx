import { useState, useEffect } from 'react'
import { agentLogos } from '../shared/agentLogos'
import './StageView.css'

// ── Version-specific content ─────────────────────────────────────────────────

const SITE_VERSIONS = {
  v1: {
    accent: '#0078D4',
    heroEyebrow: 'AI-native product consultancy',
    heroHeadline: <>Building the future<br />of AI-native products</>,
    heroBtnBg: '#0078D4',
    heroBtnBorder: '#0078D4',
    logoColor: '#0078D4',
    navCtaBg: '#0078D4',
  },
  v2: {
    accent: '#6264A7',
    heroEyebrow: 'AI-native product consultancy',
    heroHeadline: <>AI-native product strategy<br />for enterprise</>,
    heroBtnBg: '#6264A7',
    heroBtnBorder: '#6264A7',
    logoColor: '#6264A7',
    navCtaBg: '#6264A7',
  },
}

// ── Mock Morgan Collective website ──────────────────────────────────────────

function MockWebsite({ version }) {
  const v = SITE_VERSIONS[version] || SITE_VERSIONS.v1
  return (
    <div className="sv-site">
      {/* Nav */}
      <nav className="sv-nav sv-section" style={{ '--sv-accent': v.accent }}>
        <div className="sv-nav-inner">
          <div className="sv-nav-logo">
            <div className="sv-nav-logo-mark" style={{ background: v.logoColor }}>MC</div>
            <span className="sv-nav-logo-name">Morgan Collective</span>
          </div>
          <div className="sv-nav-links">
            <a href="#" className="sv-nav-link">About</a>
            <a href="#" className="sv-nav-link">Services</a>
            <a href="#" className="sv-nav-link">Work</a>
            <a href="#" className="sv-nav-link">Team</a>
          </div>
          <a href="#" className="sv-nav-cta" style={{ background: v.navCtaBg }}>Work with us</a>
        </div>
      </nav>

      {/* Hero */}
      <section className="sv-hero sv-section" style={{ '--sv-accent': v.accent }}>
        <div className="sv-hero-inner">
          <div className="sv-hero-eyebrow">{v.heroEyebrow}</div>
          <h1 className="sv-hero-headline">{v.heroHeadline}</h1>
          <p className="sv-hero-sub">
            We help forward-thinking companies build better AI products, faster.
            Strategy, design, and launch readiness — end to end.
          </p>
          <div className="sv-hero-actions">
            <a href="#" className="sv-btn sv-btn-primary" style={{ background: v.heroBtnBg, borderColor: v.heroBtnBorder }}>Work with us</a>
            <a href="#" className="sv-btn sv-btn-outline">See our work</a>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="sv-services sv-section" style={{ '--sv-accent': v.accent }}>
        <div className="sv-section-inner">
          <h2 className="sv-section-title">What we do</h2>
          <p className="sv-section-sub">Focused engagements. Real outcomes.</p>
          <div className="sv-services-grid">
            {[
              {
                title: 'Product Strategy',
                desc: 'Roadmap reviews, PRD development, and org coaching for teams building on AI-native platforms.',
                icon: <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>,
                icon2: <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>,
              },
              {
                title: 'Launch Readiness',
                desc: 'Milestone planning, cross-functional alignment, and readiness reviews that keep launches on track.',
                icon: <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>,
              },
              {
                title: 'AI Integration',
                desc: 'Hands-on advisory for teams embedding AI agents, LLMs, and agentic workflows into enterprise products.',
                icon: <><circle cx="12" cy="12" r="3"/><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/></>,
              },
            ].map((s) => (
              <div key={s.title} className="sv-service-card" style={{ '--sv-accent': v.accent }}>
                <div className="sv-service-icon" style={{ color: v.accent }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    {s.icon}{s.icon2}
                  </svg>
                </div>
                <h3 className="sv-service-title">{s.title}</h3>
                <p className="sv-service-desc">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="sv-team sv-section">
        <div className="sv-section-inner">
          <h2 className="sv-section-title">The team</h2>
          <p className="sv-section-sub">Four practitioners. Zero fluff.</p>
          <div className="sv-team-grid">
            {[
              { initials: 'AM', name: 'Alex Morgan', role: 'Principal Consultant', color: v.accent },
              { initials: 'RT', name: 'Rachel Thompson', role: 'Product Strategy', color: '#7160E8' },
              { initials: 'KP', name: 'Kevin Park', role: 'Technical Advisor', color: '#038387' },
              { initials: 'TR', name: 'Taylor Reed', role: 'Client Partnerships', color: '#038387' },
            ].map((p) => (
              <div key={p.name} className="sv-team-card">
                <div className="sv-team-avatar" style={{ background: p.color }}>{p.initials}</div>
                <div className="sv-team-name">{p.name}</div>
                <div className="sv-team-role">{p.role}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="sv-cta sv-section" style={{ '--sv-accent': v.accent }}>
        <div className="sv-section-inner sv-cta-inner">
          <h2 className="sv-cta-title">Ready to work together?</h2>
          <p className="sv-cta-sub">We take on two to three engagements at a time. Tell us what you're building.</p>
          <a href="#" className="sv-btn sv-btn-primary" style={{ background: v.heroBtnBg, borderColor: v.heroBtnBorder }}>Get in touch</a>
        </div>
      </section>

      {/* Footer */}
      <footer className="sv-footer sv-section">
        <div className="sv-footer-inner">
          <span className="sv-footer-brand">Morgan Collective</span>
          <span className="sv-footer-copy">© 2026 · AI-native product strategy</span>
        </div>
      </footer>
    </div>
  )
}

// ── Stage View panel ─────────────────────────────────────────────────────────

export default function StageView({ version = 'v1', onClose }) {
  // Drive the build animation: sections are invisible until 'built'
  const [phase, setPhase] = useState('building') // 'building' | 'built'

  useEffect(() => {
    // Reset animation whenever version changes (simulates Lovable re-running)
    setPhase('building')
    const t = setTimeout(() => setPhase('built'), 100)
    return () => clearTimeout(t)
  }, [version])

  return (
    <div className="stage-view-panel">
      {/* Header bar */}
      <div className="stage-view-header">
        <div className="stage-view-header-left">
          <div className="stage-view-app-icon">
            {agentLogos.lovable(14)}
          </div>
          <span className="stage-view-title">Lovable</span>
          <span className="stage-view-title-sep">·</span>
          <span className="stage-view-title-context">Morgan Collective</span>
          <span className={`stage-view-live-badge ${phase === 'building' ? 'stage-view-live-badge-building' : ''}`}>
            {phase === 'building' ? 'Building…' : 'Live'}
          </span>
        </div>
        <div className="stage-view-header-right">
          <button className="stage-view-header-btn" title="Open in browser" aria-label="Open in browser">
            <svg width="13" height="13" viewBox="0 0 16 16" fill="currentColor">
              <path d="M2 2h5v1H3v10h10v-4h1v5H2V2z"/>
              <path d="M9.5 1H15v5.5l-1.5-1.5-4 4L8 7.5l4-4L9.5 1z"/>
            </svg>
          </button>
          <button className="stage-view-header-btn stage-view-close" title="Close" aria-label="Close preview" onClick={onClose}>
            <svg width="13" height="13" viewBox="0 0 16 16" fill="currentColor">
              <path d="M3.72 3.72a.75.75 0 0 1 1.06 0L8 6.94l3.22-3.22a.75.75 0 1 1 1.06 1.06L9.06 8l3.22 3.22a.75.75 0 1 1-1.06 1.06L8 9.06l-3.22 3.22a.75.75 0 0 1-1.06-1.06L6.94 8 3.72 4.78a.75.75 0 0 1 0-1.06z"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Build progress bar */}
      <div className={`stage-view-progress-bar ${phase === 'building' ? 'stage-view-progress-bar-active' : 'stage-view-progress-bar-done'}`} />

      {/* Website body */}
      <div className={`stage-view-body stage-view-body-${phase}`}>
        <MockWebsite version={version} />
      </div>
    </div>
  )
}

import { agentLogos } from '../shared/agentLogos'
import './StageView.css'

// ── Mock Morgan Collective website ──────────────────────────────────────────
// Rendered as React so the preview is crisp and pixel-perfect — no iframe
// sandbox issues, no CORS. Looks like a real landing page inside Teams Stage View.

function MockWebsite() {
  return (
    <div className="sv-site">
      {/* Nav */}
      <nav className="sv-nav">
        <div className="sv-nav-inner">
          <div className="sv-nav-logo">
            <div className="sv-nav-logo-mark">MC</div>
            <span className="sv-nav-logo-name">Morgan Collective</span>
          </div>
          <div className="sv-nav-links">
            <a href="#" className="sv-nav-link">About</a>
            <a href="#" className="sv-nav-link">Services</a>
            <a href="#" className="sv-nav-link">Work</a>
            <a href="#" className="sv-nav-link">Team</a>
          </div>
          <a href="#" className="sv-nav-cta">Work with us</a>
        </div>
      </nav>

      {/* Hero */}
      <section className="sv-hero">
        <div className="sv-hero-inner">
          <div className="sv-hero-eyebrow">AI-native product consultancy</div>
          <h1 className="sv-hero-headline">AI-native product strategy<br />for enterprise</h1>
          <p className="sv-hero-sub">
            We help forward-thinking companies build better AI products, faster.
            Strategy, design, and launch readiness — end to end.
          </p>
          <div className="sv-hero-actions">
            <a href="#" className="sv-btn sv-btn-primary">Work with us</a>
            <a href="#" className="sv-btn sv-btn-outline">See our work</a>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="sv-services">
        <div className="sv-section-inner">
          <h2 className="sv-section-title">What we do</h2>
          <p className="sv-section-sub">Focused engagements. Real outcomes.</p>
          <div className="sv-services-grid">
            <div className="sv-service-card">
              <div className="sv-service-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
                </svg>
              </div>
              <h3 className="sv-service-title">Product Strategy</h3>
              <p className="sv-service-desc">Roadmap reviews, PRD development, and org coaching for teams building on AI-native platforms.</p>
            </div>
            <div className="sv-service-card">
              <div className="sv-service-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
                </svg>
              </div>
              <h3 className="sv-service-title">Launch Readiness</h3>
              <p className="sv-service-desc">Milestone planning, cross-functional alignment, and readiness reviews that keep launches on track.</p>
            </div>
            <div className="sv-service-card">
              <div className="sv-service-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="3"/><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/>
                </svg>
              </div>
              <h3 className="sv-service-title">AI Integration</h3>
              <p className="sv-service-desc">Hands-on advisory for teams embedding AI agents, LLMs, and agentic workflows into enterprise products.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="sv-team">
        <div className="sv-section-inner">
          <h2 className="sv-section-title">The team</h2>
          <p className="sv-section-sub">Four practitioners. Zero fluff.</p>
          <div className="sv-team-grid">
            {[
              { initials: 'AM', name: 'Alex Morgan', role: 'Principal Consultant', color: '#6264A7' },
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
      <section className="sv-cta">
        <div className="sv-section-inner sv-cta-inner">
          <h2 className="sv-cta-title">Ready to work together?</h2>
          <p className="sv-cta-sub">We take on two to three engagements at a time. Tell us what you're building.</p>
          <a href="#" className="sv-btn sv-btn-primary sv-btn-lg">Get in touch</a>
        </div>
      </section>

      {/* Footer */}
      <footer className="sv-footer">
        <div className="sv-footer-inner">
          <span className="sv-footer-brand">Morgan Collective</span>
          <span className="sv-footer-copy">© 2026 · AI-native product strategy</span>
        </div>
      </footer>
    </div>
  )
}

// ── Stage View chrome ────────────────────────────────────────────────────────

export default function StageView({ onClose }) {
  return (
    <div className="stage-view-overlay">
      <div className="stage-view-header">
        <div className="stage-view-header-left">
          <div className="stage-view-app-icon">
            {agentLogos.lovable(14)}
          </div>
          <span className="stage-view-title">Lovable</span>
          <span className="stage-view-title-sep">·</span>
          <span className="stage-view-title-context">Morgan Collective</span>
        </div>
        <div className="stage-view-header-right">
          <button className="stage-view-header-btn" title="Open in browser" aria-label="Open in browser">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
              <path d="M8.5 2.5a.5.5 0 0 0-1 0V7H3a.5.5 0 0 0 0 1h4.5v4.5a.5.5 0 0 0 1 0V8H13a.5.5 0 0 0 0-1H8.5V2.5z" transform="rotate(45 8 8)"/>
              <path d="M2 2h5v1H3v10h10v-4h1v5H2V2z"/>
            </svg>
          </button>
          <button className="stage-view-header-btn stage-view-close" title="Close" aria-label="Close preview" onClick={onClose}>
            <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
              <path d="M3.72 3.72a.75.75 0 0 1 1.06 0L8 6.94l3.22-3.22a.75.75 0 1 1 1.06 1.06L9.06 8l3.22 3.22a.75.75 0 1 1-1.06 1.06L8 9.06l-3.22 3.22a.75.75 0 0 1-1.06-1.06L6.94 8 3.72 4.78a.75.75 0 0 1 0-1.06z"/>
            </svg>
          </button>
        </div>
      </div>
      <div className="stage-view-body">
        <MockWebsite />
      </div>
    </div>
  )
}

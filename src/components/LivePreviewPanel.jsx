import './LivePreviewPanel.css'

// Remote viewers shown in the presence bar and as cursor overlays.
// Alex Morgan (the current user) is always shown as the 4th avatar.
const PRESENCE = [
  { initials: 'RT', name: 'Rachel Thompson', color: '#7160E8', top: '19%', left: '56%', driftClass: 'lp-drift-a' },
  { initials: 'KP', name: 'Kevin Park',       color: '#038387', top: '60%', left: '31%', driftClass: 'lp-drift-b' },
  { initials: 'TR', name: 'Taylor Reed',      color: '#CA5010', top: '42%', left: '70%', driftClass: 'lp-drift-c' },
]

// Inline site mock — v2 (MC purple) of the Morgan Collective landing page.
// Mirrors the structure of StageView's MockWebsite so the cursors sit
// on recognisable sections (hero, services, team).
function SitePreview() {
  const acc = '#6264A7'
  return (
    <div className="lp-site">
      <nav className="lp-nav">
        <div className="lp-nav-inner">
          <div className="lp-nav-logo">
            <div className="lp-nav-mark" style={{ background: acc }}>MC</div>
            <span className="lp-nav-brand">Morgan Collective</span>
          </div>
          <div className="lp-nav-links">
            <span>About</span>
            <span>Services</span>
            <span>Work</span>
            <span>Team</span>
          </div>
          <span className="lp-nav-cta" style={{ background: acc }}>Work with us</span>
        </div>
      </nav>

      <section className="lp-hero">
        <div className="lp-section-inner">
          <div className="lp-hero-eyebrow" style={{ color: '#a78bfa' }}>AI-native product consultancy</div>
          <h1 className="lp-hero-headline">
            AI-native product strategy<br />for enterprise
          </h1>
          <p className="lp-hero-sub">
            We help forward-thinking companies build better AI products, faster.
            Strategy, design, and launch readiness — end to end.
          </p>
          <div className="lp-hero-actions">
            <span className="lp-btn-primary" style={{ background: acc }}>Work with us</span>
            <span className="lp-btn-outline">See our work</span>
          </div>
        </div>
      </section>

      <section className="lp-services">
        <div className="lp-section-inner">
          <h2 className="lp-section-title">What we do</h2>
          <p className="lp-section-sub">Focused engagements. Real outcomes.</p>
          <div className="lp-services-grid">
            {[
              { title: 'Product Strategy',  desc: 'Roadmap reviews, PRD development, and org coaching for AI-native platforms.' },
              { title: 'Launch Readiness',  desc: 'Milestone planning, cross-functional alignment, and readiness reviews.' },
              { title: 'AI Integration',    desc: 'Hands-on advisory for teams embedding agents and LLMs into enterprise products.' },
            ].map((s) => (
              <div key={s.title} className="lp-service-card">
                <div className="lp-service-dot" style={{ background: acc }} />
                <h3 className="lp-service-title">{s.title}</h3>
                <p className="lp-service-desc">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="lp-team">
        <div className="lp-section-inner">
          <h2 className="lp-section-title">The team</h2>
          <div className="lp-team-grid">
            {[
              { initials: 'AM', name: 'Alex Morgan',      role: 'Principal Consultant', color: acc },
              { initials: 'RT', name: 'Rachel Thompson',  role: 'Product Strategy',     color: '#7160E8' },
              { initials: 'KP', name: 'Kevin Park',       role: 'Technical Advisor',    color: '#038387' },
              { initials: 'TR', name: 'Taylor Reed',      role: 'Client Partnerships',  color: '#CA5010' },
            ].map((p) => (
              <div key={p.name} className="lp-team-card">
                <div className="lp-team-avatar" style={{ background: p.color }}>{p.initials}</div>
                <div className="lp-team-name">{p.name}</div>
                <div className="lp-team-role">{p.role}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="lp-cta">
        <div className="lp-section-inner lp-cta-inner">
          <h2 className="lp-cta-title">Ready to work together?</h2>
          <p className="lp-cta-sub">Two to three engagements at a time. Tell us what you're building.</p>
          <span className="lp-btn-primary" style={{ background: acc }}>Get in touch</span>
        </div>
      </section>
    </div>
  )
}

export default function LivePreviewPanel() {
  return (
    <div className="live-preview-panel">

      {/* ── Presence bar ─────────────────────────────────────────────────── */}
      <div className="lp-presence-bar">
        <div className="lp-live-pill">
          <span className="lp-live-dot" />
          <span>Live · 4 viewing now</span>
        </div>

        <div className="lp-presence-avatars">
          {PRESENCE.map((p) => (
            <div
              key={p.initials}
              className="lp-avatar"
              style={{ background: p.color }}
              title={p.name}
            >
              {p.initials}
            </div>
          ))}
          {/* Current user always last */}
          <div className="lp-avatar lp-avatar-me" style={{ background: '#6264A7' }} title="You (Alex Morgan)">
            AM
          </div>
        </div>

        <span className="lp-presence-label">Shared scroll · No meeting required</span>
        <span className="lp-proposal-badge">Proposal</span>
      </div>

      {/* ── Preview + cursor overlay ──────────────────────────────────────── */}
      <div className="lp-preview-wrap">
        <SitePreview />

        {PRESENCE.map((p) => (
          <div
            key={p.initials}
            className={`lp-cursor ${p.driftClass}`}
            style={{ top: p.top, left: p.left }}
            aria-hidden="true"
          >
            {/* Cursor pointer */}
            <svg className="lp-cursor-svg" viewBox="0 0 14 20" width="14" height="20" fill={p.color}>
              <path d="M0 0 L14 8 L8 10 L5 17 Z" />
            </svg>
            {/* Name label */}
            <div className="lp-cursor-name" style={{ background: p.color }}>{p.name}</div>
          </div>
        ))}
      </div>

      {/* ── Footer note ──────────────────────────────────────────────────── */}
      <div className="lp-footer-note">
        Powered by chat-scoped Azure Fluid Relay · Real-time cursor + scroll sync without a meeting · This is a feature proposal
      </div>

    </div>
  )
}

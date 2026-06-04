import { useState, useEffect, useRef } from 'react'
import { agentLogos } from '../shared/agentLogos'
import { messagesByContact, contacts, currentUser } from '../data'
import { Avatar } from './common'
import './StageView.css'

const CHAT_ID = 44
const LOVABLE_ID = 43

// ── Version config ────────────────────────────────────────────────────────────
const SITE = {
  v1: {
    accent: '#0078D4',
    headline: <>Building your digital<br />presence</>,
    eyebrow: 'AI-native product consultancy',
  },
  v2: {
    accent: '#6264A7',
    headline: <>AI-native product strategy<br />for enterprise</>,
    eyebrow: 'AI-native product consultancy',
  },
}

// ── Mock website ──────────────────────────────────────────────────────────────
function MockWebsite({ version }) {
  const v = SITE[version] || SITE.v1
  const acc = v.accent

  return (
    <div className="sv-site">
      <nav className="sv-nav">
        <div className="sv-nav-inner">
          <div className="sv-nav-logo">
            <div className="sv-nav-logo-mark" style={{ background: acc }}>MC</div>
            <span className="sv-nav-logo-name">Morgan Collective</span>
          </div>
          <div className="sv-nav-links">
            <span className="sv-nav-link">About</span>
            <span className="sv-nav-link">Services</span>
            <span className="sv-nav-link">Work</span>
            <span className="sv-nav-link">Team</span>
          </div>
          <span className="sv-nav-cta" style={{ background: acc }}>Work with us</span>
        </div>
      </nav>

      <section className="sv-hero">
        <div className="sv-hero-inner">
          <div className="sv-hero-eyebrow" style={{ color: version === 'v2' ? '#a78bfa' : '#60a5fa' }}>
            {v.eyebrow}
          </div>
          <h1 className="sv-hero-headline">{v.headline}</h1>
          <p className="sv-hero-sub">
            We help forward-thinking companies build better AI products, faster.
            Strategy, design, and launch readiness — end to end.
          </p>
          <div className="sv-hero-actions">
            <span className="sv-btn-primary" style={{ background: acc }}>Work with us</span>
            <span className="sv-btn-outline">See our work</span>
          </div>
        </div>
      </section>

      <section className="sv-services">
        <div className="sv-section-inner">
          <h2 className="sv-section-title">What we do</h2>
          <p className="sv-section-sub">Focused engagements. Real outcomes.</p>
          <div className="sv-services-grid">
            {[
              { title: 'Product Strategy', desc: 'Roadmap reviews, PRD development, and org coaching for AI-native platforms.' },
              { title: 'Launch Readiness', desc: 'Milestone planning, cross-functional alignment, and readiness reviews.' },
              { title: 'AI Integration', desc: 'Hands-on advisory for teams embedding agents and LLMs into enterprise products.' },
            ].map((s) => (
              <div key={s.title} className="sv-service-card">
                <div className="sv-service-dot" style={{ background: acc }} />
                <h3 className="sv-service-title">{s.title}</h3>
                <p className="sv-service-desc">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="sv-team">
        <div className="sv-section-inner">
          <h2 className="sv-section-title">The team</h2>
          <div className="sv-team-grid">
            {[
              { initials: 'AM', name: 'Alex Morgan', role: 'Principal Consultant', color: acc },
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

      <section className="sv-cta" style={{ background: '#18181b' }}>
        <div className="sv-section-inner sv-cta-inner">
          <h2 className="sv-cta-title">Ready to work together?</h2>
          <p className="sv-cta-sub">Two to three engagements at a time. Tell us what you're building.</p>
          <span className="sv-btn-primary" style={{ background: acc }}>Get in touch</span>
        </div>
      </section>

      <footer className="sv-footer">
        <div className="sv-footer-inner">
          <span className="sv-footer-brand">Morgan Collective</span>
          <span className="sv-footer-copy">© 2026 · AI-native product strategy</span>
        </div>
      </footer>
    </div>
  )
}

// ── Chat rail ─────────────────────────────────────────────────────────────────
// Renders the group chat messages from contact 44 in a narrow Teams-style rail.
function ChatRail({ onCardAction }) {
  const messages = messagesByContact[CHAT_ID] || []
  const endRef = useRef(null)
  useEffect(() => { endRef.current?.scrollIntoView() }, [])

  return (
    <div className="sv-rail">
      <div className="sv-rail-header">
        <div className="sv-rail-avatar" style={{ background: '#6264A7', fontSize: 11, fontWeight: 700, color: '#fff' }}>MC</div>
        <div className="sv-rail-chat-name">Morgan Collective website</div>
      </div>

      <div className="sv-rail-messages">
        {messages.map((msg) => {
          if (msg.isSystem) {
            return (
              <div key={msg.id} className="sv-rail-system">{msg.text}</div>
            )
          }

          const isMe = msg.senderId === 'me'
          const sender = isMe
            ? currentUser
            : contacts.find((c) => c.id === msg.senderId)
          if (!sender) return null

          const textParts = Array.isArray(msg.text)
            ? msg.text.map((part, i) =>
                typeof part === 'string'
                  ? part
                  : <span key={i} className="sv-rail-mention">{part.name}</span>
              )
            : msg.text

          return (
            <div key={msg.id} className={`sv-rail-row ${isMe ? 'sv-rail-row-mine' : ''}`}>
              {!isMe && (
                <div className="sv-rail-sender-avatar">
                  <Avatar contact={sender} size={24} hideStatus />
                </div>
              )}
              <div className="sv-rail-bubble-col">
                {!isMe && <div className="sv-rail-sender-name">{sender.name}</div>}
                {textParts && (
                  <div className={`sv-rail-bubble ${isMe ? 'sv-rail-bubble-mine' : ''}`}>
                    {textParts}
                  </div>
                )}
                {msg.cards && msg.cards.map((card, ci) => (
                  card.type === 'file' ? null : (
                    <div key={ci} className="sv-rail-card" style={{ borderLeftColor: card.accentColor }}>
                      <div className="sv-rail-card-title">{card.title}</div>
                      {card.badge && (
                        <span className={`sv-rail-badge sv-rail-badge-${card.badge.tone}`}>
                          {card.badge.text}
                        </span>
                      )}
                      {card.steps && (
                        <div className="sv-rail-steps">
                          {card.steps.map((s, si) => (
                            <div key={si} className={`sv-rail-step sv-rail-step-${s.status}`}>
                              <span className="sv-rail-step-dot" />
                              <span className="sv-rail-step-text">{s.text}</span>
                            </div>
                          ))}
                        </div>
                      )}
                      {card.actions && (
                        <div className="sv-rail-card-actions">
                          {card.actions.map((action, ai) => {
                            const label = typeof action === 'string' ? action : action.label
                            const isPrimary = typeof action === 'object' && action.primary
                            const type = typeof action === 'object' ? action.type : null
                            const version = typeof action === 'object' ? action.version : null
                            return (
                              <button
                                key={ai}
                                className={`sv-rail-action-btn ${isPrimary ? 'sv-rail-action-btn-primary' : ''}`}
                                onClick={type ? () => onCardAction?.({ type, version }) : undefined}
                              >
                                {label}
                              </button>
                            )
                          })}
                        </div>
                      )}
                    </div>
                  )
                ))}
              </div>
            </div>
          )
        })}
        <div ref={endRef} />
      </div>

      <div className="sv-rail-compose">
        <div className="sv-rail-compose-input">Reply in chat…</div>
      </div>
    </div>
  )
}

// ── Stage View pop-out window ─────────────────────────────────────────────────
export default function StageView({ version = 'v1', onVersionChange, onClose }) {
  // displayVersion is what's actually rendered in the website preview.
  // It lags behind `version` to allow the update animation to play first.
  const [displayVersion, setDisplayVersion] = useState('v1')
  const [bannerState, setBannerState] = useState(null) // null | 'updating' | 'done'
  const prevVersionRef = useRef(version)

  useEffect(() => {
    if (version !== prevVersionRef.current && version !== displayVersion && bannerState === null) {
      prevVersionRef.current = version
      setBannerState('updating')
      const applyTimer = setTimeout(() => {
        setDisplayVersion(version)
        setBannerState('done')
        const clearTimer = setTimeout(() => setBannerState(null), 2200)
        return () => clearTimeout(clearTimer)
      }, 2800)
      return () => clearTimeout(applyTimer)
    }
  }, [version])

  const handleCardAction = ({ type, version: v }) => {
    if (type === 'open_stage_view' && v) {
      onVersionChange?.(v)
    }
  }

  return (
    <div className="sv-backdrop">
      <div className="sv-window">

        {/* Window title bar */}
        <div className="sv-titlebar">
          <div className="sv-titlebar-left">
            <div className="sv-titlebar-icon">
              {agentLogos.lovable(13)}
            </div>
            <span className="sv-titlebar-app">Lovable</span>
            <span className="sv-titlebar-sep">·</span>
            <span className="sv-titlebar-context">Morgan Collective — Live Preview</span>
          </div>
          <div className="sv-titlebar-right">
            <button className="sv-win-btn" aria-label="Minimize">
              <svg width="10" height="2" viewBox="0 0 10 2"><rect width="10" height="1.5" fill="currentColor" rx="1"/></svg>
            </button>
            <button className="sv-win-btn" aria-label="Maximize">
              <svg width="10" height="10" viewBox="0 0 10 10"><rect x="0.75" y="0.75" width="8.5" height="8.5" rx="1" stroke="currentColor" strokeWidth="1.5" fill="none"/></svg>
            </button>
            <button className="sv-win-btn sv-win-btn-close" aria-label="Close" onClick={onClose}>
              <svg width="10" height="10" viewBox="0 0 10 10">
                <path d="M1 1l8 8M9 1L1 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Update banner — spans full width, sits below title bar */}
        {bannerState && (
          <div className={`sv-banner sv-banner-${bannerState}`}>
            {bannerState === 'updating' ? (
              <>
                <div className="sv-banner-icon sv-banner-icon-spinner" />
                <span>Lovable is applying your updates…</span>
              </>
            ) : (
              <>
                <svg className="sv-banner-icon" width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M13.78 4.22a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L2.22 9.28a.75.75 0 0 1 1.06-1.06L6 10.94l6.72-6.72a.75.75 0 0 1 1.06 0z"/>
                </svg>
                <span>Updates applied</span>
              </>
            )}
          </div>
        )}

        {/* Content: preview left + chat rail right */}
        <div className="sv-content">
          <div className={`sv-preview ${bannerState === 'updating' ? 'sv-preview-updating' : ''}`}>
            <MockWebsite version={displayVersion} />
          </div>
          <ChatRail onCardAction={handleCardAction} />
        </div>

      </div>
    </div>
  )
}

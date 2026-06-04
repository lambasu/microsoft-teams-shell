import { useState, useEffect, useRef } from 'react'
import { agentLogos } from '../shared/agentLogos'
import { contacts, currentUser } from '../data'
import { Avatar, DemoArrow } from './common'
import './StageView8.css'

// ── Website versions ──────────────────────────────────────────────────────────
const BEACON = {
  v1: {
    accent: '#3b82f6',
    headline: 'Smarter decisions start with better data',
    subhead: 'Connect your tools. Surface what matters. Act with confidence.',
    sectionOrder: ['features', 'pricing', 'howItWorks'],
  },
  v2: {
    accent: '#3b82f6',
    headline: "Know what's driving your revenue — before you need to ask.",
    subhead: 'Connect your tools. Surface what matters. Act with confidence.',
    sectionOrder: ['features', 'howItWorks', 'pricing'],
  },
  v3: {
    accent: '#3b82f6',
    headline: 'Revenue clarity. Before you need it.',
    subhead: 'Connect your tools. Surface what matters. Act with confidence.',
    sectionOrder: ['features', 'howItWorks', 'pricing'],
  },
}

// ── Mock website ──────────────────────────────────────────────────────────────
function MockWebsite8({ version, isEditing }) {
  const v = BEACON[version] || BEACON.v1
  const acc = v.accent

  const FeaturesSection = () => (
    <section className="sv8-section sv8-features">
      <div className="sv8-section-inner">
        <h2 className="sv8-section-title">Built for how businesses actually run</h2>
        <div className="sv8-features-grid">
          {[
            { title: 'Real-time Analytics', desc: 'Every data source unified. See the full picture across revenue, pipeline, and usage as it happens.' },
            { title: 'Revenue Forecasting', desc: 'AI-powered projections that account for seasonality, churn signals, and the leading indicators your team trusts.' },
            { title: '50+ Integrations', desc: 'Salesforce, Stripe, HubSpot, Postgres, and more. Connect in minutes — no data team required.' },
          ].map(f => (
            <div key={f.title} className="sv8-feature-card">
              <div className="sv8-feature-dot" style={{ background: acc }} />
              <h3 className="sv8-feature-title">{f.title}</h3>
              <p className="sv8-feature-desc">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )

  const HowItWorksSection = () => (
    <section className="sv8-section sv8-how">
      <div className="sv8-section-inner">
        <h2 className="sv8-section-title">How it works</h2>
        <div className="sv8-how-steps">
          {[
            { n: '1', title: 'Connect your stack', desc: 'One-click integrations with your CRM, billing, and analytics tools.' },
            { n: '2', title: 'Beacon maps your data', desc: 'Automatic schema discovery and metric definitions. No SQL required.' },
            { n: '3', title: 'Act on what matters', desc: 'Dashboards, alerts, and AI summaries delivered where your team works.' },
          ].map(s => (
            <div key={s.n} className="sv8-how-step">
              <div className="sv8-how-num" style={{ background: acc }}>{s.n}</div>
              <div>
                <div className="sv8-how-title">{s.title}</div>
                <div className="sv8-how-desc">{s.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )

  const PricingSection = () => (
    <section className="sv8-section sv8-pricing">
      <div className="sv8-section-inner">
        <h2 className="sv8-section-title">Simple pricing</h2>
        <p className="sv8-section-sub">Start free. Scale when you're ready.</p>
        <div className="sv8-pricing-grid">
          {[
            { name: 'Starter', price: 'Free', desc: 'Up to 3 users, 2 integrations, 30-day history.', highlight: false },
            { name: 'Growth', price: '$49/mo', desc: 'Unlimited users, all integrations, 1-year history.', highlight: true },
            { name: 'Enterprise', price: 'Custom', desc: 'SSO, audit logs, dedicated support, SLA.', highlight: false },
          ].map(p => (
            <div key={p.name} className={`sv8-price-card ${p.highlight ? 'sv8-price-card-highlight' : ''}`} style={p.highlight ? { borderColor: acc } : {}}>
              <div className="sv8-price-name">{p.name}</div>
              <div className="sv8-price-amount" style={p.highlight ? { color: acc } : {}}>{p.price}</div>
              <div className="sv8-price-desc">{p.desc}</div>
              <span className="sv8-price-cta" style={p.highlight ? { background: acc } : {}}>
                {p.name === 'Enterprise' ? 'Contact us' : 'Get started'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )

  const sections = {
    features: <FeaturesSection key="features" />,
    howItWorks: <HowItWorksSection key="how" />,
    pricing: <PricingSection key="pricing" />,
  }

  return (
    <div className="sv8-site">
      <nav className="sv8-nav">
        <div className="sv8-nav-inner">
          <div className="sv8-nav-logo">
            <div className="sv8-nav-logo-mark" style={{ background: acc }}>B</div>
            <span className="sv8-nav-logo-name">Beacon</span>
          </div>
          <div className="sv8-nav-links">
            <span className="sv8-nav-link">Product</span>
            <span className="sv8-nav-link">Pricing</span>
            <span className="sv8-nav-link">Customers</span>
            <span className="sv8-nav-link">Docs</span>
          </div>
          <span className="sv8-nav-cta" style={{ background: acc }}>Start free trial</span>
        </div>
      </nav>

      <section className="sv8-hero">
        <div className="sv8-hero-inner">
          <div className="sv8-hero-content">
            <div className="sv8-hero-eyebrow">Business analytics for modern teams</div>
            <h1 className={`sv8-hero-headline ${isEditing ? 'sv8-editing-elem' : ''}`}>
              {v.headline}
            </h1>
            <p className={`sv8-hero-sub ${isEditing ? 'sv8-editing-elem' : ''}`}>{v.subhead}</p>
            <div className="sv8-hero-actions">
              <span className="sv8-btn-primary" style={{ background: acc }}>Start free trial</span>
              <span className="sv8-btn-outline">See how it works</span>
            </div>
          </div>
          <div className="sv8-hero-visual">
            <div className="sv8-dashboard-mock">
              <div className="sv8-dash-header">
                <span className="sv8-dash-dot sv8-dash-dot-r" /><span className="sv8-dash-dot sv8-dash-dot-y" /><span className="sv8-dash-dot sv8-dash-dot-g" />
                <span className="sv8-dash-title">Revenue Overview · Apr 2026</span>
              </div>
              <div className="sv8-dash-metrics">
                <div className="sv8-dash-metric"><div className="sv8-dash-val" style={{ color: acc }}>$482K</div><div className="sv8-dash-label">MRR</div></div>
                <div className="sv8-dash-metric"><div className="sv8-dash-val sv8-dash-val-green">+18%</div><div className="sv8-dash-label">Growth</div></div>
                <div className="sv8-dash-metric"><div className="sv8-dash-val">94%</div><div className="sv8-dash-label">Retention</div></div>
              </div>
              <div className="sv8-dash-bars">
                {[55, 68, 62, 78, 75, 88, 100].map((h, i) => (
                  <div key={i} className="sv8-dash-bar" style={{ height: `${h * 0.55}%`, background: acc, opacity: 0.4 + i * 0.08 }} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Editing overlay on sections during live edit */}
      <div className={`sv8-sections-wrap ${isEditing ? 'sv8-sections-editing' : ''}`}>
        {v.sectionOrder.map(key => sections[key])}
      </div>

      <footer className="sv8-footer">
        <div className="sv8-footer-inner">
          <span className="sv8-footer-brand">Beacon</span>
          <span className="sv8-footer-copy">© 2026 · AI-powered business analytics</span>
        </div>
      </footer>
    </div>
  )
}

// ── Chat rail ─────────────────────────────────────────────────────────────────
function ChatRail8({ messages, beat, onBeatAdvance, onCardAction, compose, onComposeChange, onComposeSend }) {
  const endRef = useRef(null)

  // Only show Stage View feedback messages (id >= 9) and dynamic extras (string ids)
  const railMessages = messages.filter(m => {
    if (typeof m.id === 'number' && m.id < 9) return false
    if (typeof m.id === 'number' && m.id > 11 && beat < 5) return false
    return true
  })

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [railMessages.length, beat])

  return (
    <div className="sv8-rail">
      <div className="sv8-rail-header">
        <div className="sv8-rail-avatar">BS</div>
        <div className="sv8-rail-chat-name">Beacon site</div>
      </div>

      {beat === 4 && (
        <div className="sv8-rail-guide">
          <span className="sv8-rail-guide-num">Step 4 of 5</span>
          <span className="sv8-rail-guide-text">The team is reviewing the first draft</span>
          <button className="sv8-rail-guide-next" onClick={onBeatAdvance}>Next →</button>
        </div>
      )}
      {beat === 5 && (
        <div className="sv8-rail-guide">
          <span className="sv8-rail-guide-num">Step 5 of 5</span>
          <span className="sv8-rail-guide-text">Lovable has an update plan — click <strong>Approve</strong></span>
          <span className="sv8-rail-guide-arrow"><DemoArrow direction="down" size={14} /></span>
        </div>
      )}
      {beat === 7 && (
        <div className="sv8-rail-guide sv8-rail-guide-info">
          <span className="sv8-rail-guide-text">Highlight text in the preview, then pick an action from the menu</span>
        </div>
      )}

      <div className="sv8-rail-messages">
        {railMessages.map(msg => {
          if (msg.isSystem) return <div key={msg.id} className="sv8-rail-system">{msg.text}</div>

          const isMe = msg.senderId === 'me'
          const sender = isMe ? currentUser : contacts.find(c => c.id === msg.senderId)
          if (!sender) return null

          const textParts = Array.isArray(msg.text)
            ? msg.text.map((part, i) =>
                typeof part === 'string' ? part : <span key={i} className="sv8-rail-mention">{part.name}</span>
              )
            : msg.text

          return (
            <div key={msg.id} className={`sv8-rail-row ${isMe ? 'sv8-rail-row-mine' : ''}`}>
              {!isMe && <div className="sv8-rail-sender-avatar"><Avatar contact={sender} size={24} hideStatus /></div>}
              <div className="sv8-rail-bubble-col">
                {!isMe && <div className="sv8-rail-sender-name">{sender.name}</div>}
                {textParts && (
                  <div className={`sv8-rail-bubble ${isMe ? 'sv8-rail-bubble-mine' : ''}`}>{textParts}</div>
                )}
                {msg.cards?.map((card, ci) => (
                  <div key={ci} className="sv8-rail-card" style={{ borderLeftColor: card.accentColor }}>
                    <div className="sv8-rail-card-title">{card.title}</div>
                    {card.badge && (
                      <span className={`sv8-rail-badge sv8-rail-badge-${card.badge.tone}`}>{card.badge.text}</span>
                    )}
                    {card.steps && (
                      <div className="sv8-rail-steps">
                        {card.steps.map((s, si) => (
                          <div key={si} className={`sv8-rail-step sv8-rail-step-${s.status}`}>
                            <span className="sv8-rail-step-dot" />
                            <span>{s.text}</span>
                          </div>
                        ))}
                      </div>
                    )}
                    {card.actions && (
                      <div className="sv8-rail-card-actions">
                        {card.actions.map((action, ai) => {
                          const label = typeof action === 'string' ? action : action.label
                          const isPrimary = typeof action === 'object' && action.primary
                          const type = typeof action === 'object' ? action.type : null
                          return (
                            <button
                              key={ai}
                              className={`sv8-rail-action-btn ${isPrimary ? 'sv8-rail-action-btn-primary' : ''}`}
                              onClick={type ? () => onCardAction?.({ type }) : undefined}
                            >
                              {label}
                            </button>
                          )
                        })}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )
        })}
        <div ref={endRef} />
      </div>

      {beat >= 7 ? (
        <div className="sv8-rail-compose-area">
          <input
            className="sv8-rail-compose-input"
            value={compose}
            onChange={e => onComposeChange(e.target.value)}
            placeholder="@Lovable…"
            onKeyDown={e => { if (e.key === 'Enter' && compose.trim()) onComposeSend() }}
          />
          <button
            className="sv8-rail-compose-send"
            disabled={!compose.trim()}
            onClick={onComposeSend}
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
              <path d="M1.724 1.053a.5.5 0 0 0-.714.545l1.403 4.85a.5.5 0 0 0 .397.354l5.69.953c.174.029.174.275 0 .304l-5.69.953a.5.5 0 0 0-.397.354l-1.403 4.85a.5.5 0 0 0 .714.545l13-6.5a.5.5 0 0 0 0-.894l-13-6.5z"/>
            </svg>
          </button>
        </div>
      ) : (
        <div className="sv8-rail-compose-placeholder">Reply in chat…</div>
      )}
    </div>
  )
}

// ── Stage View 8 ──────────────────────────────────────────────────────────────
export default function StageView8({ messages, beat, onBeatAdvance, onUpdateComplete, onSendMessage, onClose }) {
  const [displayVersion, setDisplayVersion] = useState('v1')
  const [isEditing, setIsEditing] = useState(false)
  const [selectionMenu, setSelectionMenu] = useState(null) // { x, y, text } | null
  const [compose, setCompose] = useState('')
  const [bannerState, setBannerState] = useState(null) // null | 'updating' | 'done'
  const previewRef = useRef(null)

  // Beat 6: live editing animation v1 → v2
  useEffect(() => {
    if (beat !== 6) return
    setBannerState('updating')
    setIsEditing(true)
    const t = setTimeout(() => {
      setIsEditing(false)
      setDisplayVersion('v2')
      setBannerState('done')
      onUpdateComplete?.()
      const clearT = setTimeout(() => setBannerState(null), 2200)
      return () => clearTimeout(clearT)
    }, 3200)
    return () => clearTimeout(t)
  }, [beat])

  // Beat 8: flash headline to v3 (text selection update applied)
  useEffect(() => {
    if (beat !== 8) return
    setDisplayVersion('v3')
  }, [beat])

  // Detect text selection in the preview (beat 7+)
  const handlePreviewMouseUp = () => {
    if (beat < 7) return
    const sel = window.getSelection()
    const text = sel?.toString().trim()
    if (!text || text.length < 3) { setSelectionMenu(null); return }
    try {
      const range = sel.getRangeAt(0)
      const rect = range.getBoundingClientRect()
      const previewRect = previewRef.current?.getBoundingClientRect()
      if (!previewRect) return
      setSelectionMenu({
        x: Math.max(80, Math.min(rect.left + rect.width / 2 - previewRect.left, previewRect.width - 80)),
        y: rect.top - previewRect.top - 4,
        text,
      })
    } catch { /* ignore */ }
  }

  const handleSelectionAction = (action) => {
    if (!selectionMenu) return
    let prefill = ''
    if (action === 'update') prefill = `@Lovable, update selected text to `
    else if (action === 'shorten') prefill = `@Lovable, make this shorter: "${selectionMenu.text}"`
    else if (action === 'tone') prefill = `@Lovable, change tone of selected text to `
    setCompose(prefill)
    setSelectionMenu(null)
    window.getSelection()?.removeAllRanges()
  }

  const handleRailCardAction = ({ type }) => {
    if (type === 'p8_approve_update') onBeatAdvance?.() // beat 5 → 6
  }

  const handleComposeSend = () => {
    if (!compose.trim()) return
    onSendMessage?.(compose.trim())
    setCompose('')
  }

  return (
    <div className="sv8-backdrop">
      <div className="sv8-window">

        {/* Title bar */}
        <div className="sv8-titlebar">
          <div className="sv8-titlebar-left">
            <div className="sv8-titlebar-icon">{agentLogos.lovable(13)}</div>
            <span className="sv8-titlebar-app">Lovable</span>
            <span className="sv8-titlebar-sep">·</span>
            <span className="sv8-titlebar-context">Beacon — Live Preview</span>
          </div>
          <div className="sv8-titlebar-right">
            <button className="sv8-win-btn" aria-label="Minimize">
              <svg width="10" height="2" viewBox="0 0 10 2"><rect width="10" height="1.5" fill="currentColor" rx="1"/></svg>
            </button>
            <button className="sv8-win-btn" aria-label="Maximize">
              <svg width="10" height="10" viewBox="0 0 10 10"><rect x=".75" y=".75" width="8.5" height="8.5" rx="1" stroke="currentColor" strokeWidth="1.5" fill="none"/></svg>
            </button>
            <button className="sv8-win-btn sv8-win-btn-close" aria-label="Close" onClick={onClose}>
              <svg width="10" height="10" viewBox="0 0 10 10"><path d="M1 1l8 8M9 1L1 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
            </button>
          </div>
        </div>

        {/* Update banner */}
        {bannerState && (
          <div className={`sv8-banner sv8-banner-${bannerState}`}>
            {bannerState === 'updating' ? (
              <>
                <div className="sv8-banner-spinner" />
                <span>Lovable is applying your updates…</span>
              </>
            ) : (
              <>
                <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M13.78 4.22a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L2.22 9.28a.75.75 0 0 1 1.06-1.06L6 10.94l6.72-6.72a.75.75 0 0 1 1.06 0z"/>
                </svg>
                <span>Updates applied</span>
              </>
            )}
          </div>
        )}

        {/* Main content: preview left + chat rail right */}
        <div className="sv8-content">
          <div
            className={`sv8-preview ${isEditing ? 'sv8-preview-editing' : ''}`}
            ref={previewRef}
            onMouseUp={handlePreviewMouseUp}
          >
            <MockWebsite8 version={displayVersion} isEditing={isEditing} />

            {/* Text-selection hint shown at beat 7 before any selection */}
            {beat === 7 && !selectionMenu && !compose && (
              <div className="sv8-select-hint">
                <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"/>
                  <path d="M7.646 1.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 2.707V11.5a.5.5 0 0 1-1 0V2.707L5.354 4.854a.5.5 0 1 1-.708-.708l3-3z"/>
                </svg>
                Highlight any text in the preview to request an edit
              </div>
            )}

            {/* Floating text selection dropdown */}
            {selectionMenu && (
              <div
                className="sv8-selection-menu"
                style={{ left: selectionMenu.x, top: selectionMenu.y }}
              >
                <div className="sv8-selection-selected">
                  "{selectionMenu.text.length > 45 ? selectionMenu.text.slice(0, 45) + '…' : selectionMenu.text}"
                </div>
                <button className="sv8-selection-action" onClick={() => handleSelectionAction('update')}>
                  Update selected text to…
                </button>
                <button className="sv8-selection-action" onClick={() => handleSelectionAction('shorten')}>
                  Make shorter
                </button>
                <button className="sv8-selection-action" onClick={() => handleSelectionAction('tone')}>
                  Change tone…
                </button>
              </div>
            )}
          </div>

          <ChatRail8
            messages={messages}
            beat={beat}
            onBeatAdvance={onBeatAdvance}
            onCardAction={handleRailCardAction}
            compose={compose}
            onComposeChange={setCompose}
            onComposeSend={handleComposeSend}
          />
        </div>
      </div>
    </div>
  )
}

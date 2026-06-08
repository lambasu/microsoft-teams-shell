import { useState, useEffect, useRef } from 'react'
import { agentLogos } from '../shared/agentLogos'
import { contacts, currentUser } from '../data'
import { Avatar } from './common'
import './StageView9.css'

// ── App versions ───────────────────────────────────────────────────────────
const APP_VERSIONS = {
  v1: {
    headline: 'Build smarter — ship faster',
    sub: 'Delegate work to AI agents inside Microsoft Teams. No setup. No re-briefing. Full context preserved from conversation to completion.',
  },
  v2: {
    headline: 'Delegate work. Keep the thread.',
    sub: 'AI agents that live in Teams, read the context, and hand off work without losing a step. From discussion to deployed — inside the chat.',
  },
}

// ── Mock app prototype ─────────────────────────────────────────────────────
function MockApp({ version, onTextClick, editActive }) {
  const v = APP_VERSIONS[version] || APP_VERSIONS.v1

  return (
    <div className="sv9-app">
      <nav className="sv9-nav">
        <div className="sv9-nav-inner">
          <div className="sv9-nav-logo">
            <div className="sv9-nav-logo-mark">AP</div>
            <span className="sv9-nav-logo-name">Agents Platform v2</span>
          </div>
          <div className="sv9-nav-links">
            <span className="sv9-nav-link">Product</span>
            <span className="sv9-nav-link">Docs</span>
            <span className="sv9-nav-link">Team</span>
            <span className="sv9-nav-link">Changelog</span>
          </div>
          <span className="sv9-nav-cta">Request access</span>
        </div>
      </nav>

      <section className="sv9-hero">
        <div className="sv9-hero-inner">
          <div className="sv9-hero-content">
            <div className="sv9-hero-eyebrow">Northwind Agents Platform v2</div>
            <h1
              className={`sv9-hero-headline${editActive ? ' sv9-editable' : ''}`}
              onClick={editActive ? (e) => onTextClick(e, v.headline) : undefined}
            >
              {v.headline}
            </h1>
            <p
              className={`sv9-hero-sub${editActive ? ' sv9-editable' : ''}`}
              onClick={editActive ? (e) => onTextClick(e, v.sub) : undefined}
            >
              {v.sub}
            </p>
            <div className="sv9-hero-actions">
              <span className="sv9-btn-primary">Request early access</span>
              <span className="sv9-btn-outline">See the platform</span>
            </div>
          </div>
          <div className="sv9-hero-visual">
            <div className="sv9-dash-mock">
              <div className="sv9-dash-header">
                <span className="sv9-dash-dot sv9-dash-dot-r" />
                <span className="sv9-dash-dot sv9-dash-dot-y" />
                <span className="sv9-dash-dot sv9-dash-dot-g" />
                <span className="sv9-dash-title">Active agents · Apr 22</span>
              </div>
              <div className="sv9-dash-agents">
                {[
                  { name: 'Jira — JIRA-4593 fix', status: 'Running', color: '#107C10' },
                  { name: 'GitHub Copilot — PR #4598', status: 'In review', color: '#0078D4' },
                  { name: 'Facilitator — sprint sync', status: 'Monitoring', color: '#8764B8' },
                ].map(a => (
                  <div key={a.name} className="sv9-dash-agent-row">
                    <div className="sv9-dash-agent-dot" style={{ background: a.color }} />
                    <span className="sv9-dash-agent-name">{a.name}</span>
                    <span className="sv9-dash-agent-status">{a.status}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="sv9-features">
        <div className="sv9-section-inner">
          <h2 className="sv9-section-title">Built for how teams already work</h2>
          <p className="sv9-section-sub">No new tool to learn. Agents meet you inside Teams.</p>
          <div className="sv9-features-grid">
            {[
              { title: 'Instant context', desc: 'Agents read the conversation and get up to speed in seconds — no briefing required.' },
              { title: 'Agentic workflows', desc: 'Assign tasks, get PRs opened, code reviewed, and deployed without leaving the chat.' },
              { title: 'In-chat review', desc: 'Approve, request changes, and iterate on agent output right inside the thread.' },
            ].map(f => (
              <div key={f.title} className="sv9-feature-card">
                <div className="sv9-feature-dot" />
                <h3 className="sv9-feature-title">{f.title}</h3>
                <p className="sv9-feature-desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="sv9-cta">
        <div className="sv9-section-inner sv9-cta-inner">
          <h2 className="sv9-cta-title">Ready to try it?</h2>
          <p className="sv9-cta-sub">
            Agents Platform v2 opens to early access on April 25.
            Request your spot and we'll send onboarding details the day it ships.
          </p>
          <span className="sv9-cta-btn">Request early access</span>
        </div>
      </section>

      <footer className="sv9-footer">
        <div className="sv9-footer-inner">
          <span className="sv9-footer-brand">Northwind Agents Platform</span>
          <span className="sv9-footer-copy">© 2026 · Northwind Traders</span>
        </div>
      </footer>
    </div>
  )
}

// ── Thread rail (right side) ───────────────────────────────────────────────
function ThreadRail({ messages, isTyping, compose, onComposeChange, onComposeSend }) {
  const endRef = useRef(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages.length, isTyping])

  // Auto-focus compose when it gets pre-filled
  const inputRef = useRef(null)
  useEffect(() => {
    if (compose && inputRef.current) inputRef.current.focus()
  }, [compose])

  return (
    <div className="sv9-rail">
      <div className="sv9-rail-header">
        <svg className="sv9-rail-thread-icon" width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
          <path d="M2 2.5A2.5 2.5 0 0 1 4.5 0h7A2.5 2.5 0 0 1 14 2.5v7A2.5 2.5 0 0 1 11.5 12H8.6l-2.1 2.4A.75.75 0 0 1 5 13.85V12h-.5A2.5 2.5 0 0 1 2 9.5v-7z"/>
        </svg>
        <span className="sv9-rail-thread-label">Thread</span>
      </div>

      <div className="sv9-rail-messages">
        {messages.map((msg) => {
          if (msg.isSystem) {
            return <div key={msg.id} className="sv9-rail-system">{msg.text}</div>
          }

          const isMe = msg.senderId === 'me'
          const sender = isMe ? currentUser : contacts.find(c => c.id === msg.senderId)
          if (!sender) return null

          const textParts = Array.isArray(msg.text)
            ? msg.text.map((part, i) =>
                typeof part === 'string'
                  ? part
                  : <span key={i} className="sv9-rail-mention">{part.name}</span>
              )
            : msg.text

          return (
            <div key={msg.id} className={`sv9-rail-row ${isMe ? 'sv9-rail-row-mine' : ''}`}>
              {!isMe && (
                <div className="sv9-rail-sender-avatar">
                  <Avatar contact={sender} size={24} hideStatus />
                </div>
              )}
              <div className="sv9-rail-bubble-col">
                {!isMe && <div className="sv9-rail-sender-name">{sender.name}</div>}
                {textParts && (
                  <div className={`sv9-rail-bubble ${isMe ? 'sv9-rail-bubble-mine' : ''}`}>
                    {textParts}
                  </div>
                )}
                {msg.cards?.map((card, ci) => (
                  <div key={ci} className="sv9-rail-card" style={{ borderLeftColor: card.accentColor }}>
                    <div className="sv9-rail-card-title">{card.title}</div>
                    {card.badge && (
                      <span className={`sv9-rail-badge sv9-rail-badge-${card.badge.tone}`}>
                        {card.badge.text}
                      </span>
                    )}
                    {card.steps && (
                      <div className="sv9-rail-steps">
                        {card.steps.map((s, si) => (
                          <div key={si} className={`sv9-rail-step sv9-rail-step-${s.status}`}>
                            <span className="sv9-rail-step-dot" />
                            <span>{s.text}</span>
                          </div>
                        ))}
                      </div>
                    )}
                    {card.presence && (
                      <div className="sv9-rail-card-presence">
                        <div className="sv9-rail-presence-chips">
                          {card.presence.viewers.map(v => (
                            <div key={v.name} className="sv9-rail-presence-chip" title={v.name}>
                              <div className="sv9-rail-presence-initials" style={{ background: v.color }}>{v.initials}</div>
                              <div className={`sv9-rail-presence-dot sv9-rail-presence-dot-${v.status}`} />
                            </div>
                          ))}
                        </div>
                        {card.presence.label && (
                          <span className="sv9-rail-presence-label">{card.presence.label}</span>
                        )}
                      </div>
                    )}
                  </div>
                ))}
                {msg.time && <div className="sv9-rail-time">{msg.time}</div>}
              </div>
            </div>
          )
        })}

        {isTyping && (
          <div className="sv9-rail-typing">
            <div className="sv9-rail-typing-dots">
              <div className="sv9-rail-typing-dot" />
              <div className="sv9-rail-typing-dot" />
              <div className="sv9-rail-typing-dot" />
            </div>
          </div>
        )}

        <div ref={endRef} />
      </div>

      <div className="sv9-rail-compose">
        <input
          ref={inputRef}
          className="sv9-rail-compose-input"
          value={compose}
          onChange={e => onComposeChange(e.target.value)}
          placeholder="@Lovable…"
          onKeyDown={e => { if (e.key === 'Enter' && compose.trim()) onComposeSend() }}
        />
        <button
          className="sv9-rail-compose-send"
          disabled={!compose.trim()}
          onClick={onComposeSend}
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
            <path d="M1.724 1.053a.5.5 0 0 0-.714.545l1.403 4.85a.5.5 0 0 0 .397.354l5.69.953c.174.029.174.275 0 .304l-5.69.953a.5.5 0 0 0-.397.354l-1.403 4.85a.5.5 0 0 0 .714.545l13-6.5a.5.5 0 0 0 0-.894l-13-6.5z"/>
          </svg>
        </button>
      </div>
    </div>
  )
}

// ── Stage View 9 ───────────────────────────────────────────────────────────
export default function StageView9({ threadMessages, threadTyping, beat, onUpdateComplete, onSendMessage, onClose }) {
  const [displayVersion, setDisplayVersion] = useState('v1')
  const [clickMenu, setClickMenu] = useState(null) // { x, y, text } | null
  const [compose, setCompose] = useState('')
  const [bannerState, setBannerState] = useState(null) // null | 'updating' | 'done'
  const previewRef = useRef(null)

  // beat 8: text update applied → switch to v2
  useEffect(() => {
    if (beat !== 8) return
    setBannerState('updating')
    const t = setTimeout(() => {
      setDisplayVersion('v2')
      setBannerState('done')
      onUpdateComplete?.()
      const clearT = setTimeout(() => setBannerState(null), 2200)
      return () => clearTimeout(clearT)
    }, 1800)
    return () => clearTimeout(t)
  }, [beat])

  // Clicking a text element in the preview
  const handleTextClick = (e, text) => {
    e.stopPropagation()
    const targetRect = e.currentTarget.getBoundingClientRect()
    const previewRect = previewRef.current?.getBoundingClientRect()
    if (!previewRect) return
    setClickMenu({
      x: targetRect.left + targetRect.width / 2 - previewRect.left,
      y: targetRect.top - previewRect.top + previewRef.current.scrollTop,
      text,
    })
  }

  const handleMenuAction = (action) => {
    if (!clickMenu) return
    const t = clickMenu.text.length > 50 ? clickMenu.text.slice(0, 50) + '…' : clickMenu.text
    if (action === 'rewrite') {
      setCompose(`@Lovable Rewrite selected text: "${t}"`)
    } else if (action === 'shorten') {
      setCompose(`@Lovable Make this shorter: "${t}"`)
    } else if (action === 'tone') {
      setCompose(`@Lovable Change tone of: "${t}"`)
    }
    setClickMenu(null)
  }

  const handleComposeSend = () => {
    if (!compose.trim()) return
    onSendMessage?.(compose.trim())
    setCompose('')
  }

  const editActive = beat >= 4 && beat < 8 && !bannerState

  return (
    <div className="sv9-backdrop" onClick={() => setClickMenu(null)}>
      <div className="sv9-window" onClick={e => e.stopPropagation()}>

        {/* Title bar */}
        <div className="sv9-titlebar">
          <div className="sv9-titlebar-left">
            <div className="sv9-titlebar-icon">{agentLogos.lovable(13)}</div>
            <span className="sv9-titlebar-app">Lovable</span>
            <span className="sv9-titlebar-sep">·</span>
            <span className="sv9-titlebar-ctx">Agents Platform v2 — Live Preview</span>
          </div>
          <div className="sv9-titlebar-right">
            <button className="sv9-win-btn" aria-label="Minimize">
              <svg width="10" height="2" viewBox="0 0 10 2"><rect width="10" height="1.5" fill="currentColor" rx="1"/></svg>
            </button>
            <button className="sv9-win-btn" aria-label="Maximize">
              <svg width="10" height="10" viewBox="0 0 10 10"><rect x=".75" y=".75" width="8.5" height="8.5" rx="1" stroke="currentColor" strokeWidth="1.5" fill="none"/></svg>
            </button>
            <button className="sv9-win-btn sv9-win-btn-close" aria-label="Close" onClick={onClose}>
              <svg width="10" height="10" viewBox="0 0 10 10"><path d="M1 1l8 8M9 1L1 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
            </button>
          </div>
        </div>

        {/* Presence bar */}
        <div className="sv9-presence-bar">
          <span className="sv9-presence-bar-label">Viewing with you:</span>
          <div className="sv9-presence-chips">
            {[
              { name: 'Rachel Thompson', initials: 'RT', color: '#C19C00', status: 'available' },
              { name: 'Kevin Park', initials: 'KP', color: '#0078D4', status: 'away' },
              { name: 'Sarah Chen', initials: 'SC', color: '#038387', status: 'available' },
            ].map(v => (
              <div key={v.name} className="sv9-presence-chip" title={v.name}>
                <div className="sv9-presence-initials" style={{ background: v.color }}>{v.initials}</div>
                <div className={`sv9-presence-dot sv9-presence-dot-${v.status}`} />
              </div>
            ))}
            <div className="sv9-presence-chip" title="You">
              <div className="sv9-presence-initials sv9-presence-you">You</div>
            </div>
          </div>
        </div>

        {/* Step 4 guide */}
        {beat === 4 && !clickMenu && !compose && (
          <div className="sv9-step-guide">
            <span className="sv9-step-num">Step 4 — </span>
            <span className="sv9-step-text">Click the headline in the preview, select <strong>Rewrite selected text</strong>, then send the pre-filled @Lovable message</span>
          </div>
        )}

        {/* Update banner */}
        {bannerState && (
          <div className={`sv9-banner sv9-banner-${bannerState}`}>
            {bannerState === 'updating' ? (
              <>
                <div className="sv9-banner-spinner" />
                <span>Lovable is rewriting the text…</span>
              </>
            ) : (
              <>
                <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M13.78 4.22a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L2.22 9.28a.75.75 0 0 1 1.06-1.06L6 10.94l6.72-6.72a.75.75 0 0 1 1.06 0z"/>
                </svg>
                <span>Text updated</span>
              </>
            )}
          </div>
        )}

        {/* Main content: app preview + thread rail */}
        <div className="sv9-content">
          <div
            className={`sv9-preview ${bannerState === 'updating' ? 'sv9-preview-updating' : ''}`}
            ref={previewRef}
            onClick={() => setClickMenu(null)}
          >
            <MockApp
              version={displayVersion}
              onTextClick={handleTextClick}
              editActive={editActive}
            />

            {/* Hint: click any text to edit */}
            {beat === 4 && !clickMenu && !compose && (
              <div className="sv9-click-hint">
                <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M14.082 2.182a.5.5 0 0 1 .103.557L8.528 15.467a.5.5 0 0 1-.917-.007L5.57 10.694.803 8.652a.5.5 0 0 1-.006-.916l12.728-5.657a.5.5 0 0 1 .556.103z"/>
                </svg>
                Click the headline to request an edit
              </div>
            )}

            {/* Click menu */}
            {clickMenu && (
              <div
                className="sv9-click-menu"
                style={{ left: clickMenu.x, top: clickMenu.y }}
                onClick={e => e.stopPropagation()}
              >
                <div className="sv9-click-menu-label">
                  "{clickMenu.text.length > 38 ? clickMenu.text.slice(0, 38) + '…' : clickMenu.text}"
                </div>
                <button
                  className="sv9-click-menu-action sv9-click-menu-action-primary"
                  onClick={() => handleMenuAction('rewrite')}
                >
                  Rewrite selected text
                </button>
                <button
                  className="sv9-click-menu-action"
                  onClick={() => handleMenuAction('shorten')}
                >
                  Make shorter
                </button>
                <button
                  className="sv9-click-menu-action"
                  onClick={() => handleMenuAction('tone')}
                >
                  Change tone
                </button>
              </div>
            )}
          </div>

          <ThreadRail
            messages={threadMessages}
            isTyping={threadTyping}
            compose={compose}
            onComposeChange={setCompose}
            onComposeSend={handleComposeSend}
          />
        </div>
      </div>
    </div>
  )
}

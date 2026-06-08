import { useRef, useEffect } from 'react'
import { contacts, currentUser } from '../data'
import { Avatar } from './common'
import './P9ThreadRail.css'

function PresenceSection({ viewers, label }) {
  return (
    <div className="p9tr-presence">
      <div className="p9tr-presence-avatars">
        {viewers.map(v => (
          <div key={v.name} className="p9tr-presence-chip">
            <div className="p9tr-presence-initials" style={{ background: v.color }}>
              {v.initials}
            </div>
            <div className={`p9tr-presence-dot p9tr-presence-dot-${v.status}`} />
          </div>
        ))}
      </div>
      {label && <span className="p9tr-presence-label">{label}</span>}
    </div>
  )
}

const renderText = (text) => {
  if (!Array.isArray(text)) return text
  return text.map((part, i) =>
    typeof part === 'string'
      ? part
      : <span key={i} className="p9tr-mention">{part.name}</span>
  )
}

export default function P9ThreadRail({ rootMessage, messages, isTyping, onCardAction, onClose }) {
  const endRef = useRef(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages.length, isTyping])

  const rootSender = rootMessage
    ? (rootMessage.senderId === 'me' ? currentUser : contacts.find(c => c.id === rootMessage.senderId))
    : null

  return (
    <div className="p9tr">
      <div className="p9tr-header">
        <svg className="p9tr-header-icon" width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
          <path d="M2 2.5A2.5 2.5 0 0 1 4.5 0h7A2.5 2.5 0 0 1 14 2.5v7A2.5 2.5 0 0 1 11.5 12H8.6l-2.1 2.4A.75.75 0 0 1 5 13.85V12h-.5A2.5 2.5 0 0 1 2 9.5v-7z"/>
        </svg>
        <span className="p9tr-header-label">Thread</span>
        <button className="p9tr-close" onClick={onClose} aria-label="Close thread">
          <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor">
            <path d="M3.72 3.72a.75.75 0 0 1 1.06 0L8 6.94l3.22-3.22a.75.75 0 1 1 1.06 1.06L9.06 8l3.22 3.22a.75.75 0 1 1-1.06 1.06L8 9.06l-3.22 3.22a.75.75 0 0 1-1.06-1.06L6.94 8 3.72 4.78a.75.75 0 0 1 0-1.06z"/>
          </svg>
        </button>
      </div>

      <div className="p9tr-body">
        {rootMessage && rootSender && (
          <div className="p9tr-root">
            <div className="p9tr-row">
              <div className="p9tr-avatar">
                <Avatar contact={rootSender} size={28} hideStatus />
              </div>
              <div className="p9tr-col">
                <div className="p9tr-meta">
                  <span className="p9tr-sender">{rootMessage.senderId === 'me' ? 'You' : rootSender.name}</span>
                  <span className="p9tr-time">{rootMessage.time}</span>
                </div>
                <div className="p9tr-bubble">
                  {renderText(rootMessage.text)}
                </div>
              </div>
            </div>
          </div>
        )}

        {messages.length > 0 && (
          <div className="p9tr-divider">Replies</div>
        )}

        {messages.map(msg => {
          const isMe = msg.senderId === 'me'
          const sender = isMe ? currentUser : contacts.find(c => c.id === msg.senderId)
          if (!sender) return null

          return (
            <div key={msg.id} className={`p9tr-row${isMe ? ' p9tr-row-mine' : ''}`}>
              {!isMe && (
                <div className="p9tr-avatar">
                  <Avatar contact={sender} size={28} hideStatus />
                </div>
              )}
              <div className="p9tr-col">
                {!isMe && (
                  <div className="p9tr-meta">
                    <span className="p9tr-sender">{sender.name}</span>
                    <span className="p9tr-time">{msg.time}</span>
                  </div>
                )}
                {msg.text && (
                  <div className={`p9tr-bubble${isMe ? ' p9tr-bubble-mine' : ''}`}>
                    {renderText(msg.text)}
                  </div>
                )}
                {msg.cards?.map((card, ci) => (
                  <div key={ci} className="p9tr-card" style={{ borderLeftColor: card.accentColor }}>
                    {card.badge && (
                      <span className={`p9tr-badge p9tr-badge-${card.badge.tone === 'green' ? 'green' : 'neutral'}`}>
                        {card.badge.text}
                      </span>
                    )}
                    <div className="p9tr-card-title">{card.title}</div>
                    {card.steps && (
                      <div className="p9tr-steps">
                        {card.steps.map((s, si) => (
                          <div key={si} className={`p9tr-step p9tr-step-${s.status}`}>
                            <span className="p9tr-step-dot" />
                            <span>{s.text}</span>
                          </div>
                        ))}
                      </div>
                    )}
                    {card.presence && (
                      <PresenceSection viewers={card.presence.viewers} label={card.presence.label} />
                    )}
                    {card.actions && (
                      <div className="p9tr-actions">
                        {card.actions.map((action, ai) => {
                          if (typeof action === 'string') {
                            return <button key={ai} className="p9tr-btn">{action}</button>
                          }
                          return (
                            <button
                              key={ai}
                              className={`p9tr-btn${action.primary ? ' p9tr-btn-primary' : ''}`}
                              onClick={() => onCardAction?.({ type: action.type })}
                            >
                              {action.label}
                            </button>
                          )
                        })}
                      </div>
                    )}
                  </div>
                ))}
                {isMe && msg.time && (
                  <div className="p9tr-time" style={{ marginTop: 2 }}>{msg.time}</div>
                )}
              </div>
            </div>
          )
        })}

        {isTyping && (
          <div className="p9tr-typing">
            <div className="p9tr-typing-dots">
              <div className="p9tr-typing-dot" />
              <div className="p9tr-typing-dot" />
              <div className="p9tr-typing-dot" />
            </div>
            <span className="p9tr-system">Lovable is typing…</span>
          </div>
        )}

        <div ref={endRef} />
      </div>
    </div>
  )
}

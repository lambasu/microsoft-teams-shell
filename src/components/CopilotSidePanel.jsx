import { useState } from 'react'
import { copilotSidePanel, asanaChanges } from '../data'
import { copilotLogo, asanaLogo } from '../shared/assets'
import PrivateSidePanel from './PrivateSidePanel'
import {
  ChainOfThought, IconButton, Send, Plus, ChatMultiple, ArrowRight, PersonSwap, Check,
} from './common'
import './CopilotSidePanel.css'

const CHANGE_ICONS = {
  move: <ArrowRight size={12} stroke="#fff" />,
  create: <Plus size={12} />,
  reassign: <PersonSwap size={12} stroke="#fff" />,
}

// Variant A — Copilot in the private side panel. The user asks Copilot (in
// natural language, grounded on the group chat) to update Asana; Copilot
// invokes the Asana plugin and returns an Adaptive-Card-style summary.
export default function CopilotSidePanel({ onClose, onShareToChat, shared }) {
  const [undone, setUndone] = useState(false)
  const [draft, setDraft] = useState('')
  const d = copilotSidePanel

  return (
    <PrivateSidePanel
      icon={<img src={copilotLogo} alt="" />}
      title="Copilot"
      subtitle="Grounded on Handoff v2.4 launch"
      extraActions={(
        <IconButton label="New chat" className="psp-icon-btn">
          <ChatMultiple size={16} />
        </IconButton>
      )}
      onClose={onClose}
      bodyClassName="cps-body"
      footer={(
        <div className="cps-compose-wrap">
          <div className="cps-compose">
            <input
              className="cps-compose-input"
              placeholder="Message Copilot"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') setDraft('') }}
            />
            <IconButton label="Send" className="cps-send" onClick={() => setDraft('')}>
              <Send size={16} />
            </IconButton>
          </div>
        </div>
      )}
    >
      {/* User prompt with the referenced-chat context chip */}
      <div className="cps-user">
        <div className="cps-user-bubble">
          <span className="cps-context-chip">
            <ChatMultiple size={14} />
            <span className="cps-context-name">{d.contextChip.label}</span>
            <span className="cps-context-meta">· {d.contextChip.meta}</span>
          </span>
          <div>{d.prompt}</div>
        </div>
        <div className="cps-time">9:51 AM</div>
      </div>

      {/* Copilot response */}
      <div className="cps-bot">
        <div className="cps-bot-header">
          <img className="cps-bot-logo" src={copilotLogo} alt="" />
          <span className="cps-bot-name">Copilot</span>
          <span className="cps-time">9:51 AM</span>
        </div>

        <span className="cps-plugin-chip">
          <img src={asanaLogo} alt="" />
          Used <strong>{d.plugin}</strong> plugin
        </span>

        <ChainOfThought steps={d.steps} label={`Completed ${d.steps.length} steps`} defaultExpanded />

        <p className="cps-bot-text">
          {undone ? (
            <>Undone — the 3 changes to <strong>{d.card.project}</strong> were reverted.</>
          ) : (
            <>{d.intro[0]}<strong>{d.intro[1]}</strong>{d.intro[2]}</>
          )}
        </p>

        <div className={`adaptive-card cps-asana-card${undone ? ' cps-asana-card-undone' : ''}`} style={{ borderLeftColor: '#F06A6A' }}>
          <div className="card-header">
            <div className="cps-asana-tile"><img src={asanaLogo} alt="" /></div>
            <div className="card-header-text">
              <div className="card-title-row">
                <span className="card-title">{d.card.project}</span>
                <span className={`card-badge ${undone ? 'card-badge-neutral' : 'card-badge-green'}`}>
                  {undone ? 'Reverted' : 'Updated'}
                </span>
              </div>
              <div className="card-subtitle">{d.card.subtitle}</div>
            </div>
          </div>

          <ul className="cps-changes">
            {asanaChanges.map((c) => (
              <li key={c.task} className="cps-change">
                <span className={`cps-change-icon cps-change-icon-${c.kind}`}>{CHANGE_ICONS[c.kind]}</span>
                <div className="cps-change-text">
                  <div className="cps-change-title">
                    {c.task}
                    {c.status && <span className={`asana-pill asana-pill-${c.status.tone}`}>{c.status.text}</span>}
                  </div>
                  <div className="cps-change-detail">{c.detail}</div>
                </div>
              </li>
            ))}
          </ul>

          <div className="card-footer">{d.card.footer}</div>

          <div className="card-actions cps-card-actions">
            <button className="card-action-btn-primary">Open in Asana</button>
            <button className="card-action-btn" onClick={() => setUndone((v) => !v)}>
              {undone ? 'Redo' : 'Undo'}
            </button>
            {shared ? (
              <span className="cps-shared"><Check size={12} /> Shared to chat</span>
            ) : (
              <button className="card-action-btn" onClick={onShareToChat} disabled={undone}>
                Share to chat
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="cps-suggestions">
        {d.suggestions.map((s) => (
          <button key={s} className="cps-suggestion" onClick={() => setDraft(s)}>{s}</button>
        ))}
      </div>
    </PrivateSidePanel>
  )
}

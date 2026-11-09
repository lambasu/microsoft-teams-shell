import { asanaSidePanel, contacts } from '../data'
import { asanaLogo } from '../shared/assets'
import PrivateSidePanel from './PrivateSidePanel'
import { Avatar, IconButton, Refresh, PopOut, Plus, Check } from './common'
import './AsanaSidePanel.css'

// Variant B — Asana's own app UI hosted directly in the private side panel,
// scoped to the chat's linked project. Dashboard tab is active; the task list
// reflects the same three changes Copilot made in Variant A.
export default function AsanaSidePanel({ onClose, onShareToChat, shared }) {
  const d = asanaSidePanel
  const maxSection = Math.max(...d.sections.map((s) => s.value))

  return (
    <PrivateSidePanel
      icon={<img src={asanaLogo} alt="" />}
      title="Asana"
      subtitle="Linked to Handoff v2.4 launch"
      privacyText="Only you can see this view. Nothing is posted to the chat unless you share it."
      extraActions={(
        <IconButton label="Refresh" className="psp-icon-btn">
          <Refresh size={16} />
        </IconButton>
      )}
      onClose={onClose}
      bodyClassName="asp-body"
      footer={(
        <div className="asp-footer">
          <button className="asp-btn">
            Open in Asana <PopOut size={14} />
          </button>
          {shared ? (
            <span className="asp-shared"><Check size={12} /> Shared to chat</span>
          ) : (
            <button className="asp-btn asp-btn-primary" onClick={onShareToChat}>Share to chat</button>
          )}
        </div>
      )}
    >
      {/* Project header */}
      <div className="asp-project">
        <div className="asp-project-icon" aria-hidden="true">
          <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="#1E1F21" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 5h12M4 10h12M4 15h8"/>
          </svg>
        </div>
        <div className="asp-project-text">
          <div className="asp-project-name">{d.project}</div>
          <div className="asp-project-meta">
            <span className="asp-status-dot" /> {d.projectStatus} · {d.updated}
          </div>
        </div>
        <button className="asp-btn asp-btn-sm">
          <Plus size={12} /> Add task
        </button>
      </div>

      {/* Project tabs */}
      <div className="asp-tabs" role="tablist">
        {d.tabs.map((t) => (
          <button
            key={t}
            role="tab"
            aria-selected={t === d.activeTab}
            className={`asp-tab${t === d.activeTab ? ' asp-tab-active' : ''}`}
          >{t}</button>
        ))}
      </div>

      <div className="asp-dashboard">
        {/* Stat tiles */}
        <div className="asp-tiles">
          {d.stats.map((s) => (
            <div key={s.label} className="asp-tile">
              <div className={`asp-tile-value${s.tone === 'red' ? ' asp-red' : ''}`}>{s.value}</div>
              <div className="asp-tile-label">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Tasks by section — vertical bar chart */}
        <div className="asp-chart">
          <div className="asp-chart-title">Tasks by section</div>
          <div className="asp-bars">
            {d.sections.map((s) => (
              <div key={s.label} className="asp-bar-col">
                <span className="asp-bar-value">{s.value}</span>
                <span
                  className="asp-bar"
                  style={{ height: `${Math.max(8, (s.value / maxSection) * 100)}%`, background: s.color }}
                />
                <span className="asp-bar-label">{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Task list */}
        <div className="asp-section-title">Recently updated</div>
        <ul className="asp-tasks">
          {d.tasks.map((t) => {
            const assignee = contacts.find((c) => c.id === t.assigneeId)
            return (
              <li key={t.name} className={`asp-task${t.done ? ' asp-task-done' : ''}`}>
                <span className={`asp-check${t.done ? ' asp-check-done' : ''}`} aria-hidden="true">
                  <Check size={10} />
                </span>
                <span className="asp-task-name">
                  {t.name}
                  {t.status && <span className={`asana-pill asana-pill-${t.status.tone}`}>{t.status.text}</span>}
                </span>
                {t.changed && <span className="asp-changed" title="Updated from this chat" />}
                <Avatar contact={assignee} size={20} hideStatus />
                <span className={`asp-due${t.dueTone === 'red' ? ' asp-red' : ''}`}>{t.due}</span>
              </li>
            )
          })}
        </ul>
      </div>
    </PrivateSidePanel>
  )
}

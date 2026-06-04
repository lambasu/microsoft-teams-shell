import './PrototypeGallery.css'

const PROTOTYPES = [
  {
    id: 'day-one-agent-onboarding',
    number: '01',
    title: 'Day-one agent onboarding',
    description:
      'Agent joins a group chat and instantly knows the stakeholders, tools, files, and open items — no user grounding required. Welcome message is structured and immediately actionable.',
    chat: 'Northwind launch',
    tag: 'Adaptive Card',
    tagColor: '#0078D4',
  },
  {
    id: 'context-brief-as-pinned-tab',
    number: '02',
    title: 'Context brief as pinned tab',
    description:
      'Same onboarding concept, but the agent writes a context-brief.md and pins it as a tab to the chat header — so the brief is always one click away without polluting the thread.',
    chat: 'Northwind launch · tab view',
    tag: 'Pinned tab',
    tagColor: '#038387',
  },
  {
    id: 'group-intelligence',
    number: '03',
    title: 'Group intelligence',
    description:
      'Agents monitor group conversations and decide when to engage without waiting to be @mentioned. Classifier fires at 82% confidence and sends a private targeted message before responding to the group.',
    chat: 'Northwind sprint sync',
    tag: 'Classifier',
    tagColor: '#5B5FC7',
  },
  {
    id: 'earned-handoff-to-agency',
    number: '04',
    title: 'Earned handoff to Agency',
    description:
      'Facilitator monitors the group, analyzes a request, and surfaces a response attributed to Agency. One click opens an Agency session with the fix plan pre-loaded — no re-briefing required.',
    chat: 'JIRA-4593 hotfix',
    tag: 'Earned handoff',
    tagColor: '#5B5FC7',
  },
  {
    id: 'facilitator-coordinates-agency',
    number: '05',
    title: 'Facilitator coordinates Agency',
    description:
      'Facilitator reads the group conversation, spots that a PR needs opening, and sends a private signal. When confirmed, it @-mentions Agency in the group — Agency finds the ADO item and opens the PR.',
    chat: 'Platform daily sync',
    tag: 'Group coordination',
    tagColor: '#038387',
  },
  {
    id: 'emoji-to-deploy',
    number: '06',
    title: 'Emoji to deploy',
    description:
      'React with 🐛 on a bug report to file a GitHub issue. Choose Workflows (automated webhook) or Agency (context-aware). GitHub Copilot raises the PR, reviewers approve in-chat, it deploys, and usage telemetry streams in.',
    chat: 'Northwind bug triage',
    tag: 'E2E workflow',
    tagColor: '#8250DF',
  },
  {
    id: 'lovable-stage-view',
    number: '07',
    title: 'Lovable in group chat',
    description:
      'Team adds Lovable to a group chat and asks it to build their website. Lovable posts progress cards as it builds, then a completion card with a "View Live Preview" button. Click it to open Teams Stage View — a full-screen immersive preview. Request edits; Lovable updates the card in place.',
    chat: 'Morgan Collective website',
    tag: 'Stage View',
    tagColor: '#FF3B8B',
  },
  {
    id: 'lovable-live-edit',
    number: '08',
    title: 'Lovable — live editing + text selection',
    description:
      'Team approves a build plan, Lovable builds the site and opens it in Stage View. The team gives feedback in chat; Lovable applies updates live — elements animate as changes are written. Any user can highlight text in the preview, pick "Update selected text to…", type the replacement in the rail compose, and Lovable applies it instantly.',
    chat: 'Beacon site',
    tag: 'Stage View · Live Edit',
    tagColor: '#FF3B8B',
  },
]

export default function PrototypeGallery({ onLaunch }) {
  return (
    <div className="proto-gallery">
      <div className="proto-gallery-header">
        <div className="proto-gallery-wordmark">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <rect width="20" height="20" rx="4" fill="#5B5FC7"/>
            <path d="M5 14V6l4 5 4-5v8" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span>Microsoft Teams</span>
        </div>
        <h1 className="proto-gallery-title">Agency in Teams — Prototypes</h1>
        <p className="proto-gallery-subtitle">
          Select a prototype to explore. Each demo is interactive and opens directly to the relevant chat.
        </p>
      </div>

      <div className="proto-gallery-grid">
        {PROTOTYPES.map((p) => (
          <button
            key={p.id}
            className="proto-card"
            onClick={() => onLaunch(p.id)}
          >
            <div className="proto-card-number">{p.number}</div>
            <div className="proto-card-body">
              <div className="proto-card-tag" style={{ background: p.tagColor }}>{p.tag}</div>
              <h2 className="proto-card-title">{p.title}</h2>
              <p className="proto-card-desc">{p.description}</p>
            </div>
            <div className="proto-card-footer">
              <span className="proto-card-chat">
                <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                  <path d="M2 2.5A2.5 2.5 0 0 1 4.5 0h7A2.5 2.5 0 0 1 14 2.5v7A2.5 2.5 0 0 1 11.5 12H8.6l-2.1 2.4A.75.75 0 0 1 5 13.85V12h-.5A2.5 2.5 0 0 1 2 9.5v-7z"/>
                </svg>
                {p.chat}
              </span>
              <span className="proto-card-launch">
                Launch
                <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                  <path d="M3.75 7.25a.75.75 0 0 0 0 1.5h6.69l-2.72 2.72a.75.75 0 1 0 1.06 1.06l4-4a.75.75 0 0 0 0-1.06l-4-4a.75.75 0 0 0-1.06 1.06l2.72 2.72H3.75z"/>
                </svg>
              </span>
            </div>
          </button>
        ))}
      </div>

      <div className="proto-gallery-footer">
        Agency in Teams · Prototype workbench
      </div>
    </div>
  )
}

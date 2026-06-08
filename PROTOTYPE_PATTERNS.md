# Prototype Patterns

Recurring design and UX patterns that have worked well across prototypes in this shell. Reference this alongside PERSONA.md and DESIGN_GUIDE.md before building a new prototype.

---

## 1. Stage-Based Agent Progress Cards

The most effective way to show an agent doing work over time. Post a sequence of Adaptive Cards — each one advancing the state — rather than a single completion card. Gives the viewer something to follow during the walkthrough.

**Three-stage arc:**

```
Stage 1 — Building (agent starts):
  badge: { text: 'Building', tone: 'amber' }
  All steps → status: 'pending' or first → 'running'

Stage 2 — In Progress (midpoint update):
  badge: { text: 'In progress', tone: 'amber' }
  Some steps → 'done', one → 'running', rest → 'pending'

Stage 3 — Done (completion):
  badge: { text: 'Ready' / 'Live' / 'Updated', tone: 'green' }
  All steps → status: 'done'
  Add actions: ['Primary CTA', 'Secondary CTA']
```

**Data shape:**
```js
{
  accentColor: '#FF3B8B',     // agent brand color
  title: 'Thing — v1 ready',
  subtitle: 'Short summary of what was built',
  badge: { text: 'Ready to preview', tone: 'green' },
  steps: [
    { text: 'Step description', status: 'done' },   // done | running | pending
  ],
  footer: 'AgentName · Completed · 1 min ago',
  actions: [
    { label: 'Primary CTA', type: 'open_pinned_tab', primary: true },
    'Secondary CTA',
  ],
}
```

**Tone values:** `'green'` (success), `'amber'` (in-progress / warning), `'red'` (error)

---

## 2. Presence Bar (Live Co-View Surface)

Used in LivePreviewPanel (P8). Shows who's currently viewing a shared surface in real time. Works in any pinned tab or panel — no meeting required (proposed: chat-scoped Azure Fluid Relay).

**Anatomy (left → right):**
1. **Live pill** — pulsing green dot + "Live · N viewing now"
2. **Presence avatars** — overlapping avatar chips (–6px margin-left), current user last with outline ring
3. **Context label** — "Shared scroll · No meeting required"
4. **Proposal badge** — purple, right-aligned, marks speculative platform capabilities

**CSS keypoints:**
- Pulsing dot: `animation: lp-pulse 2s ease-in-out infinite` (scale + opacity)
- Avatar overlap: `margin-left: -6px`, `border: 2px solid #FFFFFF`
- Current user distinction: `outline: 2px solid <accent>; outline-offset: 1px`
- Proposal badge: `background: #F3EEFF; border: 1px solid #D1B3FF; color: #8250DF`

---

## 3. Animated Presence Cursors

Floating cursors overlaid on a preview surface to simulate multiple users viewing the same content simultaneously. Pure CSS — no real-time backend needed for a prototype.

**Structure per cursor:**
```jsx
<div className={`lp-cursor ${driftClass}`} style={{ top: '19%', left: '56%' }}>
  <svg>/* cursor pointer shape */</svg>
  <div className="lp-cursor-name" style={{ background: personColor }}>{name}</div>
</div>
```

**Drift animations — three staggered keyframes (7s / 9s / 8s):**
```css
@keyframes drift-a {
  0%, 100% { transform: translate(0px, 0px); }
  30%       { transform: translate(14px, 20px); }
  60%       { transform: translate(-8px, 12px); }
}
```

**Rules:**
- Container: `position: relative; overflow-y: auto` — cursors are `position: absolute`
- Always `pointer-events: none` on cursors so clicks land on content below
- Space cursors across distinct page sections (hero / services / team) so they read as different reviewers looking at different things
- Use the person's team color for both the cursor SVG fill and the name label background

---

## 4. Pinned Tab Panel Types

The shell supports two pinned tab content types. Extend by adding a new flag and a new panel component.

| Flag on contact | Panel component | Use case |
|---|---|---|
| `contextBriefId: <id>` | `ContextBriefPanel` | Agent-generated document (context brief, summary, plan) |
| `livePreviewPanel: true` | `LivePreviewPanel` | Live shared preview with presence (co-view prototype) |

**How to add a new panel type:**

1. Add a flag to the contact in `contacts.js` (e.g., `reviewDashboard: true`)
2. Create `NewPanel.jsx` + `NewPanel.css` in `src/components/`
3. In `ChatView.jsx`, derive `hasNewPanel = !!activeContact.reviewDashboard`
4. Update `pinnedTab` derivation (add a new ternary branch)
5. Add a render branch: `activeTab === 'pinned' && hasNewPanel ? <NewPanel /> : ...`

**Tab label** is set via `pinnedTab.label` — keep it short (≤ 15 chars), it appears in the header tab row.

---

## 5. Card Action Types (handleCardAction in ChatView)

Registered action types for Adaptive Card buttons. Add new types in `handleCardAction`.

| `type` value | Effect |
|---|---|
| `'open_stage_view'` | Opens the Stage View modal; pass `version: 'v1'` or `'v2'` |
| `'open_pinned_tab'` | Switches `activeTab` to `'pinned'` — reveals the pinned tab panel |
| `'open_in_agency'` | Creates a seeded Agency session and navigates to it |

**Card action data shape:**
```js
actions: [
  { label: 'View Live Preview', type: 'open_stage_view', version: 'v1', primary: true },
  { label: 'Co-Review', type: 'open_pinned_tab', primary: true },
  'Dismiss',   // string = non-interactive label button
]
```

---

## 6. System Messages as Milestones

Use system messages to mark key events in a scripted flow. They render as centered dividers with optional icons — lightweight but highly readable during a walkthrough.

```js
// Plain text
{ id: N, isSystem: true, text: 'Claude was added to the conversation', time: '...' }

// With pin icon (for tab/file events)
{ id: N, isSystem: true, text: 'Lovable pinned Live Preview — co-view enabled', systemIcon: 'pin', time: '...' }
```

**When to use:**
- Agent added to group chat
- Agent pins a tab or creates a file
- Workflow triggered
- Review requested / approved

---

## 7. Proposal Badge Pattern

Visually distinguish speculative platform capabilities from things that exist today. Use consistently so reviewers immediately know what's real vs. proposed.

```css
/* Purple pill — used in presence bar, footnotes, and cards */
background: #F3EEFF;
border: 1px solid #D1B3FF;
color: #8250DF;
border-radius: 4px;
font-size: 10px;
font-weight: 600;
padding: 2px 7px;
```

**Footer note pattern** (bottom of a panel):
```css
background: #F3EEFF;
border-top: 1px solid #D1B3FF;
color: #6B3EAF;
font-size: 11px;
text-align: center;
padding: 7px 16px;
```

Text: `"Powered by [mechanism] · [What it enables] · This is a feature proposal"`

---

## 8. Scenario Setup Checklist

Before writing a line of component code, set up the narrative data:

- [ ] New contact in `contacts.js` with a meaningful name and the right flags
- [ ] Added to `projectNorthwind` or `chatList` with `bold: true`
- [ ] Opening messages establish the **problem** (2–3 messages from team members)
- [ ] Alex adds the agent with a clear, specific prompt (use `{ type: 'mention', name: '@Agent' }` inline)
- [ ] Agent posts a **Stage 1 building card** immediately
- [ ] Optionally: **Stage 2 in-progress card** for multi-step work
- [ ] Agent posts a **Stage 3 completion card** with a primary CTA
- [ ] System message marks the milestone (pin, trigger, etc.)
- [ ] 2–3 positive team reactions to close the thread ("this is the move", "exactly what was missing")
- [ ] FRE modal updated (optional — `App.jsx` `<FreModal>`) to explain the prototype concept

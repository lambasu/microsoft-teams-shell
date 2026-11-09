// Mock data for the private side panel prototypes (contact 60, "Handoff v2.4
// launch"). Both variants reflect the same three Asana changes so they can be
// compared side by side:
//   A — Copilot in the side panel invokes the Asana plugin
//   B — Asana's own app UI opened directly in the side panel

export const SIDE_PANEL_CHAT_ID = 60

const ASANA_PROJECT = 'Agents Platform v2'

// Shared: the three changes derived from the group chat's action items.
// `kind` drives the icon treatment: move | create | reassign.
export const asanaChanges = [
  {
    kind: 'move',
    task: 'Handoff analytics dashboard',
    status: { text: 'In Review', tone: 'review' },
    detail: 'Moved from In Progress · James Kim',
  },
  {
    kind: 'create',
    task: 'Finalize handoff settings design specs',
    detail: 'New task · Sarah Chen · Due Fri, Nov 13',
  },
  {
    kind: 'reassign',
    task: 'Webhook retry + backoff',
    detail: 'Assignee Olivia Martinez → Kevin Park',
  },
]

export const copilotSidePanel = {
  prompt: 'Update our Asana dashboard with the action items from this chat',
  contextChip: { label: 'Handoff v2.4 launch', meta: '5 messages' },
  plugin: 'Asana',
  steps: [
    'Read recent messages in Handoff v2.4 launch',
    `Matched 3 action items to project “${ASANA_PROJECT}”`,
    'Applied updates in Asana',
  ],
  intro: ['Done — I made 3 updates to ', ASANA_PROJECT, ' in Asana:'],
  card: {
    project: ASANA_PROJECT,
    subtitle: 'Asana · 3 changes',
    footer: 'Asana plugin · Just now',
  },
  suggestions: [
    `Show the ${ASANA_PROJECT} dashboard`,
    "What's overdue this week?",
    'Draft a recap for the chat',
  ],
}

// Asana app — Dashboard tab scoped to the chat's linked project.
export const asanaSidePanel = {
  project: ASANA_PROJECT,
  projectStatus: 'On track',
  updated: 'Updated just now',
  tabs: ['List', 'Board', 'Dashboard', 'Timeline'],
  activeTab: 'Dashboard',
  stats: [
    { label: 'Completed', value: 12 },
    { label: 'Incomplete', value: 8 },
    { label: 'Overdue', value: 2, tone: 'red' },
  ],
  sections: [
    { label: 'To do', value: 3, color: '#9CA6AF' },
    { label: 'In progress', value: 4, color: '#4573D2' },
    { label: 'In review', value: 1, color: '#F1BD6C' },
    { label: 'Done', value: 12, color: '#5DA283' },
  ],
  tasks: [
    { name: 'Handoff analytics dashboard', status: { text: 'In Review', tone: 'review' }, assigneeId: 7, due: 'Today', changed: true },
    { name: 'Finalize handoff settings design specs', status: { text: 'New', tone: 'new' }, assigneeId: 1, due: 'Fri', changed: true },
    { name: 'Webhook retry + backoff', assigneeId: 15, due: 'Yesterday', dueTone: 'red', changed: true },
    { name: 'Token refresh migration guide', assigneeId: 10, due: 'Nov 16' },
    { name: 'Staging smoke tests — v2.4', assigneeId: 3, due: 'Nov 6', done: true },
  ],
}

// Message Alex posts to the group chat when they explicitly hit "Share to chat".
export const sidePanelShareMessage = {
  senderId: 'me',
  text: 'updated asana from our action items 👇',
  cards: [
    {
      accentColor: '#F06A6A',
      title: `${ASANA_PROJECT} — 3 updates`,
      subtitle: 'Shared from Asana',
      sections: [
        {
          bullets: [
            'Handoff analytics dashboard → In Review (James)',
            'New: Finalize handoff settings design specs — Sarah, due Fri Nov 13',
            'Webhook retry + backoff reassigned Olivia → Kevin',
          ],
        },
      ],
      actions: ['Open in Asana'],
    },
  ],
}

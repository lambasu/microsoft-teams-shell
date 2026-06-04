import { useState, useEffect, useRef } from 'react'
import {
  messagesByContact,
  contacts,
  favorites,
  projectNorthwind,
  chatList,
  channelPostsByContact,
  sessionMessages,
  promptSuggestions,
  copilotAgent,
  designerAgent,
  pollyAgent,
  breakthuAgent,
  contextBriefs,
} from '../data'
import { TypingIndicator, DemoArrow } from './common'
import ContextBriefPanel from './ContextBriefPanel'
import MessageRow from './MessageRow'
import SessionsRail from './SessionsRail'
import AgentsRail from './AgentsRail'
import PromptSuggestions from './PromptSuggestions'
import ChannelThreadRail from './ChannelThreadRail'
import ChatHeader from './ChatHeader'
import Compose from './Compose'
import StageView from './StageView'
import './ChatView.css'

// Convert a channel post (root + replies) into the message shape MessageRow
// expects, attaching a threadReply badge built from the replies' unique
// senders. Replies themselves are not shown in the main canvas — clicking the
// badge opens ChannelThreadRail.
function postToMessage(post) {
  const replyCount = post.replies?.length || 0
  if (!replyCount) return { ...post }
  const seen = new Set()
  const participantIds = []
  for (const r of post.replies) {
    if (seen.has(r.senderId)) continue
    seen.add(r.senderId)
    participantIds.push(r.senderId)
    if (participantIds.length === 3) break
  }
  return { ...post, threadReply: { participantIds, count: replyCount } }
}

function parseDraft(d) {
  const m = d.match(/^\/Jira\b\s*/i)
  return m ? { mention: 'Jira', text: d.slice(m[0].length) } : { mention: null, text: d }
}

// ── Scripted Jira demo flow (disabled) ─────────────────────────────────────
// Kept as a reference pattern for scripted agent flows. Flip JIRA_FLOW_ENABLED
// and restore the `draft: '/Jira …'` entry in chatList to re-enable. See
// CLAUDE.md for policy on this flow.
const JIRA_FLOW_ENABLED = false

const jiraScript = [
  {
    text: 'You have 1 blocker for the April 25 milestone — the PR is in review with all signoffs and CI passing. Want me to merge it?',
    link: {
      source: 'jira',
      title: 'Handle delegation timeout during agent handoff',
      subtitle: 'JIRA-4552 · In review · Due April 22',
      url: '#',
    },
    seed: 'Yes',
  },
  {
    text: 'Merged — here\'s the PR:',
    link: {
      source: 'github',
      title: 'Handle delegation timeout during agent handoff',
      subtitle: 'teams/agent-handoff #4552 · Merged',
      url: '#',
    },
    seed: null,
  },
]

export default function ChatView({
  activeChatId,
  onSelectChat,
  sessions,
  addSession,
  updateSession,
  updateSessionMessages,
  dynamicSessionMessages,
  navIntent,
  clearNavIntent,
}) {
  const activeContact = contacts.find((c) => c.id === activeChatId)
  const baseMessages = messagesByContact[activeChatId] || []
  const participantCount = activeContact.isGroup || activeContact.isChannel
    ? activeContact.memberCount ?? new Set(baseMessages.map((m) => m.senderId)).size
    : 2
  const allChats = [...favorites, ...projectNorthwind, ...chatList]
  const chatEntry = allChats.find((c) => c.contactId === activeChatId)
  const draft = chatEntry?.draft || ''
  const parsedDraft = parseDraft(draft)

  const isAgent = activeContact.isAgent && !activeContact.isGroup
  const isChannel = !!activeContact.isChannel
  const isGroup = !!activeContact.isGroup
  const channelPosts = isChannel ? channelPostsByContact[activeChatId] || [] : null
  const hasSessions = isAgent && sessions[activeChatId]

  const [extraMessages, setExtraMessages] = useState({})
  const [inputValue, setInputValue] = useState(parsedDraft.text)
  const [composeMention, setComposeMention] = useState(parsedDraft.mention)
  const [showSessions, setShowSessions] = useState(hasSessions)
  const [showAgents, setShowAgents] = useState(false)
  const [selectedRailAgent, setSelectedRailAgent] = useState(null)
  const [agentChatMessages, setAgentChatMessages] = useState({})
  const [railComposeHint, setRailComposeHint] = useState(null)
  const [railTypingAgentId, setRailTypingAgentId] = useState(null)
  const [railJiraStep, setRailJiraStep] = useState(0)
  const [jiraGroupSessionId, setJiraGroupSessionId] = useState(null)
  const [activeSessionId, setActiveSessionId] = useState(null)
  const [jiraThreadAnchorId, setJiraThreadAnchorId] = useState(null)
  // mainTyping tracks which chat is showing a typing indicator and which
  // contact avatar to display. Shape: { chatId, contactId } | null
  const [mainTyping, setMainTyping] = useState(null)
  const [channelThreadPostId, setChannelThreadPostId] = useState(null)
  const [threadRailOpen, setThreadRailOpen] = useState(false)
  const [highlightMessageId, setHighlightMessageId] = useState(null)
  const [activeTab, setActiveTab] = useState('chat')
  // Track whether targeted messages have been acted on (hide them once actioned).
  // P3 (chat 35): group intelligence / Jira confirm.
  // P5 (chat 39): Facilitator → Agency PR coordination.
  const [groupIntelAction, setGroupIntelAction] = useState(null) // null | 'confirmed' | 'skipped'
  const [p5Action, setP5Action] = useState(null) // null | 'confirmed' | 'skipped'
  const [p6State, setP6State] = useState(null) // null | 'prompted' | 'workflows' | 'agency'
  // P7 — Lovable Stage View. p7Step drives the guided walkthrough:
  //   1 → point user to "View Live Preview" on v1 card in main chat
  //   2 → Stage View open; point user to "View Live Preview" on v2 card in rail
  //   null → walkthrough complete
  const [showStageView, setShowStageView] = useState(false)
  const [stageViewVersion, setStageViewVersion] = useState('v1')
  const [p7Step, setP7Step] = useState(activeChatId === 44 ? 1 : null)
  const messagesEndRef = useRef(null)

  // Reset per-chat ephemeral state when activeChatId changes. Using the
  // render-phase state-adjustment pattern (rather than useEffect) avoids the
  // cascade-render warning and lands the new state in the first paint.
  // https://react.dev/learn/you-might-not-need-an-effect#adjusting-some-state-when-a-prop-changes
  const [chatIdCursor, setChatIdCursor] = useState(activeChatId)
  const [navIntentCursor, setNavIntentCursor] = useState(navIntent)
  if (chatIdCursor !== activeChatId) {
    setChatIdCursor(activeChatId)
    setInputValue(parsedDraft.text)
    setComposeMention(parsedDraft.mention)
    setShowAgents(false)
    setSelectedRailAgent(null)
    setRailJiraStep(0)
    setRailComposeHint(null)
    setRailTypingAgentId(null)
    setJiraThreadAnchorId(null)
    setChannelThreadPostId(null)
    setThreadRailOpen(false)
    setHighlightMessageId(null)
    setActiveTab('chat')
    setGroupIntelAction(null)
    setP5Action(null)
    setP6State(null)
    setShowStageView(false)
    setStageViewVersion('v1')
    setP7Step(activeChatId === 44 ? 1 : null)
    setMainTyping(null)
    const intentMatches = navIntent && navIntent.chatId === activeChatId
    const intentHasSession = intentMatches && 'sessionId' in navIntent
    if (intentHasSession) {
      setShowSessions(true)
      setActiveSessionId(navIntent.sessionId || null)
    } else {
      setShowSessions(!!hasSessions)
      const agentSessionList = sessions[activeChatId]
      setActiveSessionId(agentSessionList?.length > 0 ? agentSessionList[0].id : null)
    }
    if (intentMatches && navIntent.channelThreadPostId) {
      setChannelThreadPostId(navIntent.channelThreadPostId)
      setThreadRailOpen(true)
    }
    if (intentMatches && navIntent.highlightMessageId) {
      setHighlightMessageId(navIntent.highlightMessageId)
    }
    if (intentMatches) clearNavIntent()
  } else if (navIntent !== navIntentCursor && navIntent?.chatId === activeChatId) {
    setNavIntentCursor(navIntent)
    if ('sessionId' in navIntent) {
      setShowSessions(true)
      if (navIntent.sessionId) setActiveSessionId(navIntent.sessionId)
    }
    if (navIntent.channelThreadPostId) {
      setChannelThreadPostId(navIntent.channelThreadPostId)
      setThreadRailOpen(true)
    }
    if (navIntent.highlightMessageId) {
      setHighlightMessageId(navIntent.highlightMessageId)
    }
    clearNavIntent()
  }

  // P7 step 1: scroll to message 9 (v1 completion card) so the target is visible.
  useEffect(() => {
    if (activeChatId !== 44 || p7Step !== 1) return
    const t = setTimeout(() => {
      document.querySelector('[data-message-id="9"]')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }, 350)
    return () => clearTimeout(t)
  }, [activeChatId, p7Step])

  useEffect(() => {
    if (highlightMessageId) {
      // Activity-navigation: scroll the triggering message into view and
      // flash it briefly so the user sees where the notification landed.
      const el = document.querySelector(
        `[data-message-id="${CSS.escape(String(highlightMessageId))}"]`
      )
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' })
        el.classList.add('message-row-highlight')
        const t = setTimeout(() => {
          el.classList.remove('message-row-highlight')
          setHighlightMessageId(null)
        }, 1800)
        return () => clearTimeout(t)
      }
      return
    }
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [extraMessages, activeChatId, activeSessionId, mainTyping, highlightMessageId])

  // Mirror the rail's Jira thread messages back into the source chat's
  // session so the conversation is discoverable from Jira's sessions list.
  useEffect(() => {
    if (!jiraGroupSessionId) return
    const msgs = agentChatMessages[4] || []
    const converted = msgs
      .filter((m) => !String(m.id).startsWith('intro-'))
      .map((m) => ({
        id: m.id,
        senderId: m.from === 'me' ? 'me' : 4,
        text: m.text,
        time: m.time,
        link: m.link,
      }))
    updateSessionMessages(jiraGroupSessionId, converted)
  }, [agentChatMessages, jiraGroupSessionId, updateSessionMessages])

  const sessionMsgs = activeSessionId && (dynamicSessionMessages[activeSessionId] || sessionMessages[activeSessionId])
  const displayBaseMessages = sessionMsgs || baseMessages
  // Per-session bucket for in-canvas messages so switching to a new pending
  // session starts with a blank canvas instead of inheriting the previous
  // session's messages. Non-session chats fall back to the chat id.
  const canvasKey = activeSessionId || activeChatId
  const messages = [...displayBaseMessages, ...(extraMessages[canvasKey] || [])]
  // Messages with `replies` arrays power the threads list/detail view in
  // group chats. Channels use channelPosts for the same purpose.
  const groupThreadablePosts = isGroup ? messages.filter((m) => m.replies?.length > 0) : []

  const activeSession = hasSessions && sessions[activeChatId]?.find((s) => s.id === activeSessionId)
  const sourceChat = activeSession?.sourceChatId ? contacts.find((c) => c.id === activeSession.sourceChatId) : null

  const { agentsInConversation, recommendedAgents } = (() => {
    if (activeChatId === 11) {
      const jira = contacts.find((c) => c.id === 4)
      return {
        agentsInConversation: [copilotAgent, jira, designerAgent],
        recommendedAgents: [pollyAgent, breakthuAgent],
      }
    }
    const agentsById = new Map(contacts.filter((c) => c.isAgent).map((a) => [a.id, a]))
    const agentsByName = new Map(contacts.filter((c) => c.isAgent).map((a) => [a.name.toLowerCase(), a]))
    const found = new Map()
    if (activeContact.isAgent) found.set(activeContact.id, activeContact)
    for (const m of baseMessages) {
      if (agentsById.has(m.senderId)) found.set(m.senderId, agentsById.get(m.senderId))
      if (Array.isArray(m.text)) {
        for (const part of m.text) {
          if (part && typeof part === 'object' && part.type === 'mention') {
            const agent = agentsByName.get(part.name.toLowerCase())
            if (agent) found.set(agent.id, agent)
          }
        }
      }
    }
    return { agentsInConversation: Array.from(found.values()), recommendedAgents: [] }
  })()

  const handleNewSession = () => {
    // Only one pending "New conversation" per agent — if one already exists,
    // just switch to it instead of creating another. It becomes a real session
    // once the user sends their first message (see finalizePendingSession).
    const existingPending = (sessions[activeChatId] || []).find((s) => s.isPending)
    if (existingPending) {
      setActiveSessionId(existingPending.id)
      return
    }
    const now = new Date()
    const sessionId = `s-new-${Date.now()}`
    const newSession = {
      id: sessionId,
      name: 'New conversation',
      time: now.toLocaleString([], { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }),
      preview: '',
      isPending: true,
    }
    addSession(activeChatId, newSession, [])
    setActiveSessionId(sessionId)
  }

  const finalizePendingSession = (firstText, nameHint) => {
    if (!isAgent || !activeSessionId) return
    const current = (sessions[activeChatId] || []).find((s) => s.id === activeSessionId)
    if (!current?.isPending) return
    const trimmed = String(firstText || '').trim()
    const name = (nameHint && nameHint.trim()) || trimmed.slice(0, 60) || 'New conversation'
    const preview = trimmed.slice(0, 100)
    const now = new Date()
    updateSession(activeChatId, activeSessionId, {
      name,
      preview,
      time: now.toLocaleString([], { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }),
      isPending: false,
    })
  }

  const nowTimeStr = () => new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })

  const selectRailAgent = (agent) => {
    setSelectedRailAgent(agent)
    if (agent && !agentChatMessages[agent.id]) {
      const intro = {
        id: `intro-${agent.id}`,
        from: 'agent',
        text: `Hi! I'm ${agent.name}. Ask me anything in the context of ${activeContact.name}.`,
        time: nowTimeStr(),
      }
      setAgentChatMessages((prev) => ({ ...prev, [agent.id]: [intro] }))
    }
  }

  const bumpThreadReply = (anchorId, participantId) => {
    if (!anchorId) return
    setExtraMessages((prev) => {
      const list = prev[activeChatId] || []
      if (!list.some((m) => m.id === anchorId)) return prev
      return {
        ...prev,
        [activeChatId]: list.map((m) => {
          if (m.id !== anchorId) return m
          const existingIds = m.threadReply?.participantIds || []
          const participantIds = existingIds.includes(participantId)
            ? existingIds
            : [...existingIds, participantId]
          return {
            ...m,
            threadReply: {
              participantIds,
              count: (m.threadReply?.count || 0) + 1,
            },
          }
        }),
      }
    })
  }

  const scheduleJiraResponse = (index, anchorIdOverride) => {
    if (index < 0 || index >= jiraScript.length) return
    // Callers that just queued a setJiraThreadAnchorId in the same tick pass
    // the id explicitly; otherwise fall back to the latest committed state.
    const anchorId = anchorIdOverride ?? jiraThreadAnchorId
    setRailTypingAgentId(4)
    setTimeout(() => {
      const step = jiraScript[index]
      const jiraMsg = {
        id: `l2j-${Date.now()}`,
        from: 'agent',
        text: step.text,
        link: step.link,
        time: nowTimeStr(),
      }
      setAgentChatMessages((prev) => ({ ...prev, [4]: [...(prev[4] || []), jiraMsg] }))
      setRailTypingAgentId(null)
      setRailComposeHint(step.seed ? { agentId: 4, text: step.seed } : null)
      setRailJiraStep(index + 1)
      bumpThreadReply(anchorId, 4)

      if (index === jiraScript.length - 1) {
        setInputValue('Had 1 blocker, but just merged the fix — all set now!')
        setComposeMention(null)
      }
    }, 3200)
  }

  const sendInRail = (text) => {
    if (!selectedRailAgent) return
    const agentId = selectedRailAgent.id
    setAgentChatMessages((prev) => ({
      ...prev,
      [agentId]: [...(prev[agentId] || []), { id: `l2-${Date.now()}`, from: 'me', text, time: nowTimeStr() }],
    }))
    setRailComposeHint(null)
    // User replies on the Jira thread count too (and pull the current user's
    // avatar into the reply indicator).
    if (agentId === 4) bumpThreadReply(jiraThreadAnchorId, 'me')
    if (agentId === 4 && railJiraStep > 0 && railJiraStep < jiraScript.length) {
      scheduleJiraResponse(railJiraStep)
    }
  }

  const openJiraThread = () => {
    // The reply indicator acts as a toggle: if the rail is already showing
    // the Jira thread, collapse it; otherwise open it on Jira.
    if (showAgents && selectedRailAgent?.id === 4) {
      setShowAgents(false)
      return
    }
    const jira = contacts.find((c) => c.id === 4)
    if (!jira) return
    setSelectedRailAgent(jira)
    setShowAgents(true)
  }

  const startJiraDemoFlow = (sentText) => {
    const parts = []
    let remaining = sentText
    const regex = /\/Jira/i
    let match
    while ((match = regex.exec(remaining)) !== null) {
      if (match.index > 0) parts.push(remaining.slice(0, match.index))
      parts.push({ type: 'mention', name: 'Jira' })
      remaining = remaining.slice(match.index + match[0].length)
    }
    if (remaining) parts.push(remaining)
    const messageText = parts.length > 1 || typeof parts[0] !== 'string' ? parts : sentText

    const userTime = nowTimeStr()
    const userMsgId = `thread-u-${Date.now()}`

    // The user's message is the anchor of a new thread in the main canvas.
    // It's flagged private so the bubble shows the "Only you can see this
    // conversation" disclaimer and the subtle gray border — both indicate
    // the thread is visible only to the user and the agent.
    setExtraMessages((prev) => ({
      ...prev,
      [activeChatId]: [
        ...(prev[activeChatId] || []),
        { id: userMsgId, senderId: 'me', text: messageText, time: userTime, isPrivate: true },
      ],
    }))
    setJiraThreadAnchorId(userMsgId)

    // Seed the rail thread so it shows the anchor at the top when it opens.
    setAgentChatMessages((prev) => ({
      ...prev,
      4: [{ id: userMsgId, from: 'me', text: messageText, time: userTime }],
    }))

    // Create the session so the thread is discoverable later from Jira's
    // sessions list.
    const jira = contacts.find((c) => c.id === 4)
    const now = new Date()
    const sessionId = `s4-group-${Date.now()}`
    const previewText = Array.isArray(messageText)
      ? messageText.map((p) => (typeof p === 'string' ? p : `/${p.name}`)).join('')
      : messageText
    const sessionName = previewText.replace(/^\/?jira\s*/i, '').trim().slice(0, 60) || 'Blocker discussion'
    addSession(4, {
      id: sessionId,
      name: sessionName,
      time: now.toLocaleString([], { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }),
      preview: previewText,
      sourceChatId: activeChatId,
    })
    setJiraGroupSessionId(sessionId)

    // Open the rail with Jira selected and start the reply.
    setSelectedRailAgent(jira)
    setShowAgents(true)
    scheduleJiraResponse(0, userMsgId)
  }

  const handleSend = () => {
    if (!composeMention && !inputValue.trim()) return

    const chatId = activeChatId
    const bucket = canvasKey
    const sentText = composeMention
      ? `/${composeMention}${inputValue ? ' ' + inputValue.trimStart() : ''}`
      : inputValue
    setInputValue('')
    setComposeMention(null)

    const isJiraInvocation = JIRA_FLOW_ENABLED && chatId === 11 && sentText.toLowerCase().includes('jira')
    if (isJiraInvocation) {
      startJiraDemoFlow(sentText)
      return
    }

    const myMessage = {
      id: `extra-${Date.now()}`,
      senderId: 'me',
      text: sentText,
      time: nowTimeStr(),
    }
    setExtraMessages((prev) => ({
      ...prev,
      [bucket]: [...(prev[bucket] || []), myMessage],
    }))
    finalizePendingSession(sentText)

    // Sarah Chen (id 1) scripted auto-response — exercises the typing
    // indicator flow end-to-end from a regular 1:1 chat.
    if (chatId === 1) {
      setMainTyping({ chatId, contactId: chatId })
      setTimeout(() => {
        setMainTyping((prev) => (prev?.chatId === chatId ? null : prev))
        setExtraMessages((prev) => ({
          ...prev,
          [bucket]: [...(prev[bucket] || []), {
            id: `sarah-reply-${Date.now()}`,
            senderId: 1,
            text: 'got it — taking a look now, will ping you in a bit',
            time: nowTimeStr(),
          }],
        }))
      }, 2000)
    }
  }

  const sendPromptSuggestion = (suggestion) => {
    const chatId = activeChatId
    const bucket = canvasKey
    const myMessage = {
      id: `extra-${Date.now()}`,
      senderId: 'me',
      text: suggestion.text,
      time: nowTimeStr(),
    }
    setExtraMessages((prev) => ({
      ...prev,
      [bucket]: [...(prev[bucket] || []), myMessage],
    }))
    finalizePendingSession(suggestion.text, suggestion.title)

    // Typing indicator then the prepared response.
    setMainTyping({ chatId, contactId: chatId })
    const delay = 2000 + Math.floor(Math.random() * 1000)
    setTimeout(() => {
      setMainTyping((prev) => (prev?.chatId === chatId ? null : prev))
      const agentMessage = {
        id: `extra-${Date.now()}-r`,
        senderId: chatId,
        text: suggestion.response,
        time: nowTimeStr(),
      }
      setExtraMessages((prev) => ({
        ...prev,
        [bucket]: [...(prev[bucket] || []), agentMessage],
      }))
    }, delay)
  }

  const agentSuggestions = isAgent ? promptSuggestions[activeChatId] : null
  const showPromptSuggestions = !!agentSuggestions && messages.length === 0 && mainTyping?.chatId !== activeChatId

  const contextBrief = activeContact.contextBriefId ? contextBriefs[activeContact.contextBriefId] : null
  const pinnedTab = contextBrief ? { label: contextBrief.filename } : null

  // Group intelligence: monitoring agents for this chat (ids → contact objects).
  const monitoringAgentIds = activeContact.monitoringAgents || []
  const monitoringAgents = monitoringAgentIds.map(id => contacts.find(c => c.id === id)).filter(Boolean)

  // P6: fires when user reacts to a message in chat 40 with 🐛.
  const handleP6React = (messageId, emoji) => {
    if (emoji !== '🐛' || p6State !== null) return
    setP6State('prompted')
    setExtraMessages(prev => ({
      ...prev,
      [40]: [
        ...(prev[40] || []),
        {
          id: `p6-prompt-${Date.now()}`,
          senderId: 42,
          isPrivate: true,
          text: 'You flagged Kevin\'s message as a bug. File it as a GitHub issue?',
          targetedActions: [
            { label: 'File via Workflows', action: 'p6_workflows' },
            { label: 'File via Agency', action: 'p6_agency' },
          ],
          time: nowTimeStr(),
        },
      ],
    }))
  }

  const handleTargetedAction = (action) => {
    const chatId = activeChatId

    if (action.action === 'skip') {
      if (chatId === 35) setGroupIntelAction('skipped')
      else setP5Action('skipped')
      return
    }

    // 'confirm' — P3: Jira responds to the Northwind sprint sync group.
    if (action.action === 'confirm') {
      setGroupIntelAction('confirmed')
      setMainTyping({ chatId, contactId: 4 })
      setTimeout(() => {
        setMainTyping(prev => prev?.chatId === chatId ? null : prev)
        setExtraMessages(prev => ({
          ...prev,
          [chatId]: [
            ...(prev[chatId] || []),
            {
              id: `gi-response-${Date.now()}`,
              senderId: 4,
              text: 'Yes — JIRA-4593 is tracked. Created earlier today, assigned to Kevin Park, P1, due Friday. Kevin has a fix in draft.',
              link: {
                source: 'jira',
                title: 'JIRA-4593 — Guest tenant blank page on expired token re-auth',
                subtitle: 'In Progress · Kevin Park · P1 · Due Apr 25',
                url: '#',
              },
              time: nowTimeStr(),
            },
          ],
        }))
      }, 1800)
      return
    }

    // 'ask_agency' — P5: Facilitator routes to Agency, then posts the fix card.
    if (action.action === 'ask_agency') {
      setP5Action('confirmed')
      const nowStr = nowTimeStr()
      // Facilitator posts a coordination message to the group.
      setExtraMessages(prev => ({
        ...prev,
        [chatId]: [
          ...(prev[chatId] || []),
          {
            id: `fac-coord-${Date.now()}`,
            senderId: 37,
            text: 'Passing JIRA-4593 to Agency with the thread context and ADO item details.',
            time: nowStr,
          },
        ],
      }))
      // After a short delay, Facilitator posts Agency's fix card.
      setTimeout(() => {
        setExtraMessages(prev => ({
          ...prev,
          [chatId]: [
            ...(prev[chatId] || []),
            {
              id: `fac-fix-${Date.now()}`,
              senderId: 37,
              text: 'Agency has a fix ready.',
              cards: [
                {
                  accentColor: '#238636',
                  title: 'JIRA-4593 — Guest tenant blank page on expired token re-auth',
                  subtitle: 'auth/guest.ts · 2 files changed · +12 −0',
                  badge: { text: 'PR Ready', tone: 'green' },
                  sections: [
                    {
                      heading: 'Root cause',
                      text: '`validateGuestToken()` doesn\'t check claim format before the expiry assertion. Mismatched guest claims are swallowed — page renders blank instead of prompting re-auth.',
                    },
                    {
                      heading: 'auth/guest.ts',
                      diff: [
                        { type: ' ', text: '  // Validate token claims before expiry check' },
                        { type: '+', text: '  const fmt = detectClaimFormat(guestClaims)' },
                        { type: '+', text: '  if (fmt !== hostClaimFormat) {' },
                        { type: '+', text: '    return promptReAuth({ reason: \'GuestClaimMismatch\' })' },
                        { type: '+', text: '  }' },
                        { type: ' ', text: '  if (isExpired(guestToken)) {' },
                        { type: ' ', text: '    return promptReAuth({ reason: \'TokenExpired\' })' },
                        { type: ' ', text: '  }' },
                      ],
                    },
                    {
                      heading: 'tests/guest-auth.test.ts',
                      diff: [
                        { type: '+', text: '  it(\'expired + mismatched claims → re-auth fires\', () => {' },
                        { type: '+', text: '    const result = validateGuestToken(expiredToken, mismatchedClaims)' },
                        { type: '+', text: '    expect(result.action).toBe(\'reauth\')' },
                        { type: '+', text: '  })' },
                      ],
                    },
                  ],
                  footer: 'Fix by Agency · JIRA-4593 · ' + nowTimeStr(),
                  actions: [{ label: 'View PR on GitHub', primary: true }, 'Dismiss'],
                },
              ],
              time: nowTimeStr(),
            },
          ],
        }))
      }, 2400)
      return
    }

    // P6 shared helpers
    const p6IssueCardWorkflows = () => ({
      accentColor: '#24292E',
      title: '#4597 — Guest tenant blank page on expired token re-auth',
      badge: { text: 'Open', tone: 'green' },
      subtitle: 'northwind/agent-handoff · bug · p1',
      facts: [
        { label: 'Assigned', value: 'GitHub Copilot' },
        { label: 'Labels', value: 'bug · auth · p1-critical' },
        { label: 'Milestone', value: 'v2.1 hotfix' },
      ],
      footer: 'GitHub Issues · northwind/agent-handoff',
    })

    const p6IssueCardAgency = () => ({
      ...p6IssueCardWorkflows(),
      facts: [
        { label: 'Assigned', value: 'GitHub Copilot' },
        { label: 'Labels', value: 'bug · auth · p1-critical' },
        { label: 'Milestone', value: 'v2.1 hotfix' },
        { label: 'Context passed', value: 'Thread discussion + validateGuestToken trace' },
      ],
    })

    const p6PRCard = (nowStr) => ({
      accentColor: '#238636',
      title: 'PR #4598 — Fix validateGuestToken claim format check',
      badge: { text: 'Open', tone: 'green' },
      subtitle: 'northwind/agent-handoff · 2 files · +12 −0',
      sections: [
        {
          heading: 'auth/guest.ts',
          diff: [
            { type: ' ', text: '  // Validate token claims before expiry check' },
            { type: '+', text: '  const fmt = detectClaimFormat(guestClaims)' },
            { type: '+', text: '  if (fmt !== hostClaimFormat) {' },
            { type: '+', text: "    return promptReAuth({ reason: 'GuestClaimMismatch' })" },
            { type: '+', text: '  }' },
            { type: ' ', text: '  if (isExpired(guestToken)) {' },
            { type: ' ', text: "    return promptReAuth({ reason: 'TokenExpired' })" },
            { type: ' ', text: '  }' },
          ],
        },
      ],
      footer: 'GitHub Copilot · northwind/agent-handoff · ' + nowStr,
      actions: ['Review PR', { label: 'Approve & merge', primary: true }],
    })

    const p6DeployCard = (nowStr) => ({
      accentColor: '#8250DF',
      title: 'Deployed to production — northwind/agent-handoff',
      badge: { text: 'Success', tone: 'green' },
      subtitle: 'PR #4598 · main · commit a3f9c21',
      steps: [
        { text: 'PR #4598 approved — Kevin Park · Sarah Chen', status: 'done' },
        { text: 'Merged to main', status: 'done' },
        { text: 'Deploy pipeline passed — 4m 12s', status: 'done' },
        { text: 'Production rollout complete — 100% traffic', status: 'done' },
      ],
      footer: 'GitHub Actions · northwind/agent-handoff · ' + nowStr,
    })

    const p6UsageCard = (nowStr) => ({
      accentColor: '#0078D4',
      title: 'Post-deploy telemetry — #4597',
      subtitle: 'First 30 min after rollout',
      metrics: [
        { value: '0', label: 'Auth errors / hr', delta: '↓ 47 fixed', deltaTone: 'positive' },
        { value: '100%', label: 'Re-auth success', delta: '↑ from 0%', deltaTone: 'positive' },
        { value: '1.2s', label: 'Median re-auth time', delta: 'new', deltaTone: 'neutral' },
      ],
      bars: [
        { label: 'iOS Safari', value: 98, valueLabel: '98%', color: '#107C10' },
        { label: 'Chrome Android', value: 97, valueLabel: '97%', color: '#107C10' },
        { label: 'Chrome Desktop', value: 100, valueLabel: '100%', color: '#107C10' },
      ],
      footer: 'Application Insights · live · ' + nowStr,
    })

    const scheduleCopilotOnward = (chatId, offset) => {
      // Copilot picks up the issue
      setTimeout(() => {
        setExtraMessages(prev => ({
          ...prev,
          [chatId]: [...(prev[chatId] || []), {
            id: `p6-cop-1-${Date.now()}`,
            senderId: 41,
            text: 'Assigned to #4597 — reviewing `validateGuestToken()` now.',
            time: nowTimeStr(),
          }],
        }))
        setMainTyping({ chatId, contactId: 41 })
      }, offset)

      // Copilot PR
      setTimeout(() => {
        setMainTyping(prev => prev?.chatId === chatId ? null : prev)
        const nowStr = nowTimeStr()
        setExtraMessages(prev => ({
          ...prev,
          [chatId]: [...(prev[chatId] || []), {
            id: `p6-cop-pr-${Date.now()}`,
            senderId: 41,
            text: 'Fix ready. PR opened.',
            cards: [p6PRCard(nowStr)],
            time: nowStr,
          }],
        }))
      }, offset + 1800)

      // Review requested
      setTimeout(() => {
        setExtraMessages(prev => ({
          ...prev,
          [chatId]: [...(prev[chatId] || []), {
            id: `p6-review-${Date.now()}`,
            isSystem: true,
            text: 'Review requested · Kevin Park · Sarah Chen',
          }],
        }))
      }, offset + 2300)

      // Approvals
      setTimeout(() => {
        setExtraMessages(prev => ({
          ...prev,
          [chatId]: [...(prev[chatId] || []),
            { id: `p6-kev-${Date.now()}`, senderId: 15, text: 'looks good — approved ✓', time: nowTimeStr() },
            { id: `p6-sarah-${Date.now()}`, senderId: 1, text: 'approved ✓', time: nowTimeStr() },
          ],
        }))
      }, offset + 3800)

      // Deploy
      setTimeout(() => {
        const nowStr = nowTimeStr()
        setExtraMessages(prev => ({
          ...prev,
          [chatId]: [...(prev[chatId] || []), {
            id: `p6-deploy-${Date.now()}`,
            senderId: 42,
            text: 'Merged and deployed.',
            cards: [p6DeployCard(nowStr)],
            time: nowStr,
          }],
        }))
      }, offset + 4800)

      // Usage data
      setTimeout(() => {
        const nowStr = nowTimeStr()
        setExtraMessages(prev => ({
          ...prev,
          [chatId]: [...(prev[chatId] || []), {
            id: `p6-usage-${Date.now()}`,
            senderId: 42,
            text: 'Post-deploy telemetry coming in.',
            cards: [p6UsageCard(nowStr)],
            time: nowStr,
          }],
        }))
      }, offset + 6800)
    }

    // P6 Workflows path
    if (action.action === 'p6_workflows') {
      setP6State('workflows')
      const nowStr = nowTimeStr()
      setExtraMessages(prev => ({
        ...prev,
        [chatId]: [...(prev[chatId] || []),
          { id: `p6-wf-sys-${Date.now()}`, isSystem: true, text: 'Workflow triggered · Teams emoji reaction → GitHub Issues' },
        ],
      }))
      setTimeout(() => {
        setExtraMessages(prev => ({
          ...prev,
          [chatId]: [...(prev[chatId] || []), {
            id: `p6-wf-issue-${Date.now()}`,
            senderId: 42,
            text: 'GitHub issue created.',
            cards: [p6IssueCardWorkflows()],
            time: nowTimeStr(),
          }],
        }))
      }, 500)
      scheduleCopilotOnward(chatId, 2000)
      return
    }

    // P6 Agency path
    if (action.action === 'p6_agency') {
      setP6State('agency')
      setExtraMessages(prev => ({
        ...prev,
        [chatId]: [...(prev[chatId] || []), {
          id: `p6-ag-text-${Date.now()}`,
          senderId: 36,
          text: 'On it — filing a GitHub issue for the validateGuestToken bug.',
          time: nowTimeStr(),
        }],
      }))
      setTimeout(() => {
        setExtraMessages(prev => ({
          ...prev,
          [chatId]: [...(prev[chatId] || []), {
            id: `p6-ag-issue-${Date.now()}`,
            senderId: 36,
            text: 'GitHub issue filed.',
            cards: [p6IssueCardAgency()],
            time: nowTimeStr(),
          }],
        }))
      }, 800)
      scheduleCopilotOnward(chatId, 2500)
      return
    }
  }

  // P4: "Open this in Agency" card action — create a pre-seeded Agency session
  // and navigate there with the fix plan already loaded.
  // P7: "View Live Preview" card action — open Teams Stage View with the
  // Lovable-generated Morgan Collective site.
  const handleCardAction = ({ type, version }) => {
    if (type === 'open_stage_view') {
      setShowStageView(true)
      if (version) setStageViewVersion(version)
      // Advance the guided walkthrough step
      if (activeChatId === 44 && p7Step === 1) setP7Step(2)
      return
    }
    if (type !== 'open_in_agency') return
    const nowStr = nowTimeStr()
    const sessionId = `s36-hotfix-${Date.now()}`
    const seedMessages = [
      {
        id: `ag-u-${Date.now()}`,
        senderId: 'me',
        text: 'Can you draft the fix and open a PR for JIRA-4593?',
        time: nowStr,
      },
      {
        id: `ag-r-${Date.now()}`,
        senderId: 36,
        text: 'On it. I\'ve reviewed the group thread and traced the issue in the codebase.',
        cards: [
          {
            accentColor: '#5B5FC7',
            title: 'Fix plan — JIRA-4593',
            subtitle: 'auth/guest.ts · 22-line change + 1 new test',
            steps: [
              { text: 'Add claim format check at auth/guest.ts:84 — before token expiry assertion', status: 'done' },
              { text: 'Route GuestClaimMismatch to re-auth prompt — mirrors auth/host.ts:61', status: 'done' },
              { text: 'New test: expired token + mismatched claims → re-auth prompt fires', status: 'done' },
            ],
            footer: 'Agency · JIRA-4593 · ' + nowStr,
            actions: ['Open PR', 'Review changes'],
          },
        ],
        time: nowStr,
      },
    ]
    addSession(36, {
      id: sessionId,
      name: 'JIRA-4593 fix — guest token re-auth',
      time: new Date().toLocaleString([], { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }),
      preview: 'Fix plan ready · auth/guest.ts · 22 lines',
      sourceChatId: activeChatId,
    }, seedMessages)
    onSelectChat(36, { showSessions: true, sessionId })
  }

  return (
    <div className="chat-view">
      {showStageView && (
        <StageView
          version={stageViewVersion}
          onVersionChange={setStageViewVersion}
          step={p7Step}
          onStepAdvance={() => setP7Step(null)}
          onClose={() => setShowStageView(false)}
        />
      )}
      <div className="chat-view-main">
        <ChatHeader
          activeContact={activeContact}
          isChannel={isChannel}
          isGroup={isGroup}
          participantCount={participantCount}
          hasSessions={hasSessions}
          showSessions={showSessions}
          onToggleSessions={() => setShowSessions((prev) => !prev)}
          showThreads={threadRailOpen && channelThreadPostId === null}
          onToggleThreads={() => {
            if (threadRailOpen && channelThreadPostId === null) {
              setThreadRailOpen(false)
            } else {
              setChannelThreadPostId(null)
              setThreadRailOpen(true)
            }
          }}
          pinnedTab={pinnedTab}
          activeTab={activeTab}
          onSelectTab={setActiveTab}
        />

        {/* P7 step 1 guide — floats above the message list, points down toward the v1 card */}
        {activeChatId === 44 && p7Step === 1 && (
          <div className="p7-step-guide">
            <span className="p7-step-num">Step 1 of 2</span>
            <span className="p7-step-text">Click <strong>View Live Preview</strong> on Lovable's completion card below</span>
            <span className="p7-step-arrow"><DemoArrow direction="down" size={16} /></span>
          </div>
        )}

        {activeTab === 'pinned' && contextBrief ? (
          <ContextBriefPanel brief={contextBrief} />
        ) : (
        <div className="chat-messages">
          {isChannel ? (
            <div className="messages-container messages-container-channel">
              {channelPosts.map((post) => (
                <MessageRow
                  key={post.id}
                  message={postToMessage(post)}
                  activeContact={activeContact}
                  onOpenThread={() => {
                    if (threadRailOpen && channelThreadPostId === post.id) {
                      setThreadRailOpen(false)
                      setChannelThreadPostId(null)
                    } else {
                      setChannelThreadPostId(post.id)
                      setThreadRailOpen(true)
                    }
                  }}
                />
              ))}
              <div ref={messagesEndRef} />
            </div>
          ) : showPromptSuggestions ? (
            <PromptSuggestions
              agent={activeContact}
              suggestions={agentSuggestions}
              onSelectPrompt={sendPromptSuggestion}
            />
          ) : (
            <div className="messages-container">
              {sourceChat && (
                <div className="session-source-banner">
                  Started conversation from{' '}
                  <a
                    className="session-source-banner-link"
                    href="#"
                    onClick={(e) => { e.preventDefault(); onSelectChat(sourceChat.id) }}
                  >{sourceChat.name}</a>
                  <br />
                  Recent context from the conversation has been shared with this session.
                </div>
              )}
              {messages
                .filter(msg => {
                  // Hide the targeted message once the user has acted on it.
                  if (msg.targetedActions && activeChatId === 35 && groupIntelAction !== null) return false
                  if (msg.targetedActions && activeChatId === 39 && p5Action !== null) return false
                  if (msg.targetedActions && activeChatId === 40 && p6State && p6State !== 'prompted') return false
                  return true
                })
                .map((msg) => {
                const isThreaded = isGroup && msg.replies?.length > 0
                return (
                  <MessageRow
                    key={msg.id}
                    message={isThreaded ? postToMessage(msg) : msg}
                    activeContact={activeContact}
                    onOpenThread={isThreaded ? () => {
                      if (threadRailOpen && channelThreadPostId === msg.id) {
                        setThreadRailOpen(false)
                        setChannelThreadPostId(null)
                      } else {
                        setChannelThreadPostId(msg.id)
                        setThreadRailOpen(true)
                      }
                    } : openJiraThread}
                    onTargetedAction={msg.targetedActions ? handleTargetedAction : undefined}
                    onCardAction={handleCardAction}
                    onReact={activeChatId === 40 ? handleP6React : undefined}
                  />
                )
              })}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
        )}

        {monitoringAgents.length > 0 && (
          <div className="monitoring-indicator">
            <div className="monitoring-dot" />
            <span className="monitoring-agents">{monitoringAgents.map(a => a.name).join(' · ')}</span>
            <span className="monitoring-label">{monitoringAgents.length === 1 ? 'is' : 'are'} monitoring this conversation</span>
          </div>
        )}

        <div className="chat-compose-area">
          {mainTyping?.chatId === activeChatId && (
            <TypingIndicator
              contact={contacts.find(c => c.id === mainTyping.contactId) || activeContact}
              className="chat-compose-typing"
            />
          )}
          <Compose
            value={inputValue}
            mention={composeMention}
            onChange={setInputValue}
            onClearMention={() => setComposeMention(null)}
            onSend={handleSend}
            isChannel={isChannel}
          />
        </div>
      </div>

      {showSessions && (
        <SessionsRail
          sessions={sessions[activeChatId] || []}
          activeSessionId={activeSessionId}
          onSelectSession={setActiveSessionId}
          onClose={() => setShowSessions(false)}
          onNewSession={handleNewSession}
        />
      )}
      {showAgents && (
        <AgentsRail
          agents={agentsInConversation}
          recommended={recommendedAgents}
          selectedAgent={selectedRailAgent}
          onSelectAgent={selectRailAgent}
          messages={selectedRailAgent ? agentChatMessages[selectedRailAgent.id] || [] : []}
          onSendMessage={sendInRail}
          composeHint={railComposeHint}
          typingAgentId={railTypingAgentId}
          onClose={() => setShowAgents(false)}
        />
      )}
      {threadRailOpen && (
        <ChannelThreadRail
          posts={isChannel ? channelPosts : groupThreadablePosts}
          initialPostId={channelThreadPostId}
          activeContact={activeContact}
          onClose={() => {
            setThreadRailOpen(false)
            setChannelThreadPostId(null)
          }}
        />
      )}
    </div>
  )
}

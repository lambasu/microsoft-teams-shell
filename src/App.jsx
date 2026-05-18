import { useState, useCallback } from 'react'
import { agentSessions as initialSessions, activityEvents as seedActivityEvents } from './data'
import NavRail from './components/NavRail'
import ChatList from './components/ChatList'
import ChatView from './components/ChatView'
import ActivityList from './components/ActivityList'
import TitleBar from './components/TitleBar'
import PrototypeGallery from './components/PrototypeGallery'
import { FreModal } from './components/common'
import './App.css'

// Map prototype id → initial chat id
const PROTOTYPE_CHAT = { p1: 23, p2: 34, p3: 35 }

export default function App() {
  const [selectedPrototype, setSelectedPrototype] = useState(null) // null = gallery
  const [activeView, setActiveView] = useState('chat') // 'chat' | 'activity'
  const [activeChatId, setActiveChatId] = useState(35)
  const [readChatIds, setReadChatIds] = useState(() => new Set([35]))
  const [sessions, setSessions] = useState(initialSessions)
  const [dynamicSessionMessages, setDynamicSessionMessages] = useState({})
  // Activity feed: persist which events the user has opened so unread decorations clear.
  const [activityEvents, setActivityEvents] = useState(seedActivityEvents)
  const [activeActivityId, setActiveActivityId] = useState(null)
  // When navigating to a chat, optionally tell ChatView to open a specific
  // session (sessions rail), open a specific channel thread, or flash a
  // specific message so the user can see where a notification landed.
  const [navIntent, setNavIntent] = useState(null)
  // FRE shows on every load while iterating on the prototype — dismiss only
  // hides it for the current session. Swap to localStorage gating later if a
  // real first-run-only behavior is needed.
  const [showFre, setShowFre] = useState(true)

  const dismissFre = useCallback(() => setShowFre(false), [])

  const launchPrototype = useCallback((id) => {
    const chatId = PROTOTYPE_CHAT[id]
    setSelectedPrototype(id)
    setActiveChatId(chatId)
    setReadChatIds(new Set([chatId]))
    setActiveView('chat')
    setNavIntent(null)
    setShowFre(true)
  }, [])

  const backToGallery = useCallback(() => {
    setSelectedPrototype(null)
    setShowFre(false)
  }, [])

  const selectChat = useCallback((chatId) => {
    setActiveChatId(chatId)
    setReadChatIds(prev => (prev.has(chatId) ? prev : new Set(prev).add(chatId)))
  }, [])

  const navigateToChat = useCallback((chatId, { showSessions, sessionId } = {}) => {
    selectChat(chatId)
    if (showSessions) setNavIntent({ chatId, sessionId: sessionId || null })
  }, [selectChat])

  const clearNavIntent = useCallback(() => setNavIntent(null), [])

  const addSession = useCallback((agentId, session, messages) => {
    setSessions(prev => ({
      ...prev,
      [agentId]: [session, ...(prev[agentId] || [])],
    }))
    if (messages) {
      setDynamicSessionMessages(prev => ({ ...prev, [session.id]: messages }))
    }
  }, [])

  const updateSession = useCallback((agentId, sessionId, updates) => {
    setSessions(prev => ({
      ...prev,
      [agentId]: (prev[agentId] || []).map(s =>
        s.id === sessionId ? { ...s, ...updates } : s
      ),
    }))
  }, [])

  const updateSessionMessages = useCallback((sessionId, messages) => {
    setDynamicSessionMessages(prev => ({ ...prev, [sessionId]: messages }))
  }, [])

  const selectActivity = useCallback((event) => {
    setActiveActivityId(event.id)
    setActivityEvents(prev =>
      prev.map(e => (e.id === event.id && e.unread ? { ...e, unread: false } : e))
    )
    setActiveChatId(event.chatId)
    setReadChatIds(prev => (prev.has(event.chatId) ? prev : new Set(prev).add(event.chatId)))
    setNavIntent({
      chatId: event.chatId,
      channelThreadPostId: event.postId || null,
      highlightMessageId: event.messageId || null,
    })
  }, [])

  const activityUnreadCount = activityEvents.reduce((n, e) => n + (e.unread ? 1 : 0), 0)

  if (!selectedPrototype) {
    return (
      <div className="app">
        <TitleBar />
        <div className="app-body">
          <PrototypeGallery onLaunch={launchPrototype} />
        </div>
      </div>
    )
  }

  return (
    <div className="app">
      <TitleBar onBack={backToGallery} onShowFre={() => setShowFre(true)} />
      <div className="app-body">
        <NavRail
          activeView={activeView}
          onSelectView={setActiveView}
          activityUnreadCount={activityUnreadCount}
        />
        {activeView === 'activity' ? (
          <ActivityList
            events={activityEvents}
            activeEventId={activeActivityId}
            onSelectEvent={selectActivity}
          />
        ) : (
          <ChatList
            activeChatId={activeChatId}
            onSelectChat={selectChat}
            readChatIds={readChatIds}
          />
        )}
        <ChatView
          activeChatId={activeChatId}
          onSelectChat={navigateToChat}
          sessions={sessions}
          addSession={addSession}
          updateSession={updateSession}
          updateSessionMessages={updateSessionMessages}
          dynamicSessionMessages={dynamicSessionMessages}
          navIntent={navIntent}
          clearNavIntent={clearNavIntent}
        />
      </div>
      {showFre && selectedPrototype === 'p1' && (
        <FreModal
          title="Day-one agent onboarding"
          subtitle="Agent joins a group chat and instantly knows who's in the room — no user grounding required."
          onDismiss={dismissFre}
        >
          <h3 className="fre-section-title">The problem</h3>
          <p>
            Every time an agent is added to a group chat, someone has to spend
            time briefing it: who the stakeholders are, what tools the group
            uses, what files exist, what decisions are in flight. That onboarding
            tax falls on the user — and it has to happen again for every new chat.
          </p>

          <h3 className="fre-section-title">The idea</h3>
          <p>
            At the moment an agent is added, it reads the existing thread —
            messages, file shares, @mentions, link cards — and synthesizes a
            structured brief automatically. The welcome message isn't a generic
            greeting; it's proof the agent already knows the room.
          </p>

          <h3 className="fre-section-title">What to look for</h3>
          <p>
            Open the <strong>Northwind launch</strong> chat and scroll to the
            bottom. Claude's welcome card surfaces: the core team with roles,
            tools already in use (Figma, Jira, GitHub), files shared in the
            thread, and open items with urgency levels — all derived from the
            conversation history above.
          </p>
        </FreModal>
      )}
      {showFre && selectedPrototype === 'p2' && (
        <FreModal
          title="Context brief as a pinned tab"
          subtitle="Agent synthesizes the chat into a living document and pins it where the team can always find it."
          onDismiss={dismissFre}
        >
          <h3 className="fre-section-title">The problem</h3>
          <p>
            A welcome card in the thread is useful once, then it gets buried.
            New members joining later have no way to get up to speed without
            scrolling through hundreds of messages.
          </p>

          <h3 className="fre-section-title">The idea</h3>
          <p>
            Instead of posting a card, the agent writes a{' '}
            <strong>context-brief.md</strong> and pins it as a tab to the chat
            header. The brief is always one click away — a persistent,
            skimmable source of truth for anyone in the chat.
          </p>

          <h3 className="fre-section-title">What to look for</h3>
          <p>
            Open the <strong>Northwind launch</strong> chat. Notice the pin icon
            tab next to "Chat" in the header. Click it to open the context brief:
            team roster, open items with status badges, tools, shared files, and
            key decisions — all in a document-style panel.
          </p>
        </FreModal>
      )}
      {showFre && selectedPrototype === 'p3' && (
        <FreModal
          title="Group intelligence for Teams agents"
          subtitle="Agents monitor group conversations and decide when to engage — without waiting to be @mentioned."
          onDismiss={dismissFre}
        >
          <h3 className="fre-section-title">Today</h3>
          <p>
            Agents in Teams only respond when explicitly @mentioned. In a
            real standup or sprint sync, the right information often surfaces
            mid-conversation — not because someone called for it, but because
            context made it relevant. Requiring an @mention means value gets
            missed every time someone forgets to invoke the right agent.
          </p>

          <h3 className="fre-section-title">Problem</h3>
          <p>
            Teams with multiple agents create a coordination burden: users
            must remember which agent owns which domain, and manually invoke
            each one at the right moment. Agents are passive by default —
            capable only when called.
          </p>

          <h3 className="fre-section-title">Solution</h3>
          <p>
            A classifier-driven decision layer runs continuously on group chat
            messages. Each agent registers its own topic scope. When a message
            arrives, the classifier scores it for relevance — no LLM required.
            High confidence: agent responds directly. "Maybe" band: agent sends
            a <strong>targeted message</strong> (visible only to the relevant
            user) asking for confirmation before engaging the group.
          </p>
          <p>
            Open the <strong>Northwind sprint sync</strong> chat. Scroll to the
            bottom: Olivia @mentioned Jira earlier to create a ticket. A few
            messages later, James asks about the bug without any @mention. Jira's
            classifier detected the relevance — confidence 82% — and sent James
            a private targeted message asking whether to respond to the group.
          </p>

          <h3 className="fre-section-title">What this unlocks</h3>
          <p>
            Agents become ambient collaborators that surface help at the right
            moment without spamming or requiring user-initiated prompts. The
            targeted message pattern gives users control over when the agent
            engages — graceful uncertainty handling that keeps the experience
            from feeling intrusive.
          </p>
        </FreModal>
      )}
    </div>
  )
}

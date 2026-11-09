import { useEffect, useRef, useState } from 'react'
import './SidePanelCompare.css'

// Virtual viewport each variant renders at before being scaled to fit its
// column — keeps both frames pixel-identical to the full-size ?mock= views.
const FRAME_W = 1440
const FRAME_H = 900

const VARIANTS = [
  {
    id: 'copilot',
    tag: 'A',
    title: 'Copilot in side panel → invokes Asana plugin',
    note: 'Copilot-orchestrated. User stays in natural language; Copilot grounds on the group chat, picks the Asana plugin, applies the changes, and returns a summary card with Undo / Share. Best for multi-step, cross-app intents.',
  },
  {
    id: 'asana',
    tag: 'B',
    title: 'Asana app opened directly in side panel',
    note: 'App-direct. Asana\'s own UI opens in the same private pane, scoped to the chat\'s linked project. Full-fidelity dashboard and manual edits; sharing back to the chat is an explicit step. Best for browsing and precise edits.',
  },
]

function ScaledFrame({ src, title }) {
  const wrapRef = useRef(null)
  const [scale, setScale] = useState(0.5)

  useEffect(() => {
    const el = wrapRef.current
    if (!el) return
    const ro = new ResizeObserver(([entry]) => {
      setScale(entry.contentRect.width / FRAME_W)
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  return (
    <div ref={wrapRef} className="spc-frame" style={{ height: FRAME_H * scale }}>
      <iframe
        title={title}
        src={src}
        width={FRAME_W}
        height={FRAME_H}
        style={{ transform: `scale(${scale})` }}
      />
    </div>
  )
}

// ?mock=compare — both private side panel variants next to each other.
export default function SidePanelCompare() {
  return (
    <div className="spc">
      <header className="spc-header">
        <div>
          <h1 className="spc-title">Teams · Private side panel</h1>
          <p className="spc-subtitle">
            The group chat stays on the main stage. The side panel is private to you — nothing posts to the chat unless you share.
          </p>
        </div>
        <a className="spc-gallery-link" href="?">All prototypes</a>
      </header>
      <div className="spc-row">
        {VARIANTS.map((v) => (
          <section key={v.id} className="spc-col">
            <div className="spc-label">
              <span className="spc-tag">{v.tag}</span>
              <span className="spc-label-text">{v.title}</span>
              <a className="spc-open" href={`?mock=${v.id}`}>Open full size ↗</a>
            </div>
            <ScaledFrame src={`?mock=${v.id}`} title={`Variant ${v.tag}: ${v.title}`} />
            <p className="spc-note">{v.note}</p>
          </section>
        ))}
      </div>
    </div>
  )
}

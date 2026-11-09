import { IconButton, Close, PopOut, Lock } from './common'
import './PrivateSidePanel.css'

// Docked right-hand side panel that hosts a private experience next to a chat
// (Copilot, or a third-party app like Asana). Owns only the chrome: header
// (icon + title + actions), the "only you can see this" strip, a scrollable
// body, and an optional pinned footer. Content is supplied by the caller.
export default function PrivateSidePanel({
  icon,
  title,
  subtitle,
  privacyText = 'Only you can see this. Nothing is posted to the chat unless you share it.',
  extraActions,
  onClose,
  footer,
  bodyClassName = '',
  children,
}) {
  return (
    <aside className="private-side-panel" aria-label={`${title} side panel`}>
      <div className="psp-header">
        <span className="psp-header-icon">{icon}</span>
        <div className="psp-header-text">
          <span className="psp-title">{title}</span>
          {subtitle && <span className="psp-subtitle">{subtitle}</span>}
        </div>
        <div className="psp-header-actions">
          {extraActions}
          <IconButton label="Open in new window" className="psp-icon-btn">
            <PopOut size={16} />
          </IconButton>
          <IconButton label="Close side panel" className="psp-icon-btn" onClick={onClose}>
            <Close size={16} />
          </IconButton>
        </div>
      </div>
      <div className="psp-private-strip" role="note">
        <Lock size={12} />
        <span><strong>Private</strong> · {privacyText}</span>
      </div>
      <div className={`psp-body ${bodyClassName}`}>{children}</div>
      {footer && <div className="psp-footer">{footer}</div>}
    </aside>
  )
}

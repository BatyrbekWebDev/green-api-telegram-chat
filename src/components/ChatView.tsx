import type { ChatMessage } from '../types'
import { MessageInput } from './MessageInput'
import { MessageList } from './MessageList'
import './ChatView.css'

type Props = {
  phoneLabel: string
  messages: ChatMessage[]
  error: string
  onSend: (text: string) => Promise<void>
  onBack: () => void
  onLogout: () => void
}

export function ChatView({
  phoneLabel,
  messages,
  error,
  onSend,
  onBack,
  onLogout,
}: Props) {
  return (
    <div className="chat-page">
      <div className="chat-shell">
        <header className="chat-header">
          <button type="button" className="ghost-btn" onClick={onBack}>
            ← Назад
          </button>
          <div className="chat-title">
            <strong>{phoneLabel}</strong>
            <span>Telegram</span>
          </div>
          <button type="button" className="ghost-btn" onClick={onLogout}>
            Выйти
          </button>
        </header>

        <MessageList messages={messages} />

        {error ? <p className="chat-error">{error}</p> : null}

        <MessageInput onSend={onSend} />
      </div>
    </div>
  )
}

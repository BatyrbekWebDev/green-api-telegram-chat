import { useEffect, useRef } from 'react'
import type { ChatMessage } from '../types'
import './MessageList.css'

type Props = {
  messages: ChatMessage[]
}

function formatTime(timestamp: number): string {
  return new Date(timestamp).toLocaleTimeString('ru-RU', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function MessageList({ messages }: Props) {
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  if (messages.length === 0) {
    return (
      <div className="message-list empty">
        <p>Напишите первое сообщение</p>
      </div>
    )
  }

  return (
    <div className="message-list">
      {messages.map((message) => (
        <div
          key={message.id}
          className={`bubble-row ${message.direction}`}
        >
          <div className={`bubble ${message.direction}`}>
            <p className="bubble-text">{message.text}</p>
            <span className="bubble-time">{formatTime(message.timestamp)}</span>
          </div>
        </div>
      ))}
      <div ref={bottomRef} />
    </div>
  )
}

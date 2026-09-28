import { useState, type FormEvent } from 'react'
import './MessageInput.css'

type Props = {
  disabled?: boolean
  onSend: (text: string) => Promise<void> | void
}

export function MessageInput({ disabled, onSend }: Props) {
  const [text, setText] = useState('')
  const [sending, setSending] = useState(false)

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    const value = text.trim()
    if (!value || sending || disabled) return

    setSending(true)
    try {
      await onSend(value)
      setText('')
    } finally {
      setSending(false)
    }
  }

  return (
    <form className="message-input" onSubmit={handleSubmit}>
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Введите сообщение"
        disabled={disabled || sending}
        maxLength={4096}
      />
      <button type="submit" disabled={disabled || sending || !text.trim()}>
        Отправить
      </button>
    </form>
  )
}

import { useState, type FormEvent } from 'react'
import './NewChatForm.css'

type Props = {
  busy: boolean
  error: string
  onStart: (phone: string) => void
  onLogout: () => void
}

export function NewChatForm({ busy, error, onStart, onLogout }: Props) {
  const [phone, setPhone] = useState('')

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    onStart(phone.trim())
  }

  return (
    <div className="new-chat-page">
      <form className="new-chat-card" onSubmit={handleSubmit}>
        <div className="new-chat-header">
          <h1>Новый чат</h1>
          <button type="button" className="link-btn" onClick={onLogout}>
            Выйти
          </button>
        </div>

        <p className="hint">
          Введите номер собеседника в международном формате (например,
          79001234567)
        </p>

        <label className="field">
          <span>Телефон</span>
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="79001234567"
            inputMode="tel"
            disabled={busy}
          />
        </label>

        {error ? <p className="form-error">{error}</p> : null}

        <button type="submit" className="primary-btn" disabled={busy}>
          {busy ? 'Подключение…' : 'Начать чат'}
        </button>
      </form>
    </div>
  )
}

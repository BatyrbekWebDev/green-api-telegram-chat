import { useState, type FormEvent } from 'react'
import type { Credentials } from '../types'
import './LoginForm.css'

type Props = {
  onSubmit: (credentials: Credentials) => void
}

export function LoginForm({ onSubmit }: Props) {
  const [idInstance, setIdInstance] = useState('')
  const [apiTokenInstance, setApiTokenInstance] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    const id = idInstance.trim()
    const token = apiTokenInstance.trim()

    if (!id || !token) {
      setError('Заполните idInstance и apiTokenInstance')
      return
    }

    setError('')
    onSubmit({ idInstance: id, apiTokenInstance: token })
  }

  return (
    <div className="login-page">
      <form className="login-card" onSubmit={handleSubmit}>
        <h1>GREEN-API Chat</h1>
        <p className="login-subtitle">Telegram · введите данные инстанса</p>

        <label className="field">
          <span>idInstance</span>
          <input
            value={idInstance}
            onChange={(e) => setIdInstance(e.target.value)}
            placeholder="110100001"
            autoComplete="username"
          />
        </label>

        <label className="field">
          <span>apiTokenInstance</span>
          <input
            value={apiTokenInstance}
            onChange={(e) => setApiTokenInstance(e.target.value)}
            placeholder="d75b3a66..."
            autoComplete="current-password"
            type="password"
          />
        </label>

        {error ? <p className="form-error">{error}</p> : null}

        <button type="submit" className="primary-btn">
          Войти
        </button>
      </form>
    </div>
  )
}

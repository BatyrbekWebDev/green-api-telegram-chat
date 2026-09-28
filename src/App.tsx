import { useCallback, useState } from 'react'
import {
  checkAccount,
  normalizePhone,
  phoneToChatId,
  sendMessage,
} from './api/greenApi'
import { ChatView } from './components/ChatView'
import { LoginForm } from './components/LoginForm'
import { NewChatForm } from './components/NewChatForm'
import { useMessagePolling } from './hooks/useMessagePolling'
import type { ChatMessage, Credentials } from './types'
import './App.css'

const STORAGE_KEY = 'green-api-telegram-credentials'

type Screen = 'login' | 'new-chat' | 'chat'

function loadCredentials(): Credentials | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as Credentials
    if (parsed.idInstance && parsed.apiTokenInstance) return parsed
    return null
  } catch {
    return null
  }
}

function saveCredentials(credentials: Credentials | null) {
  if (!credentials) {
    localStorage.removeItem(STORAGE_KEY)
    return
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(credentials))
}

export default function App() {
  const [credentials, setCredentials] = useState<Credentials | null>(() =>
    loadCredentials(),
  )
  const [screen, setScreen] = useState<Screen>(() =>
    loadCredentials() ? 'new-chat' : 'login',
  )
  const [phoneLabel, setPhoneLabel] = useState('')
  const [chatId, setChatId] = useState<string | null>(null)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = (next: Credentials) => {
    saveCredentials(next)
    setCredentials(next)
    setError('')
    setScreen('new-chat')
  }

  const handleLogout = () => {
    saveCredentials(null)
    setCredentials(null)
    setChatId(null)
    setPhoneLabel('')
    setMessages([])
    setError('')
    setScreen('login')
  }

  const handleBack = () => {
    setChatId(null)
    setPhoneLabel('')
    setMessages([])
    setError('')
    setScreen('new-chat')
  }

  const handleStartChat = async (phone: string) => {
    if (!credentials) return

    const normalized = normalizePhone(phone)
    if (normalized.length < 10) {
      setError('Введите корректный номер телефона')
      return
    }

    setBusy(true)
    setError('')

    try {
      let resolvedChatId = phoneToChatId(normalized)

      try {
        const account = await checkAccount(credentials, normalized)
        if (account.exist && account.chatId) {
          resolvedChatId = account.chatId
        } else if (!account.exist) {
          setError('Аккаунт Telegram с таким номером не найден')
          return
        }
      } catch {
        // Fallback to phone@c.us if checkAccount is unavailable
      }

      setPhoneLabel(normalized)
      setChatId(resolvedChatId)
      setMessages([])
      setScreen('chat')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Не удалось начать чат')
    } finally {
      setBusy(false)
    }
  }

  const handleSend = async (text: string) => {
    if (!credentials || !chatId) return

    setError('')
    try {
      const result = await sendMessage(credentials, chatId, text)
      setMessages((prev) => [
        ...prev,
        {
          id: result.idMessage,
          text,
          direction: 'outgoing',
          timestamp: Date.now(),
          chatId,
        },
      ])
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Не удалось отправить сообщение'
      setError(message)
      throw err
    }
  }

  const handleIncoming = useCallback((message: ChatMessage) => {
    setMessages((prev) => {
      if (prev.some((item) => item.id === message.id)) return prev
      return [...prev, message]
    })
  }, [])

  const handlePollError = useCallback((message: string) => {
    setError(message)
  }, [])

  const pollingEnabled = screen === 'chat' && Boolean(credentials && chatId)

  useMessagePolling({
    credentials,
    activeChatId: chatId,
    enabled: pollingEnabled,
    onIncoming: handleIncoming,
    onError: handlePollError,
  })

  if (screen === 'login' || !credentials) {
    return (
      <div className="app">
        <LoginForm onSubmit={handleLogin} />
      </div>
    )
  }

  if (screen === 'new-chat') {
    return (
      <div className="app">
        <NewChatForm
          busy={busy}
          error={error}
          onStart={handleStartChat}
          onLogout={handleLogout}
        />
      </div>
    )
  }

  return (
    <div className="app">
      <ChatView
        phoneLabel={phoneLabel}
        messages={messages}
        error={error}
        onSend={handleSend}
        onBack={handleBack}
        onLogout={handleLogout}
      />
    </div>
  )
}

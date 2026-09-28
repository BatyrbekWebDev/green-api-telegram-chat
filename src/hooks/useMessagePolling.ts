import { useEffect, useRef } from 'react'
import {
  deleteNotification,
  extractIncomingText,
  receiveNotification,
} from '../api/greenApi'
import type { ChatMessage, Credentials } from '../types'

type Options = {
  credentials: Credentials | null
  activeChatId: string | null
  enabled: boolean
  onIncoming: (message: ChatMessage) => void
  onError?: (error: string) => void
}

function matchesActiveChat(
  notificationChatId: string | undefined,
  activeChatId: string,
  senderPhone?: number,
): boolean {
  if (notificationChatId && notificationChatId === activeChatId) return true

  const strip = (value: string) => value.replace(/@c\.us$/i, '')
  if (notificationChatId && strip(notificationChatId) === strip(activeChatId)) {
    return true
  }

  if (senderPhone != null) {
    const phone = String(senderPhone)
    if (strip(activeChatId) === phone || activeChatId.includes(phone)) {
      return true
    }
  }

  return false
}

export function useMessagePolling({
  credentials,
  activeChatId,
  enabled,
  onIncoming,
  onError,
}: Options): void {
  const onIncomingRef = useRef(onIncoming)
  const onErrorRef = useRef(onError)

  useEffect(() => {
    onIncomingRef.current = onIncoming
  }, [onIncoming])

  useEffect(() => {
    onErrorRef.current = onError
  }, [onError])

  useEffect(() => {
    if (!enabled || !credentials || !activeChatId) return

    const controller = new AbortController()
    let cancelled = false

    const poll = async () => {
      while (!cancelled) {
        try {
          const notification = await receiveNotification(
            credentials,
            5,
            controller.signal,
          )

          if (cancelled) break

          if (!notification) continue

          const { body, receiptId } = notification

          if (body.typeWebhook === 'incomingMessageReceived') {
            const text = extractIncomingText(notification)
            const chatId = body.senderData?.chatId ?? activeChatId
            const senderPhone = body.senderData?.senderPhoneNumber

            if (
              text &&
              matchesActiveChat(body.senderData?.chatId, activeChatId, senderPhone)
            ) {
              onIncomingRef.current({
                id: body.idMessage ?? `${receiptId}-${Date.now()}`,
                text,
                direction: 'incoming',
                timestamp: (body.timestamp ?? Date.now() / 1000) * 1000,
                chatId,
              })
            }
          }

          await deleteNotification(credentials, receiptId)
        } catch (error) {
          if (cancelled || controller.signal.aborted) break

          const message =
            error instanceof Error ? error.message : 'Ошибка получения сообщений'
          onErrorRef.current?.(message)
          await new Promise((resolve) => setTimeout(resolve, 2000))
        }
      }
    }

    void poll()

    return () => {
      cancelled = true
      controller.abort()
    }
  }, [enabled, credentials, activeChatId])
}

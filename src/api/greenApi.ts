import type {
  CheckAccountResponse,
  Credentials,
  GreenApiNotification,
} from '../types'

const API_BASE = '/green-api'

function instancePath(
  credentials: Credentials,
  method: string,
  suffix = '',
): string {
  const { idInstance, apiTokenInstance } = credentials
  return `${API_BASE}/waInstance${idInstance}/${method}/${apiTokenInstance}${suffix}`
}

async function parseError(response: Response): Promise<string> {
  const text = await response.text()
  try {
    const json = JSON.parse(text) as { message?: string; error?: string }
    return json.message || json.error || text || response.statusText
  } catch {
    return text || response.statusText
  }
}

export function normalizePhone(input: string): string {
  return input.replace(/\D/g, '')
}

export function phoneToChatId(phone: string): string {
  return `${normalizePhone(phone)}@c.us`
}

export async function checkAccount(
  credentials: Credentials,
  phoneNumber: string,
): Promise<CheckAccountResponse> {
  const response = await fetch(instancePath(credentials, 'checkAccount'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phoneNumber: Number(normalizePhone(phoneNumber)) }),
  })

  if (!response.ok) {
    throw new Error(await parseError(response))
  }

  return (await response.json()) as CheckAccountResponse
}

export async function sendMessage(
  credentials: Credentials,
  chatId: string,
  message: string,
): Promise<{ idMessage: string }> {
  const response = await fetch(instancePath(credentials, 'sendMessage'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chatId, message }),
  })

  if (!response.ok) {
    throw new Error(await parseError(response))
  }

  return (await response.json()) as { idMessage: string }
}

export async function receiveNotification(
  credentials: Credentials,
  receiveTimeout = 5,
  signal?: AbortSignal,
): Promise<GreenApiNotification | null> {
  const response = await fetch(
    instancePath(
      credentials,
      'receiveNotification',
      `?receiveTimeout=${receiveTimeout}`,
    ),
    { method: 'GET', signal },
  )

  if (!response.ok) {
    throw new Error(await parseError(response))
  }

  const text = await response.text()
  if (!text || text === 'null') {
    return null
  }

  return JSON.parse(text) as GreenApiNotification
}

export async function deleteNotification(
  credentials: Credentials,
  receiptId: number,
): Promise<void> {
  const response = await fetch(
    instancePath(credentials, 'deleteNotification', `/${receiptId}`),
    { method: 'DELETE' },
  )

  if (!response.ok) {
    throw new Error(await parseError(response))
  }
}

export function extractIncomingText(
  notification: GreenApiNotification,
): string | null {
  const { messageData } = notification.body
  if (!messageData) return null

  if (messageData.typeMessage === 'textMessage') {
    return messageData.textMessageData?.textMessage ?? null
  }

  if (messageData.typeMessage === 'extendedTextMessage') {
    return messageData.extendedTextMessageData?.text ?? null
  }

  return null
}

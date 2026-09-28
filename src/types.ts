export type Credentials = {
  idInstance: string
  apiTokenInstance: string
}

export type ChatMessage = {
  id: string
  text: string
  direction: 'outgoing' | 'incoming'
  timestamp: number
  chatId: string
}

export type GreenApiNotification = {
  receiptId: number
  body: {
    typeWebhook: string
    idMessage?: string
    timestamp?: number
    senderData?: {
      chatId?: string
      sender?: string
      chatName?: string
      senderName?: string
      senderPhoneNumber?: number
    }
    messageData?: {
      typeMessage?: string
      textMessageData?: {
        textMessage?: string
      }
      extendedTextMessageData?: {
        text?: string
      }
    }
  }
}

export type CheckAccountResponse = {
  exist: boolean
  chatId?: string
  username?: string
  phoneNumber?: number
}

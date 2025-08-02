export interface FileAttachment {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
}

export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
  attachments?: FileAttachment[];
}

export interface ChatState {
  messages: Message[];
  isTyping: boolean;
}
export interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: number;
}

export interface ConversationStore {
  saveSession(userId: string, messages: Message[]): Promise<void>;
  loadSession(userId: string): Promise<Message[]>;
  clearSession(userId: string): Promise<void>;
}
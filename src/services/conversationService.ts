import { FileConversationStore } from "../storage/adapters/FileConversationStore.js";
import type { Message } from "../storage/interfaces/ConversationStore.js";

const store = new FileConversationStore();

export async function getContext(userId: string): Promise<Message[]> {
  return store.loadSession(userId);
}

export async function saveContext(userId: string, messages: Message[]): Promise<void> {
  await store.saveSession(userId, messages);
}

export async function clearContext(userId: string): Promise<void> {
  await store.clearSession(userId);
}
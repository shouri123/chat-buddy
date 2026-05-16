import fs from "fs/promises";
import path from "path";
import type { ConversationStore, Message } from "../interfaces/ConversationStore.js";

const SESSIONS_DIR = path.join(process.cwd(), "storage", "sessions");
const MAX_MESSAGES = parseInt(process.env.MAX_CONTEXT_MESSAGES || "20", 10);
const TTL_HOURS = parseInt(process.env.SESSION_TTL_HOURS || "24", 10);

export class FileConversationStore implements ConversationStore {
  private filePath(userId: string) {
    return path.join(SESSIONS_DIR, `${userId}.json`);
  }

  async saveSession(userId: string, messages: Message[]): Promise<void> {
    await fs.mkdir(SESSIONS_DIR, { recursive: true });
    const trimmed = messages.slice(-MAX_MESSAGES);
    await fs.writeFile(this.filePath(userId), JSON.stringify(trimmed));
  }

  async loadSession(userId: string): Promise<Message[]> {
    try {
      const data = await fs.readFile(this.filePath(userId), "utf-8");
      const messages: Message[] = JSON.parse(data);
      const cutoff = Date.now() - TTL_HOURS * 60 * 60 * 1000;
      return messages.filter((message) => message.timestamp > cutoff);
    } catch {
      return [];
    }
  }

  async clearSession(userId: string): Promise<void> {
    try {
      await fs.unlink(this.filePath(userId));
    } catch {
      return;
    }
  }
}

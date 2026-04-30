/**
 * ChatHistoryStore
 */
import fs from "fs";
import path from "path";
import { getStorageDir, ensureStorageDir } from "./configStore.js";

export type UserChatHistory = Record<string, string>;
export type ChatHistory = Record<string, UserChatHistory>;

let chatHistoryCache: ChatHistory | null = null;

const getChatHistoryPath = (): string => {
  return path.join(getStorageDir(), "chat_history.json");
};

export const loadChatHistory = (): ChatHistory => {
  if (chatHistoryCache) return chatHistoryCache;

  const historyPath = getChatHistoryPath();
  if (!fs.existsSync(historyPath)) {
    chatHistoryCache = {};
    return chatHistoryCache;
  }

  try {
    chatHistoryCache = JSON.parse(fs.readFileSync(historyPath, "utf-8"));
    return chatHistoryCache!;
  } catch {
    chatHistoryCache = {};
    return chatHistoryCache;
  }
};

const saveChatHistory = (): void => {
  if (!chatHistoryCache) return;
  ensureStorageDir();
  const historyPath = getChatHistoryPath();
  fs.writeFileSync(historyPath, JSON.stringify(chatHistoryCache, null, 2), "utf-8");
};

export const appendMessage = (
  contactName: string,
  message: string,
  isAgent: boolean = false,
): void => {
  const history = loadChatHistory();

  if (!history[contactName]) {
    history[contactName] = {};
  }

  const timestamp = new Date().toISOString();
  const formattedMessage = isAgent ? `[agent] ${message}` : message;
  history[contactName][timestamp] = formattedMessage;

  chatHistoryCache = history;
  saveChatHistory();
};

export const getUserHistoryForContext = (
  contactName: string,
  maxMessages: number = 15,
): string[] => {
  const history = loadChatHistory();
  const userHistory = history[contactName];

  if (!userHistory) return [];

  const entries = Object.entries(userHistory);
  const recentEntries = entries.slice(-maxMessages);

  return recentEntries.map(([timestamp, message]) => {
    const date = new Date(timestamp);
    const timeStr = date.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
      timeZone: "Asia/Kolkata",
    });

    if (message.startsWith("[agent] ")) {
      return `[${timeStr}] agent: ${message.replace("[agent] ", "")}`;
    }
    return `[${timeStr}] ${contactName}: ${message}`;
  });
};

export const getUserHistory = (contactName: string): UserChatHistory => {
  const history = loadChatHistory();
  return history[contactName] || {};
};

export const clearUserHistory = (contactName: string): void => {
  const history = loadChatHistory();
  delete history[contactName];
  chatHistoryCache = history;
  saveChatHistory();
};

export const clearAllHistory = (): void => {
  chatHistoryCache = {};
  saveChatHistory();
};

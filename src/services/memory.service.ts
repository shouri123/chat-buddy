/**
 * Memory Service
 */
import {
  appendMessage,
  getUserHistoryForContext,
  clearUserHistory as clearPersistentHistory,
} from "../storage/chatHistoryStore.js";

export const storeMessage = (
  contactName: string,
  message: string,
  isAgent: boolean = false,
): void => {
  appendMessage(contactName, message, isAgent);
};

export const getHistory = (contactName: string): string[] => {
  return getUserHistoryForContext(contactName, 15);
};

export const clearHistory = (contactName: string): void => {
  clearPersistentHistory(contactName);
};

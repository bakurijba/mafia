import { Player } from "./player";

export interface ChatMessage {
  playerId: Player["id"];
  content: string;
  timestamp: number;
}

export interface Chat {
  messages: ChatMessage[];
  addMessage(message: ChatMessage): void;
  getMessagesSince(timestamp: number): ChatMessage[];
}

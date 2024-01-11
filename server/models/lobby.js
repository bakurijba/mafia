import { Schema, model } from "mongoose";
import { playerSchema } from "./player.js";

const lobbySchema = new Schema({
  id: String,
  maxPlayers: Number,
  status: {
    type: String,
    enum: ["waiting", "inProgress", "completed"],
  },
  gameState: {
    phase: {
      type: String,
      enum: ["day", "night"],
    },
    timeLeft: Number,
    roles: Map,
    remainingUsers: [playerSchema],
    pendingNightActions: Map,
    pendingDayActions: Map,
  },
});

export const Lobby = model("Lobby", lobbySchema);

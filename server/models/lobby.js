// Define a schema for lobbies
const { Schema, model } = require("mongoose");
const playerSchema = require("./player").playerSchema;

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
      enum: ['day', 'night']
    },
    timeLeft: Number,
    roles: Map,
    remainingUsers: [playerSchema],
    pendingNightActions: Map,
    pendingDayActions: Map,
  },
});

// Create a mongoose model for lobbies
module.exports = model("Lobby", lobbySchema);

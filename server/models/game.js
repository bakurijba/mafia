// Define a schema for lobbies
const { Schema, model } = require("mongoose");

const gameSchema = new Schema({
  lobbyId: String,
  gameId: String,
  gameState: {
    phase: String,
    timeLeft: Number,
    roles: Map,
    remainingUsers: [String],
    pendingNightActions: Map,
    pendingDayActions: Map,
  },
});

// Create a mongoose model for lobbies
module.exports = {
  game: model("Game", gameSchema),
  gameSchema,
};

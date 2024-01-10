// Define a schema for lobbies
const { Schema, model } = require("mongoose");
const playerSchema = require('./player').playerSchema

const lobbySchema = new Schema({
    id: String,
    players: [playerSchema],
    maxPlayers: Number,
    status: {
      type: String,
      enum: ["waiting", "inProgress", "completed"],
    },
  });
  
  // Create a mongoose model for lobbies
module.exports = model("Lobby", lobbySchema);
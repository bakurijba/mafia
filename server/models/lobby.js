// Define a schema for lobbies
const { Schema, model } = require("mongoose");

const lobbySchema = new Schema({
    id: String,
    users: [String],
    maxUsers: Number,
  });
  
  // Create a mongoose model for lobbies
module.exports = model("Lobby", lobbySchema);
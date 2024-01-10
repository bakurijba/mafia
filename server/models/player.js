// Define a schema for lobbies
const { Schema, model } = require("mongoose");

const playerSchema = new Schema({
  id: String,
  username: String,
});

module.exports = {
  player: model("Player", playerSchema),
  playerSchema,
};

// Define a schema for lobbies
const { Schema, model } = require("mongoose");

const roleSchema = new Schema({
  roleId: Number,
  name: String,
  description: String,
  ability: String,
});

module.exports = {
  role: model("Role", roleSchema),
  roleSchema,
};

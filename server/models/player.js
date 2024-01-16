import { Schema, model } from "mongoose";

const playerSchema = new Schema({
  id: String,
  username: String,
  isHost: Boolean
});

export const player = model("Player", playerSchema);
export { playerSchema };

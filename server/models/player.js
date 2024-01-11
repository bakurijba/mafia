import { Schema, model } from "mongoose";

const playerSchema = new Schema({
  id: String,
  username: String,
});

export const player = model("Player", playerSchema);
export { playerSchema };

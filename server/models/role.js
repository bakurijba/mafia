import { Schema, model } from "mongoose";

const roleSchema = new Schema({
  roleId: Number,
  name: String,
  description: String,
  ability: String,
});

export const role = model("Role", roleSchema);
export { roleSchema };

import { io } from "socket.io-client";

const URL =
  import.meta.env.NODE_ENV === "production" ? "" : "http://localhost:3000";

export const socket = io(URL);
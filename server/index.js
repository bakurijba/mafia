const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const mongoose = require("mongoose");
const Lobby = require("./models/lobby");
const PORT = 3000;
const CLIENT_ORIGIN = "http://localhost:5173";

require("dotenv").config();

const startServer = (port) => {
  const server = http.createServer(app);
  const io = new Server(server, { cors: { origin: CLIENT_ORIGIN } });

  server.listen(port, () => {
    console.log(`Server listening on *:${port}`);
  });

  return io;
};

const connectToDatabase = async () => {
  try {
    await mongoose.connect(process.env.DB_URL);
    console.log("Connected to the database");
  } catch (error) {
    console.error("Error connecting to the database:", error.message);
  }
};

const generateUniqueId = () => {
  return Math.random().toString(36).substring(2, 8);
};

const handleUserConnection = (socket) => {
  console.log(`${socket.id} user connected`);

  socket.on("add-message", (msg) => {
    socket.nsp.emit("receive-message", {
      userId: socket.id,
      message: msg,
    });
  });

  socket.on("lobby-create", handleLobbyCreation(socket));
  socket.on("user-joined", handleUserJoin(socket));
  socket.on("user-left", handleUserLeft(socket));
  socket.on("disconnect", handleUserDisconnect(socket));
};

const handleLobbyCreation = (socket) => async (username) => {
  try {
    const lobbyId = generateUniqueId();
    const lobby = new Lobby({
      id: lobbyId,
      players: [{ id: socket.id, username }],
      maxPlayers: 11,
      status: 'waiting'
    });

    await lobby.save();
    socket.join(lobbyId);
    socket.emit("lobby-created", lobbyId);

    console.log(`${socket.id} created lobby ${lobbyId}`);
  } catch (error) {
    console.error("Error creating lobby:", error.message);
  }
};

const handleUserJoin = (socket) => async (lobbyId, username) => {
  try {
    const lobby = await Lobby.findOne({ id: lobbyId });

    const isPlayerInLobby = lobby.players.some(
      (player) => player.id === socket.id
    );

    if (lobby) {
      // I join user to some lobby I want to create namespace no emit message to that namespace
      socket.join(lobbyId);

      if (!isPlayerInLobby && lobby.players.length <= lobby.maxPlayers) {
        lobby.players = [...lobby.players, { id: socket.id, username }];
      }

      await lobby.save();

      // here instead of emitting event to single socket, I must emit it to namespace
      io.to(lobbyId).emit("user-joined", { userId: socket.id, username });
      io.to(lobbyId).emit("lobby-updated", lobby);

      console.log(`${socket.id} joined lobby ${lobbyId}`);
    } else {
      socket.emit("lobby-not-found", { error: "Lobby not found" });
    }
  } catch (error) {
    console.error("Error joining lobby:", error.message);
  }
};

const handleUserLeft = (socket) => async (lobbyId) => {
  try {
    const lobby = await Lobby.findOne({ id: lobbyId });

    const isPlayerInLobby = lobby.players.some(
      (player) => player.id === socket.id
    );

    if (lobby) {
      socket.leave(lobbyId);

      const index = lobby.players.findIndex(
        (player) => player.id === socket.id
      );
      if (isPlayerInLobby && index !== -1) {
        lobby.players.splice(index, 1);
      }

      await lobby.save();

      io.to(lobbyId).emit("user-left", { userId: socket.id });
      io.to(lobbyId).emit("lobby-updated", lobby);

      console.log(`${socket.id} left lobby ${lobbyId}`);
    } else {
      socket.emit("lobby-not-found", { error: "Lobby not found" });
    }
  } catch (error) {
    console.error("Error joining lobby:", error.message);
  }
};

const handleUserDisconnect = (socket) => async () => {
  console.log(`${socket.id} user disconnected`);

  try {
    const userLobbies = await Lobby.find({
      players: { $elemMatch: { id: socket.id } },
    });

    for (const lobby of userLobbies) {
      const isPlayerInLobby = lobby.players.some(
        (player) => player.id === socket.id
      );

      if (isPlayerInLobby) {
        const index = lobby.players.findIndex(
          (player) => player.id === socket.id
        );

        if (index !== -1) {
          lobby.players.splice(index, 1);
          io.to(lobby.id).emit("user-disconnected", { userId: socket.id });
          console.log(`${socket.id} removed from lobby ${lobby.id}`);
          await lobby.save();

          io.to(lobby.id).emit("lobby-updated", lobby);
        }
      }
    }

    await Lobby.deleteMany({ players: { $size: 0 } });
  } catch (error) {
    console.error("Error handling disconnect:", error.message);
  }
};

const app = express();
const io = startServer(PORT);
connectToDatabase();

io.on("connection", handleUserConnection);

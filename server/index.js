const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const mongoose = require("mongoose");
const Lobby = require("./models/lobby");

const DB_URL =
  "mongodb+srv://bjobava1:9CpdUpb7wTXEo7IJ@cluster0.gglymvg.mongodb.net/?retryWrites=true&w=majority";
const PORT = 3000;
const CLIENT_ORIGIN = "http://localhost:5173";

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
    await mongoose.connect(DB_URL);
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
      socket.join(lobbyId);

      if (!isPlayerInLobby && lobby.players.length <= lobby.maxPlayers) {
        lobby.players = [...lobby.players, { id: socket.id, username }];
      }

      await lobby.save();
      socket.emit("user-joined", lobby);

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
      socket.off(lobbyId);

      if (isPlayerInLobby) {
        lobby.players = lobby.players.filter(
          (player) => player.id !== socket.id
        );
      }

      await lobby.save();
      socket.emit("user-left", lobby);

      console.log(`${socket.id} left lobby ${lobbyId}`);
    } else {
      // console.log("lobbyNotFound");
      socket.emit("lobby-not-found", { error: "Lobby not found" });
    }
  } catch (error) {
    console.error("Error joining lobby:", error.message);
  }
};

const handleUserDisconnect = (socket) => async () => {
  console.log(`${socket.id} user disconnected`);

  try {
    const userLobbies = await Lobby.find({ players: socket.id });

    for (const lobby of userLobbies) {
      const isPlayerInLobby = lobby.players.some(
        (player) => player.id === socket.id
      );

      if (isPlayerInLobby) {
        lobby.players.splice(index, 1);
        io.to(lobby.id).emit("user-disconnected", { userId: socket.id });
        console.log(`${socket.id} removed from lobby ${lobby.id}`);
        await lobby.save();
      }
    }

    await Lobby.deleteMany({ users: { $size: 0 } });
  } catch (error) {
    console.error("Error handling disconnect:", error.message);
  }
};

const app = express();
const io = startServer(PORT);
connectToDatabase();

io.on("connection", handleUserConnection);

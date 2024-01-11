import { createEvent, createStore, sample } from "effector";
import { Lobby } from "../../models/lobby";
import { assert } from "../../utils/assert";
import { showErrorMessageFx, showSuccessMessageFx } from "../notifications";

export const $lobbyId = createStore("");
export const lobbyIdChanged = createEvent<string>();

export const $allLobies = createStore<Lobby[]>([]);

export interface SimpleLobby {
  id: string;
  players: { id: string; username: string }[];
}

export const $lobby = createStore<SimpleLobby | null>(null);
export const lobbyChanged = createEvent<SimpleLobby>();

export const userDisconnected = createEvent<string>();
export const userConnected = createEvent<{
  userId: string;
  username: string;
}>();

sample({
  clock: lobbyChanged,
  target: $lobby,
});

sample({
  clock: userDisconnected,
  source: $lobby,
  filter(lobby, userId) {
    return !!lobby && !!userId;
  },
  fn(lobby, id) {
    assert(lobby, "lobby not defined");
    assert(id, "user id not defined");

    const newLobby: SimpleLobby = {
      id: lobby.id,
      players: lobby.players.filter((player) => player.id !== id),
    };

    return newLobby;
  },
  target: $lobby,
});

sample({
  clock: userConnected,
  source: $lobby,
  fn(lobby, { userId, username }) {
    assert(lobby, "lobby not defined");
    assert(userId, "user id not defined");

    const newLobby: SimpleLobby = {
      id: lobby.id,
      players: [
        ...lobby.players,
        { username: username || `Player ${lobby.players.length}`, id: userId },
      ],
    };

    return newLobby;
  },
  target: $lobby,
});

sample({
  clock: userDisconnected,
  fn(userId) {
    return `${userId} disconnected`;
  },
  target: showErrorMessageFx,
});

sample({
  clock: userConnected,
  fn({ username }) {
    return `${username} connected`;
  },
  target: showSuccessMessageFx,
});

sample({
  clock: lobbyIdChanged,
  target: $lobbyId,
});

import { createEvent, createStore, sample } from "effector";
import { Lobby } from "../../models/lobby";

export const $username = createStore("");
export const $lobbyId = createStore("");

export const userNameChanged = createEvent<string>();
export const lobbyIdChanged = createEvent<string>();

export const $allLobies = createStore<Lobby[]>([]);

export interface SimpleLobby {
  id: string;
  players: { id: string; username: string }[];
}

export const $lobby = createStore<SimpleLobby | null>(null);
export const lobbyChanged = createEvent<SimpleLobby>();

sample({
  clock: lobbyChanged,
  target: $lobby,
});

sample({
  clock: userNameChanged,
  target: $username,
});

sample({
  clock: lobbyIdChanged,
  target: $lobbyId,
});

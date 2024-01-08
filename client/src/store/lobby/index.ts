import { createEvent, createStore, sample } from "effector";
import { Lobby } from "../../models/lobby";

export const $username = createStore("");
export const $lobbyId = createStore("");

export const userNameChanged = createEvent<string>();
export const lobbyIdChanged = createEvent<string>();

export const $allLobies = createStore<Lobby[]>([]);

sample({
  clock: userNameChanged,
  target: $username,
});

sample({
  clock: lobbyIdChanged,
  target: $lobbyId,
});

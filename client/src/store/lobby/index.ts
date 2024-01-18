import { createEvent, createStore, sample } from "effector";
import { Lobby } from "../../models/lobby";
import { showErrorMessageFx, showSuccessMessageFx } from "../notifications";
import { Player } from "../../models/player";
import { Role } from "../../models/role";

export const $lobbyId = createStore("");
export const lobbyIdChanged = createEvent<string>();
export const $allLobies = createStore<Lobby[]>([]);

export const $lobby = createStore<Lobby | null>(null);
export const $gameState = $lobby.map((lobby) => {
  const rolesMap: Record<Player["id"], Role> = {};

  for (const userId in lobby?.gameState?.roles) {
    if (lobby?.gameState?.roles?.[userId]) {
      const user = lobby.gameState.roles[userId];

      rolesMap[userId] = user;
    }
  }

  const gameState: Lobby["gameState"] = {
    phase: lobby?.gameState?.phase || "day",
    remainingUsers: lobby?.gameState.remainingUsers || [],
    gameStarted: lobby?.status === "inProgress" || false,
    roles: rolesMap,
    timeLeft: 1000,
  };

  return gameState;
});

export const lobbyChanged = createEvent<Lobby>();

export const gameStarted = createEvent<void>();

export const userDisconnected = createEvent<string>();
export const userConnected = createEvent<{
  userId: string;
  username: string;
}>();

sample({
  clock: gameStarted,
  fn: () => "Game started!",
  target: showSuccessMessageFx,
});

sample({
  clock: lobbyChanged,
  target: $lobby,
});

sample({
  clock: userDisconnected,
  fn() {
    return null;
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

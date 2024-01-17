import { GameState } from "./game-state";
import { LobbyConfiguration } from "./lobby-configuration";

export interface Lobby {
  id: string;
  status: "waiting" | "inProgress" | "completed";
  gameState: GameState;
  lobbyConfiguration?: LobbyConfiguration;
}

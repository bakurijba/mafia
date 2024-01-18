import { GameState } from "./game-state";
import { LobbyConfiguration } from "./lobby-configuration";

export interface Lobby {
  id: string;
  maxPlayers: number;
  status: "waiting" | "inProgress" | "completed";
  gameState: GameState;
  lobbyConfiguration?: LobbyConfiguration;
}

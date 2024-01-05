import { GameState } from "./game-state";
import { LobbyConfiguration } from "./lobby-configuration";
import { Player } from "./player";

export interface Lobby {
  lobbyId: string;
  isPrivate: boolean;
  players: Player[];
  status: "waiting" | "inProgress" | "completed";
  configuration: LobbyConfiguration;
}

export interface Game {
  lobbyId: Lobby["lobbyId"];
  gameId: string;
  gameState: GameState;
}

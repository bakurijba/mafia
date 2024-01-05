import { Game, Lobby } from "./lobby";

export interface GameSetupManager {
  setupGame(lobby: Lobby): Game;
}

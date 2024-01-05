import { Lobby } from "./lobby";
import { LobbyConfiguration } from "./lobby-configuration";
import { Player } from "./player";

export interface LobbyManager {
  createLobby(creatorId: string, configuration: LobbyConfiguration): Lobby;
  joinLobby(player: Player, lobbyId: string): Lobby | null;
}

import { Role } from "./role";

export interface LobbyConfiguration {
  minPlayers: number;
  maxPlayers: number;
  availableRoles: Role[];
}

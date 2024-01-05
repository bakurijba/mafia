import { DayActionRequest, NightActionRequest } from "./night-action";
import { Player } from "./player";
import { Role } from "./role";

export interface GameState {
  phase: "day" | "night";
  timeLeft: number;
  roles: Map<Player["playerId"], Role>;
  remainingUsers: Player["playerId"];
  pendingNightActions?: Map<Player["playerId"], NightActionRequest>;
  pendingDayActions?: Map<Player["playerId"], DayActionRequest>;
}

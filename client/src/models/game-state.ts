import { DayActionRequest, NightActionRequest } from "./night-action";
import { Player } from "./player";
import { Role } from "./role";

export interface GameState {
  gameStarted: boolean;
  phase: "day" | "night";
  timeLeft: number;
  roles: Record<Player["id"], Role>;
  remainingUsers: Player[];
  pendingNightActions?: Map<Player["id"], NightActionRequest>;
  pendingDayActions?: Map<Player["id"], DayActionRequest>;
}

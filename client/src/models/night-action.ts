export interface NightActionRequest {
  action: "kill" | "save" | 'guess-mafia' | 'guess-detective';
  targetPlayerId: string;
}

export interface DayActionRequest {
  action: "vote";
  targetPlayerId: string;
  fromPlayerId: string;
}

type RoleName =
  | "killer"
  | "doctor"
  | "townperson"
  | "mafia"
  | "don"
  | "detective";

export interface BasicRole {
  roleId: string;
  name: RoleName;
  description: string;
}

type MafiaAction = "kill" | "guess-detective";

export interface MafiaRole extends BasicRole {
  ability: "kill";
}

export interface DoctorRole extends BasicRole {
  ability: "save";
}

export interface DetectiveRole extends BasicRole {
  ability: "guess-mafia";
}

export interface DonRole extends BasicRole {
  ability: MafiaAction[];
}

export interface KillerRole extends BasicRole {
  ability: "kill";
}

export type Role =
  | BasicRole
  | MafiaRole
  | DoctorRole
  | DetectiveRole
  | KillerRole;

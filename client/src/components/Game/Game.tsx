import { GameI, Lobby } from "../../models/lobby";
import { GameTable } from "./GameTable/GameTable";
import { players } from "./temporary";
import { Role, RoleId } from "../../models/role";
import { useEffect, useState } from "react";
import { socket } from "../../socket";


interface GameProps {
  lobbyId: Lobby["lobbyId"];
  gameState?: GameI["gameState"];
  username: string;
}

const initRoles = () => {
  const map = new Map<string, Role>();

  for (let i = 0; i < players.length; i++) {
    map.set(players[i].playerId, {
      name: i % 2 === 0 ? "mafia" : "townperson",
      roleId: i % 2 === 0 ? RoleId.MAFIA : RoleId.TOWNPERSON,
      ability: i % 2 === 0 ? "kill" : "save",
      description: "bak",
    });
  }

  return map;
};

export const Game = ({ lobbyId, username }: GameProps) => {
  const [roles, setRoles] = useState<Map<string, Role>>();

  const [timeLeft, setTimeLeft] = useState<number>(1000);

  useEffect(() => {
    setRoles(initRoles());
  }, []);

  const gameState: GameI["gameState"] = {
    phase: "day",
    remainingUsers: players.map((play) => play.playerId),
    roles: roles!,
    timeLeft: timeLeft,
  };

  useEffect(() => {
    socket.emit("lobby-join", "fbn85x");
  }, [lobbyId]);

  return (
    <div>
      <div className="flex items-center justify-start">
        <h2>Lobby ID: {lobbyId}</h2>
        <p>Username: {username}</p>
        <h2>Time Left: {timeLeft}</h2>
      </div>

      <GameTable gameState={gameState} />
    </div>
  );
};

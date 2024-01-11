import { GameI, Lobby } from "../../models/lobby";
import { GameTable } from "./GameTable";
import { Role, RoleId } from "../../models/role";
import { useEffect, useState } from "react";
import { useUnit } from "effector-react";
import { $lobby, SimpleLobby } from "../../store/lobby";
import { Button } from "rsuite";
import { socket } from "../../socket";
import { useNavigate } from "react-router-dom";

interface GameProps {
  lobbyId: Lobby["lobbyId"];
  gameState?: GameI["gameState"];
  username: string;
}

const initRoles = (players?: SimpleLobby["gameState"]["remainingUsers"]) => {
  const map = new Map<string, Role>();

  if (!players?.length) {
    return new Map();
  }

  for (let i = 0; i < players.length; i++) {
    map.set(players[i].id, {
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

  const navigate = useNavigate();

  const lobby = useUnit($lobby);

  useEffect(() => {
    setRoles(initRoles(lobby?.gameState.remainingUsers));
  }, [lobby?.gameState.remainingUsers]);

  const gameState: GameI["gameState"] = {
    phase: "day",
    remainingUsers: lobby?.gameState.remainingUsers || [],
    roles: roles!,
    timeLeft: 1000,
  };

  const handleLeftGame = () => {
    socket.emit("user-left", lobbyId, username);
    navigate("/lobby");
  };

  return (
    <div>
      <div className="flex items-center justify-between px-3">
        <div>
          <h2>Lobby ID: {lobbyId}</h2>
          <p>Username: {username}</p>
          <h2>Time Left: 1000</h2>
        </div>

        <div>
          <Button onClick={handleLeftGame}>Left Game</Button>
        </div>
      </div>

      <GameTable gameState={gameState} />
    </div>
  );
};

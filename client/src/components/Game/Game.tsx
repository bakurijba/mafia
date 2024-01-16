import { GameI, Lobby } from "../../models/lobby";
import { GameTable } from "./GameTable";
import { Role } from "../../models/role";
import { useMemo } from "react";
import { useUnit } from "effector-react";
import { $lobby } from "../../store/lobby";
import { Button } from "rsuite";
import { socket } from "../../socket";
import { useNavigate } from "react-router-dom";
import { Player } from "../../models/player";

interface GameProps {
  lobbyId: Lobby["lobbyId"];
  gameState?: GameI["gameState"];
  username: string;
}

export const Game = ({ lobbyId, username }: GameProps) => {
  const navigate = useNavigate();

  const lobby = useUnit($lobby);

  const isHost = lobby?.gameState.remainingUsers?.find(
    (user) => user.username === username && user.isHost
  );

  const map = useMemo(() => {
    const userMap: Record<Player["playerId"], Role> = {};

    for (const userId in lobby?.gameState?.roles) {
      // eslint-disable-next-line no-prototype-builtins
      if (lobby?.gameState?.roles.hasOwnProperty(userId)) {
        const user = lobby?.gameState?.roles[userId];

        userMap[userId] = user;
      }
    }

    return userMap;
  }, [lobby?.gameState?.roles]);

  const gameState: GameI["gameState"] = {
    phase: "day",
    remainingUsers: lobby?.gameState.remainingUsers || [],
    roles: map,
    timeLeft: 1000,
  };

  const handleLeftGame = () => {
    socket.emit("user-left", lobbyId, username);
    navigate("/lobby");
  };

  const handleStartGame = () => {
    socket.emit("user-started-game", lobbyId);
  };

  return (
    <div>
      <div className="flex items-center justify-between px-3">
        <div className="flex items-center gap-3">
          <h2>Lobby ID: {lobbyId}</h2>
          <p className="font-bold">Username: {username}</p>
        </div>

        <div className="flex gap-2">
          <Button onClick={handleLeftGame}>Left Game</Button>

          <Button
            onClick={handleStartGame}
            appearance="ghost"
            disabled={!isHost}
          >
            Start Game
          </Button>
        </div>
      </div>

      <GameTable gameState={gameState} />
    </div>
  );
};

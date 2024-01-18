import { GameTable } from "./GameTable";
import { useUnit } from "effector-react";
import { $gameState, $lobby } from "../../store/lobby";
import { Button } from "rsuite";
import { socket } from "../../socket";
import { useNavigate } from "react-router-dom";

interface GameProps {
  username: string;
  lobbyId: string;
}

export const Game = ({ lobbyId, username }: GameProps) => {
  const navigate = useNavigate();

  const gameState = useUnit($gameState);
  const lobby = useUnit($lobby);

  const isHost = gameState.remainingUsers?.find(
    (user) => user.username === username && user.isHost
  );

  const isGameAlreadyStarted = gameState.gameStarted;
  const isLobbyFull = gameState.remainingUsers.length === lobby?.maxPlayers;

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
            disabled={!isHost || isGameAlreadyStarted || !isLobbyFull}
          >
            Start Game
          </Button>
        </div>
      </div>

      <GameTable />
    </div>
  );
};

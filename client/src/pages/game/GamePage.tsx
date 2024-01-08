import { useUnit } from "effector-react";
import { Game } from "../../components/Game";
import { $lobbyId, $username } from "../../store/lobby";

export const GamePage = () => {
  const userName = useUnit($username);
  const lobbyId = useUnit($lobbyId);

  return <Game username={userName} lobbyId={lobbyId} />;
};

import { useUnit } from "effector-react";
import { Game } from "../../components/Game";
import { $lobbyId, $username, lobbyIdChanged } from "../../store/lobby";
import { useParams } from "react-router-dom";
import { useEffect } from "react";

export const GamePage = () => {
  const userName = useUnit($username);
  const lobby = useUnit($lobbyId);
  const lobbyChanged = useUnit(lobbyIdChanged);

  const params = useParams();

  const { lobbyId } = params;

  useEffect(() => {
    if (lobbyId) {
      lobbyChanged(lobbyId);
    }
  }, [lobbyId, lobbyChanged]);

  return <Game username={userName} lobbyId={lobby} />;
};

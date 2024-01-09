import { useUnit } from "effector-react";
import { Game } from "../../components/Game";
import {
  $lobbyId,
  $username,
  SimpleLobby,
  lobbyChanged,
  lobbyIdChanged,
} from "../../store/lobby";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { socket } from "../../socket";

export const GamePage = () => {
  const userName = useUnit($username);
  const lobby = useUnit($lobbyId);
  const changeLobbyId = useUnit(lobbyIdChanged);
  const changeLobby = useUnit(lobbyChanged);

  const params = useParams();

  const { lobbyId } = params;

  useEffect(() => {
    if (lobbyId) {
      changeLobbyId(lobbyId);
    }

    function lobbyJoined(lobby: SimpleLobby) {
      console.log("joined", lobby);

      changeLobby(lobby);
    }

    function lobbyLeft(lobby: SimpleLobby) {
      console.log("left", lobby);

      changeLobby(lobby);
    }

    socket.on("user-joined", lobbyJoined);
    socket.on("user-left", lobbyLeft);

    return () => {
      socket.off("user-joined", lobbyJoined);
      socket.off("user-left", lobbyLeft);
    };
  }, [lobbyId, changeLobbyId, changeLobby]);

  useEffect(() => {
    return () => {
      socket.emit("lobby-left", lobbyId);
    };
  }, [lobbyId]);

  return <Game username={userName} lobbyId={lobby} />;
};

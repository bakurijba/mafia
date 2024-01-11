import { useUnit } from "effector-react";
import { Game } from "../../components/Game";
import {
  $lobbyId,
  SimpleLobby,
  lobbyChanged,
  lobbyIdChanged,
  userConnected,
  userDisconnected,
} from "../../store/lobby";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { socket } from "../../socket";
import { $username } from "../../store/auth";

export const GamePage = () => {
  const username = useUnit($username);
  const lobby = useUnit($lobbyId);
  const changeLobbyId = useUnit(lobbyIdChanged);
  const changeLobby = useUnit(lobbyChanged);
  const disconnectUser = useUnit(userDisconnected);
  const connectUser = useUnit(userConnected);

  const params = useParams();

  const { lobbyId } = params;

  useEffect(() => {
    if (lobbyId) {
      changeLobbyId(lobbyId);
    }

    function userJoined({
      userId,
      username,
    }: {
      userId: string;
      username: string;
    }) {
      connectUser({ userId, username });
    }

    function userDisconnected(user: { userId: string }) {
      disconnectUser(user.userId);
    }

    function updateLobby(lobby: SimpleLobby) {
      changeLobby(lobby);
    }

    socket.on("user-joined", userJoined);
    socket.on("user-left", userDisconnected);
    socket.on("user-disconnected", userDisconnected);
    socket.on("lobby-updated", updateLobby);

    return () => {
      socket.off("user-joined", userJoined);
      socket.off("user-left", userDisconnected);
      socket.off("user-disconnected", userDisconnected);
      socket.off("lobby-updated", updateLobby);
    };
  }, [lobbyId, changeLobbyId, changeLobby, disconnectUser, connectUser]);

  useEffect(() => {
    socket.emit("user-joined", lobbyId, username);
  }, [lobbyId, username]);

  return <Game username={username} lobbyId={lobby} />;
};

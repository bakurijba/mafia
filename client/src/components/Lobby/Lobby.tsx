import { Button, Container, Content, Input, Sidebar, Sidenav } from "rsuite";
import { Chat } from "../Chat";
import { useNavigate } from "react-router-dom";
import { useUnit } from "effector-react";
import {
  $lobbyId,
  $username,
  lobbyIdChanged,
  userNameChanged,
} from "../../store/lobby";
import { socket } from "../../socket";
import { useEffect } from "react";

export const Lobby = () => {
  const [lobbyId, changeLobbyId] = useUnit([$lobbyId, lobbyIdChanged]);
  const [username, changeUserName] = useUnit([$username, userNameChanged]);

  const navigate = useNavigate();

  const handleCreateLobby = () => {
    socket.emit("lobby-create");
  };

  const handleJoinLobby = () => {
    if (!lobbyId || !username) {
      return;
    }

    navigate(`/game/${lobbyId}`);
  };

  useEffect(() => {
    function lobbyCreated(lobbyId: string) {
      navigate(`/game/${lobbyId}`);
    }

    socket.on("lobby-created", lobbyCreated);

    return () => {
      socket.off("lobby-created", lobbyCreated);
    };
  }, [navigate]);

  return (
    <Container className="min-h-[calc(100vh-4rem)] px-4">
      <Sidebar className="flex flex-col max-h-[80vh]" width={400}>
        <Sidenav.Header>
          <div>
            <h2 style={{ marginLeft: 12 }}>Chat</h2>
          </div>
        </Sidenav.Header>
        <Sidenav.Body className="flex-1 max-h-full">
          <Chat />
        </Sidenav.Body>
      </Sidebar>

      <Container>
        <Content className="flex items-center justify-center">
          <div className="flex flex-col gap-3 max-w-96 mx-auto">
            <h1>Mafia Lobby</h1>
            <Input
              type="text"
              placeholder="Enter Lobby ID"
              value={lobbyId}
              onChange={(value) => changeLobbyId(value)}
            />
            <Input
              type="text"
              placeholder="Enter Your Username"
              value={username}
              onChange={(value) => changeUserName(value)}
            />
            <Button onClick={handleCreateLobby}>Create Lobby</Button>
            <Button onClick={handleJoinLobby}>Join Lobby</Button>
          </div>
        </Content>
      </Container>
    </Container>
  );
};

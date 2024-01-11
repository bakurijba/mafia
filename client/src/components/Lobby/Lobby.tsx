import {
  Button,
  Container,
  Content,
  Input,
  Modal,
  Sidebar,
  Sidenav,
} from "rsuite";
import { Chat } from "../Chat";
import { useNavigate } from "react-router-dom";
import { useUnit } from "effector-react";
import { $lobbyId, lobbyIdChanged } from "../../store/lobby";
import { socket } from "../../socket";
import { useEffect, useState } from "react";
import { $username } from "../../store/auth";

export const Lobby = () => {
  const [lobbyId, changeLobbyId] = useUnit([$lobbyId, lobbyIdChanged]);
  const userName = useUnit($username);

  const [lobbyName, setLobbyName] = useState("");

  const [isOpen, setIsOpen] = useState(false);

  const navigate = useNavigate();

  const handleCreateLobby = () => {
    socket.emit("lobby-create", userName);
    setIsOpen(false);
  };

  const handleOpen = () => {
    setIsOpen(true);
  };

  const handleJoinLobby = () => {
    if (!lobbyId || !userName) {
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
            <Button onClick={handleJoinLobby}>Join Lobby</Button>

            <Button onClick={handleOpen} appearance="ghost">
              Create Lobby
            </Button>
          </div>
        </Content>
      </Container>

      <Modal open={isOpen} onClose={() => setIsOpen(false)}>
        <Modal.Header>Create a lobby</Modal.Header>

        <Modal.Body>
          <div className="flex flex-col">
            <Input
              type="text"
              placeholder="Enter Lobby Name"
              value={lobbyName}
              onChange={(value) => setLobbyName(value)}
            />

            <Button
              onClick={handleCreateLobby}
              appearance="primary"
              className="ml-auto mt-2"
            >
              Create
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

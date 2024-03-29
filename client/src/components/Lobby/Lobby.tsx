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
import { socket } from "../../socket";
import { useEffect, useState } from "react";
import { $username } from "../../store/auth";
import { showErrorMessageFx } from "../../store/notifications";

export const Lobby = () => {
  const [lobbyId, changeLobbyId] = useState("");
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

    socket.emit("user-try-joining", lobbyId);
  };

  useEffect(() => {
    function lobbyCreated(lobbyId: string) {
      navigate(`/game/${lobbyId}`);
    }

    function lobbyNotFound({ success }: { success: boolean }) {
      if (success) {
        return navigate(`/game/${lobbyId}`);
      }

      return showErrorMessageFx("Lobby Not Found");
    }

    socket.on("lobby-created", lobbyCreated);
    socket.on("user-try-joining", lobbyNotFound);

    return () => {
      socket.off("lobby-created", lobbyCreated);
      socket.off("user-try-joining", lobbyNotFound);
    };
  }, [lobbyId, navigate]);

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
          <form className="flex flex-col" onSubmit={(e) => e.preventDefault()}>
            <Input
              type="text"
              placeholder="Enter Lobby Name"
              value={lobbyName}
              onChange={(value) => setLobbyName(value)}
            />

            <Button
              type="submit"
              onClick={handleCreateLobby}
              appearance="primary"
              className="ml-auto mt-2"
            >
              Create
            </Button>
          </form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

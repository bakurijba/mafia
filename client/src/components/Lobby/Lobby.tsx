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
import {
  $lobbyId,
  $username,
  lobbyIdChanged,
  userNameChanged,
} from "../../store/lobby";
import { useState } from "react";

interface LobbyCreationProps {
  isOpen: boolean;
  close: () => void;
}

export const LobbyCreation = ({ isOpen, close }: LobbyCreationProps) => {
  return (
    <Modal onClose={close} open={isOpen} title="Create a lobby">
      <Modal.Header onClose={close}>Create a Lobby</Modal.Header>

      <Modal.Body>Let's write information about lobby</Modal.Body>
    </Modal>
  );
};

export const Lobby = () => {
  const [lobbyId, changeLobbyId] = useUnit([$lobbyId, lobbyIdChanged]);
  const [username, changeUserName] = useUnit([$username, userNameChanged]);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const navigate = useNavigate();

  const handleCreateLobby = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleJoinLobby = () => {
    if (!lobbyId || !username) {
      return;
    }

    navigate(`/game/${lobbyId}`);
  };

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

      <LobbyCreation isOpen={isModalOpen} close={handleCloseModal} />
    </Container>
  );
};

import { useState } from "react";
import { Button, Container, Content, Input, Sidebar, Sidenav } from "rsuite";
import { Chat } from "../Chat";
import { useNavigate } from "react-router-dom";

export const Lobby = () => {
  const [lobbyId, setLobbyId] = useState("");
  const [username, setUsername] = useState("");

  const navigate = useNavigate()

  const handleCreateLobby = () => {
    // Implement logic to create a lobby
  };

  const handleJoinLobby = () => {
    navigate('/game/bak')

    // Implement logic to join a lobby
  };

  return (
    <Container className="min-h-[calc(100vh-4rem)] px-4">
      <Sidebar
        style={{ display: "flex", flexDirection: "column" }}
        width={400}
        collapsible
      >
        <Sidenav.Header>
          <div>
            <h2 style={{ marginLeft: 12 }}>Chat</h2>
          </div>
        </Sidenav.Header>
        <Sidenav.Body className="flex-1">
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
              onChange={(value) => setLobbyId(value)}
            />
            <Input
              type="text"
              placeholder="Enter Your Username"
              value={username}
              onChange={(value) => setUsername(value)}
            />
            <Button onClick={handleCreateLobby}>Create Lobby</Button>
            <Button onClick={handleJoinLobby}>Join Lobby</Button>
          </div>
        </Content>
      </Container>
    </Container>
  );
};

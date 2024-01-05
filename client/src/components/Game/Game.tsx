import { Lobby } from "@/models/lobby";


interface GameProps {
  lobbyId: Lobby["lobbyId"];
  username: string;
}

export const Game = ({ lobbyId, username }: GameProps) => {
  return (
    <div>
      <h1>Game</h1>
      <p>Lobby ID: {lobbyId}</p>
      <p>Username: {username}</p>
      {/* Implement game UI */}
    </div>
  );
};

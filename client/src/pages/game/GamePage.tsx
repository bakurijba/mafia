import { Game } from "../../components/Game";

export const GamePage = () => {
  const username = "Bakuri";
  const lobbyId = "test";

  return <Game username={username} lobbyId={lobbyId} />;
};

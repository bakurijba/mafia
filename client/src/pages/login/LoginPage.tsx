import { useUnit } from "effector-react";
import { Button, Container, Content, Input } from "rsuite";
import { $username, login, userNameChanged } from "../../store/auth";

export const LoginPage = () => {
  const [username, changeUserName] = useUnit([$username, userNameChanged]);
  const handleLogin = useUnit(login);

  return (
    <Container className="min-h-[calc(100vh-4rem)] px-4">
      <Container>
        <Content className="flex items-center justify-center">
          <div className="flex flex-col gap-3 max-w-96 mx-auto">
            <h1>Welcome To Mafia</h1>

            <Input
              type="text"
              placeholder="Enter Your Username"
              value={username}
              onChange={(value) => changeUserName(value)}
            />
            <Button onClick={handleLogin}>Login</Button>
          </div>
        </Content>
      </Container>
    </Container>
  );
};

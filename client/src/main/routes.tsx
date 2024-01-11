/* eslint-disable react-refresh/only-export-components */
import { Suspense, lazy } from "react";
import { Loading } from "../components/Loading";

const LobbyPage = lazy(() =>
  import("../pages/lobby/LobbyPage").then((module) => ({
    default: module.LobbyPage,
  }))
);

const GamePage = lazy(() =>
  import("../pages/game/GamePage").then((module) => ({
    default: module.GamePage,
  }))
);

const LoginPage = lazy(() =>
  import("../pages/login/LoginPage").then((module) => ({
    default: module.LoginPage,
  }))
);

export const privateRoutes = [
  {
    path: "/lobby",
    component: (
      <Suspense fallback={<Loading />}>
        <LobbyPage />
      </Suspense>
    ),
  },
  {
    path: "/game/:lobbyId",
    component: (
      <Suspense fallback={<Loading />}>
        <GamePage />
      </Suspense>
    ),
  },
];

export const publicRoutes = [
  {
    path: "/",
    component: (
      <Suspense fallback={<Loading />}>
        <LoginPage />
      </Suspense>
    ),
  },
];

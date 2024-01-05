/* eslint-disable react-refresh/only-export-components */
import { Suspense, lazy } from "react";
import { Loading } from "../components/Loading";

const HomePage = lazy(() =>
  import("../pages/home/HomePage").then((module) => ({
    default: module.HomePage,
  }))
);

const GamePage = lazy(() =>
  import("../pages/game/GamePage").then((module) => ({
    default: module.GamePage,
  }))
);

export const publicRoutes = [
  {
    path: "/",
    component: (
      <Suspense fallback={<Loading />}>
        <HomePage />
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

import { privateRoutes, publicRoutes } from "./main/routes";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { Layout } from "./components/Layout";
import { Toaster } from "sonner";

import { NotFound } from "./pages/not-found";
import { useGate, useUnit } from "effector-react";
import {
  LocationGate,
  NavigateFunctionGate,
  SearchParamsGate,
} from "./store/routes";
import { $checkingAuthState, $isAuthorized, AuthGate } from "./store/auth";
import { Loading } from "./components/Loading";
import { useDelayLoading } from "./utils/use-delay-loading";

import "./App.css";

const useRouterGates = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [params] = useSearchParams();

  useGate(NavigateFunctionGate, navigate);
  useGate(LocationGate, location);
  useGate(SearchParamsGate, params);
};

const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  const isAuthorized = useUnit($isAuthorized);

  const location = useLocation();

  if (!isAuthorized) {
    return <Navigate to={"/"} state={{ from: location }} replace />;
  }

  return children;
};

const Routing = () => {
  useRouterGates();
  useGate(AuthGate);

  const isCheckingAuth = useUnit($checkingAuthState);
  const isLoading = useDelayLoading();

  if (isLoading || isCheckingAuth) {
    return <Loading />;
  }

  return (
    <Routes>
      {publicRoutes.map((route) => (
        <Route
          key={route.path}
          element={<Layout>{route.component}</Layout>}
          path={route.path}
        ></Route>
      ))}

      {privateRoutes.map((route) => (
        <Route
          key={route.path}
          element={
            <Layout>
              <PrivateRoute>{route.component}</PrivateRoute>
            </Layout>
          }
          path={route.path}
        ></Route>
      ))}

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

function App() {
  return (
    <BrowserRouter>
      <Routing />
      <Toaster richColors visibleToasts={10} />
    </BrowserRouter>
  );
}

export default App;

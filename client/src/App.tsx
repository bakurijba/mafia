import { publicRoutes } from "./main/routes";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Layout } from "./components/Layout";

import "./App.css";
import { Toaster } from "sonner";

const Routing = () => {
  return (
    <Routes>
      {publicRoutes.map((route) => (
        <Route
          key={route.path}
          element={<Layout>{route.component}</Layout>}
          path={route.path}
        ></Route>
      ))}
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

import { publicRoutes } from "./main/routes";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import "./App.css";

const Routing = () => {
  return (
    <Routes>
      {publicRoutes.map((route) => (
        <Route
          key={route.path}
          element={route.component}
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
    </BrowserRouter>
  );
}

export default App;

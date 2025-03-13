import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import Rofees from "./Router/router.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Rofees />
  </StrictMode>
);

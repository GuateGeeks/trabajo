import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App";
import { WorkspaceProvider } from "./data/store";
import "./styles/tokens.css";
import "./styles/base.css";
import "./styles/art.css";
import "./styles/components.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <WorkspaceProvider>
      <App />
    </WorkspaceProvider>
  </StrictMode>,
);

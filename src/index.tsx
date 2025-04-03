import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ProjetDeLivre } from "./screens/ProjetDeLivre/ProjetDeLivre";
import "./tailwind.css";

const root = document.getElementById("app");
if (!root) throw new Error("Root element not found");

root.className = "w-full min-h-screen overflow-x-hidden";

createRoot(root).render(
  <StrictMode>
    <ProjetDeLivre />
  </StrictMode>
);
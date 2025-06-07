import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/sass/main.css";
import "./styles/tailwind/estilos.css";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import "./i18n";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>
);

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "sonner";

import { GoogleOAuthProvider } from "@react-oauth/google";

import "./index.css";
import App from "./App";

createRoot(document.getElementById("root")).render(
<StrictMode>
  <GoogleOAuthProvider
    clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}
  >
    <BrowserRouter>
      <App />
      <Toaster
        position="top-right"
        richColors
        closeButton
        duration={3000}
      />
    </BrowserRouter>
  </GoogleOAuthProvider>
</StrictMode>
);
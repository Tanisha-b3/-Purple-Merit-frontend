import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import "./index.css";
import { AuthProvider } from "./context/AuthContext.jsx";
import { ThemeProvider } from "./Components/theme_provider.jsx";
import { ToastContainer } from "react-toastify";
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
   <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
   <ToastContainer />
  <AuthProvider>
    <BrowserRouter>
      <App />
    </BrowserRouter>
    </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>

);

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router";
import { router } from "./router/Router.tsx";
import { Provider } from "react-redux";
import { store } from "./store/store.ts";

import { theme } from "./theme.ts";
import { ThemeProvider, CssBaseline } from "@mui/material";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      {/* Tema en dışta olmalı */}
      <ThemeProvider theme={theme}>
        {/* CssBaseline, tüm varsayılan stilleri uygular */}
        <CssBaseline />

        {/* Router bileşenleri artık tema içinde */}
        <RouterProvider router={router} />
      </ThemeProvider>
    </Provider>
  </StrictMode>
);

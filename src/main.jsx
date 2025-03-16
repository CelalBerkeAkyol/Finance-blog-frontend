import { createRoot } from "react-dom/client";
import { NextUIProvider } from "@nextui-org/react";
import "./index.css";
import App from "./App.jsx";

import { store } from "./app/store";
import { Provider } from "react-redux";
import { logRender } from "./utils/LogRender.js";

window.store = store;
// main.jsx yüklendiğinde log at
logRender("Main");

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <NextUIProvider>
      <main className="light text-foreground bg-background">
        <App />
      </main>
    </NextUIProvider>
  </Provider>
);

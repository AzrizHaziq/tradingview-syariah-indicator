import "windi.css";

import App from "./app";
import { render } from "solid-js/web";
import { Router } from "solid-app-router";

render(
  () => (
    <Router>
      <App />
    </Router>
  ),
  document.getElementById("root") as HTMLElement
);

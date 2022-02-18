import "windi.css";
import "../_global.scss";
import "./_index.scss";

import { Popup } from "@popup/Components";
import { render } from "solid-js/web";
import { CurrentDataProvider } from "@popup/popup-helpers";

const App = () => (
  <CurrentDataProvider value={[]}>
    <Popup />
  </CurrentDataProvider>
);

render(App, document.body);

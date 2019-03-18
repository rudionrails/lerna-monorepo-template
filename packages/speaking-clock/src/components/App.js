import React from "react";

import Show from "./pages/Show";
import style from "./App.css";

const App = () => (
  <div className={`d-flex flex-column justify-content-center ${style.app}`}>
    <Show />
  </div>
);

export default App;

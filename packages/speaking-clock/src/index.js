import React from "react";
import ReactDOM from "react-dom";

import { StoreProvider } from "./store";
import App from "./components/App";

export const create = ({ container, lng }) => {
  ReactDOM.render(
    <StoreProvider lng={lng}>
      <App />
    </StoreProvider>,
    container
  );

  return {
    destroy: () => ReactDOM.unmountComponentAtNode(container),
  };
};

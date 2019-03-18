import React from "react";

import Show from "./pages/Show";

// module under test
import App from "./App";

test("to render Show", () => {
  const subject = shallow(<App />).find(Show);
  expect(subject.exists()).toBe(true);
});

test("to match snapshot", () => {
  const subject = shallow(<App />);
  expect(subject).toMatchSnapshot();
});

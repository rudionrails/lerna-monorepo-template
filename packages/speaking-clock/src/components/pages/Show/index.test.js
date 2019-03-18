import React from "react";

// module under test
import Index from "./index";

test("to match snapshot", () => {
  const subject = shallow(<Index />);
  expect(subject).toMatchSnapshot();
});

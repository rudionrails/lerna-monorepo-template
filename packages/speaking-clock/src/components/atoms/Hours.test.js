import React from "react";

// module under test
import Hours from "./Hours";

const props = {
  hours: 13,
  minutes: 13,
};

test("to render hours", () => {
  const subject = shallow(<Hours {...props} />);
  expect(subject.html()).toContain("13 hours");
});

test("to render hours when minutes are zero", () => {
  const subject = shallow(<Hours {...props} minutes={0} />);
  expect(subject.html()).toContain("13");
});

test("to match snapshot", () => {
  const subject = shallow(<Hours {...props} />);
  expect(subject).toMatchSnapshot();
});

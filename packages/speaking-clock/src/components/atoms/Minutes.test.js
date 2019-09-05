import React from "react";

// module under test
import Minutes from "./Minutes";

const minutes = 13;

test("to render minutes", () => {
  const subject = shallow(<Minutes minutes={minutes} />);
  expect(subject.html()).toContain("and 13 minutes");
});

test("to render when minutes are zero", () => {
  const subject = shallow(<Minutes minutes={0} />);
  expect(subject.html()).toContain("o&#x27; clock");
});

test("to match snapshot", () => {
  const subject = shallow(<Minutes minutes={minutes} />);
  expect(subject).toMatchSnapshot();
});

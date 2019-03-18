import React from "react";

// module under test
import Hours from "./Hours";

const props = {
  t: val => val,
  hours: 13,
  minutes: 13,
};

test("to translate hours", () => {
  const t = td.replace(props, "t");

  td.when(t(props.hours)).thenReturn("thirteen");
  td.when(t("{{hours}} hours", { hours: "thirteen" })).thenReturn(
    "mocked thirteen hours"
  );

  const subject = shallow(<Hours {...props} />);
  expect(subject.html()).toContain("mocked thirteen hours");
});

test("to translate hours when minutes are zero", () => {
  const t = td.replace(props, "t");

  td.when(t(props.hours)).thenReturn("just the number");

  const subject = shallow(<Hours {...props} minutes={0} />);
  expect(subject.html()).toContain("just the number");
});

test("to match snapshot", () => {
  const subject = shallow(<Hours {...props} />);
  expect(subject).toMatchSnapshot();
});

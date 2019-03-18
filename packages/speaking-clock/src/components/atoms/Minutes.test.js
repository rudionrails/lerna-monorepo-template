import React from "react";

// module under test
import Minutes from "./Minutes";

const props = {
  t: val => val,
  minutes: 13,
};

test("to translate minutes", () => {
  const t = td.replace(props, "t");

  td.when(t(props.minutes)).thenReturn("thirteen");
  td.when(t("and {{minutes}} minutes", { minutes: "thirteen" })).thenReturn(
    "and mocked thirteen minutes"
  );

  const subject = shallow(<Minutes {...props} />);
  expect(subject.html()).toContain("and mocked thirteen minutes");
});

test("to translate when minutes are zero", () => {
  const t = td.replace(props, "t");

  td.when(t("o' clock")).thenReturn("just full hour");

  const subject = shallow(<Minutes {...props} minutes={0} />);
  expect(subject.html()).toContain("just full hour");
});

test("to match snapshot", () => {
  const subject = shallow(<Minutes {...props} />);
  expect(subject).toMatchSnapshot();
});

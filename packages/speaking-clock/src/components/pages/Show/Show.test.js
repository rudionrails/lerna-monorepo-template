import React from "react";

import Hours from "../../atoms/Hours";
import Minutes from "../../atoms/Minutes";

// module under test
import Show from "./Show";

const hours = 10;
const minutes = 13;
const date = {
  getHours: () => hours,
  getMinutes: () => minutes,
};

let subject;

beforeEach(() => {
  subject = shallow(<Show {...{ date }} />);
});

test("to render Hours", () => {
  const h = subject.find(Hours);

  expect(h.exists()).toBe(true);
  expect(h.props()).toEqual({ hours, minutes });
});

test("to render Minutes", () => {
  const m = subject.find(Minutes);

  expect(m.exists()).toBe(true);
  expect(m.props()).toEqual({ minutes });
});

test("to match snapshot", () => {
  expect(subject).toMatchSnapshot();
});

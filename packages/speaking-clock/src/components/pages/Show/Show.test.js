import React from "react";

import Hours from "../../atoms/Hours";
import Minutes from "../../atoms/Minutes";

// module under test
import Show from "./Show";

const t = val => val;
const hours = 10;
const minutes = 13;
const date = {
  getHours: () => hours,
  getMinutes: () => minutes,
};

let subject;

beforeEach(() => {
  subject = shallow(<Show {...{ t, date }} />);
});

test("to render Hours", () => {
  const h = subject.find(Hours);

  expect(h.exists()).toBe(true);
  expect(h.props()).toEqual({ t, hours, minutes });
});

test("to render Minutes", () => {
  const m = subject.find(Minutes);

  expect(m.exists()).toBe(true);
  expect(m.props()).toEqual({ t, minutes });
});

test("to match snapshot", () => {
  expect(subject).toMatchSnapshot();
});

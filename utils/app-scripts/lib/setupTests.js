// @see https://github.com/airbnb/enzyme
import Enzyme, { shallow, mount, render } from "enzyme";
import Adapter from "enzyme-adapter-react-16";

// Enzyme setup
//
Enzyme.configure({ adapter: new Adapter() });

// Make Enzyme functions available in all test files without importing
global.shallow = shallow;
global.render = render;
global.mount = mount;

// testdouble setup
//
import td from "testdouble";
import testdoubleJest from "testdouble-jest";

// connect td with jest and also expose as global
testdoubleJest(td, jest);
global.td = td;

// fetch setup
//
import "isomorphic-fetch";

// Mock any real fetch request. This will prompt the dev to make
// sure actual requests are properly handled.
global.fetch = (url, options) => {
  console.log("global.fetch", url, options);

  const message = `
  !!! Oops, looks like you tried to fire a real fetch request !!!

  Called fetch with:

    fetch('${url}', ${JSON.stringify(options)})

  Those are not allowed in tests. You may have missed to mock it correctly.
  `;

  // eslint-disable-next-line no-console
  console.error(message);
  return Promise.reject(new Error(message));
};

// beforeEach(() => {
//   // Mock any real fetch request. This will prompt the dev to make
//   // sure actual requests are properly handled.
//   const fetch = td.replace(global, 'fetch');
//
//   td.when(fetch(td.matchers.anything(), td.matchers.anything()), {
//     ignoreExtraArgs: true,
//   }).thenDo((uri, options) => {
//     // eslint-disable-next-line no-console
//     console.error(message);
//     throw new Error(message);
//   });
// });

afterEach(() => {
  td.reset();
});

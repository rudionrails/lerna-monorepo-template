const isDevelopment = process.env.NODE_ENV === "development";
const isProduction = process.env.NODE_ENV === "production";
const isTest = process.env.NODE_ENV === "test";

module.exports = function babelPreset(api) {
  api.assertVersion(7);

  return {
    presets: [
      [
        // Latest stable ECMAScript features
        require("@babel/preset-env").default,
        isTest
          ? {
              targets: {
                node: "current",
              },
            }
          : {
              // We want Create React App to be IE 9 compatible until React itself
              // no longer works with IE 9
              targets: {
                ie: 9,
              },
              // Users cannot override this behavior because this Babel
              // configuration is highly tuned for ES5 support
              ignoreBrowserslistConfig: true,
              // If users import all core-js they're probably not concerned with
              // bundle size. We shouldn't rely on magic to try and shrink it.
              useBuiltIns: false,
              // Do not transform modules to CJS
              modules: false,
              // Exclude transforms that make all code slower
              exclude: ["transform-typeof-symbol"],
            },
      ],
      [
        require("@babel/preset-react").default,
        {
          // Adds component stack to warning messages
          // Adds __self attribute to JSX which React will use for some warnings
          development: isDevelopment || isTest,
          // Will use the native built-in instead of trying to polyfill
          // behavior for any plugins that require one.
          useBuiltIns: true,
        },
      ],
    ].filter(Boolean),

    plugins: [
      // Adds syntax support for import()
      require("@babel/plugin-syntax-dynamic-import").default,
      // Necessary to include regardless of the environment because
      // in practice some other transforms (such as object-rest-spread)
      // don't work without it: https://github.com/babel/babel/issues/7215
      require("@babel/plugin-transform-destructuring").default,
      // class { handleClick = () => { } }
      // Enable loose mode to use assignment instead of defineProperty
      // See discussion in https://github.com/facebook/create-react-app/issues/4263
      [
        require("@babel/plugin-proposal-class-properties").default,
        {
          loose: true,
        },
      ],
      // The following two plugins use Object.assign directly, instead of Babel's
      // extends helper. Note that this assumes `Object.assign` is available.
      // { ...todo, completed: true }
      [
        require("@babel/plugin-proposal-object-rest-spread").default,
        {
          useBuiltIns: true,
        },
      ],
      // Polyfills the runtime needed for async/await, generators, and friends
      // https://babeljs.io/docs/en/babel-plugin-transform-runtime
      [
        require('@babel/plugin-transform-runtime').default,
        {
          corejs: false,
          helpers: false,
          regenerator: true,
          // https://babeljs.io/docs/en/babel-plugin-transform-runtime#useesmodules
          // We should turn this on once the lowest version of Node LTS
          // supports ES Modules.
          useESModules: isDevelopment || isProduction,
        },
      ],
      // Remove PropTypes from production build
      isProduction && [
        require("babel-plugin-transform-react-remove-prop-types").default,
        {
          removeImport: true,
        },
      ],
      // Transform dynamic import to require in test env
      isTest && require("babel-plugin-dynamic-import-node"),
    ].filter(Boolean),
  };
};

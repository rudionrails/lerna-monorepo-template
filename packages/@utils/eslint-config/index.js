const isProduction = process.env.NODE_ENV === "production";

module.exports = {
  // No other higher level config allowed
  root: true,
  // use babel as parser
  parser: "babel-eslint",
  // This set of linter rules is somewhat strict,
  // but it keeps code really consistent.
  extends: [
    "airbnb",
    "plugin:jest/recommended",
    "plugin:react/recommended",
    "plugin:jsx-a11y/recommended",
    "plugin:prettier/recommended",
    "prettier/react",
  ],

  env: {
    browser: true,
    es6: true,
  },

  parserOptions: {
    sourceType: "module",
    ecmaFeatures: {
      jsx: true,
    },
  },

  rules: {
    // Allow debugger during development
    "no-debugger": isProduction ? 2 : 1,
    "no-console": isProduction ? 2 : 1,
    // Allow one-liners to be directly followed by on-liners.
    // Otherwise you need an empty line between.
    "lines-between-class-members": [
      "error",
      "always",
      { exceptAfterSingleLine: true },
    ],
    // allow JSX in .js files
    "react/jsx-filename-extension": [1, { extensions: [".js", ".jsx"] }],
    // No need to specify the display name on components. This is only used for debugging
    // and has no impact when running in production
    "react/display-name": [0],
    // Do not force prop type decparation, only when specified we check if all props are there
    "react/prop-types": [1, { skipUndeclared: true }],
    // Don't require .js extension when importing
    "import/extensions": ["error", "always", { js: "never" }],
    "import/prefer-default-export": 0,
  },

  overrides: [
    {
      files: ["*.test.js", "*.spec.js"],
      env: {
        jest: true,
      },
      globals: {
        // enzyme
        shallow: true,
        render: true,
        mount: true,
        // testdouble
        td: true,
      },
    },
  ],
};

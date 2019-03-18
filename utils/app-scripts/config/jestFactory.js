// module dependencies
const fs = require("fs");
const path = require("path");
// local dependencies
const paths = require("./paths");

module.exports = function jestFactory() {
  const setupFilesAfterEnv = [
    fs.existsSync(paths.appTestSetup)
      ? paths.appTestSetup
      : paths.localTestSetup,
  ];

  return {
    rootDir: paths.app,
    setupFilesAfterEnv,

    // Adds support for Plug'N'Play:
    //  @see https://github.com/yarnpkg/rfcs/pull/101
    resolver: require.resolve("jest-pnp-resolver"),

    // // we want to conveniently resolve files based on the webpack config
    // // @see https://www.npmjs.com/package/jest-webpack-resolver
    // resolver: require.resolve("jest-webpack-resolver"),
    // jestWebpackResolver: {
    //   webpackConfig: require.resolve("./webpackFactory"),
    // },

    collectCoverageFrom: ["src/**/*.{js,jsx}"],
    // coverageThreshold: {
    //   global: {
    //     statements: 98,
    //     branches: 91,
    //     functions: 98,
    //     lines: 98,
    //   },
    // },

    moduleNameMapper: {
      ".*\\.(css|less|styl|scss|sass)$": require.resolve("identity-obj-proxy"),
    },

    transform: {
      "^.+\\.(js|jsx)$": path.resolve(
        paths.local,
        "config/jest/babelTransform.js"
      ),
    },

    // reporters: ["default", "jest-summary-reporter"],
    // setupTestFrameworkScriptFile: "<rootDir>/config/jest/setup.js",
    snapshotSerializers: [require.resolve("enzyme-to-json/serializer")],
  };
};

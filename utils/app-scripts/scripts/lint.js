#!/usr/bin/env node

// Makes the script crash on unhandled rejections
// instead of silently ignoring them.
process.on("unhandledRejection", err => {
  throw err;
});

// set the env to production before anythingh else
process.env.NODE_ENV = "production";
process.env.BABEL_ENV = "production";

// module dependencies
const chalk = require("chalk");
const spawn = require("cross-spawn");

// local dependencies
const paths = require("../config/paths");
const logger = require("../utils/logger");
const { name } = require(paths.appPackageJson);

const appName = chalk.bold(name);
const scriptArgs = process.argv.slice(2);

function lint() {
  logger.clear();
  logger.info(`Linting package ${appName}`);
  logger.notice(chalk.dim(paths.app));

  return new Promise((resolve, reject) => {
    const result = spawn.sync(
      require.resolve("eslint/bin/eslint.js"),
      [
        paths.appSrc,
        "--config",
        require.resolve("@utils/eslint-config"),
        "--format",
        require.resolve("eslint-formatter-pretty"),
        ...scriptArgs,
      ].filter(Boolean),
      {
        stdio: "inherit",
      }
    );

    if (result.status) {
      reject();
    } else {
      resolve();
    }
  });
}

lint()
  .then(() => {
    logger.success(`${appName} is clean.`);
  })
  .catch(err => {
    logger.error(`${appName} returned linter offenses. Please fix.`);
    process.exit(1);
  })
  .finally(() => {
    logger.log();
  });

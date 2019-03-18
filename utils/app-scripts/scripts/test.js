#!/usr/bin/env node

// Makes the script crash on unhandled rejections
// instead of silently ignoring them.
process.on("unhandledRejection", err => {
  throw err;
});

// set the env to production before anythingh else
process.env.BABEL_ENV = "test";
process.env.NODE_ENV = "test";

// module dependencies
const chalk = require("chalk");
const jest = require("jest");
const spawn = require("cross-spawn");
// local dependencies
const jestFactory = require("../config/jestFactory");
const paths = require("../config/paths");
const logger = require("../utils/logger");
const { name } = require(paths.appPackageJson);

const appName = chalk.bold(name);

logger.info(`Testing package ${appName}`);
logger.notice(chalk.dim(paths.app));

const argv = process.argv.slice(2);
argv.push("--config", JSON.stringify(jestFactory()));

jest.run(argv);

#!/usr/bin/env node

// Makes the script crash on unhandled rejections
// instead of silently ignoring them.
process.on("unhandledRejection", err => {
  throw err;
});

// set the env to production before anythingh else
process.env.NODE_ENV = "production";
process.env.BABEL_ENV = "production";

// system dependencies
const path = require("path");
const webpack = require("webpack");
// module dependencies
const fs = require("fs-extra");
const chalk = require("chalk");
const filesize = require("filesize");
// local dependencies
const logger = require("../utils/logger");
const webpackFactory = require("../config/webpackFactory");
const paths = require("../config/paths");
const { name } = require(paths.appPackageJson);

const appName = chalk.bold(name);
const scriptArgs = process.argv.slice(2);

const assetSizes = assets =>
  assets.map(
    ({ size, name }) => `${filesize(size).padStart(16)} ${chalk.dim(name)}`
  );

// removes the dist directory before building files
const isClean = scriptArgs.includes("--clean");
// pass this when running inside Jenkins, etc
const isCI = scriptArgs.includes("--ci");

function build() {
  logger.clear();
  logger.info(`Building package ${appName}`);
  logger.notice(chalk.dim(paths.app));

  const webpackConfig = webpackFactory();
  const compiler = webpack(webpackConfig);

  if (!isCI) {
    new webpack.ProgressPlugin().apply(compiler);
  }

  if (isClean || isCI) {
    fs.emptyDirSync(paths.appDist, err => {
      if (err) return console.error(err);
    });
  }

  return new Promise((resolve, reject) =>
    compiler.run((err, stats) => {
      const { errors, warnings } = stats.toJson({
        all: false,
        warnings: true,
        errors: true,
      });

      if (err) {
        reject(new Error(err));
      } else if (errors.length) {
        reject(new Error(errors.join("\n")));
      } else {
        resolve({ stats, warnings });
      }
    })
  );
}

build()
  .then(({ stats, warnings }) => {
    const json = stats.toJson({ all: false, assets: true });
    const assets = json.assets
      .filter(a => a.emitted)
      .sort((a, b) => b.size - a.size);

    if (warnings.length) {
      logger.warn(`${appName} Compiled successfully, but with warnings.\n`);
      logger.log(warnings.join("\n"));
    } else {
      logger.success(`${appName} Compiled successfully.`);
    }

    if (assets.length) {
      logger.info("Emitted files:\n");
      logger.log(assetSizes(assets).join("\n"));
    }
  })
  .catch(err => {
    logger.error(`${appName} Failed to compile.\n`);
    logger.log(err);

    process.exit(1);
  })
  .finally(() => {
    logger.log();
  });

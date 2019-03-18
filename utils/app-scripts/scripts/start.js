#!/usr/bin/env node

// Makes the script crash on unhandled rejections
// instead of silently ignoring them.
process.on("unhandledRejection", err => {
  throw err;
});

// set the env to production before anythingh else
process.env.NODE_ENV = "development";
process.env.BABEL_ENV = "development";

// module dependencies
const webpack = require("webpack");
const webpackDevServer = require("webpack-dev-server");
const chalk = require("chalk");

// local dependencies
const paths = require("../config/paths");
const webpackFactory = require("../config/webpackFactory");
const webpackDevServerFactory = require("../config/webpackDevServerFactory");
const logger = require("../utils/logger");
const detectPort = require("../utils/detectPort");
const { name } = require(paths.appPackageJson);

const appName = chalk.bold(name);

function configure({ host, port }) {
  // we add this to the `process.env`, so that the app always has an
  // absolute PUBLIC_URL based on the given PUBLIC_DOMAIN. For production,
  // this is then provided by the Jenkinsfile or env (otherwise).
  if (!process.env.PUBLIC_DOMAIN) {
    process.env.PUBLIC_DOMAIN = `http://${host}:${port}`;
  }

  const webpackConfig = webpackFactory({ port, host });
  const webpackDevServerConfig = webpackDevServerFactory({ port, host });

  // adds HMR to the webpackConfig's entry
  // @see https://webpack.js.org/guides/hot-module-replacement/
  webpackDevServer.addDevServerEntrypoints(
    webpackConfig,
    webpackDevServerConfig
  );

  webpackConfig.plugins.push(
    // Enable HMR for webpack dev server
    new webpack.HotModuleReplacementPlugin()
  );

  const compiler = webpack(webpackConfig);
  const server = new webpackDevServer(compiler, webpackDevServerConfig);

  return Promise.resolve({ server, port, host });
}

function start({ server, host, port }) {
  logger.clear();
  logger.info(`Starting package ${appName}`);
  logger.notice(chalk.dim(paths.app));

  // Launch WebpackDevServer
  server.listen(port, host, err => {
    if (err) {
      return logger.error(err);
    }
  });

  // handle signals
  ["SIGINT", "SIGTERM"].forEach(sig => {
    process.on(sig, () => {
      server.close();
      process.exit();
    });
  });
}

detectPort(3000, "localhost")
  .then(configure)
  .then(start)
  .catch(error => logger.error(error.message || error));

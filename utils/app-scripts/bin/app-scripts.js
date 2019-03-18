#!/usr/bin/env node

// Makes the script crash on unhandled rejections instead of silently
// ignoring them. In the future, promise rejections that are not handled will
// terminate the Node.js process with a non-zero exit code.
process.on("unhandledRejection", err => {
  throw err;
});

// system dependencies
const fs = require("fs");
const path = require("path");

// module dependencies
const chalk = require("chalk");
const spawn = require("cross-spawn");

// local dependencies
const logger = require("../utils/logger");

const availableScripts = fs
  .readdirSync(path.resolve(__dirname, "../scripts"))
  .map(f => path.basename(f, path.extname(f)));
const [scriptName, ...scriptArgs] = process.argv.slice(2);

if (availableScripts.includes(scriptName)) {
  const result = spawn.sync(
    require.resolve(`../scripts/${scriptName}.js`),
    scriptArgs,
    { stdio: "inherit" }
  );

  if (result.signal) {
    logger.error(
      `The process exited too early. Someone has called ${result.signal}.`
    );

    process.exit(1);
  }

  process.exit(result.status);
} else {
  logger.error(`Unknown script '${scriptName}'\n`);
  logger.notice("The following scripts are available:\n");
  logger.log(chalk.dim(availableScripts.map(s => s.padStart(10)).join("\n")));
  logger.log();
}

const chalk = require("chalk");
const { pipe } = require("ramda");

const COLORS = {
  success: pipe(
    chalk.bgGreen,
    chalk.black
  ),
  notice: pipe(
    chalk.bgWhite,
    chalk.black
  ),
  info: pipe(
    chalk.bgBlue,
    chalk.black
  ),
  warn: pipe(
    chalk.bgYellow,
    chalk.black
  ),
  error: pipe(
    chalk.bgRed,
    chalk.black
  ),
};

const isInteractive = process.stdout.isTTY;
const format = severity => (...messages) => {
  const level = severity.toUpperCase().padStart(7);

  console.log(
    isInteractive
      ? COLORS[severity](` ${level} `)
      : `${new Date().toISOString()} [${level}]`,
    ...messages
  );
};

const logger = Object.keys(COLORS).reduce(
  (acc, severity) => Object.assign({}, acc, { [severity]: format(severity) }),
  { log: console.log, clear: console.clear }
);

module.exports = logger;

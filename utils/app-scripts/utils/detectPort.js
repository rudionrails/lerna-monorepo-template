// module dependencies
const detect = require("detect-port");
const inquirer = require("inquirer");

// local dependencies
const logger = require("./logger");

const isInteractive = process.stdout.isTTY;

function askForPort(...messages) {
  logger.clear();

  return inquirer.prompt({
    type: "confirm",
    name: "changePort",
    default: true,
    message: messages.join("\n"),
  });
}

function detectPort(defaultPort, host) {
  const portAlreadyTaken = `Something is already running on port ${defaultPort}.`;
  const noPortChosen = `No alternative to port ${defaultPort} was chosen`;

  return new Promise((resolve, reject) => {
    detect(defaultPort, host).then(
      port => {
        if (port === defaultPort) {
          return resolve({ port, host });
        }

        if (!isInteractive) {
          return reject(new Error(portAlreadyTaken));
        }

        askForPort(
          portAlreadyTaken,
          `\nWould you like to run the app on port ${port} instead?`
        ).then(answer => {
          if (answer.changePort) {
            resolve({ port, host });
          } else {
            reject(new Error(noPortChosen));
          }
        });
      },
      error =>
        reject(
          new Error(
            [
              `Could not find an open port at ${defaultHost}.`,
              `Network error message: ${error.message || error}`,
            ].join("\n")
          )
        )
    );
  });
}

module.exports = detectPort;

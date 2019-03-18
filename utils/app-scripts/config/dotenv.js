// system dependencies
const { execSync } = require("child_process");

// module dependencies
const dotenv = require("@yummy/dotenv");

// local dependencies
const paths = require("./paths");
const { pascalCase, lispCase } = require("../utils/fns");
const { name } = require(paths.appPackageJson);

// get the current git commit hash (short)
const gitRevision = () => {
  const commit =
    // GIT_COMMIT is given by Jenkins. In other cases, we get it ourselves
    process.env.GIT_COMMIT || execSync("git rev-parse HEAD").toString();

  return commit.substr(0, 8);
};

const defaults = {
  // NODE_ENV, what else
  NODE_ENV: process.env.NODE_ENV || "development",
  // Special APP_ variables derived from package.json
  APP_NAME: process.env.APP_NAME || pascalCase(name),
  APP_NAMESPACE: process.env.APP_NAMESPACE || lispCase(name),
  APP_VERSION: process.env.APP_VERSION || gitRevision(),
  // usually the S3 url (provided by Jenkinsfile).
  // it is needed to assemble `PUBLIC_URL` later on
  PUBLIC_BASE_URL: process.env.PUBLIC_BASE_URL || "",
};

module.exports = {
  config: () => dotenv.config({ context: paths.app, defaults }),
};

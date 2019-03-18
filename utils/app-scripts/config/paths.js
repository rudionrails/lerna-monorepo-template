// system dependencies
const fs = require("fs");
const path = require("path");

const localDir = path.resolve(__dirname, "..");
const resolveLocal = (...relativePaths) =>
  path.resolve(localDir, ...relativePaths);

const appDir = fs.realpathSync(process.cwd());
const resolveApp = (...relativePaths) => path.resolve(appDir, ...relativePaths);

const localPaths = {
  local: resolveLocal("."),
  localHtml: resolveLocal("lib/index.html"),
  localTestSetup: resolveLocal("lib/setupTests.js"),
};

const appPaths = {
  app: resolveApp("."),
  appPackageJson: resolveApp("package.json"),
  appSrc: resolveApp("src"),
  appDist: resolveApp("dist"),
  appPublic: resolveApp("public"),
  appIndex: resolveApp("src/index.js"),
  appHtml: resolveApp("src/index.html"),
  appTestSetup: resolveApp("src/setupTests.js"),
};

module.exports = {
  ...appPaths,
  ...localPaths,
};

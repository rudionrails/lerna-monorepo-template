// local dependencies
const paths = require("./paths");

const webpackDevServerFactory = ({ host, port }) => ({
  // serve files from this directory
  contentBase: paths.appPublic,
  // By default files from `contentBase` will not trigger a page reload.
  watchContentBase: true,
  historyApiFallback: true,
  noInfo: true,
  // WebpackDevServer is noisy by default so we set it to quiet and we use
  // FriendlyErrorsWebpackPlugin for that.
  quiet: true,
  stats: "none",
  hot: true,
  clientLogLevel: "none",
  // Shows a full-screen overlay in the browser when there
  // are compiler errors or warnings.
  overlay: {
    warnings: false,
    errors: true,
  },
  // allow CORS requests
  headers: {
    "Access-Control-Allow-Headers": "*",
    "Access-Control-Allow-Origin": "*",
  },

  host,
  port,
});

module.exports = webpackDevServerFactory;

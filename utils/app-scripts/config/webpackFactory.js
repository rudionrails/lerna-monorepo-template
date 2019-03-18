// system dependencies
const fs = require("fs");
const path = require("path");

// module dependencies
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const InterpolateHtmlPlugin = require("interpolate-html-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const ManifestPlugin = require("webpack-manifest-plugin");
const FriendlyErrorsWebpackPlugin = require("friendly-errors-webpack-plugin");

// local dependencies
const paths = require("./paths");
const dotenv = require("./dotenv");

const { NODE_ENV, PUBLIC_BASE_URL, ...env } = dotenv.config();
// only .env-variables with APP_ are allowed in the client to prevent
// accidental exposure of private data
const CLIENT_ENV_PREFIX = /^APP_.+$/;
// env helpers
const isProduction = NODE_ENV === "production";
const isDevelopment = NODE_ENV === "development";

function webpackFactory({ host, port } = {}) {
  const publicPath = env.APP_VERSION;
  const publicUrl = isProduction
    ? `${PUBLIC_BASE_URL}/${publicPath}/`
    : `http://${host}:${port}/`;
  const publicHtml = fs.existsSync(paths.indexHtml)
    ? paths.indexHtml
    : paths.localHtml;

  const clientEnv = Object.entries(env).reduce(
    (acc, [key, value]) =>
      CLIENT_ENV_PREFIX.test(key) ? { ...acc, [key]: value } : acc,
    {
      PUBLIC_URL: publicUrl,
      NODE_ENV,
    }
  );

  return {
    // set the correcy webpack mode based on the NODE_ENV
    mode: isProduction ? "production" : "development",
    // Don't attempt to continue if there are any errors in production
    bail: isProduction,
    // We don't generate sourcemaps in production
    devtool: isProduction ? false : "cheap-module-eval-source-map",
    // The entry is the index.js
    entry: paths.appIndex,
    // The output is configured to produce a UMD build, so we can use the widget
    // conveniently inside the main application.
    output: {
      libraryTarget: "umd",
      library: env.APP_NAME,
      filename: "[name].js",
      path: isProduction ? `${paths.appDist}/${publicPath}` : undefined,
      publicPath: publicUrl,
    },

    module: {
      rules: [
        {
          test: /\.(js|mjs|jsx)$/,
          include: paths.appSrc,
          enforce: "pre",
          use: [
            {
              loader: require.resolve("eslint-loader"),
              options: {
                formatter: require.resolve("eslint-formatter-pretty"),
                eslintPath: require.resolve("eslint"),
                baseConfig: {
                  extends: [require.resolve("@utils/eslint-config")],
                },
                // ignore: false,
                useEslintrc: false,
                // failOnError: isProduction,
              },
            },
          ],
        },
        {
          // "oneOf" will traverse all following loaders until one will
          // match the requirements.
          oneOf: [
            // Process application JS with Babel
            {
              test: /\.(js|mjs|jsx)$/,
              include: paths.appSrc,
              loader: require.resolve("babel-loader"),
              options: {
                babelrc: false,
                configFile: false,
                presets: [require.resolve("@utils/babel-preset")],

                // This is a feature of `babel-loader` for webpack (not Babel itself).
                // It enables caching results in ./node_modules/.cache/babel-loader/
                // directory for faster rebuilds.
                cacheDirectory: true,
                cacheCompression: isProduction,
                compact: isProduction,
              },
            },
            // Handle CSS files with postcss and have them behave
            // as CSS Modules https://github.com/css-modules/css-modules).
            {
              test: /\.css$/,
              include: paths.appSrc,
              use: [
                isProduction
                  ? MiniCssExtractPlugin.loader
                  : require.resolve("style-loader"),
                {
                  loader: require.resolve("css-loader"),
                  options: {
                    importLoaders: 1,
                    modules: true,
                    sourceMap: isDevelopment,
                    localIdentName: isDevelopment
                      ? "[path][name]__[local]--[hash:base64:5]"
                      : "[hash:base64:5]",
                  },
                },
                {
                  loader: require.resolve("postcss-loader"),
                  options: {
                    ident: "postcss",
                    plugins: () => [
                      require("postcss-preset-env")(),
                      require("postcss-reporter"),
                    ],
                    sourceMap: isDevelopment,
                  },
                },
              ],
            },
          ],
        },
      ],
    },

    plugins: [
      // Generate a manifest file which contains a mapping of all asset filenames
      // to their corresponding output file so that tools can pick it up without
      // having to parse `index.html`.
      new ManifestPlugin({
        fileName: "asset-manifest.json",
      }),
      // makes .env-variables available to the application as process.env
      new webpack.DefinePlugin({
        "process.env": JSON.stringify(clientEnv),
      }),
      // Moment.js is an extremely popular library that bundles large locale files
      // by default due to how Webpack interprets its code. This is a practical
      // solution that requires the user to opt into importing specific locales.
      // https://github.com/jmblog/how-to-optimize-momentjs-with-webpack
      // You can remove this if you don't use Moment.js:
      new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
      // Generates an `index.html` file with the <script> injected.
      isDevelopment &&
        new HtmlWebpackPlugin({
          template: publicHtml,
          inject: true,
        }),
      // Allows the use of .env-variables in the html
      // as %VAR_NAME% (must come after HtmlWebpackPlugin).
      isDevelopment && new InterpolateHtmlPlugin(env),
      // Combines all css assets into consolidated file(s).
      isProduction &&
        new MiniCssExtractPlugin({
          filename: "[name].css",
        }),
      // Minifies CSS assets
      isProduction && new OptimizeCSSAssetsPlugin(),
      // move everything from the public foder
      isProduction &&
        new CopyWebpackPlugin([
          {
            context: paths.appPublic,
            from: "**/*",
          },
        ]),
      // Helps to print out errors in a nicer way than
      // the default webpack-dev-server style
      isDevelopment &&
        new FriendlyErrorsWebpackPlugin({
          compilationSuccessInfo: {
            messages: [`Project is running at ${publicUrl}`],
            notes: ["Run linter with: yarn lint", "Run tests with: yarn test"],
          },
        }),
    ].filter(Boolean),
  };
}

module.exports = webpackFactory;

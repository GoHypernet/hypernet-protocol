/* eslint-disable @typescript-eslint/no-var-requires */
const path = require("path");

const HtmlWebpackPlugin = require("html-webpack-plugin");
const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin");
const webpack = require("webpack");

const configFilePath = require.resolve("./tsconfig.json");

/** @type import('webpack').Configuration */
module.exports = {
  context: __dirname,
  mode: process.env.__BUILD_ENV__ === "PROD" ? "production" : "development",
  entry: path.join(__dirname, "src/index.tsx"),
  output: {
    filename: "index.js",
    path: path.join(__dirname, "/dist/bundle"),
  },
  devServer: {
    contentBase: path.join(__dirname, "src"),
    historyApiFallback: true,
    liveReload: true,
    compress: true,
    port: 9002,
    writeToDisk: true,
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: "ts-loader",
        exclude: /node_modules/,
        options: {
          projectReferences: true,
          configFile: configFilePath,
          compilerOptions: {
            // build still catches these. avoid them during bunding time for a nicer dev experience.
            noUnusedLocals: false,
            noUnusedParameters: false,
          },
        },
      },
      {
        enforce: "pre",
        test: /\.html$/,
        loader: "html-loader",
      },
      // {
      //   enforce: "pre",
      //   test: /\.js$/,
      //   loader: "source-map-loader"
      // },
      {
        test: /\.(s[ac]ss|css)$/i,
        use: [
          "style-loader",
          "css-loader",
          {
            loader: "sass-loader",
            options: {
              sassOptions: {
                includePaths: [path.resolve(__dirname, "node_modules")],
              },
            },
          },
        ],
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        use: [
          {
            loader: "file-loader",
          },
        ],
      },
      {
        test: /\.ttf$/,
        use: ["file-loader"],
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js", ".html"],
    plugins: [new TsconfigPathsPlugin({ configFile: configFilePath })],
    fallback: {
      crypto: require.resolve("crypto-browserify"),
      path: require.resolve("path-browserify"),
      stream: require.resolve("stream-browserify"),
      http: require.resolve("stream-http"),
      https: require.resolve("https-browserify"),
      os: require.resolve("os-browserify/browser"),
      zlib: require.resolve("browserify-zlib"),
      net: false,
      tls: false,
      fs: false,
      assert: false,
    },
    alias: {
      "@web-integration": path.resolve(__dirname, "../web-integration/src"),
      "@web-ui": path.resolve(__dirname, "../web-ui/src"),
      "@objects": path.resolve(__dirname, "../objects/src"),
      "@utils": path.resolve(__dirname, "../utils/src"),
      "@interfaces": path.resolve(__dirname, "../hypernet-core/src/interfaces"),
      "@implementations": path.resolve(
        __dirname,
        "../hypernet-core/src/implementations",
      ),
    },
  },
  devtool:
    process.env.__BUILD_ENV__ === "PROD" ? "source-map" : "eval-source-map",
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, "src/index.html"),
      favicon: "src/favicon.png",
    }),
    //new CleanWebpackPlugin({ dangerouslyAllowCleanPatternsOutsideProject: false }),
    new webpack.ProvidePlugin({
      Buffer: ["buffer", "Buffer"],
      process: "process/browser",
    }),
    new webpack.DefinePlugin({
      __CORE_IFRAME_SOURCE__: JSON.stringify(
        process.env.__CORE_IFRAME_SOURCE__,
      ),
      __GOVERNANCE_CHAIN_ID__: JSON.stringify(
        process.env.__GOVERNANCE_CHAIN_ID__,
      ),
      __BUILD_ENV__: JSON.stringify(process.env.__BUILD_ENV__),
    }),
  ],
};

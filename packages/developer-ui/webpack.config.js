const webpack = require('webpack');
const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin");

const configFile = path.resolve(__dirname, "./tsconfig.json");

module.exports = {
  context: path.resolve(__dirname),
  entry: path.join(__dirname, "src/index.ts"),
  output: {
    filename: "index.js",
    path: path.join(__dirname, "/dist"),
  },
  mode: "development",
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: "ts-loader",
        exclude: /node_modules/,
        options: {
          configFile,
          projectReferences: true,
        },
      },
      {
        enforce: "pre",
        test: /\.html$/,
        loader: "html-loader",
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.(png|jpe?g|gif)$/i,
        loader: "file-loader",
        options: {
          name: "[path][name].[ext]",
        },
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js", ".html"],
    plugins: [new TsconfigPathsPlugin({})],
    alias: {
      // These are copied from other packages, because for local compilation
      // we are actually compiling hypernet-core and other mapped packages
      "@interfaces": path.resolve(__dirname, "../hypernet-core/src/interfaces"),
      "@implementations": path.resolve(__dirname, "../hypernet-core/src/implementations"),
      "@mock": path.resolve(__dirname, "../hypernet-core/src/tests/mock"),
      "@tests": path.resolve(__dirname, "../hypernet-core/src/tests"),
      "@web-integration": path.resolve(__dirname, "../web-integration/src"),
    },
    fallback: {
      "crypto": require.resolve("crypto-browserify"),
      "path": require.resolve("path-browserify"),
      "stream": require.resolve("stream-browserify"),
      "http": require.resolve("stream-http"),
      "https": require.resolve("https-browserify"),
      "os": require.resolve("os-browserify/browser"),
      "Buffer": require.resolve("buffer"),
      "net": false,
      "tls": false,
      "fs": false
    }
  },
  devtool: "inline-source-map",
  devServer: {
    contentBase: path.join(__dirname, "src"),
    liveReload: true,
    compress: true,
    publicPath: "/",
    port: 8080,
  },
  plugins: [new CleanWebpackPlugin(),
    new webpack.ProvidePlugin({
      Buffer: ['buffer', 'Buffer'],
      process: 'process/browser',
    })]
};

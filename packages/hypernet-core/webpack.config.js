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
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js", ".html"],
    plugins: [new TsconfigPathsPlugin({})],
    alias: {
      // These are copied from other packages, because for local compilation
      // we are actually compiling hypernet-core and other mapped packages
      "@interfaces": path.resolve(__dirname, ".src/interfaces"),
      "@implementations": path.resolve(__dirname, ".src/implementations"),
      "@mock": path.resolve(__dirname, ".src/tests/mock"),
      "@tests": path.resolve(__dirname, ".src/tests"),
      "@web-integration": path.resolve(__dirname, "../web-integration/src"),
    },
  },
  devtool: "inline-source-map",
  devServer: {
    contentBase: path.join(__dirname, "src"),
    liveReload: true,
    compress: true,
    publicPath: "/",
    port: 8080,
  },
  plugins: [new CleanWebpackPlugin()],
  node: {
    net: "empty",
    tls: "empty",
    fs: "empty",
  },
};

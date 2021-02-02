const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin");
const configFile = path.resolve(__dirname, "./tsconfig.json");

module.exports = {
  mode: "development",
  entry: {
    app: path.join(__dirname, "src", "index.ts"),
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: "ts-loader",
        exclude: "/node_modules/",
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
      "@interfaces": path.resolve(__dirname, "../hypernet-core/src/interfaces"),
      "@implementations": path.resolve(__dirname, "../hypernet-core/src/implementations"),
      "@mock": path.resolve(__dirname, "../hypernet-core/src/tests/mock"),
      "@tests": path.resolve(__dirname, "../hypernet-core/src/tests"),
      "@web-integration": path.resolve(__dirname, "./src"),
    },
  },
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "dist"),
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, "index.html"),
    }),
    new CleanWebpackPlugin(),
  ],
  devServer: {
    contentBase: path.join(__dirname, "src"),
    liveReload: true,
    compress: true,
    publicPath: "/",
    port: 5001,
  },
  node: {
    net: "empty",
    tls: "empty",
    fs: "empty",
  },
};

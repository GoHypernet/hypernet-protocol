const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

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
      },
      {
        enforce: "pre",
        test: /\.html$/,
        exclude: path.join(__dirname, "wallet_dist/index.html"),
        loader: "html-loader",
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js", ".html"],
    plugins: [new TsconfigPathsPlugin({})],
    alias: {
      // These are copied from hypernet-core, because for local compilation
      // we are actually compiling hypernet-core
      "@interfaces": path.resolve(__dirname, "../hypernet-core/src/interfaces"),
      "@implementations": path.resolve(__dirname, "../hypernet-core/src/implementations"),
    },
  },
  devtool: "inline-source-map",
  devServer: {
    contentBase: path.join(__dirname, "src"),
    liveReload: true,
    compress: true,
    publicPath: "/",
    port: 80,
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      filename: "xstatewallet/index.html",
      template: "wallet_dist/index.html",
    }),
  ],
};

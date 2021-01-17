const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  mode: "none",
  entry: {
    app: path.join(__dirname, "src", "index.tsx"),
  },
  target: "web",
  resolve: {
    extensions: [".tsx", ".ts", ".js", ".html"],
    alias: {
      // These are copied from hypernet-core, because for local compilation
      // we are actually compiling hypernet-core
      "@interfaces": path.resolve(__dirname, "../hypernet-core/src/interfaces"),
      "@implementations": path.resolve(__dirname, "../hypernet-core/src/implementations"),
    },
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: "/node_modules/",
      },
    ],
  },
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "dist"),
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, "index.html"),
    }),
  ],
  devServer: {
    contentBase: path.join(__dirname, "src"),
    liveReload: true,
    compress: true,
    publicPath: "/",
    port: 5001,
  },
};

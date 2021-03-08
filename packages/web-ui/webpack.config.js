const path = require("path");
const rootWebpackConfig = require("../../webpack.config");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  ...rootWebpackConfig,
  entry: path.join(__dirname, "src/index.ts"),
  output: {
    filename: "index.js",
    path: path.join(__dirname, "/dist/bundle"),
  },
  plugins: [new HtmlWebpackPlugin({})],
};

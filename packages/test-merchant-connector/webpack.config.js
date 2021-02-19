const path = require("path");
const rootWebpackConfig = require('../../webpack.config');

module.exports = {
  ...rootWebpackConfig,
  entry: path.join(__dirname, "src/index.ts"),
  output: {
    filename: "index.js",
    path: path.join(__dirname, "/dist/connector-bundle"),
  }
};

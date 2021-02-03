const path = require("path");
const rootWebpackConfig = require('../../webpack.config');

module.exports = {
  ...rootWebpackConfig,
  entry: path.join(__dirname, "src/index.tsx"),
  output: {
    filename: "index.js",
    path: path.join(__dirname, "/dist/bundle"),
  },  
  devServer: {
    contentBase: path.join(__dirname, "src"),
    port: 9000,
    watchContentBase: true,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE< PATCH, OPTIONS",
      "Access-Control-Allow-Headers": "X-Requested-With, content-type, Authorization",
    },
    historyApiFallback: true,
  },
};

const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin");

const configFile = path.resolve(__dirname, "./tsconfig.json");

module.exports = {
  entry: path.join(__dirname, "src/index.tsx"),
  output: {
    filename: "index.js",
    path: path.join(__dirname, "/dist"),
  },
  mode: "development",
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        loader: "ts-loader",
        options: {
          configFile,
          projectReferences: true,
        },
      },
      { enforce: "pre", test: /\.js$/, loader: "source-map-loader" },
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
        test: /\.(gif|png|jpe?g|svg)/,
        use: [
          "url-loader",
          {
            loader: "image-webpack-loader",
            options: {
              disable: false,
            },
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
    alias: {
      // These are copied from hypernet-core, because for local compilation
      // we are actually compiling hypernet-core
      "@interfaces": path.resolve(__dirname, "../hypernet-core/src/interfaces"),
      "@implementations": path.resolve(__dirname, "../hypernet-core/src/implementations"),
      "@mock": path.resolve(__dirname, "../hypernet-core/src/tests/mock"),
      "@tests": path.resolve(__dirname, "../hypernet-core/src/tests"),
      react: path.resolve(__dirname, "../../node_modules/react"),
    },
    plugins: [new TsconfigPathsPlugin({})],
  },
  devtool: "eval",
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
  plugins: [new CleanWebpackPlugin()],
  node: {
    net: "empty",
    tls: "empty",
    fs: "empty",
  },
};

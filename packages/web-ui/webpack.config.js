const path = require("path");
const HWP = require("html-webpack-plugin");

module.exports = {
  mode: "production",

  // Enable sourcemaps for debugging webpack's output.
  devtool: "source-map",

  resolve: {
    extensions: [".ts", ".tsx", ".js"],
    alias: {
      // These are copied from other packages, because for local compilation
      // we are actually compiling hypernet-core and other mapped packages
      "@interfaces": path.resolve(__dirname, "../hypernet-core/src/interfaces"),
      "@implementations": path.resolve(__dirname, "../hypernet-core/src/implementations"),
      "@mock": path.resolve(__dirname, "../hypernet-core/src/tests/mock"),
      "@tests": path.resolve(__dirname, "../hypernet-core/src/tests"),
      "@web-integration": path.resolve(__dirname, "../web-integration/src"),
    },
  },

  module: {
    rules: [
      {
        test: /\.ts(x?)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "ts-loader",
          },
        ],
      },
      // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
      {
        enforce: "pre",
        test: /\.js$/,
        loader: "source-map-loader",
      },
    ],
  },
  plugins: [
    new HWP({
      template: path.resolve(__dirname, "index.html"),
      filename: "index.html",
      inject: "body",
    }),
  ],
};

/* eslint-disable @typescript-eslint/no-var-requires */
const path = require("path");

const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin");
const webpack = require("webpack");

const configFilePath = require.resolve("./tsconfig.json");

/** @type import('webpack').Configuration */
module.exports = {
  context: __dirname,
  mode: "development",
  entry: path.join(__dirname, "src/index.tsx"),
  output: {
    filename: "index.js",
    path: path.join(__dirname, "/dist/bundle"),
  },
  devServer: {
    contentBase: path.join(__dirname, "src"),
    liveReload: true,
    compress: true,
    publicPath: "/",
    port: 9006,
    writeToDisk: true,
    watchContentBase: true,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE< PATCH, OPTIONS",
      "Access-Control-Allow-Headers":
        "X-Requested-With, content-type, Authorization",
    },
    historyApiFallback: true,
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: "ts-loader",
        exclude: /node_modules/,
        options: {
          projectReferences: true,
          configFile: configFilePath,
          compilerOptions: {
            // build still catches these. avoid them during bunding time for a nicer dev experience.
            noUnusedLocals: false,
            noUnusedParameters: false,
          },
        },
      },
      {
        enforce: "pre",
        test: /\.html$/,
        loader: "html-loader",
      },
      // {
      //   enforce: "pre",
      //   test: /\.js$/,
      //   loader: "source-map-loader"
      // },
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
        test: /\.(png|jpe?g|gif)$/i,
        loader: "file-loader",
        options: {
          name: "[path][name].[ext]",
        },
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
    plugins: [new TsconfigPathsPlugin({ configFile: configFilePath })],
    fallback: {
      crypto: require.resolve("crypto-browserify"),
      path: require.resolve("path-browserify"),
      stream: require.resolve("stream-browserify"),
      http: require.resolve("stream-http"),
      https: require.resolve("https-browserify"),
      os: require.resolve("os-browserify/browser"),
      zlib: require.resolve("browserify-zlib"),
      net: false,
      tls: false,
      fs: false,
      assert: false,
    },
    alias: {
      "@web-integration": path.resolve(__dirname, "../web-integration/src"),
      "@web-ui": path.resolve(__dirname, "../web-ui/src"),
      "@objects": path.resolve(__dirname, "../objects/src"),
      "@utils": path.resolve(__dirname, "../utils/src"),
      "@interfaces": path.resolve(__dirname, "../hypernet-core/src/interfaces"),
      "@implementations": path.resolve(
        __dirname,
        "../hypernet-core/src/implementations",
      ),
    },
  },
  // TODO: this devtool setup is for development it makes wepback a bit faster, this setup should be different for production
  devtool: "eval-source-map",
  plugins: [
    new HtmlWebpackPlugin({}),
    //new CleanWebpackPlugin({ dangerouslyAllowCleanPatternsOutsideProject: false }),
    new webpack.ProvidePlugin({
      Buffer: ["buffer", "Buffer"],
      process: "process/browser",
    }),
  ],
};

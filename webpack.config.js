const webpack = require('webpack');
const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin");

const configFilePath = require.resolve("./tsconfig.json");

/** @type import('webpack').Configuration */
module.exports = {
  context: __dirname,
  mode: "development",
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        exclude: /node_modules/,
        options: {
          projectReferences: true,
          configFile: configFilePath,
          allowTsInNodeModules: true,
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
        loader: 'file-loader',
        options: {
          name: '[path][name].[ext]',
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
    plugins: [
      new TsconfigPathsPlugin({ configFile: configFilePath })
    ],
    fallback: {
      "crypto": require.resolve("crypto-browserify"),
      "path": require.resolve("path-browserify"),
      "stream": require.resolve("stream-browserify"),
      "http": require.resolve("stream-http"),
      "https": require.resolve("https-browserify"),
      "os": require.resolve("os-browserify/browser"),
      "zlib": require.resolve("browserify-zlib"),
      "net": false,
      "tls": false,
      "fs": false
    }
  },
  devtool: "inline-source-map",
  plugins: [
    //new CleanWebpackPlugin({ dangerouslyAllowCleanPatternsOutsideProject: false }),
    new webpack.ProvidePlugin({
      Buffer: ['buffer', 'Buffer'],
      process: 'process/browser',
    })
  ]
};
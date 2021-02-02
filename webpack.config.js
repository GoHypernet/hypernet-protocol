const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin");

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
          configFile: path.resolve(__dirname, "./tsconfig.json"),
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
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.(png|jpe?g|gif)$/i,
        loader: 'file-loader',
        options: {
            name: '[path][name].[ext]',
        },
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js", ".html"],
    plugins: [new TsconfigPathsPlugin({configFile: path.resolve(__dirname, "./packages/hypernet-core/src/tsconfig.json")})],
    fallback: {
      "crypto": require.resolve("crypto-browserify"),
      "path": require.resolve("path-browserify"),
      "stream": require.resolve("stream-browserify"),
      "http": require.resolve("stream-http"),
      "https": require.resolve("https-browserify"),
      "os": require.resolve("os-browserify/browser"),
      "net": false,
      "tls": false,
      "fs": false
    }
  },
  devtool: "inline-source-map",
  plugins: [
    new CleanWebpackPlugin(),
  ]
};
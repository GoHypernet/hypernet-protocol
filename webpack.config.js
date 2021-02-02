const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin");

module.exports = {
  context: __dirname,
  mode: "development",
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        options: {
          projectReferences: true,
          configFile: require.resolve('./tsconfig.json'),
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
    plugins: [new TsconfigPathsPlugin({})],
    alias: {
      // These are copied from hypernet-core, because for local compilation
      // we are actually compiling hypernet-core
      "@interfaces": path.resolve(__dirname, "../../packages/hypernet-core/src/interfaces"),
      "@implementations": path.resolve(__dirname, "../../packages/hypernet-core/src/implementations"),
      "@mock": path.resolve(__dirname, "../../packages/hypernet-core/src/tests/mock"),
      "@tests": path.resolve(__dirname, "../../packages/hypernet-core/src/tests"),
    },
    fallback: {
      "crypto": require.resolve("crypto-browserify"),
      "path": require.resolve("path-browserify"),
      "stream": require.resolve("stream-browserify"),
      "http": require.resolve("stream-http"),
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
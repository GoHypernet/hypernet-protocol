/* eslint-disable @typescript-eslint/no-var-requires */
const path = require("path");

const HtmlWebpackPlugin = require("html-webpack-plugin");
const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin");
const webpack = require("webpack");

const configFilePath = require.resolve("./tsconfig.json");

process.env.__IFRAME_SOURCE__ = "http://localhost:5000";
process.env.__ROUTER_PUBLIC_IDENTIFIER__ =
  "vector8AXWmo3dFpK1drnjeWPyi9KTy9Fy3SkCydWx8waQrxhnW4KPmR";
process.env.__CHAIN_ID__ = "1337";
process.env.__CHAIN_PROVIDERS__ = '{"1337": "http://localhost:8545"}';
process.env.__CHAIN_ADDRESSES__ =
  '{ \
  "1337": { \
    "channelFactoryAddress": "0xF12b5dd4EAD5F743C6BaA640B0216200e89B60Da", \
    "transferRegistryAddress": "0x8f0483125FCb9aaAEFA9209D8E9d7b9C8B9Fb90F", \
    "hypertokenAddress": "0x9FBDa871d559710256a2502A2517b794B482Db40", \
    "messageTransferAddress": "0xFB88dE099e13c3ED21F80a7a1E49f8CAEcF10df6", \
    "insuranceTransferAddress": "0x30753E4A8aad7F8597332E813735Def5dD395028", \
    "parameterizedTransferAddress": "0x2C2B9C9a4a25e24B174f26114e8926a9f2128FE4", \
    "gatewayRegistryAddress": "0xf204a4Ef082f5c04bB89F7D5E6568B796096735a" \
  } \
}';
process.env.__NATS_URL__ = "ws://localhost:4221";
process.env.__AUTH_URL__ = "http://localhost:5040";
//process.env.__INFURA_ID__ = "1369";
process.env.__DEFAULT_CHAIN_ID__ = "1337";
process.env.__VALIDATOR_IFRAME_URL__ = "http://localhost:5005";
process.env.__CERAMIC_NODE_URL__ = "https://ceramic-clay.3boxlabs.com";
process.env.__HYPERTOKEN_ADDRESS__ =
  "0x9FBDa871d559710256a2502A2517b794B482Db40";
process.env.__DEBUG__ = true;

/* process.env.__IFRAME_SOURCE__ = "http://localhost:5000";
process.env.__ROUTER_PUBLIC_IDENTIFIER__ =
  "vector8AXWmo3dFpK1drnjeWPyi9KTy9Fy3SkCydWx8waQrxhnW4KPmR";
process.env.__CHAIN_ID__ = "1369";
process.env.__CHAIN_PROVIDERS__ =
  '{"1369": "https://eth-provider-dev.hypernetlabs.io"}';
process.env.__CHAIN_ADDRESSES__ =
  '{ \
  "1369": { \
    "channelFactoryAddress": "0xF12b5dd4EAD5F743C6BaA640B0216200e89B60Da", \
    "transferRegistryAddress": "0x8f0483125FCb9aaAEFA9209D8E9d7b9C8B9Fb90F" \
  } \
}';
process.env.__NATS_URL__ = "ws://localhost:4221";
process.env.__AUTH_URL__ = "http://localhost:5040";
process.env.__DEFAULT_CHAIN_ID__ = "1369";
process.env.__VALIDATOR_IFRAME_URL__ = "http://localhost:5005";
process.env.__CERAMIC_NODE_URL__ = "https://ceramic-clay.3boxlabs.com";
process.env.__HYPERTOKEN_ADDRESS__ =
  "0x9FBDa871d559710256a2502A2517b794B482Db40";
process.env.__DEBUG__ = true; */

/** @type import('webpack').Configuration */
module.exports = {
  context: __dirname,
  mode: process.env.__BUILD_ENV__ === "PROD" ? "production" : "development",
  entry: path.join(__dirname, "src/index.ts"),
  output: {
    filename: "index.js",
    path: path.join(__dirname, "/dist/bundle"),
  },
  devServer: {
    contentBase: path.join(__dirname, "src"),
    liveReload: true,
    compress: true,
    publicPath: "/",
    port: 5020,
    writeToDisk: true,
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
  devtool:
    process.env.__BUILD_ENV__ === "PROD" ? "source-map" : "eval-source-map",
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, "src/index.html"),
    }),
    //new CleanWebpackPlugin({ dangerouslyAllowCleanPatternsOutsideProject: false }),
    new webpack.ProvidePlugin({
      Buffer: ["buffer", "Buffer"],
      process: "process/browser",
    }),
    new webpack.DefinePlugin({
      __IFRAME_SOURCE__: JSON.stringify(process.env.__IFRAME_SOURCE__),
      __CHAIN_PROVIDERS__: JSON.stringify(process.env.__CHAIN_PROVIDERS__),
      __CHAIN_ADDRESSES__: JSON.stringify(process.env.__CHAIN_ADDRESSES__),
      __NATS_URL__: JSON.stringify(process.env.__NATS_URL__),
      __AUTH_URL__: JSON.stringify(process.env.__AUTH_URL__),
      __VALIDATOR_IFRAME_URL__: JSON.stringify(
        process.env.__VALIDATOR_IFRAME_URL__,
      ),
      __CERAMIC_NODE_URL__: JSON.stringify(process.env.__CERAMIC_NODE_URL__),
      __INFURA_ID__: JSON.stringify(process.env.__INFURA_ID__),
      __DEFAULT_CHAIN_ID__: JSON.stringify(process.env.__DEFAULT_CHAIN_ID__),
      __BUILD_ENV__: JSON.stringify(process.env.__BUILD_ENV__),
      __DEBUG__: JSON.stringify(process.env.__DEBUG__),
    }),
  ],
};

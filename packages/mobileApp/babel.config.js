const path = require("path");

module.exports = {
  presets: ["module:metro-react-native-babel-preset"],
  plugins: [
    [
      "module-resolver",
      {
        root: ["./src"],
        alias: {
          "@mobileApp": "./src",
          "@interfaces": path.resolve(
            __dirname,
            "../hypernet-core/src/interfaces",
          ),
          "@implementations": path.resolve(
            __dirname,
            "../hypernet-core/src/implementations",
          ),
          crypto: require.resolve("crypto-browserify"),
          path: require.resolve("path-browserify"),
          stream: require.resolve("stream-browserify"),
          http: require.resolve("stream-http"),
          https: require.resolve("https-browserify"),
          os: require.resolve("os-browserify/browser"),
          net: false,
          tls: false,
          fs: require.resolve("os-browserify/browser"),
        },
      },
    ],
    [
      "@babel/plugin-proposal-decorators",
      {
        legacy: true,
      },
    ],
  ],
};

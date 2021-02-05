module.exports = {
  presets: ["module:metro-react-native-babel-preset"],
  plugins: [
    [
      "module-resolver",
      {
        root: ["./src"],
        alias: {
          containers: "./src/containers",
          interfaces: "./src/interfaces",
          screens: "./src/screens",
          state: "./src/state",
        },
      },
    ],
  ],
};

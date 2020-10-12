module.exports = {
  parser: "@typescript-eslint/parser",
  plugins: ["import"],
  extends: [
    "plugin:@typescript-eslint/recommended",
    "prettier/@typescript-eslint",
    "plugin:import/errors",
    "plugin:import/warnings",
    "plugin:import/typescript",
  ],
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: "module",
  },
  rules: {
    "@typescript-eslint/no-empty-interface": ["off"],
    "@typescript-eslint/no-non-null-assertion": ["off"],
    "comma-dangle": ["warn", "always-multiline"],
    quotes: ["warn", "double", { allowTemplateLiterals: true, avoidEscape: true }],
    semi: ["error", "always"],
    "@typescript-eslint/no-explicit-any": ["off"],
    "import/order": [
      1,
      {
        groups: ["builtin", "external", "internal", "parent", "sibling", "index"],
        "newlines-between": "always",
      },
    ],
  },
};

const path = require("path");

/** @type {import("eslint").Linter.Config} */
const config = {
  overrides: [
    {
      files: ["*.ts", "*.tsx"],
      parserOptions: {
        project: path.join(__dirname, "tsconfig.json"),
      },
    },
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: path.join(__dirname, "tsconfig.json"),
  },
  extends: ["next/core-web-vitals"],
};

module.exports = config;

# @svdex/eslint-plugin-bedrock

ESLint plugin for Minecraft: Bedrock Edition Add-on Development.

## Installation

1. Installing [ESLint](https://eslint.org/)

```bash
npm install eslint -D
```

2. Installing `@svdex/eslint-plugin-bedrock`

```bash
npm install @svdex/eslint-plugin-bedrock -D
```

## Usage

`eslint.config.mjs`

```js
import ts from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import bedrockLinting from "@svdex/eslint-plugin-bedrock";

export default [
  {
    files: ["data/scripts/**/*.ts"],
    languageOptions: {
      parser: tsParser,
      ecmaVersion: "latest",
    },
    plugins: {
      ts,
      "bedrock-linting": bedrockLinting,
    },
    rules: {
      "bedrock-linting/name-selector": "error",
    },
  },
];
```

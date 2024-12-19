import { type RuleModule } from "@typescript-eslint/utils/dist/ts-eslint";
import { ESLint } from "eslint";
import { rules } from "./rules";

type RuleKey = keyof typeof rules;

interface Plugin extends Omit<ESLint.Plugin, "rules"> {
  rules: Record<RuleKey, RuleModule<never, [], unknown>>;
}

const { name, version }: { name: string; version: string } = require("../package.json");

module.exports = {
  meta: {
    name,
    version,
  },
  rules,
} satisfies Plugin;

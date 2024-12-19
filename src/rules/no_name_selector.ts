import { createRule } from "../lib/create_rule";
import { parseCommand } from "../lib/parse_command";

export const noNameSelector = createRule({
  name: "no-name-selector",
  meta: {
    type: "problem",
    docs: {
      description: "Disallow using name selector in commands",
    },
    messages: {
      noNameSelector:
        "Name selector is not allowed. This causes to throw an error if the player has spaces in their name.",
    },
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    return {
      CallExpression(node) {
        const command = parseCommand(context, node);
        if (!command) {
          return;
        }

        if (command.match(/@[a-zA-Z]+(\s+)?\[(.*?)(name=)/g)) {
          context.report({
            node,
            messageId: "noNameSelector",
          });
        }
      },
    };
  },
});

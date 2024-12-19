import { AST_NODE_TYPES, TSESTree } from "@typescript-eslint/utils";
import { RuleContext } from "@typescript-eslint/utils/dist/ts-eslint";

const methods: readonly string[] = ["runCommand", "runCommandAsync"];

// https://github.com/Mojang/minecraft-scripting-libraries/blob/main/tools/eslint-plugin-minecraft-linting/src/Rules/AvoidUnnecessaryCommand.ts
export function parseCommand(context: RuleContext<string, []>, node: TSESTree.CallExpression) {
  const { callee } = node;
  if (callee.type !== AST_NODE_TYPES.MemberExpression) {
    return;
  }
  if (callee.property.type !== AST_NODE_TYPES.Identifier) {
    return;
  }
  if (!methods.includes(callee.property.name)) {
    return;
  }
  // Single args
  const [arg] = node.arguments;
  if (!arg) {
    return;
  }
  let commandString: string | undefined = undefined;
  switch (arg.type) {
    case AST_NODE_TYPES.Literal:
      {
        commandString = arg.value as string;
      }
      break;
    case AST_NODE_TYPES.TemplateLiteral:
    case AST_NODE_TYPES.Identifier:
      {
        let templateOrIdentifier = arg; // This may be overridden;
        if (templateOrIdentifier.type === AST_NODE_TYPES.TemplateLiteral) {
          const firstQuasi = templateOrIdentifier.quasis[0];
          if (firstQuasi.range[0] !== templateOrIdentifier.range[0]) {
            break;
          }

          if (firstQuasi.value.raw.length === 0) {
            const firstExpression = templateOrIdentifier.expressions[0];
            if (firstExpression.type !== AST_NODE_TYPES.Identifier) {
              return;
            }
            templateOrIdentifier = firstExpression;
          } else {
            commandString = firstQuasi.value.raw;
          }
        }

        if (templateOrIdentifier.type === AST_NODE_TYPES.Identifier) {
          const identifierName = templateOrIdentifier.name;
          const scope = context.sourceCode.getScope(node);

          let constValue = undefined;
          let currentScope: typeof scope | null = scope;

          while (currentScope) {
            const { variables } = currentScope;

            for (const variable of variables) {
              if (variable.name === identifierName && variable.defs[0].type === "Variable") {
                variable.defs[0].node;
                const variableInit = variable.defs[0]?.node?.init;
                if (variableInit?.type === AST_NODE_TYPES.Literal) {
                  constValue = variableInit.value;
                }
                if (variableInit?.type === AST_NODE_TYPES.TemplateLiteral) {
                  constValue = variableInit.quasis[0].value.raw;
                }
                break;
              }
            }

            if (constValue !== undefined) {
              break;
            }

            currentScope = currentScope.upper;
          }

          commandString = typeof constValue === "string" ? constValue : undefined;
        }
      }
      break;
  }

  if (commandString) {
    if (!commandString.startsWith("/")) {
      commandString = "/" + commandString;
    }
  }
  return commandString;
}

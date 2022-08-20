import { AST_NODE_TYPES, TSESTree } from '@typescript-eslint/utils';
import {
  createRule,
  followTypeAssertionChain,
  isExpectCall,
  parseExpectCall,
} from './utils';

const isNumberOne = (
  firstArg: TSESTree.CallExpression['arguments'][number],
): boolean => {
  if (firstArg.type === AST_NODE_TYPES.SpreadElement) {
    return false;
  }

  const arg = followTypeAssertionChain(firstArg);

  return arg.type === AST_NODE_TYPES.Literal && arg.value === 1;
};

export default createRule({
  name: __filename,
  meta: {
    docs: {
      category: 'Stylistic Issues',
      description: 'Suggest using `toHaveBeenCalledOnce()`',
      recommended: false,
    },
    messages: {
      preferCalledOnce: 'Prefer `toHaveBeenCalledOnce()`',
    },
    fixable: 'code',
    type: 'suggestion',
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    return {
      CallExpression(node) {
        if (!isExpectCall(node)) {
          return;
        }

        const { matcher } = parseExpectCall(node);

        if (
          matcher &&
          matcher.name === 'toHaveBeenCalledTimes' &&
          matcher.arguments?.length === 1
        ) {
          const [arg] = matcher.arguments;

          if (!isNumberOne(arg)) {
            return;
          }

          context.report({
            node: matcher.node.property,
            messageId: 'preferCalledOnce',
            fix: fixer => [
              fixer.replaceText(matcher.node.property, 'toHaveBeenCalledOnce'),
              fixer.remove(arg),
            ],
          });
        }
      },
    };
  },
});

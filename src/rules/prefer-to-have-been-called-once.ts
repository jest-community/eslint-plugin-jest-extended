import { AST_NODE_TYPES } from '@typescript-eslint/utils';
import {
  createRule,
  getAccessorValue,
  getFirstMatcherArg,
  parseJestFnCall,
} from './utils';

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
        const jestFnCall = parseJestFnCall(node, context);

        if (jestFnCall?.type !== 'expect') {
          return;
        }

        if (
          getAccessorValue(jestFnCall.matcher) === 'toHaveBeenCalledTimes' &&
          jestFnCall.args.length === 1
        ) {
          const arg = getFirstMatcherArg(jestFnCall);

          if (arg.type !== AST_NODE_TYPES.Literal || arg.value !== 1) {
            return;
          }

          context.report({
            node: jestFnCall.matcher,
            messageId: 'preferCalledOnce',
            fix: fixer => [
              fixer.replaceText(jestFnCall.matcher, 'toHaveBeenCalledOnce'),
              fixer.remove(jestFnCall.args[0]),
            ],
          });
        }
      },
    };
  },
});

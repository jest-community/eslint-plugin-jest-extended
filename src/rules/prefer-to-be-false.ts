import { AST_NODE_TYPES, type TSESTree } from '@typescript-eslint/utils';
import {
  EqualityMatcher,
  createRule,
  getAccessorValue,
  getFirstMatcherArg,
  parseJestFnCall,
} from './utils';

interface FalseLiteral extends TSESTree.BooleanLiteral {
  value: false;
}

const isFalseLiteral = (node: TSESTree.Node): node is FalseLiteral =>
  node.type === AST_NODE_TYPES.Literal && node.value === false;

export default createRule({
  name: __filename,
  meta: {
    docs: {
      category: 'Stylistic Issues',
      description: 'Suggest using `toBeFalse()`',
      recommended: false,
    },
    messages: {
      preferToBeFalse: 'Prefer using `toBeFalse()` to test value is `false`.',
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
          jestFnCall.args.length === 1 &&
          isFalseLiteral(getFirstMatcherArg(jestFnCall)) &&
          EqualityMatcher.hasOwnProperty(getAccessorValue(jestFnCall.matcher))
        ) {
          context.report({
            node: jestFnCall.matcher,
            messageId: 'preferToBeFalse',
            fix: fixer => [
              fixer.replaceText(jestFnCall.matcher, 'toBeFalse'),
              fixer.remove(jestFnCall.args[0]),
            ],
          });
        }
      },
    };
  },
});

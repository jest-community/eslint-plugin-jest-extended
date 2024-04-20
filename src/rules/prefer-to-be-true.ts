import { AST_NODE_TYPES, type TSESTree } from '@typescript-eslint/utils';
import {
  EqualityMatcher,
  createRule,
  getAccessorValue,
  getFirstMatcherArg,
  parseJestFnCall,
} from './utils';

interface TrueLiteral extends TSESTree.BooleanLiteral {
  value: true;
}

const isTrueLiteral = (node: TSESTree.Node): node is TrueLiteral =>
  node.type === AST_NODE_TYPES.Literal && node.value === true;

export default createRule({
  name: __filename,
  meta: {
    docs: {
      category: 'Stylistic Issues',
      description: 'Suggest using `toBeTrue()`',
      recommended: false,
    },
    messages: {
      preferToBeTrue: 'Prefer using `toBeTrue()` to test value is `true`.',
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
          isTrueLiteral(getFirstMatcherArg(jestFnCall)) &&
          EqualityMatcher.hasOwnProperty(getAccessorValue(jestFnCall.matcher))
        ) {
          context.report({
            node: jestFnCall.matcher,
            messageId: 'preferToBeTrue',
            fix: fixer => [
              fixer.replaceText(jestFnCall.matcher, 'toBeTrue'),
              fixer.remove(jestFnCall.args[0]),
            ],
          });
        }
      },
    };
  },
});

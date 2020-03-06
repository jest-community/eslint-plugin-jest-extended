import {
  AST_NODE_TYPES,
  TSESTree,
} from '@typescript-eslint/experimental-utils';
import {
  MaybeTypeCast,
  ParsedEqualityMatcherCall,
  ParsedExpectMatcher,
  createRule,
  followTypeAssertionChain,
  isExpectCall,
  isParsedEqualityMatcherCall,
  parseExpectCall,
} from './utils';

interface FalseLiteral extends TSESTree.BooleanLiteral {
  value: false;
}

const isFalseLiteral = (node: TSESTree.Node): node is FalseLiteral =>
  node.type === AST_NODE_TYPES.Literal && node.value === false;

/**
 * Checks if the given `ParsedExpectMatcher` is a call to one of the equality matchers,
 * with a `false` literal as the sole argument.
 *
 * @param {ParsedExpectMatcher} matcher
 *
 * @return {matcher is ParsedEqualityMatcherCall<MaybeTypeCast<FalseLiteral>>}
 */
const isFalseEqualityMatcher = (
  matcher: ParsedExpectMatcher,
): matcher is ParsedEqualityMatcherCall<MaybeTypeCast<FalseLiteral>> =>
  isParsedEqualityMatcherCall(matcher) &&
  isFalseLiteral(followTypeAssertionChain(matcher.arguments[0]));

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
        if (!isExpectCall(node)) {
          return;
        }

        const { matcher } = parseExpectCall(node);

        if (matcher && isFalseEqualityMatcher(matcher)) {
          context.report({
            node: matcher.node.property,
            messageId: 'preferToBeFalse',
            fix: fixer => [
              fixer.replaceText(matcher.node.property, 'toBeFalse'),
              fixer.remove(matcher.arguments[0]),
            ],
          });
        }
      },
    };
  },
});

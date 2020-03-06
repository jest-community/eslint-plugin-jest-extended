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

interface TrueLiteral extends TSESTree.BooleanLiteral {
  value: true;
}

const isTrueLiteral = (node: TSESTree.Node): node is TrueLiteral =>
  node.type === AST_NODE_TYPES.Literal && node.value === true;

/**
 * Checks if the given `ParsedExpectMatcher` is a call to one of the equality matchers,
 * with a `true` literal as the sole argument.
 *
 * @param {ParsedExpectMatcher} matcher
 *
 * @return {matcher is ParsedEqualityMatcherCall<MaybeTypeCast<TrueLiteral>>}
 */
const isTrueEqualityMatcher = (
  matcher: ParsedExpectMatcher,
): matcher is ParsedEqualityMatcherCall<MaybeTypeCast<TrueLiteral>> =>
  isParsedEqualityMatcherCall(matcher) &&
  isTrueLiteral(followTypeAssertionChain(matcher.arguments[0]));

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
        if (!isExpectCall(node)) {
          return;
        }

        const { matcher } = parseExpectCall(node);

        if (matcher && isTrueEqualityMatcher(matcher)) {
          context.report({
            node: matcher.node.property,
            messageId: 'preferToBeTrue',
            fix: fixer => [
              fixer.replaceText(matcher.node.property, 'toBeTrue'),
              fixer.remove(matcher.arguments[0]),
            ],
          });
        }
      },
    };
  },
});

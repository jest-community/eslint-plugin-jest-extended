import { AST_NODE_TYPES } from '@typescript-eslint/utils';
import {
  ModifierName,
  createRule,
  followTypeAssertionChain,
  isBooleanEqualityMatcher,
  isExpectCall,
  isInstanceOfBinaryExpression,
  isParsedInstanceOfMatcherCall,
  parseExpectCall,
} from './utils';

export type MessageIds = 'preferToBeObject';
export type Options = [];

export default createRule<Options, MessageIds>({
  name: __filename,
  meta: {
    docs: {
      category: 'Stylistic Issues',
      description: 'Suggest using `toBeObject()`',
      recommended: false,
    },
    messages: {
      preferToBeObject:
        'Prefer using `toBeObject()` to test if a value is an Object.',
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

        const { expect, modifier, matcher } = parseExpectCall(node);

        if (!matcher) {
          return;
        }

        if (isParsedInstanceOfMatcherCall(matcher, 'Object')) {
          context.report({
            node: matcher.node.property,
            messageId: 'preferToBeObject',
            fix: fixer => [
              fixer.replaceTextRange(
                [
                  matcher.node.property.range[0],
                  matcher.node.property.range[1] + '(Object)'.length,
                ],
                'toBeObject()',
              ),
            ],
          });

          return;
        }

        const [expectArg] = expect.arguments;

        if (
          !expectArg ||
          !isBooleanEqualityMatcher(matcher) ||
          !isInstanceOfBinaryExpression(expectArg, 'Object')
        ) {
          return;
        }

        context.report({
          node: matcher.node.property,
          messageId: 'preferToBeObject',
          fix(fixer) {
            const fixes = [
              fixer.replaceText(matcher.node.property, 'toBeObject'),
              fixer.removeRange([expectArg.left.range[1], expectArg.range[1]]),
            ];

            let invertCondition = matcher.name === 'toBeFalse';

            if (matcher.arguments?.length) {
              const [matcherArg] = matcher.arguments;

              fixes.push(fixer.remove(matcherArg));

              // toBeFalse can't have arguments, so this won't be true beforehand
              invertCondition =
                matcherArg.type === AST_NODE_TYPES.Literal &&
                followTypeAssertionChain(matcherArg).value === false;
            }

            if (invertCondition) {
              fixes.push(
                modifier && modifier.name === ModifierName.not
                  ? fixer.removeRange([
                      modifier.node.property.range[0] - 1,
                      modifier.node.property.range[1],
                    ])
                  : fixer.insertTextBefore(matcher.node.property, 'not.'),
              );
            }

            return fixes;
          },
        });
      },
    };
  },
});

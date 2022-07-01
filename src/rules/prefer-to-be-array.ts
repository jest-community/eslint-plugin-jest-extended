import { AST_NODE_TYPES, TSESTree } from '@typescript-eslint/utils';
import {
  ModifierName,
  createRule,
  followTypeAssertionChain,
  isBooleanEqualityMatcher,
  isExpectCall,
  isInstanceOfBinaryExpression,
  isParsedInstanceOfMatcherCall,
  isSupportedAccessor,
  parseExpectCall,
} from './utils';

const isArrayIsArrayCall = (
  node: TSESTree.Node,
): node is TSESTree.CallExpression =>
  node.type === AST_NODE_TYPES.CallExpression &&
  node.callee.type === AST_NODE_TYPES.MemberExpression &&
  isSupportedAccessor(node.callee.object, 'Array') &&
  isSupportedAccessor(node.callee.property, 'isArray');

export type MessageIds = 'preferToBeArray';
export type Options = [];

export default createRule<Options, MessageIds>({
  name: __filename,
  meta: {
    docs: {
      category: 'Stylistic Issues',
      description: 'Suggest using `toBeArray()`',
      recommended: false,
    },
    messages: {
      preferToBeArray:
        'Prefer using `toBeArray()` to test if a value is an array.',
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

        if (isParsedInstanceOfMatcherCall(matcher, 'Array')) {
          context.report({
            node: matcher.node.property,
            messageId: 'preferToBeArray',
            fix: fixer => [
              fixer.replaceTextRange(
                [
                  matcher.node.property.range[0],
                  matcher.node.property.range[1] + '(Array)'.length,
                ],
                'toBeArray()',
              ),
            ],
          });

          return;
        }

        const [expectArg] = expect.arguments;

        if (
          !expectArg ||
          !isBooleanEqualityMatcher(matcher) ||
          !(
            isArrayIsArrayCall(expectArg) ||
            isInstanceOfBinaryExpression(expectArg, 'Array')
          )
        ) {
          return;
        }

        context.report({
          node: matcher.node.property,
          messageId: 'preferToBeArray',
          fix(fixer) {
            const fixes = [
              fixer.replaceText(matcher.node.property, 'toBeArray'),
              expectArg.type === AST_NODE_TYPES.CallExpression
                ? fixer.remove(expectArg.callee)
                : fixer.removeRange([
                    expectArg.left.range[1],
                    expectArg.range[1],
                  ]),
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

import { AST_NODE_TYPES, type TSESTree } from '@typescript-eslint/utils';
import {
  createRule,
  followTypeAssertionChain,
  getAccessorValue,
  isBooleanEqualityMatcher,
  isInstanceOfBinaryExpression,
  isParsedInstanceOfMatcherCall,
  isSupportedAccessor,
  parseJestFnCall,
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
      description: 'Suggest using `toBeArray()`',
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
        const jestFnCall = parseJestFnCall(node, context);

        if (jestFnCall?.type !== 'expect') {
          return;
        }

        if (isParsedInstanceOfMatcherCall(jestFnCall, 'Array')) {
          context.report({
            node: jestFnCall.matcher,
            messageId: 'preferToBeArray',
            fix: fixer => [
              fixer.replaceTextRange(
                [
                  jestFnCall.matcher.range[0],
                  jestFnCall.matcher.range[1] + '(Array)'.length,
                ],
                'toBeArray()',
              ),
            ],
          });

          return;
        }

        const { parent: expect } = jestFnCall.head.node;

        if (expect?.type !== AST_NODE_TYPES.CallExpression) {
          return;
        }

        const [expectArg] = expect.arguments;

        if (
          !expectArg ||
          !isBooleanEqualityMatcher(jestFnCall) ||
          !(
            isArrayIsArrayCall(expectArg) ||
            isInstanceOfBinaryExpression(expectArg, 'Array')
          )
        ) {
          return;
        }

        context.report({
          node: jestFnCall.matcher,
          messageId: 'preferToBeArray',
          fix(fixer) {
            const fixes = [
              fixer.replaceText(jestFnCall.matcher, 'toBeArray'),
              expectArg.type === AST_NODE_TYPES.CallExpression
                ? fixer.remove(expectArg.callee)
                : fixer.removeRange([
                    expectArg.left.range[1],
                    expectArg.range[1],
                  ]),
            ];

            let invertCondition =
              getAccessorValue(jestFnCall.matcher) === 'toBeFalse';

            if (jestFnCall.args.length) {
              const [matcherArg] = jestFnCall.args;

              fixes.push(fixer.remove(matcherArg));

              // toBeFalse can't have arguments, so this won't be true beforehand
              invertCondition =
                matcherArg.type === AST_NODE_TYPES.Literal &&
                followTypeAssertionChain(matcherArg).value === false;
            }

            if (invertCondition) {
              const notModifier = jestFnCall.modifiers.find(
                nod => getAccessorValue(nod) === 'not',
              );

              fixes.push(
                notModifier
                  ? fixer.removeRange([
                      notModifier.range[0] - 1,
                      notModifier.range[1],
                    ])
                  : fixer.insertTextBefore(jestFnCall.matcher, 'not.'),
              );
            }

            return fixes;
          },
        });
      },
    };
  },
});

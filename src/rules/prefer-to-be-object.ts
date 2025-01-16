import { AST_NODE_TYPES } from '@typescript-eslint/utils';
import {
  createRule,
  followTypeAssertionChain,
  getAccessorValue,
  isBooleanEqualityMatcher,
  isInstanceOfBinaryExpression,
  isParsedInstanceOfMatcherCall,
  parseJestFnCall,
} from './utils';

export type MessageIds = 'preferToBeObject';
export type Options = [];

export default createRule<Options, MessageIds>({
  name: __filename,
  meta: {
    docs: {
      description: 'Suggest using `toBeObject()`',
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
        const jestFnCall = parseJestFnCall(node, context);

        if (jestFnCall?.type !== 'expect') {
          return;
        }

        if (isParsedInstanceOfMatcherCall(jestFnCall, 'Object')) {
          context.report({
            node: jestFnCall.matcher,
            messageId: 'preferToBeObject',
            fix: fixer => [
              fixer.replaceTextRange(
                [
                  jestFnCall.matcher.range[0],
                  jestFnCall.matcher.range[1] + '(Object)'.length,
                ],
                'toBeObject()',
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
          !isInstanceOfBinaryExpression(expectArg, 'Object')
        ) {
          return;
        }

        context.report({
          node: jestFnCall.matcher,
          messageId: 'preferToBeObject',
          fix(fixer) {
            const fixes = [
              fixer.replaceText(jestFnCall.matcher, 'toBeObject'),
              fixer.removeRange([expectArg.left.range[1], expectArg.range[1]]),
            ];

            let invertCondition =
              getAccessorValue(jestFnCall.matcher) === 'toBeFalse';

            if (jestFnCall.args?.length) {
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

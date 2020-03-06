import { TSESLint } from '@typescript-eslint/experimental-utils';
import resolveFrom from 'resolve-from';
import rule, { MessageIds, Options } from '../prefer-to-be-array';

const ruleTester = new TSESLint.RuleTester({
  parser: resolveFrom(require.resolve('eslint'), 'espree'),
  parserOptions: {
    ecmaVersion: 2017,
  },
});

// makes ts happy about the dynamic test generation
const messageId = 'preferToBeArray' as const;

const expectInAndOutValues = [
  ['[] instanceof Array', '[]'],
  ['Array.isArray([])', '([])'],
];

const createTestsForEqualityMatchers = (): Array<TSESLint.InvalidTestCase<
  MessageIds,
  Options
>> =>
  ['toBe', 'toEqual', 'toStrictEqual']
    .map(matcher =>
      expectInAndOutValues.map(([inValue, outValue]) => [
        {
          code: `expect(${inValue}).${matcher}(true);`,
          errors: [{ messageId, column: 10 + inValue.length, line: 1 }],
          output: `expect(${outValue}).toBeArray();`,
        },
        {
          code: `expect(${inValue}).not.${matcher}(true);`,
          errors: [{ messageId, column: 14 + inValue.length, line: 1 }],
          output: `expect(${outValue}).not.toBeArray();`,
        },
        {
          code: `expect(${inValue}).${matcher}(false);`,
          errors: [{ messageId, column: 10 + inValue.length, line: 1 }],
          output: `expect(${outValue}).not.toBeArray();`,
        },
        {
          code: `expect(${inValue}).not.${matcher}(false);`,
          errors: [{ messageId, column: 14 + inValue.length, line: 1 }],
          output: `expect(${outValue}).toBeArray();`,
        },
      ]),
    )
    .reduce((arr, cur) => arr.concat(cur), [])
    .reduce((arr, cur) => arr.concat(cur), []);

ruleTester.run('prefer-to-be-array', rule, {
  valid: [
    'expect',
    'expect()',
    'expect().toBe(true)',
    'expect([]).toBe(true)',
    'expect([])["toBe"](true)',
    'expect([]).toBeArray()',
    'expect([]).not.toBeArray()',
    'expect([] instanceof Object).not.toBeArray()',
    'expect([]).not.toBeInstanceOf(Object)',
  ],
  invalid: [
    ...createTestsForEqualityMatchers(),
    ...expectInAndOutValues
      .map(([inValue, outValue]) => [
        {
          code: `expect(${inValue}).toBeTrue();`,
          errors: [{ messageId, column: 10 + inValue.length, line: 1 }],
          output: `expect(${outValue}).toBeArray();`,
        },
        {
          code: `expect(${inValue}).not.toBeTrue();`,
          errors: [{ messageId, column: 14 + inValue.length, line: 1 }],
          output: `expect(${outValue}).not.toBeArray();`,
        },
        {
          code: `expect(${inValue}).toBeFalse();`,
          errors: [{ messageId, column: 10 + inValue.length, line: 1 }],
          output: `expect(${outValue}).not.toBeArray();`,
        },
        {
          code: `expect(${inValue}).not.toBeFalse();`,
          errors: [{ messageId, column: 14 + inValue.length, line: 1 }],
          output: `expect(${outValue}).toBeArray();`,
        },
      ])
      .reduce((arr, cur) => arr.concat(cur), []),

    {
      code: 'expect(Array["isArray"]([])).toBe(true);',
      errors: [{ messageId, column: 30, line: 1 }],
      output: 'expect(([])).toBeArray();',
    },
    {
      code: 'expect(Array[`isArray`]([])).toBe(true);',
      errors: [{ messageId, column: 30, line: 1 }],
      output: 'expect(([])).toBeArray();',
    },
    {
      code: 'expect([]).toBeInstanceOf(Array);',
      errors: [{ messageId, column: 12, line: 1 }],
      output: 'expect([]).toBeArray();',
    },
    {
      code: 'expect([]).not.toBeInstanceOf(Array);',
      errors: [{ messageId, column: 16, line: 1 }],
      output: 'expect([]).not.toBeArray();',
    },
    {
      code: 'expect(requestValues()).resolves.toBeInstanceOf(Array);',
      errors: [{ messageId, column: 34, line: 1 }],
      output: 'expect(requestValues()).resolves.toBeArray();',
    },
    {
      code: 'expect(queryApi()).rejects.not.toBeInstanceOf(Array);',
      errors: [{ messageId, column: 32, line: 1 }],
      output: 'expect(queryApi()).rejects.not.toBeArray();',
    },
  ],
});

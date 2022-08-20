import { TSESLint } from '@typescript-eslint/utils';
import rule, { MessageIds, Options } from '../prefer-to-be-object';

const ruleTester = new TSESLint.RuleTester();

// makes ts happy about the dynamic test generation
const messageId = 'preferToBeObject' as const;

const createTestsForEqualityMatchers = (): Array<
  TSESLint.InvalidTestCase<MessageIds, Options>
> =>
  ['toBe', 'toEqual', 'toStrictEqual']
    .map(matcher => [
      {
        code: `expect({} instanceof Object).${matcher}(true);`,
        errors: [{ messageId, column: 30, line: 1 }],
        output: `expect({}).toBeObject();`,
      },
      {
        code: `expect({} instanceof Object).not.${matcher}(true);`,
        errors: [{ messageId, column: 34, line: 1 }],
        output: `expect({}).not.toBeObject();`,
      },
      {
        code: `expect({} instanceof Object).${matcher}(false);`,
        errors: [{ messageId, column: 30, line: 1 }],
        output: `expect({}).not.toBeObject();`,
      },
      {
        code: `expect({} instanceof Object).not.${matcher}(false);`,
        errors: [{ messageId, column: 34, line: 1 }],
        output: `expect({}).toBeObject();`,
      },
    ])
    .reduce((arr, cur) => arr.concat(cur), []);

ruleTester.run('prefer-to-be-object', rule, {
  valid: [
    'expect.hasAssertions',
    'expect.hasAssertions()',
    'expect',
    'expect().not',
    'expect().toBe',
    'expect().toBe(true)',
    'expect({}).toBe(true)',
    'expect({}).toBeObject()',
    'expect({}).not.toBeObject()',
    'expect([] instanceof Array).not.toBeObject()',
    'expect({}).not.toBeInstanceOf(Array)',
  ],
  invalid: [
    ...createTestsForEqualityMatchers(),
    {
      code: 'expect(({} instanceof Object)).toBeTrue();',
      output: 'expect(({})).toBeObject();',
      errors: [{ messageId, column: 32, line: 1 }],
    },
    {
      code: 'expect({} instanceof Object).toBeTrue();',
      output: 'expect({}).toBeObject();',
      errors: [{ messageId, column: 30, line: 1 }],
    },
    {
      code: 'expect({} instanceof Object).not.toBeTrue();',
      output: 'expect({}).not.toBeObject();',
      errors: [{ messageId, column: 34, line: 1 }],
    },
    {
      code: 'expect({} instanceof Object).toBeFalse();',
      output: 'expect({}).not.toBeObject();',
      errors: [{ messageId, column: 30, line: 1 }],
    },
    {
      code: 'expect({} instanceof Object).not.toBeFalse();',
      output: 'expect({}).toBeObject();',
      errors: [{ messageId, column: 34, line: 1 }],
    },
    {
      code: 'expect({}).toBeInstanceOf(Object);',
      output: 'expect({}).toBeObject();',
      errors: [{ messageId, column: 12, line: 1 }],
    },
    {
      code: 'expect({}).not.toBeInstanceOf(Object);',
      output: 'expect({}).not.toBeObject();',
      errors: [{ messageId, column: 16, line: 1 }],
    },
    {
      code: 'expect(requestValues()).resolves.toBeInstanceOf(Object);',
      output: 'expect(requestValues()).resolves.toBeObject();',
      errors: [{ messageId, column: 34, line: 1 }],
    },
    {
      code: 'expect(queryApi()).resolves.not.toBeInstanceOf(Object);',
      output: 'expect(queryApi()).resolves.not.toBeObject();',
      errors: [{ messageId, column: 33, line: 1 }],
    },
  ],
});

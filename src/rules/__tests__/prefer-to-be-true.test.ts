import { TSESLint } from '@typescript-eslint/experimental-utils';
import rule from '../prefer-to-be-true';

const ruleTester = new TSESLint.RuleTester();

ruleTester.run('prefer-to-be-true', rule, {
  valid: [
    '[].push(true)',
    'expect("something");',
    'expect(true).toBeTrue();',
    'expect(false).toBeTrue();',
    'expect(false).toBeFalse();',
    'expect(true).toBeFalse();',
    'expect(value).toEqual();',
    'expect(value).not.toBeTrue();',
    'expect(value).not.toEqual();',
    'expect(value).toBe(undefined);',
    'expect(value).not.toBe(undefined);',
    'expect(true).toBe(false)',
    'expect(value).toBe();',
    'expect(true).toMatchSnapshot();',
    'expect("a string").toMatchSnapshot(true);',
    'expect("a string").not.toMatchSnapshot();',
    "expect(something).toEqual('a string');",
    'expect(true).toBe',
  ],
  invalid: [
    {
      code: 'expect(false).toBe(true);',
      errors: [{ messageId: 'preferToBeTrue', column: 15, line: 1 }],
      output: 'expect(false).toBeTrue();',
    },
    {
      code: 'expect(wasSuccessful).toEqual(true);',
      errors: [{ messageId: 'preferToBeTrue', column: 23, line: 1 }],
      output: 'expect(wasSuccessful).toBeTrue();',
    },
    {
      code: "expect(fs.existsSync('/path/to/file')).toStrictEqual(true);",
      errors: [{ messageId: 'preferToBeTrue', column: 40, line: 1 }],
      output: "expect(fs.existsSync('/path/to/file')).toBeTrue();",
    },
    {
      code: 'expect("a string").not.toBe(true);',
      errors: [{ messageId: 'preferToBeTrue', column: 24, line: 1 }],
      output: 'expect("a string").not.toBeTrue();',
    },
    {
      code: 'expect("a string").not.toEqual(true);',
      errors: [{ messageId: 'preferToBeTrue', column: 24, line: 1 }],
      output: 'expect("a string").not.toBeTrue();',
    },
    {
      code: 'expect("a string").not.toStrictEqual(true);',
      errors: [{ messageId: 'preferToBeTrue', column: 24, line: 1 }],
      output: 'expect("a string").not.toBeTrue();',
    },
  ],
});

new TSESLint.RuleTester({
  parser: require.resolve('@typescript-eslint/parser'),
}).run('prefer-to-be-true: typescript edition', rule, {
  valid: [
    "(expect('Model must be bound to an array if the multiple property is true') as any).toHaveBeenTipped()",
  ],
  invalid: [
    {
      code: 'expect(true).toBe(true as unknown as string as unknown as any);',
      errors: [{ messageId: 'preferToBeTrue', column: 14, line: 1 }],
      output: 'expect(true).toBeTrue();',
    },
    {
      code: 'expect("a string").not.toEqual(true as number);',
      errors: [{ messageId: 'preferToBeTrue', column: 24, line: 1 }],
      output: 'expect("a string").not.toBeTrue();',
    },
  ],
});

import { TSESLint } from '@typescript-eslint/experimental-utils';
import rule from '../prefer-to-be-false';

const ruleTester = new TSESLint.RuleTester();

ruleTester.run('prefer-to-be-false', rule, {
  valid: [
    '[].push(false)',
    'expect("something");',
    'expect(true).toBeTrue();',
    'expect(false).toBeTrue();',
    'expect(false).toBeFalse();',
    'expect(true).toBeFalse();',
    'expect(value).toEqual();',
    'expect(value).not.toBeFalse();',
    'expect(value).not.toEqual();',
    'expect(value).toBe(undefined);',
    'expect(value).not.toBe(undefined);',
    'expect(false).toBe(true)',
    'expect(value).toBe();',
    'expect(true).toMatchSnapshot();',
    'expect("a string").toMatchSnapshot(false);',
    'expect("a string").not.toMatchSnapshot();',
    "expect(something).toEqual('a string');",
    'expect(false).toBe',
  ],
  invalid: [
    {
      code: 'expect(true).toBe(false);',
      errors: [{ messageId: 'preferToBeFalse', column: 14, line: 1 }],
      output: 'expect(true).toBeFalse();',
    },
    {
      code: 'expect(wasSuccessful).toEqual(false);',
      errors: [{ messageId: 'preferToBeFalse', column: 23, line: 1 }],
      output: 'expect(wasSuccessful).toBeFalse();',
    },
    {
      code: "expect(fs.existsSync('/path/to/file')).toStrictEqual(false);",
      errors: [{ messageId: 'preferToBeFalse', column: 40, line: 1 }],
      output: "expect(fs.existsSync('/path/to/file')).toBeFalse();",
    },
    {
      code: 'expect("a string").not.toBe(false);',
      errors: [{ messageId: 'preferToBeFalse', column: 24, line: 1 }],
      output: 'expect("a string").not.toBeFalse();',
    },
    {
      code: 'expect("a string").not.toEqual(false);',
      errors: [{ messageId: 'preferToBeFalse', column: 24, line: 1 }],
      output: 'expect("a string").not.toBeFalse();',
    },
    {
      code: 'expect("a string").not.toStrictEqual(false);',
      errors: [{ messageId: 'preferToBeFalse', column: 24, line: 1 }],
      output: 'expect("a string").not.toBeFalse();',
    },
  ],
});

new TSESLint.RuleTester({
  parser: require.resolve('@typescript-eslint/parser'),
}).run('prefer-to-be-false: typescript edition', rule, {
  valid: [
    "(expect('Model must be bound to an array if the multiple property is true') as any).toHaveBeenTipped()",
  ],
  invalid: [
    {
      code: 'expect(true).toBe(false as unknown as string as unknown as any);',
      errors: [{ messageId: 'preferToBeFalse', column: 14, line: 1 }],
      output: 'expect(true).toBeFalse();',
    },
    {
      code: 'expect("a string").not.toEqual(false as number);',
      errors: [{ messageId: 'preferToBeFalse', column: 24, line: 1 }],
      output: 'expect("a string").not.toBeFalse();',
    },
  ],
});

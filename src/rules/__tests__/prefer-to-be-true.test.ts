import { TSESLint } from '@typescript-eslint/utils';
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
      output: 'expect(false).toBeTrue();',
      errors: [{ messageId: 'preferToBeTrue', column: 15, line: 1 }],
    },
    {
      code: 'expect(wasSuccessful).toEqual(true);',
      output: 'expect(wasSuccessful).toBeTrue();',
      errors: [{ messageId: 'preferToBeTrue', column: 23, line: 1 }],
    },
    {
      code: "expect(fs.existsSync('/path/to/file')).toStrictEqual(true);",
      output: "expect(fs.existsSync('/path/to/file')).toBeTrue();",
      errors: [{ messageId: 'preferToBeTrue', column: 40, line: 1 }],
    },
    {
      code: 'expect("a string").not.toBe(true);',
      output: 'expect("a string").not.toBeTrue();',
      errors: [{ messageId: 'preferToBeTrue', column: 24, line: 1 }],
    },
    {
      code: 'expect("a string").not.toEqual(true);',
      output: 'expect("a string").not.toBeTrue();',
      errors: [{ messageId: 'preferToBeTrue', column: 24, line: 1 }],
    },
    {
      code: 'expect("a string").not.toStrictEqual(true);',
      output: 'expect("a string").not.toBeTrue();',
      errors: [{ messageId: 'preferToBeTrue', column: 24, line: 1 }],
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
      output: 'expect(true).toBeTrue();',
      errors: [{ messageId: 'preferToBeTrue', column: 14, line: 1 }],
    },
    {
      code: 'expect("a string").not.toEqual(true as number);',
      output: 'expect("a string").not.toBeTrue();',
      errors: [{ messageId: 'preferToBeTrue', column: 24, line: 1 }],
    },
  ],
});

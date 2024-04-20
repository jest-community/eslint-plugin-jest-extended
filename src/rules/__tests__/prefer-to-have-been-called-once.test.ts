import rule from '../prefer-to-have-been-called-once';
import { FlatCompatRuleTester as RuleTester } from './test-utils';

const ruleTester = new RuleTester();

ruleTester.run('prefer-to-have-been-called-once', rule, {
  valid: [
    '[].push(true)',
    'expect("something");',
    'expect(xyz).toBe',
    'expect(xyz).toBe(true)',
    'expect(xyz).toHaveBeenCalled(true)',
    'expect(xyz).not.toHaveBeenCalled(true)',
    'expect(xyz).toHaveBeenCalled(1)',
    'expect(xyz).not.toHaveBeenCalled(1)',
    'expect(xyz).toHaveBeenCalledWith(1)',
    'expect(xyz).not.toHaveBeenCalledWith(1)',
    'expect(xyz).toHaveBeenCalledTimes(0)',
    'expect(xyz).toHaveBeenCalledTimes(2)',
    {
      code: 'expect(xyz).toHaveBeenCalledTimes(...1)',
      parserOptions: {
        ecmaVersion: 2015,
      },
    },
  ],
  invalid: [
    {
      code: 'expect(xyz).toHaveBeenCalledTimes(1)',
      output: 'expect(xyz).toHaveBeenCalledOnce()',
      errors: [{ messageId: 'preferCalledOnce', column: 13, line: 1 }],
    },
    {
      code: 'expect(xyz).not.toHaveBeenCalledTimes(1)',
      output: 'expect(xyz).not.toHaveBeenCalledOnce()',
      errors: [{ messageId: 'preferCalledOnce', column: 17, line: 1 }],
    },
  ],
});

new RuleTester({
  parser: require.resolve('@typescript-eslint/parser'),
}).run('prefer-to-have-been-called-once: typescript edition', rule, {
  valid: [
    "(expect('Model must be bound to an array if the multiple property is true') as any).toHaveBeenCalledTimes(2 as string)",
  ],
  invalid: [
    {
      code: 'expect(xyz).toHaveBeenCalledTimes(1 as unknown as string as unknown as any);',
      output: 'expect(xyz).toHaveBeenCalledOnce();',
      errors: [{ messageId: 'preferCalledOnce', column: 13, line: 1 }],
    },
    {
      code: 'expect(xyz).not.toHaveBeenCalledTimes(1 as number);',
      output: 'expect(xyz).not.toHaveBeenCalledOnce();',
      errors: [{ messageId: 'preferCalledOnce', column: 17, line: 1 }],
    },
  ],
});

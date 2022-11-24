# Suggest using `toBeFalse()` (`prefer-to-be-false`)

🔧 This rule is automatically fixable by the
[`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

<!-- end auto-generated rule header -->

For expecting a value to be `false`, `jest-extended` provides the `toBeFalse`
matcher.

## Rule details

This rule triggers a warning if `toBe()`, `toEqual()` or `toStrictEqual()` is
used to assert against the `false` literal.

The following patterns are considered warnings:

```js
expect(true).toBe(false);

expect(wasSuccessful).toEqual(false);

expect(fs.existsSync('/path/to/file')).toStrictEqual(false);
```

The following patterns are _not_ considered warnings:

```js
expect(true).toBeFalse();

expect(wasSuccessful).toBeFalse();

expect(fs.existsSync('/path/to/file')).toBeFalse();

test('returns false', () => {
  expect(areWeThereYet()).toBeFalse();
  expect(true).not.toBeFalse();
});
```

## Further Reading

- [`jest-extended#toBeFalse` matcher](https://github.com/jest-community/jest-extended#tobefalse)

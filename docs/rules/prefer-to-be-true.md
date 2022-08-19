# Suggest using `toBeTrue()` (`prefer-to-be-true`)

For expecting a value to be `true`, `jest-extended` provides the `toBeTrue`
matcher.

## Rule details

This rule triggers a warning if `toBe()`, `toEqual()` or `toStrictEqual()` is
used to assert against the `true` literal.

The following patterns are considered warnings:

```js
expect(false).toBe(true);

expect(wasSuccessful).toEqual(true);

expect(fs.existsSync('/path/to/file')).toStrictEqual(true);
```

The following patterns are _not_ considered warnings:

```js
expect(false).toBeTrue();

expect(wasSuccessful).toBeTrue();

expect(fs.existsSync('/path/to/file')).toBeTrue();

test('is jest cool', () => {
  expect(isJestCool()).toBeTrue();
  expect(false).not.toBeTrue();
});
```

## Further Reading

- [`jest-extended#toBeTrue` matcher](https://github.com/jest-community/jest-extended#tobetrue)

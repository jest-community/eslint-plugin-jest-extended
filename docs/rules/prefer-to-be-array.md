# Suggest using `toBeArray()` (`prefer-to-be-array`)

🔧 This rule is automatically fixable by the
[`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

<!-- end auto-generated rule header -->

For expecting a value to be an array, `jest-extended` provides the `toBeArray`
matcher.

## Rule details

This rule triggers a warning if an `expect` assertion is found asserting that a
value is an array using one of the following methods:

- Comparing the result of `Array.isArary(<value>)` to a boolean value,
- Comparing the result of `<value> instanceof Array` to a boolean value,
- Calling the `toBeInstanceOf` matcher with the `Array` class.

The following patterns are considered warnings:

```js
expect(Array.isArray([])).toBe(true);

expect(Array.isArray(myValue)).toStrictEqual(false);

expect(Array.isArray(theResults())).not.toBeFalse();

expect([] instanceof Array).toBe(true);

expect(myValue instanceof Array).toStrictEqual(false);

expect(theResults() instanceof Array).not.toBeFalse();

expect([]).toBeInstanceOf(true);

expect(myValue).resolves.toBeInstanceOf(Array);

expect(theResults()).not.toBeInstanceOf(Array);
```

The following patterns are _not_ considered warnings:

```js
expect(Array.isArray([])).toBeArray();

expect(Array.isArray(myValue)).not.toBeArray();

expect(myValue).resolves.toBeArray();

expect(Array.isArray(theResults())).toBeArray();
```

## Further Reading

- [`jest-extended#toBeArray` matcher](https://github.com/jest-community/jest-extended#tobearray)

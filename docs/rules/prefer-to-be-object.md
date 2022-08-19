# Suggest using `toBeObject()` (`prefer-to-be-object`)

For expecting a value to be an object, `jest-extended` provides the `toBeObject`
matcher.

## Rule details

This rule triggers a warning if an `expect` assertion is found asserting that a
value is an object using one of the following methods:

- Comparing the result of `<value> instanceof Object` to a boolean value,
- Calling the `toBeInstanceOf` matcher with the `Object` class.

The following patterns are considered warnings:

```js
expect([] instanceof Object).toBe(true);

expect(myValue instanceof Object).toStrictEqual(false);

expect(theResults() instanceof Object).not.toBeFalse();

expect([]).toBeInstanceOf(true);

expect(myValue).resolves.toBeInstanceOf(Object);

expect(theResults()).not.toBeInstanceOf(Object);
```

The following patterns are _not_ considered warnings:

```js
expect({}).toBeObject();

expect(myValue).not.toBeObject();

expect(queryApi()).resolves.toBeObject();

expect(theResults()).toBeObject();
```

## Further Reading

- [`jest-extended#toBeObject` matcher](https://github.com/jest-community/jest-extended#tobeobject)

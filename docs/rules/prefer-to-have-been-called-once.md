# Suggest using `toHaveBeenCalledOnce()` (`prefer-to-have-been-called-once`)

For expecting a mock or spy to have been called once, `jest-extended` provides
the `toHaveBeenCalledOnce` matcher.

## Rule details

This rule triggers a warning if an `expect` assertion is found asserting that a
mock or spy is called once using `toHaveBeenCalledTimes(1)`.

The following patterns are considered warnings:

```js
expect(myMock).toHaveBeenCalledTimes(1);
expect(mySpy).not.toHaveBeenCalledTimes(1);
```

The following patterns are _not_ considered warnings:

```js
expect(myMock).toHaveBeenCalledOnce();
expect(mySpy).not.toHaveBeenCalledOnce();
```

## Further Reading

- [`jest-extended#toHaveBeenCalledOnce` matcher](https://github.com/jest-community/jest-extended#tohavebeencalledonce)

<div align="center">
  <a href="https://eslint.org/">
    <img width="150" height="150" src="https://eslint.org/assets/img/logo.svg">
  </a>
  <a href="https://facebook.github.io/jest/">
    <img width="150" height="150" vspace="" hspace="25" src="https://jestjs.io/img/jest.png">
  </a>
  <h1>eslint-plugin-jest-extended</h1>
  <p>ESLint plugin for Jest Extended</p>
</div>

[![Actions Status](https://github.com/jest-community/eslint-plugin-jest-extended/workflows/Unit%20tests/badge.svg?branch=master)](https://github.com/jest-community/eslint-plugin-jest-extended/actions)
[![Renovate badge](https://badges.renovateapi.com/github/jest-community/eslint-plugin-jest-extended)](https://renovatebot.com/)

## Installation

```
$ yarn add --dev eslint eslint-plugin-jest-extended
```

**Note:** If you installed ESLint globally then you must also install
`eslint-plugin-jest-extended` globally.

## Usage

Add `jest-extended` to the plugins section of your `.eslintrc` configuration
file. You can omit the `eslint-plugin-` prefix:

```json
{
  "plugins": ["jest-extended"]
}
```

Then configure the rules you want to use under the rules section.

```json
{
  "rules": {
    "jest-extended/prefer-to-be-true": "warn",
    "jest-extended/prefer-to-be-false": "error"
  }
}
```

## Shareable configurations

### Recommended

This plugin does not export a recommended configuration, as the rules provided
by this plugin are about enforcing usage of preferred matchers for particular
patterns, rather than helping to prevent bugs & commonly overlooked traps.

### All

If you want to enable all rules instead of only some you can do so by adding the
`all` configuration to your `.eslintrc` config file:

```json
{
  "extends": ["plugin:jest-extended/all"]
}
```

Note that the `all` configuration may change in any release and is thus unsuited
for installations requiring long-term consistency.

## Rules

| Rule                    | Description                  | Fixable            |
| ----------------------- | ---------------------------- | ------------------ |
| [prefer-to-be-array][]  | Suggest using `toBeArray()`  | ![fixable-green][] |
| [prefer-to-be-false][]  | Suggest using `toBeFalse()`  | ![fixable-green][] |
| [prefer-to-be-object][] | Suggest using `toBeObject()` | ![fixable-green][] |
| [prefer-to-be-true][]   | Suggest using `toBeTrue()`   | ![fixable-green][] |

## Credit

- [eslint-plugin-jest](https://github.com/jest-community/eslint-plugin-jest)

## Related Projects

### eslint-plugin-jest

This project aims to provide linting rules to aid in writing tests using jest.

https://github.com/jest-community/eslint-plugin-jest

### eslint-plugin-jest-formatting

This project aims to provide formatting rules (auto-fixable where possible) to
ensure consistency and readability in jest test suites.

https://github.com/dangreenisrael/eslint-plugin-jest-formatting

[prefer-to-be-array]: docs/rules/prefer-to-be-array.md
[prefer-to-be-false]: docs/rules/prefer-to-be-false.md
[prefer-to-be-object]: docs/rules/prefer-to-be-object.md
[prefer-to-be-true]: docs/rules/prefer-to-be-true.md
[fixable-green]: https://img.shields.io/badge/-fixable-green.svg
[fixable-yellow]: https://img.shields.io/badge/-fixable-yellow.svg

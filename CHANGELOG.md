# [3.0.0-next.3](https://github.com/jest-community/eslint-plugin-jest-extended/compare/v3.0.0-next.2...v3.0.0-next.3) (2025-01-16)


### Features

* upgrade `@typescript-eslint/utils` to v6 ([#238](https://github.com/jest-community/eslint-plugin-jest-extended/issues/238)) ([3815685](https://github.com/jest-community/eslint-plugin-jest-extended/commit/381568546db6b94fc2a92386556b737f1551e262))

# [3.0.0-next.2](https://github.com/jest-community/eslint-plugin-jest-extended/compare/v3.0.0-next.1...v3.0.0-next.2) (2025-01-16)


### Features

* adjust Node constraints to match `eslint-plugin-jest` ([#235](https://github.com/jest-community/eslint-plugin-jest-extended/issues/235)) ([c9fb39c](https://github.com/jest-community/eslint-plugin-jest-extended/commit/c9fb39caa43e074e64fb9fdb4dbcbdb2822fc57a))


### BREAKING CHANGES

* Versions of Node v18 up to 18.11.x are no longer supported

# [3.0.0-next.1](https://github.com/jest-community/eslint-plugin-jest-extended/compare/v2.4.0...v3.0.0-next.1) (2025-01-16)


### Features

* drop support for Node v14 ([#232](https://github.com/jest-community/eslint-plugin-jest-extended/issues/232)) ([a3e953f](https://github.com/jest-community/eslint-plugin-jest-extended/commit/a3e953f06572f03777148f903f3e6486034468eb))


### BREAKING CHANGES

* drop support for Node v14

# [2.4.0](https://github.com/jest-community/eslint-plugin-jest-extended/compare/v2.3.0...v2.4.0) (2024-04-20)


### Features

* support ESLint v9 ([#185](https://github.com/jest-community/eslint-plugin-jest-extended/issues/185)) ([42d36b1](https://github.com/jest-community/eslint-plugin-jest-extended/commit/42d36b198d0c6b489636843475e8ebd9ea4e837d))

# [2.3.0](https://github.com/jest-community/eslint-plugin-jest-extended/compare/v2.2.0...v2.3.0) (2024-04-20)


### Features

* add should-be-fine support for flat configs ([#181](https://github.com/jest-community/eslint-plugin-jest-extended/issues/181)) ([7d106b0](https://github.com/jest-community/eslint-plugin-jest-extended/commit/7d106b0fc8eb99946ba760bd9f4feccc8fb6e18e))

# [2.2.0](https://github.com/jest-community/eslint-plugin-jest-extended/compare/v2.1.0...v2.2.0) (2024-04-19)


### Features

* support providing aliases for `@jest/globals` package ([#180](https://github.com/jest-community/eslint-plugin-jest-extended/issues/180)) ([d070ca7](https://github.com/jest-community/eslint-plugin-jest-extended/commit/d070ca79caf41e0974c8b048a741f0db8104e4d1))

# [2.1.0](https://github.com/jest-community/eslint-plugin-jest-extended/compare/v2.0.3...v2.1.0) (2024-04-19)


### Features

* support `failing.each` ([#179](https://github.com/jest-community/eslint-plugin-jest-extended/issues/179)) ([b2adda4](https://github.com/jest-community/eslint-plugin-jest-extended/commit/b2adda4cacf1616ce18bed4d655a8a5b533c6664))

## [2.0.3](https://github.com/jest-community/eslint-plugin-jest-extended/compare/v2.0.2...v2.0.3) (2024-04-19)


### Bug Fixes

* replace use of deprecated methods ([#178](https://github.com/jest-community/eslint-plugin-jest-extended/issues/178)) ([31c01ea](https://github.com/jest-community/eslint-plugin-jest-extended/commit/31c01ea02f4b8dbdf7e103efbde5aa9bd03fbfb2))

## [2.0.2](https://github.com/jest-community/eslint-plugin-jest-extended/compare/v2.0.1...v2.0.2) (2024-04-19)


### Performance Improvements

* use `Set` instead of iterating, and deduplicate a function ([#175](https://github.com/jest-community/eslint-plugin-jest-extended/issues/175)) ([d0652cd](https://github.com/jest-community/eslint-plugin-jest-extended/commit/d0652cdb82b692cdee0f2ef4616b96e89c6d4ddf))

## [2.0.1](https://github.com/jest-community/eslint-plugin-jest-extended/compare/v2.0.0...v2.0.1) (2024-04-19)


### Performance Improvements

* don't collect more info than needed when resolving jest functions ([#172](https://github.com/jest-community/eslint-plugin-jest-extended/issues/172)) ([08e130c](https://github.com/jest-community/eslint-plugin-jest-extended/commit/08e130c79df9e81e6b4c9c0e0f8b52885ee20ada))

# [2.0.0](https://github.com/jest-community/eslint-plugin-jest-extended/compare/v1.2.0...v2.0.0) (2022-08-25)


### Features

* drop support for `eslint@6` ([#26](https://github.com/jest-community/eslint-plugin-jest-extended/issues/26)) ([d3d40f3](https://github.com/jest-community/eslint-plugin-jest-extended/commit/d3d40f30266b00bf7182adcd90f52f3ccd1859ba))
* drop support for Node versions 12 and 17 ([#25](https://github.com/jest-community/eslint-plugin-jest-extended/issues/25)) ([14c90ed](https://github.com/jest-community/eslint-plugin-jest-extended/commit/14c90edffc359db59b1492fa9a94e361b6959f28))


### BREAKING CHANGES

* Support for ESLint version 6 is removed
* Node versions 12 and 17 are no longer supported

# [1.2.0](https://github.com/jest-community/eslint-plugin-jest-extended/compare/v1.1.0...v1.2.0) (2022-08-20)


### Features

* switch to new scope-based jest fn call parser to support `@jest/globals` ([#20](https://github.com/jest-community/eslint-plugin-jest-extended/issues/20)) ([35ddfed](https://github.com/jest-community/eslint-plugin-jest-extended/commit/35ddfedd58de975ca2c235a5295dfa28aab11ac5))

# [1.1.0](https://github.com/jest-community/eslint-plugin-jest-extended/compare/v1.0.0...v1.1.0) (2022-08-20)


### Features

* create `prefer-to-have-been-called-once` rule ([#19](https://github.com/jest-community/eslint-plugin-jest-extended/issues/19)) ([12e6372](https://github.com/jest-community/eslint-plugin-jest-extended/commit/12e6372ec54df6d768254bd528a970163a9fbc63))

# 1.0.0 (2022-08-15)


### Features

* bunch of updates ([#5](https://github.com/jest-community/eslint-plugin-jest-extended/issues/5)) ([8e45c68](https://github.com/jest-community/eslint-plugin-jest-extended/commit/8e45c682b7c287f2180b03c4e903288a69c32711))
* create `prefer-to-be-array` rule ([9bd067c](https://github.com/jest-community/eslint-plugin-jest-extended/commit/9bd067ccc37d7651f812782bde785868c9cadfb4))
* create `prefer-to-be-false` rule ([b35e45c](https://github.com/jest-community/eslint-plugin-jest-extended/commit/b35e45c23cb2aa660034ac49b5082c61f34de758))
* create `prefer-to-be-object` rule ([676de1d](https://github.com/jest-community/eslint-plugin-jest-extended/commit/676de1d77ba19430d96f5df93ce8f3a548c6acfe))
* create `prefer-to-be-true` rule ([22f8093](https://github.com/jest-community/eslint-plugin-jest-extended/commit/22f8093136c30212498b8a347891f1cff995003b))
* initial commit ([3ed88c4](https://github.com/jest-community/eslint-plugin-jest-extended/commit/3ed88c4699d2ef82780183bae00560282a3f1916))

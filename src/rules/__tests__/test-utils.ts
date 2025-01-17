import { createRequire } from 'module';
import { TSESLint } from '@typescript-eslint/utils';
import { version as eslintVersion } from 'eslint/package.json';
import * as semver from 'semver';

const require = createRequire(__filename);
const eslintRequire = createRequire(require.resolve('eslint'));

export const espreeParser = eslintRequire.resolve('espree');

export const usingFlatConfig = semver.major(eslintVersion) >= 9;

export class FlatCompatRuleTester extends TSESLint.RuleTester {
  public constructor(testerConfig?: TSESLint.RuleTesterConfig) {
    super(FlatCompatRuleTester._flatCompat(testerConfig));
  }

  public override run<
    TMessageIds extends string,
    TOptions extends readonly unknown[],
  >(
    ruleName: string,
    rule: TSESLint.RuleModule<TMessageIds, TOptions>,
    tests: TSESLint.RunTests<TMessageIds, TOptions>,
  ) {
    super.run(ruleName, rule, {
      valid: tests.valid.map(t => FlatCompatRuleTester._flatCompat(t)),
      invalid: tests.invalid.map(t => FlatCompatRuleTester._flatCompat(t)),
    });
  }

  /* istanbul ignore next */
  private static _flatCompat<
    T extends
      | undefined
      | RuleTesterConfig
      | string
      | TSESLint.ValidTestCase<unknown[]>
      | TSESLint.InvalidTestCase<string, unknown[]>,
  >(config: T): T {
    if (!config || !usingFlatConfig || typeof config === 'string') {
      return config;
    }

    const obj: FlatConfig.Config & {
      languageOptions: FlatConfig.LanguageOptions & {
        parserOptions: FlatConfig.ParserOptions;
      };
    } = {
      languageOptions: { parserOptions: {} },
    };

    for (const [key, value] of Object.entries(config)) {
      if (key === 'parser') {
        obj.languageOptions.parser = require(value);

        continue;
      }

      if (key === 'parserOptions') {
        for (const [option, val] of Object.entries(value)) {
          if (option === 'ecmaVersion' || option === 'sourceType') {
            // @ts-expect-error: TS thinks the value could the opposite type of whatever option is
            obj.languageOptions[option] = val as FlatConfig.LanguageOptions[
              | 'ecmaVersion'
              | 'sourceType'];

            continue;
          }

          obj.languageOptions.parserOptions[option] = val;
        }

        continue;
      }

      obj[key as keyof typeof obj] = value;
    }

    return obj as unknown as T;
  }
}

type RuleTesterConfig = TSESLint.RuleTesterConfig | FlatConfig.Config;

export declare namespace FlatConfig {
  type EcmaVersion = TSESLint.EcmaVersion;
  type ParserOptions = TSESLint.ParserOptions;
  type SourceType = TSESLint.SourceType | 'commonjs';
  interface LanguageOptions {
    /**
     * The version of ECMAScript to support.
     * May be any year (i.e., `2022`) or version (i.e., `5`).
     * Set to `"latest"` for the most recent supported version.
     * @default "latest"
     */
    ecmaVersion?: EcmaVersion;
    /**
     * An object specifying additional objects that should be added to the global scope during linting.
     */
    globals?: unknown;
    /**
     * An object containing a `parse()` method or a `parseForESLint()` method.
     * @default
     * ```
     * // https://github.com/eslint/espree
     * require('espree')
     * ```
     */
    parser?: unknown;
    /**
     * An object specifying additional options that are passed directly to the parser.
     * The available options are parser-dependent.
     */
    parserOptions?: ParserOptions;
    /**
     * The type of JavaScript source code.
     * Possible values are `"script"` for traditional script files, `"module"` for ECMAScript modules (ESM), and `"commonjs"` for CommonJS files.
     * @default
     * ```
     * // for `.js` and `.mjs` files
     * "module"
     * // for `.cjs` files
     * "commonjs"
     * ```
     */
    sourceType?: SourceType;
  }
  interface Config {
    /**
     * An array of glob patterns indicating the files that the configuration object should apply to.
     * If not specified, the configuration object applies to all files matched by any other configuration object.
     */
    files?: string[];
    /**
     * An array of glob patterns indicating the files that the configuration object should not apply to.
     * If not specified, the configuration object applies to all files matched by files.
     */
    ignores?: string[];
    /**
     * An object containing settings related to how JavaScript is configured for linting.
     */
    languageOptions?: LanguageOptions;
    /**
     * An object containing settings related to the linting process.
     */
    linterOptions?: unknown;
    /**
     * An object containing a name-value mapping of plugin names to plugin objects.
     * When `files` is specified, these plugins are only available to the matching files.
     */
    plugins?: unknown;
    /**
     * An object containing the configured rules.
     * When `files` or `ignores` are specified, these rule configurations are only available to the matching files.
     */
    rules?: unknown;
    /**
     * An object containing name-value pairs of information that should be available to all rules.
     */
    settings?: unknown;
  }
}

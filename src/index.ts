import { readdirSync } from 'fs';
import { join, parse } from 'path';
import { TSESLint, TSESTree } from '@typescript-eslint/utils';
import {
  name as packageName,
  version as packageVersion,
} from '../package.json';

type RuleModule = TSESLint.RuleModule<string, unknown[]> & {
  meta: Required<Pick<TSESLint.RuleMetaData<string>, 'docs'>>;
};

// v5 of `@typescript-eslint/experimental-utils` removed this
declare module '@typescript-eslint/utils/dist/ts-eslint/Rule' {
  export interface RuleMetaDataDocs {
    category: 'Best Practices' | 'Possible Errors' | 'Stylistic Issues';
  }
}

declare module '@typescript-eslint/utils/dist/ts-eslint/SourceCode' {
  export interface SourceCode {
    /**
     * Returns the scope of the given node.
     * This information can be used track references to variables.
     * @since 8.37.0
     */
    getScope(node: TSESTree.Node): TSESLint.Scope.Scope;
  }
}

// copied from https://github.com/babel/babel/blob/d8da63c929f2d28c401571e2a43166678c555bc4/packages/babel-helpers/src/helpers.js#L602-L606
/* istanbul ignore next */
const interopRequireDefault = (obj: any): { default: any } =>
  obj && obj.__esModule ? obj : { default: obj };

const importDefault = (moduleName: string) =>
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  interopRequireDefault(require(moduleName)).default;

const rulesDir = join(__dirname, 'rules');
const excludedFiles = ['__tests__', 'utils'];

const rules = readdirSync(rulesDir)
  .map(rule => parse(rule).name)
  .filter(rule => !excludedFiles.includes(rule))
  .reduce<Record<string, RuleModule>>(
    (acc, curr) => ({
      ...acc,
      [curr]: importDefault(join(rulesDir, curr)) as RuleModule,
    }),
    {},
  );

const recommendedRules = Object.entries(rules)
  .filter(([, rule]) => rule.meta.docs.recommended)
  .reduce(
    /* istanbul ignore next */
    (acc, [name, rule]) => ({
      ...acc,
      [`jest-extended/${name}`]: rule.meta.docs.recommended,
    }),
    {},
  );

const allRules = Object.entries(rules)
  .filter(([, rule]) => !rule.meta.deprecated)
  .reduce(
    (acc, [name]) => ({
      ...acc,
      [`jest-extended/${name}`]: 'error',
    }),
    {},
  );

const plugin = {
  meta: { name: packageName, version: packageVersion },
  // ugly cast for now to keep TypeScript happy since
  // we don't have types for flat config yet
  configs: {} as Record<
    'all' | 'recommended' | 'flat/all' | 'flat/recommended',
    Pick<Required<TSESLint.Linter.Config>, 'rules'>
  >,
  rules,
};

const createRCConfig = (rules: Record<string, TSESLint.Linter.RuleLevel>) => ({
  plugins: ['jest-extended'],
  rules,
});

const createFlatConfig = (
  rules: Record<string, TSESLint.Linter.RuleLevel>,
) => ({
  plugins: { 'jest-extended': plugin },
  rules,
});

plugin.configs = {
  all: createRCConfig(allRules),
  recommended: createRCConfig(recommendedRules),
  'flat/all': createFlatConfig(allRules),
  'flat/recommended': createFlatConfig(recommendedRules),
};

export = plugin;

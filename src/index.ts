import { readdirSync } from 'fs';
import { join, parse } from 'path';
import type { TSESLint, TSESTree } from '@typescript-eslint/utils';
import {
  name as packageName,
  version as packageVersion,
} from '../package.json';

type RuleModule = TSESLint.RuleModule<string, unknown[]> & {
  meta: Required<Pick<TSESLint.RuleMetaData<string>, 'docs'>>;
};

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

const rules = Object.fromEntries(
  readdirSync(rulesDir)
    .map(rule => parse(rule).name)
    .filter(rule => !excludedFiles.includes(rule))
    .map(rule => [rule, importDefault(join(rulesDir, rule)) as RuleModule]),
);

const recommendedRules = {} satisfies Record<string, TSESLint.Linter.RuleLevel>;

const allRules = Object.fromEntries<TSESLint.Linter.RuleLevel>(
  Object.entries(rules)
    .filter(([, rule]) => !rule.meta.deprecated)
    .map(([name]) => [`jest-extended/${name}`, 'error']),
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

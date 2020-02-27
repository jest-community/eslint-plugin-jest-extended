import { readdirSync } from 'fs';
import { join, parse } from 'path';

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
  .reduce(
    (acc, curr) =>
      Object.assign(acc, { [curr]: importDefault(join(rulesDir, curr)) }),
    {},
  );

const allRules = Object.keys(rules).reduce<Record<string, string>>(
  (rules, key) => ({ ...rules, [`jest/${key}`]: 'error' }),
  {},
);

export = {
  configs: {
    all: {
      plugins: ['jest-extended'],
      rules: allRules,
    },
    recommended: {
      plugins: ['jest-extended'],
      rules: {},
    },
  },
  rules,
};

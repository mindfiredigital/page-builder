module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'scope-enum': [2, 'always', ['core', 'react', 'web-component','angular', 'docs','release']],
    'scope-empty': [2, 'never'],
    'scope-case': [2, 'always', 'lower-case'],
  },
  ignores: [message => message.includes('[skip-commitlint]')],
};

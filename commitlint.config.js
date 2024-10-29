module.exports = {
  extends: ['@commitlint/config-conventional'],
  ignores: [message => message.includes('[skip-commitlint]')],
  rules: {
    'type-enum': [
      2,
      'always',
      ['feat', 'fix', 'docs', 'style', 'refactor', 'test', 'chore'],
    ],
    'subject-empty': [2, 'never'],
    'type-empty': [2, 'never'],
    'subject-full-stop': [2, 'never', '.'],
    'subject-max-length': [2, 'always', 100],
    'subject-case': [0, 'never'],
  },
};

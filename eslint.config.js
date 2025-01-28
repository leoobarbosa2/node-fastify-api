module.exports = {
  "parser": "@typescript-eslint/parser",
    'rules': {
        'indent': ['error', 2],
        'quotes': ['error', 'single'],
        'semi': ['off'],
        'no-empty': 'warn',
        'no-cond-assign': ['error', 'always'],
        'for-direction': 'off',
        'comma-dangle': ['error', 'always-multiline'],
        'semi': ['error', 'never'],
        'no-trailing-spaces': ['error'],
        "no-multi-spaces": ["error", {"ignoreEOLComments": true}],
        'no-multiple-empty-lines': ['error', { 'max': 1 }],
        'padded-blocks': ['error', 'never'],
        'object-curly-newline': ['error', { 'consistent': true }],
        'object-curly-spacing': ['error', 'always'],
        'no-trailing-spaces': 'error',
    },
    'files': ['src/**/*.ts']
};
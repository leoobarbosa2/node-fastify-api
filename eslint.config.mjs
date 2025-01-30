import eslint from '@eslint/js'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  eslint.configs.recommended,
  tseslint.configs.recommended,
  {
    rules: {
      'indent': ['error', 2],
      'quotes': ['error', 'single'],
      'no-empty': 'warn',
      'no-cond-assign': ['error', 'always'],
      'for-direction': 'off',
      'comma-dangle': ['error', 'always-multiline'],
      'semi': ['error', 'never'],
      'no-multi-spaces': ['error', { 'ignoreEOLComments': true }],
      'no-multiple-empty-lines': ['error', { 'max': 1 }],
      'padded-blocks': ['error', 'never'],
      'object-curly-newline': ['error', { 'consistent': true }],
      'object-curly-spacing': ['error', 'always'],
      'no-trailing-spaces': 'error',
    },
  },
)
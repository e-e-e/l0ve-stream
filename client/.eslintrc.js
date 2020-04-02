module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: [
    '@typescript-eslint',
    'prettier'
  ],
  rules: {
    "@typescript-eslint/explicit-function-return-type": 0,
    "prettier/prettier": "error"
  },
  extends: [
    "prettier",
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    "plugin:react/recommended"
  ],
};

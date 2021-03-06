module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: [
    '@typescript-eslint',
    'prettier'
  ],
  settings: {
    react: {
      version: "detect",
    }
  },
  rules: {
    "@typescript-eslint/explicit-function-return-type": 0,
    "prettier/prettier": "error",
    "react/display-name": 0,
    "eqeqeq": [2, "smart"]
  },
  extends: [
    "prettier",
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    "plugin:react/recommended"
  ],
};

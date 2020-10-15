module.exports = {
  root: true,

  env: {
    browser: true,
    es6: true,
  },

  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    }
  },

  parser: '@typescript-eslint/parser',

  plugins: [
    '@typescript-eslint',
  ],

  extends: [
    'eslint:recommended',
  ],

  rules: {
    'no-redeclare': 0,
    'no-unused-vars': 0,
    'semi': ['error', 'never'],
    '@typescript-eslint/no-redeclare': [2],
    '@typescript-eslint/no-unused-vars': [2, {args: 'none'}]
  },

  globals: {
    wx: true,
    CDN: true,
    PROD: true,
    PIXI: true,
    IEvent: true,
    IScene: true,
    canvas: true,
    screen: 'off',
    CLOUD_ID: true,
    GameGlobal: true,
    ILevelData: true,
    dragonBones: true,
  }
}

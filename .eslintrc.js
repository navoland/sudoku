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
    semi: ['error', 'never']
  },

  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      rules: {'@typescript-eslint/no-unused-vars': [2, {args: 'none'}]}
    }
  ],

  globals: {
    wx: true,
    CDN: true,
    PROD: true,
    PIXI: true,
    canvas: true,
    screen: 'off',
    CLOUD_ID: true,
    GameGlobal: true,
    dragonBones: true,
  }
}

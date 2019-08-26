module.exports = {
    extends: [
        'gemini-testing',
        'plugin:react/recommended'
    ],
    plugins: [
        'react'
    ],
    parser: 'babel-eslint',
    parserOptions: {
        ecmaVersion: 2017,
        sourceType: 'module',
        ecmaFeatures: {
            jsx: true
        }
    },
    env: {
        "browser": true,
        "commonjs": true,
        "node": true
    }
};

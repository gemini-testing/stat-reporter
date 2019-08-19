module.exports = {
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
    extends:[
        'gemini-testing',
        'plugin:react/recommended'
    ],
    root: true,
    "env": {
        "browser": true
    }
};

/* eslint-env node */

module.exports = {
    parser: '@typescript-eslint/parser',
    parserOptions: {
        project: './tsconfig.json',
    },
    plugins: ['@typescript-eslint'],
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
    ],
    rules: {
        'no-unused-vars': 'warn', // Warns for unused variables
        'prefer-const': 'warn', // Warns when a variable can be declared as const
        'indent': ['warn', 4], // Enforces 4-space indentation
        'quotes': ['warn', 'double'], // Enforces the use of double quotes
        "@typescript-eslint/no-namespace": "off", // I want my namespaces
    }
};

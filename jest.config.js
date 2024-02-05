/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/tests/**/*.test.ts'],
  testPathIgnorePatterns: ['python-moch-api'],
  moduleNameMapper: {
    '^@src/(.*)$': '<rootDir>/src/$1', // Map @src/* to ./src/*
    '^@tools/(.*)$': '<rootDir>/src/tools/$1', // Map @tools/* to ./src/tools/*
    '^@unit:data(.*)$': '<rootDir>/tests/unit/data/$1' // Map @unit:data/* to ./tests/unit/data/*
  },
};
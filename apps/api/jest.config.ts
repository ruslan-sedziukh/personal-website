export default {
  displayName: 'api',
  preset: '../../jest.preset.js',
  testEnvironment: 'node',
  testMatch: ['<rootDir>/src/**/*.spec.ts', '<rootDir>/test/**/*.ts'],
  transform: {
    '^.+\\.[tj]s$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.spec.json' }],

    '^.+\\.m?js$': [
      '@swc/jest',
      {
        jsc: {
          target: 'es2022',
          parser: {
            syntax: 'ecmascript',
          },
        },
        module: {
          type: 'commonjs',
        },
      },
    ],
  },
  transformIgnorePatterns: [],
  moduleFileExtensions: ['ts', 'js', 'mjs'],
  coverageDirectory: '../../coverage/apps/api',
  setupFilesAfterEnv: ['<rootDir>/jest-setup.ts'],
};

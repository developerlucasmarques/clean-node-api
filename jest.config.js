module.exports = {
  roots: ['<rootDir>/src'],
  clearMocks: true,
  collectCoverageFrom: [
    '<rootDir>/src/**/*.ts',
    '!<rootDir>/src/main/**',
    '!<rootDir>/src/shared/**',
    '!<rootDir>/src/**/index.ts'
  ],
  testEnvironment: 'node',
  preset: '@shelf/jest-mongodb',
  transform: {
    '.+\\.ts$': 'ts-jest'
  },
  coveragePathIgnorePatterns: [
    'presentation/protocols/index.ts',
    'controllers/signup/signup-protocols.ts',
    'data/usecases/add-account/db-add-account-protocols.ts'
  ]
}

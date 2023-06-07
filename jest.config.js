module.exports = {
  roots: ['<rootDir>/src'],
  clearMocks: true,
  collectCoverageFrom: ['<rootDir>/src/**/*.ts'],
  testEnvironment: 'node',
  transform: {
    '.+\\.ts$': 'ts-jest'
  },
  coveragePathIgnorePatterns: [
    'presentation/protocols/index.ts',
    'controllers/signup/signup-protocols.ts',
    'data/usecases/add-account/db-add-account-protocols.ts'
  ]
}

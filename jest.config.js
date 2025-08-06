module.exports = {
  // Test environment
  testEnvironment: 'node',
  
  // Root directory for tests
  rootDir: '.',
  
  // Test file patterns
  testMatch: [
    '**/__tests__/**/*.js',
    '**/*.test.js',
    '**/*.spec.js'
  ],
  
  // Ignore patterns
  testPathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/dist/',
    '<rootDir>/build/',
    '<rootDir>/coverage/',
    '<rootDir>/.next/',
    '<rootDir>/generated/'
  ],
  
  // File extensions to consider
  moduleFileExtensions: [
    'js',
    'ts',
    'json'
  ],
  
  // Module name mapping
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/validation/$1',
    '^@schemas/(.*)$': '<rootDir>/schemas/$1',
    '^@examples/(.*)$': '<rootDir>/schemas/v2.1.0/examples/$1'
  },
  
  // Setup files
  setupFilesAfterEnv: [
    '<rootDir>/tests/setup.js'
  ],
  
  // Transform configuration (only for JS since we don't have TypeScript setup)
  transform: {},
  
  
  // Coverage configuration
  collectCoverage: false, // Enable with --coverage flag
  collectCoverageFrom: [
    'validation/**/*.js',
    '!validation/**/*.test.js',
    '!validation/**/*.spec.js',
    '!**/node_modules/**',
    '!**/dist/**',
    '!**/build/**'
  ],
  
  coverageDirectory: 'coverage',
  
  coverageReporters: [
    'text',
    'text-summary',
    'html',
    'lcov',
    'clover'
  ],
  
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    },
    './validation/schema-validator.js': {
      branches: 90,
      functions: 90,
      lines: 90,
      statements: 90
    }
  },
  
  // Verbose output
  verbose: true,
  
  // Error reporting
  errorOnDeprecated: true,
  
  // Test timeout (in milliseconds)
  testTimeout: 10000,
  
  // Clear mocks between tests
  clearMocks: true,
  
  // Restore mocks after each test
  restoreMocks: true,
  
  // Watch plugins
  watchPlugins: [],
  
  // Reporter configuration
  reporters: ['default'],
  
  // Global test configuration
  globals: {
    __DEV__: true,
    __TEST__: true
  }
};
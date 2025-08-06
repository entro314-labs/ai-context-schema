module.exports = {
  root: true,
  env: {
    node: true,
    es2022: true,
    jest: true
  },
  extends: ['eslint:recommended', 'standard'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
    project: './tsconfig.json'
  },
  plugins: ['@typescript-eslint', 'import', 'promise', 'node'],
  rules: {
    // General JavaScript/TypeScript rules
    indent: ['error', 2],
    quotes: ['error', 'single'],
    semi: ['error', 'always'],
    'comma-dangle': ['error', 'never'],
    'no-trailing-spaces': 'error',
    'eol-last': 'error',
    'no-multiple-empty-lines': ['error', { max: 2, maxEOF: 1 }],

    // TypeScript-specific rules
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/prefer-nullish-coalescing': 'error',
    '@typescript-eslint/prefer-optional-chain': 'error',

    // Import rules
    'import/order': [
      'error',
      {
        groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
        'newlines-between': 'always',
        alphabetize: {
          order: 'asc',
          caseInsensitive: true
        }
      }
    ],
    'import/newline-after-import': 'error',
    'import/no-duplicates': 'error',

    // Node.js rules
    'node/no-missing-import': 'off', // Handled by TypeScript
    'node/no-missing-require': 'off', // Handled by TypeScript
    'node/no-unsupported-features/es-syntax': 'off', // We use modern ES features

    // Promise rules
    'promise/catch-or-return': 'error',
    'promise/no-return-wrap': 'error',
    'promise/param-names': 'error',
    'promise/always-return': 'off', // Allow async/await without explicit returns

    // Security and best practices
    'no-eval': 'error',
    'no-implied-eval': 'error',
    'no-new-func': 'error',
    'no-script-url': 'error',
    'no-console': ['warn', { allow: ['warn', 'error', 'info'] }],
    'no-debugger': 'error',
    'no-alert': 'error',

    // Code quality
    complexity: ['warn', 15],
    'max-depth': ['warn', 5],
    'max-lines': ['warn', 500],
    'max-lines-per-function': ['warn', 100],
    'max-params': ['warn', 5],

    // Schema validation specific rules
    'no-magic-numbers': 'off', // Schema validation often uses specific numbers
    camelcase: ['error', { properties: 'never', ignoreDestructuring: true }] // Allow snake_case in schemas
  },
  overrides: [
    {
      // Test files
      files: ['**/*.test.js', '**/*.test.ts', '**/*.spec.js', '**/*.spec.ts'],
      env: {
        jest: true
      },
      rules: {
        'no-magic-numbers': 'off',
        'max-lines-per-function': 'off',
        '@typescript-eslint/no-explicit-any': 'off'
      }
    },
    {
      // Configuration files
      files: ['*.config.js', '*.config.ts', '.eslintrc.js'],
      rules: {
        'no-magic-numbers': 'off',
        '@typescript-eslint/no-var-requires': 'off'
      }
    },
    {
      // Schema validation files
      files: ['validation/**/*.js', 'validation/**/*.ts'],
      rules: {
        'no-magic-numbers': 'off', // Validation often uses HTTP status codes, etc.
        complexity: ['warn', 20] // Validation logic can be complex
      }
    },
    {
      // CLI scripts
      files: ['validation/schema-validator.js', 'validation/compatibility-checker.js'],
      rules: {
        'no-console': 'off', // CLI tools need console output
        'node/shebang': 'off' // Allow shebang in CLI scripts
      }
    }
  ],
  ignorePatterns: [
    'node_modules/',
    'dist/',
    'build/',
    'coverage/',
    '*.d.ts',
    '.next/',
    '.nuxt/',
    '.output/',
    '.vuepress/dist',
    '.serverless/',
    '.fusebox/',
    '.dynamodb/',
    '.tern-port',
    'test-results/',
    'test-output/',
    'generated/',
    'schemas/v2.1.0/examples/*.yaml', // Don't lint YAML files
    'schemas/v2.1.0/examples/*.yml'
  ]
};

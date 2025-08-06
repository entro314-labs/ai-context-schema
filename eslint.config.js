const js = require('@eslint/js');

module.exports = [
  js.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        console: 'readonly',
        process: 'readonly',
        require: 'readonly',
        module: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
        Buffer: 'readonly',
        global: 'readonly',
        setImmediate: 'readonly',
        clearImmediate: 'readonly'
      }
    },
    rules: {
      // General JavaScript rules
      'indent': ['error', 2],
      'quotes': ['error', 'single'],
      'semi': ['error', 'always'],
      'comma-dangle': ['error', 'never'],
      'no-trailing-spaces': 'error',
      'eol-last': 'error',
      'no-multiple-empty-lines': ['error', { max: 2, maxEOF: 1 }],
      'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      
      // Security and best practices
      'no-eval': 'error',
      'no-implied-eval': 'error',
      'no-new-func': 'error',
      'no-console': ['warn', { allow: ['warn', 'error', 'info'] }],
      'no-debugger': 'error',
      
      // Code quality
      'complexity': ['warn', 15],
      'max-depth': ['warn', 5],
      'max-params': ['warn', 5],
      
      // Schema validation specific rules
      'no-magic-numbers': 'off',
      'camelcase': ['error', { properties: 'never', ignoreDestructuring: true }]
    }
  },
  {
    files: ['validation/**/*.js'],
    rules: {
      'no-console': 'off', // CLI tools need console output
      'complexity': ['warn', 20] // Validation logic can be complex
    }
  },
  {
    ignores: [
      'node_modules/',
      'dist/',
      'build/',
      'coverage/',
      '*.d.ts',
      '.next/',
      '.nuxt/',
      '.output/',
      'test-results/',
      'test-output/',
      'generated/',
      'schemas/v2.1.0/examples/*.yaml',
      'schemas/v2.1.0/examples/*.yml'
    ]
  }
];
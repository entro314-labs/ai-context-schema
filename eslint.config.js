const js = require('@eslint/js');

module.exports = [
  js.configs.recommended,
  {
    plugins: {
      'simple-import-sort': require('eslint-plugin-simple-import-sort'),
      jsdoc: require('eslint-plugin-jsdoc'),
      security: require('eslint-plugin-security'),
      sonarjs: require('eslint-plugin-sonarjs'),
      n: require('eslint-plugin-n')
    },
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
        clearImmediate: 'readonly',
        setTimeout: 'readonly',
        clearTimeout: 'readonly'
      }
    },
    rules: {
      // Import/export organization
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',

      // JSDoc rules for validation functions
      'jsdoc/check-alignment': 'error',
      'jsdoc/check-param-names': 'error',
      'jsdoc/check-tag-names': 'error',
      'jsdoc/check-types': 'error',
      'jsdoc/implements-on-classes': 'error',
      'jsdoc/no-undefined-types': 'error',
      'jsdoc/require-description': 'warn',
      'jsdoc/require-jsdoc': [
        'warn',
        {
          require: {
            FunctionDeclaration: true,
            MethodDefinition: true,
            ClassDeclaration: true,
            ArrowFunctionExpression: false,
            FunctionExpression: false
          }
        }
      ],
      'jsdoc/require-param': 'error',
      'jsdoc/require-param-description': 'warn',
      'jsdoc/require-param-name': 'error',
      'jsdoc/require-param-type': 'error',
      'jsdoc/require-returns': 'error',
      'jsdoc/require-returns-description': 'warn',
      'jsdoc/require-returns-type': 'error',
      'jsdoc/valid-types': 'error',

      // Security rules
      'security/detect-buffer-noassert': 'error',
      'security/detect-child-process': 'warn',
      'security/detect-disable-mustache-escape': 'error',
      'security/detect-eval-with-expression': 'error',
      'security/detect-new-buffer': 'error',
      'security/detect-no-csrf-before-method-override': 'error',
      'security/detect-non-literal-fs-filename': 'warn',
      'security/detect-non-literal-regexp': 'warn',
      'security/detect-non-literal-require': 'warn',
      'security/detect-object-injection': 'warn',
      'security/detect-possible-timing-attacks': 'warn',
      'security/detect-pseudoRandomBytes': 'error',
      'security/detect-unsafe-regex': 'error',

      // SonarJS rules for code quality
      'sonarjs/cognitive-complexity': ['error', 15],
      'sonarjs/no-collapsible-if': 'error',
      'sonarjs/no-duplicate-string': ['error', { threshold: 4 }],
      'sonarjs/no-duplicated-branches': 'error',
      'sonarjs/no-identical-conditions': 'error',
      'sonarjs/no-identical-functions': 'error',
      'sonarjs/no-redundant-boolean': 'error',
      'sonarjs/no-small-switch': 'error',
      'sonarjs/no-unused-collection': 'error',
      'sonarjs/prefer-immediate-return': 'error',
      'sonarjs/prefer-single-boolean-return': 'error',

      // Node.js specific rules
      'n/no-deprecated-api': 'error',
      'n/no-missing-require': 'error',
      'n/no-unpublished-require': 'off', // Allow dev dependencies in config files
      'n/process-exit-as-throw': 'error',

      // General JavaScript rules
      indent: ['error', 2],
      quotes: ['error', 'single'],
      semi: ['error', 'always'],
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
      complexity: ['warn', 20],
      'max-depth': ['warn', 6],
      'max-params': ['warn', 5],

      // Schema validation specific rules
      'no-magic-numbers': 'off',
      camelcase: ['error', { properties: 'never', ignoreDestructuring: true }]
    }
  },
  {
    files: ['validation/**/*.js'],
    rules: {
      'no-console': 'off', // CLI tools need console output
      complexity: ['warn', 25], // Validation logic can be complex
      'sonarjs/cognitive-complexity': ['warn', 25], // Validation logic can be complex
      'security/detect-unsafe-regex': 'warn', // Allow regex in validation code
      'jsdoc/no-undefined-types': 'off', // Allow custom types in validation
      'jsdoc/require-returns-description': 'warn' // Relax return descriptions
    }
  },
  {
    files: ['**/*.test.js', '**/*.spec.js', '**/tests/**/*.js'],
    languageOptions: {
      globals: {
        describe: 'readonly',
        test: 'readonly',
        it: 'readonly',
        expect: 'readonly',
        beforeEach: 'readonly',
        afterEach: 'readonly',
        beforeAll: 'readonly',
        afterAll: 'readonly',
        jest: 'readonly'
      }
    },
    rules: {
      'no-console': 'warn', // Allow console in tests but warn
      'security/detect-object-injection': 'warn', // Tests often use dynamic properties
      'security/detect-non-literal-fs-filename': 'warn' // Tests use dynamic file paths
    }
  },
  // JSON Schema specific linting
  {
    files: ['**/*.json'],
    plugins: {
      jsonc: require('eslint-plugin-jsonc')
    },
    languageOptions: {
      parser: require('jsonc-eslint-parser')
    },
    rules: {
      'jsonc/indent': ['error', 2],
      'jsonc/key-name-casing': 'off', // Allow any casing for schema properties
      'jsonc/no-comments': 'off', // Allow comments in JSON schema files
      'jsonc/quote-props': ['error', 'always'],
      'jsonc/quotes': ['error', 'double'],
      'jsonc/sort-keys': 'off', // Schema order matters for readability
      'jsonc/valid-json-number': 'error'
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
      'pnpm-lock.yaml' // Don't lint package lock file
    ]
  }
];

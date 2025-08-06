#!/usr/bin/env node

/**
 * AI Context Schema Compatibility Checker
 * Tests platform adapter implementations for compatibility and correctness
 */

const fs = require('fs');
const path = require('path');
const { SchemaValidator } = require('./schema-validator');

class CompatibilityChecker {
  constructor() {
    this.validator = new SchemaValidator();
    this.results = {
      platforms: {},
      schemas: {},
      summary: {
        total: 0,
        compatible: 0,
        incompatible: 0,
        errors: []
      }
    };
  }

  /**
   * Check compatibility for all platforms and schemas
   * @param {string} schemasDir - Directory containing schema files
   * @returns {Object} Compatibility results
   */
  async checkCompatibility(schemasDir) {
    const schemaFiles = this.findSchemaFiles(schemasDir);
    const schemas = [];

    // Parse all schemas
    for (const filePath of schemaFiles) {
      try {
        const content = fs.readFileSync(filePath, 'utf8');
        const schema = this.validator.parseSchema(content);
        const validation = this.validator.validateSchema(schema, filePath);

        if (validation.valid) {
          schemas.push({ schema, filePath });
        } else {
          this.results.summary.errors.push({
            type: 'invalid_schema',
            filePath,
            message: 'Schema validation failed'
          });
        }
      } catch (error) {
        this.results.summary.errors.push({
          type: 'parse_error',
          filePath,
          message: error.message
        });
      }
    }

    // Check platform compatibility
    const platforms = this.extractPlatforms(schemas);

    for (const platform of platforms) {
      this.results.platforms[platform] = await this.checkPlatformCompatibility(
        platform,
        schemas
      );
    }

    // Check individual schema compatibility
    for (const { schema } of schemas) {
      this.results.schemas[schema.id] = this.checkSchemaCompatibility(schema);
    }

    this.generateSummary();
    return this.results;
  }

  /**
   * Find all schema files in directory
   * @param {string} dir - Directory to search
   * @returns {string[]} Array of file paths
   */
  findSchemaFiles(dir) {
    const files = [];

    const scan = (currentDir) => {
      const entries = fs.readdirSync(currentDir);

      for (const entry of entries) {
        const fullPath = path.join(currentDir, entry);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
          scan(fullPath);
        } else if (entry.endsWith('.yaml') || entry.endsWith('.yml')) {
          files.push(fullPath);
        }
      }
    };

    scan(dir);
    return files;
  }

  /**
   * Extract all platforms mentioned in schemas
   * @param {Array} schemas - Array of schema objects
   * @returns {string[]} Array of platform names
   */
  extractPlatforms(schemas) {
    const platforms = new Set();

    for (const { schema } of schemas) {
      if (schema.platforms) {
        Object.keys(schema.platforms).forEach(platform => platforms.add(platform));
      }
    }

    return Array.from(platforms);
  }

  /**
   * Check compatibility for a specific platform
   * @param {string} platform - Platform name
   * @param {Array} schemas - Array of schema objects
   * @returns {Object} Platform compatibility results
   */
  async checkPlatformCompatibility(platform, schemas) {
    const result = {
      platform,
      total: 0,
      compatible: 0,
      incompatible: 0,
      issues: [],
      features: {
        supported: [],
        unsupported: [],
        limitations: []
      }
    };

    const compatibleSchemas = schemas.filter(({ schema }) =>
      schema.platforms?.[platform]?.compatible === true
    );

    result.total = schemas.length;
    result.compatible = compatibleSchemas.length;
    result.incompatible = result.total - result.compatible;

    // Check platform-specific features
    for (const { schema } of compatibleSchemas) {
      const platformConfig = schema.platforms[platform];
      const issues = this.validatePlatformFeatures(platform, platformConfig, schema);
      result.issues.push(...issues);
    }

    // Analyze platform capabilities
    result.features = this.analyzePlatformFeatures(platform, compatibleSchemas);

    return result;
  }

  /**
   * Validate platform-specific features
   * @param {string} platform - Platform name
   * @param {Object} config - Platform configuration
   * @param {Object} schema - Full schema object
   * @returns {Array} Array of issues
   */
  validatePlatformFeatures(platform, config, schema) {
    const issues = [];

    switch (platform) {
    case 'claude-code':
      issues.push(...this.validateClaudeFeatures(config, schema));
      break;
    case 'cursor':
      issues.push(...this.validateCursorFeatures(config, schema));
      break;
    case 'windsurf':
      issues.push(...this.validateWindsurfFeatures(config, schema));
      break;
    case 'github-copilot':
      issues.push(...this.validateCopilotFeatures(config, schema));
      break;
    default:
      // Generic platform validation
      issues.push(...this.validateGenericFeatures(config, schema));
    }

    return issues;
  }

  /**
   * Validate Claude Code specific features
   * @param {Object} config - Platform configuration
   * @param {Object} schema - Schema object
   * @returns {Array} Issues array
   */
  validateClaudeFeatures(config, schema) {
    const issues = [];

    // Check memory configuration
    if (config.memory === undefined) {
      issues.push({
        type: 'missing_feature',
        severity: 'warning',
        message: 'Memory configuration not specified',
        schema: schema.id
      });
    }

    // Check command configuration
    if (config.command && !config.namespace) {
      issues.push({
        type: 'incomplete_config',
        severity: 'warning',
        message: 'Command enabled but namespace not specified',
        schema: schema.id
      });
    }

    // Check MCP integration
    if (config.mcpIntegration && !config.allowedTools) {
      issues.push({
        type: 'incomplete_config',
        severity: 'info',
        message: 'MCP integration enabled but no tools specified',
        schema: schema.id
      });
    }

    return issues;
  }

  /**
   * Validate Cursor specific features
   * @param {Object} config - Platform configuration
   * @param {Object} schema - Schema object
   * @returns {Array} Issues array
   */
  validateCursorFeatures(config, schema) {
    const issues = [];

    // Check auto-attachment configuration
    if (config.activation === 'auto-attached' && (!config.globs || config.globs.length === 0)) {
      issues.push({
        type: 'missing_requirement',
        severity: 'error',
        message: 'Auto-attached activation requires globs configuration',
        schema: schema.id
      });
    }

    // Validate glob patterns
    if (config.globs) {
      for (const glob of config.globs) {
        if (typeof glob !== 'string' || glob.length === 0) {
          issues.push({
            type: 'invalid_config',
            severity: 'error',
            message: `Invalid glob pattern: ${glob}`,
            schema: schema.id
          });
        }
      }
    }

    // Check priority configuration
    if (config.priority && !['high', 'medium', 'low'].includes(config.priority)) {
      issues.push({
        type: 'invalid_config',
        severity: 'error',
        message: `Invalid priority: ${config.priority}`,
        schema: schema.id
      });
    }

    return issues;
  }

  /**
   * Validate Windsurf specific features
   * @param {Object} config - Platform configuration
   * @param {Object} schema - Schema object
   * @returns {Array} Issues array
   */
  validateWindsurfFeatures(config, schema) {
    const issues = [];

    // Check character limit
    const estimatedSize = this.estimateContentSize(schema);
    if (estimatedSize > 6000) {
      issues.push({
        type: 'size_warning',
        severity: 'warning',
        message: `Content may exceed Windsurf limit (estimated ${estimatedSize} chars)`,
        schema: schema.id
      });
    }

    // Check mode configuration
    if (config.mode && !['global', 'workspace'].includes(config.mode)) {
      issues.push({
        type: 'invalid_config',
        severity: 'error',
        message: `Invalid mode: ${config.mode}`,
        schema: schema.id
      });
    }

    // Validate XML tag
    if (config.xmlTag && !/^[a-zA-Z][a-zA-Z0-9-]*$/.test(config.xmlTag)) {
      issues.push({
        type: 'invalid_config',
        severity: 'error',
        message: `Invalid XML tag: ${config.xmlTag}`,
        schema: schema.id
      });
    }

    return issues;
  }

  /**
   * Validate GitHub Copilot specific features
   * @param {Object} config - Platform configuration
   * @param {Object} schema - Schema object
   * @returns {Array} Issues array
   */
  validateCopilotFeatures(config, schema) {
    const issues = [];

    // Check priority range
    if (config.priority && (config.priority < 1 || config.priority > 10)) {
      issues.push({
        type: 'invalid_config',
        severity: 'error',
        message: `Priority must be between 1-10, got: ${config.priority}`,
        schema: schema.id
      });
    }

    // Check review type
    const validReviewTypes = ['security', 'performance', 'code-quality', 'style', 'general'];
    if (config.reviewType && !validReviewTypes.includes(config.reviewType)) {
      issues.push({
        type: 'invalid_config',
        severity: 'error',
        message: `Invalid review type: ${config.reviewType}`,
        schema: schema.id
      });
    }

    // Check scope
    if (config.scope && !['repository', 'organization'].includes(config.scope)) {
      issues.push({
        type: 'invalid_config',
        severity: 'error',
        message: `Invalid scope: ${config.scope}`,
        schema: schema.id
      });
    }

    return issues;
  }

  /**
   * Validate generic platform features
   * @param {Object} config - Platform configuration
   * @param {Object} schema - Schema object
   * @returns {Array} Issues array
   */
  validateGenericFeatures(config, schema) {
    const issues = [];

    // Check for minimal configuration
    if (Object.keys(config).length === 1 && config.compatible === true) {
      issues.push({
        type: 'minimal_config',
        severity: 'info',
        message: 'Platform has minimal configuration (compatible only)',
        schema: schema.id
      });
    }

    return issues;
  }

  /**
   * Analyze platform feature usage
   * @param {string} platform - Platform name
   * @param {Array} schemas - Compatible schemas
   * @returns {Object} Feature analysis
   */
  analyzePlatformFeatures(platform, schemas) {
    const features = {
      supported: [],
      unsupported: [],
      limitations: []
    };

    const configs = schemas.map(({ schema }) => schema.platforms[platform]);

    switch (platform) {
    case 'claude-code':
      features.supported = ['memory', 'commands', 'mcp-integration', 'namespaces'];
      if (configs.some(c => c.memory)) features.used = [...(features.used || []), 'memory'];
      if (configs.some(c => c.command)) features.used = [...(features.used || []), 'commands'];
      break;

    case 'cursor':
      features.supported = ['auto-attachment', 'file-patterns', 'priority-system'];
      features.limitations = ['vs-code-dependency'];
      break;

    case 'windsurf':
      features.supported = ['workspace-context', 'xml-formatting'];
      features.limitations = ['6k-character-limit'];
      break;

    case 'github-copilot':
      features.supported = ['review-integration', 'priority-system', 'repository-scope'];
      features.limitations = ['github-dependency'];
      break;
    }

    return features;
  }

  /**
   * Check individual schema compatibility
   * @param {Object} schema - Schema object
   * @returns {Object} Schema compatibility results
   */
  checkSchemaCompatibility(schema) {
    const result = {
      id: schema.id,
      platforms: {},
      issues: [],
      score: 0
    };

    const totalPlatforms = Object.keys(schema.platforms || {}).length;
    let compatiblePlatforms = 0;

    for (const [platform, config] of Object.entries(schema.platforms || {})) {
      const platformResult = {
        compatible: config.compatible === true,
        issues: []
      };

      if (platformResult.compatible) {
        compatiblePlatforms++;
        platformResult.issues = this.validatePlatformFeatures(platform, config, schema);
      }

      result.platforms[platform] = platformResult;
    }

    // Calculate compatibility score (0-100)
    result.score = totalPlatforms > 0 ? Math.round((compatiblePlatforms / totalPlatforms) * 100) : 0;

    // Check for cross-platform compatibility issues
    const crossPlatformIssues = this.checkCrossPlatformIssues(schema);
    result.issues.push(...crossPlatformIssues);

    return result;
  }

  /**
   * Check for cross-platform compatibility issues
   * @param {Object} schema - Schema object
   * @returns {Array} Cross-platform issues
   */
  checkCrossPlatformIssues(schema) {
    const issues = [];
    const contentSize = this.estimateContentSize(schema);

    // Check if content might be too large for Windsurf but compatible
    const windsurfConfig = schema.platforms?.windsurf;
    if (windsurfConfig?.compatible && contentSize > 6000) {
      issues.push({
        type: 'cross_platform_issue',
        severity: 'warning',
        message: 'Content may be truncated on Windsurf due to character limit'
      });
    }

    // Check for conflicting activation patterns
    const cursorConfig = schema.platforms?.cursor;
    if (cursorConfig?.activation === 'always' && cursorConfig.globs) {
      issues.push({
        type: 'cross_platform_issue',
        severity: 'warning',
        message: 'Always activation with globs may cause conflicts'
      });
    }

    return issues;
  }

  /**
   * Estimate content size for character limit checks
   * @param {Object} schema - Schema object
   * @returns {number} Estimated character count
   */
  estimateContentSize(schema) {
    let size = 0;

    size += (schema.title?.length || 0);
    size += (schema.description?.length || 0);
    size += (schema._content?.length || 0);
    size += 200; // Overhead for formatting, metadata, etc.

    return size;
  }

  /**
   * Generate summary statistics
   */
  generateSummary() {
    const { platforms, schemas } = this.results;

    this.results.summary = {
      schemas: {
        total: Object.keys(schemas).length,
        highCompatibility: Object.values(schemas).filter(s => s.score >= 80).length,
        mediumCompatibility: Object.values(schemas).filter(s => s.score >= 50 && s.score < 80).length,
        lowCompatibility: Object.values(schemas).filter(s => s.score < 50).length
      },
      platforms: {
        total: Object.keys(platforms).length,
        details: {}
      },
      issues: {
        total: 0,
        byType: {},
        bySeverity: { error: 0, warning: 0, info: 0 }
      }
    };

    // Calculate platform statistics
    for (const [platform, data] of Object.entries(platforms)) {
      this.results.summary.platforms.details[platform] = {
        compatible: data.compatible,
        compatibility_rate: data.total > 0 ? Math.round((data.compatible / data.total) * 100) : 0,
        issues: data.issues.length
      };

      // Count issues
      for (const issue of data.issues) {
        this.results.summary.issues.total++;
        this.results.summary.issues.byType[issue.type] =
          (this.results.summary.issues.byType[issue.type] || 0) + 1;
        this.results.summary.issues.bySeverity[issue.severity] =
          (this.results.summary.issues.bySeverity[issue.severity] || 0) + 1;
      }
    }
  }
}

/**
 * CLI interface
 */
async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log('Usage: node compatibility-checker.js <schemas-directory> [options]');
    console.log('');
    console.log('Options:');
    console.log('  --json       Output results as JSON');
    console.log('  --platform   Check specific platform only');
    console.log('  --verbose    Show detailed output');
    process.exit(1);
  }

  const schemasDir = args[0];
  const options = {
    json: args.includes('--json'),
    verbose: args.includes('--verbose'),
    platform: args.find(arg => arg.startsWith('--platform='))?.split('=')[1]
  };

  if (!fs.existsSync(schemasDir)) {
    console.error(`Error: Directory not found: ${schemasDir}`);
    process.exit(1);
  }

  console.log(`Checking compatibility for schemas in: ${schemasDir}`);

  const checker = new CompatibilityChecker();
  const results = await checker.checkCompatibility(schemasDir);

  if (options.json) {
    console.log(JSON.stringify(results, null, 2));
  } else {
    printCompatibilityResults(results, options);
  }

  // Exit with error if there are critical compatibility issues
  const hasErrors = results.summary.issues.bySeverity.error > 0;
  process.exit(hasErrors ? 1 : 0);
}

/**
 * Print compatibility results to console
 * @param {Object} results - Compatibility results
 * @param {Object} options - Output options
 */
function printCompatibilityResults(results, options) {
  const { summary, platforms, schemas } = results;

  console.log('\n=== Compatibility Summary ===');
  console.log(`Total Schemas: ${summary.schemas.total}`);
  console.log(`High Compatibility (80%+): ${summary.schemas.highCompatibility}`);
  console.log(`Medium Compatibility (50-79%): ${summary.schemas.mediumCompatibility}`);
  console.log(`Low Compatibility (<50%): ${summary.schemas.lowCompatibility}`);
  console.log(`\nTotal Issues: ${summary.issues.total}`);
  console.log(`Errors: ${summary.issues.bySeverity.error}`);
  console.log(`Warnings: ${summary.issues.bySeverity.warning}`);
  console.log(`Info: ${summary.issues.bySeverity.info}`);

  console.log('\n=== Platform Compatibility ===');
  for (const [platform, stats] of Object.entries(summary.platforms.details)) {
    console.log(`${platform}: ${stats.compatible}/${platforms[platform].total} (${stats.compatibility_rate}%) - ${stats.issues} issues`);
  }

  if (options.verbose) {
    console.log('\n=== Detailed Results ===');

    for (const [platform, data] of Object.entries(platforms)) {
      if (options.platform && platform !== options.platform) continue;

      console.log(`\n📱 Platform: ${platform}`);
      console.log(`Compatible Schemas: ${data.compatible}/${data.total}`);
      console.log(`Features: ${data.features.supported.join(', ')}`);

      if (data.features.limitations.length > 0) {
        console.log(`Limitations: ${data.features.limitations.join(', ')}`);
      }

      if (data.issues.length > 0) {
        console.log('Issues:');
        for (const issue of data.issues) {
          const icon = issue.severity === 'error' ? '❌' :
            issue.severity === 'warning' ? '⚠️' : 'ℹ️';
          console.log(`  ${icon} ${issue.type}: ${issue.message} (${issue.schema})`);
        }
      }
    }

    console.log('\n=== Schema Compatibility Scores ===');
    for (const [id, data] of Object.entries(schemas)) {
      const scoreIcon = data.score >= 80 ? '🟢' : data.score >= 50 ? '🟡' : '🔴';
      console.log(`${scoreIcon} ${id}: ${data.score}%`);

      if (data.issues.length > 0) {
        for (const issue of data.issues) {
          console.log(`    ⚠️ ${issue.message}`);
        }
      }
    }
  }
}

// Run CLI if this file is executed directly
if (require.main === module) {
  main().catch(error => {
    console.error('Compatibility check failed:', error.message);
    process.exit(1);
  });
}

module.exports = { CompatibilityChecker };

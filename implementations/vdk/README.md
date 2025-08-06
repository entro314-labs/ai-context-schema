# VDK: Reference Implementation

VDK (Vibe Development Kit) serves as the reference implementation of the AI Context Schema specification, demonstrating a complete ecosystem for AI context management.

## Implementation Overview

VDK implements AI Context Schema through three integrated components:

### 1. VDK CLI - Local Analysis Engine

**Repository**: [entro314-labs/vdk-cli](https://github.com/entro314-labs/vdk-cli)  
**Package**: `@vibe-dev-kit/cli`

The CLI provides:

- **Project Analysis**: Automatic detection of frameworks, languages, and patterns
- **Schema Resolution**: Fetches relevant context schemas based on project analysis
- **Platform Deployment**: Generates platform-specific configurations
- **Validation**: Schema validation and compatibility checking

#### Key Features

```bash
# Analyze project and deploy context schemas
vdk init --interactive

# Generate for specific platform
vdk generate cursor --schemas react-components,api-patterns

# Validate custom schema
vdk validate my-context.yaml

# List available schemas
vdk list --category technology
```

### 2. VDK Blueprints Repository - Context Schema Library

**Repository**: [entro314-labs/VDK-Blueprints](https://github.com/entro314-labs/VDK-Blueprints)

Contains 109+ context schemas organized by:

- **Core (4)**: Fundamental AI behaviors
- **Languages (6)**: Programming language patterns
- **Technologies (26)**: Framework-specific guidance
- **Stacks (6)**: Multi-technology combinations
- **Tasks (54)**: Development workflows
- **Assistants (7)**: Platform configurations
- **Tools (3)**: Development tool integrations

All schemas conform to AI Context Schema v2.1.0 specification.

### 3. VDK Hub - Web Management Platform

**URL**: [vdk.tools](https://vdk.tools)  
**Repository**: [entro314-labs/vdk-hub](https://github.com/entro314-labs/vdk-hub)

Web platform providing:

- **Schema Catalog**: Browse and search 109+ context schemas
- **Generator Wizard**: 7-step custom package creation
- **Collections**: Personal and team schema libraries
- **Analytics**: Usage tracking and insights

## Platform Adapter Implementation

VDK demonstrates complete platform adapter implementations:

### Claude Code Adapter

```typescript
export class ClaudeCodeAdapter implements PlatformAdapter {
  async generate(schemas: ContextSchema[]): Promise<GeneratedFiles> {
    const memoryFiles = schemas
      .filter((s) => s.platforms['claude-code']?.memory)
      .map((s) => this.generateMemoryFile(s));

    const commands = schemas
      .filter((s) => s.platforms['claude-code']?.command)
      .map((s) => this.generateSlashCommand(s));

    return {
      '.claude/CLAUDE.md': this.combineMemoryFiles(memoryFiles),
      '.claude/CLAUDE_COMMANDS.md': this.generateCommandsFile(commands)
    };
  }
}
```

### Cursor Adapter

```typescript
export class CursorAdapter implements PlatformAdapter {
  async generate(schemas: ContextSchema[]): Promise<GeneratedFiles> {
    const files: GeneratedFiles = {};

    for (const schema of schemas) {
      const cursorConfig = schema.platforms.cursor;
      if (!cursorConfig?.compatible) continue;

      files[`.cursor/rules/${schema.id}.mdc`] = this.generateMDCFile(schema);
    }

    return files;
  }
}
```

## Schema Processing Pipeline

VDK implements the complete schema processing pipeline:

### 1. Project Analysis

```typescript
interface ProjectAnalysis {
  frameworks: string[];
  languages: string[];
  patterns: DetectedPattern[];
  dependencies: PackageDependency[];
  structure: ProjectStructure;
}

class ProjectAnalyzer {
  async analyze(projectPath: string): Promise<ProjectAnalysis> {
    const structure = await this.scanDirectory(projectPath);
    const dependencies = await this.analyzeDependencies(projectPath);
    const frameworks = this.detectFrameworks(dependencies, structure);
    const languages = this.detectLanguages(structure);
    const patterns = this.detectPatterns(structure, dependencies);

    return { frameworks, languages, patterns, dependencies, structure };
  }
}
```

### 2. Schema Resolution

```typescript
class SchemaResolver {
  async resolveSchemas(analysis: ProjectAnalysis): Promise<ContextSchema[]> {
    const candidates = await this.findCandidateSchemas(analysis);
    const resolved = await this.resolveDependencies(candidates);
    const filtered = this.resolveConflicts(resolved);

    return this.sortByPriority(filtered);
  }

  private async resolveDependencies(schemas: ContextSchema[]): Promise<ContextSchema[]> {
    const resolved = new Set<string>();
    const result: ContextSchema[] = [];

    for (const schema of schemas) {
      await this.addWithDependencies(schema, resolved, result);
    }

    return result;
  }
}
```

### 3. Platform Generation

```typescript
class GenerationEngine {
  constructor(private adapters: Map<string, PlatformAdapter>) {}

  async generateAll(
    schemas: ContextSchema[],
    platforms: string[]
  ): Promise<Map<string, GeneratedFiles>> {
    const results = new Map<string, GeneratedFiles>();

    for (const platform of platforms) {
      const adapter = this.adapters.get(platform);
      if (!adapter) continue;

      const compatibleSchemas = schemas.filter((s) => s.platforms[platform]?.compatible);

      results.set(platform, await adapter.generate(compatibleSchemas));
    }

    return results;
  }
}
```

## Validation Implementation

VDK provides comprehensive validation:

### Schema Validation

```typescript
import Ajv from 'ajv';
import { contextSchemaDefinition } from './schemas/v2.1.0/context-schema.json';

class SchemaValidator {
  private ajv = new Ajv({ allErrors: true });
  private validator = this.ajv.compile(contextSchemaDefinition);

  validate(schema: any): ValidationResult {
    const valid = this.validator(schema);

    if (!valid) {
      return {
        valid: false,
        errors: this.validator.errors || []
      };
    }

    return this.validateBusinessRules(schema);
  }

  private validateBusinessRules(schema: ContextSchema): ValidationResult {
    const errors: ValidationError[] = [];

    // Check dependency cycles
    if (this.hasCyclicDependencies(schema)) {
      errors.push({
        path: 'requires',
        message: 'Cyclic dependency detected'
      });
    }

    // Validate platform compatibility
    for (const [platform, config] of Object.entries(schema.platforms)) {
      if (config.compatible && !this.validatePlatformConfig(platform, config)) {
        errors.push({
          path: `platforms.${platform}`,
          message: `Invalid configuration for platform ${platform}`
        });
      }
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }
}
```

## Performance Characteristics

VDK demonstrates production-ready performance:

- **Project Analysis**: <2s for typical codebases (<10k files)
- **Schema Resolution**: <500ms for dependency graph resolution
- **Platform Generation**: <1s for multi-platform deployment
- **Memory Usage**: ~50MB during analysis, ~10MB at rest
- **Cache Efficiency**: 90%+ cache hit rate for repeat operations

## Testing Strategy

VDK implements comprehensive testing:

### Unit Tests

```typescript
describe('SchemaResolver', () => {
  it('should resolve dependencies in correct order', async () => {
    const schemas = [
      createSchema('base', { requires: [] }),
      createSchema('derived', { requires: ['base'] }),
      createSchema('complex', { requires: ['derived', 'base'] })
    ];

    const resolved = await resolver.resolveDependencies(schemas);

    expect(resolved.map((s) => s.id)).toEqual(['base', 'derived', 'complex']);
  });
});
```

### Integration Tests

```typescript
describe('CLI Integration', () => {
  it('should generate configurations for React project', async () => {
    const projectPath = './test-fixtures/react-project';
    const result = await cli.run(['init', '--project', projectPath]);

    expect(result.exitCode).toBe(0);
    expect(fs.existsSync(`${projectPath}/.claude/CLAUDE.md`)).toBe(true);
    expect(fs.existsSync(`${projectPath}/.cursor/rules/react-components.mdc`)).toBe(true);
  });
});
```

## Extension Points

VDK provides clear extension mechanisms:

### Custom Platform Adapters

```typescript
export interface PlatformAdapter {
  name: string;
  generate(schemas: ContextSchema[]): Promise<GeneratedFiles>;
  validate?(config: any): ValidationResult;
}

// Register custom adapter
vdk.registerAdapter(new MyCustomAdapter());
```

### Custom Schema Sources

```typescript
export interface SchemaSource {
  name: string;
  fetch(query: SchemaQuery): Promise<ContextSchema[]>;
}

// Register custom source
vdk.registerSource(new MySchemaSource());
```

## Migration Support

VDK provides migration tools for existing configurations:

```bash
# Migrate from Cursor .mdc files
vdk migrate cursor --input .cursor/rules --output schemas/

# Convert from custom format
vdk convert --from custom-format.json --to ai-context-schema
```

## Community Integration

VDK demonstrates community-driven development:

- **Schema Contributions**: Pull request workflow for new schemas
- **Platform Support**: Community-driven platform adapter development
- **Validation Pipeline**: Automated testing and validation for contributions
- **Documentation**: Auto-generated documentation from schema metadata

## Getting Started with VDK

```bash
# Install CLI
npm install -g @vibe-dev-kit/cli

# Initialize in existing project
cd my-project
vdk init

# Or start with web interface
open https://vdk.tools
```

VDK serves as both a practical tool and a reference implementation, demonstrating how AI Context Schema can be implemented at scale with real-world performance and reliability requirements.

# Platform Support

AI Context Schema is designed to work across multiple AI coding assistant platforms. This document details the current platform support, integration methods, and platform-specific considerations.

## Supported Platforms

### Claude Code

**Status**: ✅ Full Support  
**Configuration Location**: `.claude/`  
**Schema Version**: v2.1.0+

Claude Code integrates AI Context Schema through memory files and slash commands:

#### Memory Files

```yaml
platforms:
  claude-code:
    compatible: true
    memory: true # Include in memory files
    priority: 8 # Memory hierarchy priority (1-10)
    namespace: 'project' # project or user scope
```

Generated files:

- `.claude/CLAUDE.md` - Combined memory file with all schemas
- `.claude/CLAUDE_COMMANDS.md` - Slash command definitions

#### Slash Commands

```yaml
platforms:
  claude-code:
    compatible: true
    command: true # Enable as slash command
    namespace: 'project' # Command scope
```

Commands are generated as:

```markdown
## /schema-name

Brief description of the schema

Full schema content here...
```

#### MCP Integration

```yaml
platforms:
  claude-code:
    compatible: true
    mcpIntegration: true # Uses MCP servers
    allowedTools: ['web_search', 'web_fetch']
```

### Cursor

**Status**: ✅ Full Support  
**Configuration Location**: `.cursor/rules/`  
**Schema Version**: v2.1.0+

Cursor integrates through MDC (Markdown + Component) rule files:

#### Auto-Attachment

```yaml
platforms:
  cursor:
    compatible: true
    activation: 'auto-attached' # auto-attached, agent-requested, manual, always
    globs: ['**/*.tsx', '**/*.ts'] # File patterns for activation
    priority: 'high' # high, medium, low
```

#### File Pattern Matching

```yaml
platforms:
  cursor:
    compatible: true
    globs: [
        '**/*.{ts,tsx}', # TypeScript files
        '**/components/**/*', # Component directories
        '**/pages/**/*', # Page directories
        '**/{test,spec}/**/*' # Test directories
      ]
```

Generated files:

- `.cursor/rules/{schema-id}.mdc` - Individual rule files with YAML frontmatter

#### Example Generated File

```yaml
---
title: 'React Component Patterns'
description: 'Modern React development patterns'
activation: 'auto-attached'
globs: ['**/*.tsx', '**/*.jsx']
priority: 'high'
---
# React Component Development

[Schema content here...]
```

### Windsurf

**Status**: ✅ Full Support  
**Configuration Location**: `.windsurf/rules/`  
**Schema Version**: v2.1.0+

Windsurf uses XML-formatted memory files with character limits:

#### Configuration Options

```yaml
platforms:
  windsurf:
    compatible: true
    mode: 'workspace' # global or workspace
    xmlTag: 'react-context' # XML wrapper tag
    characterLimit: 4500 # Estimated character usage
    priority: 7 # Context priority (1-10)
```

#### Character Limit Handling

Windsurf has a 6K character limit per memory file. The adapter:

1. Estimates character usage based on `characterLimit` field
2. Truncates content intelligently (preserves key sections)
3. Prioritizes schemas with higher priority values
4. Provides warnings when content is truncated

Generated files:

- `.windsurf/rules/{schema-id}.xml` - XML memory files

#### Example Generated File

```xml
<react-context priority="7">
  <purpose>React component development patterns</purpose>
  <content>
    [Truncated and optimized schema content...]
  </content>
</react-context>
```

### GitHub Copilot

**Status**: ✅ Full Support  
**Configuration Location**: `.github/copilot/`  
**Schema Version**: v2.1.0+

GitHub Copilot integrates through JSON configuration files:

#### Configuration Options

```yaml
platforms:
  github-copilot:
    compatible: true
    priority: 8 # Priority for guideline selection (1-10)
    reviewType: 'code-quality' # security, performance, code-quality, style
    scope: 'repository' # repository or organization
```

#### Review Integration

GitHub Copilot can use schemas for:

- Code suggestion prioritization
- Pull request review automation
- Security pattern enforcement
- Style guide compliance

Generated files:

- `.github/copilot/guidelines.json` - Combined guidelines
- `.github/copilot/patterns/{schema-id}.json` - Individual pattern files

#### Example Generated File

```json
{
  "name": "React Component Patterns",
  "description": "Modern React development patterns",
  "priority": 8,
  "reviewType": "code-quality",
  "patterns": [
    {
      "type": "component-structure",
      "rule": "Use functional components with hooks",
      "examples": ["..."]
    }
  ]
}
```

## Planned Platform Support

### VS Code

**Status**: 🚧 Planned  
**Expected**: Q2 2024

VS Code extension to support AI Context Schema:

```yaml
platforms:
  vscode:
    compatible: true
    extension: 'ai-context-schema' # Required extension
    settings: # VS Code settings integration
      { 'aiContext.autoActivate': true, 'aiContext.showInStatusBar': true }
    commands: ['aiContext.apply', 'aiContext.validate']
```

### IntelliJ IDEA

**Status**: 🚧 Planned  
**Expected**: Q3 2024

IntelliJ plugin for AI Context Schema support:

```yaml
platforms:
  intellij:
    compatible: true
    plugin: 'ai-context-schema-plugin' # Required plugin
    fileTemplates: true # Uses file templates
    inspections: # Code inspections to enable
      ['react-patterns', 'typescript-conventions']
```

## Platform-Specific Features

### Feature Comparison

| Feature               | Claude Code       | Cursor           | Windsurf         | GitHub Copilot   | VS Code\*   | IntelliJ\* |
| --------------------- | ----------------- | ---------------- | ---------------- | ---------------- | ----------- | ---------- |
| **Memory/Context**    | ✅ Memory files   | ✅ Rule files    | ✅ XML memory    | ✅ Guidelines    | 🚧 Settings | 🚧 Config  |
| **Auto-activation**   | ✅ Always active  | ✅ File patterns | ✅ Workspace     | ✅ Repository    | 🚧 Planned  | 🚧 Planned |
| **Commands**          | ✅ Slash commands | ❌ Not supported | ❌ Not supported | ❌ Not supported | 🚧 Planned  | 🚧 Planned |
| **Character Limits**  | ❌ No limits      | ❌ No limits     | ⚠️ 6K limit      | ❌ No limits     | 🚧 TBD      | 🚧 TBD     |
| **Priority System**   | ✅ 1-10 scale     | ✅ High/Med/Low  | ✅ 1-10 scale    | ✅ 1-10 scale    | 🚧 Planned  | 🚧 Planned |
| **Real-time Updates** | ✅ File watching  | ✅ File watching | ✅ File watching | ⚠️ Git-based     | 🚧 Planned  | 🚧 Planned |

\*Planned features

### Platform-Specific Optimizations

#### Claude Code Optimizations

- **Memory Hierarchy**: Organizes schemas by priority and scope
- **Command Generation**: Creates contextual slash commands
- **Tool Integration**: Supports MCP server integration
- **Context Injection**: Seamless context switching

#### Cursor Optimizations

- **File Pattern Matching**: Intelligent auto-attachment based on file types
- **Agent Integration**: Works with Cursor's agent system
- **Real-time Activation**: Immediate schema application when files are opened
- **IDE Integration**: Deep integration with VS Code base

#### Windsurf Optimizations

- **Content Compression**: Intelligent truncation for character limits
- **XML Formatting**: Structured XML for optimal parsing
- **Workspace Awareness**: Project-level context understanding
- **Memory Management**: Efficient memory usage optimization

#### GitHub Copilot Optimizations

- **Review Integration**: Automated code review based on schemas
- **Repository Scope**: Organization and repository-level configuration
- **Security Focus**: Enhanced security pattern enforcement
- **PR Integration**: Pull request review automation

## Adapter Development Guide

### Creating New Platform Adapters

To add support for a new platform, implement the `PlatformAdapter` interface:

```typescript
interface PlatformAdapter {
  name: string;
  generate(schemas: ContextSchema[]): Promise<GeneratedFiles>;
  validate?(config: any): ValidationResult;
}
```

#### Example Adapter Implementation

```typescript
export class MyPlatformAdapter implements PlatformAdapter {
  name = 'my-platform';

  async generate(schemas: ContextSchema[]): Promise<GeneratedFiles> {
    const files: GeneratedFiles = {};

    for (const schema of schemas) {
      // Check platform compatibility
      const config = schema.platforms['my-platform'];
      if (!config?.compatible) continue;

      // Generate platform-specific file
      const content = this.transformSchema(schema, config);
      files[`.my-platform/schemas/${schema.id}.config`] = content;
    }

    return files;
  }

  private transformSchema(schema: ContextSchema, config: any): string {
    // Transform schema to platform-specific format
    return JSON.stringify(
      {
        id: schema.id,
        title: schema.title,
        content: schema.content,
        config: config
      },
      null,
      2
    );
  }

  validate(config: any): ValidationResult {
    // Validate platform-specific configuration
    const errors: string[] = [];

    if (!config.someRequiredField) {
      errors.push('someRequiredField is required');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }
}
```

### Adapter Requirements

1. **Handle all compatible schemas**: Process schemas marked as compatible
2. **Respect platform limitations**: Handle character limits, format restrictions
3. **Preserve intent**: Maintain behavioral intent across format translation
4. **Provide validation**: Validate platform-specific configuration
5. **Support relationships**: Handle schema dependencies and conflicts
6. **Error handling**: Graceful degradation for unsupported features

### Testing Adapters

```typescript
describe('MyPlatformAdapter', () => {
  const adapter = new MyPlatformAdapter();

  it('should generate files for compatible schemas', async () => {
    const schema: ContextSchema = {
      id: 'test-schema',
      platforms: {
        'my-platform': { compatible: true }
      }
      // ... other required fields
    };

    const files = await adapter.generate([schema]);

    expect(files).toHaveProperty('.my-platform/schemas/test-schema.config');
  });

  it('should skip incompatible schemas', async () => {
    const schema: ContextSchema = {
      id: 'incompatible',
      platforms: {
        'my-platform': { compatible: false }
      }
    };

    const files = await adapter.generate([schema]);

    expect(Object.keys(files)).toHaveLength(0);
  });
});
```

## Migration from Platform-Specific Formats

### From Cursor .mdc Files

```bash
# Using VDK CLI (reference implementation)
vdk migrate cursor --input .cursor/rules --output schemas/

# Manual conversion
# .cursor/rules/my-rule.mdc -> schemas/my-context.yaml
```

### From Custom JSON Configurations

```bash
# Custom migration script
node scripts/migrate-from-json.js custom-config.json schemas/
```

### Migration Best Practices

1. **Preserve behavioral intent**: Ensure migrated schemas maintain original purpose
2. **Test compatibility**: Verify migrated schemas work across target platforms
3. **Update metadata**: Add proper versioning, author, and description fields
4. **Validate thoroughly**: Use schema validation tools before deployment
5. **Document changes**: Note any behavioral differences in migration

## Troubleshooting

### Common Issues

#### Schema Not Activating

1. Check platform compatibility flag
2. Verify file patterns (for auto-activation platforms)
3. Validate schema syntax
4. Check platform-specific requirements

#### Content Truncation (Windsurf)

1. Reduce schema content length
2. Increase priority to avoid truncation
3. Split complex schemas into smaller ones
4. Use content optimization techniques

#### Command Not Working (Claude Code)

1. Verify `command: true` in platform configuration
2. Check namespace settings
3. Restart Claude Code to reload commands
4. Validate command syntax in generated files

#### Performance Issues

1. Reduce number of active schemas
2. Optimize schema content length
3. Use appropriate priority settings
4. Consider schema dependency optimization

### Debug Mode

Most platform adapters support debug mode for troubleshooting:

```bash
# Enable debug logging
export DEBUG=ai-context-schema:*

# Generate with verbose output
vdk generate --verbose --debug
```

## Contributing Platform Support

We welcome contributions for new platform adapters! See [CONTRIBUTING.md](../CONTRIBUTING.md) for guidelines on:

- Implementing new platform adapters
- Testing adapter implementations
- Documenting platform-specific features
- Submitting adapter contributions

## Platform Roadmap

### Short-term (Q1-Q2 2024)

- VS Code extension
- IntelliJ IDEA plugin
- Improved Windsurf character limit handling
- Enhanced GitHub Copilot review integration

### Medium-term (Q3-Q4 2024)

- Vim/Neovim LSP integration
- Sublime Text plugin
- Web-based editor support
- Mobile development platform support

### Long-term (2025+)

- Custom platform adapter SDK
- Visual schema builder integration
- Real-time collaborative editing
- AI-powered schema optimization

# AI Context Schema

[![npm version](https://badge.fury.io/js/ai-context-schema.svg)](https://badge.fury.io/js/ai-context-schema)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)](https://nodejs.org/)

**A new Context Paradigm for defining AI assistant behavior across development platforms**

## The Problem

AI coding assistants (Claude Code, Cursor, Windsurf, GitHub Copilot) each use different configuration formats for context and behavioral instructions. Developers must maintain separate configurations for each platform, leading to:

- **Configuration fragmentation** across tools
- **Behavioral inconsistencies** when switching platforms
- **Maintenance overhead** for multiple format specifications
- **Limited interoperability** between AI development workflows

## The Solution

AI Context Schema provides a universal format that enables developers to define AI context once and deploy it consistently across all platforms while preserving behavioral intent.

### Core Principles

1. **Write Once, Deploy Everywhere**: Single schema format works across all AI platforms
2. **Behavioral Preservation**: Intent maintained through platform-specific adaptations
3. **Structured Validation**: JSON Schema validation prevents configuration errors
4. **Relationship Awareness**: Schemas can depend on, extend, and conflict with each other

## How It Works

Context schemas are YAML files with frontmatter metadata and Markdown content:

```yaml
---
id: "react-patterns"
title: "React Development Guidelines"
description: "Modern React patterns with TypeScript and hooks"
version: "1.0.0"
category: "technology"
platforms:
  claude-code:
    compatible: true
    memory: true
    command: true
  cursor:
    compatible: true
    activation: "auto-attached"
    globs: ["**/*.tsx", "**/*.jsx"]
  windsurf:
    compatible: true
    mode: "workspace"
    characterLimit: 4500
  github-copilot:
    compatible: true
    priority: 8
    reviewType: "code-quality"
---

# React Development Guidelines

## Component Structure
Use functional components with TypeScript...

## Hooks Usage
Prefer built-in hooks over custom ones...

## Anti-Patterns
Avoid class components for new code...
```

Platform adapters transform schemas into platform-specific formats while preserving behavioral intent.

## Installation & Usage

```bash
# Install validation tools
npm install -g ai-context-schema

# Validate a schema
ai-context-schema validate my-schema.yaml

# Validate all examples
ai-context-schema validate-all

# Check platform compatibility
ai-context-schema check-compatibility schemas/
```

## Schema Structure

### Required Fields

- `id`: Unique identifier (kebab-case)
- `title`: Human-readable name
- `description`: Purpose description (10-500 chars)
- `version`: Semantic version
- `category`: Primary categorization
- `platforms`: Platform compatibility specification

### Platform Configuration

Each platform has specific configuration options:

#### Claude Code
```yaml
claude-code:
  compatible: true
  memory: true          # Include in memory files
  command: true         # Enable as slash command
  namespace: "project"  # project or user scope
  priority: 8           # Memory hierarchy (1-10)
```

#### Cursor
```yaml
cursor:
  compatible: true
  activation: "auto-attached"    # auto-attached, manual, always
  globs: ["**/*.tsx"]           # File patterns for activation
  priority: "high"              # high, medium, low
```

#### Windsurf
```yaml
windsurf:
  compatible: true
  mode: "workspace"       # workspace or global
  xmlTag: "context"       # XML wrapper tag
  characterLimit: 4500    # Content size estimate
```

#### GitHub Copilot
```yaml
github-copilot:
  compatible: true
  priority: 8                    # Suggestion priority (1-10)
  reviewType: "code-quality"     # security, performance, code-quality, style
  scope: "repository"            # repository or organization
```

### Schema Relationships

```yaml
requires: ["typescript-base"]     # Hard dependencies
suggests: ["testing-patterns"]    # Soft recommendations
conflicts: ["vue-patterns"]       # Incompatible schemas
supersedes: ["old-patterns"]      # Schemas this replaces
```

## Platform Adapter System

Platform adapters handle format translation:

```typescript
interface PlatformAdapter {
  name: string;
  generate(schemas: ContextSchema[]): Promise<GeneratedFiles>;
  validate?(config: any): ValidationResult;
}
```

### Output Examples

**Claude Code**: `.claude/CLAUDE.md` (memory file)
```markdown
# React Development Guidelines
[Schema content optimized for Claude Code...]
```

**Cursor**: `.cursor/rules/react-patterns.mdc` (rule file)
```yaml
---
title: "React Development Guidelines"
activation: "auto-attached"
globs: ["**/*.tsx"]
---
[Schema content...]
```

**Windsurf**: `.windsurf/rules/react-patterns.xml` (XML memory)
```xml
<context priority="8">
  <purpose>React development patterns</purpose>
  <content>[Optimized content...]</content>
</context>
```

**GitHub Copilot**: `.github/copilot/guidelines.json` (configuration)
```json
{
  "name": "React Development Guidelines",
  "priority": 8,
  "reviewType": "code-quality",
  "patterns": [...]
}
```

## Validation & Quality Assurance

The specification includes comprehensive validation:

- **JSON Schema validation** against v2.1.0 specification
- **Platform compatibility** checking
- **Content optimization** for platform limits
- **Relationship resolution** for dependencies and conflicts

## Implementation Status

| Platform | Status | Configuration Location | Features |
|----------|--------|----------------------|----------|
| Claude Code | ✅ Full | `.claude/` | Memory files, commands |
| Cursor | ✅ Full | `.cursor/rules/` | Auto-attachment, patterns |
| Windsurf | ✅ Full | `.windsurf/rules/` | XML format, limits |
| GitHub Copilot | ✅ Full | `.github/copilot/` | Review integration |
| VS Code | 🚧 Planned | Extension-based | Settings integration |
| IntelliJ | 🚧 Planned | Plugin-based | Inspections, templates |

## Examples

The repository includes comprehensive examples:

- [`react-example.yaml`](./schemas/v2.1.0/examples/react-example.yaml) - React development patterns
- [`api-example.yaml`](./schemas/v2.1.0/examples/api-example.yaml) - REST API development
- [`security-example.yaml`](./schemas/v2.1.0/examples/security-example.yaml) - Security best practices
- [`testing-example.yaml`](./schemas/v2.1.0/examples/testing-example.yaml) - Testing strategies

## Technical Specification

The complete technical specification is available in [SPECIFICATION.md](./SPECIFICATION.md), covering:

- Schema structure and validation rules
- Platform adapter requirements
- Content formatting guidelines
- Versioning and compatibility
- Security considerations

## Development Tools

```bash
# Schema validation
ai-context-schema validate schema.yaml
ai-context-schema validate-all
ai-context-schema validate --warnings

# Development utilities
ai-context-schema check-compatibility
ai-context-schema test
ai-context-schema lint

# Documentation validation
ai-context-schema docs:serve
```

## Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Schema Files  │───▶│  Platform        │───▶│  Generated      │
│   (.yaml)       │    │  Adapters        │    │  Configurations │
└─────────────────┘    └──────────────────┘    └─────────────────┘
        │                        │                       │
        │                        │                       ▼
        │                        │              ┌─────────────────┐
        │                        │              │ AI Platforms    │
        │                        │              │ • Claude Code   │
        ▼                        │              │ • Cursor        │
┌─────────────────┐              │              │ • Windsurf      │
│ JSON Schema     │              │              │ • GitHub Copilot│
│ Validation      │              │              └─────────────────┘
└─────────────────┘              │
                                 ▼
                        ┌──────────────────┐
                        │ Relationship     │
                        │ Resolution       │
                        │ • Dependencies   │
                        │ • Conflicts      │
                        │ • Supersession   │
                        └──────────────────┘
```

## Contributing

We welcome contributions to the specification and ecosystem:

- **Schema examples** for new technologies and patterns
- **Platform adapters** for additional AI coding tools
- **Validation improvements** and tooling enhancements
- **Documentation** and implementation guides

See [CONTRIBUTING.md](./CONTRIBUTING.md) for detailed guidelines.

## Versioning

The specification follows semantic versioning:
- **Major**: Breaking schema structure changes
- **Minor**: Backward-compatible feature additions
- **Patch**: Bug fixes and clarifications

Current version: **2.1.0**

## Requirements

- Node.js >= 18.0.0
- npm >= 8.0.0 or pnpm >= 7.0.0

## License

MIT License - see [LICENSE](LICENSE) for details.

## Further Reading

- [Getting Started Guide](./docs/guides/getting-started.md) - Complete setup instructions
- [Platform Support](./docs/reference/platform-support.md) - Platform-specific implementation details
- [Migration Guide](./docs/guides/migration-guide.md) - Upgrading from existing configurations
- [Full Specification](./SPECIFICATION.md) - Complete technical documentation

---

**AI Context Schema** enables consistent AI assistant behavior across all development platforms through standardized configuration. Write once, deploy everywhere.
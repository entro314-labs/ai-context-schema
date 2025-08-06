# AI Context Schema

A standardized format for defining AI assistant behavior across development tools and platforms.

## The Problem

AI coding assistants are proliferating with platform-specific configuration formats:

- **Claude Code**: `.claude/` directory with markdown memory files and slash commands
- **Cursor**: `.cursor/rules/` with MDC format and YAML frontmatter  
- **Windsurf**: `.windsurf/rules/` with XML memory format and 6K character limits
- **GitHub Copilot**: `.github/copilot/` with JSON guidelines and repository settings

**Developer Impact:**
- Learn multiple configuration systems for the same context
- Manually recreate project knowledge for each AI tool
- Inconsistent AI behavior across development environments
- High switching costs between AI assistants
- Context drift as configurations diverge over time

## The Solution

AI Context Schema provides a universal format to define AI assistant context once and deploy everywhere:

```yaml
---
id: "react-component-patterns"
title: "React Component Development"
version: "1.0.0"
category: "technology"
context:
  domain: "frontend.react"
  language: "typescript"
  scope: "component"
platforms:
  claude-code:
    compatible: true
    memory: true
    command: true
  cursor:
    compatible: true
    globs: ["**/*.tsx", "**/*.jsx"]
    activation: "auto-attached"
  windsurf:
    compatible: true
    mode: "workspace"
  github-copilot:
    compatible: true
    priority: 8
---

# React Component Development Context

When working with React components:
- Use functional components with hooks
- Follow TypeScript interface patterns
- Implement proper error boundaries
- Consider accessibility in all implementations
```

## Current Version

**v2.1.0** - Stable specification with platform adapter support

## Reference Implementation

[VDK (Vibe Development Kit)](https://github.com/entro314-labs/vdk-cli) provides the reference implementation:
- 109+ pre-built context schemas
- Automatic deployment across major AI platforms
- Project analysis and context generation
- Web-based context management at [vdk.tools](https://vdk.tools)

## Platform Support

| Platform | Status | Adapter | Notes |
|----------|--------|---------|-------|
| Claude Code | ✅ Full | Built-in | Memory files + slash commands |
| Cursor | ✅ Full | Built-in | MDC rules with file patterns |
| Windsurf | ✅ Full | Built-in | XML format with character limits |
| GitHub Copilot | ✅ Full | Built-in | JSON guidelines integration |
| VS Code | 🚧 Planned | Community | Extension development needed |
| IntelliJ IDEA | 🚧 Planned | Community | Plugin development needed |

## Quick Start

### 1. Define Your Context Schema

```yaml
---
id: "my-project-context"
title: "My Project Development Context"
version: "1.0.0"
category: "project"
platforms:
  claude-code: { compatible: true, memory: true }
  cursor: { compatible: true, activation: "auto-attached" }
---

# My Project Context
Your AI assistant instructions here...
```

### 2. Validate Schema

```bash
npx ai-context-schema validate my-context.yaml
```

### 3. Deploy to Platforms

```bash
# Using VDK (reference implementation)
npx @vibe-dev-kit/cli generate --schema my-context.yaml

# Using custom adapter
npx ai-context-schema deploy my-context.yaml --platform cursor
```

## Schema Structure

- **Identity**: Unique identification and versioning
- **Context Definition**: Domain, language, framework, scope
- **Platform Compatibility**: Platform-specific adaptation rules
- **Relationship Graph**: Dependencies, conflicts, inheritance
- **Behavioral Specification**: How AI should act within this context

See [SPECIFICATION.md](SPECIFICATION.md) for complete schema definition.

## Examples

- [React Component Patterns](schemas/v2.1.0/examples/react-example.yaml)
- [API Development](schemas/v2.1.0/examples/api-example.yaml)
- [Testing Strategy](schemas/v2.1.0/examples/testing-example.yaml)
- [Security Practices](schemas/v2.1.0/examples/security-example.yaml)

## Implementations

- **[VDK](implementations/vdk/)** - Reference implementation with full ecosystem
- **[Community Adapters](implementations/adapters/)** - Platform-specific adapters

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines on:
- Adding new platform adapters
- Improving the specification
- Contributing example schemas
- Reporting compatibility issues

## License

MIT License - See [LICENSE](LICENSE) for details.

## Why This Matters

AI-assisted coding is becoming standard practice. Fragmented configuration systems create barriers to adoption and experimentation. A universal schema enables developers to:

- **Try new AI tools** without configuration overhead
- **Maintain consistency** across development environments  
- **Share context** between team members and projects
- **Focus on creating** rather than configuring

The goal is making AI-assisted coding as accessible and consistent as possible, enabling the next generation of development workflows.
# AI Context Schema Specification v2.1.0

## Abstract

The AI Context Schema specification defines a standardized format for describing AI assistant behavior and context across development platforms. This specification enables developers to define AI context once and deploy it across multiple AI coding assistants with consistent behavior.

## 1. Overview

### 1.1 Purpose

AI coding assistants use platform-specific configuration formats, creating fragmentation and reducing interoperability. This specification provides a universal format that can be adapted to any AI platform while preserving behavioral intent.

### 1.2 Design Principles

- **Platform Universality**: One schema works across all AI platforms
- **Behavioral Preservation**: Intent maintained across platform translations
- **Relationship Awareness**: Context schemas can depend on and extend each other
- **Validation**: Structured format enables automated validation and tooling
- **Evolution**: Versioning supports schema migration and compatibility

### 1.3 Terminology

- **Context Schema**: A document conforming to this specification
- **Platform Adapter**: Code that translates schemas to platform-specific formats
- **Context Domain**: The technology area a schema addresses (e.g., "frontend.react")
- **Behavioral Specification**: Instructions defining how AI should act

## 2. Schema Structure

### 2.1 File Format

Context schemas MUST be valid YAML documents with:
- YAML frontmatter containing schema metadata
- Markdown content containing AI instructions

```yaml
---
# Schema metadata (YAML frontmatter)
id: "example-context"
# ... metadata fields
---

# AI Instructions (Markdown content)
Context instructions for AI assistants...
```

### 2.2 Required Fields

Every context schema MUST include:

- `id`: Unique identifier (kebab-case string)
- `title`: Human-readable title
- `description`: Detailed description (10-500 characters)
- `version`: Semantic version number
- `category`: Primary categorization
- `platforms`: Platform compatibility specification

### 2.3 Optional Fields

Context schemas MAY include:

- `lastUpdated`: ISO date of last modification
- `subcategory`: Fine-grained grouping
- `framework`: Specific technology framework
- `language`: Programming language
- `complexity`: Complexity level (simple/medium/complex)
- `scope`: Impact scope (file/component/feature/project/system)
- `audience`: Target audience (developer/architect/team-lead/junior)
- `maturity`: Maturity level (experimental/beta/stable/deprecated)
- `requires`: Hard dependencies on other schemas
- `suggests`: Soft dependencies/recommendations
- `conflicts`: Incompatible schemas
- `supersedes`: Schemas this replaces
- `tags`: Searchable tags
- `author`: Author identifier
- `contributors`: List of contributors

## 3. Platform Specification

### 3.1 Platform Object Structure

The `platforms` field MUST be an object with platform-specific configurations:

```yaml
platforms:
  claude-code:
    compatible: true
    memory: true
    command: true
  cursor:
    compatible: true
    activation: "auto-attached"
    globs: ["**/*.tsx"]
  windsurf:
    compatible: true
    mode: "workspace"
  github-copilot:
    compatible: true
    priority: 8
```

### 3.2 Platform Compatibility

Each platform object MUST include:
- `compatible`: Boolean indicating if schema works with this platform

### 3.3 Platform-Specific Fields

#### Claude Code Platform
- `memory`: Include in memory files
- `command`: Enable as slash command
- `namespace`: Command namespace (project/user)
- `allowedTools`: Tool permissions
- `mcpIntegration`: MCP server integration

#### Cursor Platform  
- `activation`: How schema is activated (auto-attached/agent-requested/manual/always)
- `globs`: File patterns for auto-attachment
- `priority`: Blueprint priority (high/medium/low)

#### Windsurf Platform
- `mode`: Application mode (global/workspace)
- `xmlTag`: XML tag for formatting
- `characterLimit`: Estimated character usage

#### GitHub Copilot Platform
- `priority`: Priority for guideline selection (1-10)
- `reviewType`: Review focus (security/performance/code-quality/style)

## 4. Relationship System

### 4.1 Dependencies

Context schemas can declare relationships with other schemas:

```yaml
requires: ["typescript-base", "frontend-core"]
suggests: ["testing-patterns", "accessibility-guidelines"]
conflicts: ["vue-patterns", "angular-patterns"]
supersedes: ["legacy-react-patterns"]
```

### 4.2 Relationship Types

- **requires**: Hard dependencies that must be present
- **suggests**: Soft recommendations for enhanced functionality
- **conflicts**: Incompatible schemas that should not be used together
- **supersedes**: Schemas this one replaces or upgrades

### 4.3 Resolution Rules

Platform adapters SHOULD:
- Include all required dependencies
- Warn about missing suggested dependencies
- Detect and resolve conflicts
- Handle schema supersession automatically

## 5. Content Structure

### 5.1 Markdown Content

The content section (after YAML frontmatter) contains:
- Context description and purpose
- Behavioral instructions for AI assistants
- Code patterns and examples
- Anti-patterns and things to avoid
- Platform-specific guidance

### 5.2 Content Organization

Content SHOULD be organized with clear sections:

```markdown
# Context Title

## Purpose
What this context is for...

## Behavioral Guidelines  
How AI should behave...

## Code Patterns
Preferred patterns with examples...

## Anti-Patterns
What to avoid...

## Platform Notes
Platform-specific considerations...
```

## 6. Validation

### 6.1 Schema Validation

Context schemas MUST validate against the JSON Schema definition in `schemas/v2.1.0/context-schema.json`.

### 6.2 Compatibility Validation

Platform adapters SHOULD validate:
- Platform compatibility flags
- Required field presence for compatible platforms
- Relationship resolution
- Content length limits for platforms with restrictions

### 6.3 Content Validation

Content SHOULD be validated for:
- Markdown syntax correctness
- Section structure consistency
- Code example syntax
- Link validity

## 7. Platform Adaptation

### 7.1 Adapter Requirements

Platform adapters MUST:
- Preserve behavioral intent across format translation
- Handle platform-specific limitations gracefully
- Support incremental updates
- Provide error reporting for incompatible features

### 7.2 Content Transformation

Adapters MAY transform content to fit platform requirements:
- Character limit truncation (with priority preservation)
- Format conversion (Markdown to XML, JSON, etc.)
- Command generation for platforms supporting it
- File pattern mapping for auto-activation

### 7.3 Fallback Handling

Adapters SHOULD provide fallbacks for:
- Unsupported platform features
- Content exceeding platform limits
- Missing dependencies
- Version incompatibilities

## 8. Versioning

### 8.1 Schema Versioning

The specification uses semantic versioning:
- **Major**: Breaking changes to schema structure
- **Minor**: Backward-compatible additions
- **Patch**: Bug fixes and clarifications

### 8.2 Context Schema Versioning

Individual context schemas SHOULD use semantic versioning:
- **Major**: Breaking behavioral changes
- **Minor**: Feature additions, new platform support
- **Patch**: Bug fixes, content improvements

### 8.3 Compatibility

Platform adapters SHOULD support:
- Multiple specification versions
- Schema migration between versions
- Compatibility warnings for deprecated features

## 9. Security Considerations

### 9.1 Content Safety

Context schemas SHOULD NOT contain:
- Executable code that could be harmful
- Sensitive information (API keys, passwords)
- Malicious instructions for AI behavior
- Content that violates platform policies

### 9.2 Validation Security

Schema validation SHOULD:
- Sanitize user input
- Prevent injection attacks through schema content
- Validate external references and links
- Check for suspicious patterns

## 10. Implementation Guidelines

### 10.1 Parser Requirements

Schema parsers MUST:
- Support YAML frontmatter parsing
- Handle Markdown content preservation
- Validate against JSON Schema
- Provide clear error messages

### 10.2 Platform Adapter Guidelines

Adapters SHOULD:
- Be idempotent (same input produces same output)
- Support batch processing
- Provide progress reporting for large schema sets
- Cache results when appropriate

### 10.3 Tool Integration

Development tools SHOULD:
- Support schema autocompletion
- Provide real-time validation
- Offer migration assistance
- Enable schema discovery and browsing

## 11. Examples

See the `schemas/v2.1.0/examples/` directory for complete examples of context schemas conforming to this specification.

## 12. References

- [JSON Schema Draft 7](http://json-schema.org/draft-07/schema)
- [YAML 1.2 Specification](https://yaml.org/spec/1.2/spec.html)
- [CommonMark Markdown Specification](https://commonmark.org/)
- [Semantic Versioning](https://semver.org/)
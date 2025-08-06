# Community Adapters

This directory contains community-contributed platform adapters for AI Context Schema.

## Available Adapters

Platform adapters help translate AI Context Schema files to platform-specific formats.

### Contributing

See the main [CONTRIBUTING.md](../../CONTRIBUTING.md) for guidelines on creating new adapters.

### Structure

Each adapter should be in its own subdirectory with:
- `README.md` - Adapter documentation
- `adapter.js` - Main adapter implementation  
- `package.json` - Dependencies and metadata
- `examples/` - Example transformations
- `tests/` - Adapter tests

### Platform Support

Current platform adapter priorities:
1. VS Code Extension
2. IntelliJ IDEA Plugin
3. Vim/Neovim Plugin
4. Emacs Package
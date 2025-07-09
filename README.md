# ClipCodeRef - Code Reference Clipper for AI

Copy code references in a format optimized for AI coding assistants like Claude Code. Quickly reference specific code locations with file paths and line numbers.

## Features

### 🎯 Single Line Reference
Place your cursor on any line and copy a reference in the format: `src/utils/helper.js L15`

### 📋 Range Selection
Select multiple lines to copy range references: `src/utils/helper.js L15-L20`

### ⚙️ Multiple Output Formats
- **Simple**: `src/utils/helper.js L15` (default)
- **Preview**: `src/utils/helper.js L15: const result = calculate(x, y);`

### 🚀 Three Ways to Activate
1. **Keyboard Shortcut**: `Ctrl+Shift+C` (Windows/Linux) or `Cmd+Shift+C` (Mac)
2. **Command Palette**: "ClipCodeRef: Copy Code Reference"
3. **Right-click Menu**: "Copy Code Reference"

### 🗂️ Smart Path Handling
- **Single Workspace**: Paths relative to workspace root
- **Multi-root Workspace**: Intelligent workspace name prefixing when needed
- **External Files**: Absolute paths with home directory shortened to `~`
- **Unsaved Files**: Uses `Untitled-1 L<line>` format

## Installation

Install from the VS Code Marketplace by searching for "ClipCodeRef" or visit the [extension page](https://marketplace.visualstudio.com/items?itemName=kenfdev.clipcoderef).

## Usage Examples

### Basic Usage
1. Place cursor on line 42 in `src/app.js`
2. Press `Cmd+Shift+C` (Mac) or `Ctrl+Shift+C` (Windows/Linux)
3. Result copied to clipboard: `src/app.js L42`

### Range Selection
1. Select lines 15-20 in `src/utils/helper.js`
2. Use any activation method
3. Result: `src/utils/helper.js L15-L20`

### With Code Preview
When `clipCodeRef.format` is set to `"preview"`:
```
src/utils/helper.js L15: const result = calculate(x, y);
```

### Multi-root Workspace
When file paths might be ambiguous:
```
[frontend]/src/components/App.js L10
[backend]/src/utils/helper.js L25
```

## Configuration

This extension contributes the following settings:

### `clipCodeRef.format`
- **Type**: `string`
- **Default**: `"simple"`
- **Options**: `"simple"` | `"preview"`
- **Description**: Choose output format for code references

### `clipCodeRef.trimWhitespace`
- **Type**: `boolean`
- **Default**: `true`
- **Description**: Remove leading/trailing whitespace from code preview

### `clipCodeRef.maxLineLength`
- **Type**: `number`
- **Default**: `80`
- **Description**: Maximum line length for code preview (longer lines are truncated)

### `clipCodeRef.multiRootBehavior`
- **Type**: `string`
- **Default**: `"auto"`
- **Options**: `"auto"` | `"always"` | `"never"`
- **Description**: How to handle multi-root workspaces
  - `"auto"`: Include workspace name only when paths would be ambiguous
  - `"always"`: Always include workspace name
  - `"never"`: Never include workspace name

### `clipCodeRef.maxRangeLines`
- **Type**: `number`
- **Default**: `50`
- **Description**: Maximum number of lines allowed for range selections

## Configuration Example

Add to your VS Code `settings.json`:

```json
{
  "clipCodeRef.format": "preview",
  "clipCodeRef.trimWhitespace": true,
  "clipCodeRef.maxLineLength": 100,
  "clipCodeRef.multiRootBehavior": "auto",
  "clipCodeRef.maxRangeLines": 25
}
```

## Requirements

- VS Code 1.70.0 or higher
- No external dependencies required

## Known Limitations

- Multiple cursors are not supported (shows error message)
- Very large range selections (>50 lines by default) require configuration adjustment
- Web version of VS Code has clipboard API limitations

## Use Cases

Perfect for developers who:
- Use AI coding assistants like Claude Code, GitHub Copilot Chat
- Need to reference specific code locations in documentation
- Want to quickly share code references with team members
- Work with multiple projects and need efficient path handling

## Performance

- Copy operations complete in <100ms for files up to 10,000 lines
- No impact on VS Code startup time
- Minimal memory footprint

## Feedback & Support

- Report issues on [GitHub](https://github.com/kenfdev/ClipCodeRef/issues)
- Feature requests welcome
- Star the project if you find it useful!

## Development

### Version Bumping & Releases

This project uses automated version bumping and dual marketplace publishing.

**For maintainers:**

1. **GitHub Actions** (Recommended):
   - Go to Actions tab → "Version Bump" workflow
   - Click "Run workflow" and select version type (patch/minor/major)
   - Automatically updates package.json, creates tag, and triggers release

2. **Local Development**:
   ```bash
   npm run version:patch   # Bug fixes (1.0.0 → 1.0.1)
   npm run version:minor   # New features (1.0.0 → 1.1.0) 
   npm run version:major   # Breaking changes (1.0.0 → 2.0.0)
   ```

3. **Manual Release**:
   - Go to Actions tab → "Release" workflow
   - Click "Run workflow" and enter the tag name (e.g., `v1.0.3`)
   - Releases published to both VS Code Marketplace and Open VSX Registry

### Development Commands

```bash
npm install          # Install dependencies
npm run watch        # Development mode
npm run compile      # Build + type check + lint
npm test            # Run test suite
npm run package-vsix # Create .vsix package
```

## License

[MIT](LICENSE)

---

**Built for developers using AI coding assistants** 🤖
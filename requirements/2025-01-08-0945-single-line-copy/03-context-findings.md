# Context Findings

**Date:** 2025-01-08 09:48

## Codebase Analysis Results

### Current Implementation Status

#### Already Implemented ✅
- **Command Registration**: `clipcoderef.copyReference` command properly registered
- **Activation Methods**: All three methods configured (keyboard shortcut, command palette, context menu)
- **Multi-cursor Detection**: Error handling for multiple cursors at lines 17-22
- **Clipboard Integration**: Framework using `vscode.env.clipboard.writeText()`
- **Notifications**: Success/error messages implemented
- **Configuration Schema**: Full configuration structure defined in package.json

#### Missing Implementation ❌
- **Main Logic**: TODO placeholder at line 25 in src/extension.ts
- **Path Resolution**: No logic for calculating relative/absolute paths
- **Line Number Extraction**: No code to get current line or selection range
- **Format Implementation**: Neither simple nor preview format implemented
- **Configuration Reading**: Settings not being read from workspace config

### Key Files Analyzed

1. **src/extension.ts**
   - Main extension entry point
   - Lines 24-27 need implementation
   - All supporting structure already in place

2. **package.json**
   - Full configuration schema defined
   - All settings properly typed with defaults
   - Keybindings and menus configured

3. **docs/prd.md**
   - Comprehensive requirements
   - Clear format specifications: `path/to/file L<line>` format
   - Detailed path resolution rules

### Implementation Requirements

#### For Single Line Copy
1. **Detection Logic**: Check if `editor.selection.isEmpty` to determine single line vs range
2. **Line Number**: Use `editor.selection.active.line + 1` for single line (0-based to 1-based)
3. **Format**: Always use space + L prefix format (e.g., `src/file.ts L10`)

#### Path Resolution Patterns
```typescript
// Single workspace
const relativePath = vscode.workspace.asRelativePath(document.uri, false);

// Multi-root workspace
const workspaceFolder = vscode.workspace.getWorkspaceFolder(document.uri);
```

#### Configuration Access
```typescript
const config = vscode.workspace.getConfiguration('clipCodeRef');
const format = config.get<string>('format', 'simple');
```

### Technical Constraints

1. **VS Code Version**: Requires 1.101.0+
2. **Line Numbers**: VS Code uses 0-based indexing, output needs 1-based
3. **Clipboard API**: Must use `vscode.env.clipboard.writeText()` for cross-platform support
4. **Performance**: Must complete in <100ms for files up to 10,000 lines

### Similar Features Found

No similar reference copying features found in the codebase - this is the primary feature of the extension.

### Integration Points

1. **VS Code Selection API**: `editor.selection` for cursor/selection info
2. **VS Code Workspace API**: For path resolution and multi-root handling
3. **VS Code Configuration API**: For reading user preferences
4. **VS Code Clipboard API**: For copying formatted references

### Format Note

**Important**: The PRD specifies the format as `path/to/file L<line>` (with space before L), not the colon format mentioned in CLAUDE.md. The PRD is the authoritative source.
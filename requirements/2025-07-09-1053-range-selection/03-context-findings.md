# Context Findings

## Codebase Analysis Results

### Current Implementation Status
- **Main Implementation**: `src/extension.ts` - Single-line copy fully implemented
- **TODO at line 129-131**: Range selection marked as "Multi-line selection not yet implemented"
- **Test Coverage**: 30+ comprehensive tests in `src/test/extension.test.ts` for single-line functionality
- **Path Resolution**: Complete implementation in `resolveFilePath()` function (lines 3-61)

### Key Implementation Patterns to Follow

#### 1. Selection Handling Pattern
```typescript
// Current pattern for detecting selection type
if (selection.isEmpty) {
  // Single line handling
  reference = generateSingleLineReference(document, selection);
} else {
  // Multi-line handling (TO BE IMPLEMENTED)
  reference = 'Multi-line selection not yet implemented';
}
```

#### 2. Format Generation Pattern
```typescript
// Configuration reading pattern
const config = vscode.workspace.getConfiguration('clipCodeRef');
const format = config.get<string>('format', 'simple');

// Format switching pattern
if (format === 'simple') {
  return `${filePath} L${lineNumber}`;
} else {
  // Preview format with content
  return `${filePath} L${lineNumber}: ${content}`;
}
```

#### 3. Path Resolution Integration
- Uses existing `resolveFilePath(document)` function (lines 3-61)
- Handles single workspace, multi-root workspace, and external files
- Respects `multiRootBehavior` configuration setting
- **Integration Point**: Range selection should use same path resolution logic

#### 4. Configuration System
- Uses `vscode.workspace.getConfiguration('clipCodeRef')`
- Existing settings: `format`, `trimWhitespace`, `maxLineLength`, `multiRootBehavior`
- **New Settings Needed**: `maxRangeLines` (for 50-line limit)

### VS Code API Usage Patterns

#### Selection API
```typescript
// Single line: selection.active.line gives current cursor line
const lineNumber = selection.active.line + 1; // Convert to 1-based

// Range selection: selection.start and selection.end
const startLine = selection.start.line + 1;
const endLine = selection.end.line + 1;
```

#### Content Extraction
```typescript
// Single line content
const line = document.lineAt(selection.active.line);
let content = line.text;

// Multi-line content (for range selection)
const startLine = selection.start.line;
const endLine = selection.end.line;
const selectedText = document.getText(selection);
```

### Test Structure Analysis

#### Existing Test Categories
1. **Extension Test Suite**: Core functionality tests
2. **Edge Case Tests**: Comprehensive edge case coverage  
3. **Path Resolution Logic Tests**: Path handling in different scenarios

#### Test Patterns to Follow
- Configuration setup: `config.update(setting, value, vscode.ConfigurationTarget.Global)`
- Document creation: `vscode.workspace.openTextDocument({ content, language })`
- Selection setup: `editor.selection = new vscode.Selection(start, end)`
- Command execution: `vscode.commands.executeCommand('clipcoderef.copyReference')`
- Clipboard verification: `vscode.env.clipboard.readText()`

### Integration Points for Range Selection

#### 1. Main Command Handler (extension.ts:120-138)
- Replace TODO at line 129-131 with range selection logic
- Add function `generateRangeReference(document, selection)`

#### 2. Configuration Schema (package.json:47-89)
- Add `maxRangeLines` setting for 50-line limit
- Consider adding `rangeFormat` if different behavior needed

#### 3. Test Suite Extensions
- Add new test suite: "Range Selection Tests"
- Follow existing test patterns for configuration and assertions
- Test all format combinations and edge cases

### Implementation Constraints

#### Performance Considerations
- Range selection with preview format could generate large clipboard content
- Need to implement 50-line limit as discovered in requirements
- Use VS Code's `getText(selection)` API for efficient content extraction

#### Error Handling Pattern
```typescript
try {
  // Implementation logic
  await vscode.env.clipboard.writeText(reference);
  vscode.window.showInformationMessage('✓ Code reference copied');
} catch (error) {
  vscode.window.showErrorMessage('✗ Failed to copy reference');
}
```

### Files Requiring Modification
1. **`src/extension.ts`**: Main implementation (lines 129-131)
2. **`package.json`**: Configuration schema update
3. **`src/test/extension.test.ts`**: New test suite for range selection
4. **`CLAUDE.md`**: Update implementation status documentation

### Similar Features Analysis
- Single-line copy provides complete blueprint for range selection
- Same activation methods (keyboard, command palette, context menu)
- Same configuration system integration
- Same path resolution logic
- Same error handling patterns
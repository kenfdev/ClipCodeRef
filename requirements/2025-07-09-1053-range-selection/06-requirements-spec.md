# Requirements Specification: Range Selection Feature

## Problem Statement and Solution Overview

The ClipCodeRef VS Code extension currently supports single-line code references but lacks support for multi-line selections. Users need the ability to copy references for code ranges to better communicate with AI agents about larger code blocks.

**Current State**: Single-line copy working with TODO at `src/extension.ts:129-131`  
**Solution**: Implement range selection functionality that generates `L<start>-L<end>` format references

## Functional Requirements

### Core Functionality
1. **Range Detection**: Detect when `!selection.isEmpty && selection.start.line !== selection.end.line`
2. **Format Support**: Support both simple and preview formats like single-line copy
3. **Line Limit**: Respect configurable `maxRangeLines` setting (default: 50 lines)
4. **Path Resolution**: Use existing `resolveFilePath()` function for consistency

### Output Formats

#### Simple Format
```
src/utils/helper.js L15-L20
```

#### Preview Format
```
src/utils/helper.js L15-L20:
```
<the multi line code>
```
```

### Selection Type Handling
- **Empty Selection** (`selection.isEmpty`): Single-line format (current behavior)
- **Single-line Selection** (`selection.start.line === selection.end.line`): Single-line format
- **Multi-line Selection** (`selection.start.line !== selection.end.line`): Range format

### Content Extraction
- Use `document.getText(selection)` for efficient content extraction
- Preserve raw selected content without trimWhitespace/maxLineLength processing
- Support all VS Code selection types (full line, partial line, mixed)

## Technical Requirements

### Implementation Location
- **Main Function**: Add `generateRangeReference(document, selection)` to `src/extension.ts`
- **Integration Point**: Replace TODO at `src/extension.ts:129-131`
- **Architecture**: Follow existing single-file extension pattern

### Configuration Schema Updates
Add to `package.json` configuration:
```json
"clipCodeRef.maxRangeLines": {
  "type": "number",
  "default": 50,
  "description": "Maximum number of lines allowed for range selections"
}
```

### API Integration Points
```typescript
// Range detection
const startLine = selection.start.line + 1; // Convert to 1-based
const endLine = selection.end.line + 1;

// Content extraction
const selectedText = document.getText(selection);

// Path resolution (existing)
const filePath = resolveFilePath(document);
```

### Error Handling
- **Line Limit Exceeded**: Show error message when selection exceeds `maxRangeLines`
- **Multi-cursor Detection**: Existing error handling remains unchanged
- **Clipboard Failures**: Use existing error handling pattern

## Implementation Hints and Patterns

### Function Structure
```typescript
function generateRangeReference(document: vscode.TextDocument, selection: vscode.Selection): string {
  const config = vscode.workspace.getConfiguration('clipCodeRef');
  const format = config.get<string>('format', 'simple');
  const maxRangeLines = config.get<number>('maxRangeLines', 50);
  
  const startLine = selection.start.line + 1;
  const endLine = selection.end.line + 1;
  const lineCount = endLine - startLine + 1;
  
  // Check line limit
  if (lineCount > maxRangeLines) {
    throw new Error(`Selection exceeds maximum range of ${maxRangeLines} lines`);
  }
  
  const filePath = resolveFilePath(document);
  
  if (format === 'simple') {
    return `${filePath} L${startLine}-L${endLine}`;
  } else {
    const selectedText = document.getText(selection);
    return `${filePath} L${startLine}-L${endLine}:\n\`\`\`\n${selectedText}\n\`\`\``;
  }
}
```

### Selection Logic Update
```typescript
// In main command handler, replace lines 129-131:
if (selection.isEmpty) {
  reference = generateSingleLineReference(document, selection);
} else if (selection.start.line === selection.end.line) {
  // Single-line selection - use single-line format
  reference = generateSingleLineReference(document, selection);
} else {
  // Multi-line selection - use range format
  reference = generateRangeReference(document, selection);
}
```

## Acceptance Criteria

### Functional Criteria
- [ ] Range selection generates `L<start>-L<end>` format for simple mode
- [ ] Range selection generates code block format for preview mode
- [ ] Single-line selections continue using existing L<line> format
- [ ] Path resolution uses existing `resolveFilePath()` function
- [ ] Content extraction uses `document.getText(selection)` API
- [ ] Line limit enforced via `maxRangeLines` configuration

### Technical Criteria
- [ ] `generateRangeReference()` function added to `src/extension.ts`
- [ ] `maxRangeLines` configuration added to `package.json`
- [ ] TODO at lines 129-131 replaced with range selection logic
- [ ] Existing single-line behavior preserved
- [ ] Error handling follows existing patterns

### Quality Criteria
- [ ] All existing tests continue to pass
- [ ] New test suite added for range selection functionality
- [ ] Code follows existing TypeScript patterns
- [ ] Configuration schema follows existing conventions
- [ ] Performance remains under 100ms for typical selections

## Test Strategy

### New Test Suite: "Range Selection Tests"
```typescript
suite('Range Selection Tests', () => {
  test('Multi-line selection - simple format');
  test('Multi-line selection - preview format with code block');
  test('Single-line selection preserves existing behavior');
  test('Range selection respects maxRangeLines limit');
  test('Range selection uses same path resolution as single-line');
  test('Range selection handles different file types');
  test('Range selection with partial line selections');
});
```

### Test Patterns to Follow
- Configuration setup: `config.update('maxRangeLines', 25, vscode.ConfigurationTarget.Global)`
- Multi-line selection: `new vscode.Selection(new vscode.Position(0, 0), new vscode.Position(2, 10))`
- Content verification: Assert clipboard contains expected L<start>-L<end> format
- Error cases: Test line limit exceeded scenarios

## Files to Modify

1. **`src/extension.ts`**
   - Add `generateRangeReference()` function
   - Update selection logic at lines 129-131
   - Add error handling for line limit exceeded

2. **`package.json`**
   - Add `clipCodeRef.maxRangeLines` configuration property

3. **`src/test/extension.test.ts`**
   - Add "Range Selection Tests" suite
   - Test all format combinations and edge cases

4. **`CLAUDE.md`** (if needed)
   - Update implementation status documentation

## Assumptions

- Users want raw selected content without line processing (confirmed)
- 50-line default limit is reasonable for typical use cases
- Existing single-line behavior should be preserved for backward compatibility
- Range selection should follow same activation methods as single-line copy
- Performance requirements remain the same (<100ms operation)

## Integration Notes

- **Backward Compatibility**: All existing functionality preserved
- **Configuration Migration**: New setting has sensible default, no migration needed
- **API Consistency**: Uses same VS Code APIs and patterns as single-line copy
- **Error Handling**: Follows existing error message patterns
- **Path Resolution**: Integrates seamlessly with existing multi-root workspace handling
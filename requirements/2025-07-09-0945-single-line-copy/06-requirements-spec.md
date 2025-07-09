# Requirements Specification: Single Line Copy Feature

**Date:** 2025-01-08 09:51

## Problem Statement

Users need a streamlined way to copy code references when their cursor is on a single line without having to select the entire line. This feature complements the existing multi-line selection capability and provides a faster workflow for referencing individual lines in AI agent conversations.

## Solution Overview

Enhance the existing `clipcoderef.copyReference` command to detect when there's no selection (just a cursor position) and automatically generate a reference for that single line. The feature will use the same keyboard shortcut and respect all existing configuration settings.

## Functional Requirements

### 1. Single Line Detection
- **FR1.1**: When `editor.selection.isEmpty` is true, treat as single line copy
- **FR1.2**: Use `editor.selection.active.line` to get the current cursor line
- **FR1.3**: Generate reference format: `<path> L<line>` where line is 1-based

### 2. Format Support
- **FR2.1**: Respect `clipCodeRef.format` setting for both simple and preview modes
- **FR2.2**: Simple format: `src/file.ts L10`
- **FR2.3**: Preview format: `src/file.ts L10: const example = true;`
- **FR2.4**: Apply `trimWhitespace` and `maxLineLength` settings to preview format

### 3. Behavior Consistency
- **FR3.1**: Use same keyboard shortcut as multi-line copy (Ctrl/Cmd+Shift+C)
- **FR3.2**: Work in all file types (code, markdown, JSON, etc.)
- **FR3.3**: Handle empty lines by generating normal references
- **FR3.4**: Treat all lines uniformly, including last line without newline

### 4. Edge Cases
- **FR4.1**: Empty/blank lines produce valid references (e.g., `src/file.ts L15`)
- **FR4.2**: Multi-line statements are treated as single lines when cursor present
- **FR4.3**: Existing multi-cursor error handling remains unchanged

## Technical Requirements

### 1. Implementation Location
- **TR1.1**: Implement in `src/extension.ts` at line 25 (replacing TODO comment)
- **TR1.2**: No new files needed - enhance existing command handler

### 2. API Usage
- **TR2.1**: Use `editor.selection.isEmpty` for single line detection
- **TR2.2**: Use `editor.selection.active.line + 1` for line number (0-based to 1-based)
- **TR2.3**: Use existing VS Code APIs for path resolution and configuration

### 3. Code Structure
```typescript
// Pseudo-code for implementation
if (editor.selection.isEmpty) {
  // Single line copy
  const line = editor.selection.active.line + 1;
  const lineRef = `L${line}`;
  // ... rest of path resolution and formatting
} else {
  // Multi-line selection (existing logic)
  const startLine = editor.selection.start.line + 1;
  const endLine = editor.selection.end.line + 1;
  const lineRef = `L${startLine}-L${endLine}`;
  // ... rest of implementation
}
```

### 4. Configuration Reading
- **TR4.1**: Read all settings using `vscode.workspace.getConfiguration('clipCodeRef')`
- **TR4.2**: Use documented defaults if settings not present

## Implementation Hints

### Path Resolution Pattern
```typescript
const document = editor.document;
const workspaceFolder = vscode.workspace.getWorkspaceFolder(document.uri);
const relativePath = vscode.workspace.asRelativePath(document.uri, false);
```

### Preview Format Implementation
```typescript
if (format === 'preview') {
  const lineText = document.lineAt(line - 1).text;
  const trimmed = trimWhitespace ? lineText.trim() : lineText;
  const truncated = trimmed.length > maxLineLength 
    ? trimmed.substring(0, maxLineLength) + '...' 
    : trimmed;
  reference = `${path} L${line}: ${truncated}`;
}
```

## Acceptance Criteria

1. ✅ Single cursor (no selection) copies reference for current line only
2. ✅ Format setting applies to both single and multi-line operations
3. ✅ Empty lines generate valid references without special handling
4. ✅ All file types supported for single line copy
5. ✅ Same keyboard shortcut works for both single and multi-line
6. ✅ Preview format includes line content with proper trimming/truncation
7. ✅ Multi-line statements treated as single lines when cursor present
8. ✅ Performance remains under 100ms for files up to 10,000 lines

## Assumptions

1. The existing multi-cursor detection and error handling should not be modified
2. The reference format follows PRD specification: space before L (e.g., `file.ts L10`)
3. Line numbers are always 1-based in the output
4. VS Code's selection API handles all edge cases internally
5. The implementation will reuse existing notification messages

## Out of Scope

- Creating a separate command for single line copy
- Different keyboard shortcuts for single vs multi-line
- Smart detection of logical code blocks or statements
- Any changes to multi-cursor behavior
- Modifications to existing configuration schema
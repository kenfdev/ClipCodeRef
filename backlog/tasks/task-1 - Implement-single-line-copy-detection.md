---
id: task-1
title: Implement single line copy detection
status: Done
assignee:
  - '@ai'
created_date: '2025-07-09'
updated_date: '2025-07-09'
labels:
  - single-line-copy
  - core
dependencies: []
---

## Description

Enable copying code references when cursor is on a single line without selection. This is the core functionality that detects when no text is selected and generates a reference for the current cursor line.

## Acceptance Criteria

- [x] editor.selection.isEmpty correctly identifies single line scenario
- [x] Cursor line is captured using editor.selection.active.line
- [x] Line number is converted from 0-based to 1-based
- [x] Single line reference format matches pattern: path L<line>

## Implementation Plan

1. Write tests for single-line detection logic
2. Implement isEmpty check for selection
3. Get cursor line using selection.active.line
4. Convert line number from 0-based to 1-based
5. Generate single line reference format
6. Run tests to verify implementation

## Implementation Notes

- Approach: Followed TDD methodology, writing comprehensive tests first before implementation
- Features implemented:
  - Added single-line detection using `editor.selection.isEmpty` check
  - Captured cursor position using `selection.active.line` property
  - Converted line numbers from VS Code's 0-based indexing to user-friendly 1-based format
  - Generated reference format as `<relativePath> L<lineNumber>`
- Technical decisions:
  - Used `vscode.workspace.asRelativePath()` for consistent path handling
  - Kept the implementation simple and focused on the single responsibility
  - Added placeholder message for multi-line selection (to be implemented in future tasks)
- Modified files:
  - `src/extension.ts`: Added single-line copy detection logic
  - `src/test/extension.test.ts`: Added comprehensive tests for single-line scenarios

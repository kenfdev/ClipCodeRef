---
id: task-2
title: Implement single line format support
status: Done
assignee:
  - '@ai'
created_date: '2025-07-09'
updated_date: '2025-07-09'
labels:
  - single-line-copy
  - formatting
dependencies:
  - task-1
---

## Description

Add support for both simple and preview formats when copying single line references. Must respect existing configuration settings for format type, whitespace trimming, and line length limits.

## Acceptance Criteria

- [x] Simple format generates: path L<line>
- [x] Preview format generates: path L<line>: <content>
- [x] trimWhitespace setting is applied in preview mode
- [x] maxLineLength setting truncates long lines with ellipsis
- [x] Format configuration is read from clipCodeRef.format setting

## Implementation Plan

1. Refactor extension.ts to read configuration settings
2. Implement format type detection (simple vs preview)
3. Implement simple format: path L<line>
4. Implement preview format: path L<line>: <content>
5. Apply trimWhitespace setting for preview mode
6. Apply maxLineLength setting with ellipsis truncation
7. Test both formats with different configuration settings

## Implementation Notes

Implemented single-line format support with configuration-based format selection.

## Features implemented:
- Added generateSingleLineReference() function that handles both simple and preview formats
- Configuration reading for clipCodeRef.format setting (simple/preview)
- Simple format: generates 'path L<line>' format
- Preview format: generates 'path L<line>: <content>' format
- Applied trimWhitespace setting in preview mode to remove leading/trailing whitespace
- Applied maxLineLength setting with ellipsis truncation ('...') for long lines
- Integrated with existing single-cursor detection and path resolution logic

## Technical decisions:
- Extracted single-line logic into separate function for better modularity
- Used vscode.workspace.getConfiguration() for reading user settings
- Applied settings only in preview mode as per requirements
- Used substring() + '...' for line truncation to indicate continuation

## Modified files:
- src/extension.ts: Added generateSingleLineReference() function and updated command handler

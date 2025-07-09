---
id: task-2
title: Implement single line format support
status: To Do
assignee:
  - '@ai'
created_date: '2025-07-09'
labels:
  - single-line-copy
  - formatting
dependencies:
  - task-1
---

## Description

Add support for both simple and preview formats when copying single line references. Must respect existing configuration settings for format type, whitespace trimming, and line length limits.

## Acceptance Criteria

- [ ] Simple format generates: path L<line>
- [ ] Preview format generates: path L<line>: <content>
- [ ] trimWhitespace setting is applied in preview mode
- [ ] maxLineLength setting truncates long lines with ellipsis
- [ ] Format configuration is read from clipCodeRef.format setting

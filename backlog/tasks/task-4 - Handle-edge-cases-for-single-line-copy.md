---
id: task-4
title: Handle edge cases for single line copy
status: To Do
assignee:
  - '@ai'
created_date: '2025-07-09'
labels:
  - single-line-copy
  - edge-cases
dependencies:
  - task-1
  - task-2
---

## Description

Ensure single line copy handles edge cases correctly including empty lines, last lines without newlines, and maintains existing multi-cursor error behavior.

## Acceptance Criteria

- [ ] Empty/blank lines generate valid references (e.g. src/file.ts L15)
- [ ] Last line without newline is handled correctly
- [ ] Multi-cursor detection remains unchanged
- [ ] All file types are supported (code markdown JSON etc)
- [ ] Multi-line statements are treated as single lines when cursor present

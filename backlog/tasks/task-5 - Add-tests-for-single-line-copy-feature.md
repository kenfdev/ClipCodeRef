---
id: task-5
title: Add tests for single line copy feature
status: To Do
assignee:
  - '@ai'
created_date: '2025-07-09'
labels:
  - single-line-copy
  - testing
dependencies:
  - task-1
  - task-2
  - task-3
  - task-4
---

## Description

Create comprehensive test coverage for the single line copy functionality including unit tests for all scenarios and performance benchmarks.

## Acceptance Criteria

- [ ] Unit tests cover single line detection logic
- [ ] Tests verify simple format output
- [ ] Tests verify preview format with trimming and truncation
- [ ] Edge cases are tested (empty lines multi-cursor etc)
- [ ] Performance test confirms sub-100ms execution for 10k line files
- [ ] All tests pass in CI environment

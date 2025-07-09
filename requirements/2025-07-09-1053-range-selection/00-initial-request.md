# Initial Request: Add Range Selection Feature

## Request Summary
Add range selection functionality to the ClipCodeRef VS Code extension to support copying code references for multi-line selections.

## Current Status
- Single-line copy functionality is fully implemented and tested
- Range selection is marked as TODO in extension.ts:129-131
- PRD specifies range selection should output format `<path/to/file> L<start>-L<end>`

## Existing Implementation Context
- Extension has complete single-line copy with simple and preview formats
- Path resolution logic is implemented for various workspace configurations
- Configuration system supports format, trimming, and path behavior settings
- Comprehensive test suite exists for single-line functionality

## User Need
Enable developers to copy references for multi-line code selections in a format optimized for AI agents, extending the current single-line copy capability.

## Technical Context
- VS Code extension using TypeScript
- Current command: `clipcoderef.copyReference`
- Selection detection: `editor.selection.isEmpty` differentiates single vs multi-line
- Output formats: simple (`path L<line>`) and preview (`path L<line>: <content>`)
- Path resolution handles single workspace, multi-root, and external files
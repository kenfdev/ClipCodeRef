# Product Requirements Document: ClipCodeRef

## 1. Product Overview

### 1.1 Product Name
**ClipCodeRef**

### 1.2 Product Description
A VS Code extension that enables developers to quickly copy code line references in a format optimized for AI coding assistants like Claude Code. The extension formats selected code locations as `<path/to/file> L<line>` references that can be easily pasted into AI agent conversations.

### 1.3 Problem Statement
Developers using CLI AI agents for coding assistance face friction when trying to reference specific code locations. Currently, they must manually type file paths and line numbers, which is time-consuming and error-prone. This extension streamlines the workflow by automatically generating properly formatted references with a single action.

### 1.4 Target Users
- Developers who use AI coding assistants (Claude Code, GitHub Copilot Chat, etc.)
- Teams adopting AI-driven development workflows
- Developers who frequently need to reference specific code locations in external tools

## 2. Goals & Success Metrics

### 2.1 Primary Goals
- Reduce time to reference code locations from 15-30 seconds to under 2 seconds
- Eliminate errors in manual path/line number entry
- Improve developer satisfaction when working with AI agents

### 2.2 Success Metrics
- **Adoption**: 1,000+ installs within 3 months
- **Engagement**: 70% weekly active users (WAU/installs)
- **Retention**: 60% of users still active after 30 days
- **Usage**: Average 20+ copies per active user per week
- **Ratings**: 4.5+ star rating on VS Code Marketplace

## 3. Functional Requirements

### 3.1 Core Features

#### 3.1.1 Copy Code Reference
- **Single Line**: When cursor is on a line with no selection, copy reference as `<path/to/file> L<line>`
- **Range Selection**: When text is selected, copy as `<path/to/file> L<start>-L<end>`
- **Multi-cursor**: Not supported - show error message if multiple cursors detected

#### 3.1.2 Activation Methods
- **Keyboard Shortcut**: Default `Ctrl+Shift+C` (Windows/Linux) or `Cmd+Shift+C` (Mac)
- **Command Palette**: "ClipCodeRef: Copy Code Reference"
- **Context Menu**: Right-click → "Copy Code Reference"

#### 3.1.3 Path Handling
- **Single Workspace**: Paths relative to workspace root
- **Multi-root Workspace**: 
  - Path relative to the file's containing workspace root
  - When ambiguity might exist, include workspace folder name as prefix: `[workspace-name]/<path/to/file> L<line>`
  - Setting to toggle workspace name prefix (default: auto-detect based on uniqueness)
- **Unsaved Files**: Use `Untitled-1 L<line>` format
- **Files Outside Workspace**: Use absolute path with home directory shortened to `~`

### 3.2 Configuration Options

#### 3.2.1 Output Formats
1. **Simple Reference** (Default): `src/utils/helper.js L15`
2. **With Code Preview**: `src/utils/helper.js L15: const result = calculate(x, y);`

#### 3.2.2 Settings
- `clipCodeRef.format`: Choose output format ("simple" or "preview")
- `clipCodeRef.trimWhitespace`: Remove leading/trailing whitespace from code preview (boolean, default: true)
- `clipCodeRef.maxLineLength`: Truncate long lines in preview (number, default: 80)
- `clipCodeRef.multiRootBehavior`: How to handle multi-root workspaces
  - `"auto"` (default): Include workspace name only when paths would be ambiguous
  - `"always"`: Always include workspace name
  - `"never"`: Never include workspace name

### 3.3 User Feedback
- **Success Notification**: Small toast notification in bottom-right: "✓ Code reference copied"
- **Error Notification**: Red toast for errors: "✗ Failed to copy reference"
- **Multi-cursor Error**: "✗ Multiple cursors not supported. Please use single cursor or selection."

## 4. Non-Functional Requirements

### 4.1 Performance
- Copy operation completes in <100ms for files up to 10,000 lines
- No noticeable impact on VS Code startup time (<50ms)

### 4.2 Compatibility
- VS Code version: 1.70.0 or higher
- All platforms: Windows, macOS, Linux
- Web version of VS Code (with clipboard API limitations noted)

### 4.3 Accessibility
- All features accessible via keyboard
- Screen reader compatible notifications
- High contrast theme support

## 5. Technical Architecture

### 5.1 Extension Components
- **Activation Events**: `onCommand`, `onStartupFinished`
- **Commands**: Single command with format variations
- **Context Menu**: Conditional visibility based on editor state
- **Clipboard API**: Use VS Code's clipboard API for cross-platform support

### 5.2 Error Handling
- Graceful handling of permission errors
- Fallback for clipboard access failures
- Clear error messages for user action
- Multi-cursor detection and helpful error message

## 6. MVP Scope

### 6.1 MVP Features (v1.0)
- Simple reference format only
- All three activation methods
- Single and range selection support
- Basic path handling for single workspace
- Success/error notifications

### 6.2 Post-MVP Features (v1.1+)
- Code preview format option
- Configuration settings
- Smart multi-root workspace handling
- Telemetry for usage analytics

## 7. User Experience Flow

### 7.1 Primary Flow
1. User places cursor on line or selects code range
2. User triggers extension via preferred method
3. Extension calculates relative path and line numbers
4. Formatted reference copied to clipboard
5. Success notification appears
6. User pastes reference in AI agent interface

### 7.2 Edge Cases
- Empty selection → Use current line
- Multiple cursors → Error with message: "Multiple cursors not supported"
- No active editor → Error notification
- Clipboard access denied → Show manual copy dialog
- Duplicate file names in multi-root → Auto-prefix with workspace name

## 8. Path Resolution Examples

### 8.1 Single Workspace
```
Workspace: /Users/dev/my-project
File: /Users/dev/my-project/src/utils/helper.js
Output: src/utils/helper.js L15
```

### 8.2 Multi-root Workspace (Auto Mode)
```
Workspaces: [frontend, backend]
File: /path/to/frontend/src/App.js (unique path)
Output: src/App.js L10

File: /path/to/frontend/src/utils/api.js (exists in both workspaces)
Output: [frontend]/src/utils/api.js L25
```

### 8.3 External File
```
Workspace: /Users/dev/my-project
File: /Users/dev/other-project/test.js
Output: ~/other-project/test.js L5
```

## 9. Marketing & Distribution

### 9.1 VS Code Marketplace Listing
- **Name**: "ClipCodeRef - Code Reference Clipper for AI"
- **Categories**: Programming Languages, Other
- **Tags**: ai, claude, copilot, code-reference, productivity, clipboard

### 9.2 Key Messaging
- "Reference code in AI agents 10x faster"
- "Built for developers using Claude Code and other AI assistants"
- "Simple, fast, and intelligent path handling"

## 10. Future Considerations

### 10.1 Potential Enhancements
- Git blame information in references
- Project-specific reference formats via `.clipcoderef` config file
- Integration with specific AI tools
- Reference history
- Batch operations for multiple files

### 10.2 User Requested Features (Backlog)
- Custom format templates
- Language-specific enhancements
- Team sharing of reference formats

## 11. Launch Plan

### 11.1 Development Phases
1. **Week 1-2**: MVP development (simple format only)
2. **Week 3**: Internal testing and refinement
3. **Week 4**: Beta release to select users
4. **Week 5**: Marketplace submission
5. **Week 6**: Add code preview format based on feedback
6. **Week 7+**: Iterate based on user feedback

### 11.2 Success Criteria for Launch
- Zero critical bugs
- <100ms performance on reference copy
- Positive feedback from 5+ beta testers
- Clear documentation with GIF demonstrations
- Multi-root workspace handling tested thoroughly
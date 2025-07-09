# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

ClipCodeRef is a VS Code extension for copying code references in a format optimized for AI agents (like Claude, Copilot). The extension allows users to select code and copy it with context information (file path, line numbers) for better AI understanding.

## Development Commands

```bash
# Core development workflow
npm install          # Install dependencies
npm run watch        # Development mode (auto-rebuild on changes)
npm run package      # Production build with minification

# Individual tasks
npm run compile      # Type check + lint + build
npm run check-types  # TypeScript type checking only
npm run lint         # Run ESLint
npm test            # Run test suite

# Test development
npm run compile-tests  # Compile tests to JavaScript
npm run watch-tests    # Watch mode for tests
```

### Testing the Extension

1. Run `npm run watch` to start development mode
2. Press `F5` in VS Code to launch Extension Development Host
3. Test the command via:
   - Keyboard: `Ctrl+Shift+C` (Windows/Linux) or `Cmd+Shift+C` (Mac)
   - Command Palette: "Copy Code Reference"
   - Right-click menu: "Copy Code Reference"

## Architecture

### Build System

- **Bundler**: esbuild (fast, efficient bundling)
- **Entry**: `src/extension.ts` → `dist/extension.js`
- **Development**: Source maps enabled, no minification
- **Production**: Minified, no source maps

### Extension Structure

- **Activation**: On command execution (no startup impact)
- **Command ID**: `clipcoderef.copyReference`
- **Configuration Prefix**: `clipCodeRef.*`

### Configuration Schema

```typescript
{
  "clipCodeRef.format": "simple" | "preview",        // Output format
  "clipCodeRef.trimWhitespace": boolean,             // Trim in preview mode
  "clipCodeRef.maxLineLength": number,               // Max preview line length
  "clipCodeRef.multiRootBehavior": "absolute" | "workspace" | "relative"
}
```

### Key Implementation Points

1. **Multi-cursor Detection**: Already implemented - shows error for multiple selections
2. **Path Resolution Logic**: Consider these scenarios:

   - Single workspace: Use workspace-relative paths
   - Multi-root workspace: Follow `multiRootBehavior` setting
   - No workspace: Use absolute paths

3. **Format Types**:

   - **Simple**: `path/to/file.ts L10` (compact for AI consumption, single line)
   - **Preview**: `path/to/file.ts L10: <code content>` (shows actual code, respects trim/maxLength settings)

4. **Clipboard Operations**:
   ```typescript
   await vscode.env.clipboard.writeText(formattedReference);
   vscode.window.showInformationMessage('Code reference copied!');
   ```

### VS Code API Usage Patterns

```typescript
// Configuration reading
const config = vscode.workspace.getConfiguration('clipCodeRef');
const format = config.get<string>('format', 'simple');

// Path resolution for multi-root workspaces
const workspaceFolder = vscode.workspace.getWorkspaceFolder(document.uri);
const relativePath = vscode.workspace.asRelativePath(document.uri, false);

// Selection handling
const selection = editor.selection;
const startLine = selection.start.line + 1; // VS Code uses 0-based
const endLine = selection.end.line + 1;
```

## Testing Strategy

Tests should cover:

- Single line selection
- Multi-line selection
- Different output formats
- Path resolution in various workspace configurations
- Configuration changes
- Edge cases (empty selection, unsaved files)

## Current Implementation Status

- ✅ Extension manifest and configuration schema
- ✅ Build system with esbuild
- ✅ Multi-cursor error handling
- ✅ Command registration structure
- ✅ Path resolution logic
- ✅ Format implementation (simple/preview)
- ✅ Configuration reading
- ✅ Clipboard integration
- ✅ Test coverage
- ✅ Edge case handling (empty lines, last line without newline, all file types)
- ✅ Range selection feature (multi-line selections)
- ✅ maxRangeLines configuration and validation
- ✅ Range selection integration with all activation methods
- ✅ Performance optimized (under 100ms)
- ✅ Backward compatibility maintained for single-line functionality

## Important Notes

- The extension uses esbuild, not webpack (correct the mental model)
- No runtime dependencies - pure VS Code extension
- The PRD (`backlog/docs/prd.md`) contains detailed requirements and examples
- Configuration keys use `clipCodeRef` prefix (camelCase, not lowercase)

# Instructions for the usage of Backlog.md CLI Tool

## 1. Source of Truth

- Tasks live under **`backlog/tasks/`** (drafts under **`backlog/drafts/`**).
- Every implementation decision starts with reading the corresponding Markdown task file.
- Project documentation is in **`backlog/docs/`**.
- Project decisions are in **`backlog/decisions/`**.
- Project Requirements are stored in **`requirements/`**

## 2. Defining Tasks

### **Title**

Use a clear brief title that summarizes the task.

### **Description**: (The **"why"**)

Provide a concise summary of the task purpose and its goal. Do not add implementation details here. It
should explain the purpose and context of the task. Code snippets should be avoided.

### **Acceptance Criteria**: (The **"what"**)

List specific, measurable outcomes that define what means to reach the goal from the description. Use checkboxes (`- [ ]`) for tracking.
When defining `## Acceptance Criteria` for a task, focus on **outcomes, behaviors, and verifiable requirements** rather
than step-by-step implementation details.
Acceptance Criteria (AC) define _what_ conditions must be met for the task to be considered complete.
They should be testable and confirm that the core purpose of the task is achieved.
**Key Principles for Good ACs:**

- **Outcome-Oriented:** Focus on the result, not the method.
- **Testable/Verifiable:** Each criterion should be something that can be objectively tested or verified.
- **Clear and Concise:** Unambiguous language.
- **Complete:** Collectively, ACs should cover the scope of the task.
- **User-Focused (where applicable):** Frame ACs from the perspective of the end-user or the system's external behavior.

  - _Good Example:_ "- [ ] User can successfully log in with valid credentials."
  - _Good Example:_ "- [ ] System processes 1000 requests per second without errors."
  - _Bad Example (Implementation Step):_ "- [ ] Add a new function `handleLogin()` in `auth.ts`."

### Task file

Once a task is created it will be stored in `backlog/tasks/` directory as a Markdown file with the format
`task-<id> - <title>.md` (e.g. `task-42 - Add GraphQL resolver.md`).

### Additional task requirements

- Tasks must be **atomic** and **testable**. If a task is too large, break it down into smaller subtasks.
  Each task should represent a single unit of work that can be completed in a single PR.

- **Never** reference tasks that are to be done in the future or that are not yet created. You can only reference
  previous
  tasks (id < current task id).

- When creating multiple tasks, ensure they are **independent** and they do not depend on future tasks.  
  Example of wrong tasks splitting: task 1: "Add API endpoint for user data", task 2: "Define the user model and DB
  schema".  
  Example of correct tasks splitting: task 1: "Add system for handling API requests", task 2: "Add user model and DB
  schema", task 3: "Add API endpoint for user data".

## 3. Recommended Task Anatomy

```markdown
# task‑42 - Add GraphQL resolver

## Description (the why)

Short, imperative explanation of the goal of the task and why it is needed.

## Acceptance Criteria (the what)

- [ ] Resolver returns correct data for happy path
- [ ] Error response matches REST
- [ ] P95 latency ≤ 50 ms under 100 RPS

## Implementation Plan (the how)

1. Research existing GraphQL resolver patterns
2. Implement basic resolver with error handling
3. Add performance monitoring
4. Benchmark performance under load

## Implementation Notes (only added after working on the task)

- Approach taken
- Features implemented or modified
- Technical decisions and trade-offs
- Modified or added files
```

## 6. Implementing Tasks

Mandatory sections for every task:

- **Implementation Plan**: (The **"how"**) Outline the steps to achieve the task. Because the implementation details may
  change after the task is created, **the implementation notes must be added only after putting the task in progress**
  and before starting working on the task.
- **Implementation Notes**: Document your approach, decisions, challenges, and any deviations from the plan. This
  section is added after you are done working on the task. It should summarize what you did and why you did it. Keep it
  concise but informative.

**IMPORTANT**: Do not implement anything else that deviates from the **Acceptance Criteria**. If you need to
implement something that is not in the AC, update the AC first and then implement it or create a new task for it.

ALWAYS implement in a TDD approach as Kent Beck mentions.

1. Write tests and confirm they fail.
2. Wait for confirmation from the user to see if the test is good enough or not.
3. After confirmation, write the code to pass the test.

## CRITICAL TDD WORKFLOW - NEVER VIOLATE

**🚫 NEVER IMPLEMENT CODE WITHOUT TESTS FIRST**

When working on any task that involves **application code implementation**:

1. **MANDATORY**: Write failing tests FIRST
2. **MANDATORY**: Present test plan and wait for user confirmation
3. **MANDATORY**: Only after user confirms tests are adequate, implement the code to pass tests
4. **MANDATORY**: Never skip this process, even for seemingly simple tasks

This is a strict requirement. Implementation without tests-first violates the project's TDD principles and must never happen again.

**Note**: TDD applies to application code (TypeScript/JavaScript logic, features, bug fixes). Infrastructure tasks (CI/CD workflows, build configs, deployment scripts) do not require tests as they are configuration, not testable business logic.

## ⚠️ MANDATORY CHECKPOINT SYSTEM ⚠️

**BEFORE IMPLEMENTING ANY APPLICATION CODE, CLAUDE MUST:**

1. **STOP** - Do not implement code after writing tests
2. **ASK** - "I've written tests for [feature]. Do these tests adequately cover the requirements? Should I proceed with implementing the code to make them pass?"
3. **WAIT** - Do not proceed until user explicitly confirms
4. **IMPLEMENT** - Only after user approval, write the minimal code to pass tests

**If you find yourself about to implement code without asking for test confirmation, STOP IMMEDIATELY and ask for permission.**

This checkpoint system is designed to prevent automatic implementation and ensure proper TDD workflow.

**Note**: This checkpoint system applies only to application code (TypeScript/JavaScript logic, features, bug fixes). Infrastructure tasks (CI/CD workflows, build configs, deployment scripts) can be implemented directly as they are configuration, not testable business logic.

## TASK CREATION RULES

**🚫 NEVER CREATE SEPARATE TESTING TASKS**

- Tests are NOT separate tasks - they are part of implementation tasks
- Each implementation task MUST include test writing as the first step
- Testing is embedded within the TDD workflow of each task
- Only create tasks for: features, bug fixes, refactoring, configuration, documentation
- Testing tasks violate TDD principles and fragment the development process 

## 2. Typical Workflow

```bash
# 1 Identify work
backlog task list -s "To Do" --plain

# 2 Read details & documentation
backlog task 42 --plain
# Read also all documentation files in `backlog/docs/` directory.
# Read also all decision files in `backlog/decisions/` directory.

# 3 Start work: assign yourself & move column
backlog task edit 42 -a @{yourself} -s "In Progress"

# 4 Add implementation plan before starting
backlog task edit 42 --plan "1. Analyze current implementation\n2. Identify bottlenecks\n3. Refactor in phases"

# 5 Break work down if needed by creating subtasks or additional tasks
backlog task create "Refactor DB layer" -p 42 -a @{yourself} -d "Description" --ac "Tests pass,Performance improved"

# 6 Complete and mark Done
backlog task edit 42 -s Done --notes "Implemented GraphQL resolver with error handling and performance monitoring"
```

### 7. Final Steps Before Marking a Task as Done

Always ensure you have:

1. ✅ Marked all acceptance criteria as completed (change `- [ ]` to `- [x]`)
2. ✅ Added an `## Implementation Notes` section documenting your approach
3. ✅ Run all tests and linting checks
4. ✅ Updated relevant documentation

## 8. Definition of Done (DoD)

A task is **Done** only when **ALL** of the following are complete:

1. **Acceptance criteria** checklist in the task file is fully checked (all `- [ ]` changed to `- [x]`).
2. **Implementation plan** was followed or deviations were documented in Implementation Notes.
3. **Automated tests** (unit + integration) cover new logic.
4. **Static analysis**: linter & formatter succeed.
5. **Documentation**:
   - All relevant docs updated (any relevant README file, backlog/docs, backlog/decisions, etc.).
   - Task file **MUST** have an `## Implementation Notes` section added summarizing:
     - Approach taken
     - Features implemented or modified
     - Technical decisions and trade-offs
     - Modified or added files
6. **Review**: self review code.
7. **Task hygiene**: status set to **Done** via CLI (`backlog task edit <id> -s Done`).
8. **No regressions**: performance, security and license checks green.

⚠️ **IMPORTANT**: Never mark a task as Done without completing ALL items above.

## 9. Handy CLI Commands

| Purpose          | Command                                                                |
| ---------------- | ---------------------------------------------------------------------- |
| Create task      | `backlog task create "Add OAuth"`                                      |
| Create with desc | `backlog task create "Feature" -d "Enables users to use this feature"` |
| Create with AC   | `backlog task create "Feature" --ac "Must work,Must be tested"`        |
| Create with deps | `backlog task create "Feature" --dep task-1,task-2`                    |
| Create sub task  | `backlog task create -p 14 "Add Google auth"`                          |
| List tasks       | `backlog task list --plain`                                            |
| View detail      | `backlog task 7 --plain`                                               |
| Edit             | `backlog task edit 7 -a @{yourself} -l auth,backend`                   |
| Add plan         | `backlog task edit 7 --plan "Implementation approach"`                 |
| Add AC           | `backlog task edit 7 --ac "New criterion,Another one"`                 |
| Add deps         | `backlog task edit 7 --dep task-1,task-2`                              |
| Add notes        | `backlog task edit 7 --notes "We added this and that feature because"` |
| Mark as done     | `backlog task edit 7 -s "Done"`                                        |
| Archive          | `backlog task archive 7`                                               |
| Draft flow       | `backlog draft create "Spike GraphQL"` → `backlog draft promote 3.1`   |
| Demote to draft  | `backlog task demote <task-id>`                                        |

## 10. Tips for AI Agents

- **Always use `--plain` flag** when listing or viewing tasks for AI-friendly text output instead of using Backlog.md
  interactive UI.
- When users mention to create a task, they mean to create a task using Backlog.md CLI tool.

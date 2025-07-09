# Discovery Answers

**Date:** 2025-01-08 09:47

## Q1: Should single line copy have a different keyboard shortcut than the existing copy reference command?
**Answer:** No
**Implication:** Use the same shortcut (Ctrl+Shift+C / Cmd+Shift+C) for both single and multi-line operations

## Q2: When copying a single line, should the feature detect if the cursor is on an empty line and handle it differently?
**Answer:** No
**Implication:** Treat empty lines the same as any other line - copy the reference normally

## Q3: Should single line copy work differently when the cursor is at the end of a line versus in the middle?
**Answer:** No
**Implication:** Consistent behavior regardless of cursor position within the line

## Q4: Do users expect single line copy to automatically detect and copy the entire logical statement if it spans multiple lines?
**Answer:** No
**Implication:** Single line copy means exactly one line - users should use selection for multi-line statements

## Q5: Should the single line copy feature work in all file types including non-code files like markdown and JSON?
**Answer:** Yes
**Implication:** Feature should be available for all file types in the editor
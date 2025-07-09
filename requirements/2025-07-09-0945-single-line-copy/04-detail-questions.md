# Detail Questions

These questions clarify expected system behavior now that we understand the codebase structure.

## Q6: When a user has no selection (just cursor) and triggers the command, should we copy just that single line reference even if the line is part of a multi-line statement?
**Default if unknown:** Yes (single cursor = single line reference, following the literal interpretation from discovery Q4)

## Q7: For single line copy in simple format, should we include the actual code content when the clipCodeRef.format is set to "preview"?
**Default if unknown:** Yes (respect the user's format preference for both single and multi-line operations)

## Q8: When copying a single line that has no content (empty line), should we still generate a valid reference like "src/file.ts L15" even though the line is blank?
**Default if unknown:** Yes (line reference is valid regardless of content, consistent with discovery Q2)

## Q9: Should single line copy handle the case where the cursor is on the last line of a file that doesn't end with a newline differently?
**Default if unknown:** No (treat it as any other line, VS Code handles this edge case internally)

## Q10: When implementing single line detection, should we use editor.selection.isEmpty or check if start and end positions are equal?
**Default if unknown:** Yes, use editor.selection.isEmpty (it's the idiomatic VS Code API approach)
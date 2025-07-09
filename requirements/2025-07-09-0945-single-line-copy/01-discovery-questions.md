# Discovery Questions

These questions help understand the problem space and user needs for the single line copy feature.

## Q1: Should single line copy have a different keyboard shortcut than the existing copy reference command?
**Default if unknown:** No (users can learn one shortcut for both single and multi-line operations)

## Q2: When copying a single line, should the feature detect if the cursor is on an empty line and handle it differently?
**Default if unknown:** Yes (empty lines should be handled gracefully, possibly with a warning)

## Q3: Should single line copy work differently when the cursor is at the end of a line versus in the middle?
**Default if unknown:** No (consistent behavior regardless of cursor position on the line)

## Q4: Do users expect single line copy to automatically detect and copy the entire logical statement if it spans multiple lines?
**Default if unknown:** No (single line means literally one line, multi-line statements use selection)

## Q5: Should the single line copy feature work in all file types including non-code files like markdown and JSON?
**Default if unknown:** Yes (users may want to reference any type of content in their projects)
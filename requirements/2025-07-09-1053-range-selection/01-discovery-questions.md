# Discovery Questions

## Q1: Should range selection support the same format options as single-line copy (simple and preview)?
**Default if unknown:** Yes (maintains consistency with existing single-line functionality)

## Q2: Should the preview format for range selection show all selected lines or just the first/last lines?
**Default if unknown:** Show first and last lines only (more readable for AI agents and avoids extremely long clipboard content)

## Q3: Should range selection work across different types of selections (full line selections, partial line selections, mixed selections)?
**Default if unknown:** Yes (support all VS Code selection types for maximum user flexibility)

## Q4: Should there be a maximum line limit for range selections to prevent clipboard overflow?
**Default if unknown:** Yes (limit to 50 lines to prevent performance issues and maintain readability)

## Q5: Should range selection use the same path resolution logic as single-line copy?
**Default if unknown:** Yes (maintain consistency with existing path handling for workspace resolution)
# Technical Detail Questions

## Q1: Should range selection use document.getText(selection) or line-by-line extraction for the preview format?
**Default if unknown:** Use document.getText(selection) for efficiency (VS Code API optimized method for extracting selected text)

## Q2: Should the maxRangeLines configuration be added to package.json configuration schema or hardcoded?
**Default if unknown:** Add to package.json configuration schema as "clipCodeRef.maxRangeLines" (maintains consistency with existing configurable limits like maxLineLength)

## Q3: Should range selection preserve the existing trimWhitespace and maxLineLength settings for individual lines within the range?
**Default if unknown:** No (range selection should show raw selected content without line-by-line processing to maintain selection integrity)

## Q4: Should single-line selections be treated as range selections (L5-L5) or continue using the current single-line format (L5)?
**Default if unknown:** Continue using current single-line format (maintains backward compatibility and follows established patterns)

## Q5: Should the generateRangeReference function be placed in the same file as generateSingleLineReference or in a separate module?
**Default if unknown:** Same file (follows existing architecture pattern and maintains simplicity for a single-file extension)
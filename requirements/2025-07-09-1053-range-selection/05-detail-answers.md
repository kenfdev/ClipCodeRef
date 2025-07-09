# Technical Detail Answers

## Q1: Should range selection use document.getText(selection) or line-by-line extraction for the preview format?
**Answer:** Use document.getText(selection)

## Q2: Should the maxRangeLines configuration be added to package.json configuration schema or hardcoded?
**Answer:** Add to package.json configuration schema as "clipCodeRef.maxRangeLines"

## Q3: Should range selection preserve the existing trimWhitespace and maxLineLength settings for individual lines within the range?
**Answer:** No

## Q4: Should single-line selections be treated as range selections (L5-L5) or continue using the current single-line format (L5)?
**Answer:** Continue using current single-line format

## Q5: Should the generateRangeReference function be placed in the same file as generateSingleLineReference or in a separate module?
**Answer:** Same file
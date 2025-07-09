# Discovery Answers

## Q1: Should range selection support the same format options as single-line copy (simple and preview)?
**Answer:** Yes

## Q2: Should the preview format for range selection show all selected lines or just the first/last lines?
**Answer:** Show all lines in the format:
```
src/utils/helper.js L15-L20:
```
<the multi line code>
```
```

## Q3: Should range selection work across different types of selections (full line selections, partial line selections, mixed selections)?
**Answer:** Yes

## Q4: Should there be a maximum line limit for range selections to prevent clipboard overflow?
**Answer:** Yes (using default limit of 50 lines)

## Q5: Should range selection use the same path resolution logic as single-line copy?
**Answer:** Yes
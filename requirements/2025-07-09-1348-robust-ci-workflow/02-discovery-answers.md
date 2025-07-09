# Discovery Answers

## Q1: Should the CI workflow automatically publish releases to the VS Code marketplace?
**Answer:** No. Creating a tag manually should publish a release via CI.

## Q2: Do you want the CI to run on every push to main or only on pull requests?
**Answer:** Yes (run on both PR and main for comprehensive coverage)

## Q3: Should the CI workflow include security scanning (dependency vulnerabilities, etc.)?
**Answer:** Yes (security scanning is essential for marketplace extensions)

## Q4: Do you want automated version bumping and changelog generation?
**Answer:** Yes (automated versioning reduces manual errors and improves release consistency)

## Q5: Should the CI workflow include performance benchmarks or bundle size monitoring?
**Answer:** No (performance monitoring adds complexity and may not be critical for this extension type)
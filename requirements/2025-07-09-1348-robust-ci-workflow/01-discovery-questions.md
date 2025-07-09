# Discovery Questions

## Q1: Should the CI workflow automatically publish releases to the VS Code marketplace?
**Default if unknown:** No (automated publishing requires careful release management and marketplace tokens)

## Q2: Do you want the CI to run on every push to main or only on pull requests?
**Default if unknown:** Yes (run on both PR and main for comprehensive coverage)

## Q3: Should the CI workflow include security scanning (dependency vulnerabilities, etc.)?
**Default if unknown:** Yes (security scanning is essential for marketplace extensions)

## Q4: Do you want automated version bumping and changelog generation?
**Default if unknown:** Yes (automated versioning reduces manual errors and improves release consistency)

## Q5: Should the CI workflow include performance benchmarks or bundle size monitoring?
**Default if unknown:** No (performance monitoring adds complexity and may not be critical for this extension type)
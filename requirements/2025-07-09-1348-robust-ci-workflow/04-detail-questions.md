# Expert Requirements Questions

## Q1: Should we use HaaLeo/publish-vscode-extension@v2 or create a custom vsce workflow for marketplace publishing?
**Default if unknown:** Yes, use HaaLeo/publish-vscode-extension@v2 (most popular and well-maintained action with good marketplace support)

## Q2: Should the CI workflow run the existing npm scripts (npm run compile, npm run test) or create custom GitHub Actions steps?
**Default if unknown:** Yes, use existing npm scripts (maintains consistency with local development and leverages existing esbuild.js configuration)

## Q3: Should we include multi-platform testing (Ubuntu, Windows, macOS) given the extension's cross-platform nature?
**Default if unknown:** Yes (VS Code extensions should be tested across all supported platforms to ensure compatibility)

## Q4: Should we use semantic-release or a simpler approach for automated version bumping in package.json?
**Default if unknown:** No, use simpler approach (semantic-release adds complexity and the existing manual versioning works well for this project scale)

## Q5: Should CodeQL scanning include the .github/workflows files once they're created for workflow security analysis?
**Default if unknown:** Yes (GitHub now supports CodeQL analysis of Actions workflows to detect security vulnerabilities)
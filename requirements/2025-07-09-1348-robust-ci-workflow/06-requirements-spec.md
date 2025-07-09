# Requirements Specification: Robust CI Workflow for Code Quality and Automated Releases

## Problem Statement

The ClipCodeRef VS Code extension currently lacks automated CI/CD processes, requiring manual quality checks, testing, and marketplace publishing. This creates potential for human error, inconsistent releases, and security vulnerabilities going undetected.

## Solution Overview

Implement a comprehensive GitHub Actions-based CI/CD workflow that automates code quality checks, security scanning, testing, and marketplace publishing while maintaining the current manual tag-based release process.

## Functional Requirements

### FR1: Continuous Integration Pipeline
- **Trigger**: Run on every push to main branch and all pull requests
- **Quality Gates**: Execute existing npm scripts (compile, lint, test) 
- **Platform**: Single platform testing (Ubuntu) only
- **Failure Handling**: Block PR merges and main branch pushes on CI failures

### FR2: Security Scanning
- **Dependency Scanning**: Integrate npm audit to detect vulnerable dependencies
- **Code Analysis**: Use CodeQL v3 for static code analysis of TypeScript code
- **Workflow Security**: Enable CodeQL analysis of GitHub Actions workflow files
- **Vulnerability Reporting**: Generate security reports and alerts in GitHub Security tab

### FR3: Automated Release Process
- **Trigger**: Manual git tag creation triggers automated release
- **Publishing**: Use HaaLeo/publish-vscode-extension@v2 for VS Code Marketplace publishing
- **Versioning**: Simple approach without semantic-release (maintain existing manual versioning)
- **Changelog**: Generate release notes from git commits and tags

### FR4: Quality Assurance
- **Type Checking**: Run TypeScript compiler with `npm run check-types`
- **Linting**: Execute ESLint with `npm run lint`
- **Testing**: Run VS Code test suite with `npm run test`
- **Build Validation**: Verify production build with `npm run package`

## Technical Requirements

### TR1: GitHub Actions Workflow Structure
- **Location**: `.github/workflows/` directory
- **Files**: Separate workflows for CI and release processes
- **Node.js Version**: Use Node.js 20 (latest LTS)
- **Caching**: Implement npm dependency caching for performance

### TR2: Security and Secrets Management
- **Marketplace Token**: Store VS Code Marketplace PAT as `VS_MARKETPLACE_TOKEN` secret
- **Permissions**: Configure minimal required permissions for each job
- **Token Scope**: Azure DevOps PAT with "Marketplace (Manage)" scope

### TR3: Build Integration
- **Existing Scripts**: Leverage current npm scripts without modification
- **esbuild Configuration**: Use existing `esbuild.js` configuration
- **Output Validation**: Ensure `dist/extension.js` is created successfully
- **Package Validation**: Verify extension package integrity

### TR4: CodeQL Configuration
- **Language**: Configure for JavaScript/TypeScript analysis
- **Version**: Use CodeQL Action v3 (v2 is deprecated)
- **Scope**: Analyze both source code and workflow files
- **Caching**: Enable dependency caching for faster scans

## Implementation Hints and Patterns

### Workflow Structure
```yaml
name: CI
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  quality:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm run compile
      - run: npm run test
```

### Security Scanning Integration
```yaml
  security:
    runs-on: ubuntu-latest
    permissions:
      security-events: write
    steps:
      - name: Run npm audit
        run: npm audit --audit-level moderate
      - name: Initialize CodeQL
        uses: github/codeql-action/init@v3
        with:
          languages: javascript
```

### Release Workflow
```yaml
name: Release
on:
  push:
    tags: ['v*']

jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Publish to VS Code Marketplace
        uses: HaaLeo/publish-vscode-extension@v2
        with:
          pat: ${{ secrets.VS_MARKETPLACE_TOKEN }}
```

## File Paths and Modifications

### New Files to Create
- `.github/workflows/ci.yml` - Main CI workflow
- `.github/workflows/release.yml` - Release and publishing workflow

### Existing Files to Consider
- `package.json` - Contains all necessary npm scripts
- `esbuild.js` - Build configuration (no changes needed)
- `eslint.config.mjs` - Linting configuration (no changes needed)
- `tsconfig.json` - TypeScript configuration (no changes needed)

## Acceptance Criteria

### AC1: CI Pipeline
- [ ] CI workflow runs on every push to main and PR creation
- [ ] All existing npm scripts (compile, lint, test) execute successfully
- [ ] CI failure blocks PR merges and main branch pushes
- [ ] Build artifacts are validated (dist/extension.js exists)

### AC2: Security Integration
- [ ] npm audit runs and reports dependency vulnerabilities
- [ ] CodeQL analysis scans TypeScript source code
- [ ] CodeQL analysis includes workflow files
- [ ] Security alerts appear in GitHub Security tab

### AC3: Release Automation
- [ ] Manual git tag creation triggers release workflow
- [ ] Extension publishes to VS Code Marketplace automatically
- [ ] Release notes are generated from git history
- [ ] Marketplace token is securely stored and used

### AC4: Quality Assurance
- [ ] TypeScript type checking passes
- [ ] ESLint rules are enforced
- [ ] Test suite executes successfully
- [ ] Production build completes without errors

### AC5: Performance and Reliability
- [ ] Workflows complete within reasonable time (< 5 minutes)
- [ ] npm dependencies are cached for faster builds
- [ ] Workflows are resilient to transient failures
- [ ] Clear error messages for debugging failures

## Assumptions

1. **Repository Access**: GitHub repository has Actions enabled
2. **Marketplace Account**: VS Code Marketplace publisher account exists
3. **Token Generation**: Azure DevOps PAT can be generated with appropriate scopes
4. **Existing Scripts**: Current npm scripts work correctly in CI environment
5. **Node.js Compatibility**: Extension works with Node.js 20 LTS
6. **Single Platform**: Ubuntu-only testing is sufficient for this extension type
7. **Manual Versioning**: Current manual version management in package.json continues
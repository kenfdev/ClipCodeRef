---
id: task-14
title: Create GitHub Actions release workflow
status: Done
assignee:
  - '@claude'
created_date: '2025-07-09'
updated_date: '2025-07-09'
labels: []
dependencies: []
---

## Description

Implement automated release process triggered by git tags that publishes to both VS Code Marketplace and Open VSX Registry

## Acceptance Criteria

- [x] Manual git tag creation triggers release
- [x] Extension publishes to VS Code Marketplace
- [x] Extension publishes to Open VSX Registry
- [x] Release notes generated from git history
- [x] Marketplace tokens securely stored and used
- [x] VSIX package created and attached to GitHub release
- [x] Build and test validation before publishing
## Implementation Plan

1. Research VS Code extension publishing process and vsce tool\n2. Analyze current package.json for publishing requirements\n3. Create GitHub Actions release workflow with:\n   - Trigger on git tag creation\n   - Build and package extension\n   - Generate release notes from git history\n   - Publish to VS Code Marketplace using vsce\n   - Create GitHub release\n4. Document marketplace token setup requirements\n5. Test workflow configuration

## Implementation Notes

**Approach taken:**\n- Created comprehensive GitHub Actions release workflow (.github/workflows/release.yml)\n- Added @vscode/vsce and ovsx as dev dependencies for dual marketplace publishing\n- Implemented automated release process with git tag triggers\n- Created detailed marketplace setup documentation for both platforms\n\n**Features implemented:**\n- Release workflow triggered by git tags (v*)\n- Build validation with tests before publishing\n- Automated .vsix package creation\n- VS Code Marketplace publishing using vsce\n- Open VSX Registry publishing using ovsx\n- GitHub release creation with generated release notes\n- Secure token handling via GitHub secrets\n\n**Technical decisions and trade-offs:**\n- Used git tag-based releases for semantic versioning\n- Included xvfb-run for headless VS Code testing in CI\n- Used softprops/action-gh-release for modern GitHub release creation\n- Generated release notes from git commit history\n- Required VSCE_TOKEN and OPEN_VSX_TOKEN secrets for dual marketplace authentication\n- Published to both marketplaces for maximum accessibility\n\n**Modified or added files:**\n- Added .github/workflows/release.yml - Release workflow configuration\n- Updated MARKETPLACE_SETUP.md - Token setup documentation for both platforms\n- Updated package.json - Added @vscode/vsce and ovsx dependencies plus publish scripts\n- Generated clipcoderef-1.0.2.vsix - Test package creation\n\n**Key workflow features:**\n- Tag-triggered releases (push tags matching v*)\n- Complete build validation before publishing\n- Automated dual marketplace publishing (VS Code Marketplace + Open VSX Registry)\n- GitHub release with downloadable .vsix file\n- Generated release notes from git history\n- Secure token management via GitHub secrets for both platforms

import * as assert from 'assert';
import * as vscode from 'vscode';

suite('Extension Test Suite', () => {
	vscode.window.showInformationMessage('Start all tests.');

	test('Single line copy detection - cursor on line without selection', async () => {
		// Create a test document
		const content = `line 1
line 2
line 3
line 4
line 5`;
		const doc = await vscode.workspace.openTextDocument({
			content,
			language: 'typescript'
		});
		const editor = await vscode.window.showTextDocument(doc);

		// Place cursor on line 3 (index 2) without selection
		const position = new vscode.Position(2, 0);
		editor.selection = new vscode.Selection(position, position);

		// Verify selection is empty
		assert.strictEqual(editor.selection.isEmpty, true);
		
		// Verify cursor line is correctly captured
		assert.strictEqual(editor.selection.active.line, 2);
		
		// Execute the command
		await vscode.commands.executeCommand('clipcoderef.copyReference');
		
		// Get clipboard content
		const clipboardText = await vscode.env.clipboard.readText();
		
		// Verify the format matches: path L<line>
		// Line number should be 1-based (line 3 in editor)
		const expectedLineNumber = 3;
		assert.ok(clipboardText.includes(`L${expectedLineNumber}`), 
			`Expected clipboard to contain L${expectedLineNumber}, but got: ${clipboardText}`);
	});

	test('Single line reference format - correct line number conversion', async () => {
		const content = `first line
second line
third line`;
		const doc = await vscode.workspace.openTextDocument({
			content,
			language: 'typescript'
		});
		const editor = await vscode.window.showTextDocument(doc);

		// Test line 1 (index 0)
		editor.selection = new vscode.Selection(
			new vscode.Position(0, 0),
			new vscode.Position(0, 0)
		);
		await vscode.commands.executeCommand('clipcoderef.copyReference');
		let clipboardText = await vscode.env.clipboard.readText();
		assert.ok(clipboardText.includes('L1'), 'Line 1 should be referenced as L1');

		// Test line 3 (index 2)
		editor.selection = new vscode.Selection(
			new vscode.Position(2, 5),
			new vscode.Position(2, 5)
		);
		await vscode.commands.executeCommand('clipcoderef.copyReference');
		clipboardText = await vscode.env.clipboard.readText();
		assert.ok(clipboardText.includes('L3'), 'Line 3 should be referenced as L3');
	});

	test('Simple format - default configuration', async () => {
		// Reset configuration to default
		const config = vscode.workspace.getConfiguration('clipCodeRef');
		await config.update('format', 'simple', vscode.ConfigurationTarget.Global);

		const content = `const example = true;
let variable = 42;
console.log('test');`;
		const doc = await vscode.workspace.openTextDocument({
			content,
			language: 'typescript'
		});
		const editor = await vscode.window.showTextDocument(doc);

		// Place cursor on line 2
		editor.selection = new vscode.Selection(
			new vscode.Position(1, 0),
			new vscode.Position(1, 0)
		);

		await vscode.commands.executeCommand('clipcoderef.copyReference');
		const clipboardText = await vscode.env.clipboard.readText();

		// Should match: path L2 (no content preview)
		assert.ok(clipboardText.includes('L2'), 'Should contain line number L2');
		assert.ok(!clipboardText.includes('let variable = 42;'), 'Should NOT contain code content in simple format');
		assert.ok(!clipboardText.includes(':'), 'Should NOT contain colon separator in simple format');
	});

	test('Preview format - with code content', async () => {
		const config = vscode.workspace.getConfiguration('clipCodeRef');
		await config.update('format', 'preview', vscode.ConfigurationTarget.Global);

		const content = `const example = true;
let variable = 42;
console.log('test');`;
		const doc = await vscode.workspace.openTextDocument({
			content,
			language: 'typescript'
		});
		const editor = await vscode.window.showTextDocument(doc);

		// Place cursor on line 2
		editor.selection = new vscode.Selection(
			new vscode.Position(1, 0),
			new vscode.Position(1, 0)
		);

		await vscode.commands.executeCommand('clipcoderef.copyReference');
		const clipboardText = await vscode.env.clipboard.readText();

		// Should match: path L2: let variable = 42;
		assert.ok(clipboardText.includes('L2:'), 'Should contain line number with colon separator');
		assert.ok(clipboardText.includes('let variable = 42;'), 'Should contain code content in preview format');
	});

	test('Preview format - trimWhitespace setting enabled', async () => {
		const config = vscode.workspace.getConfiguration('clipCodeRef');
		await config.update('format', 'preview', vscode.ConfigurationTarget.Global);
		await config.update('trimWhitespace', true, vscode.ConfigurationTarget.Global);

		const content = `const example = true;
    let variable = 42;    
console.log('test');`;
		const doc = await vscode.workspace.openTextDocument({
			content,
			language: 'typescript'
		});
		const editor = await vscode.window.showTextDocument(doc);

		// Place cursor on line 2 (has leading and trailing whitespace)
		editor.selection = new vscode.Selection(
			new vscode.Position(1, 0),
			new vscode.Position(1, 0)
		);

		await vscode.commands.executeCommand('clipcoderef.copyReference');
		const clipboardText = await vscode.env.clipboard.readText();

		// Should contain trimmed content
		assert.ok(clipboardText.includes('let variable = 42;'), 'Should contain trimmed code content');
		assert.ok(!clipboardText.includes('    let variable = 42;    '), 'Should NOT contain leading/trailing whitespace');
	});

	test('Preview format - trimWhitespace setting disabled', async () => {
		const config = vscode.workspace.getConfiguration('clipCodeRef');
		await config.update('format', 'preview', vscode.ConfigurationTarget.Global);
		await config.update('trimWhitespace', false, vscode.ConfigurationTarget.Global);

		const content = `const example = true;
    let variable = 42;    
console.log('test');`;
		const doc = await vscode.workspace.openTextDocument({
			content,
			language: 'typescript'
		});
		const editor = await vscode.window.showTextDocument(doc);

		// Place cursor on line 2 (has leading and trailing whitespace)
		editor.selection = new vscode.Selection(
			new vscode.Position(1, 0),
			new vscode.Position(1, 0)
		);

		await vscode.commands.executeCommand('clipcoderef.copyReference');
		const clipboardText = await vscode.env.clipboard.readText();

		// Should contain original whitespace
		assert.ok(clipboardText.includes('    let variable = 42;    '), 'Should contain original whitespace when trimWhitespace is false');
	});

	test('Preview format - maxLineLength truncation with ellipsis', async () => {
		const config = vscode.workspace.getConfiguration('clipCodeRef');
		await config.update('format', 'preview', vscode.ConfigurationTarget.Global);
		await config.update('maxLineLength', 20, vscode.ConfigurationTarget.Global);
		await config.update('trimWhitespace', true, vscode.ConfigurationTarget.Global);

		const content = `const example = true;
const veryLongVariableNameThatExceedsTwentyCharacters = 'this is a very long line that should be truncated';
console.log('test');`;
		const doc = await vscode.workspace.openTextDocument({
			content,
			language: 'typescript'
		});
		const editor = await vscode.window.showTextDocument(doc);

		// Place cursor on line 2 (long line)
		editor.selection = new vscode.Selection(
			new vscode.Position(1, 0),
			new vscode.Position(1, 0)
		);

		await vscode.commands.executeCommand('clipcoderef.copyReference');
		const clipboardText = await vscode.env.clipboard.readText();

		// Should be truncated with ellipsis
		assert.ok(clipboardText.includes('...'), 'Should contain ellipsis for truncated long line');
		
		// Extract the content part after the colon
		const contentPart = clipboardText.split(': ')[1];
		assert.ok(contentPart.length <= 23, 'Content should be truncated to maxLineLength + 3 (for ellipsis)'); // 20 + 3 = 23
	});

	test('Preview format - line within maxLineLength limit', async () => {
		const config = vscode.workspace.getConfiguration('clipCodeRef');
		await config.update('format', 'preview', vscode.ConfigurationTarget.Global);
		await config.update('maxLineLength', 80, vscode.ConfigurationTarget.Global);
		await config.update('trimWhitespace', true, vscode.ConfigurationTarget.Global);

		const content = `const example = true;
let short = 42;
console.log('test');`;
		const doc = await vscode.workspace.openTextDocument({
			content,
			language: 'typescript'
		});
		const editor = await vscode.window.showTextDocument(doc);

		// Place cursor on line 2 (short line)
		editor.selection = new vscode.Selection(
			new vscode.Position(1, 0),
			new vscode.Position(1, 0)
		);

		await vscode.commands.executeCommand('clipcoderef.copyReference');
		const clipboardText = await vscode.env.clipboard.readText();

		// Should NOT be truncated
		assert.ok(!clipboardText.includes('...'), 'Should NOT contain ellipsis for short line');
		assert.ok(clipboardText.includes('let short = 42;'), 'Should contain complete short line');
	});

	test('Preview format - empty line handling', async () => {
		const config = vscode.workspace.getConfiguration('clipCodeRef');
		await config.update('format', 'preview', vscode.ConfigurationTarget.Global);
		await config.update('trimWhitespace', true, vscode.ConfigurationTarget.Global);

		const content = `const example = true;

console.log('test');`;
		const doc = await vscode.workspace.openTextDocument({
			content,
			language: 'typescript'
		});
		const editor = await vscode.window.showTextDocument(doc);

		// Place cursor on line 2 (empty line)
		editor.selection = new vscode.Selection(
			new vscode.Position(1, 0),
			new vscode.Position(1, 0)
		);

		await vscode.commands.executeCommand('clipcoderef.copyReference');
		const clipboardText = await vscode.env.clipboard.readText();

		// Should handle empty line gracefully
		assert.ok(clipboardText.includes('L2:'), 'Should contain line number with colon');
		assert.ok(clipboardText.endsWith('L2: ') || clipboardText.endsWith('L2:'), 'Should have empty or minimal content for empty line');
	});

	test('Preview format - whitespace-only line handling', async () => {
		const config = vscode.workspace.getConfiguration('clipCodeRef');
		await config.update('format', 'preview', vscode.ConfigurationTarget.Global);
		await config.update('trimWhitespace', true, vscode.ConfigurationTarget.Global);

		const content = `const example = true;
    
console.log('test');`;
		const doc = await vscode.workspace.openTextDocument({
			content,
			language: 'typescript'
		});
		const editor = await vscode.window.showTextDocument(doc);

		// Place cursor on line 2 (whitespace-only line)
		editor.selection = new vscode.Selection(
			new vscode.Position(1, 0),
			new vscode.Position(1, 0)
		);

		await vscode.commands.executeCommand('clipcoderef.copyReference');
		const clipboardText = await vscode.env.clipboard.readText();

		// Should trim whitespace-only line to empty
		assert.ok(clipboardText.includes('L2:'), 'Should contain line number with colon');
		assert.ok(clipboardText.endsWith('L2: ') || clipboardText.endsWith('L2:'), 'Should have empty content for whitespace-only line when trimmed');
	});

	test('Path resolution - single workspace relative path', async () => {
		// Test that files in a single workspace show relative paths
		const content = `console.log('test');`;
		const doc = await vscode.workspace.openTextDocument({
			content,
			language: 'typescript'
		});
		const editor = await vscode.window.showTextDocument(doc);

		// Place cursor on line 1
		editor.selection = new vscode.Selection(
			new vscode.Position(0, 0),
			new vscode.Position(0, 0)
		);

		await vscode.commands.executeCommand('clipcoderef.copyReference');
		const clipboardText = await vscode.env.clipboard.readText();

		// Should not start with absolute path indicators like / or C:
		assert.ok(!clipboardText.startsWith('/'), 'Should not start with absolute path');
		assert.ok(!clipboardText.match(/^[A-Z]:/), 'Should not start with Windows drive letter');
		assert.ok(clipboardText.includes('L1'), 'Should contain line number');
	});

	test('Path resolution - multi-root workspace auto behavior', async () => {
		// Reset to auto behavior for multi-root workspaces
		const config = vscode.workspace.getConfiguration('clipCodeRef');
		await config.update('multiRootBehavior', 'auto', vscode.ConfigurationTarget.Global);

		const content = `console.log('test');`;
		const doc = await vscode.workspace.openTextDocument({
			content,
			language: 'typescript'
		});
		const editor = await vscode.window.showTextDocument(doc);

		editor.selection = new vscode.Selection(
			new vscode.Position(0, 0),
			new vscode.Position(0, 0)
		);

		await vscode.commands.executeCommand('clipcoderef.copyReference');
		const clipboardText = await vscode.env.clipboard.readText();

		// In single workspace or when no ambiguity, should not include workspace prefix
		assert.ok(!clipboardText.includes('['), 'Should not include workspace prefix when not ambiguous');
		assert.ok(clipboardText.includes('L1'), 'Should contain line number');
	});

	test('Path resolution - multi-root workspace always behavior', async () => {
		// Set to always include workspace name
		const config = vscode.workspace.getConfiguration('clipCodeRef');
		await config.update('multiRootBehavior', 'always', vscode.ConfigurationTarget.Global);

		const content = `console.log('test');`;
		const doc = await vscode.workspace.openTextDocument({
			content,
			language: 'typescript'
		});
		const editor = await vscode.window.showTextDocument(doc);

		editor.selection = new vscode.Selection(
			new vscode.Position(0, 0),
			new vscode.Position(0, 0)
		);

		await vscode.commands.executeCommand('clipcoderef.copyReference');
		const clipboardText = await vscode.env.clipboard.readText();

		// When workspace folder exists and multiRootBehavior is 'always', 
		// should include workspace prefix
		if (vscode.workspace.workspaceFolders && vscode.workspace.workspaceFolders.length > 0) {
			// Format should be [workspace-name]/path L1
			const workspaceName = vscode.workspace.workspaceFolders[0].name;
			assert.ok(clipboardText.includes(`[${workspaceName}]/`), 
				`Should include workspace prefix [${workspaceName}]/ in always mode, but got: ${clipboardText}`);
		}
		assert.ok(clipboardText.includes('L1'), 'Should contain line number');
	});

	test('Path resolution - multi-root workspace never behavior', async () => {
		// Set to never include workspace name
		const config = vscode.workspace.getConfiguration('clipCodeRef');
		await config.update('multiRootBehavior', 'never', vscode.ConfigurationTarget.Global);

		const content = `console.log('test');`;
		const doc = await vscode.workspace.openTextDocument({
			content,
			language: 'typescript'
		});
		const editor = await vscode.window.showTextDocument(doc);

		editor.selection = new vscode.Selection(
			new vscode.Position(0, 0),
			new vscode.Position(0, 0)
		);

		await vscode.commands.executeCommand('clipcoderef.copyReference');
		const clipboardText = await vscode.env.clipboard.readText();

		// Should never include workspace prefix
		assert.ok(!clipboardText.includes('['), 'Should never include workspace prefix in never mode');
		assert.ok(clipboardText.includes('L1'), 'Should contain line number');
	});

	test('Path resolution - consistent with current implementation', async () => {
		// Test that current asRelativePath behavior is preserved
		const content = `console.log('test');`;
		const doc = await vscode.workspace.openTextDocument({
			content,
			language: 'typescript'
		});
		const editor = await vscode.window.showTextDocument(doc);

		editor.selection = new vscode.Selection(
			new vscode.Position(0, 0),
			new vscode.Position(0, 0)
		);

		await vscode.commands.executeCommand('clipcoderef.copyReference');
		const clipboardText = await vscode.env.clipboard.readText();

		// Should use the same path that asRelativePath would return
		const expectedPath = vscode.workspace.asRelativePath(doc.uri, false);
		assert.ok(clipboardText.includes(expectedPath), `Should contain expected path: ${expectedPath}`);
		assert.ok(clipboardText.includes('L1'), 'Should contain line number');
	});
});

// Test suite specifically for path resolution logic
suite('Path Resolution Logic Tests', () => {
	test('Path resolution uses vscode.workspace.asRelativePath correctly', async () => {
		const content = `console.log('test');`;
		const doc = await vscode.workspace.openTextDocument({
			content,
			language: 'typescript'
		});
		const editor = await vscode.window.showTextDocument(doc);

		editor.selection = new vscode.Selection(
			new vscode.Position(0, 0),
			new vscode.Position(0, 0)
		);

		await vscode.commands.executeCommand('clipcoderef.copyReference');
		const clipboardText = await vscode.env.clipboard.readText();

		// Verify that asRelativePath is being used
		const expectedPath = vscode.workspace.asRelativePath(doc.uri, false);
		assert.ok(clipboardText.includes(expectedPath), `Should use asRelativePath result: ${expectedPath}`);
	});

	test('Multi-root workspace behavior respects multiRootBehavior setting', async () => {
		// This test validates that the setting is being read and respected
		const config = vscode.workspace.getConfiguration('clipCodeRef');
		const currentBehavior = config.get<string>('multiRootBehavior', 'auto');
		
		// Test with different behaviors
		const behaviors = ['auto', 'always', 'never'];
		
		for (const behavior of behaviors) {
			await config.update('multiRootBehavior', behavior, vscode.ConfigurationTarget.Global);
			
			const content = `console.log('test for ${behavior}');`;
			const doc = await vscode.workspace.openTextDocument({
				content,
				language: 'typescript'
			});
			const editor = await vscode.window.showTextDocument(doc);

			editor.selection = new vscode.Selection(
				new vscode.Position(0, 0),
				new vscode.Position(0, 0)
			);

			await vscode.commands.executeCommand('clipcoderef.copyReference');
			const clipboardText = await vscode.env.clipboard.readText();

			// Verify behavior is applied (specific logic depends on implementation)
			assert.ok(clipboardText.includes('L1'), `Should contain line number for behavior: ${behavior}`);
			
			// Behavior-specific assertions
			if (behavior === 'never') {
				assert.ok(!clipboardText.includes('['), `Should not include workspace prefix for behavior: ${behavior}`);
			}
		}
		
		// Restore original behavior
		await config.update('multiRootBehavior', currentBehavior, vscode.ConfigurationTarget.Global);
	});

	test('Single workspace shows workspace-relative paths', async () => {
		// Test that single workspace scenario works correctly
		const content = `console.log('single workspace test');`;
		const doc = await vscode.workspace.openTextDocument({
			content,
			language: 'typescript'
		});
		const editor = await vscode.window.showTextDocument(doc);

		editor.selection = new vscode.Selection(
			new vscode.Position(0, 0),
			new vscode.Position(0, 0)
		);

		await vscode.commands.executeCommand('clipcoderef.copyReference');
		const clipboardText = await vscode.env.clipboard.readText();

		// Should show relative path (not absolute)
		assert.ok(!clipboardText.startsWith('/'), 'Should not start with absolute path');
		assert.ok(!clipboardText.match(/^[A-Z]:/), 'Should not start with Windows drive letter');
		assert.ok(clipboardText.includes('L1'), 'Should contain line number');
	});

	test('No workspace scenarios use absolute paths', async () => {
		// This test is tricky as we need to simulate no workspace scenario
		// For now, we'll test the current behavior and ensure it handles the case
		const content = `console.log('no workspace test');`;
		const doc = await vscode.workspace.openTextDocument({
			content,
			language: 'typescript'
		});
		const editor = await vscode.window.showTextDocument(doc);

		editor.selection = new vscode.Selection(
			new vscode.Position(0, 0),
			new vscode.Position(0, 0)
		);

		await vscode.commands.executeCommand('clipcoderef.copyReference');
		const clipboardText = await vscode.env.clipboard.readText();

		// Should still produce valid output
		assert.ok(clipboardText.includes('L1'), 'Should contain line number');
		assert.ok(clipboardText.trim().length > 0, 'Should produce non-empty output');
	});

	test('Path format is consistent with multi-line selection', async () => {
		// This test ensures that single-line and multi-line selections use the same path format
		// Currently multi-line is not implemented, but when it is, paths should be consistent
		const content = `console.log('line 1');
console.log('line 2');
console.log('line 3');`;
		const doc = await vscode.workspace.openTextDocument({
			content,
			language: 'typescript'
		});
		const editor = await vscode.window.showTextDocument(doc);

		// Test single line
		editor.selection = new vscode.Selection(
			new vscode.Position(0, 0),
			new vscode.Position(0, 0)
		);

		await vscode.commands.executeCommand('clipcoderef.copyReference');
		const singleLineClipboard = await vscode.env.clipboard.readText();

		// Extract path from single line format
		const singleLinePath = singleLineClipboard.split(' L')[0];
		
		// Test multi-line selection (when it's implemented)
		editor.selection = new vscode.Selection(
			new vscode.Position(0, 0),
			new vscode.Position(2, 20)
		);

		await vscode.commands.executeCommand('clipcoderef.copyReference');
		const multiLineClipboard = await vscode.env.clipboard.readText();

		// For now, multi-line returns placeholder text, but when implemented
		// it should use the same path format
		if (!multiLineClipboard.includes('not yet implemented')) {
			const multiLinePath = multiLineClipboard.split(' L')[0];
			assert.strictEqual(singleLinePath, multiLinePath, 'Path format should be consistent between single and multi-line');
		}
		
		// Verify single line works correctly
		assert.ok(singleLineClipboard.includes('L1'), 'Should contain line number for single line');
	});
});

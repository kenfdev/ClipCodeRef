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
});

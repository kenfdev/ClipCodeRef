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
});

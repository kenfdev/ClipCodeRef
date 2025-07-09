import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
  console.log('ClipCodeRef is now active!');

  let disposable = vscode.commands.registerCommand(
    'clipcoderef.copyReference',
    async () => {
      const editor = vscode.window.activeTextEditor;

      if (!editor) {
        vscode.window.showErrorMessage('No active editor');
        return;
      }

      // Check for multiple cursors
      if (editor.selections.length > 1) {
        vscode.window.showErrorMessage(
          'Multiple cursors not supported. Please use single cursor or selection.'
        );
        return;
      }

      try {
        const selection = editor.selection;
        const document = editor.document;
        
        let reference: string;
        
        // Check if selection is empty (single line scenario)
        if (selection.isEmpty) {
          // Get cursor line (0-based) and convert to 1-based
          const lineNumber = selection.active.line + 1;
          
          // Get file path
          const filePath = vscode.workspace.asRelativePath(document.uri, false);
          
          // Generate single line reference format: path L<line>
          reference = `${filePath} L${lineNumber}`;
        } else {
          // TODO: Handle multi-line selection
          reference = 'Multi-line selection not yet implemented';
        }

        await vscode.env.clipboard.writeText(reference);
        vscode.window.showInformationMessage('✓ Code reference copied');
      } catch (error) {
        vscode.window.showErrorMessage('✗ Failed to copy reference');
      }
    }
  );

  context.subscriptions.push(disposable);
}

export function deactivate() {}

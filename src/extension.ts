import * as vscode from 'vscode';

function generateSingleLineReference(document: vscode.TextDocument, selection: vscode.Selection): string {
  // Get cursor line (0-based) and convert to 1-based
  const lineNumber = selection.active.line + 1;
  
  // Get file path
  const filePath = vscode.workspace.asRelativePath(document.uri, false);
  
  // Read configuration
  const config = vscode.workspace.getConfiguration('clipCodeRef');
  const format = config.get<string>('format', 'simple');
  
  if (format === 'simple') {
    // Simple format: path L<line>
    return `${filePath} L${lineNumber}`;
  } else {
    // Preview format: path L<line>: <content>
    const line = document.lineAt(selection.active.line);
    let content = line.text;
    
    // Apply trimWhitespace setting
    const trimWhitespace = config.get<boolean>('trimWhitespace', true);
    if (trimWhitespace) {
      content = content.trim();
    }
    
    // Apply maxLineLength setting
    const maxLineLength = config.get<number>('maxLineLength', 80);
    if (content.length > maxLineLength) {
      content = content.substring(0, maxLineLength) + '...';
    }
    
    return `${filePath} L${lineNumber}: ${content}`;
  }
}

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
          reference = generateSingleLineReference(document, selection);
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

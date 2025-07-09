import * as vscode from 'vscode';

function resolveFilePath(document: vscode.TextDocument): string {
  const config = vscode.workspace.getConfiguration('clipCodeRef');
  const multiRootBehavior = config.get<string>('multiRootBehavior', 'auto');
  
  // If no workspace folders, return absolute path
  if (!vscode.workspace.workspaceFolders || vscode.workspace.workspaceFolders.length === 0) {
    return document.uri.fsPath;
  }
  
  // Get the workspace folder containing this file
  const workspaceFolder = vscode.workspace.getWorkspaceFolder(document.uri);
  
  // If file is not in any workspace folder, return absolute path
  if (!workspaceFolder) {
    return document.uri.fsPath;
  }
  
  // Get relative path from workspace
  const relativePath = vscode.workspace.asRelativePath(document.uri, false);
  
  // Handle single workspace folder
  if (vscode.workspace.workspaceFolders.length === 1) {
    return relativePath;
  }
  
  // Handle multi-root workspace based on multiRootBehavior setting
  switch (multiRootBehavior) {
    case 'always':
      // Always include workspace name prefix
      return `[${workspaceFolder.name}]/${relativePath}`;
    
    case 'never':
      // Never include workspace name prefix
      return relativePath;
    
    case 'auto':
    default:
      // Include workspace name only if path would be ambiguous
      const pathWithoutWorkspace = vscode.workspace.asRelativePath(document.uri, true);
      
      // Check if this relative path exists in other workspace folders
      const isAmbiguous = vscode.workspace.workspaceFolders.some(folder => {
        if (folder.uri.toString() === workspaceFolder.uri.toString()) {
          return false; // Skip the current workspace folder
        }
        
        // We can't easily check file existence here, so we use a heuristic:
        // if the relative path is the same as the one without workspace prefix,
        // it's likely in the root of the workspace and might be ambiguous
        return pathWithoutWorkspace === relativePath;
      });
      
      if (isAmbiguous) {
        return `[${workspaceFolder.name}]/${relativePath}`;
      } else {
        return relativePath;
      }
  }
}

function generateSingleLineReference(document: vscode.TextDocument, selection: vscode.Selection): string {
  // Get cursor line (0-based) and convert to 1-based
  const lineNumber = selection.active.line + 1;
  
  // Get file path using proper resolution logic
  const filePath = resolveFilePath(document);
  
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

function generateRangeReference(document: vscode.TextDocument, selection: vscode.Selection): string {
  // Get start and end lines (0-based) and convert to 1-based
  const startLine = selection.start.line + 1;
  const endLine = selection.end.line + 1;
  
  // Get file path using proper resolution logic
  const filePath = resolveFilePath(document);
  
  // Read configuration
  const config = vscode.workspace.getConfiguration('clipCodeRef');
  const format = config.get<string>('format', 'simple');
  const maxRangeLines = config.get<number>('maxRangeLines', 50);
  
  // Calculate number of lines in selection
  const lineCount = endLine - startLine + 1;
  
  // Check if selection exceeds maxRangeLines
  const exceedsLimit = lineCount > maxRangeLines;
  
  if (format === 'simple' || exceedsLimit) {
    // Simple format or fallback: path L<start>-L<end>
    if (exceedsLimit) {
      // Show warning when falling back to simple format
      vscode.window.showWarningMessage(
        `Selection spans ${lineCount} lines, exceeding limit of ${maxRangeLines}. Using simple format.`
      );
    }
    return `${filePath} L${startLine}-L${endLine}`;
  } else {
    // Preview format: path L<start>-L<end>: \n\n```\n<content>\n```
    const selectedText = document.getText(selection);
    
    // Apply trimWhitespace setting
    const trimWhitespace = config.get<boolean>('trimWhitespace', true);
    let content = selectedText;
    if (trimWhitespace) {
      content = content.trim();
    }
    
    return `${filePath} L${startLine}-L${endLine}: \n\n\`\`\`\n${content}\n\`\`\``;
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
          // Check if selection spans multiple lines
          const startLine = selection.start.line;
          const endLine = selection.end.line;
          
          if (startLine === endLine) {
            // Single line selection, use existing single line logic
            reference = generateSingleLineReference(document, selection);
          } else {
            // Multi-line selection, use range selection logic
            reference = generateRangeReference(document, selection);
          }
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

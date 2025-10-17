const fs = require('fs');
const vscode = require('vscode');

function getWebviewContent(context) {
    const htmlPath = vscode.Uri.joinPath(context.extensionUri, 'assets', 'webviewer.html');
    const htmlFile = htmlPath.fsPath;

    const isDark = vscode.window.activeColorTheme.kind === vscode.ColorThemeKind.Dark;
    const theme = isDark ? 'github-dark' : 'github';

    const assetsPath = vscode.Uri.joinPath(context.extensionUri, 'assets');
    const htmlContent = fs.readFileSync(htmlFile, 'utf8');
    
    const replacements = {
        '{{theme}}': theme,
        '{{assets}}': assetsPath
    };

    return Object.entries(replacements).reduce((content, [search, replace]) => 
        content.replaceAll(search, replace), htmlContent);
}

module.exports = {
    getWebviewContent
};

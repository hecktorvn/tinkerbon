const cp = require('child_process');
const path = require('path');
const vscode = require('vscode');

const outputChannel = vscode.window.createOutputChannel('Laravel Tinker');

function runTinkerCode(context, code) {
    return new Promise((resolve) => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) return;

        const workspacePath = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
        if (!workspacePath) return Promise.resolve('❌ Nenhum workspace aberto');

        let output = '';
        let error = '';

        if(!code) {
            code = editor.selection.isEmpty ? editor.document.getText() : editor.document.getText(editor.selection);
        }

        const phpScript = path.join(context.extensionPath, 'php-wrapper', 'run_psysh.php');

        const cleanedCode = code.trim().replace(/^<\?php\s*/, '');
        const phpProcess = cp.spawn('php', [phpScript, workspacePath], { shell: true });

        outputChannel.appendLine('php ' + phpScript + ' ' + workspacePath + " <<'PHP'\n" + cleanedCode + '\nPHP');
        outputChannel.appendLine('> ' + cleanedCode);

        phpProcess.stdout.on('data', data => output += data.toString());
        phpProcess.stderr.on('data', data => error += data.toString());

        phpProcess.on('close', () => {
            if(error) outputChannel.show(true);
            outputChannel.appendLine('✅ Terminou a execução do Tinker.');
            outputChannel.appendLine(error.trim());
            
            output = output.split('tinkerbon::').pop() || '';
            resolve(output.trim());
        });
        
        phpProcess.stdin.write(cleanedCode + '\n');
        phpProcess.stdin.end();
    });
}

module.exports = { runTinkerCode };

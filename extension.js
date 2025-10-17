
const vscode = require('vscode');
const { getWebviewContent } = require('./scripts/webviewer');
const { runTinkerCode } = require('./scripts/tinkerExecutor');

function activate(context) {
	let activeEditor = null;

	const disposableCommand = vscode.commands.registerCommand('tinkerbon.newFile', async () => {
		const document = await vscode.workspace.openTextDocument({ language: 'php', content: '<?php\n\n$result = 5+56;\n\n' });
		activeEditor = await vscode.window.showTextDocument(document, { preview: false });
		openPreview(document);
	});

	context.subscriptions.push(disposableCommand);

	const disposableRun = vscode.commands.registerCommand('tinkerbon.runCode', async () => {
		runTinkerCode(activeEditor, context);
	});

	context.subscriptions.push(disposableRun);

	function openPreview() {
		const panel = vscode.window.createWebviewPanel(
			'tinkerbonPreview',
			'Tinker Preview',
			vscode.ViewColumn.Beside,
			{ enableScripts: true }
		);

		panel.webview.html = getWebviewContent(context);

		panel.webview.onDidReceiveMessage(async (message) => {
			if (message.command === 'run') {
				if (!activeEditor) {
					panel.webview.postMessage({ command: 'error', output: '❌ Nenhum editor ativo para executar o Tinker.' });
					return;
				}

				await runTinkerCode(activeEditor, context).then(output => {
					panel.webview.postMessage({ command: 'output', output });
				}).catch(error => {
					console.log({error});
					panel.webview.postMessage({ command: 'error', output: error });
				});
			}
		});
	}
}

function deactivate() { }

module.exports = {
	activate,
	deactivate
};

const vscode = require('vscode');
const { runTinkerCode } = require('./tinkerExecutor');

function activate(context) {

	// Registrar comando para criar novo arquivo Tinker
	const disposableCommand = vscode.commands.registerCommand('tinkerbon.newFile', async () => {
		const uri = vscode.Uri.parse('untitled:' + 'new.tinker.php');
		const document = await vscode.workspace.openTextDocument(uri);

		const editor = await vscode.window.showTextDocument(document, { preview: false });
		await editor.edit(editBuilder => {
			editBuilder.insert(new vscode.Position(0, 0), '<?php\n\n$result = 5+56;\n\n');
		});

		// Abrir preview ao lado
		openPreview(document);
	});

	context.subscriptions.push(disposableCommand);

	// Registrar comando para rodar Tinker no editor ativo
	const disposableRun = vscode.commands.registerCommand('tinkerbon.runCode', async () => {
		runTinkerCode(context);
	});

	context.subscriptions.push(disposableRun);

	// Função para abrir preview ao lado
	function openPreview() {
		const panel = vscode.window.createWebviewPanel(
			'tinkerPreview',
			'Tinker Preview',
			vscode.ViewColumn.Beside,
			{ enableScripts: true }
		);

		// Botão para rodar Tinker
		panel.webview.html = getWebviewContent();

		// Recebe mensagens do botão
		panel.webview.onDidReceiveMessage(async (message) => {
			if (message.command === 'run') {
				const output = await runTinkerCode(context);
				panel.webview.postMessage({ command: 'output', output });
			}
		});
	}

	function getWebviewContent() {
		const isDark = vscode.window.activeColorTheme.kind === vscode.ColorThemeKind.Dark;
		const theme = isDark ? 'github-dark' : 'github';

		return `
			<!DOCTYPE html>
			<html lang="en">
			<head>
			<meta charset="UTF-8">
			<style>
				body { font-family: sans-serif; padding: 10px; }
				button { padding: 8px 12px; margin-bottom: 10px; cursor: pointer; }
				pre > * { margin-bottom: 10px; }
			</style>
			<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/styles/${theme}.min.css">
			<script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/highlight.min.js"></script>
			</head>
			<body>
			<button onclick="run()">Executar Tinker</button>

			<h1>Resultado:</h1>
			<pre id="output">(resultado aparecerá aqui)</pre>
			<script>
				const vscode = acquireVsCodeApi();

				function run() {
					vscode.postMessage({ command: 'run' });
				}

				window.addEventListener('message', event => {
					const { command, output } = event.data;
					let outputs = JSON.parse(output);

					outputs = outputs.map(line => typeof line === 'object' ? JSON.stringify(line, null, 2) : line);
					
					if (command === 'output') {
						document.getElementById('output').innerHTML = '';

						outputs.forEach(line => {
							const element = document.createElement('code');
								element.className = 'language-json';
								element.textContent = line;

							console.log({ element, line})
							document.getElementById('output').appendChild(element);
						});

						hljs.highlightAll();
					}
				});
			</script>
			</body>
			</html>
		`;
	}
}

function deactivate() { }

module.exports = {
	activate,
	deactivate
};

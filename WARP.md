# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

This is a VS Code extension called "tinkerbon" that provides Laravel Tinker integration directly within VS Code. The extension allows users to:

- Create new Tinker files with PHP scaffolding
- Execute PHP code using Laravel's Tinker REPL
- View output in a side-by-side webview panel

## Architecture

**Main Components:**
- `extension.js` - Main extension entry point with VS Code API integration and webview management
- `tinkerExecutor.js` - Core logic for executing PHP code through Laravel Artisan Tinker
- `test/extension.test.js` - Basic test suite using Mocha

**Key Integration Points:**
- Requires a Laravel project workspace to function (uses `php artisan tinker`)
- Creates temporary files in system temp directory for code execution
- Uses VS Code's webview API for the preview panel with bidirectional messaging

## Development Commands

**Linting:**
```bash
yarn lint
# or
npm run lint
```

**Testing:**
```bash
yarn test
# or
npm run test
```
Note: Tests require `yarn pretest` (which runs lint) to pass first.

**VS Code Extension Development:**
- Press F5 or use "Run Extension" from VS Code's debug panel to launch Extension Development Host
- Use `vscode-test` CLI for headless testing

## Dependencies

**Runtime Requirements:**
- VS Code ^1.104.0
- Active Laravel project with Artisan Tinker available
- PHP executable in system PATH

**Dev Dependencies:**
- ESLint for code linting
- Mocha for testing framework
- VS Code extension testing utilities

## Extension Commands

- `tinkerbon.newFile` - Creates new untitled Tinker file with PHP opening tag
- `tinkerbon.runCode` - Executes current editor content via Laravel Tinker

The extension activates automatically when these commands are invoked.
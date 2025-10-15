<?php
// run_psysh.php

use Psy\Shell;
use Symfony\Component\Console\Output\BufferedOutput;

global $argv;

$workspace = $argv[1] ?? null;
$code = $argv[2] ?? null;

if (!$workspace) {
    fwrite(STDERR, "Erro: workspace Laravel não informado\n");
    exit(1);
}

// Se código não veio por argumento, lê do stdin
if (!$code) {
    $code = file_get_contents('php://stdin');
}

// 1️⃣ Autoload da extensão (PsySH)
$extensionAutoload = __DIR__ . '/vendor/autoload.php';
if (file_exists($extensionAutoload)) {
    require_once $extensionAutoload;
}

// 2️⃣ Autoload do Laravel workspace
$workspaceAutoload = $workspace . '/vendor/autoload.php';
if (file_exists($workspaceAutoload)) {
    require_once $workspaceAutoload;
}

// 3️⃣ Inicializa Laravel
$app = require $workspace . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

// 4️⃣ Inicializa PsySH com configuração
$buffer = new BufferedOutput();
$shell = new Shell();

$shell->setOutput($buffer);

// 5️⃣ Quebra o código em expressões por ";"
// Mantém variáveis no mesmo contexto usando addInput sequencial
$lines = array_filter(array_map('trim', explode(';', $code)));
$results = [];

ob_start();
foreach ($lines as $line) {
    if ($line === '') continue;

    if(str_starts_with($line, 'use') || str_starts_with($line, 'require') || str_starts_with($line, 'include')) {
        $shell->execute($line . ';');
        continue;
    }

    try {
        $results[] = $shell->execute($line . ';');
    } catch (\Throwable $e) {
        $output = 'Error: ' . $e->getMessage();
        $results[] = $output;
        continue;
    }
}

echo "tinkerbon::" . json_encode($results, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT);
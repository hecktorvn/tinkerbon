<?php

if(!function_exists('extractPhpStatements')) {
    function extractPhpStatements(string $code): array
    {
        // Remove a tag inicial <?php
        $code = trim(preg_replace('/^<\?php\s*/', '', $code));

        $tokens = token_get_all("<?php " . $code);
        $statements = [];
        $current = '';
        $depth = 0;

        foreach ($tokens as $token) {
            if (is_array($token)) {
                [$id, $text] = $token;

                // Ignora tags e comentários
                if (in_array($id, [T_OPEN_TAG, T_WHITESPACE, T_COMMENT, T_DOC_COMMENT])) {
                    continue;
                }

                // Adiciona espaço após certas palavras-chave
                if (in_array($id, [
                    T_USE, T_NAMESPACE, T_CLASS, T_FUNCTION,
                    T_IF, T_ELSEIF, T_ELSE, T_FOR, T_FOREACH,
                    T_WHILE, T_DO, T_SWITCH, T_CASE, T_TRY,
                    T_CATCH, T_FINALLY, T_RETURN, T_NEW,
                ])) {
                    $current .= $text . ' ';
                } else {
                    $current .= $text;
                }

            } else {
                $current .= $token;

                if ($token === '{') $depth++;
                if ($token === '}') $depth--;

                if ($token === ';' && $depth === 0) {
                    $statements[] = trim($current);
                    $current = '';
                }
            }
        }

        if (trim($current) !== '') {
            $statements[] = trim($current);
        }

        return $statements;
    }
}
<?php

declare(strict_types=1);

namespace App;

use PDO;

final class Database
{
    public static function connection(): PDO
    {
        $dir = dirname(__DIR__) . '/storage';
        if (!is_dir($dir)) {
            mkdir($dir, 0777, true);
        }

        $pdo = new PDO('sqlite:' . $dir . '/linkly.sqlite');
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
        $pdo->exec(
            'CREATE TABLE IF NOT EXISTS links (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                code TEXT NOT NULL UNIQUE,
                url TEXT NOT NULL,
                clicks INTEGER NOT NULL DEFAULT 0,
                created_at TEXT NOT NULL
            )'
        );

        return $pdo;
    }
}

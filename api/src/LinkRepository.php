<?php

declare(strict_types=1);

namespace App;

use PDO;

final class LinkRepository
{
    public function __construct(private PDO $db)
    {
    }

    public function all(): array
    {
        return $this->db->query('SELECT * FROM links ORDER BY id DESC')->fetchAll();
    }

    public function findByCode(string $code): ?array
    {
        $stmt = $this->db->prepare('SELECT * FROM links WHERE code = :code');
        $stmt->execute(['code' => $code]);
        $row = $stmt->fetch();
        return $row ?: null;
    }

    public function create(string $url, ?string $customCode = null): array
    {
        $code = $customCode ?: $this->generateCode();
        if ($customCode && $this->findByCode($customCode)) {
            throw new \InvalidArgumentException('Code already exists');
        }

        $stmt = $this->db->prepare(
            'INSERT INTO links (code, url, clicks, created_at) VALUES (:code, :url, 0, :created_at)'
        );
        $stmt->execute([
            'code' => $code,
            'url' => $url,
            'created_at' => gmdate('c'),
        ]);

        return $this->findByCode($code);
    }

    public function hit(string $code): ?array
    {
        $link = $this->findByCode($code);
        if (!$link) {
            return null;
        }
        $stmt = $this->db->prepare('UPDATE links SET clicks = clicks + 1 WHERE code = :code');
        $stmt->execute(['code' => $code]);
        return $this->findByCode($code);
    }

    public function delete(int $id): void
    {
        $stmt = $this->db->prepare('DELETE FROM links WHERE id = :id');
        $stmt->execute(['id' => $id]);
    }

    private function generateCode(int $length = 6): string
    {
        $alphabet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        do {
            $code = '';
            for ($i = 0; $i < $length; $i++) {
                $code .= $alphabet[random_int(0, strlen($alphabet) - 1)];
            }
        } while ($this->findByCode($code));

        return $code;
    }
}

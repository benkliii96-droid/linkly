<?php

declare(strict_types=1);

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

require dirname(__DIR__) . '/src/bootstrap.php';

use App\Database;
use App\LinkRepository;

$db = Database::connection();
$links = new LinkRepository($db);

$method = $_SERVER['REQUEST_METHOD'];
$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH) ?: '/';
$uri = preg_replace('#^/api#', '', $uri) ?: '/';

function json_response(mixed $data, int $status = 200): void
{
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit;
}

function read_json(): array
{
    $raw = file_get_contents('php://input') ?: '{}';
    $data = json_decode($raw, true);
    return is_array($data) ? $data : [];
}

if ($method === 'GET' && $uri === '/links') {
    json_response($links->all());
}

if ($method === 'POST' && $uri === '/links') {
    $payload = read_json();
    $url = trim((string) ($payload['url'] ?? ''));
    $code = isset($payload['code']) ? trim((string) $payload['code']) : null;

    if ($url === '' || !filter_var($url, FILTER_VALIDATE_URL)) {
        json_response(['error' => 'Valid URL required'], 422);
    }

    try {
        json_response($links->create($url, $code ?: null), 201);
    } catch (\InvalidArgumentException $e) {
        json_response(['error' => $e->getMessage()], 409);
    }
}

if ($method === 'DELETE' && preg_match('#^/links/(\d+)$#', $uri, $m)) {
    $links->delete((int) $m[1]);
    json_response(['ok' => true]);
}

if ($method === 'GET' && preg_match('#^/r/([A-Za-z0-9_-]+)$#', $uri, $m)) {
    $link = $links->hit($m[1]);
    if (!$link) {
        json_response(['error' => 'Not found'], 404);
    }
    header('Location: ' . $link['url'], true, 302);
    exit;
}

json_response(['error' => 'Not found'], 404);

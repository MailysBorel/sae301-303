<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=utf-8");

try {
    // Connexion à la base de données
    $host = '127.0.0.1';
    $port = 3306;
    $dbname = 'mokea';
    $user = 'root';
    $pass = '';

    //data source name
    $dsn = "mysql:host={$host};port={$port};dbname={$dbname};charset=utf8mb4";
    $pdo = new PDO($dsn, $user, $pass, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    ]);

    // Exécution de la requête pour compter les utilisateurs
    $stmt = $pdo->query("SELECT COUNT(*) AS count FROM utilisateurs");
    $row = $stmt->fetch();
    $count = (int) ($row['count'] ?? 0);

    // Retourner le résultat en JSON
    echo json_encode(['count' => $count], JSON_UNESCAPED_UNICODE);

    // Fermer la connexion
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'error' => 'database_error',
        'message' => $e->getMessage()
    ], JSON_UNESCAPED_UNICODE);
} catch (Exception $e) {// Erreur générale
    http_response_code(500);
    echo json_encode([
        'error' => 'internal_error',
        'message' => $e->getMessage()
    ], JSON_UNESCAPED_UNICODE);
}
?>



<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=utf-8");

try {
    // Ajuste ces paramètres si nécessaire
    $host = '127.0.0.1';
    $port = 3306;
    $dbname = 'mokea';
    $user = 'root';
    $pass = '';

    $dsn = "mysql:host={$host};port={$port};dbname={$dbname};charset=utf8mb4";
    $pdo = new PDO($dsn, $user, $pass, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    ]);

    // Option 1 (simple) : toujours renvoyer le count des utilisateurs
    $stmt = $pdo->query("SELECT COUNT(*) AS count FROM utilisateurs");
    $row = $stmt->fetch();
    $count = (int) ($row['count'] ?? 0);

    echo json_encode(['count' => $count], JSON_UNESCAPED_UNICODE);

    // --- Option alternative (si tu veux garder l'ancienne route boxes + param pour count)
    // Si tu préfères garder la logique précédente et activer le count via ?action=count_users
    // décommente le bloc ci-dessous et commente la partie simple ci-dessus.
    /*
    if (isset($_GET['action']) && $_GET['action'] === 'count_users') {
        $stmt = $pdo->query("SELECT COUNT(*) AS count FROM utilisateurs");
        $row = $stmt->fetch();
        $count = (int) ($row['count'] ?? 0);
        echo json_encode(['count' => $count], JSON_UNESCAPED_UNICODE);
        exit;
    }

    // Sinon garde le comportement précédent (liste des boxes)
    $boxes = $pdo->query('SELECT * FROM boxes')->fetchAll(PDO::FETCH_ASSOC);
    foreach ($boxes as &$box) {
        if (isset($box['price'])) {
            $box['price'] = round($box['price'] / 2);
        }
        // foods
        $stmt = $pdo->prepare("
            SELECT f.name, CAST(bf.quantity AS UNSIGNED) AS quantity
            FROM box_foods bf
            JOIN foods f ON bf.food_id = f.id
            WHERE bf.box_id = :box_id
        ");
        $stmt->execute(['box_id' => $box['id']]);
        $box['foods'] = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // flavors
        $stmt = $pdo->prepare("
            SELECT fl.name
            FROM box_flavors bf
            JOIN flavors fl ON bf.flavor_id = fl.id
            WHERE bf.box_id = :id
        ");
        $stmt->execute(['id' => $box['id']]);
        $box['flavors'] = array_column($stmt->fetchAll(PDO::FETCH_ASSOC), 'name');
    }
    echo json_encode($boxes, JSON_UNESCAPED_UNICODE);
    */
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'error' => 'database_error',
        'message' => $e->getMessage()
    ], JSON_UNESCAPED_UNICODE);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'error' => 'internal_error',
        'message' => $e->getMessage()
    ], JSON_UNESCAPED_UNICODE);
}
?>



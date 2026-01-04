<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

try {
    // Connexion directe pour être sûr que ça marche
    $pdo = new PDO('mysql:host=localhost;dbname=mokea;charset=utf8', 'root', '');
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $data = json_decode(file_get_contents("php://input"));

    if(!empty($data->email) && !empty($data->password)){
        $sql = "SELECT * FROM users WHERE email = :email";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([':email' => $data->email]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        if($user && password_verify($data->password, $user['password'])){
            unset($user['password']);
            echo json_encode([
                "message" => "Login successful.",
                "token" => base64_encode(json_encode($user)),
                "user" => $user
            ]);
        } else {
            http_response_code(401);
            echo json_encode(["message" => "Identifiants invalides."]);
        }
    } else {
        http_response_code(400);
        echo json_encode(["message" => "Données incomplètes."]);
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => $e->getMessage()]);
}
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

    // Récupération des données JSON
    $data = json_decode(file_get_contents("php://input"));

    // Vérification des champs requis
    if(!empty($data->email) && !empty($data->password)){
        $sql = "SELECT * FROM users WHERE email = :email";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([':email' => $data->email]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        // Vérification du mot de passe
        if($user && password_verify($data->password, $user['password'])){
            unset($user['password']);

            // Détection du statut étudiant si présent (ne déclenche aucune remise ici)
            $isStudent = false;
            if (isset($data->is_student)) {
                $isStudent = filter_var($data->is_student, FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE);
                if ($isStudent === null) $isStudent = false;
            } elseif (isset($user['is_student'])) {
                $isStudent = (bool)$user['is_student'];
            }

            $user['is_student'] = $isStudent;

            echo json_encode([
                "message" => "Login successful.",
                "token" => base64_encode(json_encode($user)),
                "user" => $user
            ]);
        } else { // Identifiants invalides
            http_response_code(401);
            echo json_encode(["message" => "Identifiants invalides."]);
        }
    } else { // Données incomplètes
        http_response_code(400);
        echo json_encode(["message" => "Données incomplètes."]);
    }
} catch (Exception $e) { // Erreur serveur
    http_response_code(500);
    echo json_encode(["error" => $e->getMessage()]);
}
<?php
// En-têtes pour autoriser Angular (CORS)
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// Gestion du "Preflight request" (important pour Angular)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

try {
    // Connexion à la base de données
    $pdo = new PDO('mysql:host=localhost;dbname=mokea;charset=utf8', 'root', '');
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Récupération des données envoyées par Angular
    $data = json_decode(file_get_contents("php://input"));

    // Vérification que toutes les données sont présentes
    if (
        !empty($data->firstname) && 
        !empty($data->lastname) && 
        !empty($data->email) && 
        !empty($data->password) && 
        !empty($data->address)
    ) {
        // 1. Vérifier si l'utilisateur existe déjà
        $checkEmail = $pdo->prepare("SELECT id FROM users WHERE email = ?");
        $checkEmail->execute([$data->email]);
        
        if ($checkEmail->rowCount() > 0) {
            http_response_code(400);
            echo json_encode(["message" => "Cet email est déjà utilisé."]);
            exit();
        }

        // 2. Hashage du mot de passe
        $password_hash = password_hash($data->password, PASSWORD_BCRYPT);

        // 3. Insertion
        $sql = "INSERT INTO users (firstname, lastname, email, password, address) 
                VALUES (:firstname, :lastname, :email, :password, :address)";
        
        $stmt = $pdo->prepare($sql);

        if ($stmt->execute([
            ':firstname' => $data->firstname,
            ':lastname'  => $data->lastname,
            ':email'     => $data->email,
            ':password'  => $password_hash,
            ':address'   => $data->address
        ])) {
            // Récupération de l'ID généré
            $id = $pdo->lastInsertId();

            // Préparation de l'objet utilisateur pour la réponse
            $user = [
                'id' => $id,
                'firstname' => $data->firstname,
                'lastname' => $data->lastname,
                'email' => $data->email,
                'address' => $data->address
            ];

            // Simulation d'un token (Base64)
            $token = base64_encode(json_encode(['id' => $id, 'exp' => time() + 3600]));

            http_response_code(201);
            echo json_encode([
                "message" => "Compte créé avec succès.",
                "token"   => $token,
                "user"    => $user
            ]);
        } else {
            http_response_code(503);
            echo json_encode(["message" => "Erreur lors de la création du compte."]);
        }
    } else {
        http_response_code(400);
        echo json_encode(["message" => "Données incomplètes."]);
    }

} catch (PDOException $e) {
    // En cas d'erreur de base de données, on renvoie l'erreur en JSON
    http_response_code(500);
    echo json_encode([
        "message" => "Erreur de base de données.",
        "error"   => $e->getMessage()
    ]);
}
?>
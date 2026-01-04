<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// Gérer les requêtes options
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
            $isStudent = false;
            if (isset($data->is_student)) {
                $isStudent = filter_var($data->is_student, FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE);
                if ($isStudent === null) $isStudent = false;
            }

            // Vérifier si la colonne is_student existe dans la table users
            $hasIsStudent = false;
            try {
                $res = $pdo->query("SHOW COLUMNS FROM users LIKE 'is_student'");
                $hasIsStudent = ($res && $res->rowCount() > 0);
            } catch (Exception $e) {
                $hasIsStudent = false;
            }
            
            // Préparer la requête en fonction de l'existence de la colonne is_student
            if ($hasIsStudent) {
                $sql = "INSERT INTO users (firstname, lastname, email, password, address, is_student) 
                        VALUES (:firstname, :lastname, :email, :password, :address, :is_student)";
                $stmt = $pdo->prepare($sql);
                $executeParams = [
                    ':firstname' => $data->firstname,
                    ':lastname'  => $data->lastname,
                    ':email'     => $data->email,
                    ':password'  => $password_hash,
                    ':address'   => $data->address,
                    ':is_student'=> $isStudent ? 1 : 0
                ];
                // Si la colonne n'existe pas, on n'inclut pas is_student dans l'insertion
            } else {
                $sql = "INSERT INTO users (firstname, lastname, email, password, address) 
                        VALUES (:firstname, :lastname, :email, :password, :address)";
                $stmt = $pdo->prepare($sql);
                $executeParams = [
                    ':firstname' => $data->firstname,
                    ':lastname'  => $data->lastname,
                    ':email'     => $data->email,
                    ':password'  => $password_hash,
                    ':address'   => $data->address
                ];
            }

            // Exécution de la requête
            if ($stmt->execute($executeParams)) {
            // Récupération de l'ID généré
            $id = $pdo->lastInsertId();

            // Préparation de l'objet utilisateur pour la réponse
            $user = [
                'id' => $id,
                'firstname' => $data->firstname,
                'lastname' => $data->lastname,
                'email' => $data->email,
                'address' => $data->address,
                'is_student' => $isStudent
            ];

            // No discount applied here; only return is_student flag

            // Simulation d'un token.
            // TOKEN c'est une chaîne de caractères utilisée pour identifier de manière sécurisée un utilisateur ou une session. 
            //un token peut permettre de vérifier qu’une requête vient bien d’un utilisateur authentifié, sans avoir à transmettre des identifiants sensibles à chaque requête.
            //En gros c’est un mécanisme de sécurité et d’authentification qui simplifie la gestion des sessions.
            $token = base64_encode(json_encode(['id' => $id, 'exp' => time() + 3600]));

            // Réponse succès
            http_response_code(201);
            echo json_encode([
                "message" => "Compte créé avec succès.",
                "token"   => $token,
                "user"    => $user
            ]);
        } else { // Erreur lors de l'insertion
            http_response_code(503);
            echo json_encode(["message" => "Erreur lors de la création du compte."]);
        }
    } else { // Données incomplètes
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
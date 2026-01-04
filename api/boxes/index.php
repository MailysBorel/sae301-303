<?php
    header("Access-Control-Allow-Origin: *"); // Autoriser toutes les origines
    header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS"); // Méthodes HTTP autorisées
    header("Access-Control-Allow-Headers: Content-Type, Authorization"); // En-têtes autorisés

    $pdo = new PDO('mysql:host=localhost;dbname=mokea', 'root', '');
    $boxes = $pdo->query('SELECT * FROM boxes')->fetchAll(PDO::FETCH_ASSOC); //Récupérer toutes les boxes

    //Si un id est passé en paramètre, ne retourner que la box correspondante
    if  (isset ($_GET['id'])){
        $id = (int) $_GET['id'];
        $result = $pdo->prepare("SELECT * FROM boxes WHERE id=?");
        $result->execute([$id]);
        $boxes= $result->fetchAll();
    }
    else { //Sinon, pour chaque box, récupérer les foods et les flavors associés
    foreach ($boxes as &$box) {
        // conversion du prix en float si le champ 'prix' existe (compatibilité DB)
        if (isset($box['prix'])) {
            $box['prix'] = round($box['prix'] / 2, 2);
        } elseif (isset($box['price'])) {
            $box['price'] = round($box['price'] / 2, 2);
        }
        
        //etape 2 :food
        $stmt = $pdo->prepare(" 
            select f.name, cast(bf.quantity as unsigned) as quantity
            from box_foods bf
            join foods f on bf.food_id = f.id
            where bf.box_id = :box_id
            "); 
            $stmt->execute(['box_id' => $box['id']]);
            $box['foods'] = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        //etape 3 flavors

        $stmt = $pdo->prepare("
        select fl.name
        from box_flavors bf
        join flavors fl on bf.flavor_id = fl.id
        where bf.box_id = :id
        ");
    $stmt->execute(['id' => $box['id']]); // Lier le paramètre :id à l'ID de la box courante
    $box['flavors'] = array_column($stmt->fetchAll(), 'name');
    }
    
    }
    } 
    header("content-type: application/json; charset=utf-8");
    echo json_encode($boxes); //Retourner les boxes en JSON
?>



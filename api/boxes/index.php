<?php
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type, Authorization");
    //require_once '../config/database.php';
    $pdo = new PDO('mysql:host=localhost;dbname=mokea', 'root', '');
    $boxes = $pdo->query('SELECT * FROM boxes')->fetchAll(PDO::FETCH_ASSOC);

    if  (isset ($_GET['id'])){
        $result = $pdo->prepare("SELECT * FROM boxes WHERE id=?");
        $result->execute([$id]);
        $boxes= $result->fetchAll();
        }
    else {
    foreach ($boxes as $box) {
        //conversion du prix en float
        $box['price']=round ($box['price'] / 2); 
        
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
    $stmt->execute(['id' => $box['id']]);
    $box['flavors'] = array_column($stmt->fetchAll(), 'name');
    
    }
    }
    header("content-type: application/json; charset=utf-8");
    echo json_encode($boxes);
?>



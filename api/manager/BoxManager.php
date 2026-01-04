<?php 
    class BoxManager { 
        private $conn; // Instance de la connexion à la base de données
        public function findall() { // Récupérer toutes les boxes
            $sql = "SELECT * FROM boxes";  // Requête SQL pour récupérer toutes les boxes
            $stmt = $this->conn->prepare($sql); 
            $stmt->execute(); // Exécuter 
            $result = $stmt->get_result(); //obtention du résultat
            $boxes = []; 
            while ($row = $result->fetch_assoc()) { // Parcourir chaque ligne du résultat
                $boxes[] = $row; // Ajouter chaque box au tableau
            }
            return $boxes; // afficher le tableau des boxes
        } 
        // Récupérer une box par son ID
        public function findbyid($id) {
            $sql = "SELECT * FROM boxes WHERE id = ?"; // Requête SQL pour récup l'id de la boxe
            $stmt = $this->conn->prepare($sql); 
            $stmt->bind_param("i", $id); // Lier le paramètre ID
            $stmt->execute(); 
            $result = $stmt->get_result();
            return $result->fetch_assoc(); // Retourner la box trouvée
        }
    }
?>
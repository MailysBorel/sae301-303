<?php 
    class BoxManager { 
        private $conn; // Instance de la connexion à la base de données
        public function findall() { // Récupérer toutes les boxes
            $sql = "SELECT * FROM boxes"; 
            $stmt = $this->conn->prepare($sql); 
            $stmt->execute(); 
            $result = $stmt->get_result();
            $boxes = [];
            while ($row = $result->fetch_assoc()) {
                $boxes[] = $row;
            }
            return $boxes;
        } // Récupérer une box par son ID
        public function findbyid($id) {
            $sql = "SELECT * FROM boxes WHERE id = ?";
            $stmt = $this->conn->prepare($sql);
            $stmt->bind_param("i", $id);
            $stmt->execute();
            $result = $stmt->get_result();
            return $result->fetch_assoc();
        }
    }
?>
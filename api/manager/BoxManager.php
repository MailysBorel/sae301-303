<?php 
    class BoxManager {
        private $conn;
        public function findall() {
            $sql = "SELECT * FROM boxes";
            $stmt = $this->conn->prepare($sql);
            $stmt->execute();
            $result = $stmt->get_result();
            $boxes = [];
            while ($row = $result->fetch_assoc()) {
                $boxes[] = $row;
            }
            return $boxes;
        }
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
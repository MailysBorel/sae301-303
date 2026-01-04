export interface SushiBox {
    id: number;
    name: string;   // Changed from 'nom'
    pieces: number;
    price: number;  // Changed from 'prix'
    image: string;
    description?: string;
    flavors?: string[]; // From API 'flavors'
    foods?: any[];      // From API 'foods'
}

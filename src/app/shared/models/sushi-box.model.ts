export interface SushiBox {
    id: number;
    name: string;   // nom depuis 'nom'
    pieces: number;
    price: number;  // chiffre depuis 'prix'
    image: string;
    description?: string;
    flavors?: string[]; // depuis API 'flavors'
    foods?: any[];      // depuis API 'foods'
}

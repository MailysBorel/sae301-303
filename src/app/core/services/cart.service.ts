import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { SushiBox } from '../../shared/models/sushi-box.model';

export interface CartItem {
    box: SushiBox;
    quantity: number;
}

@Injectable({ // Service injectable 
    providedIn: 'root'
})
export class CartService { // Service de gestion du panier
    private itemsSubject = new BehaviorSubject<CartItem[]>([]); // Sujet pour stocker les articles du panier
    items$ = this.itemsSubject.asObservable(); //pour les articles du panier

    // Constructeur du service
    constructor() {
        this.loadCart(); // Charger le panier depuis le stockage local au démarrage
    }

    private loadCart() { // Méthode 
        const saved = localStorage.getItem('cart'); // Récupéreration des articles en local
        if (saved) { // si y'a des articles
            try { 
                const parsed = JSON.parse(saved);

                // Normalisation des données pour s'assurer que les types sont corrects
                const normalized = (parsed || []).map((item: any) => {
                    if (item && item.box) {
                        // si le prix est manquant, utiliser 'prix' à la place
                        if ((item.box.price === undefined || item.box.price === null) && item.box.prix !== undefined) {
                            item.box.price = Number(item.box.prix);
                        }

                        // s'assurer que le prix est un nombre
                        if (typeof item.box.price === 'string') {
                            const n = parseFloat(item.box.price as any);
                            item.box.price = isNaN(n) ? 0 : n;
                        }

                        // s'assurer que la quantité est un nombre entier
                        if (typeof item.quantity === 'string') {
                            const q = parseInt(item.quantity as any, 10);
                            item.quantity = isNaN(q) ? 1 : q;
                        }
                    }
                    return item;
                });
                // Mettre à jour le sujet avec les articles
                this.itemsSubject.next(normalized);
            } catch (e) { // En cas d'erreur de parsing
                console.error('euureur de chargement', e); // Afficher l'erreur dans la console (console avec f12)
            }
        }
    }
// Méthode pour sauvegarder le panier dans le stockage local
    private saveCart(items: CartItem[]) {
        localStorage.setItem('cart', JSON.stringify(items));
        this.itemsSubject.next(items);
    }
// Méthode pour ajouter une boxe de sushi au panier
    add(box: SushiBox) {
        const currentItems = this.itemsSubject.value;
        const existing = currentItems.find(item => item.box.id === box.id);

// Si l'article existe déjà, incrémenter la quantité
        if (existing) {
            existing.quantity++;
            this.saveCart([...currentItems]);
        } else {
            this.saveCart([...currentItems, { box, quantity: 1 }]);
        }
    }
// Méthode pour diminuer la quantité d'une boxe de sushi dans le panier
    decrement(boxId: number) {
        const currentItems = this.itemsSubject.value;
        const existing = currentItems.find(item => item.box.id === boxId);
// Si l'article existe déjà, diminuer la quantité
        if (existing) {
            if (existing.quantity > 1) {
                existing.quantity--;
                this.saveCart([...currentItems]);
            } else {
                this.remove(boxId);
            }
        }
    }
// Méthode pour supprimer une boxe de sushi du panier
    remove(boxId: number) {
        const currentItems = this.itemsSubject.value;
        const filtered = currentItems.filter(item => item.box.id !== boxId);
        this.saveCart(filtered);
    }
    // Méthode pour vider le panier
    get count(): number {
        return this.itemsSubject.value.reduce((acc, item) => acc + item.quantity, 0);
    }
// Méthode pour obtenir le total du panier
    get total(): number {
        return this.itemsSubject.value.reduce((acc, item) => acc + (item.box.price * item.quantity), 0);
    }
}

import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { SushiBox } from '../../shared/models/sushi-box.model';

export interface CartItem {
    box: SushiBox;
    quantity: number;
}

@Injectable({
    providedIn: 'root'
})
export class CartService {
    private itemsSubject = new BehaviorSubject<CartItem[]>([]);
    items$ = this.itemsSubject.asObservable();

    constructor() {
        this.loadCart();
    }

    private loadCart() {
        const saved = localStorage.getItem('cart');
        if (saved) {
            try {
                this.itemsSubject.next(JSON.parse(saved));
            } catch (e) {
                console.error('Failed to load cart', e);
            }
        }
    }

    private saveCart(items: CartItem[]) {
        localStorage.setItem('cart', JSON.stringify(items));
        this.itemsSubject.next(items);
    }

    add(box: SushiBox) {
        const currentItems = this.itemsSubject.value;
        const existing = currentItems.find(item => item.box.id === box.id);

        if (existing) {
            existing.quantity++;
            this.saveCart([...currentItems]);
        } else {
            this.saveCart([...currentItems, { box, quantity: 1 }]);
        }
    }

    decrement(boxId: number) {
        const currentItems = this.itemsSubject.value;
        const existing = currentItems.find(item => item.box.id === boxId);

        if (existing) {
            if (existing.quantity > 1) {
                existing.quantity--;
                this.saveCart([...currentItems]);
            } else {
                this.remove(boxId);
            }
        }
    }

    remove(boxId: number) {
        const currentItems = this.itemsSubject.value;
        const filtered = currentItems.filter(item => item.box.id !== boxId);
        this.saveCart(filtered);
    }

    get count(): number {
        return this.itemsSubject.value.reduce((acc, item) => acc + item.quantity, 0);
    }

    get total(): number {
        return this.itemsSubject.value.reduce((acc, item) => acc + (item.box.price * item.quantity), 0);
    }
}

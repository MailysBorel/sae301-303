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
                const parsed = JSON.parse(saved);

                // Normalize loaded items: ensure box.price exists and is a number.
                const normalized = (parsed || []).map((item: any) => {
                    if (item && item.box) {
                        // If old API used 'prix' instead of 'price', map it
                        if ((item.box.price === undefined || item.box.price === null) && item.box.prix !== undefined) {
                            item.box.price = Number(item.box.prix);
                        }

                        // If price is a string, convert to number
                        if (typeof item.box.price === 'string') {
                            const n = parseFloat(item.box.price as any);
                            item.box.price = isNaN(n) ? 0 : n;
                        }

                        // Ensure quantity is a number
                        if (typeof item.quantity === 'string') {
                            const q = parseInt(item.quantity as any, 10);
                            item.quantity = isNaN(q) ? 1 : q;
                        }
                    }
                    return item;
                });

                this.itemsSubject.next(normalized);
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

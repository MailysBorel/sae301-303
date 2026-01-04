import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../components/header/header.component';
import { CartService, CartItem } from '../../core/services/cart.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
    selector: 'app-cart',
    standalone: true,
    imports: [CommonModule, HeaderComponent],
    template: `
    <app-header></app-header>
    <div class="container cart-container">
      <h1>Votre Panier</h1>

      <div *ngIf="(cartItems$ | async) as items">
        <div *ngIf="items.length > 0; else emptyCart">
          
          <div class="cart-items">
            <div class="cart-item" *ngFor="let item of items">
              <div class="item-image">
                <img [src]="item.box.image" [alt]="item.box.name">
              </div>
              <div class="item-details">
                <h3>{{ item.box.name }}</h3>
                <p>{{ item.box.pieces }} pièces</p>
              </div>
              <div class="item-quantity">
                <button (click)="decrementItem(item)">-</button>
                <span>{{ item.quantity }}</span>
                <button (click)="addItem(item)">+</button>
              </div>
              <div class="item-price">
                {{ (item.box.price * item.quantity) | currency:'EUR':'symbol':'1.2-2' }}
              </div>
            </div>
          </div>

          <div class="cart-summary">
            <div class="total-row">
              <span>Total</span>
              <span class="total-price">{{ total$ | async | currency:'EUR':'symbol':'1.2-2' }}</span>
            </div>
            <button class="btn btn-primary btn-block">Commander</button>
          </div>

        </div>

        <ng-template #emptyCart>
          <div class="empty-state">
            <p>Votre panier est vide.</p>
            <a href="/" class="btn btn-primary">Découvrir la carte</a>
          </div>
        </ng-template>
      </div>
    </div>
  `,
    styles: [`
    .cart-container {
      padding-top: 40px;
      padding-bottom: 80px;
      min-height: 80vh;
    }

    h1 {
      margin-bottom: 32px;
      font-weight: 700;
      text-transform: uppercase;
    }

    .cart-items {
      margin-bottom: 40px;
      border-top: 1px solid #eee;
    }

    .cart-item {
      display: flex;
      align-items: center;
      padding: 24px 0;
      border-bottom: 1px solid #eee;
    }

    .item-image {
      width: 80px;
      height: 80px;
      margin-right: 24px;
      background: #f9f9f9;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .item-image img {
      max-width: 100%;
      max-height: 100%;
      object-fit: contain;
    }

    .item-details {
      flex: 1;
    }

    .item-details h3 {
      font-size: 1rem;
      font-weight: 600;
      margin-bottom: 4px;
      text-transform: uppercase;
    }

    .item-details p {
      color: var(--color-text-muted);
      font-size: 0.875rem;
    }

    .item-quantity {
      display: flex;
      align-items: center;
      gap: 12px;
      margin: 0 32px;
    }

    .item-quantity button {
      width: 28px;
      height: 28px;
      border-radius: 50%;
      border: 1px solid #ddd;
      background: transparent;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
    }

    .item-quantity button:hover {
      border-color: var(--color-black);
      background: var(--color-black);
      color: white;
    }

    .item-price {
      font-weight: 600;
      min-width: 80px;
      text-align: right;
    }

    .cart-summary {
      background: #f9f9f9;
      padding: 32px;
      border-radius: 4px;
      max-width: 400px;
      margin-left: auto;
    }

    .total-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 1.25rem;
      font-weight: 700;
      margin-bottom: 24px;
    }

    .btn-block {
      width: 100%;
      padding: 16px;
    }

    .empty-state {
      text-align: center;
      padding: 80px 0;
    }

    .empty-state p {
      margin-bottom: 24px;
      color: var(--color-text-muted);
    }
  `]
})
export class CartComponent implements OnInit {
    cartItems$!: Observable<CartItem[]>;
    total$!: Observable<number>;

    constructor(private cartService: CartService) { }

    ngOnInit() {
        this.cartItems$ = this.cartService.items$;
        this.total$ = this.cartService.items$.pipe(
            map(items => items.reduce((acc, item) => acc + (item.box.price * item.quantity), 0))
        );
    }

    addItem(item: CartItem) {
        this.cartService.add(item.box);
    }

    decrementItem(item: CartItem) {
        if (item.quantity > 1) {
            this.cartService.decrement(item.box.id);
        } else {
            this.cartService.remove(item.box.id);
        }
    }

    removeItem(boxId: number) {
        this.cartService.remove(boxId);
    }
}

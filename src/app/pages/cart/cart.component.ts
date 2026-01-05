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
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent implements OnInit { // Composant de la page Panier
  cartItems$!: Observable<CartItem[]>;
  total$!: Observable<number>;// Total du panier

  constructor(private cartService: CartService) { } // Injection du service de gestion du panier

  // Initialisation des observables pour les items du panier et le total
  ngOnInit() {
    this.cartItems$ = this.cartService.items$;

    this.total$ = this.cartService.items$.pipe(
      map(items => items.reduce((acc, item) => acc + (item.box.price * item.quantity), 0))
    );
  }
  // Méthode pour ajouter une boxe de sushi au panier
  addItem(item: CartItem) {
    this.cartService.add(item.box);
  }
  // Méthode pour diminuer la quantité d'une boxe de sushi dans le panier
  decrementItem(item: CartItem) {
    if (item.quantity > 1) {
      this.cartService.decrement(item.box.id);
    } else {
      this.cartService.remove(item.box.id);
    }
  }
  // Méthode pour supprimer une boxe de sushi du panier
  removeItem(boxId: number) {
    this.cartService.remove(boxId);
  }
}

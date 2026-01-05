import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService, User } from '../../core/services/auth.service'; // Service d'authentification
import { CartService } from '../../core/services/cart.service'; // Service de gestion du panier
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
// Composant Header
export class HeaderComponent implements OnInit { // Implémente OnInit (exécution du code au moment où le composant est initialisé)
  currentUser$!: Observable<User | null>; // Observable pour l'utilisateur courant. Observable => valeur qui peut changer exemple: la connexion ou la deconnexion du compte
  cartCount$!: Observable<number>; // Observable pour le nombre d'articles dans le panier. Donc on peut afficher le nombre d'articles dans le panier en temps réel

  constructor(
    private authService: AuthService,
    private cartService: CartService
  ) { }

  //lors de l'initialisation d'un composant
  ngOnInit() {
    this.currentUser$ = this.authService.currentUser$; // permet de récupérer l'utilisateur courant depuis le service d'authentification


    this.cartCount$ = this.cartService.items$.pipe( // pareil mais pour le panier

    ) as any; // ici, j'utilise l'opérateur 'map' pour transformer la liste des articles du panier en un nombre total d'articles

    // Calculer le nombre total d'articles dans le panier
    this.cartCount$ = this.cartService.items$.pipe(
      map(items => items.reduce((acc, item) => acc + item.quantity, 0)) // permet d'additionner les quantités de chaque article
    );
  }

  // Méthode de déconnexion
  logout() {
    this.authService.logout();
  }
}

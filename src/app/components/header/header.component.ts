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
  template: ` 



    <header class="header">
      <div class="container header-content">

    
        <a routerLink="/" class="logo">
          <img src="assets/images/logo_blanc.png" alt="Mokéa" class="logo-img">
        </a>



        <div class="user-actions">
          <ng-container *ngIf="currentUser$ | async as user; else guestTemplate">
             <a (click)="logout()" class="action-link" style="cursor: pointer;">
              Déconnexion
            </a>
          </ng-container>
          <ng-template #guestTemplate>
             <a routerLink="/login" class="action-link">
              <span>Connexion</span>
            </a>
          </ng-template>

          <a routerLink="/cart" class="action-btn cart-btn">
            <span>Panier</span>
            <span class="badge" *ngIf="(cartCount$ | async) as count">{{ count }}</span>
          </a>
        </div>
      </div>
    </header>
  `,
  styles: [`
    .header {
      background-color: var(--color-black);
      color: var(--color-white);
      height: var(--header-height);
      position: sticky;
      top: 0;
      z-index: 1000;
      display: flex;
      align-items: center;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }
    
    .header-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
    }

    .logo {
      color: var(--color-white);
      display: flex;
      align-items: center;
    }

    .logo-img {
      height: 40px; /* Adjust based on preference */
      width: auto;
    }

    /* Mode Selector (Livraison / Emporter) */
    .mode-selector {
      display: flex;
      background-color: #1a1a1a;
      border-radius: 30px;
      padding: 4px;
    }

    .mode-btn {
      background: transparent;
      color: #888;
      border-radius: 25px;
      padding: 8px 16px;
      font-size: 0.875rem;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .mode-btn.active {
      background-color: var(--color-white);
      color: var(--color-black);
      font-weight: 600;
    }

    /* authentification et panier */

    .user-actions {
      display: flex;
      align-items: center;
      gap: 24px;
    }

    .action-link {
      font-size: 0.875rem;
      font-weight: 500;
    }
    
    .welcome-text {
        font-size: 0.875rem;
        color: var(--color-gold);
        font-weight: 600;
    }
    
    .action-link:hover {
      color: var(--color-gold);
    }

    .cart-btn {
      background-color: var(--color-gold);
      color: var(--color-white);
      padding: 8px 16px;
      border-radius: 20px;
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 0.875rem;
    }

    .cart-btn:hover {
      background-color: #A38F7B; /* Darker Gold */
    }

    .badge {
      background-color: var(--color-black);
      color: var(--color-white);
      border-radius: 50%;
      padding: 2px 6px;
      font-size: 0.75rem;
    }
  `]
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

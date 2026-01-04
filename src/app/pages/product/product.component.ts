import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { SushiService } from '../../core/services/sushi.service';
import { HeaderComponent } from '../../components/header/header.component';
import { SushiBox } from '../../shared/models/sushi-box.model';
import { Observable, of } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';
import { CartService } from '../../core/services/cart.service';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [CommonModule, RouterLink, HeaderComponent],
  template: `
    <app-header></app-header>
    <div class="container product-page">
      <div *ngIf="box$ | async as box; else loading">
        <div class="product-grid">
          <div class="product-image">
            <img [src]="box.image" [alt]="box.name">
          </div>
          <div class="product-details">
            <h1>{{ box.name }}</h1>
            <p class="sub">{{ box.pieces }} pièces</p>
            <p class="price">{{ box.price | currency:'EUR':'symbol':'1.2-2' }}</p>
            <p class="desc">{{ box.description }}</p>

            <h3>Contenu</h3>
            <ul>
              <li *ngFor="let f of box.foods">{{ f.nom }} — {{ f.quantite }}</li>
            </ul>

            <button class="btn btn-primary" (click)="addToCart(box)">Ajouter au panier</button>
          </div>
        </div>
      </div>
      <ng-template #loading>
        <p>Chargement...</p>
      </ng-template>
    </div>
  `,
  styles: [`
    .product-page { padding: 40px 20px; }
    .product-grid {
      display: grid;
      grid-template-columns: 1fr 420px;
      gap: 32px;
      align-items: start;
      max-width: 1200px;
      margin: 0 auto;
    }
    .product-image {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .product-image img {
      width: 100%;
      max-width: 760px;
      height: auto;
      border-radius: 12px;
      box-shadow: 0 8px 30px rgba(0,0,0,0.08);
      display: block;
    }
    .product-details {
      padding: 12px 8px;
    }
    .product-details h1 { margin: 0 0 8px 0; font-size: 2rem; }
    .product-details .sub { color: var(--color-text-muted); margin-bottom: 8px; }
    .product-details .price { font-size: 1.6rem; font-weight: 800; margin: 8px 0 16px 0; }
    .product-details .desc { color: var(--color-text-muted); margin-bottom: 18px; line-height: 1.6; }
    .product-details h3 { margin-top: 0; margin-bottom: 8px; }
    ul { padding-left: 1.1rem; margin-top: 0; margin-bottom: 18px; }
    ul li { margin-bottom: 6px; line-height: 1.5; }
    .btn.btn-primary { display: inline-block; padding: 12px 18px; font-weight: 700; }

    /* Responsive */
    @media (max-width: 900px) {
      .product-grid { grid-template-columns: 1fr; }
      .product-image img { max-width: 100%; }
      .product-details { padding-top: 12px; }
    }
  `]
}) //
export class ProductComponent implements OnInit { 
  box$!: Observable<SushiBox | undefined>;// Observable pour la boîte de sushi affichée

  constructor(
    private route: ActivatedRoute, // Pour accéder aux paramètres du routage
    private sushiService: SushiService, // Service pour récupérer les données des sushis
    private cartService: CartService // Service pour gérer le panier
  ) {}
 // Initialisation de l'observable en fonction de l'ID dans l'URL
  ngOnInit(): void {
    this.box$ = this.route.paramMap.pipe( // Récupération des paramètres de l'URL
      map(params => Number(params.get('id'))), // Extraction de l'ID
      switchMap(id => this.sushiService.getBoxById(id)) // Récupération de la boîte de sushi par l'ID
    );
  }
// Méthode qui permet d'ajouter la boxe au panier.
  addToCart(box: SushiBox | undefined) {
    if (box) this.cartService.add(box);
  }
}

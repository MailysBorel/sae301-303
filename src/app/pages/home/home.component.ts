import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../components/header/header.component';
import { SushiCardComponent } from '../../components/sushi-card/sushi-card.component';
import { SushiService } from '../../core/services/sushi.service';
import { SushiBox } from '../../shared/models/sushi-box.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, HeaderComponent, SushiCardComponent],
  template: `
    <app-header></app-header>
    
    <main>
      <!-- Hero Section : Bannière principale avec le texte accrocheur -->
      <section class="hero">
        <div class="container hero-content">
        <img src="assets/images/logo_blanc.png" alt="Mokéa"  style="width: 400px; margin-bottom: 20px;">
        </div>
      </section>

      <!-- Section de filtres (pour l'instant décorative via HTML/CSS) -->
      <section class="categories container">
        <ul class="category-list">
            <li class="active">Boxes</li>
        </ul>
      </section>

      <!-- Grille de produits : Affiche la liste des boîtes récupérées via le service -->
      <section class="products container">
        <div class="product-grid">
          <!-- La boucle *ngFor parcourt le résultat 'async' (asynchrone) de l'observable 'boxes$' -->
          <app-sushi-card *ngFor="let box of boxes$ | async" [box]="box"></app-sushi-card>
        </div>
      </section>
    </main>
  `,
  styles: [`
    .hero {
      background-color: #f4f4f4; /* Placeholder for Hero Image */
      height: 300px;
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
      margin-bottom: 40px;
      background-size: cover;
      background-position: center;
      position: relative;
    }

    .hero::after {
        content: '';
        position: absolute;
        inset: 0;
        background: rgba(0,0,0,0.3);
    }

    .hero-content {
        position: relative;
        z-index: 1;
        color: var(--color-white);
    }

    .hero h1 {
        font-size: 3rem;
        font-weight: 700;
        text-transform: uppercase;
        margin-bottom: 16px;
    }

    .categories {
        margin-bottom: 32px;
        overflow-x: auto;
    }

    .category-list {
        display: flex;
        gap: 16px;
        padding-bottom: 8px;
    }

    .category-list li {
        cursor: pointer;
        padding: 8px 16px;
        border-radius: 20px;
        background-color: transparent;
        border: 1px solid #ddd;
        font-weight: 500;
        white-space: nowrap;
        transition: all 0.2s;
    }

    .category-list li.active, .category-list li:hover {
        background-color: var(--color-black);
        color: var(--color-white);
        border-color: var(--color-black);
    }

    .product-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: var(--grid-gap);
      padding-bottom: 60px;
    }
  `]
})
export class HomeComponent implements OnInit {
  // Observable qui contiendra la liste des boîtes de sushis
  // Le suffixe '$' est une convention pour dire "ceci est un flux de données" (Stream)
  boxes$!: Observable<SushiBox[]>;

  constructor(private sushiService: SushiService) { }

  ngOnInit() {
    // Au chargement de la page, on demande au service de nous fournir les boîtes (API ou Mock)
    this.boxes$ = this.sushiService.getBoxes();
  }
}

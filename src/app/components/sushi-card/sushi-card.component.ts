import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SushiBox } from '../../shared/models/sushi-box.model';
import { CartService } from '../../core/services/cart.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sushi-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sushi-card.component.html',
  styleUrl: './sushi-card.component.css'
})
export class SushiCardComponent {
  @Input() box!: SushiBox; // Propriété d'entrée pour recevoir les données de la box de sushi

  constructor(private cartService: CartService, private router: Router) { }

  onAdd(event: Event) { // Méthode pour ajouter la boxe dans le panier
    event.stopPropagation();
    this.cartService.add(this.box); // Appel du service de panier pour ajouter la boxe dedans
  }

  // Méthode pour ouvrir la page du produit
  openProduct() {
    if (this.box && this.box.id) { // Vérifie si la boxe et son ID existent
      this.router.navigate(['/product', this.box.id]); // Navigation vers la page du produit en utilisant l'ID de la boxe
    }
  }
}

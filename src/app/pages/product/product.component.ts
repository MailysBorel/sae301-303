import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { SushiService } from '../../core/services/sushi.service';
import { SushiBox } from '../../shared/models/sushi-box.model';
import { Observable, of } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';
import { CartService } from '../../core/services/cart.service';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product.component.html',
  styleUrl: './product.component.css'
}) //
export class ProductComponent implements OnInit {
  box$!: Observable<SushiBox | undefined>;// Observable pour la boîte de sushi affichée

  constructor(
    private route: ActivatedRoute, // Pour accéder aux paramètres du routage
    private sushiService: SushiService, // Service pour récupérer les données des sushis
    private cartService: CartService // Service pour gérer le panier
  ) { }
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

import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SushiBox } from '../../shared/models/sushi-box.model';
import { CartService } from '../../core/services/cart.service';

@Component({
  selector: 'app-sushi-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="card" *ngIf="box">
      <div class="card-image-wrapper">
        <img [src]="box.image" [alt]="box.name" class="card-image" (error)="box.image = 'assets/images/logo_blanc.png'">
        <span class="card-badge" *ngIf="box.pieces > 20">BEST SELLER</span>
      </div>
      <div class="card-content">
        <div class="card-info">
            <h3 class="card-title">{{ box.name }}</h3>
            <p class="card-pieces">{{ box.pieces }} pièces</p>
        </div>
        <div class="card-footer">
          <span class="card-price">{{ box.price | currency:'EUR':'symbol':'1.2-2' }}</span>
          <button class="add-btn" (click)="onAdd($event)">
            +
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .card {
      background-color: var(--color-white);
      transition: transform 0.3s ease, box-shadow 0.3s ease;
      cursor: pointer;
      display: flex;
      flex-direction: column;
      height: 100%;
    }

    .card:hover {
      transform: translateY(-4px);
    }

    .card-image-wrapper {
      position: relative;
      background-color: #f4f4f4; /* Light gray background for image */
      padding: 20px;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 200px;
    }

    .card-image {
      max-width: 100%;
      max-height: 100%;
      object-fit: contain;
      transition: transform 0.3s ease;
    }

    .card:hover .card-image {
      transform: scale(1.05);
    }

    .card-badge {
      position: absolute;
      top: 10px;
      left: 10px;
      background-color: var(--color-black);
      color: var(--color-white);
      font-size: 0.625rem;
      padding: 4px 8px;
      text-transform: uppercase;
      font-weight: 700;
      letter-spacing: 0.05em;
    }

    .card-content {
      padding: 16px;
      display: flex;
      flex-direction: column;
      flex-grow: 1;
      justify-content: space-between;
    }

    .card-title {
      font-size: 1.125rem;
      font-weight: 600;
      margin-bottom: 4px;
      text-transform: uppercase;
    }

    .card-pieces {
      font-size: 0.875rem;
      color: var(--color-text-muted);
      margin-bottom: 16px;
    }

    .card-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: auto;
    }

    .card-price {
      font-weight: 600;
      font-size: 1rem;
    }

    .add-btn {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background-color: var(--color-black);
      color: var(--color-white);
      font-size: 1.25rem;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background-color 0.2s;
    }

    .add-btn:hover {
      background-color: var(--color-gold);
    }
  `]
})
export class SushiCardComponent {
  @Input() box!: SushiBox;

  constructor(private cartService: CartService) { }

  onAdd(event: Event) {
    event.stopPropagation(); 
    this.cartService.add(this.box);
  }
}

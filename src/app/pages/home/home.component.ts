import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SushiCardComponent } from '../../components/sushi-card/sushi-card.component';
import { SushiService } from '../../core/services/sushi.service';
import { SushiBox } from '../../shared/models/sushi-box.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, SushiCardComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  // Observable qui contiendra la liste des boîtes de sushis
  boxes$!: Observable<SushiBox[]>;

  constructor(private sushiService: SushiService) { }

  ngOnInit() {
    // Au chargement de la page, on demande au service de nous fournir les boîtes (API)
    this.boxes$ = this.sushiService.getBoxes();
  }
}

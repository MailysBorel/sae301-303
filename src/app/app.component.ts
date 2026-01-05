import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent} from './components/header/header.component';
// Composant racine du site 
@Component({
    selector: 'app-root', // Sélecteur du composant
    standalone: true,
    imports: [RouterOutlet,HeaderComponent], // Importation du RouterOutlet pour la navigation
    templateUrl: './app.component.html',
    styleUrl: './app.component.css'
})
export class AppComponent {
    title = 'mokea';// Titre de l'application
}

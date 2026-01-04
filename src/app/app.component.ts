import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

// Composant racine du site 
@Component({
    selector: 'app-root', // Sélecteur du composant
    standalone: true, 
    imports: [RouterOutlet], // Importation du RouterOutlet pour la navigation
    template: `<router-outlet></router-outlet>` // Template utilisant le RouterOutlet   
})
export class AppComponent { 
    title = 'mokea';// Titre de l'application
}

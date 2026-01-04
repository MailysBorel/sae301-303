import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';

import { routes } from './app.routes'; 

// Importation des routes définies pour le site
export const appConfig: ApplicationConfig = { // Configuration du site
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), // Optimisation de la détection des changements
    provideRouter(routes), // Fournir les routes pour la navigation
    provideHttpClient() // Fournir le client HTTP pour les requêtes API
  ]
};

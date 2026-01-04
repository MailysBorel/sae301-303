import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';

describe('AppComponent', () => { // Tests unitaires pour le composant racine de l'application
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent], // Importation du composant à tester
    }).compileComponents(); // Compilation 
  });

  it('devrait créer l\'application', () => { // Test pour vérifier la création du composant
    const fixture = TestBed.createComponent(AppComponent); // Création de l'instance
    const app = fixture.componentInstance; // Récupération de l'instance
    expect(app).toBeTruthy(); // Vérification que l'instance est créée avec succès
  });
// Test pour vérifier le titre de l'application
  it('devrait avoir le titre correct', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toBe('mokea');
  });
});

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { HeaderComponent } from '../../components/header/header.component';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterLink, HeaderComponent],
    template: `
    //html de la Page de connexion

    <app-header></app-header>
    <div class="auth-container">
      <div class="auth-card">
        <h2>Connexion</h2>
        <p class="subtitle">Heureux de vous revoir !</p>

        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label for="email">Email</label>
            <input 
              type="email" 
              id="email" 
              formControlName="email" 
              placeholder="votre@email.com"
              [class.error]="isFieldInvalid('email')">
            <div class="error-msg" *ngIf="isFieldInvalid('email')">
              Email valide requis.
            </div>
          </div>

          <div class="form-group">
            <label for="password">Mot de passe</label>
            <input 
              type="password" 
              id="password" 
              formControlName="password" 
              placeholder="••••••••"
              [class.error]="isFieldInvalid('password')">
             <div class="error-msg" *ngIf="isFieldInvalid('password')">
              Mot de passe requis (min 6 caractères).
            </div>
          </div>

          <button type="submit" class="btn btn-primary full-width" [disabled]="loginForm.invalid || isLoading">
            {{ isLoading ? 'Connexion...' : 'SE CONNECTER' }}
          </button>
        </form>

        <div class="auth-footer">
          <p>Pas encore de compte ? <a routerLink="/register">Créer un compte</a></p>
        </div>
      </div>
    </div>
  `,
    styles: [`
    .auth-container {
      min-height: calc(100vh - 80px); /* Minus header */
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: #f9f9f9;
      padding: 20px;
    }

    .auth-card {
      background: white;
      padding: 48px;
      border-radius: 8px; /* Sharp or slightly rounded */
      box-shadow: 0 4px 20px rgba(0,0,0,0.05);
      width: 100%;
      max-width: 450px;
    }

    h2 {
      font-size: 2rem;
      font-weight: 700;
      margin-bottom: 8px;
      text-align: center;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .subtitle {
      text-align: center;
      color: var(--color-text-muted);
      margin-bottom: 32px;
    }

    .form-group {
      margin-bottom: 24px;
    }

    label {
      display: block;
      font-weight: 600;
      margin-bottom: 8px;
      font-size: 0.875rem;
      text-transform: uppercase;
    }

    input {
      width: 100%;
      padding: 16px;
      background-color: #f4f4f4;
      border: 1px solid transparent;
      border-radius: 4px;
      font-family: inherit;
      font-size: 1rem;
      transition: all 0.3s;
    }

    input:focus {
      outline: none;
      background-color: white;
      border-color: var(--color-black);
    }

    input.error {
      border-color: #dc3545;
      background-color: #fff8f8;
    }

    .error-msg {
      color: #dc3545;
      font-size: 0.75rem;
      margin-top: 4px;
    }

    .full-width {
      width: 100%;
      padding: 16px;
      font-size: 1rem;
      margin-top: 16px;
    }

    .auth-footer {
      margin-top: 24px;
      text-align: center;
      font-size: 0.875rem;
      color: var(--color-text-muted);
    }

    .auth-footer a {
      color: var(--color-black);
      font-weight: 600;
      text-decoration: underline;
    }
  `]
})
export class LoginComponent {
    loginForm: FormGroup; // Formulaire de connexion
    isLoading = false; // Indicateur de chargement

    constructor(
        private fb: FormBuilder, // FormBuilder pour créer le formulaire
        private authService: AuthService, // Service d'authentification
        private router: Router 
    ) { //navigation
        this.loginForm = this.fb.group({ 
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.minLength(6)]]
        });
    }
// Méthode pour vérifier si un champ du formulaire est invalide
    isFieldInvalid(field: string): boolean {
        const control = this.loginForm.get(field);
        return !!(control && control.invalid && (control.dirty || control.touched));
    }
// Méthode au moment de la soumission du formulaire
    onSubmit() {
        if (this.loginForm.valid) {
            this.isLoading = true;
            const { email, password } = this.loginForm.value;
// Appel du service d'authentification pour se connecter
            this.authService.login(email, password).subscribe({
                next: () => {
                    this.router.navigate(['/']); // Rediriger vers la page d'accueil après connexion réussie
                },
                error: (err) => {
                    console.error(err);
                    this.isLoading = false; // Réinitialiser l'indicateur de chargement en cas d'erreur
                    
                }
            });
        }
    }
}

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { HeaderComponent } from '../../components/header/header.component';

@Component({
    selector: 'app-register',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterLink, HeaderComponent],
    template: `
    <app-header></app-header>
    <div class="auth-container">
      <div class="auth-card">
        <h2>Créer un compte</h2>
        <p class="subtitle">Rejoignez la communauté Mokéa</p>

        <form [formGroup]="registerForm" (ngSubmit)="onSubmit()">
          
          <div class="row">
            <div class="form-group half">
                <label for="firstname">Prénom</label>
                <input type="text" id="firstname" formControlName="firstname" placeholder="John">
            </div>
            <div class="form-group half">
                <label for="lastname">Nom</label>
                <input type="text" id="lastname" formControlName="lastname" placeholder="Doe">
            </div>
          </div>

          <div class="form-group">
            <label for="email">Email</label>
            <input 
              type="email" 
              id="email" 
              formControlName="email" 
              placeholder="votre@email.com"
              [class.error]="isFieldInvalid('email')">
          </div>

          <div class="form-group">
            <label for="password">Mot de passe</label>
            <input 
              type="password" 
              id="password" 
              formControlName="password" 
              placeholder="••••••••"
              [class.error]="isFieldInvalid('password')">
          </div>

          <div class="form-group">
             <label for="address">Adresse</label>
             <input type="text" id="address" formControlName="address" placeholder="123 Rue de la République">
          </div>

          <button type="submit" class="btn btn-primary full-width" [disabled]="registerForm.invalid || isLoading">
            {{ isLoading ? 'Inscription...' : 'CRÉER MON COMPTE' }}
          </button>
        </form>

        <div class="auth-footer">
          <p>Déjà un compte ? <a routerLink="/login">Se connecter</a></p>
        </div>
      </div>
    </div>
  `,
    styles: [`
    /* Reuse styles from LoginComponent via encapsulation or Global if preferred. 
      For now, repeating critical block for self-containment 
    */
    .auth-container {
      min-height: calc(100vh - 80px);
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: #f9f9f9;
      padding: 40px 20px;
    }

    .auth-card {
      background: white;
      padding: 48px;
      border-radius: 8px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.05);
      width: 100%;
      max-width: 500px;
    }

    h2 {
      font-size: 2rem;
      font-weight: 700;
      margin-bottom: 8px;
      text-align: center;
      text-transform: uppercase;
    }

    .subtitle {
      text-align: center;
      color: var(--color-text-muted);
      margin-bottom: 32px;
    }

    .form-group {
      margin-bottom: 24px;
    }

    .row {
        display: flex;
        gap: 16px;
    }
    
    .half {
        flex: 1;
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
    }

    input:focus {
      outline: none;
      background-color: white;
      border-color: var(--color-black);
    }
    
    input.error { border-color: #dc3545; background-color: #fff8f8; }

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
export class RegisterComponent {
    registerForm: FormGroup;
    isLoading = false;

    constructor(
        private fb: FormBuilder,
        private authService: AuthService,
        private router: Router
    ) {
        this.registerForm = this.fb.group({
            firstname: ['', Validators.required],
            lastname: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.minLength(6)]],
            address: ['', Validators.required]
        });
    }

    isFieldInvalid(field: string): boolean {
        const control = this.registerForm.get(field);
        return !!(control && control.invalid && (control.dirty || control.touched));
    }

    onSubmit() {
        if (this.registerForm.valid) {
            this.isLoading = true;
            this.authService.register(this.registerForm.value).subscribe({
                next: () => {
                    this.router.navigate(['/']);
                },
                error: (err) => {
                    console.error(err);
                    this.isLoading = false;
                }
            });
        }
    }
}

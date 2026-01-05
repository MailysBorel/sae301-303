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
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
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

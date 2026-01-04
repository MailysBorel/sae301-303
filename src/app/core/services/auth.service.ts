import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';

// Interfaces pour les données utilisateur et la réponse d'authentification
export interface User {
    id: number;
    email: string;
    firstname: string;
    lastname: string;
    address?: string;
}
// Réponse attendue de l'API lors de la connexion ou de l'inscription
export interface AuthResponse {
    token: string;
    user: User;
}

@Injectable({ // Service injectable dans toute l'application
    providedIn: 'root'
})
export class AuthService { // Service d'authentification
    private apiUrl = 'http://127.0.0.1/sae301/api/auth';

    private currentUserSubject = new BehaviorSubject<User | null>(null); //stocker l'utilisateur courant
    public currentUser$ = this.currentUserSubject.asObservable(); // observable utilisateur courant

// Constructeur du service
    constructor(private http: HttpClient, private router: Router) { // Charger l'utilisateur depuis le stockage local au démarrage
        this.loadUserFromStorage(); // Appel de la méthode
    }

    private loadUserFromStorage() { 
        const user = localStorage.getItem('currentUser'); 
        if (user) { // Si un utilisateur est trouvé dans le stockage local, le définir comme utilisateur courant
            this.currentUserSubject.next(JSON.parse(user)); 
        }
    }

// Méthode de connexion
    login(email: string, password: string): Observable<AuthResponse> { // Appel de l'API pour la connexion
        return this.http.post<AuthResponse>(`${this.apiUrl}/login.php`, { email, password }) 
            .pipe(tap(response => this.handleAuth(response))); // Gérer la réponse d'authentification
    }

    register(data: any): Observable<AuthResponse> { // Appel de l'API pour l'inscription
        return this.http.post<AuthResponse>(`${this.apiUrl}/register.php`, data)
            .pipe(tap(response => this.handleAuth(response))); //pareil que pour la connexion
    }

// Méthode de déconnexion
    logout() {
        localStorage.removeItem('token');  // Supprimer le token et l'utilisateur du stockage local
        localStorage.removeItem('currentUser'); // Supprimer le token et l'utilisateur du stockage local
        this.currentUserSubject.next(null); // Réinitialiser l'utilisateur courant
        this.router.navigate(['/login']); // Rediriger vers la page de connexion
    }

    private handleAuth(response: AuthResponse) { 
        localStorage.setItem('token', response.token); // Stocker le token et l'utilisateur dans le stockage local
        localStorage.setItem('currentUser', JSON.stringify(response.user)); 
        this.currentUserSubject.next(response.user); // Mettre à jour l'utilisateur courant
    }

// Vérifier si l'utilisateur est connecté
    get isLoggedIn(): boolean { // Retourne true si un utilisateur est connecté
        return !!this.currentUserSubject.value; 
    } 
}

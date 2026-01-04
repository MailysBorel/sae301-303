import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';

export interface User {
    id: number;
    email: string;
    firstname: string;
    lastname: string;
    address?: string;
}

export interface AuthResponse {
    token: string;
    user: User;
}

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    // API URL pointing to the local PHP server
    private apiUrl = 'http://127.0.0.1/sae301/api/auth';

    private currentUserSubject = new BehaviorSubject<User | null>(null);
    public currentUser$ = this.currentUserSubject.asObservable();

    constructor(private http: HttpClient, private router: Router) {
        this.loadUserFromStorage();
    }

    private loadUserFromStorage() {
        const user = localStorage.getItem('currentUser');
        if (user) {
            this.currentUserSubject.next(JSON.parse(user));
        }
    }

    login(email: string, password: string): Observable<AuthResponse> {
        return this.http.post<AuthResponse>(`${this.apiUrl}/login.php`, { email, password })
            .pipe(tap(response => this.handleAuth(response)));
    }

    register(data: any): Observable<AuthResponse> {
        return this.http.post<AuthResponse>(`${this.apiUrl}/register.php`, data)
            .pipe(tap(response => this.handleAuth(response)));
    }

    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('currentUser');
        this.currentUserSubject.next(null);
        this.router.navigate(['/login']);
    }

    private handleAuth(response: AuthResponse) {
        localStorage.setItem('token', response.token);
        localStorage.setItem('currentUser', JSON.stringify(response.user));
        this.currentUserSubject.next(response.user);
    }

    get isLoggedIn(): boolean {
        return !!this.currentUserSubject.value;
    }
}

import { Injectable, signal, inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { CreateUserDto, LoginDto, AuthResponse, User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:5053/api';
  private currentUserSignal = signal<User | null>(null);
  
  private platformId = inject(PLATFORM_ID);
  
  currentUser = this.currentUserSignal.asReadonly();

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    if (isPlatformBrowser(this.platformId)) {
      this.loadUserFromStorage();
    }
  }

  register(userData: CreateUserDto): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/usuarios/registro`, userData)
      .pipe(
        tap(response => {
          this.handleAuthSuccess(response);
          this.router.navigate(['/admin/dashboard']);
        })
      );
  }

  login(credentials: LoginDto): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/login`, credentials)
      .pipe(
        tap(response => {
          this.handleAuthSuccess(response);
          this.router.navigate(['/admin/dashboard']);
        })
      );
  }

  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    this.currentUserSignal.set(null);
    this.router.navigate(['/auth/login']);
  }

  isAuthenticated(): boolean {
    if (isPlatformBrowser(this.platformId)) {
      return !!localStorage.getItem('token');
    }
    return false; 
  }

  getToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('token');
    }
    return null;
  }


  getUser(): User | null {
    return this.currentUserSignal();
  }


  getUserRole(): string | null {
    const user = this.getUser();
    return user?.rol || null;
  }

  
  getUserId(): string | null {
    const user = this.getUser();
    return user?.id ?? null;
  }

 
  getUserName(): string | null {
    const user = this.getUser();
    return user?.nombre ?? null;
  }

  
  getUserApellido(): string | null {
    const user = this.getUser();
    return user?.apellido ?? null;
  }

  
  getUserFullName(): string {
    const user = this.getUser();
    if (!user) return 'Usuario';
    return `${user.nombre} ${user.apellido}`.trim();
  }

  
  getUserEmail(): string | null {
    const user = this.getUser();
    return user?.email || null;
  }

  
  hasRole(role: string): boolean {
    const userRole = this.getUserRole();
    return userRole?.toLowerCase() === role.toLowerCase();
  }

  private handleAuthSuccess(response: AuthResponse): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
    }
    this.currentUserSignal.set(response.user);
  }

  private loadUserFromStorage(): void {
    if (isPlatformBrowser(this.platformId)) {
      try {
        const userStr = localStorage.getItem('user');
        
        if (userStr && userStr !== 'undefined' && userStr !== 'null') {
          const user = JSON.parse(userStr);
          this.currentUserSignal.set(user);
          console.log('Usuario cargado desde storage:', user);
        }
      } catch (error) {
        console.error('Error loading user from storage:', error);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    }
  }
}
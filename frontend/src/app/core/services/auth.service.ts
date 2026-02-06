import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthResponse, LoginRequest, RegisterRequest, MessageResponse, User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;
  private readonly TOKEN_KEY = 'accessToken';
  private readonly REFRESH_TOKEN_KEY = 'refreshToken';
  private readonly USER_KEY = 'user';

  currentUser = signal<User | null>(this.getUserFromStorage());
  isAuthenticated = signal<boolean>(!!this.getToken());

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => this.handleAuthResponse(response))
    );
  }

  register(userData: RegisterRequest): Observable<MessageResponse> {
    return this.http.post<MessageResponse>(`${this.apiUrl}/register`, userData);
  }

  logout(): Observable<MessageResponse> {
    return this.http.post<MessageResponse>(`${this.apiUrl}/logout`, {}).pipe(
      tap(() => this.handleLogout())
    );
  }

  refreshToken(): Observable<AuthResponse> {
    const refreshToken = this.getRefreshToken();
    return this.http.post<AuthResponse>(`${this.apiUrl}/refresh`, { refreshToken }).pipe(
      tap(response => this.handleAuthResponse(response))
    );
  }

  getCurrentUser(): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/me`).pipe(
      tap(user => {
        this.currentUser.set(user);
        this.saveUserToStorage(user);
      })
    );
  }

  private handleAuthResponse(response: AuthResponse): void {
    this.saveToken(response.accessToken);
    this.saveRefreshToken(response.refreshToken);
    
    const user: User = {
      id: response.id,
      username: response.username,
      email: response.email
    };
    
    this.currentUser.set(user);
    this.isAuthenticated.set(true);
    this.saveUserToStorage(user);
  }

  private handleLogout(): void {
    this.clearStorage();
    this.currentUser.set(null);
    this.isAuthenticated.set(false);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  private saveToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  private saveRefreshToken(token: string): void {
    localStorage.setItem(this.REFRESH_TOKEN_KEY, token);
  }

  private saveUserToStorage(user: User): void {
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }

  private getUserFromStorage(): User | null {
    const userStr = localStorage.getItem(this.USER_KEY);
    return userStr ? JSON.parse(userStr) : null;
  }

  private clearStorage(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
  }
}

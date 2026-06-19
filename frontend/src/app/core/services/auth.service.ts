import { Injectable, inject, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from './api.service';
import type { LoginRequest, RegisterRequest } from '../models/auth';
import { tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private api = inject(ApiService);
  private router = inject(Router);

  private tokenSignal = signal<string | null>(localStorage.getItem('token'));
  private refreshTokenSignal = signal<string | null>(localStorage.getItem('refreshToken'));
  private emailSignal = signal<string | null>(localStorage.getItem('email'));
  private ganaderoIdSignal = signal<string | null>(localStorage.getItem('ganaderoId'));

  token = this.tokenSignal.asReadonly();
  refreshToken = this.refreshTokenSignal.asReadonly();
  email = this.emailSignal.asReadonly();
  ganaderoId = this.ganaderoIdSignal.asReadonly();
  isAuthenticated = computed(() => this.tokenSignal() !== null);

  login(request: LoginRequest) {
    return this.api.login(request).pipe(
      tap((res) => this.setSession(res.token, res.refreshToken, res.email, res.ganaderoId)),
    );
  }

  register(request: RegisterRequest) {
    return this.api.register(request);
  }

  refresh() {
    const rt = this.refreshTokenSignal();
    if (!rt) throw new Error('No refresh token');

    return this.api.refresh({ refreshToken: rt }).pipe(
      tap((res) => this.setSession(res.token, res.refreshToken, res.email, res.ganaderoId)),
    );
  }

  logout() {
    const rt = this.refreshTokenSignal();
    if (rt) this.api.revoke({ refreshToken: rt }).subscribe({ error: () => {} });
    this.clearSession();
    this.router.navigate(['/login']);
  }

  private setSession(token: string, refreshToken: string, email: string, ganaderoId: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('email', email);
    localStorage.setItem('ganaderoId', ganaderoId);
    this.tokenSignal.set(token);
    this.refreshTokenSignal.set(refreshToken);
    this.emailSignal.set(email);
    this.ganaderoIdSignal.set(ganaderoId);
  }

  clearSession() {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('email');
    localStorage.removeItem('ganaderoId');
    this.tokenSignal.set(null);
    this.refreshTokenSignal.set(null);
    this.emailSignal.set(null);
    this.ganaderoIdSignal.set(null);
  }
}

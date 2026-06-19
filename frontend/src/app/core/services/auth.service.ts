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
  private emailSignal = signal<string | null>(localStorage.getItem('email'));
  private ganaderoIdSignal = signal<string | null>(localStorage.getItem('ganaderoId'));

  token = this.tokenSignal.asReadonly();
  email = this.emailSignal.asReadonly();
  ganaderoId = this.ganaderoIdSignal.asReadonly();
  isAuthenticated = computed(() => this.tokenSignal() !== null);

  login(request: LoginRequest) {
    return this.api.login(request).pipe(
      tap((res) => {
        localStorage.setItem('token', res.token);
        localStorage.setItem('email', res.email);
        localStorage.setItem('ganaderoId', res.ganaderoId);
        this.tokenSignal.set(res.token);
        this.emailSignal.set(res.email);
        this.ganaderoIdSignal.set(res.ganaderoId);
      }),
    );
  }

  register(request: RegisterRequest) {
    return this.api.register(request);
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    localStorage.removeItem('ganaderoId');
    this.tokenSignal.set(null);
    this.emailSignal.set(null);
    this.ganaderoIdSignal.set(null);
    this.router.navigate(['/login']);
  }
}

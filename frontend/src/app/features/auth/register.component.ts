import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  template: `
    <div class="page">
      <div class="card">
        <h1>Registrarse</h1>

        <form [formGroup]="form" (ngSubmit)="onSubmit()">
          <div class="field">
            <label for="nombre">Nombre / Razón Social</label>
            <input id="nombre" type="text" formControlName="nombreRazonSocial" />
          </div>

          <div class="field">
            <label for="nif">NIF</label>
            <input id="nif" type="text" formControlName="nif" />
          </div>

          <div class="field">
            <label for="rega">REGA</label>
            <input id="rega" type="text" formControlName="rega" />
          </div>

          <div class="field">
            <label for="email">Email</label>
            <input id="email" type="email" formControlName="email" autocomplete="email" />
          </div>

          <div class="field">
            <label for="password">Contraseña</label>
            <input id="password" type="password" formControlName="password" autocomplete="new-password" />
          </div>

          @if (error) {
            <div class="error">{{ error }}</div>
          }

          <button type="submit" [disabled]="form.invalid || loading">
            {{ loading ? 'Registrando...' : 'Crear cuenta' }}
          </button>
        </form>

        <p class="link">
          ¿Ya tienes cuenta? <a routerLink="/login">Inicia sesión</a>
        </p>
      </div>
    </div>
  `,
  styles: [`
    .page { display: flex; justify-content: center; align-items: center; min-height: 100vh; padding: 1rem; }
    .card { background: white; padding: 2rem; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); width: 100%; max-width: 400px; }
    h1 { margin-bottom: 1.5rem; font-size: 1.5rem; }
    .field { margin-bottom: 1rem; }
    label { display: block; margin-bottom: 0.25rem; font-weight: 500; font-size: 0.875rem; }
    input { width: 100%; padding: 0.5rem; border: 1px solid #ccc; border-radius: 4px; font-size: 1rem; }
    button { width: 100%; padding: 0.75rem; background: #2563eb; color: white; border: none; border-radius: 4px; font-size: 1rem; cursor: pointer; }
    button:disabled { opacity: 0.6; cursor: not-allowed; }
    .error { color: #dc2626; font-size: 0.875rem; margin-bottom: 0.5rem; }
    .link { margin-top: 1rem; text-align: center; font-size: 0.875rem; }
    a { color: #2563eb; text-decoration: none; }
    @media (max-width: 480px) {
      .card { padding: 1.5rem; margin: 0.5rem; }
      h1 { font-size: 1.25rem; }
    }
  `],
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);

  form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    nombreRazonSocial: ['', Validators.required],
    nif: ['', Validators.required],
    rega: ['', Validators.required],
  });

  loading = false;
  error = '';

  onSubmit() {
    if (this.form.invalid) return;
    this.loading = true;
    this.error = '';

    this.auth.register(this.form.getRawValue()).subscribe({
      next: () => this.router.navigate(['/login'], { queryParams: { registered: 'true' } }),
      error: () => {
        this.error = 'Error al registrarse. Comprueba los datos e inténtalo de nuevo.';
        this.loading = false;
      },
    });
  }
}

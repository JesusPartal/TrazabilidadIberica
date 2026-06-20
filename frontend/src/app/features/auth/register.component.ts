import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, RouterLink],
  template: `
    <div class="page">
      <div class="card">
        <div class="card-header">
          <span class="crotal" aria-hidden="true"></span>
          <h1>Crear Cuenta</h1>
        </div>

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
    .page {
      display: flex; justify-content: center; align-items: center;
      min-height: 100vh; padding: 1rem;
      background: linear-gradient(135deg, var(--color-leather) 0%, var(--color-leather-dark) 100%);
    }
    .card {
      background: var(--color-surface); padding: 2.5rem 2rem 2rem;
      border-radius: 12px; box-shadow: 0 4px 24px rgba(0,0,0,0.08);
      width: 100%; max-width: 400px;
    }
    .card-header { display: flex; align-items: center; gap: 0.6rem; margin-bottom: 2rem; }
    .crotal {
      display: inline-block; width: 22px; height: 28px; border-radius: 4px;
      background: linear-gradient(135deg, var(--color-straw-light), var(--color-straw));
      border: 1px solid rgba(0,0,0,0.12);
      position: relative; flex-shrink: 0;
    }
    .crotal::after {
      content: ''; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
      width: 9px; height: 9px; border-radius: 50%;
      background: radial-gradient(circle, var(--color-earth-dark) 30%, transparent 70%);
    }
    h1 { font-family: var(--font-display); font-weight: 400; font-size: 1.4rem; color: var(--color-earth-dark); margin: 0; }
    .field { margin-bottom: 1rem; }
    label { display: block; margin-bottom: 0.3rem; font-weight: 500; font-size: 0.85rem; color: var(--color-cordovan); }
    input {
      width: 100%; padding: 0.6rem 0.75rem;
      border: 1px solid var(--color-leather-dark); border-radius: 6px;
      font-size: 1rem; font-family: var(--font-body);
      transition: border-color 0.15s, box-shadow 0.15s;
    }
    input:focus { outline: none; border-color: var(--color-primary); box-shadow: 0 0 0 3px rgba(var(--color-primary-rgb), 0.15); }
    button {
      width: 100%; padding: 0.75rem;
      background: var(--color-primary); color: white;
      border: none; border-radius: 6px; font-size: 1rem;
      font-family: var(--font-body); font-weight: 500;
      cursor: pointer; transition: background 0.15s;
    }
    button:hover:not(:disabled) { background: var(--color-primary-hover); }
    button:disabled { opacity: 0.6; cursor: not-allowed; }
    .error { color: var(--color-error); font-size: 0.875rem; margin-bottom: 0.75rem; padding: 0.5rem 0.75rem; background: var(--color-error-bg); border-radius: 4px; }
    .link { margin-top: 1.25rem; text-align: center; font-size: 0.875rem; color: var(--color-text-muted); }
    a { color: var(--color-primary); text-decoration: none; font-weight: 500; }
    a:hover { text-decoration: underline; }
    @media (max-width: 480px) {
      .card { padding: 1.5rem; margin: 0.5rem; }
      h1 { font-size: 1.2rem; }
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

import { Component, inject, OnInit, signal } from '@angular/core';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';
import { OfflineDataService } from '../../core/services/offline-data.service';

@Component({
  selector: 'app-ganadero-form',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule],
  template: `
    <div class="page">
      <header>
        <a routerLink="/ganaderos" class="back">←</a>
        <h1>{{ isEdit() ? 'Editar' : 'Nuevo' }} Ganadero</h1>
      </header>

      @if (error()) {
        <div class="error">{{ error() }}</div>
      }

      <form [formGroup]="form" (ngSubmit)="submit()" class="form">
        <label>
          Nombre / Razón Social *
          <input type="text" formControlName="nombreRazonSocial" />
          @if (nombreRazonSocial?.invalid && nombreRazonSocial?.touched) {
            <small class="field-error">Requerido</small>
          }
        </label>

        <label>
          NIF *
          <input type="text" formControlName="nif" />
          @if (nif?.invalid && nif?.touched) {
            <small class="field-error">Requerido</small>
          }
        </label>

        <label>
          REGA *
          <input type="text" formControlName="rega" />
          @if (rega?.invalid && rega?.touched) {
            <small class="field-error">Requerido</small>
          }
        </label>

        <label>
          Teléfono
          <input type="text" formControlName="telefono" />
        </label>

        <label>
          Email
          <input type="email" formControlName="email" />
        </label>

        <label>
          Dirección Completa
          <input type="text" formControlName="direccionCompleta" />
        </label>

        <div class="form-actions">
          <a routerLink="/ganaderos" class="btn-cancel">Cancelar</a>
          <button type="submit" class="btn-primary" [disabled]="form.invalid || saving()">
            {{ saving() ? 'Guardando...' : 'Guardar' }}
          </button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .page { max-width: 600px; margin: 0 auto; padding: 1rem; }
    header { display: flex; align-items: center; gap: 0.75rem; margin-bottom: 1.5rem; }
    header h1 { font-size: 1.25rem; }
    .back { text-decoration: none; color: #2563eb; font-size: 1.25rem; }
    .error { color: #dc2626; padding: 0.75rem; background: #fee; border-radius: 6px; margin-bottom: 1rem; font-size: 0.875rem; }
    .form { display: flex; flex-direction: column; gap: 1rem; }
    label { display: flex; flex-direction: column; gap: 0.25rem; font-size: 0.875rem; font-weight: 500; }
    input, select { padding: 0.5rem; border: 1px solid #ccc; border-radius: 6px; font-size: 0.875rem; }
    .field-error { color: #dc2626; font-weight: 400; }
    .form-actions { display: flex; gap: 0.75rem; justify-content: flex-end; margin-top: 1rem; }
    .btn-primary { background: #2563eb; color: white; padding: 0.5rem 1.5rem; border: none; border-radius: 6px; cursor: pointer; font-size: 0.875rem; }
    .btn-primary:disabled { opacity: 0.5; cursor: default; }
    .btn-cancel { background: none; border: 1px solid #ccc; padding: 0.5rem 1.5rem; border-radius: 6px; text-decoration: none; color: inherit; font-size: 0.875rem; text-align: center; }
  `],
})
export class GanaderoFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private api = inject(ApiService);
  private offline = inject(OfflineDataService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  isEdit = signal(false);
  saving = signal(false);
  error = signal<string | null>(null);

  form = this.fb.group({
    nombreRazonSocial: ['', Validators.required],
    nif: ['', Validators.required],
    rega: ['', Validators.required],
    telefono: [''],
    email: [''],
    direccionCompleta: [''],
  });

  get nombreRazonSocial() { return this.form.get('nombreRazonSocial'); }
  get nif() { return this.form.get('nif'); }
  get rega() { return this.form.get('rega'); }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit.set(true);
      this.api.getGanadero(id).subscribe({
        next: (g) => this.form.patchValue(g),
        error: () => this.error.set('Error al cargar ganadero'),
      });
    }
  }

  async submit() {
    if (this.form.invalid) return;
    this.saving.set(true);
    this.error.set(null);

    const id = this.route.snapshot.paramMap.get('id');
    const raw = this.form.value;
    const data = {
      nombreRazonSocial: raw.nombreRazonSocial ?? '',
      nif: raw.nif ?? '',
      rega: raw.rega ?? '',
      telefono: raw.telefono || null,
      email: raw.email || null,
      direccionCompleta: raw.direccionCompleta || null,
    } as any;

    try {
      await this.offline.save('ganadero', 'ganaderos', 'ganadero', data, id, id
        ? this.api.updateGanadero(id, data)
        : this.api.createGanadero(data));
      this.router.navigate(['/ganaderos']);
    } catch {
      this.error.set('Error al guardar');
      this.saving.set(false);
    }
  }
}

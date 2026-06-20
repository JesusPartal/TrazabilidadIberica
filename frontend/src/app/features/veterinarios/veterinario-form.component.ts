import { Component, inject, OnInit, signal } from '@angular/core';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';
import { OfflineDataService } from '../../core/services/offline-data.service';

@Component({
  selector: 'app-veterinario-form',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule],
  template: `
    <div class="page">
      <header>
        <a routerLink="/veterinarios" class="back">←</a>
        <h1>{{ isEdit() ? 'Editar' : 'Nuevo' }} Veterinario</h1>
      </header>

      @if (error()) {
        <div class="error">{{ error() }}</div>
      }

      <form [formGroup]="form" (ngSubmit)="submit()" class="form">
        <label>
          Nombre Completo *
          <input type="text" formControlName="nombreCompleto" />
          @if (nombreCompleto?.invalid && nombreCompleto?.touched) {
            <small class="field-error">Requerido</small>
          }
        </label>

        <label>
          Número Colegiado *
          <input type="text" formControlName="numeroColegiado" />
          @if (numeroColegiado?.invalid && numeroColegiado?.touched) {
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

        <div class="form-actions">
          <a routerLink="/veterinarios" class="btn-cancel">Cancelar</a>
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
export class VeterinarioFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private api = inject(ApiService);
  private offline = inject(OfflineDataService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  isEdit = signal(false);
  saving = signal(false);
  error = signal<string | null>(null);

  form = this.fb.group({
    nombreCompleto: ['', Validators.required],
    numeroColegiado: ['', Validators.required],
    telefono: [''],
    email: [''],
  });

  get nombreCompleto() { return this.form.get('nombreCompleto'); }
  get numeroColegiado() { return this.form.get('numeroColegiado'); }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit.set(true);
      this.api.getVeterinario(id).subscribe({
        next: (v) => this.form.patchValue(v),
        error: () => this.error.set('Error al cargar veterinario'),
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
      nombreCompleto: raw.nombreCompleto ?? '',
      numeroColegiado: raw.numeroColegiado ?? '',
      telefono: raw.telefono || null,
      email: raw.email || null,
    } as any;

    try {
      await this.offline.save('veterinario', 'veterinarios', 'veterinario', data, id, id
        ? this.api.updateVeterinario(id, data)
        : this.api.createVeterinario(data));
      this.router.navigate(['/veterinarios']);
    } catch {
      this.error.set('Error al guardar');
      this.saving.set(false);
    }
  }
}

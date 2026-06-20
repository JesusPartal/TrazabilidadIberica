import { Component, inject, OnInit, signal } from '@angular/core';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';
import { OfflineDataService } from '../../core/services/offline-data.service';
import { ActivityLogService } from '../../core/services/activity-log.service';

@Component({
  selector: 'app-finca-form',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule],
  template: `
    <div class="page">
      <header>
        <a routerLink="/farms" class="back">←</a>
        <h1>{{ isEdit() ? 'Editar' : 'Nueva' }} Finca</h1>
      </header>

      @if (error()) {
        <div class="error">{{ error() }}</div>
      }

      <form [formGroup]="form" (ngSubmit)="submit()" class="form">
        <label>
          Nombre *
          <input type="text" formControlName="nombre" />
          @if (nombre?.invalid && nombre?.touched) {
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
          Dirección
          <input type="text" formControlName="direccion" />
        </label>

        <label>
          Municipio
          <input type="text" formControlName="municipio" />
        </label>

        <label>
          Provincia
          <input type="text" formControlName="provincia" />
        </label>

        <label>
          Código Postal
          <input type="text" formControlName="codigoPostal" />
        </label>

        <div class="form-actions">
          <a routerLink="/farms" class="btn-cancel">Cancelar</a>
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
    input { padding: 0.5rem; border: 1px solid #ccc; border-radius: 6px; font-size: 0.875rem; }
    .field-error { color: #dc2626; font-weight: 400; }
    .form-actions { display: flex; gap: 0.75rem; justify-content: flex-end; margin-top: 1rem; }
    .btn-primary { background: #2563eb; color: white; padding: 0.5rem 1.5rem; border: none; border-radius: 6px; cursor: pointer; font-size: 0.875rem; }
    .btn-primary:disabled { opacity: 0.5; cursor: default; }
    .btn-cancel { background: none; border: 1px solid #ccc; padding: 0.5rem 1.5rem; border-radius: 6px; text-decoration: none; color: inherit; font-size: 0.875rem; text-align: center; }
    @media (max-width: 640px) {
      .form-actions { flex-direction: column; }
      .btn-primary, .btn-cancel { width: 100%; text-align: center; box-sizing: border-box; }
    }
  `],
})
export class FincaFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private api = inject(ApiService);
  private offline = inject(OfflineDataService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private log = inject(ActivityLogService);

  isEdit = signal(false);
  saving = signal(false);
  error = signal<string | null>(null);

  form = this.fb.group({
    nombre: ['', Validators.required],
    rega: ['', Validators.required],
    direccion: [''],
    municipio: [''],
    provincia: [''],
    codigoPostal: [''],
  });

  get nombre() { return this.form.get('nombre'); }
  get rega() { return this.form.get('rega'); }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit.set(true);
      this.api.getFinca(id).subscribe({
        next: (f) => this.form.patchValue(f),
        error: () => this.error.set('Error al cargar finca'),
      });
    }
  }

  async submit() {
    if (this.form.invalid) return;
    this.saving.set(true);
    this.error.set(null);

    const id = this.route.snapshot.paramMap.get('id');
    const data = this.form.value as any;

    try {
      const saved = await this.offline.save('finca', 'fincas', 'finca', data, id, id
        ? this.api.updateFinca(id, data)
        : this.api.createFinca(data));
      await this.log.log('Finca', saved.id, id ? 'Modificación' : 'Creación', `Nombre: ${data.nombre}`);
      this.router.navigate(['/farms']);
    } catch {
      this.error.set('Error al guardar');
      this.saving.set(false);
    }
  }
}

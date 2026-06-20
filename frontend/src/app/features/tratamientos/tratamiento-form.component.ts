import { Component, inject, OnInit, signal } from '@angular/core';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';
import { OfflineDataService } from '../../core/services/offline-data.service';
import type { Animal } from '../../core/models/animal';
import type { Veterinario } from '../../core/models/veterinario';
import type { PagedList } from '../../core/models/paged-list';

@Component({
  selector: 'app-tratamiento-form',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule],
  template: `
    <div class="page">
      <header>
        <a routerLink="/tratamientos" class="back">←</a>
        <h1>{{ isEdit() ? 'Editar' : 'Nuevo' }} Tratamiento</h1>
      </header>

      @if (error()) {
        <div class="error">{{ error() }}</div>
      }

      <form [formGroup]="form" (ngSubmit)="submit()" class="form">
        <label>
          Animal *
          <select formControlName="animalId">
            <option value="">Seleccionar...</option>
            @for (a of animales(); track a.id) {
              <option [value]="a.id">{{ a.numeroCrotal }}</option>
            }
          </select>
          @if (animalId?.invalid && animalId?.touched) {
            <small class="field-error">Requerido</small>
          }
        </label>

        <label>
          Veterinario *
          <select formControlName="veterinarioId">
            <option value="">Seleccionar...</option>
            @for (v of veterinarios(); track v.id) {
              <option [value]="v.id">{{ v.nombreCompleto }}</option>
            }
          </select>
          @if (veterinarioId?.invalid && veterinarioId?.touched) {
            <small class="field-error">Requerido</small>
          }
        </label>

        <label>
          Nombre del Medicamento *
          <input type="text" formControlName="nombreMedicamento" />
          @if (nombreMedicamento?.invalid && nombreMedicamento?.touched) {
            <small class="field-error">Requerido</small>
          }
        </label>

        <label>
          Nº de Lote
          <input type="text" formControlName="numeroLote" />
        </label>

        <label>
          Fecha de Administración *
          <input type="date" formControlName="fechaAdministracion" />
          @if (fechaAdministracion?.invalid && fechaAdministracion?.touched) {
            <small class="field-error">Requerido</small>
          }
        </label>

        <label>
          Fecha de Caducidad
          <input type="date" formControlName="fechaCaducidad" />
        </label>

        <label>
          Dosis Administrada *
          <input type="number" step="0.01" formControlName="dosisAdministrada" />
          @if (dosisAdministrada?.invalid && dosisAdministrada?.touched) {
            <small class="field-error">Requerido</small>
          }
        </label>

        <label>
          Unidad de Dosis
          <input type="text" formControlName="unidadDosis" />
        </label>

        <label>
          Vía de Administración
          <input type="text" formControlName="viaAdministracion" />
        </label>

        <label>
          Periodo de Supresión (días) *
          <input type="number" formControlName="periodoSupresionDias" />
          @if (periodoSupresionDias?.invalid && periodoSupresionDias?.touched) {
            <small class="field-error">Requerido</small>
          }
        </label>

        <label>
          Fecha Fin Supresión *
          <input type="date" formControlName="fechaFinSupresion" />
          @if (fechaFinSupresion?.invalid && fechaFinSupresion?.touched) {
            <small class="field-error">Requerido</small>
          }
        </label>

        <div class="form-actions">
          <a routerLink="/tratamientos" class="btn-cancel">Cancelar</a>
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
    @media (max-width: 640px) {
      .form-actions { flex-direction: column; }
      .btn-primary, .btn-cancel { width: 100%; text-align: center; box-sizing: border-box; }
    }
  `],
})
export class TratamientoFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private api = inject(ApiService);
  private offline = inject(OfflineDataService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  isEdit = signal(false);
  saving = signal(false);
  error = signal<string | null>(null);
  animales = signal<Animal[]>([]);
  veterinarios = signal<Veterinario[]>([]);

  form = this.fb.group({
    animalId: ['', Validators.required],
    veterinarioId: ['', Validators.required],
    nombreMedicamento: ['', Validators.required],
    numeroLote: [''],
    fechaAdministracion: ['', Validators.required],
    fechaCaducidad: [''],
    dosisAdministrada: [0, Validators.required],
    unidadDosis: [''],
    viaAdministracion: [''],
    periodoSupresionDias: [0, Validators.required],
    fechaFinSupresion: ['', Validators.required],
  });

  get animalId() { return this.form.get('animalId'); }
  get veterinarioId() { return this.form.get('veterinarioId'); }
  get nombreMedicamento() { return this.form.get('nombreMedicamento'); }
  get fechaAdministracion() { return this.form.get('fechaAdministracion'); }
  get dosisAdministrada() { return this.form.get('dosisAdministrada'); }
  get periodoSupresionDias() { return this.form.get('periodoSupresionDias'); }
  get fechaFinSupresion() { return this.form.get('fechaFinSupresion'); }

  ngOnInit() {
    this.api.getAnimals(1, 200).subscribe({
      next: (res: PagedList<Animal>) => this.animales.set(res.items),
      error: () => {},
    });

    this.api.getVeterinarios(1, 200).subscribe({
      next: (res: PagedList<Veterinario>) => this.veterinarios.set(res.items),
      error: () => {},
    });

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit.set(true);
      this.api.getTratamiento(id).subscribe({
        next: (t) => {
          this.form.patchValue({
            ...t,
            fechaAdministracion: t.fechaAdministracion.substring(0, 10),
            fechaCaducidad: t.fechaCaducidad?.substring(0, 10) ?? '',
            fechaFinSupresion: t.fechaFinSupresion.substring(0, 10),
          });
        },
        error: () => this.error.set('Error al cargar tratamiento'),
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
      animalId: raw.animalId ?? '',
      veterinarioId: raw.veterinarioId ?? '',
      nombreMedicamento: raw.nombreMedicamento ?? '',
      numeroLote: raw.numeroLote || null,
      fechaAdministracion: raw.fechaAdministracion ?? new Date().toISOString(),
      fechaCaducidad: raw.fechaCaducidad || null,
      dosisAdministrada: Number(raw.dosisAdministrada),
      unidadDosis: raw.unidadDosis || null,
      viaAdministracion: raw.viaAdministracion || null,
      periodoSupresionDias: Number(raw.periodoSupresionDias),
      fechaFinSupresion: raw.fechaFinSupresion ?? new Date().toISOString(),
    } as any;

    try {
      await this.offline.save('tratamiento', 'tratamientosVeterinarios', 'tratamiento', data, id, id
        ? this.api.updateTratamiento(id, data)
        : this.api.createTratamiento(data));
      this.router.navigate(['/tratamientos']);
    } catch {
      this.error.set('Error al guardar');
      this.saving.set(false);
    }
  }
}

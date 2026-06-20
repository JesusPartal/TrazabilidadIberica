import { Component, inject, OnInit, signal } from '@angular/core';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';
import { OfflineDataService } from '../../core/services/offline-data.service';
import { ActivityLogService } from '../../core/services/activity-log.service';
import { CausaBaja } from '../../core/models/baja';
import type { Animal } from '../../core/models/animal';
import type { PagedList } from '../../core/models/paged-list';

@Component({
  selector: 'app-baja-form',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule],
  template: `
    <div class="page">
      <header>
        <a routerLink="/bajas" class="back">←</a>
        <h1>{{ isEdit() ? 'Editar' : 'Nueva' }} Baja</h1>
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
          Fecha de Baja *
          <input type="date" formControlName="fechaBaja" />
          @if (fechaBaja?.invalid && fechaBaja?.touched) {
            <small class="field-error">Requerido</small>
          }
        </label>

        <label>
          Causa *
          <select formControlName="causa">
            <option value="">Seleccionar...</option>
            <option [value]="CausaBaja.Venta">Venta</option>
            <option [value]="CausaBaja.Muerte">Muerte</option>
            <option [value]="CausaBaja.Sacrificio">Sacrificio</option>
            <option [value]="CausaBaja.Perdida">Pérdida</option>
            <option [value]="CausaBaja.Donacion">Donación</option>
          </select>
          @if (causa?.invalid && causa?.touched) {
            <small class="field-error">Requerido</small>
          }
        </label>

        <label>
          Destino
          <input type="text" formControlName="destino" />
        </label>

        <label>
          Nº Guía Asociada
          <input type="text" formControlName="numGuiaAsociada" />
        </label>

        <label>
          Observaciones
          <textarea formControlName="observaciones"></textarea>
        </label>

        <div class="form-actions">
          <a routerLink="/bajas" class="btn-cancel">Cancelar</a>
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
    input, select, textarea { padding: 0.5rem; border: 1px solid #ccc; border-radius: 6px; font-size: 0.875rem; }
    textarea { min-height: 80px; resize: vertical; }
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
export class BajaFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private api = inject(ApiService);
  private offline = inject(OfflineDataService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private log = inject(ActivityLogService);

  protected CausaBaja = CausaBaja;

  isEdit = signal(false);
  saving = signal(false);
  error = signal<string | null>(null);
  animales = signal<Animal[]>([]);

  form = this.fb.group({
    animalId: ['', Validators.required],
    fechaBaja: ['', Validators.required],
    causa: ['' as unknown as number, Validators.required],
    destino: [''],
    numGuiaAsociada: [''],
    observaciones: [''],
  });

  get animalId() { return this.form.get('animalId'); }
  get fechaBaja() { return this.form.get('fechaBaja'); }
  get causa() { return this.form.get('causa'); }

  ngOnInit() {
    this.api.getAnimals(1, 200).subscribe({
      next: (res: PagedList<Animal>) => this.animales.set(res.items),
      error: () => {},
    });

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit.set(true);
      this.api.getBaja(id).subscribe({
        next: (b) => {
          this.form.patchValue({
            ...b,
            causa: b.causa as unknown as number,
            fechaBaja: b.fechaBaja.substring(0, 10),
          });
        },
        error: () => this.error.set('Error al cargar baja'),
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
      fechaBaja: raw.fechaBaja ?? new Date().toISOString(),
      causa: Number(raw.causa),
      destino: raw.destino || null,
      numGuiaAsociada: raw.numGuiaAsociada || null,
      observaciones: raw.observaciones || null,
    } as any;

    try {
      const saved = await this.offline.save('baja', 'bajas', 'baja', data, id, id
        ? this.api.updateBaja(id, data)
        : this.api.createBaja(data));
      await this.log.log('Baja', saved.id, id ? 'Modificación' : 'Creación', `Causa: ${CausaBaja[data.causa]}`);
      this.router.navigate(['/bajas']);
    } catch {
      this.error.set('Error al guardar');
      this.saving.set(false);
    }
  }
}

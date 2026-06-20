import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';
import { OfflineDataService } from '../../core/services/offline-data.service';
import { ActivityLogService } from '../../core/services/activity-log.service';
import { CategoriaLote } from '../../core/models/lote';
import type { Finca } from '../../core/models/finca';
import type { PagedList } from '../../core/models/paged-list';

@Component({
  selector: 'app-lote-form',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, ReactiveFormsModule],
  template: `
    <div class="page">
      <header>
        <a routerLink="/lotes" class="back">←</a>
        <h1>{{ isEdit() ? 'Editar' : 'Nuevo' }} Lote</h1>
      </header>

      @if (error()) {
        <div class="error">{{ error() }}</div>
      }

      <form [formGroup]="form" (ngSubmit)="submit()" class="form">
        <label>
          Código del Lote *
          <input type="text" formControlName="codigoLote" />
          @if (codigoLote?.invalid && codigoLote?.touched) {
            <small class="field-error">Requerido</small>
          }
        </label>

        <label>
          Finca *
          <select formControlName="fincaId">
            <option value="">Seleccionar...</option>
            @for (f of fincas(); track f.id) {
              <option [value]="f.id">{{ f.nombre }}</option>
            }
          </select>
          @if (fincaId?.invalid && fincaId?.touched) {
            <small class="field-error">Requerido</small>
          }
        </label>

        <label>
          Categoría *
          <select formControlName="categoria">
            <option value="">Seleccionar...</option>
            <option [value]="CategoriaLote.Cebo">Cebo</option>
            <option [value]="CategoriaLote.Recria">Recría</option>
            <option [value]="CategoriaLote.Transicion">Transición</option>
            <option [value]="CategoriaLote.Reproduccion">Reproducción</option>
            <option [value]="CategoriaLote.Lechones">Lechones</option>
          </select>
          @if (categoria?.invalid && categoria?.touched) {
            <small class="field-error">Requerido</small>
          }
        </label>

        <label>
          Fecha de Formación *
          <input type="date" formControlName="fechaFormacion" />
          @if (fechaFormacion?.invalid && fechaFormacion?.touched) {
            <small class="field-error">Requerido</small>
          }
        </label>

        <label>
          Número de Animales *
          <input type="number" formControlName="numeroAnimales" />
          @if (numeroAnimales?.invalid && numeroAnimales?.touched) {
            <small class="field-error">Requerido</small>
          }
        </label>

        <label>
          Peso Medio (kg) *
          <input type="number" step="0.1" formControlName="pesoMedioKg" />
          @if (pesoMedioKg?.invalid && pesoMedioKg?.touched) {
            <small class="field-error">Requerido</small>
          }
        </label>

        <label>
          Composición Racial
          <input type="text" formControlName="composicionRacial" />
        </label>

        <label>
          Origen
          <input type="text" formControlName="origen" />
        </label>

        <label class="checkbox">
          <input type="checkbox" formControlName="cerrado" />
          Lote cerrado
        </label>

        <div class="form-actions">
          <a routerLink="/lotes" class="btn-cancel">Cancelar</a>
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
    label.checkbox { flex-direction: row; align-items: center; gap: 0.5rem; }
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
export class LoteFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private api = inject(ApiService);
  private offline = inject(OfflineDataService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private log = inject(ActivityLogService);

  protected CategoriaLote = CategoriaLote;

  isEdit = signal(false);
  saving = signal(false);
  error = signal<string | null>(null);
  fincas = signal<Finca[]>([]);

  form = this.fb.group({
    codigoLote: ['', Validators.required],
    fincaId: ['', Validators.required],
    categoria: ['' as unknown as number, Validators.required],
    fechaFormacion: ['', Validators.required],
    numeroAnimales: [0, Validators.required],
    pesoMedioKg: [0, Validators.required],
    composicionRacial: [''],
    origen: [''],
    cerrado: [false],
  });

  get codigoLote() { return this.form.get('codigoLote'); }
  get fincaId() { return this.form.get('fincaId'); }
  get categoria() { return this.form.get('categoria'); }
  get fechaFormacion() { return this.form.get('fechaFormacion'); }
  get numeroAnimales() { return this.form.get('numeroAnimales'); }
  get pesoMedioKg() { return this.form.get('pesoMedioKg'); }

  ngOnInit() {
    this.api.getFincas(undefined, 1, 200).subscribe({
      next: (res: PagedList<Finca>) => this.fincas.set(res.items),
      error: () => {},
    });

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit.set(true);
      this.api.getLote(id).subscribe({
        next: (l) => {
          this.form.patchValue({
            ...l,
            categoria: l.categoria as unknown as number,
            fechaFormacion: l.fechaFormacion.substring(0, 10),
          });
        },
        error: () => this.error.set('Error al cargar lote'),
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
      codigoLote: raw.codigoLote ?? '',
      fincaId: raw.fincaId ?? '',
      categoria: Number(raw.categoria),
      fechaFormacion: raw.fechaFormacion ?? new Date().toISOString(),
      numeroAnimales: Number(raw.numeroAnimales),
      pesoMedioKg: Number(raw.pesoMedioKg),
      composicionRacial: raw.composicionRacial ?? '',
      origen: raw.origen ?? null,
      cerrado: raw.cerrado ?? false,
    } as any;

    try {
      const saved = await this.offline.save('lote', 'lotes', 'lote', data, id, id
        ? this.api.updateLote(id, data)
        : this.api.createLote(data));
      await this.log.log('Lote', saved.id, id ? 'Modificación' : 'Creación', `Código: ${data.codigoLote}`);
      this.router.navigate(['/lotes']);
    } catch {
      this.error.set('Error al guardar');
      this.saving.set(false);
    }
  }
}

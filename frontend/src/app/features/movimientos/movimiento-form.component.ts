import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';
import { OfflineDataService } from '../../core/services/offline-data.service';
import { ActivityLogService } from '../../core/services/activity-log.service';
import { TipoMovimiento } from '../../core/models/movimiento-animal';
import type { Finca } from '../../core/models/finca';
import type { Animal } from '../../core/models/animal';
import type { PagedList } from '../../core/models/paged-list';

@Component({
  selector: 'app-movimiento-form',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, ReactiveFormsModule],
  template: `
    <div class="page">
      <header>
        <a routerLink="/movements" class="back">←</a>
        <h1>{{ isEdit() ? 'Editar' : 'Nuevo' }} Movimiento</h1>
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
          Tipo de Movimiento *
          <select formControlName="tipoMovimiento">
            <option value="">Seleccionar...</option>
            <option [value]="TipoMovimiento.Entrada">Entrada</option>
            <option [value]="TipoMovimiento.Salida">Salida</option>
            <option [value]="TipoMovimiento.TrasladoInterno">Traslado Interno</option>
            <option [value]="TipoMovimiento.TrasladoExterno">Traslado Externo</option>
          </select>
          @if (tipoMovimiento?.invalid && tipoMovimiento?.touched) {
            <small class="field-error">Requerido</small>
          }
        </label>

        <label>
          Finca Origen
          <select formControlName="fincaOrigenId">
            <option value="">Sin origen</option>
            @for (f of fincas(); track f.id) {
              <option [value]="f.id">{{ f.nombre }}</option>
            }
          </select>
        </label>

        <label>
          Finca Destino
          <select formControlName="fincaDestinoId">
            <option value="">Sin destino</option>
            @for (f of fincas(); track f.id) {
              <option [value]="f.id">{{ f.nombre }}</option>
            }
          </select>
        </label>

        <label>
          Fecha del Movimiento *
          <input type="date" formControlName="fechaMovimiento" />
          @if (fechaMovimiento?.invalid && fechaMovimiento?.touched) {
            <small class="field-error">Requerido</small>
          }
        </label>

        <label>
          Número de Guía
          <input type="text" formControlName="numeroGuia" />
        </label>

        <label>
          Motivo
          <input type="text" formControlName="motivo" />
        </label>

        <label>
          Operador Destino
          <input type="text" formControlName="operadorDestino" />
        </label>

        <label>
          Nº Documento Acompañamiento
          <input type="text" formControlName="numDocumentoAcompanamiento" />
        </label>

        <label>
          CSV
          <input type="text" formControlName="csv" />
        </label>

        <div class="form-actions">
          <a routerLink="/movements" class="btn-cancel">Cancelar</a>
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
export class MovimientoFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private api = inject(ApiService);
  private offline = inject(OfflineDataService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private log = inject(ActivityLogService);

  protected TipoMovimiento = TipoMovimiento;

  isEdit = signal(false);
  saving = signal(false);
  error = signal<string | null>(null);
  fincas = signal<Finca[]>([]);
  animales = signal<Animal[]>([]);

  form = this.fb.group({
    animalId: ['', Validators.required],
    tipoMovimiento: ['' as unknown as number, Validators.required],
    fincaOrigenId: [''],
    fincaDestinoId: [''],
    fechaMovimiento: ['', Validators.required],
    numeroGuia: [''],
    motivo: [''],
    operadorDestino: [''],
    numDocumentoAcompanamiento: [''],
    csv: [''],
  });

  get animalId() { return this.form.get('animalId'); }
  get tipoMovimiento() { return this.form.get('tipoMovimiento'); }
  get fechaMovimiento() { return this.form.get('fechaMovimiento'); }

  ngOnInit() {
    this.api.getFincas(undefined, 1, 200).subscribe({
      next: (res: PagedList<Finca>) => this.fincas.set(res.items),
      error: () => {},
    });

    this.api.getAnimals(1, 200).subscribe({
      next: (res: PagedList<Animal>) => this.animales.set(res.items),
      error: () => {},
    });

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit.set(true);
      this.api.getMovimiento(id).subscribe({
        next: (m) => {
          this.form.patchValue({
            ...m,
            tipoMovimiento: m.tipoMovimiento as unknown as number,
            fechaMovimiento: m.fechaMovimiento.substring(0, 10),
          });
        },
        error: () => this.error.set('Error al cargar movimiento'),
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
      tipoMovimiento: Number(raw.tipoMovimiento),
      fincaOrigenId: raw.fincaOrigenId || undefined,
      fincaDestinoId: raw.fincaDestinoId || undefined,
      fechaMovimiento: raw.fechaMovimiento ?? new Date().toISOString(),
      numeroGuia: raw.numeroGuia || undefined,
      motivo: raw.motivo || undefined,
      operadorDestino: raw.operadorDestino || undefined,
      numDocumentoAcompanamiento: raw.numDocumentoAcompanamiento || undefined,
      csv: raw.csv || undefined,
    } as any;

    try {
      const saved = await this.offline.save('movimiento', 'movimientosAnimal', 'movimiento', data, id, id
        ? this.api.updateMovimiento(id, data)
        : this.api.createMovimiento(data));
      await this.log.log('Movimiento', saved.id, id ? 'Modificación' : 'Creación', `Tipo: ${TipoMovimiento[data.tipoMovimiento]}`);
      this.router.navigate(['/movements']);
    } catch {
      this.error.set('Error al guardar');
      this.saving.set(false);
    }
  }
}

import { Component, inject, OnInit, signal } from '@angular/core';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';
import { OfflineDataService } from '../../core/services/offline-data.service';
import { EstadoCampania } from '../../core/models/campania-montanera';
import type { Finca } from '../../core/models/finca';
import type { PagedList } from '../../core/models/paged-list';

@Component({
  selector: 'app-campania-form',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule],
  template: `
    <div class="page">
      <header>
        <a routerLink="/campanias" class="back">←</a>
        <h1>{{ isEdit() ? 'Editar' : 'Nueva' }} Campaña Montanera</h1>
      </header>

      @if (error()) {
        <div class="error">{{ error() }}</div>
      }

      <form [formGroup]="form" (ngSubmit)="submit()" class="form">
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
          Temporada *
          <input type="number" formControlName="temporada" />
          @if (temporada?.invalid && temporada?.touched) {
            <small class="field-error">Requerido</small>
          }
        </label>

        <label>
          Fecha de Inicio *
          <input type="date" formControlName="fechaInicio" />
          @if (fechaInicio?.invalid && fechaInicio?.touched) {
            <small class="field-error">Requerido</small>
          }
        </label>

        <label>
          Fecha de Fin
          <input type="date" formControlName="fechaFin" />
        </label>

        <label>
          Hectáreas Utilizadas *
          <input type="number" step="0.01" formControlName="hectareasUtilizadas" />
          @if (hectareasUtilizadas?.invalid && hectareasUtilizadas?.touched) {
            <small class="field-error">Requerido</small>
          }
        </label>

        <label>
          Capacidad Máx. Animales *
          <input type="number" formControlName="capacidadMaxAnimales" />
          @if (capacidadMaxAnimales?.invalid && capacidadMaxAnimales?.touched) {
            <small class="field-error">Requerido</small>
          }
        </label>

        <label>
          Estado *
          <select formControlName="estadoCampania">
            <option value="">Seleccionar...</option>
            <option [value]="EstadoCampania.Planificada">Planificada</option>
            <option [value]="EstadoCampania.Activa">Activa</option>
            <option [value]="EstadoCampania.Cerrada">Cerrada</option>
          </select>
          @if (estadoCampania?.invalid && estadoCampania?.touched) {
            <small class="field-error">Requerido</small>
          }
        </label>

        <label>
          Nº Autorización D.O.
          <input type="text" formControlName="numAutorizacionDO" />
        </label>

        <div class="form-actions">
          <a routerLink="/campanias" class="btn-cancel">Cancelar</a>
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
export class CampaniaFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private api = inject(ApiService);
  private offline = inject(OfflineDataService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  protected EstadoCampania = EstadoCampania;

  isEdit = signal(false);
  saving = signal(false);
  error = signal<string | null>(null);
  fincas = signal<Finca[]>([]);

  form = this.fb.group({
    fincaId: ['', Validators.required],
    temporada: [new Date().getFullYear(), Validators.required],
    fechaInicio: ['', Validators.required],
    fechaFin: [''],
    hectareasUtilizadas: [0, Validators.required],
    capacidadMaxAnimales: [0, Validators.required],
    estadoCampania: ['' as unknown as number, Validators.required],
    numAutorizacionDO: [''],
  });

  get fincaId() { return this.form.get('fincaId'); }
  get temporada() { return this.form.get('temporada'); }
  get fechaInicio() { return this.form.get('fechaInicio'); }
  get hectareasUtilizadas() { return this.form.get('hectareasUtilizadas'); }
  get capacidadMaxAnimales() { return this.form.get('capacidadMaxAnimales'); }
  get estadoCampania() { return this.form.get('estadoCampania'); }

  ngOnInit() {
    this.api.getFincas(undefined, 1, 200).subscribe({
      next: (res: PagedList<Finca>) => this.fincas.set(res.items),
      error: () => {},
    });

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit.set(true);
      this.api.getCampania(id).subscribe({
        next: (c) => {
          this.form.patchValue({
            ...c,
            estadoCampania: c.estadoCampania as unknown as number,
            fechaInicio: c.fechaInicio.substring(0, 10),
            fechaFin: c.fechaFin?.substring(0, 10) ?? '',
          });
        },
        error: () => this.error.set('Error al cargar campaña'),
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
      fincaId: raw.fincaId ?? '',
      temporada: Number(raw.temporada),
      fechaInicio: raw.fechaInicio ?? new Date().toISOString(),
      fechaFin: raw.fechaFin || null,
      hectareasUtilizadas: Number(raw.hectareasUtilizadas),
      capacidadMaxAnimales: Number(raw.capacidadMaxAnimales),
      estadoCampania: Number(raw.estadoCampania),
      numAutorizacionDO: raw.numAutorizacionDO || null,
    } as any;

    try {
      await this.offline.save('campania', 'campaniasMontanera', 'campania', data, id, id
        ? this.api.updateCampania(id, data)
        : this.api.createCampania(data));
      this.router.navigate(['/campanias']);
    } catch {
      this.error.set('Error al guardar');
      this.saving.set(false);
    }
  }
}

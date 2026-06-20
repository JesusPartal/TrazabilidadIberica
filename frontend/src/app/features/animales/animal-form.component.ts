import { Component, inject, OnInit, signal } from '@angular/core';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { ActivityLogService } from '../../core/services/activity-log.service';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';
import { OfflineDataService } from '../../core/services/offline-data.service';
import { TipoAnimal, SexoAnimal } from '../../core/models/animal';
import type { Finca } from '../../core/models/finca';
import type { PagedList } from '../../core/models/paged-list';

@Component({
  selector: 'app-animal-form',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule],
  template: `
    <div class="page">
      <header>
        <a routerLink="/animals" class="back">←</a>
        <h1>{{ isEdit() ? 'Editar' : 'Nuevo' }} Animal</h1>
      </header>

      @if (error()) {
        <div class="error">{{ error() }}</div>
      }

      <form [formGroup]="form" (ngSubmit)="submit()" class="form">
        <label>
          Número de Crotal *
          <input type="text" formControlName="numeroCrotal" />
          @if (numeroCrotal?.invalid && numeroCrotal?.touched) {
            <small class="field-error">Requerido</small>
          }
        </label>

        <label>
          Tipo *
          <select formControlName="tipo">
            <option value="">Seleccionar...</option>
            <option [value]="TipoAnimal.Cerdo">Cerdo</option>
            <option [value]="TipoAnimal.Lechon">Lechón</option>
          </select>
          @if (tipo?.invalid && tipo?.touched) {
            <small class="field-error">Requerido</small>
          }
        </label>

        <label>
          Sexo *
          <select formControlName="sexo">
            <option value="">Seleccionar...</option>
            <option [value]="SexoAnimal.Macho">Macho</option>
            <option [value]="SexoAnimal.Hembra">Hembra</option>
          </select>
          @if (sexo?.invalid && sexo?.touched) {
            <small class="field-error">Requerido</small>
          }
        </label>

        <label>
          Fecha de Nacimiento *
          <input type="date" formControlName="fechaNacimiento" />
          @if (fechaNacimiento?.invalid && fechaNacimiento?.touched) {
            <small class="field-error">Requerido</small>
          }
        </label>

        <label>
          Peso al Nacimiento (kg)
          <input type="number" step="0.1" formControlName="pesoNacimiento" />
        </label>

        <label>
          Fecha de Entrada *
          <input type="date" formControlName="fechaEntrada" />
          @if (fechaEntrada?.invalid && fechaEntrada?.touched) {
            <small class="field-error">Requerido</small>
          }
        </label>

        <label>
          Peso de Entrada (kg) *
          <input type="number" step="0.1" formControlName="pesoEntrada" />
          @if (pesoEntrada?.invalid && pesoEntrada?.touched) {
            <small class="field-error">Requerido</small>
          }
        </label>

        <label>
          Finca Actual
          <select formControlName="fincaActualId">
            <option value="">Sin asignar</option>
            @for (f of fincas(); track f.id) {
              <option [value]="f.id">{{ f.nombre }}</option>
            }
          </select>
        </label>

        <div class="form-actions">
          <a routerLink="/animals" class="btn-cancel">Cancelar</a>
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
export class AnimalFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private api = inject(ApiService);
  private offline = inject(OfflineDataService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private log = inject(ActivityLogService);

  protected TipoAnimal = TipoAnimal;
  protected SexoAnimal = SexoAnimal;

  isEdit = signal(false);
  saving = signal(false);
  error = signal<string | null>(null);
  fincas = signal<Finca[]>([]);

  form = this.fb.group({
    numeroCrotal: ['', Validators.required],
    tipo: ['' as unknown as number, Validators.required],
    sexo: ['' as unknown as number, Validators.required],
    fechaNacimiento: ['', Validators.required],
    pesoNacimiento: [null as number | null],
    fechaEntrada: ['', Validators.required],
    pesoEntrada: [0, Validators.required],
    fincaActualId: [''],
  });

  get numeroCrotal() { return this.form.get('numeroCrotal'); }
  get tipo() { return this.form.get('tipo'); }
  get sexo() { return this.form.get('sexo'); }
  get fechaNacimiento() { return this.form.get('fechaNacimiento'); }
  get fechaEntrada() { return this.form.get('fechaEntrada'); }
  get pesoEntrada() { return this.form.get('pesoEntrada'); }

  ngOnInit() {
    this.api.getFincas(undefined, 1, 200).subscribe({
      next: (res: PagedList<Finca>) => this.fincas.set(res.items),
      error: () => {},
    });

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit.set(true);
      this.api.getAnimal(id).subscribe({
        next: (a) => {
          this.form.patchValue({
            ...a,
            tipo: a.tipo as unknown as number,
            sexo: a.sexo as unknown as number,
            fechaNacimiento: a.fechaNacimiento.substring(0, 10),
            fechaEntrada: a.fechaEntrada.substring(0, 10),
          });
        },
        error: () => this.error.set('Error al cargar animal'),
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
      numeroCrotal: raw.numeroCrotal ?? '',
      tipo: Number(raw.tipo),
      sexo: Number(raw.sexo),
      fechaNacimiento: raw.fechaNacimiento ?? new Date().toISOString(),
      fechaEntrada: raw.fechaEntrada ?? new Date().toISOString(),
      pesoNacimiento: raw.pesoNacimiento ?? null,
      pesoEntrada: Number(raw.pesoEntrada),
      fincaActualId: raw.fincaActualId || null,
    } as any;

    try {
      const saved = await this.offline.save('animal', 'animales', 'animal', data, id, id
        ? this.api.updateAnimal(id, data)
        : this.api.createAnimal(data));
      await this.log.log('Animal', saved.id, id ? 'Modificación' : 'Creación', `Crotal: ${data.numeroCrotal}`);
      this.router.navigate(['/animals']);
    } catch {
      this.error.set('Error al guardar');
      this.saving.set(false);
    }
  }
}

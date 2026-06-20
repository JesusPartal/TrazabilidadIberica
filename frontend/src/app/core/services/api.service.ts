import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import type { Observable } from 'rxjs';
import type { Animal } from '../models/animal';
import type { Finca } from '../models/finca';
import type { Lote } from '../models/lote';
import type { MovimientoAnimal } from '../models/movimiento-animal';
import type { Ganadero } from '../models/ganadero';
import type { Veterinario } from '../models/veterinario';
import type { Baja } from '../models/baja';
import type { CampaniaMontanera } from '../models/campania-montanera';
import type { TratamientoVeterinario } from '../models/tratamiento-veterinario';
import type { LoginRequest, LoginResponse, RegisterRequest, RefreshRequest, RefreshResponse } from '../models/auth';
import type { PagedList } from '../models/paged-list';
import type { SyncQueueItem, SyncResponse } from '../models/sync';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl;

  // Auth
  login(request: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.baseUrl}/auth/login`, request);
  }

  register(request: RegisterRequest): Observable<unknown> {
    return this.http.post(`${this.baseUrl}/auth/register`, request);
  }

  refresh(request: RefreshRequest): Observable<RefreshResponse> {
    return this.http.post<RefreshResponse>(`${this.baseUrl}/auth/refresh`, request);
  }

  revoke(request: RefreshRequest): Observable<unknown> {
    return this.http.post(`${this.baseUrl}/auth/revoke`, request);
  }

  // Animals
  getAnimals(page = 1, pageSize = 50): Observable<PagedList<Animal>> {
    return this.http.get<PagedList<Animal>>(`${this.baseUrl}/animales`, {
      params: { page, pageSize },
    });
  }

  getAnimal(id: string): Observable<Animal> {
    return this.http.get<Animal>(`${this.baseUrl}/animales/${id}`);
  }

  createAnimal(animal: Partial<Animal>): Observable<Animal> {
    return this.http.post<Animal>(`${this.baseUrl}/animales`, animal);
  }

  updateAnimal(id: string, animal: Partial<Animal>): Observable<Animal> {
    return this.http.put<Animal>(`${this.baseUrl}/animales/${id}`, animal);
  }

  deleteAnimal(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/animales/${id}`);
  }

  // Farms
  getFincas(ganaderoId?: string, page = 1, pageSize = 50): Observable<PagedList<Finca>> {
    const params: Record<string, string | number> = { page, pageSize };
    if (ganaderoId) params['ganaderoId'] = ganaderoId;
    return this.http.get<PagedList<Finca>>(`${this.baseUrl}/fincas`, { params });
  }

  getFinca(id: string): Observable<Finca> {
    return this.http.get<Finca>(`${this.baseUrl}/fincas/${id}`);
  }

  createFinca(finca: Partial<Finca>): Observable<Finca> {
    return this.http.post<Finca>(`${this.baseUrl}/fincas`, finca);
  }

  updateFinca(id: string, finca: Partial<Finca>): Observable<Finca> {
    return this.http.put<Finca>(`${this.baseUrl}/fincas/${id}`, finca);
  }

  deleteFinca(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/fincas/${id}`);
  }

  // Lotes
  getLotes(fincaId?: string, page = 1, pageSize = 50): Observable<PagedList<Lote>> {
    const params: Record<string, string | number> = { page, pageSize };
    if (fincaId) params['fincaId'] = fincaId;
    return this.http.get<PagedList<Lote>>(`${this.baseUrl}/lotes`, { params });
  }

  getLote(id: string): Observable<Lote> {
    return this.http.get<Lote>(`${this.baseUrl}/lotes/${id}`);
  }

  createLote(lote: Partial<Lote>): Observable<string> {
    return this.http.post<string>(`${this.baseUrl}/lotes`, lote);
  }

  updateLote(id: string, lote: Partial<Lote>): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/lotes/${id}`, { ...lote, id });
  }

  deleteLote(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/lotes/${id}`);
  }

  // Movimientos Animal
  getMovimientos(animalId?: string, fincaId?: string, page = 1, pageSize = 50): Observable<PagedList<MovimientoAnimal>> {
    const params: Record<string, string | number> = { page, pageSize };
    if (animalId) params['animalId'] = animalId;
    if (fincaId) params['fincaId'] = fincaId;
    return this.http.get<PagedList<MovimientoAnimal>>(`${this.baseUrl}/movimientosanimal`, { params });
  }

  getMovimiento(id: string): Observable<MovimientoAnimal> {
    return this.http.get<MovimientoAnimal>(`${this.baseUrl}/movimientosanimal/${id}`);
  }

  createMovimiento(movimiento: Partial<MovimientoAnimal>): Observable<string> {
    return this.http.post<string>(`${this.baseUrl}/movimientosanimal`, movimiento);
  }

  updateMovimiento(id: string, movimiento: Partial<MovimientoAnimal>): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/movimientosanimal/${id}`, { ...movimiento, id });
  }

  deleteMovimiento(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/movimientosanimal/${id}`);
  }

  // Ganaderos
  getGanaderos(page = 1, pageSize = 50): Observable<PagedList<Ganadero>> {
    return this.http.get<PagedList<Ganadero>>(`${this.baseUrl}/ganaderos`, {
      params: { page, pageSize },
    });
  }

  getGanadero(id: string): Observable<Ganadero> {
    return this.http.get<Ganadero>(`${this.baseUrl}/ganaderos/${id}`);
  }

  createGanadero(ganadero: Partial<Ganadero>): Observable<Ganadero> {
    return this.http.post<Ganadero>(`${this.baseUrl}/ganaderos`, ganadero);
  }

  updateGanadero(id: string, ganadero: Partial<Ganadero>): Observable<Ganadero> {
    return this.http.put<Ganadero>(`${this.baseUrl}/ganaderos/${id}`, ganadero);
  }

  deleteGanadero(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/ganaderos/${id}`);
  }

  // Veterinarios
  getVeterinarios(page = 1, pageSize = 50): Observable<PagedList<Veterinario>> {
    return this.http.get<PagedList<Veterinario>>(`${this.baseUrl}/veterinarios`, {
      params: { page, pageSize },
    });
  }

  getVeterinario(id: string): Observable<Veterinario> {
    return this.http.get<Veterinario>(`${this.baseUrl}/veterinarios/${id}`);
  }

  createVeterinario(veterinario: Partial<Veterinario>): Observable<Veterinario> {
    return this.http.post<Veterinario>(`${this.baseUrl}/veterinarios`, veterinario);
  }

  updateVeterinario(id: string, veterinario: Partial<Veterinario>): Observable<Veterinario> {
    return this.http.put<Veterinario>(`${this.baseUrl}/veterinarios/${id}`, veterinario);
  }

  deleteVeterinario(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/veterinarios/${id}`);
  }

  // Bajas
  getBajas(page = 1, pageSize = 50): Observable<PagedList<Baja>> {
    return this.http.get<PagedList<Baja>>(`${this.baseUrl}/bajas`, {
      params: { page, pageSize },
    });
  }

  getBaja(id: string): Observable<Baja> {
    return this.http.get<Baja>(`${this.baseUrl}/bajas/${id}`);
  }

  createBaja(baja: Partial<Baja>): Observable<Baja> {
    return this.http.post<Baja>(`${this.baseUrl}/bajas`, baja);
  }

  updateBaja(id: string, baja: Partial<Baja>): Observable<Baja> {
    return this.http.put<Baja>(`${this.baseUrl}/bajas/${id}`, baja);
  }

  deleteBaja(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/bajas/${id}`);
  }

  // Campanias Montanera
  getCampanias(page = 1, pageSize = 50): Observable<PagedList<CampaniaMontanera>> {
    return this.http.get<PagedList<CampaniaMontanera>>(`${this.baseUrl}/campaniasmontanera`, {
      params: { page, pageSize },
    });
  }

  getCampania(id: string): Observable<CampaniaMontanera> {
    return this.http.get<CampaniaMontanera>(`${this.baseUrl}/campaniasmontanera/${id}`);
  }

  createCampania(campania: Partial<CampaniaMontanera>): Observable<CampaniaMontanera> {
    return this.http.post<CampaniaMontanera>(`${this.baseUrl}/campaniasmontanera`, campania);
  }

  updateCampania(id: string, campania: Partial<CampaniaMontanera>): Observable<CampaniaMontanera> {
    return this.http.put<CampaniaMontanera>(`${this.baseUrl}/campaniasmontanera/${id}`, campania);
  }

  deleteCampania(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/campaniasmontanera/${id}`);
  }

  // Tratamientos Veterinarios
  getTratamientos(page = 1, pageSize = 50): Observable<PagedList<TratamientoVeterinario>> {
    return this.http.get<PagedList<TratamientoVeterinario>>(`${this.baseUrl}/tratamientosveterinarios`, {
      params: { page, pageSize },
    });
  }

  getTratamiento(id: string): Observable<TratamientoVeterinario> {
    return this.http.get<TratamientoVeterinario>(`${this.baseUrl}/tratamientosveterinarios/${id}`);
  }

  createTratamiento(tratamiento: Partial<TratamientoVeterinario>): Observable<TratamientoVeterinario> {
    return this.http.post<TratamientoVeterinario>(`${this.baseUrl}/tratamientosveterinarios`, tratamiento);
  }

  updateTratamiento(id: string, tratamiento: Partial<TratamientoVeterinario>): Observable<TratamientoVeterinario> {
    return this.http.put<TratamientoVeterinario>(`${this.baseUrl}/tratamientosveterinarios/${id}`, tratamiento);
  }

  deleteTratamiento(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/tratamientosveterinarios/${id}`);
  }

  // Sync
  sync(changes: SyncQueueItem[]): Observable<SyncResponse> {
    return this.http.post<SyncResponse>(`${this.baseUrl}/sync`, changes);
  }
}

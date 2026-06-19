import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import type { Observable } from 'rxjs';
import type { Animal } from '../models/animal';
import type { Finca } from '../models/finca';
import type { Lote } from '../models/lote';
import type { MovimientoAnimal } from '../models/movimiento-animal';
import type { LoginRequest, LoginResponse, RegisterRequest } from '../models/auth';
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

  // Sync
  sync(changes: SyncQueueItem[]): Observable<SyncResponse> {
    return this.http.post<SyncResponse>(`${this.baseUrl}/sync`, changes);
  }
}

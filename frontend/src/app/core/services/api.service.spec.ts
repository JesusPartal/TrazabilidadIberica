import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { ApiService } from './api.service';
import type { Animal } from '../models/animal';
import type { LoginResponse, LoginRequest } from '../models/auth';
import type { PagedList } from '../models/paged-list';

describe('ApiService', () => {
  let service: ApiService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(ApiService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    http.verify();
  });

  describe('login', () => {
    it('should POST to auth/login and return tokens', () => {
      const request: LoginRequest = { email: 'test@example.com', password: 'pass' };
      const expected: LoginResponse = { token: 'abc', refreshToken: 'def', email: 'test@example.com', ganaderoId: 'g1' };

      let actual: LoginResponse | undefined;
      service.login(request).subscribe(r => (actual = r));

      const req = http.expectOne('https://localhost:5001/api/auth/login');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(request);
      req.flush(expected);

      expect(actual).toEqual(expected);
    });

    it('should propagate error on failure', () => {
      let err: unknown;
      service.login({ email: 'bad', password: 'bad' }).subscribe({ error: e => (err = e) });

      const req = http.expectOne('https://localhost:5001/api/auth/login');
      req.flush({ message: 'Unauthorized' }, { status: 401, statusText: 'Unauthorized' });

      expect(err).toBeTruthy();
    });
  });

  describe('getAnimals', () => {
    it('should GET /animales with pagination params', () => {
      const expected: PagedList<Animal> = {
        items: [
          { id: '1', numeroCrotal: 'A001', tipo: 0, sexo: 0, fechaNacimiento: '2024-01-01', pesoNacimiento: null, fechaEntrada: '2024-06-01', pesoEntrada: 30, estado: 0, fincaActualId: null, loteActualId: null, createdOffline: false, clientId: null, createdAt: '', updatedAt: '', deletedAt: null },
        ],
        totalCount: 1,
        page: 1,
        pageSize: 50,
        totalPages: 1,
      };

      let actual: PagedList<Animal> | undefined;
      service.getAnimals(1).subscribe(r => (actual = r));

      const req = http.expectOne('https://localhost:5001/api/animales?page=1&pageSize=50');
      expect(req.request.method).toBe('GET');
      req.flush(expected);

      expect(actual).toEqual(expected);
    });
  });

  describe('createAnimal', () => {
    it('should POST to /animales', () => {
      const animal = {
        numeroCrotal: 'A002', tipo: 0 as const, sexo: 0 as const, fechaNacimiento: '2024-02-01', pesoNacimiento: null, fechaEntrada: '2024-06-15', pesoEntrada: 28, estado: 0 as const, fincaActualId: null, loteActualId: null,
      };

      let actual: Animal | undefined;
      service.createAnimal(animal).subscribe(r => (actual = r));

      const req = http.expectOne('https://localhost:5001/api/animales');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toMatchObject({ numeroCrotal: 'A002' });
      req.flush({ ...animal, id: 'new-id', createdOffline: false, clientId: null, createdAt: '', updatedAt: '', deletedAt: null });

      expect(actual?.id).toBe('new-id');
    });
  });

  describe('deleteAnimal', () => {
    it('should DELETE to /animales/:id', () => {
      let called = false;
      service.deleteAnimal('42').subscribe(() => (called = true));

      const req = http.expectOne('https://localhost:5001/api/animales/42');
      expect(req.request.method).toBe('DELETE');
      req.flush(null);

      expect(called).toBe(true);
    });
  });

  describe('getFincas', () => {
    it('should pass optional ganaderoId query param', () => {
      service.getFincas('g1', 1).subscribe();

      const req = http.expectOne(r => r.url.includes('/api/fincas') && r.params.get('ganaderoId') === 'g1');
      expect(req.request.method).toBe('GET');
      expect(req.request.params.get('page')).toBe('1');
      req.flush({ items: [], totalCount: 0, page: 1, pageSize: 50, totalPages: 0 });
    });
  });
});

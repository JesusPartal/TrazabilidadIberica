import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { ApiService } from './api.service';
import type { LoginResponse, RefreshResponse } from '../models/auth';
import { of } from 'rxjs';
import { Router } from '@angular/router';

describe('AuthService', () => {
  let api: { login: ReturnType<typeof vi.fn>; register: ReturnType<typeof vi.fn>; refresh: ReturnType<typeof vi.fn>; revoke: ReturnType<typeof vi.fn> };

  function createService() {
    api = {
      login: vi.fn(),
      register: vi.fn(),
      refresh: vi.fn(),
      revoke: vi.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        AuthService,
        { provide: ApiService, useValue: api },
        { provide: Router, useValue: { navigate: vi.fn() } },
      ],
    });

    return TestBed.inject(AuthService);
  }

  afterEach(() => {
    localStorage.clear();
    TestBed.resetTestingModule();
  });

  describe('initial state', () => {
    it('should be unauthenticated when no token in storage', () => {
      const service = createService();
      expect(service.isAuthenticated()).toBe(false);
      expect(service.token()).toBeNull();
      expect(service.email()).toBeNull();
    });

    it('should restore session from localStorage', () => {
      localStorage.setItem('token', 'restored-token');
      localStorage.setItem('refreshToken', 'restored-rt');
      localStorage.setItem('email', 'a@b.com');
      localStorage.setItem('ganaderoId', 'g1');

      const service = createService();
      expect(service.isAuthenticated()).toBe(true);
      expect(service.token()).toBe('restored-token');
      expect(service.email()).toBe('a@b.com');
      expect(service.ganaderoId()).toBe('g1');
    });
  });

  describe('login', () => {
    it('should call api.login and store session', () => {
      const service = createService();
      const response: LoginResponse = { token: 't1', refreshToken: 'rt1', email: 'u@test.com', ganaderoId: 'g1' };
      api.login.mockReturnValue(of(response));

      let result: LoginResponse | undefined;
      service.login({ email: 'u@test.com', password: 'p' }).subscribe(r => (result = r));

      expect(api.login).toHaveBeenCalledWith({ email: 'u@test.com', password: 'p' });
      expect(result).toEqual(response);
      expect(localStorage.getItem('token')).toBe('t1');
      expect(localStorage.getItem('email')).toBe('u@test.com');
      expect(localStorage.getItem('ganaderoId')).toBe('g1');
      expect(service.isAuthenticated()).toBe(true);
    });
  });

  describe('logout', () => {
    it('should revoke refresh token and clear session', () => {
      localStorage.setItem('token', 't');
      localStorage.setItem('refreshToken', 'rt');
      localStorage.setItem('email', 'e');
      localStorage.setItem('ganaderoId', 'g');

      const service = createService();
      api.revoke.mockReturnValue(of(undefined));

      service.logout();

      expect(api.revoke).toHaveBeenCalledWith({ refreshToken: 'rt' });
      expect(localStorage.getItem('token')).toBeNull();
      expect(service.isAuthenticated()).toBe(false);
    });
  });

  describe('refresh', () => {
    it('should call api.refresh and update tokens', () => {
      localStorage.setItem('refreshToken', 'old-rt');
      localStorage.setItem('token', 'old-t');

      const service = createService();
      const response: RefreshResponse = { token: 'new-t', refreshToken: 'new-rt', email: 'e', ganaderoId: 'g' };
      api.refresh.mockReturnValue(of(response));

      let result: RefreshResponse | undefined;
      service.refresh().subscribe(r => (result = r));

      expect(api.refresh).toHaveBeenCalledWith({ refreshToken: 'old-rt' });
      expect(result).toEqual(response);
      expect(localStorage.getItem('token')).toBe('new-t');
      expect(localStorage.getItem('refreshToken')).toBe('new-rt');
    });

    it('should throw if no refresh token', () => {
      const service = createService();
      expect(() => service.refresh()).toThrow('No refresh token');
    });
  });
});

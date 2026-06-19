import type { HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, catchError, filter, switchMap, throwError } from 'rxjs';
import { AuthService } from './auth.service';

let isRefreshing = false;
const refreshSubject = new BehaviorSubject<string | null>(null);

function addToken(req: HttpRequest<unknown>, token: string) {
  return req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
}

export const httpTokenInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  const token = auth.token();
  if (token) {
    req = addToken(req, token);
  }

  return next(req).pipe(
    catchError((err) => {
      if (err.status !== 401 || req.url.includes('/auth/refresh') || req.url.includes('/auth/login')) {
        return throwError(() => err);
      }

      if (!isRefreshing) {
        isRefreshing = true;
        refreshSubject.next(null);

        return auth.refresh().pipe(
          switchMap((res) => {
            isRefreshing = false;
            refreshSubject.next(res.token);
            return next(addToken(req, res.token));
          }),
          catchError((refreshErr) => {
            isRefreshing = false;
            refreshSubject.next(null);
            auth.clearSession();
            router.navigate(['/login']);
            return throwError(() => refreshErr);
          }),
        );
      }

      return refreshSubject.pipe(
        filter((t) => t !== null),
        switchMap((t) => next(addToken(req, t!))),
      );
    }),
  );
};

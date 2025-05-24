import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import {BehaviorSubject, catchError, switchMap, tap, throwError} from 'rxjs';

let isRefreshing = false;
let refreshSubject = new BehaviorSubject(null);

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);

  return next(req).pipe(
    catchError(error => {
      if (error.status === 401 && !req.url.includes('/token/refresh/')) {
        if (!isRefreshing) {
          isRefreshing = true;
          return authService.refreshToken().pipe(
            tap(() => isRefreshing = false),
            switchMap(() => next(req)),
            catchError(() => {
              isRefreshing = false;
              authService.logout();
              return throwError(() => new Error('Unauthorized'));
            })
          );
        }
      }
      return throwError(() => error);
    })
  );
};

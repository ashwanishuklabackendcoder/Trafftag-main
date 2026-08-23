import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject, of } from 'rxjs';
import { catchError, filter, switchMap, take } from 'rxjs/operators';
import { API_BASE_URL } from '../config/api.config';

let isRefreshing = false;
let refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> => {
  const router = inject(Router);
  const http = inject(HttpClient);
  
  const token = localStorage.getItem('accessToken');
  let authReq = req;
  
  if (token && !req.url.includes('/auth/login') && !req.url.includes('/auth/refresh')) {
    authReq = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` }
    });
  }

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 && !req.url.includes('/auth/login') && !req.url.includes('/auth/refresh')) {
        return handle401Error(authReq, next, http, router);
      }
      return throwError(() => error);
    })
  );
};

function handle401Error(req: HttpRequest<unknown>, next: HttpHandlerFn, http: HttpClient, router: Router): Observable<HttpEvent<unknown>> {
  if (!isRefreshing) {
    isRefreshing = true;
    refreshTokenSubject.next(null);

    const refreshToken = localStorage.getItem('refreshToken');

    if (refreshToken) {
      return http.post<any>(`${API_BASE_URL}/api/v1/auth/refresh`, {
        refreshToken: refreshToken
      }).pipe(
        switchMap((res: any) => {
          isRefreshing = false;
          
          const newToken = res?.token || res?.accessToken || res?.data?.token || res?.data?.accessToken;
          const newRefreshToken = res?.refreshToken || res?.data?.refreshToken;
          
          if (newToken) {
             localStorage.setItem('accessToken', newToken);
             refreshTokenSubject.next(newToken);
             
             if (newRefreshToken) {
                 localStorage.setItem('refreshToken', newRefreshToken);
             }
             
             return next(req.clone({ setHeaders: { Authorization: `Bearer ${newToken}` } }));
          }
          
          // Fallback if no token in response
          clearAuth(router);
          return throwError(() => new Error('Refresh failed'));
        }),
        catchError((err) => {
          isRefreshing = false;
          clearAuth(router);
          return throwError(() => err);
        })
      );
    } else {
      isRefreshing = false;
      clearAuth(router);
      return throwError(() => new Error('No refresh token available'));
    }
  } else {
    // Block other requests until token is refreshed
    return refreshTokenSubject.pipe(
      filter(token => token != null),
      take(1),
      switchMap(jwt => {
        return next(req.clone({ setHeaders: { Authorization: `Bearer ${jwt}` } }));
      })
    );
  }
}

function clearAuth(router: Router) {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  router.navigate(['/login']);
}

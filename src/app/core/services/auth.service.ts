import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import {BehaviorSubject, catchError, EMPTY, map, Observable, of, switchMap, tap, throwError} from 'rxjs';
import {CookieService} from 'ngx-cookie-service';
import {environment} from '../../../enviroment/enviroment';
import ky from 'ky';

interface AuthResponse {
  access_token: string;
  refresh_token: string;
}

interface User {
  user_id: number;
  role: string;
  company_id: string;
}



@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public currentUser: Observable<any> = this.currentUserSubject.asObservable();
  public isLoggedIn$: Observable<boolean> = this.currentUser.pipe(
    map(user => !!user)
  );
  private client = ky.create({
    prefixUrl: environment.baseURL,
    credentials: 'include',
  });

  constructor(private http: HttpClient, private router: Router, private getCookiesService: CookieService) {
    const storedUser = localStorage.getItem('currentUser');
    this.currentUserSubject = new BehaviorSubject<User>(storedUser ? JSON.parse(storedUser) : null);
    this.currentUser = this.currentUserSubject.asObservable();
    this.isLoggedIn$ = this.currentUser.pipe(map(user => !!user));

    // ВСЕГДА вызываем проверку с сервера
    this.updateUserData();
  }


  refreshToken(): Observable<void> {
    return this.http.post<void>(`${environment.baseURL}/users/refresh/`, {}, { withCredentials: true })
      .pipe(
        tap(() => console.log("Token refreshed")),
        catchError(() => {
          this.logout();
          return EMPTY;
        })
      );
  }


  login(phone_number: number, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${environment.baseURL}/users/login/`, { phone_number, password }, { withCredentials: true })
      .pipe(
        tap(() => this.updateUserData()), // Обновляем данные пользователя после логина
        catchError(this.handleError)
      );
  }


  register(userData: any): Observable<any> {
    return this.http.post<any>(`${environment.baseURL}/users/register/`,userData, { withCredentials: true }).pipe(
      catchError(error => {
        console.error('Ошибка при регистрации:', error);
        return throwError(() => new Error(error.error?.message || 'Ошибка регистрации'));
      })
    );
  }


  private handleError(error: any): Observable<any> {
    throw error;
  }

  updateUserData(): void {
    this.refreshToken().pipe(
      switchMap(() => this.checkAuth()),
      catchError(() => {
        this.currentUserSubject.next(null);
        localStorage.removeItem('currentUser');
        return EMPTY;
      })
    ).subscribe();
  }


  // Метод для проверки авторизации на сервере
  checkAuth(): Observable<any> {
    return this.http.get<any>(`${environment.baseURL}/users/check/`, { withCredentials: true }).pipe(
      tap(user => {
        this.currentUserSubject.next(user);
        localStorage.setItem('currentUser', JSON.stringify(user));
      }),
      catchError(() => {
        this.currentUserSubject.next(null);
        localStorage.removeItem('currentUser');
        return of(null);
      })
    );
  }

  logout(): void {
    this.getCookiesService.deleteAll()
    this.currentUserSubject.next(null);
    localStorage.removeItem('currentUser');
    this.router.navigate(['/']);
  }



  get currentUserValue(): any {
    return this.currentUserSubject.value;
  }

  // Получение роли, ID и организации из токена
  get role(): string {
    return this.currentUserValue?.role || '';
  }

  get company(): string {
    return this.currentUserValue?.company_id || '';
  }

  get userId(): number {
    return this.currentUserValue?.user_id || 0;
  }

}

import { Injectable } from '@angular/core';
import ky from 'ky';  
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../../enviroment/enviroment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loginIn = new BehaviorSubject<boolean>(false);
  private currentUser = new BehaviorSubject<any | null>(null);
  public userLocalStorage: Observable<any> = this.currentUser.asObservable();
  public currentUserId: number | null = null;

  get loginIn$() {
    return this.loginIn.asObservable();
  }

  get currentUser$() {
    return this.currentUser.asObservable();
  }

  private api = ky.create({
    prefixUrl: environment.apiUrl,
    credentials: 'include',  
    hooks: {
      afterResponse: [
        async (request, options, response) => {
          if (response.status === 401) {
            try {
              // Попытка обновить токен
              const refreshResp = await ky.post(`${environment.apiUrl}/token-refresh/`, {
                credentials: 'include'
              });
  
              if (refreshResp.ok) {
                // Повторяем оригинальный запрос
                return ky(request, options);
              }
            } catch (refreshError) {
              console.error('Refresh failed:', refreshError);
            }
          }
          return response;
        }
      ]
    }
  });

  constructor() {
    this.checkTokenOnStartup();
  }

  getUserIdFromLocalStorage(): number | null {
    const userData = localStorage.getItem('dataUser');
    let currentUserId: number | null = null;
  
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        if (Array.isArray(parsedUser) && parsedUser.length > 0) {
          currentUserId = parsedUser[0].id;
        }
      } catch (e) {
        console.error('Ошибка при чтении user ID из localStorage:', e);
      }
    }
  
    return currentUserId;
  }  
  

  // Проверка токена при старте
  checkTokenOnStartup(): void {
    this.api.get('users/my-profile/')
      .then(response => {
        if (response.ok) {
          return response.json();
        }
        throw new Error('Invalid token');
      })
      .then((userProfile: any) => {
        this.currentUser.next(userProfile);
        console.log('userProfile:', userProfile);
        localStorage.setItem('dataUser', JSON.stringify(userProfile));
        this.loginIn.next(true);
      })
      .catch(() => {
        this.currentUser.next(null);
        this.currentUserId = null;
        this.loginIn.next(false);
      });
  }
  
  

  // Логика для входа и выхода пользователя
  async login(phone_number: string, password: string): Promise<boolean> {
    try {
      const response = await this.api.post('auth/', {
        json: { user: { phone_number, password } }
      }).json();
      this.loginIn.next(true);
      this.loadUserProfile();
      return true;
    } catch (error) {
      console.error('Login failed', error);
      this.loginIn.next(false);
      this.currentUser.next(null);
      return false;
    }
  }

  // Логика для загрузки профиля пользователя
  async loadUserProfile() {
    try {
      const response = await this.api.get('users/my-profile/');
      const userProfile = await response.json();
      if (userProfile) {
        this.currentUser.next(userProfile);
      }
    } catch (error) {
      console.error('Failed to load user profile:', error);
    }
  }

  logout() {
    window.location.reload(); // Перезагрузка страницы после выхода
    // Очистка данных из localStorage
    localStorage.removeItem('dataUser');

    // Отправка запроса на сервер для удаления cookies с HttpOnly флажком
    this.api.post('auth/logout/')
      .then(response => {
        if (response.ok) {
          this.loginIn.next(false);
          this.currentUser.next(null);
          console.log('Successfully logged out');     
        } else {
          console.error('Failed to log out');
        }
      })
      .catch(error => {
        console.error('Error during logout:', error);
      });
  }
  
  
}

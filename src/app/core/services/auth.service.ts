import { Injectable } from '@angular/core';
import ky from 'ky';  // Можно использовать любой HTTP клиент для запросов, например, ky или axios
import { BehaviorSubject } from 'rxjs';
import { environment } from '../../../enviroment/enviroment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loginIn = new BehaviorSubject<boolean>(false);
  private currentUser = new BehaviorSubject<any | null>(null);

  get loginIn$() {
    return this.loginIn.asObservable();
  }

  get currentUser$() {
    return this.currentUser.asObservable();
  }

  private api = ky.create({
    prefixUrl: environment.apiUrl,
    credentials: 'include',  // Убедись, что куки отправляются автоматически
  });

  constructor() {
    this.checkTokenOnStartup();
  }

  // Проверка токена при старте
  checkTokenOnStartup(): void {
    // Отправляем запрос на сервер для получения данных профиля
    this.api.get('users/profile/')  // Эндпоинт, который ты указал
      .then(response => {
        if (response.ok) {
          return response.json();
        }
        throw new Error('Invalid token');
      })
      .then((userProfile: any) => {
        // Если токен валиден, сохраняем информацию о пользователе
        this.currentUser.next(userProfile);
        this.loginIn.next(true);  // Пользователь авторизован
      })
      .catch(() => {
        // Если токен не валиден или произошла ошибка, ставим состояние как не авторизованное
        this.currentUser.next(null);
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
      const response = await this.api.get('users/profile/');
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
    localStorage.removeItem('userProfile');
    
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

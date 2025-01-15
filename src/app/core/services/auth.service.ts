import { Injectable } from '@angular/core';
import ky from 'ky';
import { environment } from '../../../enviroment/enviroment';
import { BehaviorSubject } from 'rxjs';

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
  });

  constructor() { }

  login(phone_number: number, password: string) {
    return this.api.post('token', {
      json: { phone_number, password },
      credentials: 'include'
    }).json()
      .then(async (data: any) => {
        if (data.access) {
          // Сохраняем токен в localStorage
          localStorage.setItem('token', data.access);
          this.loginIn.next(true);

          // Загружаем профиль пользователя
          await this.loadUserProfile();
        }
        return data;
      });
  }

  private async loadUserProfile() {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const userProfile: any = await this.api.get('users/profile/', {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        }).json();

        if (userProfile) {
          // Сохраняем весь объект профиля в localStorage
          localStorage.setItem('userProfile', JSON.stringify(userProfile));
          this.currentUser.next(userProfile);
        }
      } catch (error) {
        console.error('Failed to load user profile:', error);
      }
    }
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userProfile');
    this.loginIn.next(false);
    this.currentUser.next(null);
  }
}



  
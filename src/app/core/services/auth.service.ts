import { Injectable } from '@angular/core';
import ky from 'ky';
import { environment } from '../../../enviroment/enviroment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private api = ky.create({
    prefixUrl: environment.apiUrl,
    hooks: {
      beforeRequest: [
        (request) => {
          const csrfToken = getCookie('csrftoken'); // Получаем CSRF-токен из куков
          if (csrfToken) {
            request.headers.set('X-CSRFToken', csrfToken); // Устанавливаем заголовок с токеном
          }
        },
      ],
    },
  });
  constructor() { }
  login (phone_number: number, password: string) {
    return this.api.post('auth/login/', {
      json: {
        phone_number,
        password
      },
      credentials: 'include'
    }).json()
    .then(async(data: any) => 
      {
      if (data.token) {
        localStorage.setItem('token', data.token);
      }
      return data;
    }
  );
  }
}

  function getCookie(name: string) {
    const cookieValue = `; ${document.cookie}`;
    const parts = cookieValue.split(`; ${name}=`);
    if (parts.length === 2) {
      // @ts-ignore
      return parts.pop().split(';').shift();
    }
  }
  


  
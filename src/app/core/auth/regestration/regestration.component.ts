import { Component } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { Router } from '@angular/router';
import {AuthService} from '../../services/auth.service';

@Component({
  selector: 'app-regestration',
  standalone: false,

  templateUrl: './regestration.component.html',
  styleUrl: './regestration.component.css'
})
export class RegestrationComponent {

  form = {
    first_name: '',
    last_name: '',
    email: '',
    phone_number: '',
    password: '',
  };

  selectedFile: File | null = null;
  message = '';

  constructor(
    private apiservice: ApiService,
    private router: Router,
    private authservice: AuthService,
  ) {}

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  async register() {
    try {
      const formData = new FormData();
      formData.append('first_name', this.form.first_name);
      formData.append('last_name', this.form.last_name);
      formData.append('email', this.form.email);
      formData.append('phone_number', this.form.phone_number);
      formData.append('password', this.form.password);
      if (this.selectedFile) {
        formData.append('avatar', this.selectedFile);
      }

      const response = await this.authservice.register(formData);
      this.message = 'Пользователь успешно зарегистрирован!';
      console.log('Ответ:', response);
    } catch (error: any) {
      this.message = 'Ошибка: ' + (error.response?.message || error.message || 'Неизвестная ошибка');
      console.error('Ошибка:', error);
    }
  }
  goToLogin() {
    this.router.navigate(['auth/login']);
  }

}

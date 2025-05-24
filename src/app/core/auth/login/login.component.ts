import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: false
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  errorMessage: string | null = null;
  isLoading: boolean = false; // Флаг загрузки

  constructor(
    private router: Router,
    private authService: AuthService,
    private route: ActivatedRoute
  ) {
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      if (params['accessDenied']) {
        this.errorMessage = 'Доступ запрещен. У вас нет прав для доступа к этой странице.';
      }
    });

    // Инициализация формы
    this.loginForm = new FormGroup({
      phone: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
    });
  }

  submitLogin(): void {
    if (this.loginForm.valid) {
      const phone = this.loginForm.get('phone')?.value;
      const password = this.loginForm.get('password')?.value;

      this.isLoading = true;

      this.authService.login(phone, password).subscribe({
        next: () => {
          this.router.navigate(['/']);
          this.isLoading = false;
        },
        error: (error) => {
          this.isLoading = false;

          // Извлекаем ошибки из объекта
          const errorMessages = error || {};

          // Обрабатываем ошибки для email
          if (errorMessages.phone) {
            this.errorMessage = errorMessages.phone.join(', ');
            this.loginForm.controls['phone'].setErrors({serverError: this.errorMessage});
          }

          // Обрабатываем ошибки для password
          if (errorMessages.password) {
            this.errorMessage = errorMessages.password.join(', ');
            this.loginForm.controls['password'].setErrors({serverError: this.errorMessage});
          }

          // Если ошибок нет, показываем общее сообщение
          if (!errorMessages.email && !errorMessages.password) {
            this.errorMessage = 'Неизвестная ошибка. Попробуйте позже.';
          }
        },
      });
    }
  }
}

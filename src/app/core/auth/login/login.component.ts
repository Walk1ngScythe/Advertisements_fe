import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],  // Исправление здесь
  standalone: false
})
export class LoginComponent implements OnInit {

  loginForm!: FormGroup;

  constructor(
    private authService: AuthService, 
    private router: Router, 
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      phone: ['', [Validators.required, Validators.pattern(/^\+?[1-9]\d{1,14}$/)]],  // Use a regex for phone validation
      password: ['', [Validators.required, Validators.minLength(2)]], // Add validation for password length
    });
  }

  async onSubmit(): Promise<void> {
    if (this.loginForm.invalid) {
      alert('Пожалуйста, заполните все поля корректно.');
      return;
    }

    const { phone, password } = this.loginForm.value;

    try {
      const success = await this.authService.login(phone, password);
      if (success) {
        this.router.navigate(['']);
      } else {
        alert('Неудачный вход');
      }
    } catch (error) {
      console.error('Ошибка входа', error);
      alert('Произошла ошибка при входе');
    }
  }
}

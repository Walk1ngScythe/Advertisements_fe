import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { ChangeDetectorRef } from '@angular/core';
import ky from 'ky';
import { environment } from '../../../../enviroment/enviroment';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dropdown-menu-header',
  standalone: false,
  templateUrl: './dropdown-menu-header.component.html',
  styleUrls: ['./dropdown-menu-header.component.css']
})
export class DropdownMenuHeaderComponent implements OnInit {
  isloggedIn$;
  currentUser$;
  isDropdownOpen = false;
  userRole: string = '';
  canShowButton: boolean = false;
 
  private api = ky.create({
    prefixUrl: environment.apiUrl,
    credentials: 'include',  // Убедись, что куки отправляются автоматически
  });
  
  constructor(private authService: AuthService, private cdr: ChangeDetectorRef, private router: Router) {
    this.isloggedIn$ = this.authService.loginIn$;
    this.currentUser$ = this.authService.currentUser$;
  }

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => console.log(user));
    this.checkUserRole();
  }

  async checkUserRole() {
    try {
      const response = await this.api.get('get-role/')
        .json<{ role: string }>();
      // Показываем кнопку только если роль пользователя 'Salesman'
      this.canShowButton = response.role === 'Продавец';
    } catch (error) {
      console.error('Ошибка получения роли', error);
      this.canShowButton = false;  // В случае ошибки роль не определена, скрываем кнопку
    }
  }

  goToCreateAd() {
  this.router.navigate(['/create-ad']);
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  logout() {
    this.authService.logout(); // логика выхода в AuthService
    this.isDropdownOpen = false;
  }
}

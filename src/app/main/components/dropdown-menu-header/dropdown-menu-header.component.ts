import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { ChangeDetectorRef } from '@angular/core';
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
  canShowButton: boolean = false;

  constructor(private authService: AuthService, private cdr: ChangeDetectorRef, private router: Router) {
    this.isloggedIn$ = this.authService.isLoggedIn$;
    this.currentUser$ = this.authService.currentUser;

  }

  ngOnInit(): void {

    // принудительно вызываем проверку check, чтобы в случае чего localstorage обновился

    this.authService.updateUserData();

    this.authService.currentUser.subscribe(user => {
      console.log(user);
      this.canShowButton = user?.role === 'Продавец';
    });
  }

  goToCreateAd() {
  this.router.navigate(['/create-ad']);
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  logout() {
    this.authService.logout();
  }


  goToMyProfile() {
    const id = this.authService.userId;
    if (id) {
      this.router.navigate(["/my_profile/", id]);
    } else {
      console.warn("ID пользователя не найден");
    }
  }
}

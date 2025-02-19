import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { ChangeDetectorRef } from '@angular/core';

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
  currentRating: number = 3.5; // Рейтинг по умолчанию
  hearts: (boolean | 'partial')[] = []; // Массив для отображения заполненных сердечек
  filledHearts: number | undefined; // Количество полноценных сердечек
  partialHeart: number | undefined; // Дробная часть сердечка
  canShowButton = false;

  constructor(private authService: AuthService, private cdr: ChangeDetectorRef) {
    this.isloggedIn$ = this.authService.loginIn$;
    this.currentUser$ = this.authService.currentUser$;

    this.currentUser$.subscribe(() => {
      setTimeout(() => {
          this.cdr.detectChanges();
          console.log(this.currentUser$);
      });
    });
    
  }

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => console.log(user));
    // Получаем текущего пользователя и обновляем рейтинг, если он есть
    // this.currentUser$.subscribe(user => {
      // if (user && user.rating !== undefined) {
       // this.currentRating = user.rating;
       // this.updateHearts(this.currentRating);
      //}
    //});
  }

  updateHearts(rating: number) {
    this.filledHearts = Math.floor(rating); // Целая часть рейтинга
    this.partialHeart = rating - this.filledHearts; // Дробная часть рейтинга
    this.hearts = [];

    // Заполнение массива полноценных сердечек
    for (let i = 0; i < 5; i++) {
      if (i < this.filledHearts) {
        this.hearts.push(true); // Полностью заполненное сердечко
      } else if (i === this.filledHearts && this.partialHeart > 0) {
        this.hearts.push('partial'); // Частично заполненное сердечко
      } else {
        this.hearts.push(false); // Пустое сердечко
      }
    }
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  logout() {
    this.authService.logout(); // логика выхода в AuthService
    this.isDropdownOpen = false;
  }
}

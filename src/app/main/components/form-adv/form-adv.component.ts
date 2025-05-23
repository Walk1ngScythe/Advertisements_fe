import { Component, Input, OnInit } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-form-adv',
  standalone: false,
  templateUrl: './form-adv.component.html',
  styleUrls: ['./form-adv.component.css']
})
export class FormAdvComponent implements OnInit {
  
  adv: any[] = [];
  isMenuVisible = false; // Состояние отображения бокового меню
  isDropdownVisible = false; // Состояние отображения выпадающего меню категорий
  isDeleted: boolean | undefined;
  @Input() isUserProfile: boolean | undefined; // Переменная для определения, находимся ли мы на странице профиля пользователя
  @Input() authorId: number | undefined;

  constructor(private apiService: ApiService, private router: Router) { }

  ngOnInit(): void {
  if (this.authorId) {
    this.getAdv(this.authorId); // ← передаём isDeleted: false
  } else {
    this.getAdv(undefined, false);     // ← или просто this.getAdv(undefined, false);
  }
}


  getAdv(authorId?: number, isDeleted?: boolean): void {
  console.log("автор равен ыыы", authorId);

    if (isDeleted !== undefined) {
      // Если isDeleted передан — применяем фильтр
      this.apiService.getAdvertisements({ isDeleted }).then((data: any) => {
        this.adv = data;
      });
    } else {
      // Если isDeleted НЕ передан — вызываем без него
      this.apiService.getAdvertisements({ authorId }).then((data: any) => {
        this.adv = data;
      });
    }
  }


  

  goToDetailPage(id: number): void {
      this.router.navigate(['/ad-detail', id]); 
    console.log(`Перехожу на страницу с ID: ${id}`);
  }
  
}

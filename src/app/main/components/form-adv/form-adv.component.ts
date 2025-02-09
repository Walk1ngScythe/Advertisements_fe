import { Component, OnInit } from '@angular/core';
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

  constructor(private apiService: ApiService, private router: Router) { }

  ngOnInit(): void {
    this.getAdv(); 
  }

  getAdv() {
    this.apiService.getAdvertisements().then((data: any) => {
      this.adv = data;
    });
  }

  toggleMenu(): void {
    this.isMenuVisible = !this.isMenuVisible;
  }

  toggleDropdown(): void {
    this.isDropdownVisible = !this.isDropdownVisible;
  }

  goToDetailPage(id: number): void {
      this.router.navigate(['/ad-detail', id]); 
    console.log(`Перехожу на страницу с ID: ${id}`);
  }
}

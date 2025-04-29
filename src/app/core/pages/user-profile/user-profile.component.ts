import { Component } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ApiService } from '../../services/api.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-user-profile',
  standalone: false,
  
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css'
})
export class UserProfileComponent {
  adv: any[] = [];
  public user$ = new BehaviorSubject<any | null>(null); // Создаем BehaviorSubject

  constructor(private route: ActivatedRoute, private apiService: ApiService) {}

  ngOnInit(): void {
    const userId = this.route.snapshot.paramMap.get('id'); // Получаем ID из URL
    if (userId) {
      this.apiService.getUserById(userId).then(userData => {
        this.user$.next(userData); // Обновляем значение в BehaviorSubject
        console.log(this.user$)
      }).catch(error => console.error('Ошибка загрузки пользователя:', error));
    }
  }
}

import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ApiService } from '../../services/api.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-user-profile',
  standalone: false,
  
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css'
})
export class UserProfileComponent implements OnInit {
  
  public user$ = new BehaviorSubject<any | null>(null); // Создаем BehaviorSubject
  authorId!: number;

  constructor(private route: ActivatedRoute, private apiService: ApiService) {}

  ngOnInit(): void {
    const userId = this.route.snapshot.paramMap.get('id'); // уже string
    if (userId) {
      this.authorId = +userId; // преобразуем в число
    }
    if (userId) {
      this.apiService.getUserById(userId).then(userData => {
        this.user$.next(userData);
        console.log(this.user$.value);
      }).catch(error => console.error('Ошибка загрузки пользователя:', error));
    }
  }
  
  
}

import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { BehaviorSubject } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-profile',
  standalone: false,
  
  templateUrl: './my-profile.component.html',
  styleUrl: './my-profile.component.css'
})
export class MyProfileComponent {
  public user$ = new BehaviorSubject<any | null>(null); // Создаем BehaviorSubject
  myauthorId!: number;
  currentUser$;  

  constructor(private authService: AuthService, private route: ActivatedRoute, private apiService: ApiService) {
    this.currentUser$ = this.authService.currentUser$;
    
  }
  ngOnInit(): void {
    const myuserId = this.route.snapshot.paramMap.get('id'); // уже string
    if (myuserId) {
      this.myauthorId = +myuserId; // преобразуем в число
    }
    if (myuserId) {
      this.apiService.getUserById(myuserId).then(userData => {
        this.user$.next(userData);
        console.log(this.user$.value);
      }).catch(error => console.error('Ошибка загрузки пользователя:', error));
  
    }
  }     
}

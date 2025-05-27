import {Component, OnInit} from '@angular/core';
import { AuthService } from '../../services/auth.service';
import {BehaviorSubject, Observable} from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { ModalService } from '../../../../shared/model/modal.services';

@Component({
  selector: 'app-profile',
  standalone: false,
  templateUrl: './my-profile.component.html',
  styleUrl: './my-profile.component.css'
})

export class MyProfileComponent implements OnInit {
  canShowButton: boolean = true;
  public user$ = new BehaviorSubject<any | null>(null);
  public currentUser$: Observable<any | null>; // только тип, без инициализации
  myauthorId!: number;

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private apiService: ApiService,
    public modalService: ModalService
  ) {
    this.currentUser$ = this.authService.currentUser;
  }

  ngOnInit(): void {
    const myuserId = this.route.snapshot.paramMap.get('id');
    if (myuserId) {
      this.myauthorId = +myuserId;
      this.apiService.getUserById(myuserId)
        .then(userData => this.user$.next(userData))
        .catch(error => console.error('Ошибка загрузки пользователя:', error));
      this.authService.currentUser.subscribe(user => {
        if (user?.role === 'Продавец') {
          this.canShowButton = false;
        } else {
          this.canShowButton = true;
        }
      });
    }
  }

  openCompanyRequest() {
    this.modalService.open('companyRequest');
  }
}



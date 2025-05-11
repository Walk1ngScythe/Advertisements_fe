import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../../core/services/api.service';
import { AuthService } from '../../services/auth.service';
import { ModalService } from '../../../../shared/model/modal.services';

@Component({
  selector: 'app-ad-detail',
  standalone: false,
  templateUrl: './ad-detail.component.html',
  styleUrls: ['./ad-detail.component.css']
})
export class AdDetailComponent implements OnInit {
  currentUser$;
  ad: any = null;
  adId: string | null = null;
  selectedImage: string | null = null;
  phoneVisible: boolean = false;
  isFavorite: boolean = false;
  similarAds: any[] = [];
  reviews: any[] = [];
  authorId: number | null = null;
  currentUserId!: number;
   

  constructor(private route: ActivatedRoute, private apiService: ApiService, private router: Router, private authService: AuthService, public modalService: ModalService) {
    this.currentUser$ = this.authService.currentUser$;
    
  }

  ngOnInit(): void {
    this.adId = this.route.snapshot.paramMap.get('id');
    if (this.adId) {
      this.getAdDetail(this.adId);
      this.getSimilarAds(this.adId);
      this.getReviews(this.adId);
    };

    this.currentUser$.subscribe(user => {
      if (user) {
        this.currentUserId = user.id;
      }
    });
  }

  getAdDetail(id: string): void {
    this.apiService.getAdvertisementById(id).then((data) => {
      this.ad = data;
      this.selectedImage = data.main_image;
      this.authorId = data.author?.id; // authorId — это number

      console.log("Автор ID:", this.authorId);

      if (this.authorId) {
        this.getReviews(this.authorId.toString()); // Преобразуем в строку перед передачей
      }
    }).catch((error) => {
      console.error('Ошибка при загрузке объявления:', error);
    });
  }


  
  getSimilarAds(id: string): void {
    this.apiService.getSimilarAds(id).then((ads) => {
      this.similarAds = ads;
    }).catch((error) => {
      console.error('Ошибка при загрузке похожих объявлений:', error);
    });
  }

  getReviews(authorId: string): void {
    this.apiService.getReviews(authorId).then((reviews) => {
      this.reviews = reviews;
    }).catch((error) => {
      console.error('Ошибка при загрузке отзывов:', error);
    });
  }

  toggleFavorite(): void {
    this.isFavorite = !this.isFavorite;
    console.log(this.isFavorite ? 'Добавлено в избранное' : 'Удалено из избранного');
  }

  showPhone(): void {
    this.phoneVisible = true;
  }

  onRubricClick(rubricName: string): void {
    console.log(`Вы кликнули на рубрику: ${rubricName}`);
  }

  selectImage(image: string): void {
    this.selectedImage = image;
  }
  goToUserProfilePage(authorId: number): void {
    const myId = this.authService.getUserIdFromLocalStorage();

    if (authorId === myId) {
      this.router.navigate(['/my_profile']);
      
    } else {
      this.router.navigate(['/users', authorId]);
    }
    console.log(`fffffffffffffffff с ID: ${myId}`);
    console.log(`Перехожу на страницу пользователя с ID: ${authorId}`);

  }
  openReport() {
    // Передаём authorId в модалку, используя ModalService
    if (this.authorId !== null) {
      this.modalService.open('report', { authorId: this.authorId });
      console.log("Открылось с автором ID:", this.authorId);
    } else {
      console.warn("authorId не определён");
    }
  }
}

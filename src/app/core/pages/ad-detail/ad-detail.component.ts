import { Component, Input, input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
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
  useridauthor: boolean = false;

  slideConfig = {
    slidesToShow: 1,
    slidesToScroll: 1,
    dots: true,
    arrows: true,
    autoplay: false,
    autoplaySpeed: 3000,
    infinite: true
  };


  constructor(private route: ActivatedRoute, private apiService: ApiService, private router: Router, private authService: AuthService, public modalService: ModalService) {
    this.currentUser$ = this.authService.currentUser;
  }

  ngOnInit(): void {
    this.adId = this.route.snapshot.paramMap.get('id');
    if (this.adId) {
      this.getAdDetail(this.adId);
    }

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
      const myId = this.authService.userId;
      if (this.authorId === myId) {
      this.useridauthor = true;
      }
      if (this.authorId) {
        this.loadReviews(this.authorId.toString());
      }
    }).catch((error) => {
      console.error('Ошибка при загрузке объявления:', error);
    });
  }

  get images(): any[] {
    return Array.isArray(this.ad?.images) ? this.ad!.images : [];
  }


  loadReviews(authorId: string): void {
    this.apiService.getSellerReviews(authorId).then((reviews) => {
      this.reviews = reviews.results;
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
    const myId = this.authService.userId;
    if (authorId === myId) {
      this.router.navigate(['/my_profile', authorId]);
    } else {
      this.router.navigate(['/users', authorId]);
    }
  }

  openReport() {
    if (this.authorId !== null) {
      this.modalService.open('report', { authorId: this.authorId });
    } else {
      console.warn("authorId не определён");
    }
  }



  editAd() {
    this.router.navigate(['/edit-ad/', this.adId]);
  }

  async deleteAd(): Promise<void> {
    this.adId = this.route.snapshot.paramMap.get('id');
    if (!this.adId) {
      console.error('ID объявления не найден');
      return;
    }
    try {
      const result = await this.apiService.deleteAdv(this.adId);
      window.location.reload();
    } catch (error) {
      console.error('Ошибка при удалении:', error);
    }
  }
}

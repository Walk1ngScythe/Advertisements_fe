import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../../core/services/api.service';

@Component({
  selector: 'app-ad-detail',
  standalone: false,
  templateUrl: './ad-detail.component.html',
  styleUrls: ['./ad-detail.component.css']
})
export class AdDetailComponent implements OnInit {
  ad: any = null;
  adId: string | null = null;
  selectedImage: string | null = null;
  phoneVisible: boolean = false;
  isFavorite: boolean = false;
  similarAds: any[] = [];
  reviews: any[] = [];

  constructor(private route: ActivatedRoute, private apiService: ApiService) {}

  ngOnInit(): void {
    this.adId = this.route.snapshot.paramMap.get('id');
    if (this.adId) {
      this.getAdDetail(this.adId);
      this.getSimilarAds(this.adId);
      this.getReviews(this.adId);
    };
  
  }

  getAdDetail(id: string): void {
    this.apiService.getAdvertisementById(id).then((data) => {
      this.ad = data;
      this.selectedImage = data.main_image;
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

  getReviews(id: string): void {
    this.apiService.getReviews(id).then((reviews) => {
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
}

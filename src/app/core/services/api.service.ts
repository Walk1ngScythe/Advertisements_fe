import { Injectable } from '@angular/core';
import ky from 'ky';
import { environment } from '../../../enviroment/enviroment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private client = ky.create({
    prefixUrl: environment.apiUrl,
    credentials: 'include',
  });
  constructor() { }

  getAdvertisementById(id: string): Promise<any> {
    return this.client.get(`bbs/${id}`).json();
  }
  getSimilarAds(adId: string): Promise<any[]> {
    return this.client.get<any[]>(`bbs/${adId}/similar`).json();
  }
  
  getReviews(sellerId: string): Promise<any[]> {
    return this.client.get<any[]>(`users/${sellerId}/reviews/`).json();
  }
  getUserById(id: string): Promise<any> {
    return this.client.get<any[]>(`users/profile/${id}/`).json();
  }
  async getAdvertisements(authorId?: number): Promise<any> {
    
    let url = 'bbs/';  // URL для получения всех объявлений
    if (authorId) {
      url += `?author=${authorId}`; 
      console.log(url) // Добавление фильтра по автору
    }
    return this.client.get(url).json();
  }  
}

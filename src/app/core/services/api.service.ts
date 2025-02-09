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

  async getAdvertisements(): Promise<any> {
    return await this.client.get('bbs/').json();
  } 
  getAdvertisementById(id: string): Promise<any> {
    return this.client.get(`bbs/${id}`).json();
  }
  getSimilarAds(adId: string): Promise<any[]> {
    return this.client.get<any[]>(`bbs/${adId}/similar`).json();
  }
  getReviews(adId: string): Promise<any[]> {
    return this.client.get<any[]>(`/api/ads/${adId}/reviews`).json();
  }
}

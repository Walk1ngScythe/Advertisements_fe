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
    let url = 'bbs/';
    if (authorId) {
      url += `?author=${authorId}`;
      console.log(url)
    }
    return this.client.get(url).json();
  }

  async sendComplaint(authorId: number, description: string): Promise<any> {
    try {
      const response = await this.client.post('complaints/', {
        json: { recipient: authorId, description }
      }).json();
      return response;
    } catch (error) {
      console.error('Ошибка при отправке жалобы:', error);
      throw error;
    }
  }

}

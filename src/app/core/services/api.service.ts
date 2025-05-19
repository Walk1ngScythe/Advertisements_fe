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
  getRubric(): Promise<any[]> {
    return this.client.get(`rubrics/`).json();
  }

  createAd(formData: FormData): Promise<any> {
  return this.client.post('bbs/', {
    body: formData
  }).json();
  }

  uploadImage(formData: FormData): Promise<any> {
  return this.client.post('images/', {
    body: formData
  }).json();
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

  deleteAdv(idAdDelete: string): Promise<Response> {
    return this.client.delete(`bbs/${idAdDelete}/`);
  }


  async getAdvertisements(filters: { 
  authorId?: number; 
  isDeleted?: boolean; 
  title?: string 
  } = {}): Promise<any> {
    const params: string[] = [];

    if (filters.authorId !== undefined) {
      params.push(`author=${filters.authorId}`);
    }

    if (filters.isDeleted !== undefined) {
      params.push(`is_deleted=${filters.isDeleted}`);
    }

    if (filters.title !== undefined && filters.title.trim() !== '') {
      params.push(`title=${encodeURIComponent(filters.title.trim())}`);
    }

    const query = params.length > 0 ? '?' + params.join('&') : '';
    const url = `bbs/${query}`;

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

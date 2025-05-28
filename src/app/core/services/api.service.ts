import { Injectable } from '@angular/core';
import ky from 'ky';
import { environment } from '../../../enviroment/enviroment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private client = ky.create({
    prefixUrl: environment.baseURL,
    credentials: 'include',
  });

  constructor() { }

  getAdvertisementById(id: string): Promise<any> {
    return this.client.get(`bbs/${id}`).json();
  }

  getRubric(): Promise<any> {
    return this.client.get<{ results: any[] }>(`rubrics/`).json();
  }

  createAd(formData: FormData): Promise<any> {
  return this.client.post('bbs_edit/', {
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

  updateAd(adId: number, formData: FormData): Promise<any> {
    return this.client.patch(`bbs_edit/${adId}/`, {
      body: formData,
    }).json();
  }

  async uploadAdImages(adId: number, files: File[]): Promise<any[]> {
    const uploaded = [];

    for (let i = 0; i < files.length; i++) {
      const formData = new FormData();
      formData.append('bb', String(adId));
      formData.append('image', files[i]);

      const response = await this.uploadImage(formData);
      uploaded.push(response);
    }

    return uploaded;
  }


  getSellerReviews(sellerId: string): Promise<any> {
    return this.client.get<{ results: any[] }>(`users/${sellerId}/reviews/`).json();
  }

  getUserById(id: string): Promise<any> {
    return this.client.get(`users/profile/${id}/`).json<any>().then(response => response.results[0]);
  }


  deleteAdv(idAdDelete: string): Promise<Response> {
    return this.client.delete(`bbs_edit/${idAdDelete}/`);
  }

  async submitCompanyRequest(formData: FormData): Promise<any> {
    try {
      return await this.client.post(`applications/create/`, {
        body: formData,
        credentials: 'include', // если используешь куки для авторизации
      }).json();
    } catch (error) {
      console.error('Ошибка при отправке заявки на компанию:', error);
      throw error;
    }
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

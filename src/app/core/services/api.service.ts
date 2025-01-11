import { Injectable } from '@angular/core';
import ky from 'ky';
import { environment } from '../../../enviroment/enviroment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private client = ky.create({
    prefixUrl: environment.apiUrl,
  });
  constructor() { }

  async getAdvertisements(): Promise<any> {
    return await this.client.get('bbs/').json();
  }
}

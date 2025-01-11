import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';

@Component({
  selector: 'app-form-adv',
  standalone: false,
  
  templateUrl: './form-adv.component.html',
  styleUrl: './form-adv.component.css'
})
export class FormAdvComponent implements OnInit {
  adv: any[] = [];

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.getAdv();
  }

  getAdv() {
    this.apiService.getAdvertisements().then((data: any) => {
        this.adv = data;
    });
  }
}

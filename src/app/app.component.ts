import { Component } from '@angular/core';
import { ModalService } from '../shared/model/modal.services';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Advertisements_fe';
  constructor(public modalService: ModalService) {}
}

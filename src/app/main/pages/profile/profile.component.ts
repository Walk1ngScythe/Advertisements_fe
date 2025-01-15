import { Component } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: false,
  
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {

      currentUser$;  
      constructor(private authService: AuthService) {
        this.currentUser$ = this.authService.currentUser$;
      }
}

import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: false,
  
  templateUrl: './my-profile.component.html',
  styleUrl: './my-profile.component.css'
})
export class MyProfileComponent {

      currentUser$;  
      constructor(private authService: AuthService) {
        this.currentUser$ = this.authService.currentUser$;
        
      }
      
}

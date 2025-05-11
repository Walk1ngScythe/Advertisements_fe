import { Component } from '@angular/core';



@Component({
  selector: 'app-defolt-layout',
  standalone: false,
  template: `
  <app-header></app-header>
  <main class="min-h-screen bg-gray-800 text-white flex">
    <section class="px-64">
      <router-outlet></router-outlet>
    </section>
  </main>
   
  `
})
export class DefoltLayoutComponent {
  
      constructor() {
        
      }
}

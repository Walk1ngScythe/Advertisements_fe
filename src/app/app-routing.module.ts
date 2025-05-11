import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MyProfileComponent } from './core/pages/my-profile/my-profile.component';
import { AdDetailComponent } from './core/pages/ad-detail/ad-detail.component';
import { UserProfileComponent } from './core/pages/user-profile/user-profile.component';
import { DefoltLayoutComponent } from '../shared/theme/defolt-layout.component';
import { main_routes } from './main/main-routing.module';

 


const routes: Routes = [
  { path: '', component: DefoltLayoutComponent, children: main_routes }, // Используйте массив маршрутов
  { path: 'auth', loadChildren: () => import('./core/auth/auth.module').then(m => m.AuthModule) },
  { path: '', redirectTo: '/auth/login', pathMatch: 'full' },
  { path: 'my_profile',  component: MyProfileComponent},
  { path: 'ad-detail/:id', component: AdDetailComponent },
  { path: 'users/:id', component: UserProfileComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

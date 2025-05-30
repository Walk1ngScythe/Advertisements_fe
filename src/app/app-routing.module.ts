import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MyProfileComponent } from './core/pages/my-profile/my-profile.component';
import { AdDetailComponent } from './core/pages/ad-detail/ad-detail.component';
import { UserProfileComponent } from './core/pages/user-profile/user-profile.component';
import { DefoltLayoutComponent } from '../shared/theme/defolt-layout.component';
import { main_routes } from './main/main-routing.module';
import { CreateAdComponent } from './core/pages/create-ad/create-ad.component';
import {authGuard} from '../shared/guards/auth.guard';
import {EditAdComponent} from './core/pages/edit-ad/edit-ad.component';
import {EditUserComponent} from './core/pages/edit-user/edit-user.component';


const routes: Routes = [
  {
    path: '',
    component: DefoltLayoutComponent,
    children: [
      ...main_routes,
      { path: 'my_profile/:id', component: MyProfileComponent, canActivate: [authGuard] },
      { path: 'ad-detail/:id', component: AdDetailComponent },
      { path: 'users/:id', component: UserProfileComponent  },
      { path: 'create-ad', component: CreateAdComponent,  canActivate: [authGuard] },
      { path: 'edit-ad/:id', component: EditAdComponent,  canActivate: [authGuard] },
      { path: 'my-profile/edit/:id', component: EditUserComponent, canActivate: [authGuard] },
    ]
  },
  {
    path: 'auth',
    loadChildren: () => import('./core/auth/auth.module').then(m => m.AuthModule)
  },
  {
    path: '',
    redirectTo: '/auth/login',
    pathMatch: 'full'
  }
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

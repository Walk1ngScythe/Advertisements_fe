import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './main/pages/home/home.component';
import { MyProfileComponent } from './core/pages/my-profile/my-profile.component';
import { AdDetailComponent } from './core/pages/ad-detail/ad-detail.component';
import { HeaderComponent } from './main/components/header/header.component';
import { UserProfileComponent } from './core/pages/user-profile/user-profile.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'auth', loadChildren: () => import('./core/auth/auth.module').then(m => m.AuthModule) },
  { path: '', redirectTo: '/auth/login', pathMatch: 'full' },
  { path: 'my_profile',  component: MyProfileComponent},
  { path: 'ad-detail/:id', component: AdDetailComponent },
  { path: 'bbs', component: HeaderComponent },
  { path: 'users/:id', component: UserProfileComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './main/pages/home/home.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'auth', loadChildren: () => import('./core/auth/auth.module').then(m => m.AuthModule) },
  { path: '', redirectTo: '/auth/login', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

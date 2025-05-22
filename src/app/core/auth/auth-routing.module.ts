import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegestrationComponent } from './regestration/regestration.component';

const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegestrationComponent },  // добавляем маршрут регистрации
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AuthRoutingModule { }

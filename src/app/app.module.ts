import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './main/components/header/header.component';
import { HomeComponent } from './main/pages/home/home.component';
import { FormAdvComponent } from './main/components/form-adv/form-adv.component';
import { AuthModule } from './core/auth/auth.module';
import { ReactiveFormsModule } from '@angular/forms';
import { DropdownMenuHeaderComponent } from './main/components/dropdown-menu-header/dropdown-menu-header.component';
import { MyProfileComponent } from './core/pages/my-profile/my-profile.component';
import { registerLocaleData } from '@angular/common';
import localeRu from '@angular/common/locales/ru';
import { LOCALE_ID } from '@angular/core';
import { AdDetailComponent } from './core/pages/ad-detail/ad-detail.component'
import { register } from 'swiper/element/bundle';
import { UserProfileComponent } from './core/pages/user-profile/user-profile.component';
import { DefoltLayoutComponent } from '../shared/theme/defolt-layout.component';
import { ReportModalComponent } from '../features/report.component';
import { FormsModule } from '@angular/forms';
import { CreateAdComponent } from './core/pages/create-ad/create-ad.component';
import {HTTP_INTERCEPTORS, provideHttpClient, withInterceptors} from '@angular/common/http';
import {tokenInterceptor} from './core/interceptors/token.interceptor';
import {SlickCarouselModule} from "ngx-slick-carousel";
import {CompanyRequestComponent} from '../features/companyRequest.component';
import { EditAdComponent } from './core/pages/edit-ad/edit-ad.component';
import { EditUserComponent } from './core/pages/edit-user/edit-user.component';
import {ChangePasswordModalComponent} from '../features/change-password-modal.component';

register();
registerLocaleData(localeRu); // Регистрация русской локализации

@NgModule({
  declarations: [
    AppComponent,
    DefoltLayoutComponent,
    HeaderComponent,
    HomeComponent,
    FormAdvComponent,
    DropdownMenuHeaderComponent,
    MyProfileComponent,
    AdDetailComponent,
    UserProfileComponent,
    ReportModalComponent,
    CreateAdComponent,
    CompanyRequestComponent,
    EditAdComponent,
  ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        ReactiveFormsModule,
        AuthModule,
        FormsModule,
        SlickCarouselModule,

    ],
  exports: [
    HeaderComponent
  ],
  providers: [
    {
      provide: LOCALE_ID, useValue: 'ru',
    },

    provideHttpClient(withInterceptors([tokenInterceptor])),

  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }

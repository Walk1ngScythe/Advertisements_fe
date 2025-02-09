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
register();
registerLocaleData(localeRu); // Регистрация русской локализации

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    HomeComponent,
    FormAdvComponent,
    DropdownMenuHeaderComponent,
    MyProfileComponent,
    AdDetailComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    AuthModule,
  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'ru' }  // Установка локали по умолчанию на русский
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './main/components/header/header.component';
import { HomeComponent } from './main/pages/home/home.component';
import { FormAdvComponent } from './main/components/form-adv/form-adv.component';
import { AuthModule } from './core/auth/auth.module';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    HomeComponent,
    FormAdvComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    AuthModule
    
    
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

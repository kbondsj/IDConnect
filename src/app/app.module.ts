import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RegistrationComponent } from './registration/registration.component';
import { EventsComponent } from './events/events.component';
import { HttpClientModule } from '@angular/common/http';
import { HomeComponent } from './home/home.component';
import { AnnouncementsComponent } from './announcements/announcements.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AdminComponent } from './admin/admin.component';
import { CommonModule } from '@angular/common';
//import { StripeModule } from "stripe-angular";
//import { PaymentCaptureComponent } from './payment-capture/payment-capture.component'
import { NgxPayPalModule } from 'ngx-paypal';

@NgModule({
  declarations: [
    AppComponent,
    RegistrationComponent,
    EventsComponent,
    HomeComponent,
    AnnouncementsComponent,
    AdminComponent,
    //PaymentCaptureComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    CommonModule,
    //StripeModule.forRoot("pk_test_51NNmHkHQAOmDZaHdfpKhCsKg23qLVCAeRJ7WZMmcztzDv4WjgmUEW5o6KFvfcWGZ5aeSMlC4ceMXKhuZOCGCbuDa00i1hEMHVj")
    NgxPayPalModule
    
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

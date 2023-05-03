import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { FIREBASE_OPTIONS } from '@angular/fire/compat';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { initializeApp,provideFirebaseApp } from '@angular/fire/app';
import { environment } from '../environments/environment';
import { provideAuth,getAuth } from '@angular/fire/auth';
import { provideFirestore,getFirestore } from '@angular/fire/firestore';
import { provideStorage,getStorage } from '@angular/fire/storage';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { TrainingHistoryComponent } from './training-history/training-history.component';
import { NgChartsModule } from 'ng2-charts';


@NgModule({
  declarations: [AppComponent, TrainingHistoryComponent],
  imports: [HttpClientModule, CommonModule, BrowserModule, NgChartsModule, IonicModule.forRoot(),
    AppRoutingModule, provideFirebaseApp(() => initializeApp(environment.firebase)), 
    provideAuth(() => getAuth()), provideFirestore(() => getFirestore()), provideStorage(() => getStorage())],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }, { provide: FIREBASE_OPTIONS, useValue: environment.firebase }],
  bootstrap: [AppComponent],
})
export class AppModule {}

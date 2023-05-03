import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { NgChartsModule } from 'ng2-charts';
import { StatsComponent } from './stats.component';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from '../app-routing.module';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { environment } from 'src/environments/environment';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getStorage, provideStorage } from '@angular/fire/storage';
import { Firestore, collectionData, docData, orderBy, query } from '@angular/fire/firestore';

 describe('StatsComponent', () => {
  let component: StatsComponent;
  let fixture: ComponentFixture<StatsComponent>;

   beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ StatsComponent ],
      imports: [IonicModule.forRoot(), HttpClientModule, CommonModule,NgChartsModule, BrowserModule, IonicModule.forRoot(),
        AppRoutingModule, provideFirebaseApp(() => initializeApp(environment.firebase)), 
        provideAuth(() => getAuth()), provideFirestore(() => getFirestore()), provideStorage(() => getStorage())]
    }).compileComponents();
    fixture = TestBed.createComponent(StatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

    it('should have a fkin uid',  () => {
      expect(component).toBeTruthy();
  });


});

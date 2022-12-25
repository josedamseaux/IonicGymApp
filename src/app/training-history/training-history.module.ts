import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { TrainingHistoryComponent } from './training-history.component';
import { TrainingHistoryRoutingModule } from './traininghistory-routing.module';
import { BrowserModule } from '@angular/platform-browser';




@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        TrainingHistoryRoutingModule,
        BrowserModule,
    ],
    declarations: [],
})
export class TrainingHistoryModule {}

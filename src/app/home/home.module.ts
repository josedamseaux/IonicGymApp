import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HomePage } from './home.page';
import { StatsComponent } from '../stats/stats.component';
import { NgChartsModule } from 'ng2-charts';
import { TrainingHistoryComponent } from '../training-history/training-history.component';
import { HomePageRoutingModule } from './home-routing.module';


@NgModule({
    declarations: [HomePage, StatsComponent, TrainingHistoryComponent],
    imports: [
        NgChartsModule,
        ReactiveFormsModule,
        CommonModule,
        FormsModule,
        IonicModule,
        HomePageRoutingModule,
        
    ]
})
export class HomePageModule {}

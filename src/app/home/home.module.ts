import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { HomePage } from './home.page';
import { StatsComponent } from '../stats/stats.component';
import { NgChartsModule } from 'ng2-charts';
import { HomePageRoutingModule } from './home-routing.module';


@NgModule({
    declarations: [HomePage, StatsComponent],
    imports: [
        NgChartsModule,
        CommonModule,
        IonicModule,
        HomePageRoutingModule,
    ]
})
export class HomePageModule {}

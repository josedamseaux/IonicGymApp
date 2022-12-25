import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TrainingHistoryComponent } from './training-history.component';
import { HomePage } from '../home/home.page';

const routes: Routes = [
  {
    path: 'training-history',
    component: TrainingHistoryComponent,
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TrainingHistoryRoutingModule {}

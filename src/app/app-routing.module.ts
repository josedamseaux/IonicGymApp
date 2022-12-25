import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

import { redirectUnauthorizedTo, redirectLoggedInTo, canActivate } from '@angular/fire/auth-guard';
import { HomePage } from './home/home.page';
import { TrainingHistoryComponent } from './training-history/training-history.component';

const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['']);
const redirectLoggedInToHome = () => redirectLoggedInTo(['home']);

export class EmptyComponent {}

const routes: Routes = [

  // {
  //   path: '',
  //   loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule),
  //   ...canActivate(redirectLoggedInToHome)
  // },
  {
    path: '',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule),
    // ...canActivate(redirectUnauthorizedToLogin)
    
  },
  // {
  //   path: '',
  //   redirectTo: '/home', 
  //   pathMatch: 'full'
  // },
  { path: 'training-history',  component: TrainingHistoryComponent },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }, ), 
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }

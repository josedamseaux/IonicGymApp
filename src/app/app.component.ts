import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import * as firebase from 'firebase/app';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(
    private platform: Platform,
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      firebase.initializeApp(environment.firebase);
    });
  }
}

import { Component } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Observable } from 'rxjs/internal/Observable';
import { format }  from 'date-fns'  ;

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  constructor(private alertController: AlertController) { }

  async firstButtonForTrained() {
    const alert = await this.alertController.create({
      header: 'Did you train today?',
      buttons: [
        {
          text: 'No',
          role: 'no',
        },
        {
          text: 'Yes',
          role: 'confirm',
          handler: () => {
            alert.dismiss()
            this.nextButtonForTrained()
          },
        },
      ],
    });

    await alert.present();

  }

  muscleTrained: Observable<any[]>;
  muscleTrained2 = [];

  dayTrained = {
    dayTrained: '',
    musclesTrained: [],
    Intensity: ''
  }



  async nextButtonForTrained() {
    const alert = await this.alertController.create({
      header: 'Select training',
      buttons: ['OK'],
      inputs: [
        {
          label: 'Bicep',
          type: 'checkbox',
          value: 'Bicep',
        },
        {
          label: 'Tricep',
          type: 'checkbox',
          value: 'Tricep',
        },
        {
          label: 'Chest',
          type: 'checkbox',
          value: 'Chest',
        },
        {
          label: 'Shoulders',
          type: 'checkbox',
          value: 'Shoulders',
        },
        {
          label: 'Back',
          type: 'checkbox',
          value: 'Back',
        },
        {
          label: 'Legs',
          type: 'checkbox',
          value: 'legs',

        },
        {
          label: 'Glutes',
          type: 'checkbox',
          value: 'Glutes',

        },
        {
          label: 'Gemelos',
          type: 'checkbox',
          value: 'Gemelos',

        },
        {
          label: 'Cardio',
          type: 'checkbox',
          value: 'Cardio',
        },
      ],
    })

    const alert2 = await this.alertController.create({
      header: 'Intensity',
      buttons: [
        {
          text: 'Normal',
          role: 'normal',
          handler: () => {
            this.dayTrained.Intensity = 'Normal';
          },
        },
        {
          text: 'Intense',
          role: 'intense',
          handler: () => {
            this.dayTrained.Intensity = 'Intense';

          },
        },
      ],
    });
    await alert2.present()
    console.log(this.dayTrained)
    await alert.present()

    

    await alert.onDidDismiss()
      .then(data => {
        console.log(data.data.values)
        const date = new Date();
        this.dayTrained.musclesTrained = data.data.values
        this.dayTrained.dayTrained = format(date, 'dd.MM.yyyy')
        
        console.log(this.dayTrained)
        console.log(`Today is: ${format(date, 'dd.MM.yyyy')}`);
      })


  }




}

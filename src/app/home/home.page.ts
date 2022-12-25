import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { format } from 'date-fns';
import { AuthService } from '../services/auth.service';
import { ActivationStart, Router, RouterOutlet } from '@angular/router';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { Firestore, FieldValue, serverTimestamp } from '@angular/fire/firestore';
import { CollectionReference, DocumentData, collection } from '@firebase/firestore';
import { DataService } from '../services/data.service';
import { Auth } from '@angular/fire/auth';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit  {

  private dataCollection: CollectionReference<DocumentData>;

  constructor(private alertController: AlertController,
    private authService: AuthService,
    private router: Router,
    private dataService: DataService,private auth: Auth
  ) { }

  dataFinal: any[];
  loadMore: boolean = false;
  intensityTrained2 = '';
  dayTrained = {
    dayTrained: '',
    musclesTrained: [],
    Intensity: ''
  }
  

  ngOnInit() {
    console.log(this.auth.currentUser.uid)
    this.dataService.getAll().subscribe(resp => {
      console.log(resp)
      this.dataFinal = resp
    })


  }

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

  async nextButtonForTrained() {
    const alert = await this.alertController.create({
      header: 'Select training',
      buttons: [{
        text: 'OK', handler: async () => {
          const alert2 = await this.alertController.create({
            header: 'Intensity',
            buttons: [
              {
                text: 'Normal',
                role: 'normal',
                handler: () => {
                  this.intensityTrained2 = 'Normal';
                },
              },
              {
                text: 'Intense',
                role: 'intense',
                handler: () => {
                  this.intensityTrained2 = 'Intense';
                },
              },
            ],
          });
          await alert2.present()

          await alert2.onDidDismiss().then(data => {
            this.dayTrained.Intensity = this.intensityTrained2
          });
        },
      }],
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
          label: 'Calf',
          type: 'checkbox',
          value: 'calf',

        },
        {
          label: 'Cardio',
          type: 'checkbox',
          value: 'Cardio',
        },
      ],
    })

    await alert.present()

    await alert.onDidDismiss()
      .then(async data => {
        const date = new Date();
        // Function to make all data lowercase
        const lower = data.data.values.map(element => {
          return element.toLowerCase();
        });

        // Function to make first letter capital
        for (var i = 0; i < 1; i++) {
          lower[i] = lower[i].charAt(0).toUpperCase() + lower[i].substr(1);
        }
        let todaysDate = format(new Date(), "eeee")


        this.dayTrained.musclesTrained = lower
        this.dayTrained.dayTrained = format(date, 'dd.MM.yyyy')
        this.dayTrained.Intensity = this.intensityTrained2
        let timeStamp = serverTimestamp()
        Object.assign(this.dayTrained, { createdAt: timeStamp });
        Object.assign(this.dayTrained, { dayOfWeekTrained: todaysDate });
        this.dataService.createCollection(this.dayTrained)
      })
  }

  async click(dataToEdit) {
    const alert = await this.alertController.create({
      header: 'Edit training',
      buttons: [{
        text: 'OK', handler: async () => {
          const alert2 = await this.alertController.create({
            header: 'Edit intensity',
            buttons: [
              {
                text: 'Normal',
                role: 'normal',
                handler: () => {
                  this.intensityTrained2 = 'Normal';
                },
              },
              {
                text: 'Intense',
                role: 'intense',
                handler: () => {
                  this.intensityTrained2 = 'Intense';
                },
              },
            ],
          });
          await alert2.present()

          await alert2.onDidDismiss().then(data => {
            data.role = this.intensityTrained2
          });
        },
      }],
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
          label: 'Calf',
          type: 'checkbox',
          value: 'calf',

        },
        {
          label: 'Cardio',
          type: 'checkbox',
          value: 'Cardio',
        },
      ],
    })

    await alert.present()

    await alert.onDidDismiss()
      .then(async data => {
        let newDataToEdit = {
          id: dataToEdit.id,
          dayTrained: dataToEdit.dayTrained,
          musclesTrained: data.data.values,
          Intensity: this.intensityTrained2
        }
        this.dataService.update(newDataToEdit)
      })

  }

  async delete(data) {
    const alert = await this.alertController.create({
      header: 'Are you sure you would like to remove?',
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
            this.dataService.delete(data)
          },
        },
      ],
    });

    await alert.present();

  }

  loadMoreTrainings() {
    this.loadMore = true;
    this.dataService.getAll().subscribe(resp => {
      console.log(resp)
      this.dataFinal = resp
    })
  }

  loadAllTrainings(){
    this.router.navigate(['training-history'])
  }

  logout() {
    this.authService.logout()
    this.router.navigateByUrl('', { replaceUrl: true });
  }


}
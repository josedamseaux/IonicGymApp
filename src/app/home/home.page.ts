import { Component } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { endOfWeek, format, startOfWeek } from 'date-fns';
import { AuthService } from '../services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { serverTimestamp } from '@angular/fire/firestore';
import { DataService } from '../services/data.service';
import { Auth } from '@angular/fire/auth';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})

export class HomePage {

  flagForErasingLastElementOfChartJS;


  dataFinal = [];

  intensityTrained = '';

  dayTrained = {
    dayTrained: '',
    musclesTrained: [],
    Intensity: ''
  }

  dateForDb;
  currentWeek;


  constructor(
    public alertController: AlertController,
    public authService: AuthService,
    public router: Router,
    public dataService: DataService, public auth: Auth,
    public route: ActivatedRoute) { }


  ngOnInit() {
    this.getData()
    this.currentWeek = this.dataService.getCurrentWeek()
  }

  getData() {
    this.dataService.get7Recent().subscribe(data => {
      this.dataFinal = data;
      console.log(this.dataFinal)
    });
  }

  TrackByNgFor(item) {
    return item.id; // asumiendo propiedad única "id" en cada elemento
  }

  async firstButtonForTrained() {
    const alert = await this.alertController.create({
      header: 'Did you train today?',
      buttons: [
        {
          text: 'Other day',
          role: 'no',
          handler: () => {
            alert.dismiss()
            this.nextButtonForTrainedOtherDay()
          },
        },
        {
          text: 'Yes',
          role: 'confirm',
          handler: () => {
            alert.dismiss()
            this.secondButtonForTrained()
          },
        },
      ],
    });
    await alert.present();
  }

  async secondButtonForTrained() {
    const alert = await this.alertController.create({
      header: 'Select training',
      buttons: [{
        text: 'OK', handler: async () => {
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
          label: 'Trapezius',
          type: 'checkbox',
          value: 'trapezius',
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
        console.log(data)
        const date = new Date();
        // Function to make all data lowercase
        const lower = data.data.values.map(element => {
          return element.toLowerCase();
        });

        // Function to make first letter capital
        lower[0] = lower[0].charAt(0).toUpperCase() + lower[0].substr(1);
        let todaysDate = format(new Date(), "eeee")
        this.dayTrained.musclesTrained = lower
        this.dayTrained.dayTrained = format(date, 'dd.MM.yyyy')
        this.dayTrained.Intensity = this.intensityTrained
        let timeStamp = serverTimestamp()
        Object.assign(this.dayTrained, { createdAt: timeStamp });
        Object.assign(this.dayTrained, { dayOfWeekTrained: todaysDate });
      })
    this.thirButtonForTrained()
  }

  async thirButtonForTrained() {
    const alert2 = await this.alertController.create({
      header: 'Intensity',
      buttons: [
        {
          text: 'Normal',
          role: 'normal',
          handler: () => {
            this.intensityTrained = 'Normal';
          },
        },
        {
          text: 'Intense',
          role: 'intense',
          handler: () => {
            this.intensityTrained = 'Intense';
          },
        },
      ],
    });
    await alert2.present()
    await alert2.onDidDismiss();
    // this.dayTrained.Intensity = this.intensityTrained2;
    this.dayTrained.Intensity = this.intensityTrained;
    console.log('third button')
    this.dataService.createCollection(this.dayTrained)
  }

  async nextButtonForTrainedOtherDay() {
    const alert = await this.alertController.create({
      header: 'Select day',
      buttons: [{
        text: 'OK', handler: async () => {
          const alert2 = await this.alertController.create({
            header: 'Select Training',
            buttons: [
              {
                text: 'Ok',
                role: 'ok'
              },
            ],
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
                label: 'Trapezius',
                type: 'checkbox',
                value: 'trapezius',
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
          });
          await alert2.present()
          const data = await alert2.onDidDismiss();
          // Function to make all data lowercase
          const lower = data.data.values.map(element => {
            return element.toLowerCase();
          });
          // Function to make first letter capital
          lower[0] = lower[0].charAt(0).toUpperCase() + lower[0].substr(1);

          this.dayTrained.musclesTrained = lower
          this.dayTrained.Intensity = this.intensityTrained

          const alert3 = await this.alertController.create({
            header: 'Intensity',
            buttons: [
              {
                text: 'Normal',
                role: 'normal',
                handler: () => {
                  this.intensityTrained = 'Normal';
                },
              },
              {
                text: 'Intense',
                role: 'intense',
                handler: () => {
                  this.intensityTrained = 'Intense';
                },
              },
            ],
          });
          await alert3.present()
          this.dayTrained.Intensity = this.intensityTrained;
        },
      }],
      inputs: [
        {
          name: 'title',
          placeholder: 'Title',
          type: 'date'
        },
      ],
    })

    await alert.present()
    let data = await alert.onDidDismiss()
    let dateValues = Object.values(data.data.values)
    let date: any = dateValues[0]
    let year = date.substring(0, 4).slice(-4)
    let month = date.substring(0, 7).slice(-2)
    let day = date.substring(0, 10).slice(-2)

    let dateForDb = `${day}.${month}.${year}`
    let dateForDbAnotherDayTrained = `${month}.${day}.${year}`

    this.dateForDb = dateForDb
    console.log(dateForDb)

    let dayTrained = format(new Date(year, month - 1, day), "eeee")
    console.log(dayTrained)

    this.dayTrained.dayTrained = dateForDb

    const eventTimestamp = new Date(
      Date.parse(
        `${dateForDbAnotherDayTrained}`
      )
    )
    Object.assign(this.dayTrained, { createdAt: eventTimestamp });
    Object.assign(this.dayTrained, { dayOfWeekTrained: dayTrained });
    this.dataService.createCollection(this.dayTrained)
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
                  this.intensityTrained = 'Normal';
                },
              },
              {
                text: 'Intense',
                role: 'intense',
                handler: () => {
                  this.intensityTrained = 'Intense';
                },
              },
            ],
          });
          await alert2.present()

          alert2.onDidDismiss().then(data => {
            data.role = this.intensityTrained;
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
          Intensity: this.intensityTrained
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
            this.flagForErasingLastElementOfChartJS = data.dayTrained
          },
        },
      ],
    });
    await alert.present();
  }

  logout() {
    this.authService.logout()
    this.router.navigate(['login'])
  }

}
import { Component } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { format }  from 'date-fns';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
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
export class HomePage {

  private dataCollection: CollectionReference<DocumentData>;

  constructor(private alertController: AlertController, 
    private authService: AuthService, 
    private router: Router,
    private db: AngularFireDatabase,
    private firestore: Firestore,
    private dataService: DataService,
    private auth: Auth,
    ) {}
    
    dataFinal: any[];
    
  intensityTrained2 = '';
  dayTrained = {
    dayTrained: '',
    musclesTrained: [],
    Intensity: ''
  }

  ngOnInit(){

    this.dataCollection = collection(this.firestore, 'Bh89hEJFo4Ve4UobbTyuMBDbAQx1');
    let todaysDate = format(new Date(), "eeee")
    console.log(todaysDate)

    
    let varForToday = parseInt(todaysDate.substring(0, todaysDate.indexOf(".")))
    let month = parseInt(todaysDate.substring(todaysDate.indexOf(".") + 1).slice(0, -5))
    let varForThisYear = parseInt(todaysDate.substring(todaysDate.length - 4))
    // console.log(todaysDate)
    this.dataService.getAll().subscribe(resp => {
      // we get the days trained
      let result = resp.map(a => a.dayTrained);
      result.forEach(resp => {
        // console.log(result)

        // let x = new Array(1);

        for (let i = 0; i < result.length; i++) {
          let day = parseInt(result[i].substring(0, resp.length - 8).slice(-2))
          let month = parseInt(result[i].substring(result[0].indexOf(".") + 1).slice(0, -5))
          let year = parseInt(result[i].substring(result[0].length - 4))
          // x[i] = this.getWeekTrained(year, month, day)
          // console.log(day)
          // console.log(month)
          // console.log(year)
          // Object.assign(this.dayTrained, {createdAt: timeStamp});



        }

      })

    })
  

    
    this.dataService.getAll().subscribe(resp=>{
      console.log(resp)
      this.dataFinal = resp
    })
    console.log(this.dataCollection.id)
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
      buttons: [{text: 'OK', handler: async () => {
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

        await alert2.onDidDismiss().then( data => {
              this.dayTrained.Intensity = this.intensityTrained2
        });
      },}],
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
        for(var i = 0 ; i < 1; i++){
          lower[i] = lower[i].charAt(0).toUpperCase() + lower[i].substr(1);
        } 
        let todaysDate = format(new Date(), "eeee")


        this.dayTrained.musclesTrained = lower
        this.dayTrained.dayTrained = format(date, 'dd.MM.yyyy')
        this.dayTrained.Intensity = this.intensityTrained2
        let timeStamp = serverTimestamp()
        Object.assign(this.dayTrained, {createdAt: timeStamp});
        Object.assign(this.dayTrained, {dayOfWeekTrained: todaysDate});
        this.dataService.createCollection(this.dayTrained) 
      })
  }

  async click(dataToEdit){
    const alert = await this.alertController.create({
      header: 'Edit training',
      buttons: [{text: 'OK', handler: async () => {
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

        await alert2.onDidDismiss().then( data => {
          data.role = this.intensityTrained2
        });
      },}],
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
       let newDataToEdit ={
          id: dataToEdit.id,
          dayTrained: dataToEdit.dayTrained,
          musclesTrained:data.data.values,
          Intensity: this.intensityTrained2
        }
        this.dataService.update(newDataToEdit) 
      })

  }

 async delete(data){
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
            this.dataService.delete(data)},
        },
      ],
    });

    await alert.present();

  }

  loadMoreTrainings(){
    
  }

 logout(){
  this.authService.logout()
  this.router.navigateByUrl('', {replaceUrl: true});
 }


}
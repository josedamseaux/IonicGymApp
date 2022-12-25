import { Component, OnInit } from '@angular/core';
import { collection, collectionData, doc, Firestore, orderBy, query, where } from '@angular/fire/firestore';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { format } from 'date-fns';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-training-history',
  templateUrl: './training-history.component.html',
  styleUrls: ['./training-history.component.scss'],
})
export class TrainingHistoryComponent implements OnInit {

  dataFinal: any[];

  yearTrained = [];
  monthsTrained;
  dataFor2022: any[];

  clicked: boolean = false;

  dayTrained = {
    dayTrained: '',
    musclesTrained: [],
    Intensity: ''
  }

  intensityTrained2 = '';


  constructor(private alertController: AlertController, private readonly firestore: Firestore,
    private authService: AuthService,
    private router: Router,
    private dataService: DataService,) { }


    uid = 'Bh89hEJFo4Ve4UobbTyuMBDbAQx1';
  

  ngOnInit() {
    this.dataService.getAll().subscribe(resp => {
      console.log(resp)
      // this.dataFinal = resp
    })    
    this.averChe().subscribe(resp=>{
      console.log(resp)
    })
    this.getTrainingHistory()
    
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

  backToMain(){
    this.router.navigate([''])
  }

  getTrainingHistory(){

    let weekTrained = new Array()
    let arrayWithDifYears = []
    let arraySameYear = []


    this.dataService.getAll().subscribe(resp => {

        resp.map(obj => { 
          let thisYear = parseInt(format(new Date(), 'dd.MM.yyyy').substring(6))

          let monthTrained = parseInt(obj.dayTrained.substring(obj.dayTrained.indexOf(".") + 1).slice(0, -5))
          let yearTrained = parseInt(obj.dayTrained.substring(obj.dayTrained.length - 4))
          let disposableArray = []
          disposableArray.push(yearTrained)
          this.yearTrained = [...new Set(disposableArray)];

          console.log(this.yearTrained)
          this.monthsTrained = monthTrained

          console.log(this.monthsTrained)

          if(yearTrained != thisYear){
            arrayWithDifYears.push(obj)
          }
          console.log(arrayWithDifYears)

          if(yearTrained == thisYear){
            arraySameYear.push(obj)
            this.dataFor2022 = arraySameYear
          }
          console.log(arraySameYear)

        

          console.log(this.yearTrained)


          if(monthTrained == 11) { console.log(obj) 
            weekTrained.push(obj) }


      })
    })    
    

  }

  ShowYear(){
      this.clicked = !this.clicked
      console.log(this.clicked)
  }

  averChe(){
    
    let dataCollection = collection(this.firestore, this.uid)
    let querySortedByNewest = query (dataCollection, where("createdAt", "==", "2022"))
    return collectionData(querySortedByNewest)as Observable<any>
  }


}

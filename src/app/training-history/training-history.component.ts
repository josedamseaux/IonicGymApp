import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';
import { DataService } from '../services/data.service';
import { Auth } from '@angular/fire/auth';
import { ChartConfiguration, ChartDataset } from 'chart.js';
  

@Component({
  selector: 'app-training-history',
  templateUrl: './training-history.component.html',
  styleUrls: ['./training-history.component.scss'],
})
export class TrainingHistoryComponent implements OnInit {
  
  spinnerVisible: boolean = true
  clicked: boolean = false;
  dataRequested: boolean = false

  arrayForYearsTrained = []
  model = [];
  
  dayTrained = {
    dayTrained: '',
    musclesTrained: [],
    Intensity: ''
  }
  
  intensityTrained = '';
  uid;
  dataByMonth = []
  trainingByYear = {};

  constructor(private alertController: AlertController, private authService: AuthService,
    private Auth: Auth, private router: Router, private dataService: DataService, public auth: Auth) {
  }

  barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    scales: {
      x: { ticks: { color: 'white', font: { size: 16, style: 'italic' } } },
      y: { ticks: { color: 'white', font: { size: 16 }, precision: 0 } },
    },
    plugins: {
      legend: { display: true },
      tooltip: {
        callbacks: {
          label: function (context) {
            let label = context.dataset.label || '';
            let che = context.formattedValue
            if (label) {
              label += `: `;
            }
            if (context.parsed.y !== null) {
              label += che
            }
            return label;
          }

        },
        titleFont: {
          size: 15,
        },
        bodyFont: {
          size: 15,
          // family:'vazir'
        },
        displayColors: false,
        position: 'average',
        caretSize: 10,
      }
    }
  }
  barChartDataForYear: ChartDataset[] = [{ data: [], backgroundColor: '#3fa39b', label: 'Trained total', barThickness: 80 }];
  barChartLabelsForYear: any = [];

  ngOnInit() {
    this.updateYearStatsData()
    this.getStatsYearTrained()
    this.uid = this.Auth.currentUser.uid;
  }

  getStatsYearTrained() {
   this.dataService.getStatsYearTrained().then(trainingByYear => {
      if(trainingByYear){
        this.spinnerVisible = false
      }
      this.trainingByYear = trainingByYear;
      this.arrayForYearsTrained = Object.keys(trainingByYear)
      this.barChartLabelsForYear = Object.keys(trainingByYear);
      this.barChartDataForYear.forEach(chartData => chartData.data = Object.values(trainingByYear));
    });
  }

  updateYearStatsData() {
    this.dataService.getUpdatesFromgetStatsYearTrained().subscribe(resp => {
      console.log(resp)
      if (resp) {
        this.spinnerVisible = false
      }
      this.trainingByYear = resp
      this.barChartLabelsForYear = Object.keys(resp);
      this.barChartDataForYear.forEach(chartData => chartData.data = Object.values(resp));
    })
  }

  getData(i: any) {
    let numberToFind = i.toString()
    this.dataService.data.subscribe(resp => {
      this.model = resp.filter((resp: any) => resp.dayTrained.includes(numberToFind))
      this.model.sort((a, b) => {
        // Convierte las cadenas de fecha a objetos de fecha
        const dateA: any = new Date(parseInt(a.dayTrained.slice(-4)), parseInt(a.dayTrained.slice(3, 5)) - 1, parseInt(a.dayTrained.slice(0, 2)));
        const dateB: any = new Date(parseInt(b.dayTrained.slice(-4)), parseInt(b.dayTrained.slice(3, 5)) - 1, parseInt(b.dayTrained.slice(0, 2)));
        // Compara las fechas
        return dateB - dateA;
      });

      if (this.model.length > 0) {
        this.dataRequested = true
      }

      const dataByMonth = this.model.reduce((accumulator, currentValue) => {
        // Obtenemos el mes de la fecha en formato 'MM'
        const month = currentValue.dayTrained.split('.')[1];

        let monthName = '';
        if (month === '01') {
          monthName = 'January';
        } else if (month === '02') {
          monthName = 'February';
        } else if (month === '03') {
          monthName = 'March';
        } else if (month === '04') {
          monthName = 'April';
        } else if (month === '05') {
          monthName = 'May';
        } else if (month === '06') {
          monthName = 'June';
        } else if (month === '07') {
          monthName = 'July';
        } else if (month === '08') {
          monthName = 'August';
        } else if (month === '09') {
          monthName = 'September';
        } else if (month === '10') {
          monthName = 'October';
        } else if (month === '11') {
          monthName = 'November';
        } else if (month === '12') {
          monthName = 'December';
        }

        // Si el mes no existe en el objeto, lo creamos con un array vacío
        if (!accumulator[monthName]) {
          accumulator[monthName] = [];
        }

        // Añadimos el objeto actual al array correspondiente al mes
        accumulator[monthName].push(currentValue);

        // Devolvemos el objeto acumulador
        return accumulator;
      }, {});

      const monthNumberMap = {
        January: 1,
        February: 2,
        March: 3,
        April: 4,
        May: 5,
        June: 6,
        July: 7,
        August: 8,
        September: 9,
        October: 10,
        November: 11,
        December: 12
      };

      const sortedDataByMonth = Object.keys(dataByMonth)
        .sort((a, b) => monthNumberMap[a] - monthNumberMap[b])
        .reduce((acc, key) => {
          acc[key] = dataByMonth[key];
          return acc;
        }, {});

      const dataArray = Object.keys(sortedDataByMonth).map(key => {
        return { month: key, values: sortedDataByMonth[key] };
      });

      dataArray.sort((a, b) => {
        const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        return months.indexOf(a.month) - months.indexOf(b.month);
      });
      console.log(dataArray);
      this.dataByMonth = dataArray
    })
  }

  ShowYear() {
    this.clicked = !this.clicked
    let styleForClosing = document.getElementById("test2")
    if (this.clicked == true) {
      let styleForClosing = document.getElementsByClassName("test")
      styleForClosing[0].classList.add("test")
    } else {
      styleForClosing[0].classList.add("test")
    }
  }

  async click(dataToEdit) {
    console.log(dataToEdit)

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

          await alert2.onDidDismiss().then(data => {
            data.role = this.intensityTrained
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

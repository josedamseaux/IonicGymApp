import { Component, Input, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { addDays, addMonths, endOfMonth, formatDistance, isWithinInterval, startOfMonth, startOfWeek, subMonths } from 'date-fns';
import { DataService } from '../services/data.service';
import { format } from 'date-fns';
import { ChartConfiguration, ChartDataset, ChartType } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { BaseChartDirective } from 'ng2-charts';
import { Observable, Subject } from 'rxjs';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.scss'],
})
export class StatsComponent implements OnInit {

  @Input() flagForErasingLastElementOfChartJS;
  @ViewChild(BaseChartDirective) chart: BaseChartDirective;

  messageForLastDayTrained;
  lastDayTrained: boolean = false;
  trainedToday: boolean = false;
  spinnerVisible: boolean = true
  messageForNoData: boolean;
  show = false

  trainedThisYear = [];
  trainedLastYear = [];

  countOnMonth = [];
  countOnLastMonth = []

  currentWeek = [];

  week1 = []
  week2 = []
  week3 = []
  week4 = []
  week5 = []

  indexer1 = []
  indexer2 = []
  indexer3 = []
  indexer4 = []
  indexer5 = []

  week = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN']
  indexs = [];

  // Global configuration for bar charts, monthly and yearly
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
            console.log(context)
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

  // Weeklychart doughnut
  doughnutChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      datalabels: {
        font: { size: 20 },
        color: 'white',
        formatter: (val, ctx) => {
          const label = ctx.chart.data.labels[ctx.dataIndex];
          console.log(val)
          return `${label}`
        },
      },
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: function (context) {
            let label = context.dataset.label || '';
            let che = context.formattedValue
            if (label) {
              label += ` for ${context.label.toLocaleLowerCase()}: `;
            }
            if (context.parsed.y !== null) {
              label += che
            }
            return label;
          }

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
  doughnutChartLabels: any = [];
  doughnutChartData: ChartDataset[] = [{
    data: [], backgroundColor: ["#62BEB6", "#0B9A8D", "#077368", "#034D44", "#002B24"],
    label: 'Frecuency this week'
  }];

  doughnutChartType: ChartType = 'doughnut';
  doughnutChartPlugins2 = [ChartDataLabels];

  // MonthStats charts
  barChartDataForMonth: ChartDataset[] = [{ data: [], backgroundColor: '#3fa39b', label: 'Trained total', }];
  barChartLabelsForMonth: any = [];

  public lineChartType: ChartType = 'line';

  constructor(public dataService: DataService, private changeDetectorRef: ChangeDetectorRef) { }

  ngOnChanges(changes: SimpleChanges) {
    if ('flagforErasingLastElementInChart' in changes) {
      console.log(this.flagForErasingLastElementOfChartJS)
    }

    if (this.flagForErasingLastElementOfChartJS) {
      console.log(this.flagForErasingLastElementOfChartJS)
      this.elementWasErased(this.flagForErasingLastElementOfChartJS)
    }
  }

  ngOnInit() {
    this.getWeekTrained()
    this.getStatsWeekTrained()
    this.lastTimeTrained()
    this.getStatsMonthTrained()
    this.getFullMonth();
    this.currentWeek = this.dataService.getCurrentWeek();
    this.dataService.getUpdatesFromgetTrainedThisWeek().subscribe(element => {
      this.updateStatsWeekTrained(element); // Pasar los datos actualizados como un argumento a updateStatsWeekTrained()
    });

  }

  getFullMonth() {
    let originalArray = []
    originalArray = this.dataService.getFullMonth()
    this.week1 = originalArray[0]
    this.week2 = originalArray[1]
    this.week3 = originalArray[2]
    this.week4 = originalArray[3]
    this.week5 = originalArray[4]
  }

  hideloader() {
    this.spinnerVisible = false
  }

  intersect(a, b) {
    const setB = new Set(b);
    return a.filter(element => setB.has(element));
  }

  // SAFE
  lastTimeTrained() {

    const fechaFormateada = format(new Date(), 'yyyy-MM-dd');
    const [year, month, day] = fechaFormateada.split('-').map(num => parseInt(num));

    this.dataService.getLastTimeTrained().subscribe(result => {

      let dateLastTrained = result[0].dayTrained
      let varForDay = parseInt(dateLastTrained.substring(0, dateLastTrained.indexOf(".")))
      let varForMonth = parseInt(dateLastTrained.substring(dateLastTrained.indexOf(".") + 1).slice(0, -5))
      let varForYear = parseInt(dateLastTrained.substring(dateLastTrained.length - 4))

      var distanceFromDayTrainedToToday = formatDistance(new Date(year, month, day), new Date(varForYear, varForMonth, varForDay))

      if (distanceFromDayTrainedToToday == "less than a minute") {
        this.trainedToday = true;
        this.messageForLastDayTrained = 'You trained today. Congrats!'
      } else if (distanceFromDayTrainedToToday == "1 day") {
        this.messageForLastDayTrained = 'Last day you trained was yesterday.'
        this.trainedToday = false
      } else {
        this.messageForLastDayTrained = 'Last day you trained was ' + distanceFromDayTrainedToToday + ' ago'
        this.trainedToday = false
      }

    })


  }

  getStatsMonthTrained() {

    this.dataService.data.subscribe(item => {
      const resp = item.reduce((acc, cur) => {

        const [day, month, year] = cur.dayTrained.split('.'); // separar la fecha utilizando '-'
        const yearKey = parseInt(year);
        const monthKey = parseInt(month);

        if (!acc[yearKey]) {
          acc[yearKey] = {};
        }

        if (!acc[yearKey][monthKey]) {
          acc[yearKey][monthKey] = [];
        }

        acc[yearKey][monthKey].push(cur);

        return acc;
      }, {})

      console.log(resp)

      const monthsTrained = Object.keys(resp).reduce((prev, curr) => {
        const subKeys = Object.keys(resp[curr]);
        return [...prev, ...subKeys];
      }, []);

      let timesTrainedEveryMonth: any = []

      timesTrainedEveryMonth = Object.values(resp).reduce((prev: any, curr) => {
        const subLengths = Object.values(curr).map(subArr => subArr.length);
        return [...prev, ...subLengths];
      }, []);

      console.log(monthsTrained)
      console.log(timesTrainedEveryMonth)

      const monthNames = {
        '1': "January",
        '2': "February",
        '3': "March",
        '4': "April",
        '5': "May",
        '6': "June",
        '7': "July",
        '8': "August",
        '9': "September",
        '10': "October",
        '11': "November",
        '12': "December"
      };

      const arrayWithNamesForLabel = monthsTrained.map(element => monthNames[element]);
      this.barChartLabelsForMonth = arrayWithNamesForLabel

      this.barChartDataForMonth.forEach(respper => {
        if (timesTrainedEveryMonth.length > 6) {
          arrayWithNamesForLabel.shift()
          timesTrainedEveryMonth.shift()
          respper.data = timesTrainedEveryMonth
        } else {
          respper.data = timesTrainedEveryMonth
        }
      })
      this.countOnMonth = timesTrainedEveryMonth.slice(-1);
      this.countOnLastMonth = timesTrainedEveryMonth[timesTrainedEveryMonth.length - 2]
    })

  }

  // SAFE
  async getStatsWeekTrained() {

    let musclesTrained = []
    let arrayTrainedThisMonth = []

    let element = await this.dataService.getTrainedThisWeek()
    console.log(element)
    if (element.length == 0) {
      this.show = false
      this.hideloader()
    } else {
      this.messageForNoData = true
      this.hideloader()
      this.show = true
    }

    element.forEach(resp => {
      let varDay = parseInt(resp.dayTrained.substring(0, resp.dayTrained.indexOf(".")))
      arrayTrainedThisMonth.push(varDay)

      resp.musclesTrained.forEach(muscles => {
        let muscless = muscles.charAt(0).toUpperCase() + muscles.slice(1)
        musclesTrained.push(muscless)
      })

      let uniqueCharsForLabel = [...new Set(musclesTrained)];
      this.doughnutChartLabels = uniqueCharsForLabel
      const count = {}
      musclesTrained.forEach(element => {
        count[element] = (count[element] || 0) + 1;
      });

      let dataArrayForMusclesTrained = []
      dataArrayForMusclesTrained = Object.values(count)
      this.doughnutChartData.forEach(resp => {
        resp.data = dataArrayForMusclesTrained
      })

      let intersectForThisWeek = this.intersect(arrayTrainedThisMonth, this.currentWeek)
      intersectForThisWeek.map(f => {
        this.indexs.push(this.currentWeek.indexOf(f))
      })
    })
  }

  // SAFE
  updateStatsWeekTrained(element) {

    let musclesTrained = []
    let arrayTrainedThisMonth = []
    if (element.length == 0) {
      this.show = false
      this.indexs = []
    } else {
      this.show = true
    }
    element.forEach(resp => {
      console.log(resp)
      let varDay = parseInt(resp.dayTrained.substring(0, resp.dayTrained.indexOf(".")))
      arrayTrainedThisMonth.push(varDay)

      resp.musclesTrained.forEach(muscles => {
        let muscless = muscles.charAt(0).toUpperCase() + muscles.slice(1)
        musclesTrained.push(muscless)
      })

      let uniqueCharsForLabel = [...new Set(musclesTrained)];
      this.doughnutChartLabels = uniqueCharsForLabel
      const count = {}
      musclesTrained.forEach(element => {
        count[element] = (count[element] || 0) + 1;
      });

      let dataArrayForMusclesTrained = []
      dataArrayForMusclesTrained = Object.values(count)
      this.doughnutChartData.forEach(resp => {
        resp.data = dataArrayForMusclesTrained
      })

      let intersectForThisWeek = this.intersect(arrayTrainedThisMonth, this.currentWeek)
      intersectForThisWeek.map(f => {
        this.indexs.push(this.currentWeek.indexOf(f))
      })
    })

  }

  private subjectForMonthCalendar = new Subject()

  getUpdatesFroMonthCalendar(): Observable<any> {
    return this.subjectForMonthCalendar.asObservable();
  }

  getWeekTrained() {

    const today = new Date();
    const startCurrentMonth = startOfMonth(today);
    const date = new Date();
    const firstDayOfNextMonth = startOfWeek(addMonths(date, 1), { weekStartsOn: 1 });
    const secondSunday = addDays(firstDayOfNextMonth, 6); // Suma 6 días para llegar al domingo y luego 7 para obtener el segundo domingo

    let thisMonth = new Date().getMonth() + 1;
    this.dataService.data.subscribe(data => {

      const filteredData = data.filter(item => {
        const [day, month, year] = item.dayTrained.split('.');
        const itemDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
        return isWithinInterval(itemDate, { start: startCurrentMonth, end: secondSunday })
      });
      console.log(filteredData);
      this.subjectForMonthCalendar.next(filteredData)

      let arrayTrainedNextMonth = []
      let thisMonth = new Date().getMonth() + 1;
      let arrayTrainedThisMonth = []
      let nextMonth = thisMonth - 1;


      this.getUpdatesFroMonthCalendar().subscribe(resp => {
        console.log(resp);

        resp.map(resp => {
          let varForMonth = parseInt(resp.dayTrained.substring(resp.dayTrained.indexOf(".") + 1).slice(0, -5));
          if (varForMonth == thisMonth) {
            console.log(resp);
            let respToNumber = parseInt(resp.dayTrained.substring(0, resp.dayTrained.length - 8).slice(-2));
            arrayTrainedThisMonth.push(respToNumber);
          }
          if (varForMonth == nextMonth) {
            let respToNumber = parseInt(resp.dayTrained.substring(0, resp.dayTrained.length - 8).slice(-2));
            arrayTrainedNextMonth.push(respToNumber);
          }
        });

        
      let intersect = this.intersect(arrayTrainedThisMonth, this.week1);
      console.log(this.indexer1);
      intersect.map(f => {
        console.log(f);
        this.indexer1.push(this.week1.indexOf(f));
      });

      let intersect2 = this.intersect(arrayTrainedThisMonth, this.week2)
      intersect2.map(f => {
        this.indexer2.push(this.week2.indexOf(f))
      })

      let intersect3 = this.intersect(arrayTrainedThisMonth, this.week3)
      intersect3.map(f => {
        this.indexer3.push(this.week3.indexOf(f))
      })

      let intersect4 = this.intersect(arrayTrainedThisMonth, this.week4)
      intersect4.map(f => {
        this.indexer4.push(this.week4.indexOf(f))
      })

      let intersect5 = this.intersect(arrayTrainedNextMonth, this.week5)
      intersect5.map(f => {
        this.indexer5.push(this.week5.indexOf(f))
      })

      });

    })

  }


  // TODO method to erase green flag for calendar not erasing
  elementWasErased(elementToErase: string) {

    // const elementToRemove = parseInt(elementToErase.substring(0, 2)); //numero 3
    // const indexToRemove = this.week1.indexOf(elementToRemove); // da 2

    // let indexer1 = [...new Set(this.indexer1)]; // da 2

    // let index = indexer1.indexOf(indexToRemove) //deberia ser 0

    // console.log(this.indexer1.length)
    // this.indexer1.splice(index, 3);
    // indexer1.splice(index, 3)
    // console.log(indexer1)

    // this.indexer1 = indexer1;
    // this.changeDetectorRef.detectChanges();
    // console.log(this.indexer1)
  }


}
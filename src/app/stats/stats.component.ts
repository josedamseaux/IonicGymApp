import { Component, OnInit } from '@angular/core';
import { endOfWeek, formatDistance, startOfWeek } from 'date-fns';
import { DataService } from '../services/data.service';
import { format } from 'date-fns';
import { ChartConfiguration, ChartDataset } from 'chart.js';

@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.scss'],
})
export class StatsComponent implements OnInit {

  messageForLastDayTrained;
  lastDayTrained: boolean = false;
  trainedToday: boolean = false;

  countOnYear = [];
  countOnLastYear = [];

  countOnMonth = [];
  countOnLastMonth = []

  weekTrained = [];
  currentWeek = [];

  firstDayOfWeek;
  lastDayOfWeek;
  week = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN']


  // CHART ELEMENTS

  // Global cinfiguration 
  lineChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    scales: {
      x: {
        ticks: { color: 'white', font: { size: 15, style: 'italic' }}
        },
      y: {
        ticks: { color: 'white', font: { size: 15}, precision:0 }}},
    plugins: { legend: { display: true } }
  }

  // YearStats charts
  lineChartDataForYear: ChartDataset[] = [{ data: [], backgroundColor: '#468a6b', label: 'Trained total' }];
  lineChartLabelsForYear: any = [];
  lineChartLegendForYear = false;

  // MonthStats charts
  lineChartDataForMonth: ChartDataset[] = [{ data: [], backgroundColor: '#468a6b', label: 'Trained total', }];
  lineChartLabelsForMonth: any = [];
  lineChartLegendForMonth = false;
  indexs = [];

  constructor(private dataService: DataService) { }

  ngOnInit() {

    this.dataService.getAll().subscribe(resp => {
      this.getStatsWeekTrained()
      this.getStatsYearTrained()
      this.getStatsMonthTrained()
      this.getMonth()
      this.getCurrentWeek()
      this.lastTimeTrained()
    })

  }

  getMonth() {
    let month = parseInt(format(new Date(), 'dd.MM.yyyy').substring(format(new Date(), 'dd.MM.yyyy').indexOf(".") + 1).slice(0, -5))
    let monthToShow;
    if (month == 1) { monthToShow = "january" }
    if (month == 2) { monthToShow = "february" }
    if (month == 3) { monthToShow = "march" }
    if (month == 4) { monthToShow = "april" }
    if (month == 5) { monthToShow = "may" }
    if (month == 6) { monthToShow = "june" }
    if (month == 7) { monthToShow = "july" }
    if (month == 8) { monthToShow = "august" }
    if (month == 9) { monthToShow = "september" }
    if (month == 10) { monthToShow = "october" }
    if (month == 11) { monthToShow = "november" }
    if (month == 12) { monthToShow = "december" }
    return monthToShow;
  }

  getStatsYearTrained() {

    let thisYear = parseInt(format(new Date(), 'dd.MM.yyyy').substring(6))

    let trainedLastYear = [];

    let trainedThisYear = [];

    let labelForChart = [];

    let arrayForChart = []

    this.dataService.getAll().subscribe(resp => {
      let result = resp.map(a => a.dayTrained);

      result.forEach(resp => {

        let varForYearTrained = parseInt(resp.substring(resp.length - 4))
        let varForLastYear = parseInt(format(new Date(), 'dd.MM.yyyy'.substring(6))) - 1

        arrayForChart.push(varForYearTrained)

        labelForChart.push(varForYearTrained)

        let uniqueChars = [...new Set(labelForChart)];
        uniqueChars = uniqueChars.sort(function (a, b) { return a - b; });

        this.lineChartLabelsForYear = uniqueChars

        const count = {};

        arrayForChart.forEach(element => {
          count[element] = (count[element] || 0) + 1;
        });

        let dataArray = []

        dataArray = Object.values(count);

        this.lineChartDataForYear.forEach(respper => {
          respper.data = dataArray
        })

        if (thisYear == varForYearTrained) {
          trainedThisYear.push(resp)
        }
        this.countOnYear = trainedThisYear

        if (varForYearTrained == varForLastYear) {
          trainedLastYear.push(resp)
        }
        this.countOnLastYear = trainedLastYear
      })
    })

  }

  getStatsMonthTrained() {

    let arrayForYear2022 = [];
    let thisYear = parseInt(format(new Date(), 'dd.MM.yyyy').substring(6))

    // Look. I know this is horrible. But I really needed to speed up this one. This code needs to be improved by a senior
    //  I've created this ton of arrays asuming this app will last around 18 years, but since i wasnt able to
    // do it more eficently, I went hard coding. This is gonna get dark around here.
    let arrayIfYearIs2023 = [];
    let arrayIfYearIs2024 = [];
    let arrayIfYearIs2025 = [];
    let arrayIfYearIs2026 = [];
    let arrayIfYearIs2027 = [];
    let arrayIfYearIs2028 = [];
    let arrayIfYearIs2029 = [];
    let arrayIfYearIs2030 = [];
    let arrayIfYearIs2031 = [];
    let arrayIfYearIs2032 = [];
    let arrayIfYearIs2033 = [];
    let arrayIfYearIs2034 = [];
    let arrayIfYearIs2035 = [];
    let arrayIfYearIs2036 = [];
    let arrayIfYearIs2037 = [];
    let arrayIfYearIs2038 = [];
    let arrayIfYearIs2039 = [];
    let arrayIfYearIs2040 = [];


    this.dataService.getAll().subscribe(resp => {
      let result = resp.map(a => a.dayTrained);

      result.forEach(resp => {
        let varForMonth = parseInt(resp.substring(resp.indexOf(".") + 1).slice(0, -5))
        // let varForThisMonth = parseInt(format(new Date(), 'dd.MM.yyyy').substring(resp.indexOf(".") + 1).slice(0, -5))
        let varForThisMonth = new Date().getMonth() + 1;
        let varForYearTrained = parseInt(resp.substring(resp.length - 4))

        // Like I said, 18 year. Tons of ifs if the user have trained in 2024, 2025 and so on.
        if (varForYearTrained == 2023) {
          let monthOnAnotherYear = parseInt(resp.substring(resp.indexOf(".") + 1).slice(0, -5))
          console.log(monthOnAnotherYear)
          arrayIfYearIs2023.push(monthOnAnotherYear)
          arrayIfYearIs2023 = arrayIfYearIs2023.sort(function (a, b) { return a - b; });
        }
        if (varForYearTrained == 2024) {
          let monthOnAnotherYear = parseInt(resp.substring(resp.indexOf(".") + 1).slice(0, -5))
          console.log(monthOnAnotherYear)
          arrayIfYearIs2024.push(monthOnAnotherYear)
          arrayIfYearIs2024 = arrayIfYearIs2024.sort(function (a, b) { return a - b; });
        }
        if (varForYearTrained == 2025) {
          let monthOnAnotherYear = parseInt(resp.substring(resp.indexOf(".") + 1).slice(0, -5))
          console.log(monthOnAnotherYear)
          arrayIfYearIs2025.push(monthOnAnotherYear)
          arrayIfYearIs2025 = arrayIfYearIs2025.sort(function (a, b) { return a - b; });
        }
        if (varForYearTrained == 2026) {
          let monthOnAnotherYear = parseInt(resp.substring(resp.indexOf(".") + 1).slice(0, -5))
          console.log(monthOnAnotherYear)
          arrayIfYearIs2026.push(monthOnAnotherYear)
          arrayIfYearIs2026 = arrayIfYearIs2026.sort(function (a, b) { return a - b; });

          console.log(arrayIfYearIs2026)
        }
        if (varForYearTrained == 2027) {
          let monthOnAnotherYear = parseInt(resp.substring(resp.indexOf(".") + 1).slice(0, -5))
          console.log(monthOnAnotherYear)
          arrayIfYearIs2027.push(monthOnAnotherYear)
          arrayIfYearIs2027 = arrayIfYearIs2027.sort(function (a, b) { return a - b; });

          console.log(arrayIfYearIs2027)
        }
        if (varForYearTrained == 2028) {
          let monthOnAnotherYear = parseInt(resp.substring(resp.indexOf(".") + 1).slice(0, -5))
          console.log(monthOnAnotherYear)
          arrayIfYearIs2028.push(monthOnAnotherYear)
          arrayIfYearIs2028 = arrayIfYearIs2028.sort(function (a, b) { return a - b; });

          console.log(arrayIfYearIs2028)
        }
        if (varForYearTrained == 2029) {
          let monthOnAnotherYear = parseInt(resp.substring(resp.indexOf(".") + 1).slice(0, -5))
          console.log(monthOnAnotherYear)
          arrayIfYearIs2029.push(monthOnAnotherYear)
          arrayIfYearIs2029 = arrayIfYearIs2029.sort(function (a, b) { return a - b; });

          console.log(arrayIfYearIs2029)
        }
        if (varForYearTrained == 2030) {
          let monthOnAnotherYear = parseInt(resp.substring(resp.indexOf(".") + 1).slice(0, -5))
          console.log(monthOnAnotherYear)
          arrayIfYearIs2030.push(monthOnAnotherYear)
          arrayIfYearIs2030 = arrayIfYearIs2030.sort(function (a, b) { return a - b; });

          console.log(arrayIfYearIs2030)
        }
        if (varForYearTrained == 2031) {
          let monthOnAnotherYear = parseInt(resp.substring(resp.indexOf(".") + 1).slice(0, -5))
          console.log(monthOnAnotherYear)
          arrayIfYearIs2031.push(monthOnAnotherYear)
          arrayIfYearIs2031 = arrayIfYearIs2031.sort(function (a, b) { return a - b; });

          console.log(arrayIfYearIs2031)
        }
        if (varForYearTrained == 2032) {
          let monthOnAnotherYear = parseInt(resp.substring(resp.indexOf(".") + 1).slice(0, -5))
          console.log(monthOnAnotherYear)
          arrayIfYearIs2032.push(monthOnAnotherYear)
          arrayIfYearIs2032 = arrayIfYearIs2032.sort(function (a, b) { return a - b; });

          console.log(arrayIfYearIs2032)
        }
        if (varForYearTrained == 2033) {
          let monthOnAnotherYear = parseInt(resp.substring(resp.indexOf(".") + 1).slice(0, -5))
          console.log(monthOnAnotherYear)
          arrayIfYearIs2033.push(monthOnAnotherYear)
          arrayIfYearIs2033 = arrayIfYearIs2033.sort(function (a, b) { return a - b; });

          console.log(arrayIfYearIs2033)
        }
        if (varForYearTrained == 2034) {
          let monthOnAnotherYear = parseInt(resp.substring(resp.indexOf(".") + 1).slice(0, -5))
          console.log(monthOnAnotherYear)
          arrayIfYearIs2034.push(monthOnAnotherYear)
          arrayIfYearIs2034 = arrayIfYearIs2034.sort(function (a, b) { return a - b; });

          console.log(arrayIfYearIs2034)
        }
        if (varForYearTrained == 2035) {
          let monthOnAnotherYear = parseInt(resp.substring(resp.indexOf(".") + 1).slice(0, -5))
          console.log(monthOnAnotherYear)
          arrayIfYearIs2035.push(monthOnAnotherYear)
          arrayIfYearIs2035 = arrayIfYearIs2035.sort(function (a, b) { return a - b; });

          console.log(arrayIfYearIs2035)
        }
        if (varForYearTrained == 2036) {
          let monthOnAnotherYear = parseInt(resp.substring(resp.indexOf(".") + 1).slice(0, -5))
          console.log(monthOnAnotherYear)
          arrayIfYearIs2036.push(monthOnAnotherYear)
          arrayIfYearIs2036 = arrayIfYearIs2036.sort(function (a, b) { return a - b; });

          console.log(arrayIfYearIs2036)
        }
        if (varForYearTrained == 2037) {
          let monthOnAnotherYear = parseInt(resp.substring(resp.indexOf(".") + 1).slice(0, -5))
          console.log(monthOnAnotherYear)
          arrayIfYearIs2037.push(monthOnAnotherYear)
          arrayIfYearIs2037 = arrayIfYearIs2037.sort(function (a, b) { return a - b; });

          console.log(arrayIfYearIs2037)
        }
        if (varForYearTrained == 2038) {
          let monthOnAnotherYear = parseInt(resp.substring(resp.indexOf(".") + 1).slice(0, -5))
          console.log(monthOnAnotherYear)
          arrayIfYearIs2038.push(monthOnAnotherYear)
          arrayIfYearIs2038 = arrayIfYearIs2038.sort(function (a, b) { return a - b; });

          console.log(arrayIfYearIs2038)
        }
        if (varForYearTrained == 2039) {
          let monthOnAnotherYear = parseInt(resp.substring(resp.indexOf(".") + 1).slice(0, -5))
          console.log(monthOnAnotherYear)
          arrayIfYearIs2039.push(monthOnAnotherYear)
          arrayIfYearIs2039 = arrayIfYearIs2039.sort(function (a, b) { return a - b; });

          console.log(arrayIfYearIs2039)
        }
        if (varForYearTrained == 2040) {
          let monthOnAnotherYear = parseInt(resp.substring(resp.indexOf(".") + 1).slice(0, -5))
          console.log(monthOnAnotherYear)
          arrayIfYearIs2040.push(monthOnAnotherYear)
          arrayIfYearIs2040 = arrayIfYearIs2040.sort(function (a, b) { return a - b; });

          console.log(arrayIfYearIs2040)
        }

        if (varForYearTrained == thisYear) {
          arrayForYear2022.push(varForMonth)
          arrayForYear2022 = arrayForYear2022.sort(function (a, b) { return a - b; });
        }

        // In here we clean the arrays (they will be alot of duplicates when user traines more than 1 time in a month)

        let uniqueChars2022 = [...new Set(arrayForYear2022)];
        let uniqueChars2023 = [...new Set(arrayIfYearIs2023)];
        let uniqueChars2024 = [...new Set(arrayIfYearIs2024)];
        let uniqueChars2025 = [...new Set(arrayIfYearIs2025)];
        let uniqueChars2026 = [...new Set(arrayIfYearIs2026)];
        let uniqueChars2027 = [...new Set(arrayIfYearIs2027)];
        let uniqueChars2028 = [...new Set(arrayIfYearIs2028)];
        let uniqueChars2029 = [...new Set(arrayIfYearIs2029)];
        let uniqueChars2030 = [...new Set(arrayIfYearIs2030)];
        let uniqueChars2031 = [...new Set(arrayIfYearIs2031)];
        let uniqueChars2032 = [...new Set(arrayIfYearIs2032)];
        let uniqueChars2033 = [...new Set(arrayIfYearIs2033)];
        let uniqueChars2034 = [...new Set(arrayIfYearIs2034)];
        let uniqueChars2035 = [...new Set(arrayIfYearIs2035)];
        let uniqueChars2036 = [...new Set(arrayIfYearIs2036)];
        let uniqueChars2037 = [...new Set(arrayIfYearIs2037)];
        let uniqueChars2038 = [...new Set(arrayIfYearIs2038)];
        let uniqueChars2039 = [...new Set(arrayIfYearIs2039)];
        let uniqueChars2040 = [...new Set(arrayIfYearIs2040)];

        // Now all arrays cleaned, I concat them all together to have a big array with no duplicates
        let arrayWithLabelsForChart = [].concat(uniqueChars2022, uniqueChars2023, uniqueChars2024, uniqueChars2025, uniqueChars2026,
          uniqueChars2027, uniqueChars2028, uniqueChars2029, uniqueChars2030, uniqueChars2031,
          uniqueChars2032, uniqueChars2033, uniqueChars2034, uniqueChars2035, uniqueChars2036,
          uniqueChars2037, uniqueChars2038, uniqueChars2039, uniqueChars2040)

        // That big array with no duplicates will go for a forEach so we can convert numbers on labels to string with months name

        let arrayWithNamesForLabel = []
        arrayWithLabelsForChart.forEach(element => {
          if (element == 1) { element = "January", arrayWithNamesForLabel.push(element) }
          if (element == 2) { element = "February", arrayWithNamesForLabel.push(element) }
          if (element == 3) { element = "March", arrayWithNamesForLabel.push(element) }
          if (element == 4) { element = "April", arrayWithNamesForLabel.push(element) }
          if (element == 5) { element = "May", arrayWithNamesForLabel.push(element) }
          if (element == 6) { element = "June", arrayWithNamesForLabel.push(element) }
          if (element == 7) { element = "July", arrayWithNamesForLabel.push(element) }
          if (element == 8) { element = "August", arrayWithNamesForLabel.push(element) }
          if (element == 9) { element = "September", arrayWithNamesForLabel.push(element) }
          if (element == 10) { element = "October", arrayWithNamesForLabel.push(element) }
          if (element == 11) { element = "November", arrayWithNamesForLabel.push(element) }
          if (element == 12) { element = "December", arrayWithNamesForLabel.push(element) }
        })

        // We push the array with name of months to chart label
        this.lineChartLabelsForMonth = arrayWithNamesForLabel

        // 18 years so 18 fors  to count how many times a month trained. Each for for each year until 2040
        let countFor2022 = {};
        for (let i = 0; i < arrayForYear2022.length; i++) {
          countFor2022[arrayForYear2022[i]] = (countFor2022[arrayForYear2022[i]] || 0) + 1;
        }

        let countFor2023 = {};
        for (let i = 0; i < arrayIfYearIs2023.length; i++) {
          countFor2023[arrayIfYearIs2023[i]] = (countFor2023[arrayIfYearIs2023[i]] || 0) + 1;
        }

        let countFor2024 = {};
        for (let i = 0; i < arrayIfYearIs2024.length; i++) {
          countFor2024[arrayIfYearIs2024[i]] = (countFor2024[arrayIfYearIs2024[i]] || 0) + 1;
        }

        let countFor2025 = {};
        for (let i = 0; i < arrayIfYearIs2025.length; i++) {
          countFor2025[arrayIfYearIs2025[i]] = (countFor2025[arrayIfYearIs2025[i]] || 0) + 1;
        }

        let countFor2026 = {};
        for (let i = 0; i < arrayIfYearIs2026.length; i++) {
          countFor2026[arrayIfYearIs2026[i]] = (countFor2026[arrayIfYearIs2026[i]] || 0) + 1;
        }

        let countFor2027 = {};
        for (let i = 0; i < arrayIfYearIs2026.length; i++) {
          countFor2027[arrayIfYearIs2026[i]] = (countFor2027[arrayIfYearIs2026[i]] || 0) + 1;
        }

        let countFor2028 = {};
        for (let i = 0; i < arrayIfYearIs2026.length; i++) {
          countFor2028[arrayIfYearIs2026[i]] = (countFor2028[arrayIfYearIs2026[i]] || 0) + 1;
        }

        let countFor2029 = {};
        for (let i = 0; i < arrayIfYearIs2026.length; i++) {
          countFor2029[arrayIfYearIs2026[i]] = (countFor2029[arrayIfYearIs2026[i]] || 0) + 1;
        }

        let countFor2030 = {};
        for (let i = 0; i < arrayIfYearIs2026.length; i++) {
          countFor2030[arrayIfYearIs2026[i]] = (countFor2030[arrayIfYearIs2026[i]] || 0) + 1;
        }

        let countFor2031 = {};
        for (let i = 0; i < arrayIfYearIs2026.length; i++) {
          countFor2031[arrayIfYearIs2026[i]] = (countFor2031[arrayIfYearIs2026[i]] || 0) + 1;
        }

        let countFor2032 = {};
        for (let i = 0; i < arrayIfYearIs2026.length; i++) {
          countFor2032[arrayIfYearIs2026[i]] = (countFor2032[arrayIfYearIs2026[i]] || 0) + 1;
        }

        let countFor2033 = {};
        for (let i = 0; i < arrayIfYearIs2026.length; i++) {
          countFor2033[arrayIfYearIs2026[i]] = (countFor2033[arrayIfYearIs2026[i]] || 0) + 1;
        }

        let countFor2034 = {};
        for (let i = 0; i < arrayIfYearIs2026.length; i++) {
          countFor2034[arrayIfYearIs2026[i]] = (countFor2034[arrayIfYearIs2026[i]] || 0) + 1;
        }

        let countFor2035 = {};
        for (let i = 0; i < arrayIfYearIs2026.length; i++) {
          countFor2035[arrayIfYearIs2026[i]] = (countFor2035[arrayIfYearIs2026[i]] || 0) + 1;
        }

        let countFor2036 = {};
        for (let i = 0; i < arrayIfYearIs2026.length; i++) {
          countFor2036[arrayIfYearIs2026[i]] = (countFor2036[arrayIfYearIs2026[i]] || 0) + 1;
        }

        let countFor2037 = {};
        for (let i = 0; i < arrayIfYearIs2026.length; i++) {
          countFor2037[arrayIfYearIs2026[i]] = (countFor2037[arrayIfYearIs2026[i]] || 0) + 1;
        }

        let countFor2038 = {};
        for (let i = 0; i < arrayIfYearIs2026.length; i++) {
          countFor2038[arrayIfYearIs2026[i]] = (countFor2038[arrayIfYearIs2026[i]] || 0) + 1;
        }

        let countFor2039 = {};
        for (let i = 0; i < arrayIfYearIs2026.length; i++) {
          countFor2039[arrayIfYearIs2026[i]] = (countFor2039[arrayIfYearIs2026[i]] || 0) + 1;
        }

        let countFor2040 = {};
        for (let i = 0; i < arrayIfYearIs2026.length; i++) {
          countFor2040[arrayIfYearIs2026[i]] = (countFor2040[arrayIfYearIs2026[i]] || 0) + 1;
        }


        // We extract the values for objects (the objets contains how many times a month per year the user have trained)
        let dataArrayForMonthsIn2022 = Object.values(countFor2022)
        let dataArrayForMonthsIn2023 = Object.values(countFor2023)
        let dataArrayForMonthsIn2024 = Object.values(countFor2024)
        let dataArrayForMonthsIn2025 = Object.values(countFor2025)
        let dataArrayForMonthsIn2026 = Object.values(countFor2026)
        let dataArrayForMonthsIn2027 = Object.values(countFor2027)
        let dataArrayForMonthsIn2028 = Object.values(countFor2028)
        let dataArrayForMonthsIn2029 = Object.values(countFor2029)
        let dataArrayForMonthsIn2030 = Object.values(countFor2030)
        let dataArrayForMonthsIn2031 = Object.values(countFor2031)
        let dataArrayForMonthsIn2032 = Object.values(countFor2032)
        let dataArrayForMonthsIn2033 = Object.values(countFor2033)
        let dataArrayForMonthsIn2034 = Object.values(countFor2034)
        let dataArrayForMonthsIn2035 = Object.values(countFor2035)
        let dataArrayForMonthsIn2036 = Object.values(countFor2036)
        let dataArrayForMonthsIn2037 = Object.values(countFor2037)
        let dataArrayForMonthsIn2038 = Object.values(countFor2038)
        let dataArrayForMonthsIn2039 = Object.values(countFor2039)
        let dataArrayForMonthsIn2040 = Object.values(countFor2040)

        // We put all those result in one big array. To rule them all.
        let finalArrayWithData = [].concat(dataArrayForMonthsIn2022, dataArrayForMonthsIn2023, dataArrayForMonthsIn2024, dataArrayForMonthsIn2025,
          dataArrayForMonthsIn2026, dataArrayForMonthsIn2027, dataArrayForMonthsIn2028, dataArrayForMonthsIn2029,
          dataArrayForMonthsIn2030, dataArrayForMonthsIn2031, dataArrayForMonthsIn2032, dataArrayForMonthsIn2033,
          dataArrayForMonthsIn2034, dataArrayForMonthsIn2035, dataArrayForMonthsIn2036, dataArrayForMonthsIn2037,
          dataArrayForMonthsIn2038, dataArrayForMonthsIn2039, dataArrayForMonthsIn2040)

  
        this.lineChartDataForMonth.forEach(respper => {
          respper.data = finalArrayWithData
        })
        this.countOnMonth = finalArrayWithData[1];
        this.countOnLastMonth = finalArrayWithData[finalArrayWithData.length -2]


      })
    })
  }

  getStatsWeekTrained() {

    let newrasrasrArr = []

    // we get the days trained in history
    this.dataService.getAll().subscribe(element => {
      // we cextract the property DayTrained and iterate over it
      element.map(a => a.dayTrained).forEach(resp => {
        // we convert every day to Int
        let respToNumber = parseInt(resp.substring(0, resp.length - 8).slice(-2))
        // we push the results to array ( 5, 6, 7, etc)
        newrasrasrArr.push(respToNumber)
        let newArrayWithDaysTrained = []
        // we iterate through the current week
        this.currentWeek.forEach(resp => {
          // we iterate aswell through the array contaiting days trained
          newrasrasrArr.forEach(resp3 => {
            // we compare items in arrays to determine if days trained match current week
            // if they match, we push those matches into new array
            if (resp === resp3) {
              newArrayWithDaysTrained.push(resp)
            }
          })
        })
        this.weekTrained = newArrayWithDaysTrained

        console.log(this.weekTrained)
        this.weekTrained.forEach(resp =>{
          let dataTrained = resp
          this.indexs.push(this.currentWeek.findIndex(rank => rank == dataTrained));
        })
      })
    })


  }

  lastTimeTrained() {

    this.dataService.getAll().subscribe(resp => {
      // we get the days trained
      let result = resp.map(a => a.dayTrained);

      let varForDay = parseInt(result[0].substring(0, result[0].indexOf(".")))
      let varForMonth = parseInt(result[0].substring(result[0].indexOf(".") + 1).slice(0, -5))
      let varForYear = parseInt(result[0].substring(result[0].length - 4))

      // we get data from today, extract from string, convert to number so we can pass it to formatDistance
      let todaysDate = format(new Date(), 'dd')
      let varForToday = parseInt(todaysDate.substring(0, result[0].indexOf(".")))
      let varForThisMonth = parseInt(format(new Date(), 'MM'))
      let varForThisYear = parseInt(format(new Date(), 'dd.MM.yyyy'.substring(6)))

      // compare variables for last training and today so we can get for example "last day oyou trained was 2 days ago" etc
      var distanceFromDayTrainedToToday = formatDistance(new Date(varForThisYear, varForThisMonth, varForToday), new Date(varForYear, varForMonth, varForDay))

      if (distanceFromDayTrainedToToday == "less than a minute") {
        this.lastDayTrained = false;
        this.trainedToday = true;
        this.messageForLastDayTrained = 'You trained today. Congrats!'
      } else if (distanceFromDayTrainedToToday == "1 day") {
        this.messageForLastDayTrained = 'Last day you trained was yesterday.'
        this.lastDayTrained = true;
        this.trainedToday = false
      } else {
        this.messageForLastDayTrained = 'Last day you trained was ' + distanceFromDayTrainedToToday + ' ago'
        this.lastDayTrained = true;
        this.trainedToday = false
      }
    })
  }

  getWeekTrained(year, month, day) {
    // we get first day of week trained
    let firstDayOfWeek = startOfWeek(new Date(year, month - 1, day), { weekStartsOn: 1 }).toString()
    let firstDayOfWeekToInt = parseInt(firstDayOfWeek.substring(0, firstDayOfWeek.length - 52).slice(-2))

    // we get last day of week trained
    let getLastDayOfWeek = endOfWeek(new Date(year, month - 1, day), { weekStartsOn: 1 }).toString()
    let getLastDayOfWeekToInt = parseInt(getLastDayOfWeek.substring(0, getLastDayOfWeek.length - 52).slice(-2))

    // this array will contain week trained
    let weekTrained = new Array()
    for (let i = firstDayOfWeekToInt; i < getLastDayOfWeekToInt + 1; i++) {
      weekTrained.push(i)
    }
    // this if will check if we have a situation in wich the first day of the week is greater than last day of week
    // for example week starts on monday 28 and ends on sunday 4th
    let newArr = []
    if (firstDayOfWeekToInt > getLastDayOfWeekToInt) {
      if (month == 4 || month == 6 || month == 9 || month == 11) {
        let endOfMonthVariable = 30
        for (let i = firstDayOfWeekToInt; i < endOfMonthVariable + 1; i++) {
          newArr.push(i)
        }
        for (let i = 1; i < getLastDayOfWeekToInt + 1; i++) {
          newArr.push(i)
        }
        weekTrained.push(newArr)
      }
      if (month == 1 || month == 3 || month == 5 || month == 7 || month == 8 || month == 10 || month == 12) {
        let endOfMonthVariable = 31
        for (let i = firstDayOfWeekToInt; i < endOfMonthVariable + 1; i++) {
          newArr.push(i)
        }
        for (let i = 1; i < getLastDayOfWeekToInt + 1; i++) {
          newArr.push(i)
        }
        weekTrained.push(newArr)

      }
      if (month == 2) {
        let endOfMonthVariable = 28
        for (let i = firstDayOfWeekToInt; i < endOfMonthVariable; i++) {
          newArr.push(i)
        }
        for (let i = 1; i < getLastDayOfWeekToInt + 1; i++) {
          newArr.push(i)
        }
        weekTrained.push(newArr)
      }

    }
    return weekTrained;

  }

  getCurrentWeek() {
    // We get data from today's day, month, and year, converted to int
    let todaysDate = format(new Date(), 'dd.MM.yyyy')
    let varForToday = parseInt(todaysDate.substring(0, todaysDate.indexOf(".")))
    let month = parseInt(todaysDate.substring(todaysDate.indexOf(".") + 1).slice(0, -5))
    let varForThisYear = parseInt(todaysDate.substring(todaysDate.length - 4))

    // We get the start of the week
    let startOfCurrentWeek = startOfWeek(new Date(varForThisYear, month - 1, varForToday), { weekStartsOn: 1 }).toString()
    let firstDayOfWeekToInt = parseInt(startOfCurrentWeek.substring(0, startOfCurrentWeek.length - 52).slice(-2))
    this.firstDayOfWeek = firstDayOfWeekToInt;

    // We get the end of the week
    let LastDayOfCurrentWeek = endOfWeek(new Date(varForThisYear, month - 1, varForToday), { weekStartsOn: 1 }).toString()
    let lastDayOfCurrentWeekToInt = parseInt(LastDayOfCurrentWeek.substring(0, LastDayOfCurrentWeek.length - 52).slice(-2))
    this.lastDayOfWeek = lastDayOfCurrentWeekToInt;

    // we fill this array wich comntais numbers of day of the week to match days trained
    let currentWeek = []
    for (let i = firstDayOfWeekToInt; i < lastDayOfCurrentWeekToInt + 1; i++) {
      currentWeek.push(i)
    }

    if (firstDayOfWeekToInt > lastDayOfCurrentWeekToInt) {
      let newArr = []
      if (month == 4 || month == 6 || month == 9 || month == 11) {
        let endOfMonthVariable = 30
        for (let i = firstDayOfWeekToInt; i < endOfMonthVariable + 1; i++) {
          newArr.push(i)
        }
        for (let i = 1; i < lastDayOfCurrentWeekToInt + 1; i++) {
          newArr.push(i)
        }
        currentWeek.push(newArr)
      }
      if (month == 1 || month == 3 || month == 5 || month == 7 || month == 8 || month == 10 || month == 12) {
        let endOfMonthVariable = 31
        for (let i = firstDayOfWeekToInt; i < endOfMonthVariable + 1; i++) {
          newArr.push(i)
        }
        for (let i = 1; i < lastDayOfCurrentWeekToInt + 1; i++) {
          newArr.push(i)
        }
        currentWeek.push(newArr)
      }
      if (month == 2) {
        let endOfMonthVariable = 28
        for (let i = firstDayOfWeekToInt; i < endOfMonthVariable; i++) {
          newArr.push(i)
        }
        for (let i = 1; i < lastDayOfCurrentWeekToInt + 1; i++) {
          newArr.push(i)
        }
        currentWeek = newArr
      }

    }
    this.currentWeek = currentWeek;
    console.log(currentWeek)
  }


}

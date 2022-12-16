import { Component, OnInit } from '@angular/core';
import { endOfWeek, formatDistance, startOfWeek } from 'date-fns';
import { DataService } from '../services/data.service';
import { format } from 'date-fns';
import { ChartDataset, ChartOptions } from 'chart.js';



@Component({
  selector: 'app-charts',
  templateUrl: './charts.component.html',
  styleUrls: ['./charts.component.scss'],
})
export class ChartsComponent implements OnInit {

  constructor() { }

  
  lineChartData: ChartDataset[] = [
    { data: [85, 72, 78, 75, 77, 75, 120], label: 'Crude oil prices' },
  ];
  lineChartLabels:any = ['January', 'February', 'March', 'April', 'May', 'June', 'Damn'];
  lineChartOptions = { responsive: true };
  lineChartColors:any = [
    {
      borderColor: 'black',
      backgroundColor: 'rgba(255,255,0,0.28)',
    },
  ];
  lineChartLegend = true;
  lineChartPlugins = [];
  lineChartType = 'line';





  ngOnInit() {}

}

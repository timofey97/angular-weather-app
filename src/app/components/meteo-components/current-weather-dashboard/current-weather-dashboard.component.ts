import { Component, OnInit } from '@angular/core';
import { ChartModule } from 'primeng/chart';
import { TableModule } from 'primeng/table';
import { CardModule } from 'primeng/card';
import { NgIf } from '@angular/common';
import dayjs from 'dayjs';
import 'dayjs/locale/si';
import { SkeletonModule } from 'primeng/skeleton';
import { IDailyUnits, IMeteo } from '../../../core/types/meteo.type';
import { MeteoService } from '../../../core/services/meteo.service';

dayjs.locale('en');
@Component({
  selector: 'app-current-weather-dashboard',
  standalone: true,
  imports: [ChartModule, TableModule, CardModule, NgIf, SkeletonModule],
  templateUrl: './current-weather-dashboard.component.html',
  styleUrl: './current-weather-dashboard.component.scss',
})
export class CurrentWeatherDashboardComponent implements OnInit {
  meteoData!: IMeteo;
  isLoading: boolean = true;
  commonOptions: any;
  chartData: any;
  constructor(private meteoService: MeteoService) {}

  ngOnInit() {
    this.fetchWeatherData();
  }

  fetchWeatherData() {
    this.meteoService.meteoData$.subscribe({
      next: (data) => {
        if (!data) return;
        this.meteoData = data;
        console.log('data: ', data);
        this.initializeChartOptions();

        this.prepareChartData();
        this.isLoading = false;
      },
    });
  }

  prepareChartData() {
    const dailyTimes = this.meteoData.daily.time.map((unixTime) => {
      return dayjs.unix(unixTime).format('DD. MMMM YYYY');
    });
    const dailyTemperature = this.meteoData.daily.temperature_2m_max;
    const dailyPrecipitation = this.meteoData.daily.precipitation_sum;
    const dailyWindSpeed = this.meteoData.daily.wind_speed_10m_max;
    this.chartData = {
      labels: dailyTimes,
      datasets: [
        {
          label: 'Temperature',
          id: 'temperature_2m_max',
          data: dailyTemperature,
          fill: false,
          backgroundColor: '#2196F3',
          tension: 0.4,
          minBarLength: 7,
        },
        {
          label: 'Precipitation',
          id: 'precipitation_sum',
          data: dailyPrecipitation,
          fill: true,
          backgroundColor: '#FF9800',
          tension: 0.4,
          minBarLength: 10,
        },
        {
          label: 'Wind Speed',
          id: 'wind_speed_10m_max',
          data: dailyWindSpeed,
          fill: false,
          backgroundColor: '#4CAF50',
          tension: 0.4,
          minBarLength: 10,
        },
      ],
    };
  }

  initializeChartOptions() {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue(
      '--text-color-secondary'
    );
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');
    const getUnitForLabelCallback = (id: keyof IDailyUnits) =>
      this.meteoData.daily_units[id];

    this.commonOptions = {
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: {
            color: textColor,
          },
        },
        tooltip: {
          callbacks: {
            label: function (context: any) {
              var label = context.dataset.label || '';
              if (label) {
                label += ': ';
              }
              if (context.parsed.y !== null) {
                label +=
                  context.parsed.y +
                  ' ' +
                  getUnitForLabelCallback(context.dataset.id);
              }
              return label;
            },
          },
        },
      },
      scales: {
        x: {
          ticks: {
            color: textColorSecondary,
            font: {
              weight: 500,
            },
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false,
          },
        },
        y: {
          ticks: {
            color: textColorSecondary,
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false,
          },
        },
      },
    };
  }
}

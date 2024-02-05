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
  weatherInfo!: IMeteo; // Holds the weather data
  dataLoading: boolean = true; // Tracks data loading state
  chartOptions: any; // Options for the chart configuration
  weatherChart: any; // Data structure for the chart

  constructor(private weatherSvc: MeteoService) {} // Injects the WeatherService

  ngOnInit(): void {
    this.retrieveWeatherInfo(); // Fetch weather data on component initialization
  }

  // Fetches weather data and updates component state
  retrieveWeatherInfo(): void {
    this.weatherSvc.meteoData$.subscribe({
      next: (info) => {
        if (!info) return; // Exit if no data
        this.weatherInfo = info; // Update weather data
        this.setupChartOptions(); // Setup chart options based on new data
        this.constructChartData(); // Prepare chart data structure
        this.dataLoading = false; // Update loading state
      },
    });
  }

  // Prepares the data for the weather chart
  constructChartData(): void {
    const formatTime = (time: number) =>
      dayjs.unix(time).format('DD. MMMM YYYY'); // Format unix timestamps
    const times = this.weatherInfo.daily.time.map(formatTime); // Map timestamps to formatted strings
    const temperatures = this.weatherInfo.daily.temperature_2m_max; // Max temperatures
    const rainfalls = this.weatherInfo.daily.precipitation_sum; // Precipitation sums
    const windSpeeds = this.weatherInfo.daily.wind_speed_10m_max; // Max wind speeds

    // Construct the data object for the chart
    this.weatherChart = {
      labels: times,
      datasets: [
        // Dataset for temperatures
        {
          type: 'line',
          label: 'Max Temperature',
          data: temperatures,
          backgroundColor: 'rgb(33, 150, 243)',
          borderColor: 'rgb(33, 150, 243)',
          tension: 0.4,
        },
        // Dataset for precipitation
        {
          type: 'line',
          label: 'Total Precipitation',
          data: rainfalls,
          backgroundColor: 'rgb(255, 152, 0)',
          borderColor: 'rgb(255, 152, 0)',
          tension: 0.4,
        },
        // Dataset for wind speeds
        {
          type: 'line',
          label: 'Max Wind Speed',
          data: windSpeeds,
          backgroundColor: 'rgb(76, 175, 80)',
          borderColor: 'rgb(76, 175, 80)',
          tension: 0.4,
        },
      ],
    };
  }

  // Sets up chart options, including custom tooltip and scales configurations
  setupChartOptions(): void {
    const getUnitForLabelCallback = (id: keyof IDailyUnits) =>
      this.weatherInfo.daily_units[id];
    this.chartOptions = {
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: {
            color: '#FF7200', // Customizes legend label colors using CSS variables
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
            color: 'white',
          },
          grid: {
            color: 'white',
            drawBorder: true,
          },
        },
        y: {
          ticks: {
            color: 'white',
          },
          grid: {
            color: 'white',
            drawBorder: false,
          },
        },
      },
    };
  }
}

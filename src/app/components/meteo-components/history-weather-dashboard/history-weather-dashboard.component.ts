import { Component, OnInit } from '@angular/core';
import { ChartModule } from 'primeng/chart';
import dayjs from 'dayjs';
import { TableModule } from 'primeng/table';
import { CardModule } from 'primeng/card';
import { NgIf } from '@angular/common';
import { SkeletonModule } from 'primeng/skeleton';
import { MeteoService } from '../../../core/services/meteo.service';
import { IMeteo, IDailyUnits } from '../../../core/types/meteo.type';

@Component({
  selector: 'app-history-weather-dashboard',
  standalone: true,
  imports: [ChartModule, TableModule, CardModule, NgIf, SkeletonModule],
  templateUrl: './history-weather-dashboard.component.html',
  styleUrl: './history-weather-dashboard.component.scss',
})
export class HistoryWeatherDashboardComponent implements OnInit {
  weatherHistory!: IMeteo;
  isLoading: boolean = true;
  chartOptions: any;
  weatherChartData: any;

  constructor(private weatherDataService: MeteoService) {} // Изменили имя сервиса

  ngOnInit() {
    this.loadWeatherHistoryData();
  }

  loadWeatherHistoryData() {
    this.weatherDataService.weatherHistory$.subscribe({
      next: (data) => {
        if (!data) return;
        this.weatherHistory = data;
        this.initializeChartOptions();
        this.prepareChartData();
        this.isLoading = false;
      },
    });
  }

  prepareChartData() {
    // Преобразование временных меток дат в формат 'DD. MMMM YYYY'
    const formattedDates = this.weatherHistory.daily.time.map((date) =>
      dayjs(date).format('DD. MMMM YYYY')
    );

    // Подготовка данных для графика максимальной и минимальной температуры
    const maxTemperatureData = this.weatherHistory.daily.temperature_2m_max;
    const minTemperatureData = this.weatherHistory.daily.temperature_2m_min;

    // Подготовка данных для графика ощущаемой температуры
    const maxApparentTemperatureData =
      this.weatherHistory.daily.apparent_temperature_max;
    const minApparentTemperatureData =
      this.weatherHistory.daily.apparent_temperature_min;

    // Сборка объекта данных графика
    this.weatherChartData = {
      labels: formattedDates,
      datasets: [
        {
          label: 'Max Temperature (°C)',
          data: maxTemperatureData,
          borderColor: '#FF6384',
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          type: 'line',
          tension: 0.4,
          yAxisID: 'y',
        },
        {
          label: 'Min Temperature (°C)',
          data: minTemperatureData,
          borderColor: '#36A2EB',
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          type: 'line',
          tension: 0.4,
          yAxisID: 'y',
        },
        {
          label: 'Max Apparent Temperature (°C)',
          data: maxApparentTemperatureData,
          borderColor: '#FFCE56',
          backgroundColor: 'rgba(255, 206, 86, 0.2)',
          type: 'line',
          tension: 0.4,
          yAxisID: 'y',
        },
        {
          label: 'Min Apparent Temperature (°C)',
          data: minApparentTemperatureData,
          borderColor: '#4BC0C0',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          type: 'line',
          tension: 0.4,
          yAxisID: 'y',
        },
      ],
    };
  }

  initializeChartOptions() {
    this.chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          type: 'linear',
          display: true,
          position: 'left',
          ticks: {
            color: 'white',
          },
          grid: {
            color: 'white',
            drawBorder: true,
            borderColor: 'white',
        },
      },
        x: {
          ticks: {
            color: 'white',
          },
          grid: {
            color: 'white',
            drawBorder: true,
            borderColor: 'white',
          }
        }
      },
      plugins: {
        legend: {
          labels: {
            color: 'white',
          },
          display: true,
          position: 'top',
        },
        tooltip: {
          mode: 'index',
          intersect: false,
          bodyColor: 'white',
          titleColor: 'white',
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
        }
      },
    }
  }
}

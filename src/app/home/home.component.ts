import { Component } from '@angular/core';
import { MeteoService } from '../core/services/meteo.service';
import { CurrentWeatherDashboardComponent } from '../components/meteo-components/current-weather-dashboard/current-weather-dashboard.component';
import { HistoryWeatherDashboardComponent } from '../components/meteo-components/history-weather-dashboard/history-weather-dashboard.component';
import { WeatherCardComponent } from '../components/meteo-components/weather-card/weather-card.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CurrentWeatherDashboardComponent,
    HistoryWeatherDashboardComponent,
    WeatherCardComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  constructor(private weatherService: MeteoService) {
    this.weatherService.requestUserLocation();
  }
}

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { HeaderComponent } from './components/header/header.component';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { MeteoService } from './core/services/meteo.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    ButtonModule,
    HeaderComponent,
    ToastModule,
  ],
  providers: [MessageService, MeteoService],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'angular-weather-app';

  /**
   * Constructor for the WeatherComponent class.
   *
   * @param {MeteoService} weatherService - the weather service to be injected
   */
  constructor(private weatherService: MeteoService) {}
}

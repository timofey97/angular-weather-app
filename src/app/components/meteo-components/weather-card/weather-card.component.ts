import { Component } from '@angular/core';
import { CardModule } from 'primeng/card';
import { AsyncPipe, NgForOf, NgIf } from '@angular/common';
import { SkeletonModule } from 'primeng/skeleton';
import { CustomCitySelectComponent } from '../custom-city-select/custom-city-select.component';
import { MeteoService } from '../../../core/services/meteo.service';
import { WeatherVisualBannerComponent } from '../weather-visual-banner/weather-visual-banner.component';

@Component({
  selector: 'app-weather-card',
  standalone: true,
  imports: [
    CardModule,
    AsyncPipe,
    NgIf,
    NgForOf,
    SkeletonModule,
    CustomCitySelectComponent,
    WeatherVisualBannerComponent,
  ],
  templateUrl: './weather-card.component.html',
  styleUrl: './weather-card.component.scss',
})
export class WeatherCardComponent {
  // currentWeather: IMeteo | undefined;
  constructor(public meteo: MeteoService) {
    // this.meteo.currentWeather$.subscribe({
    //   next: (data) => {
    //     console.log(data)
    //     if (!data) return;
    //     this.currentWeather = data
    //   }
    // })
  }
}

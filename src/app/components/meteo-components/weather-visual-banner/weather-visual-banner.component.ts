import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { ICurrentMeteo } from '../../../core/types/meteo.type';

@Component({
  selector: 'app-weather-visual-banner',
  standalone: true,
  imports: [NgOptimizedImage],
  templateUrl: './weather-visual-banner.component.html',
  styleUrl: './weather-visual-banner.component.scss',
})
export class WeatherVisualBannerComponent implements OnChanges {
  @Input() currentMeteo!: ICurrentMeteo | undefined;
  icon: string = '';

  weatherCodeToIcon: Record<number, { day: string; night: string }> = {
    0: { day: 'clear-day.svg', night: 'clear-night.svg' }, // Clear Sky
    1: { day: 'partly-cloudy-day.svg', night: 'partly-cloudy-night.svg' }, // Mainly Clear
    2: { day: 'partly-cloudy-day.svg', night: 'partly-cloudy-night.svg' }, // Partly Cloudy
    3: { day: 'cloudy.svg', night: 'cloudy.svg' }, // Overcast
    45: { day: 'fog.svg', night: 'fog.svg' }, // Fog
    48: { day: 'fog.svg', night: 'fog.svg' }, // Depositing Rime Fog
    51: { day: 'drizzle.svg', night: 'drizzle.svg' }, // Light Drizzle
    53: { day: 'drizzle.svg', night: 'drizzle.svg' }, // Moderate Drizzle
    55: { day: 'drizzle.svg', night: 'drizzle.svg' }, // Dense Intensity Drizzle
    56: { day: 'drizzle.svg', night: 'drizzle.svg' }, // Light Freezing Drizzle
    57: { day: 'drizzle.svg', night: 'drizzle.svg' }, // Dense Intensity Freezing Drizzle
    61: { day: 'rain.svg', night: 'rain.svg' }, // Slight Rain
    63: { day: 'rain.svg', night: 'rain.svg' }, // Moderate Rain
    65: { day: 'rain.svg', night: 'rain.svg' }, // Heavy Rain
    66: { day: 'sleet.svg', night: 'sleet.svg' }, // Light Freezing Rain
    67: { day: 'sleet.svg', night: 'sleet.svg' }, // Heavy Freezing Rain
    71: { day: 'snow.svg', night: 'snow.svg' }, // Light Snowfall
    73: { day: 'snow.svg', night: 'snow.svg' }, // Moderate Snowfall
    75: { day: 'snow.svg', night: 'snow.svg' }, // Heavy Snowfall
    77: { day: 'snowflake.svg', night: 'snowflake.svg' }, // Snow Grains
    80: { day: 'rain.svg', night: 'rain.svg' }, // Slight Rain Showers
    81: { day: 'rain.svg', night: 'rain.svg' }, // Moderate Rain Showers
    82: { day: 'rain.svg', night: 'rain.svg' }, // Violent Rain Showers
    85: { day: 'snow.svg', night: 'snow.svg' }, // Light Snow Showers
    86: { day: 'snow.svg', night: 'snow.svg' }, // Heavy Snow Showers
    95: { day: 'thunderstorms-day.svg', night: 'thunderstorms-night.svg' }, // Slight/Moderate Thunderstorm
    96: { day: 'thunderstorms-day.svg', night: 'thunderstorms-night.svg' }, // Thunderstorm with Light Hail
    99: { day: 'thunderstorms-day.svg', night: 'thunderstorms-night.svg' }, // Thunderstorm with Heavy Hail
  };


  ngOnChanges(): void {
    this.selectIcon();
  }

  selectIcon(): void {
    if (!this.currentMeteo) return;
    const timeOfDay = this.currentMeteo.is_day === 1 ? 'day' : 'night';
    const weatherIcon = this.weatherCodeToIcon[this.currentMeteo.weather_code];

    if (weatherIcon) {
      this.icon = weatherIcon[timeOfDay];
    } else {
      this.icon = 'default.svg'; // Fallback icon
    }
  }
}

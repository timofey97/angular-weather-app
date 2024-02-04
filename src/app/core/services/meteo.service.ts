import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { ICitySearchResult, IGeoInfo, IMeteo } from '../types/meteo.type';
import { MessageService } from 'primeng/api';
import dayjs from 'dayjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class MeteoService {
  private geoInformation = new BehaviorSubject<IGeoInfo | null>(null);
  geoInformation$ = this.geoInformation.asObservable();

  private userCoordinates = new BehaviorSubject<{
    lat: number;
    lon: number;
  } | null>(null);

  private historicalWeatherData = new BehaviorSubject<IMeteo | null>(null);
  weatherHistory$ = this.historicalWeatherData.asObservable();

  private currentMeteoData = new BehaviorSubject<IMeteo | null>(null);
  meteoData$ = this.currentMeteoData.asObservable();

  constructor(
    private httpClient: HttpClient,
    private messageService: MessageService
  ) {}

  /**
   * Fetches current weather data
   */
  fetchCurrentMeteo(): void {
    const apiUrl = `${environment.forecastApiUrl}?latitude=${
      this.geoInformation.getValue()?.lat
    }&longitude=${
      this.geoInformation.getValue()?.lon
    }&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,rain,showers,snowfall,weather_code,cloud_cover,pressure_msl,surface_pressure,wind_speed_10m,wind_direction_10m,wind_gusts_10m&hourly=temperature_2m,relative_humidity_2m,apparent_temperature,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,sunrise,sunset,daylight_duration,sunshine_duration,uv_index_max,uv_index_clear_sky_max,precipitation_sum,rain_sum,showers_sum,snowfall_sum,precipitation_hours,precipitation_probability_max,wind_speed_10m_max,wind_gusts_10m_max,wind_direction_10m_dominant,shortwave_radiation_sum,et0_fao_evapotranspiration&timeformat=unixtime&timezone=auto`;
    this.httpClient.get<IMeteo>(apiUrl).subscribe({
      next: (data) => this.processMeteoData(data, 'current'),
      error: (error) =>
        this.showErrorMessage(error, 'Failed to fetch current weather data'),
    });
  }

  /**
   * Retrieves historical weather data
   */
  retrieveWeatherHistory(): void {
    const endDate = dayjs().subtract(3, 'day').format('YYYY-MM-DD');
    const startDate = dayjs(endDate).subtract(7, 'day').format('YYYY-MM-DD');
    const historyUrl = `${environment.historicalWeatherApiUrl}?latitude=${
      this.geoInformation.getValue()?.lat
    }&longitude=${
      this.geoInformation.getValue()?.lon
    }&start_date=${startDate}&end_date=${endDate}&...`; // URL with other parameters

    this.httpClient.get<IMeteo>(historyUrl).subscribe({
      next: (data) => this.processMeteoData(data, 'history'),
      error: (error) =>
        this.showErrorMessage(error, 'Failed to fetch weather history'),
    });
  }

  /**
   * Obtains geographic information
   */
  obtainGeoInformation(): void {
    const geoInfoUrl = environment.locationSearchApiUrl; // Assuming the URL is stored in environment
    this.httpClient.get<IGeoInfo>(geoInfoUrl).subscribe({
      next: (data) => this.updateGeoInformation(data),
      error: (error) =>
        this.showErrorMessage(error, 'Failed to obtain geographic information'),
    });
  }

  /**
   * Prompts user for location permission and updates position or handles error.
   */
  requestUserLocation(): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => this.updateUserPosition(position),
        (error) => this.handleLocationError(error),
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
      );
    } else {
      this.showErrorMessage(
        'Geolocation is not supported by this browser.',
        'Geolocation not supported'
      );
    }
  }

  /**
   * Gets user's geographical location
   */
  fetchUserLocation(): void {
    navigator.geolocation.getCurrentPosition(
      (position) => this.updateUserPosition(position),
      (error) => this.handleLocationError(error)
    );
  }

  /**
   * Updates geographic information for a new location
   */
  updateGeoInformation(newGeoInfo: IGeoInfo): void {
    this.geoInformation.next(newGeoInfo);
    this.fetchCurrentMeteo();
    this.retrieveWeatherHistory();
  }

  /**
   * Searches for city data
   */
  searchForCity(cityName: string): Observable<ICitySearchResult> {
    const citySearchUrl = `${environment.ipAddressLocationApiUrl}?name=${cityName}&count=5&language=en&format=json`;
    return this.httpClient.get<ICitySearchResult>(citySearchUrl);
  }

  // Private methods

  private processMeteoData(data: IMeteo, type: 'current' | 'history'): void {
    if (!data) return;
    const source =
      type === 'current' ? this.currentMeteoData : this.historicalWeatherData;
    source.next(data);
    this.messageService.add({
      severity: 'success',
      summary: 'Success',
      detail: `Meteo data for ${type} fetched successfully`,
    });
  }

  private showErrorMessage(detail: string, summary: string): void {
    this.messageService.add({
      severity: 'error',
      summary: summary,
      detail: detail,
    });
  }

  private updateUserPosition(position: GeolocationPosition): void {
    const coords = {
      lat: position.coords.latitude,
      lon: position.coords.longitude,
    };
    this.userCoordinates.next(coords); // Update coordinates
    this.geoInformation.next({
      lat: coords.lat,
      lon: coords.lon,
      city: '',
      country: '',
    }); // Directly update geoInformation if needed
    this.fetchCurrentMeteo();
    this.retrieveWeatherHistory();
  }

  private handleLocationError(error: GeolocationPositionError): void {
    console.log('error: ', error);
    // Handle user denial for location access or other errors
    switch (error.code) {
      case error.PERMISSION_DENIED:
        this.showErrorMessage(
          'User denied the request for Geolocation.',
          'Permission Denied'
        );
        break;
      case error.POSITION_UNAVAILABLE:
        this.showErrorMessage(
          'Location information is unavailable.',
          'Position Unavailable'
        );
        break;
      case error.TIMEOUT:
        this.showErrorMessage(
          'The request to get user location timed out.',
          'Request Timeout'
        );
        break;
      default:
        this.showErrorMessage('An unknown error occurred.', 'Unknown Error');
        break;
    }
    this.obtainGeoInformation();
    // Optionally set a default location here if required
  }
}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IntensityDataDto } from './intensity-data-dto';
import { Region } from './region';
import { RegionalIntensityDataDto } from './regional-intensity-data-dto';

@Injectable({
  providedIn: 'root'
})
export class CarbonIntensityApiService {
  private headers = { 'Accept': 'application/json' };

  constructor(private http: HttpClient) { }

  getNationalForecast(): Observable<IntensityDataDto> {
    const dateFrom = new Date().toISOString();
    const requestUrl = `https://api.carbonintensity.org.uk/intensity/${dateFrom}/fw48h`;

    return this.http.get<IntensityDataDto>(requestUrl, { headers: this.headers });
  }

  getRegionalForecast(region: Region): Observable<RegionalIntensityDataDto> {
    const dateFrom = new Date().toISOString();
    const requestUrl = `https://api.carbonintensity.org.uk/regional/intensity/${dateFrom}/fw48h/regionid/${region}`;

    return this.http.get<RegionalIntensityDataDto>(requestUrl, { headers: this.headers });
  }
}

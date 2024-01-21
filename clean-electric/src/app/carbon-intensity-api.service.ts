import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IntensityData } from './intensity-data';
import { Region } from './region';
import { RegionalIntensityData } from './regional-intensity-data';

@Injectable({
  providedIn: 'root'
})
export class CarbonIntensityApiService {
  private headers = { 'Accept': 'application/json' };

  constructor(private http: HttpClient) { }

  getNationalForecast(): Observable<IntensityData> {
    const dateFrom = new Date().toISOString();
    const requestUrl = `https://api.carbonintensity.org.uk/intensity/${dateFrom}/fw48h`;

    return this.http.get<IntensityData>(requestUrl, { headers: this.headers });
  }

  getRegionalForecast(region: Region): Observable<RegionalIntensityData> {
    const dateFrom = new Date().toISOString();
    const requestUrl = `https://api.carbonintensity.org.uk/regional/intensity/${dateFrom}/fw48h/regionid/${region}`;

    return this.http.get<RegionalIntensityData>(requestUrl, { headers: this.headers });
  }
}

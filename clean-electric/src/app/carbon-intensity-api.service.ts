import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IntensityData } from './intensity-data';

@Injectable({
  providedIn: 'root'
})
export class CarbonIntensityApiService {

  constructor(private http: HttpClient) { }

  getNationalForecast(): Observable<IntensityData> {
    const dateFrom = new Date().toISOString();
    const requestUrl = `https://api.carbonintensity.org.uk/intensity/${dateFrom}/fw48h`;
    const headers = { 'Accept': 'application/json' };

    return this.http.get<IntensityData>(requestUrl, { headers });
  }
}

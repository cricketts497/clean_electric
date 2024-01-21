import { Injectable } from '@angular/core';
import { CarbonIntensityApiService } from './carbon-intensity-api.service';
import { IntensityData } from './intensity-data';
import { Observable, map } from 'rxjs';
import { IntensityPeriod } from './intensity-period';
import { IntensityIndex } from './intensity-index';
import { Region } from './region';
import { RegionalIntensityData } from './regional-intensity-data';

@Injectable({
  providedIn: 'root'
})
export class CarbonMinimizeService {
  private periodDurationInMs: number = 30 * 60 * 1000;
  private localeString = 'en-GB';

  constructor(private carbonIntensityApiService: CarbonIntensityApiService) { }

  getPeriod(duration: number, deadline: Date): Observable<IntensityPeriod> {
    return this.carbonIntensityApiService.getNationalForecast().pipe(
      map((data: IntensityData) => this.getDateRange(data, duration, deadline)),
    );
  }

  getRegionalPeriod(duration: number, deadline: Date, region: Region): Observable<IntensityPeriod> {
    return this.carbonIntensityApiService.getRegionalForecast(region).pipe(
      map((data: RegionalIntensityData) => this.mapToIntensityData(data)),
      map((data: IntensityData) => this.getDateRange(data, duration, deadline)),
    );
  }

  private mapToIntensityData(regionalData: RegionalIntensityData): IntensityData {
    const intensityData: IntensityData = {
      data: regionalData.data.data,
    };

    return intensityData;
  }

  private getDateRange(data: IntensityData, duration: number, deadline: Date): IntensityPeriod {
    // Filter periods starting after now and ending before deadline
    const periods = data?.data?.filter((datum: IntensityPeriod) =>
      new Date(datum.to) < deadline && new Date(datum.from) > new Date()) ?? [];

    // Find the optimal period with the minimum average intensity
    let minimumAverageIntensity: number = Number.MAX_VALUE;
    let optimalStart: string = new Date().toISOString();
    let optimalIntensityIndex: IntensityIndex = periods[0]?.intensity.index ?? IntensityIndex.Moderate;
    for (let periodStartIndex = 0; periodStartIndex <= periods.length - duration; periodStartIndex++) {
        const periodEndIndex = periodStartIndex + duration;
        const averageIntensity  = periods
          .slice(periodStartIndex, periodEndIndex)
          .reduce((a: number, b: IntensityPeriod) => a + b.intensity.forecast, 0) / duration;

        if (averageIntensity < minimumAverageIntensity) {
          minimumAverageIntensity = averageIntensity;
          optimalStart = periods[periodStartIndex].from;
          optimalIntensityIndex = periods[periodStartIndex].intensity.index;
        }
    }

    return {
      from: new Date(optimalStart).toLocaleString(this.localeString),
      to: new Date(new Date(optimalStart).getTime() + duration * this.periodDurationInMs).toLocaleString(this.localeString),
      intensity: {
        forecast: minimumAverageIntensity,
        actual: Number.NaN,
        index: optimalIntensityIndex,
      },
    };
  }
}

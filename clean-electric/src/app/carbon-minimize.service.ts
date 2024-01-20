import { Injectable } from '@angular/core';
import { CarbonIntensityApiService } from './carbon-intensity-api.service';
import { IntensityData } from './intensity-data';
import { Observable, map } from 'rxjs';
import { IntensityPeriod } from './intensity-period';
import { IntensityIndex } from './intensity-index';

@Injectable({
  providedIn: 'root'
})
export class CarbonMinimizeService {
  private periodDurationInMs: number = 30 * 60 * 1000;

  constructor(private carbonIntensityApiService: CarbonIntensityApiService) { }

  getPeriod(duration: number, deadline: Date): Observable<IntensityPeriod> {
    return this.carbonIntensityApiService.getNationalForecast().pipe(
      map((data: IntensityData) => this.getDateRange(data, duration, deadline))
    );
  }

  // duration is number of periods
  private getDateRange(data: IntensityData, numberOfPeriods: number, deadline: Date): IntensityPeriod {
    const periodsEndingBeforeDeadline = data?.data?.filter((datum: IntensityPeriod) =>
      new Date(datum.to) < deadline && new Date(datum.from) > new Date()) ?? [];

    let optimalAverageIntensity: number = Number.MAX_VALUE;
    let optimalStart: string = new Date().toISOString();
    let optimalIndex: IntensityIndex = periodsEndingBeforeDeadline[0]?.intensity.index ?? IntensityIndex.Moderate;
    for (let periodStartIndex = 0; periodStartIndex <= periodsEndingBeforeDeadline.length - numberOfPeriods; periodStartIndex++) {
        const periodEndIndex = periodStartIndex + numberOfPeriods;
        const averageIntensity  = periodsEndingBeforeDeadline
          .slice(periodStartIndex, periodEndIndex)
          .reduce((a: number, b: IntensityPeriod) => a + b.intensity.forecast, 0) / numberOfPeriods;

        if (averageIntensity < optimalAverageIntensity) {
          optimalAverageIntensity = averageIntensity;
          optimalStart = periodsEndingBeforeDeadline[periodStartIndex].from;
          optimalIndex = periodsEndingBeforeDeadline[periodStartIndex].intensity.index;
        }
    }

    return {
      from: optimalStart,
      to: new Date(new Date(optimalStart).getTime() + numberOfPeriods * this.periodDurationInMs).toISOString(),
      intensity: {
        forecast: optimalAverageIntensity,
        actual: Number.NaN,
        index: optimalIndex,
      },
    };
  }
}

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
  private start: Date;
  private end: Date;

  constructor(private carbonIntensityApiService: CarbonIntensityApiService) {
    this.start = new Date();
    this.end = new Date();
    this.start.setHours(0,0);
    this.end.setHours(0,0);
  }

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

  setStart(hours: number, minutes: number): void {
    this.start.setHours(hours, minutes, 0, 0);
  }

  setEnd(hours: number, minutes: number): void {
    this.end.setHours(hours, minutes, 0, 0);
  }

  private mapToIntensityData(regionalData: RegionalIntensityData): IntensityData {
    const intensityData: IntensityData = {
      data: regionalData.data.data,
    };

    return intensityData;
  }

  private getDateRange(data: IntensityData, duration: number, deadline: Date): IntensityPeriod {
    // Filter periods starting after now and ending before deadline
    let periods = data?.data?.filter((datum: IntensityPeriod) =>
      new Date(datum.to) < deadline && new Date(datum.from) > new Date()) ?? [];

    if (this.start.getHours() !== this.end.getHours() || this.start.getMinutes() !== this.end.getMinutes()) {
      periods = periods.filter((datum: IntensityPeriod) => {
        const f = new Date(datum.from);
        const t = new Date(datum.to);

        if (f > t || this.start > this.end) {
          return false;
        }

        const from = new Date(this.start);
        from.setHours(f.getHours(), f.getMinutes(), 0, 0);

        const to = new Date(this.end);
        to.setHours(t.getHours(), t.getMinutes(), 0, 0);

        return from <= to && from >= this.start && to <= this.end;
      });
    }

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
        forecast: minimumAverageIntensity < Number.MAX_VALUE ? minimumAverageIntensity : 0,
        actual: Number.NaN,
        index: optimalIntensityIndex,
      },
    };
  }
}

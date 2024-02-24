import { Injectable } from '@angular/core';
import { CarbonIntensityApiService } from './carbon-intensity-api.service';
import { IntensityDataDto } from './intensity-data-dto';
import { Observable, map } from 'rxjs';
import { IntensityPeriodDto } from './intensity-period-dto';
import { IntensityIndex } from './intensity-index';
import { Region } from './region';
import { RegionalIntensityDataDto } from './regional-intensity-data-dto';
import { IntensityData } from './intensity-data';
import { IntensityPeriod } from './intensity-period';
import { Constants } from './constants';

@Injectable({
  providedIn: 'root'
})
export class CarbonMinimizeService {
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
      map((data: IntensityDataDto) => this.mapIntensityDataType(data)),
      map((data: IntensityData) => this.getDateRange(data, duration, deadline)),
    );
  }

  getRegionalPeriod(duration: number, deadline: Date, region: Region): Observable<IntensityPeriod> {
    return this.carbonIntensityApiService.getRegionalForecast(region).pipe(
      map((data: RegionalIntensityDataDto) => this.mapToIntensityData(data)),
      map((data: IntensityDataDto) => this.mapIntensityDataType(data)),
      map((data: IntensityData) => this.getDateRange(data, duration, deadline)),
    );
  }

  setStart(hours: number, minutes: number): void {
    this.start.setHours(hours, minutes, 0, 0);
  }

  setEnd(hours: number, minutes: number): void {
    this.end.setHours(hours, minutes, 0, 0);
  }

  private mapToIntensityData(regionalData: RegionalIntensityDataDto): IntensityDataDto {
    const intensityData: IntensityDataDto = {
      data: regionalData.data.data,
    };

    return intensityData;
  }

  private mapIntensityDataType(intensityDataDto: IntensityDataDto): IntensityData {
    return {
      data: intensityDataDto.data.map((datum: IntensityPeriodDto): IntensityPeriod => {
        return {
          from: new Date(datum.from),
          to: new Date(datum.to),
          intensity: datum.intensity,
        };
      }),
    };
  }

  private getDateRange(data: IntensityData, duration: number, deadline: Date): IntensityPeriod {
    // Filter periods starting after now and ending before deadline
    let periods = data?.data?.filter((datum: IntensityPeriod): boolean =>
      datum.to < deadline && datum.from > new Date()) ?? [];

    if (this.start.getHours() !== this.end.getHours() || this.start.getMinutes() !== this.end.getMinutes()) {
      periods = periods.filter((datum: IntensityPeriod): boolean => {
        if (datum.from > datum.to || this.start > this.end) {
          return false;
        }

        const from = new Date(this.start);
        from.setHours(datum.from.getHours(), datum.from.getMinutes(), 0, 0);

        const to = new Date(this.end);
        to.setHours(datum.to.getHours(), datum.to.getMinutes(), 0, 0);

        return from <= to && from >= this.start && to <= this.end;
      });
    }

    console.log(periods);

    // Find the optimal period with the minimum average intensity
    let minimumAverageIntensity: number = Number.MAX_VALUE;
    let optimalStart: Date = new Date();
    let optimalIntensityIndex: IntensityIndex = periods[0]?.intensity.index ?? IntensityIndex.Moderate;
    for (let periodStartIndex = 0; periodStartIndex <= periods.length - duration; periodStartIndex++) {
        const periodEndIndex = periodStartIndex + duration;
        if (periods[periodEndIndex - 1].to > new Date(periods[periodStartIndex].from.getTime() + duration * Constants.PeriodDurationInMs))
        {
          continue;
        }

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
      from: optimalStart,
      to: new Date(new Date(optimalStart).getTime() + duration * Constants.PeriodDurationInMs),
      intensity: {
        forecast: minimumAverageIntensity < Number.MAX_VALUE ? minimumAverageIntensity : 0,
        actual: Number.NaN,
        index: optimalIntensityIndex,
      },
    };
  }
}

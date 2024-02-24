import { Component } from '@angular/core';
import { CarbonMinimizeService } from './carbon-minimize.service';
import { IntensityIndex } from './intensity-index';
import { Region } from './region';
import { IntensityPeriod } from './intensity-period';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  datetimeFormat: string = 'EEE dd/MM HH:mm';

  selectedDuration: number = 2;
  selectedDeadline: Date = new Date();

  regionOptions: string[];
  regionMap: Map<string, Region>;
  selectedRegionString: string;
  selectedRegion: Region;

  selectedTimeStartString: string;

  selectedTimeEndString: string;

  optimalIntensityPeriod: IntensityPeriod = {
    from: new Date(),
    to: new Date(),
    intensity: {
      forecast: 0,
      actual: 0,
      index: IntensityIndex.VeryLow
    }
  };

  constructor(private carbonMinimizeService: CarbonMinimizeService) {
    this.regionOptions = [
      'National',
      'North Scotland',
      'South Scotland',
      'North West England',
      'North East England',
      'Yorkshire',
      'North Wales',
      'South Wales',
      'West Midlands',
      'East Midlands',
      'East England',
      'South West England',
      'South England',
      'London',
      'South East England',
      'England',
      'Scotland',
      'Wales',
    ];
    this.regionMap = new Map<string, Region>([
      ['National', Region.National],
      ['North Scotland', Region.NorthScotland],
      ['South Scotland', Region.SouthScotland],
      ['North West England', Region.NorthWestEngland],
      ['North East England', Region.NorthEastEngland],
      ['Yorkshire', Region.Yorkshire],
      ['North Wales', Region.NorthWales],
      ['South Wales', Region.SouthWales],
      ['West Midlands', Region.WestMidlands],
      ['East Midlands', Region.EastMidlands],
      ['East England', Region.EastEngland],
      ['South West England', Region.SouthWestEngland],
      ['South England', Region.SouthEngland],
      ['London', Region.London],
      ['South East England', Region.SouthEastEngland],
      ['England', Region.England],
      ['Scotland', Region.Scotland],
      ['Wales', Region.Wales],
    ]);
    this.selectedRegionString = this.regionOptions[0];
    this.selectedRegion = this.regionMap.get(this.selectedRegionString) ?? Region.National;

    this.selectedTimeStartString = '';

    this.selectedTimeEndString = '';
  }

  onSelectedDurationChange(duration: number): void {
    this.selectedDuration = duration;
    this.getPeriod();
  }

  onSelectedDeadlineChange(deadline: Date): void {
    this.selectedDeadline = deadline;
    this.getPeriod();
  }

  onSelectedRegionChange(): void {
    this.selectedRegion = this.regionMap.get(this.selectedRegionString) ?? Region.National;
    this.getPeriod();
  }

  onSelectedTimeStartChange(): void {
    const hoursAndMinutes = this.selectedTimeStartString.split(':').map((digits) => parseInt(digits));
    this.carbonMinimizeService.setStart(hoursAndMinutes[0], hoursAndMinutes[1]);
    this.getPeriod();
  }

  onSelectedTimeEndChange(): void {
    const hoursAndMinutes = this.selectedTimeEndString.split(':').map((digits) => parseInt(digits));
    this.carbonMinimizeService.setEnd(hoursAndMinutes[0], hoursAndMinutes[1]);
    this.getPeriod();
  }

  onClearTimeClick(): void {
    this.selectedTimeStartString = '';
    this.selectedTimeEndString = '';

    this.carbonMinimizeService.setStart(0,0);
    this.carbonMinimizeService.setEnd(0,0);
    this.getPeriod();
  }

  private getPeriod(): void {
    if (this.selectedRegion === Region.National) {
      this.carbonMinimizeService.getPeriod(this.selectedDuration, this.selectedDeadline).subscribe((intensityPeriod: IntensityPeriod) => {
        this.optimalIntensityPeriod = intensityPeriod;
      });
    } else {
      this.carbonMinimizeService.getRegionalPeriod(this.selectedDuration, this.selectedDeadline, this.selectedRegion).subscribe((intensityPeriod: IntensityPeriod) => {
        this.optimalIntensityPeriod = intensityPeriod;
      });
    }
  }
}

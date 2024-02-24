import { Component } from '@angular/core';
import { AbstractControl, FormControl, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { CarbonMinimizeService } from './carbon-minimize.service';
import { IntensityIndex } from './intensity-index';
import { Region } from './region';
import { IntensityPeriod } from './intensity-period';
import { Constants } from './constants';

function futureDateValidator(selectedDuration: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    return (new Date(control.value) < new Date(new Date().getTime() + selectedDuration * Constants.PeriodDurationInMs))
      ? { futureDate: { value: control.value }}
      : null;
  }
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  private maxPeriods = 24;

  datetimeFormat: string = 'dd/MM HH:mm';

  durationOptions: string[];
  durationMap: Map<string, number>;
  selectedDurationString: string;
  selectedDuration: number;

  selectedDeadlineString: string;
  selectedDeadline: Date;
  deadlineControl: FormControl;

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
    this.durationOptions = ['30 mins', '1 hour'];
    this.durationMap = new Map<string, number>([['30 mins', 1], ['1 hour', 2]]);
    for (let n = 3; n <= this.maxPeriods; n++) {
      const durationString = `${n/2} hours`;
      this.durationOptions.push(durationString);
      this.durationMap = this.durationMap.set(durationString, n);
    }
    this.selectedDurationString = this.durationOptions[0];
    this.selectedDuration = this.durationMap.get(this.selectedDurationString) ?? 2;

    this.selectedDeadline = new Date();
    this.selectedDeadlineString = this.selectedDeadline.toISOString();
    this.deadlineControl = new FormControl(this.selectedDeadlineString, {
      validators: [Validators.required, futureDateValidator(this.selectedDuration)],
    });

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

  onSelectedDurationChange(): void {
    this.selectedDuration = this.durationMap.get(this.selectedDurationString) ?? 2;
    this.deadlineControl = new FormControl(this.selectedDeadlineString, {
      validators: [Validators.required, futureDateValidator(this.selectedDuration)],
    });
    this.getPeriod();
  }

  onSelectedDeadlineChange(): void {
    this.selectedDeadline = new Date(Date.parse(this.selectedDeadlineString));
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
    if (!this.deadlineControl.valid) {
      return;
    }

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

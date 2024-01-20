import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { CarbonMinimizeService } from './carbon-minimize.service';
import { IntensityPeriod } from './intensity-period';
import { IntensityIndex } from './intensity-index';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'clean-electric';
  
  durationControl = new FormControl('', { validators: Validators.required });
  durationOptions: string[] = [
    '1 hour', '2 hours', '3 hours'
  ];
  durationMap = new Map<string, number>([
    ['1 hour', 2],
    ['2 hours', 4],
    ['3 hours', 6],
  ]);
  selectedDurationString: string;
  selectedDuration: number;

  endTimeControl = new FormControl('', { validators: Validators.required });
  selectedDeadlineString: string;
  selectedDeadline: Date;

  optimalIntensityPeriod: IntensityPeriod = {
    from: '',
    to: '',
    intensity: {
      forecast: 0,
      actual: 0,
      index: IntensityIndex.VeryLow
    }
  };

  constructor(private carbonMinimizeService: CarbonMinimizeService) {
    this.selectedDurationString = this.durationOptions[0];
    this.selectedDuration = this.durationMap.get(this.selectedDurationString) ?? 60;

    this.selectedDeadline = new Date();
    this.selectedDeadlineString = this.selectedDeadline.toISOString();
  }

  onSelectedDurationChange(): void {
    this.selectedDuration = this.durationMap.get(this.selectedDurationString) ?? 60;
    this.getPeriod();
  }

  onSelectedDeadlineChange(): void {
    this.selectedDeadline = new Date(Date.parse(this.selectedDeadlineString));
    this.getPeriod();
  }

  private getPeriod(): void {
    this.carbonMinimizeService.getPeriod(this.selectedDuration, this.selectedDeadline).subscribe((intensityPeriod) => {
      this.optimalIntensityPeriod = intensityPeriod;
    });
  }
}

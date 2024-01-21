import { Component } from '@angular/core';
import { AbstractControl, FormControl, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { CarbonMinimizeService } from './carbon-minimize.service';
import { IntensityPeriod } from './intensity-period';
import { IntensityIndex } from './intensity-index';

function futureDateValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    return (new Date(control.value) < new Date()) ? { futureDate: { value: control.value }} : null;
  }
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  private maxPeriods = 24;

  durationOptions: string[];
  durationMap: Map<string, number>;
  selectedDurationString: string;
  selectedDuration: number;

  selectedDeadlineString: string;
  selectedDeadline: Date;
  deadlineControl: FormControl;

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
    this.durationOptions = ['30 mins', '1 hour'];
    this.durationMap = new Map<string, number>([['30 mins', 1], ['1 hour', 2]]);

    for (let n = 3; n <= this.maxPeriods; n++) {
      const durationString = `${n/2} hours`;
      this.durationOptions.push(durationString);
      this.durationMap = this.durationMap.set(durationString, n);
    }

    this.selectedDurationString = this.durationOptions[0];
    this.selectedDuration = this.durationMap.get(this.selectedDurationString) ?? 60;

    this.selectedDeadline = new Date();
    this.selectedDeadlineString = this.selectedDeadline.toISOString();
    this.deadlineControl = new FormControl(this.selectedDeadlineString, {
      validators: [Validators.required, futureDateValidator()],
    });
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
    if (!this.deadlineControl.valid) {
      return;
    }

    this.carbonMinimizeService.getPeriod(this.selectedDuration, this.selectedDeadline).subscribe((intensityPeriod) => {
      this.optimalIntensityPeriod = intensityPeriod;
    });
  }
}

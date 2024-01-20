import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { CarbonIntensityApiService } from './carbon-intensity-api.service';

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
    ['1 hour', 60],
    ['2 hours', 120],
    ['3 hours', 180],
  ]);
  selectedDurationString: string;
  selectedDuration: number;

  endTimeControl = new FormControl('', { validators: Validators.required });
  selectedEndTimeString: string;
  selectedEndTime: Date;

  constructor(private carbonIntensityApiService: CarbonIntensityApiService) {
    this.selectedDurationString = this.durationOptions[0];
    this.selectedDuration = this.durationMap.get(this.selectedDurationString) ?? 60;

    this.selectedEndTime = new Date();
    this.selectedEndTimeString = this.selectedEndTime.toISOString();
  }

  onSelectedDurationChange(): void {
    this.selectedDuration = this.durationMap.get(this.selectedDurationString) ?? 60;
  }

  onSelectedEndTimeChange(): void {
    this.selectedEndTime = new Date(Date.parse(this.selectedEndTimeString));
    this.getPeriod();
  }

  private getPeriod(): void {
    this.carbonIntensityApiService.getNationalForecast().subscribe((data) => {
      console.log(data);
    });
  }
}

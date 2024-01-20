import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'clean-electric';
  
  durationControl = new FormControl();
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

  endTimeControl = new FormControl();
  selectedEndTimeString: string;
  selectedEndTime: Date;

  constructor() {
    this.selectedDurationString = this.durationOptions[0];
    this.selectedDuration = this.durationMap.get(this.selectedDurationString) ?? 60;

    this.selectedEndTime = new Date();
    this.selectedEndTimeString = this.selectedEndTime.toISOString();
  }

  onSelectedDurationChange() {
    this.selectedDuration = this.durationMap.get(this.selectedDurationString) ?? 60;
  }

  onSelectedEndTimeChange() {
    this.selectedEndTime = new Date(Date.parse(this.selectedEndTimeString));
  }
}

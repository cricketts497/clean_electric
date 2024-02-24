import { Component, EventEmitter, Output } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { futureDateValidator } from '../validators';

@Component({
  selector: 'app-usage-duration-tab',
  templateUrl: './usage-duration-tab.component.html',
  styleUrls: ['./usage-duration-tab.component.scss']
})
export class UsageDurationTabComponent {
  private maxPeriods = 24;

  durationOptions: string[];
  durationMap: Map<string, number>;
  selectedDurationString: string;
  selectedDuration: number;
  @Output() selectedDurationEmitter = new EventEmitter<number>();

  selectedDeadlineString: string;
  selectedDeadline: Date;
  deadlineControl: FormControl;
  @Output() selectedDeadlineEmitter = new EventEmitter<Date>();

  constructor() {
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
  }

  onSelectedDurationChange(): void {
    this.selectedDuration = this.durationMap.get(this.selectedDurationString) ?? 2;
    this.deadlineControl = new FormControl(this.selectedDeadlineString, {
      validators: [Validators.required, futureDateValidator(this.selectedDuration)],
    });

    if (!this.deadlineControl.valid) {
      return;
    }

    this.selectedDurationEmitter.emit(this.selectedDuration);
  }

  onSelectedDeadlineChange(): void {
    if (!this.deadlineControl.valid) {
      return;
    }

    this.selectedDeadline = new Date(Date.parse(this.selectedDeadlineString));
    this.selectedDeadlineEmitter.emit(this.selectedDeadline);
  }
}

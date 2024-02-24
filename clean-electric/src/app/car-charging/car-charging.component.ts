import { Component, EventEmitter, Output } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { futureDateValidator } from '../validators';
import { Constants } from '../constants';

@Component({
  selector: 'app-car-charging',
  templateUrl: './car-charging.component.html',
  styleUrls: ['./car-charging.component.scss']
})
export class CarChargingComponent {
  capacity: number;
  capacityControl: FormControl;

  soc: number;
  socControl: FormControl;

  selectedDeadlineString: string;
  selectedDeadline: Date;
  deadlineControl: FormControl;

  @Output() selectedDurationEmitter = new EventEmitter<number>();
  @Output() selectedDeadlineEmitter = new EventEmitter<Date>();

  constructor() {
    this.capacity = 52;
    this.capacityControl = new FormControl(this.capacity, {
      validators: [Validators.min(1)],
    });

    this.soc = 0;
    this.socControl = new FormControl(this.soc, {
      validators: [Validators.min(0), Validators.max(100)],
    });

    this.selectedDeadline = new Date();
    this.selectedDeadlineString = this.selectedDeadline.toISOString();
    this.deadlineControl = new FormControl(this.selectedDeadlineString, {
      validators: [Validators.required, futureDateValidator(0)],
    });
  }

  onValueChange(): void {
    if (!this.capacityControl.valid || !this.socControl.valid || !this.deadlineControl.valid) {
      return;
    }

    this.setDuration();
  }

  onSelectedDeadlineChange(): void {
    if (!this.capacityControl.valid || !this.socControl.valid || !this.deadlineControl.valid) {
      return;
    }

    this.selectedDeadline = new Date(Date.parse(this.selectedDeadlineString));
    this.selectedDeadlineEmitter.emit(this.selectedDeadline);
  }

  private setDuration(): void {
    const energyRequiredInkWh = (100.0 - this.soc) * this.capacity / 100.0;
    const duration = Math.ceil((energyRequiredInkWh / Constants.ChargingPowerInkW) * 2);

    this.deadlineControl = new FormControl(this.selectedDeadlineString, {
      validators: [Validators.required, futureDateValidator(duration)],
    });

    this.selectedDurationEmitter.emit(duration);
  }
}

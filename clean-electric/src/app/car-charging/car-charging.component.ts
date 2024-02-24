import { Component, EventEmitter, Output } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

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
  }

  onCapacityChange(): void {
  }

  onSocChange(): void {
  }
}

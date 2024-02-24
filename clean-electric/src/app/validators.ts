import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";
import { Constants } from "./constants";

export function futureDateValidator(selectedDuration: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    return (new Date(control.value) < new Date(new Date().getTime() + selectedDuration * Constants.PeriodDurationInMs))
      ? { futureDate: { value: control.value }}
      : null;
  }
}
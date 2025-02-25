import { ElementRef } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';

export function confirmValidator(
  controlName: string,
  matchingControlName: string
) {
  return (formGroup: FormGroup) => {
    const control = formGroup.controls[controlName];
    const matchingControl = formGroup.controls[matchingControlName];
    if (
      matchingControl.errors &&
      !matchingControl.errors?.['confirmValidator']
    ) {
      return;
    }
    if (control.value !== matchingControl.value) {
      matchingControl.setErrors({ confirmValidator: true });
    } else {
      matchingControl.setErrors(null);
    }
  };
}

export function validateAllFormFields(formGroup: FormGroup, el?: ElementRef) {
  Object.keys(formGroup.controls).forEach((field) => {
    const control = formGroup.get(field);
    if (control instanceof FormControl) {
      control.markAsTouched({ onlySelf: true });
      control.markAsDirty({ onlySelf: true });
    } else if (control instanceof FormGroup) {
      validateAllFormFields(control, el);
    }
  });
  if (el) {
    for (const key of Object.keys(formGroup.controls)) {
      if (formGroup.controls[key].invalid) {
        const invalidControl = el.nativeElement.querySelector(
          '[formcontrolname="' + key + '"]'
        );
        invalidControl.focus();
        break;
      }
    }
  }
}

export const emailRegex = `^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$`;

export function noWhitespaceValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const isWhitespace = (control.value || '').trim().length === 0;
    return isWhitespace ? { whitespace: true } : null;
  };
}

// errorHandling = (groupName: FormGroup, control: string, error: string) => {
//   return groupName.controls[control].hasError(error);
// }

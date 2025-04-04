import { Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { AbstractControl, FormGroup, ValidationErrors } from '@angular/forms';

import { map } from 'rxjs';

export class FormSignals {
  static controlValue<T>(control: AbstractControl<T>): Signal<T> {
    return toSignal(control.valueChanges, { initialValue: control.value });
  }

  static controlErrors<T>(control: AbstractControl<T>): Signal<ValidationErrors | null> {
    return toSignal(control.statusChanges.pipe(map(() => control.errors)), { initialValue: control.errors });
  }

  static formValid(form: FormGroup): Signal<boolean> {
    return toSignal(form.statusChanges.pipe(map(() => form.valid)), { initialValue: form.valid });
  }
}

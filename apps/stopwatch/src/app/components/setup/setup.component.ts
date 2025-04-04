import { JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, effect, inject } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { MatButton } from '@angular/material/button';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatError, MatHint, MatInput } from '@angular/material/input';
import { MatActionList, MatListItem } from '@angular/material/list';

import { SetupService } from '../../services/setup.service';
import { TimerService } from '../../services/timer.service';
import { FormSignals } from '../../utils/form-signals';
import { Workout } from '../../utils/workout';

@Component({
  selector: 'sw-setup',
  imports: [
    RouterModule,
    MatFormField,
    MatLabel,
    MatInput,
    MatButton,
    ReactiveFormsModule,
    MatHint,
    MatError,
    JsonPipe,
    MatActionList,
    MatListItem,
  ],
  templateUrl: './setup.component.html',
  host: { class: 'layout-content' },
  styleUrl: './setup.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SetupComponent {
  readonly #timer = inject(TimerService);
  readonly #setup = inject(SetupService);

  readonly history = computed(() =>
    this.#setup.history().map((item) => ({ ...item, sets: Workout.formatSets(item.sets) }))
  );

  #setsValidator: ValidatorFn = (control: AbstractControl<string>) => {
    const sets = Workout.parseSets(control.value);

    if (sets.length > 0) {
      return null;
    }

    return { sets };
  };

  readonly form = new FormGroup({
    sets: new FormControl<string>(this.#setup.formattedSets(), {
      nonNullable: true,
      validators: [Validators.required, this.#setsValidator],
    }),
    rest: new FormControl<number>(this.#setup.rest(), { nonNullable: true, validators: [Validators.required] }),
  });

  readonly setsValue = FormSignals.controlValue(this.form.get('sets')!);
  readonly setsErrors = FormSignals.controlErrors(this.form.get('sets')!);

  readonly restValue = FormSignals.controlValue(this.form.get('rest')!);
  readonly restErrors = FormSignals.controlErrors(this.form.get('rest')!);

  readonly formattedSets = computed(() => Workout.reformatSets(this.setsValue()));

  readonly formValid = FormSignals.formValid(this.form);

  submit() {
    this.#setup.set(this.setsValue(), this.restValue());
    this.#timer.start();
  }
}

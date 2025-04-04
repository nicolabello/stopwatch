import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { MatButton } from '@angular/material/button';

import { SetupService } from '../../services/setup.service';
import { TimerService } from '../../services/timer.service';
import { formatSeconds } from '../../utils/format-seconds';
import { DonutComponent } from '../donut/donut.component';

@Component({
  selector: 'sw-timer',
  imports: [RouterModule, MatButton, ReactiveFormsModule, DonutComponent],
  templateUrl: './timer.component.html',
  host: { class: 'layout-content' },
  styleUrl: './timer.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimerComponent {
  readonly timer = inject(TimerService);

  readonly rest = inject(SetupService).rest;

  readonly formatSeconds = formatSeconds;

  executionTime(s: number) {
    return formatSeconds(Math.max(0, s - this.rest()));
  }
}

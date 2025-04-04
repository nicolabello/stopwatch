import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { SetupComponent } from './components/setup/setup.component';
import { TimerComponent } from './components/timer/timer.component';
import { TimerService } from './services/timer.service';

@Component({
  imports: [TimerComponent, SetupComponent],
  selector: 'sw-root',
  templateUrl: './app.component.html',
  host: { class: 'layout-container' },
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  timer = inject(TimerService);
}

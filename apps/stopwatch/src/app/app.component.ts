import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TimerService } from './timer.service';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatButton } from '@angular/material/button';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { DonutComponent } from './components/donut/donut.component';

@Component({
  imports: [
    RouterModule,
    MatFormField,
    MatLabel,
    MatInput,
    MatButton,
    ReactiveFormsModule,
    DonutComponent,
  ],
  selector: 'sw-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  timer = inject(TimerService);

  configuration = new FormGroup({
    sets: new FormControl<string>(''),
    pause: new FormControl<number>(30),
  });
}

import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { JsonPipe } from '@angular/common';
import { TimerService } from './timer.service';

@Component({
  imports: [RouterModule, JsonPipe],
  selector: 'sw-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  timer = inject(TimerService);
}

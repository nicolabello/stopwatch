import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

@Component({
  imports: [],
  selector: 'sw-donut',
  templateUrl: './donut.component.html',
  styleUrl: './donut.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DonutComponent {
  total = input.required<number>();
  elapsed = input.required<number, number>({
    transform: this.#elapsedTransform,
  });

  strokeDasharray = computed(() => {
    const max = 100;
    const elapsedPercent = Math.min(max, Math.round((this.elapsed() / this.total()) * max * 100) / 100);
    return `${elapsedPercent} ${max - elapsedPercent}`;
  });

  time = computed(() => {
    const hours = Math.floor(this.elapsed() / 3600);
    const minutes = Math.floor((this.elapsed() % 3600) / 60);
    const seconds = this.elapsed() % 60;

    const hoursStr = hours ? `${hours}:` : '';
    const minutesStr = `${minutes}`.padStart(2, '0');
    const secondsStr = `${seconds}`.padStart(2, '0');

    return `${hoursStr ? `${hoursStr}:` : ''}${minutesStr}:${secondsStr}`;
  });

  #elapsedTransform(value: number): number {
    return Math.min(60 * 59 + 59, Math.max(0, value));
  }
}

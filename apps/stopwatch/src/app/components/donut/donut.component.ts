import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import { formatSeconds } from '../../utils/format-seconds';

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
    return `${max - elapsedPercent} ${elapsedPercent}`;
  });

  elapsedTotal = computed(() => formatSeconds(this.elapsed()));

  elapsedDifference = computed(() => formatSeconds(this.elapsed() - this.total(), true));

  elapsedRemainder = computed(() => formatSeconds(Math.max(0, this.total() - this.elapsed())));

  timeUp = computed(() => this.total() - this.elapsed() < 0);

  #elapsedTransform(value: number): number {
    return Math.min(60 * 59 + 59, Math.max(0, value));
  }
}

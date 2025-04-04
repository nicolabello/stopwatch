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
    return `${max - elapsedPercent} ${elapsedPercent}`;
  });

  elapsedTotal = computed(() => this.formatSeconds(this.elapsed()));

  elapsedDifference = computed(() => this.formatSeconds(this.elapsed() - this.total(), true));

  elapsedRemainder = computed(() => this.formatSeconds(Math.max(0, this.total() - this.elapsed())));

  timeUp = computed(() => this.total() - this.elapsed() < 0);

  formatSeconds(s: number, addSign = false) {
    const sign = s > 0 ? '+' : s < 0 ? '-' : '';

    s = Math.abs(s);

    const hours = `${Math.floor(s / 3600)}`.padStart(2, '0');
    const minutes = `${Math.floor((s % 3600) / 60)}`.padStart(2, '0');
    const seconds = `${s % 60}`.padStart(2, '0');

    return `${addSign ? sign : ''}${hours !== '00' ? `${hours}:` : ''}${minutes}:${seconds}`;
  }

  #elapsedTransform(value: number): number {
    return Math.min(60 * 59 + 59, Math.max(0, value));
  }
}

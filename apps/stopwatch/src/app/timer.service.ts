import {
  computed,
  effect,
  Injectable,
  signal,
  WritableSignal,
} from '@angular/core';
import { StorageData } from './storage-data.model';

@Injectable({
  providedIn: 'root',
})
export class TimerService {
  #interval?: ReturnType<typeof setInterval>;

  #start = signal(0);
  #current = signal(0);

  elapsed = computed(() =>
    Math.floor((this.#current() - this.#start()) / 1000)
  );

  #sets: WritableSignal<number[]> = signal([]);

  constructor() {
    const storageKey = 'timer';

    const json = localStorage.getItem(storageKey);

    if (json) {
      try {
        const data: StorageData = JSON.parse(json);

        this.#start.set(data.start);
        this.#current.set(data.active ? Date.now() : data.current);
        this.#sets.set(data.sets);

        if (data.active) this.start();
      } catch (e) {}
    }

    effect(() => {
      const data: StorageData = {
        active: !!this.#interval,
        start: this.#start(),
        current: this.#current(),
        sets: this.#sets(),
      };

      localStorage.setItem(storageKey, JSON.stringify(data));
    });
  }

  start(): void {
    if (!this.#interval) {
      this.#start.update((value) =>
        value <= 0 ? Date.now() : value + Date.now() - this.#current()
      );
      this.#current.set(Date.now());
      this.#interval = setInterval(() => this.#current.set(Date.now()), 1000);
    }
  }

  pause(): void {
    clearInterval(this.#interval);
    this.#interval = undefined;
  }

  reset(clearSets = true): void {
    clearInterval(this.#interval);
    this.#interval = undefined;
    this.#start.set(0);
    this.#current.set(0);
    if (clearSets) this.#sets.set([]);
  }

  addSet(): void {
    if (this.#interval) {
      this.#sets.update((value) => [...value, this.elapsed()]);
      this.reset(false);
      this.start();
    }
  }

  get isActive() {
    return !!this.#interval;
  }

  get sets() {
    return this.#sets.asReadonly();
  }
}

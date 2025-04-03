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
  #isActive = signal(false);

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
        active: this.#isActive(),
        start: this.#start(),
        current: this.#current(),
        sets: this.#sets(),
      };

      localStorage.setItem(storageKey, JSON.stringify(data));
    });

    effect(() => {
      if (this.#isActive()) {
        if (!this.#interval) {
          this.#interval = setInterval(
            () => this.#current.set(Date.now()),
            1000
          );
        }
      } else {
        clearInterval(this.#interval);
        this.#interval = undefined;
      }
    });
  }

  start(): void {
    if (!this.#isActive()) {
      this.#start.update((value) =>
        value <= 0 ? Date.now() : value + Date.now() - this.#current()
      );
      this.#current.set(Date.now());
      this.#isActive.set(true);
    }
  }

  pause(): void {
    this.#isActive.set(false);
  }

  reset(clearSets = true): void {
    this.#isActive.set(false);
    this.#start.set(0);
    this.#current.set(0);
    if (clearSets) this.#sets.set([]);
  }

  addSet(): void {
    if (this.#isActive()) {
      this.#sets.update((value) => [...value, this.elapsed()]);
      this.reset(false);
      this.start();
    }
  }

  get isActive() {
    return this.#isActive.asReadonly();
  }

  get sets() {
    return this.#sets.asReadonly();
  }
}

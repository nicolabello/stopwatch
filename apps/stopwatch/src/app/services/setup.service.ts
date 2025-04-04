import { computed, effect, Injectable, signal } from '@angular/core';

import { Workout } from '../utils/workout';

type StorageData = {
  sets: (number | string)[];
  rest: number;
  history: { sets: (number | string)[]; rest: number }[];
};

@Injectable({
  providedIn: 'root',
})
export class SetupService {
  readonly #sets = signal<(number | string)[]>([]);
  readonly formattedSets = computed(() => Workout.formatSets(this.#sets()));

  readonly #rest = signal(90);
  readonly rest = this.#rest.asReadonly();

  readonly #history = signal<{ sets: (number | string)[]; rest: number }[]>([]);
  readonly history = this.#history.asReadonly();

  constructor() {
    this.#initStorage();
  }

  #initStorage() {
    const storageKey = 'setup';

    const json = localStorage.getItem(storageKey);

    if (json) {
      try {
        const data: StorageData = JSON.parse(json);

        this.#sets.set(data.sets);
        this.#rest.set(data.rest);
        this.#history.set(data.history);
      } catch (e) {}
    }

    effect(() => {
      const data: StorageData = {
        sets: this.#sets(),
        rest: this.#rest(),
        history: this.#history(),
      };

      localStorage.setItem(storageKey, JSON.stringify(data));
    });
  }

  set(sets: string, rest: number) {
    this.#sets.set(Workout.parseSets(sets));
    this.#rest.set(rest);
    this.#history.set([
      { sets: this.#sets(), rest: this.#rest() },
      ...this.#history().filter(
        (item) => item.rest !== rest && Workout.formatSets(item.sets) !== Workout.formatSets(this.#sets())
      ),
    ]);
  }
}

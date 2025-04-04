export class Workout {
  private static _regExpPattern: string;

  private static get regExpPattern(): string {
    if (!this._regExpPattern) {
      const start = /(?:^|\s+)/;

      const simple = /\d+/;
      const max = /max/;
      const duration = /\d+\s*[:.]\s*\d{2}/;
      const fromTo = /\d+\s*[\\\/-]\s*(?:\d+|max)/;

      const plus = /\s*[+]\s*/;
      const sets = /\s*[x*×]\s*(\d+)/;

      const reps = [`${fromTo.source}`, `${duration.source}`, `${simple.source}`, `${max.source}`];

      const repsStart = reps.map((pattern) => `${start.source}${pattern}`);

      const repsPattern = `(?:${reps.join('|')})`;
      const repsStartPattern = `(?:${repsStart.join('|')})`;

      const plusSetsPattern = `${repsStartPattern}(?:${plus.source}${repsPattern})+`;

      this._regExpPattern = `(${plusSetsPattern}|${repsStartPattern})(?:${sets.source})?`;

      // console.log(this._regExpPattern);
    }

    return this._regExpPattern;
  }

  private static _globalRegExp: RegExp;

  private static get globalRegExp(): RegExp {
    this._globalRegExp = this._globalRegExp || new RegExp(this.regExpPattern, 'gi');
    return this._globalRegExp;
  }

  private static _repsSetsRegExp: RegExp;

  private static get repsSetsRegExp(): RegExp {
    this._repsSetsRegExp = this._repsSetsRegExp || new RegExp(this.regExpPattern, 'i');
    return this._repsSetsRegExp;
  }

  public static parseSets(s: string): (string | number)[] {
    const globalMatches = s.match(this.globalRegExp);
    const repsList: (string | number)[] = [];

    if (globalMatches) {
      globalMatches.forEach((globalMatch) => {
        // Find matches
        const repsSetsMatches = globalMatch.match(this.repsSetsRegExp);

        if (!repsSetsMatches) {
          return;
        }

        // Reps
        const reps = repsSetsMatches[1].replace(/\s+/g, '').replace(/\./, ':').replace(/max/i, 'MAX');

        if (reps.match(/:/) && !this.isValidDuration(reps)) {
          return;
        }

        // reps = reps.replace(/\W/, '-');

        // Sets
        const sets = parseInt(repsSetsMatches[2], 10) || 1;

        // Add
        for (let i = 0; i < sets; i++) {
          repsList.push(reps);
        }
      });
    }

    return repsList;
  }

  public static formatSets(repsList: (string | number)[], pad?: number): string {
    const formatted = [];

    if (repsList && repsList.length) {
      if (pad && pad > repsList.length) {
        repsList = [...repsList, ...Array(pad - repsList.length).fill(repsList[repsList.length - 1])];
      }

      let reps = repsList[0];
      let sets = 1;

      // Cannot use forEach as it's starting from 1
      for (let i = 1; i < repsList.length; i++) {
        if (repsList[i] === reps) {
          sets++;
        } else {
          // Push
          formatted.push(this.formatRepsAndSets(reps, sets));

          // Reset
          reps = repsList[i];
          sets = 1;
        }
      }

      // Push last
      formatted.push(this.formatRepsAndSets(reps, sets));
    }

    return formatted.join(' ');
  }

  private static formatRepsAndSets(reps: string | number, sets: number) {
    return sets > 1 ? `${reps}×${sets}` : reps;
  }

  private static isValidDuration(duration: string): boolean {
    // const durationParsingFormats = ['ss', 'm:ss', 'H:mm:ss'];
    // return Moment(duration, durationParsingFormats).isValid();
    return true;
  }

  static reformatSets(s: string): string {
    return this.formatSets(this.parseSets(s));
  }
}

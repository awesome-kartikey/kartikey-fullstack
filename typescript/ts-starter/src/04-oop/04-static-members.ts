// 4) Static Members & Factory Functions¶
// Add static created = 0 and increment in the constructor.
// Add static fromJSON(json: string): Counter to construct from serialized data.

class Counter2 {
  static created = 0;
  private count: number;

  constructor(initial = 0) {
    this.count = initial;
    Counter2.created++;
  }

  inc() {
    return this.count++;
  }

  dec() {
    return this.count--;
  }

  value() {
    return this.count;
  }

  get isZero(): boolean {
    return this.count === 0;
  }

  set step(n: number) {
    if (n < 0) {
      throw new Error("Step must be positive");
    }
    this.count = n;
  }

  static fromJSON(json: string) {
    const { initial } = JSON.parse(json);
    return new Counter2(initial);
  }
}

const jcounter = Counter2.fromJSON(JSON.stringify({ initial: 10 }));
console.log(jcounter.value());
console.log(Counter2.created);

/******************************************************************************/
// Create an alternative factory function makeCounter(initial = 0) (no class) and compare ergonomics.

function makeCounter(initial = 0) {
  let count = initial;
  return {
    inc() {
      count++
      return this;
    },
    dec() {
      count--;
      return this;
    },
    value() {
      return count;
    },
  };
}

const mcCounter = makeCounter(10);
console.log(mcCounter.inc().value());
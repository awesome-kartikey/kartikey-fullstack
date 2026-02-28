// 3) Getters & Setters¶
// Add get isZero(): boolean on Counter.
// Add a set step(n: number) that rejects negatives (throw an Error).

class Counter1 {
  private count: number;

  constructor(initial = 0) {
    this.count = initial;
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

  inc() {
    this.count++;
    return this;
  }

  dec() {
    this.count--;
    return this;
  }

  value() {
    return this.count;
  }
}

const stepCounter = new Counter1();

stepCounter.step = 5000;

console.log(stepCounter.value());

stepCounter.step = -10;

console.log(stepCounter.value());

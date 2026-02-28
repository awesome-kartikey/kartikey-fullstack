// 1) Class Basics¶
// Implement class Counter with a private field and methods inc(), dec(), value().
// Add a constructor that accepts an initial value; make methods chainable by returning this.

class Counter {
  private count: number;

  constructor(initial = 0) {
    this.count = initial;
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

let counter = new Counter(5);
counter.inc().inc().inc().dec().value();

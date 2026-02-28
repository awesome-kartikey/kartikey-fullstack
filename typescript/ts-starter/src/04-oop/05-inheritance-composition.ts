// 5) Inheritance vs Composition¶
// Create BoundedCounter extends Counter that clamps to [0, max].
// Refactor to composition: class BoundedCounter { constructor(private inner: Counter, private max: number) {} } and delegate.
// Read Composition over Inheritance and summarize why real-world systems benefit:
// Composition avoids deep fragile hierarchies.
// Easier to test, reason about, and replace components.
// Encourages smaller, reusable building blocks.
// Reduces unintended coupling compared to inheritance.
// Lets you change behavior at runtime by swapping components.
// List pros/cons of both versions, but emphasize why composition is usually preferred in production code.
// Inheritance - IS A
// Composition - HAS A

//Parent Class
class ParentCounter {
  static created = 0;
  protected count: number;

  constructor(initial: number = 0) {
    this.count = initial;
    ParentCounter.created++;
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

  get isZero(): boolean {
    return this.count === 0;
  }

  set step(n: number) {
    if (n < 0) {
      throw new Error("Step must be positive");
    }
    this.count = n;
  }
}

//Inheritance Child Class
class InheritanceBoundedCounter extends ParentCounter {
  constructor(
    private max: number,
    initial = 0,
  ) {
    super(initial);
  }

  override inc() {
    if (this.value() < this.max) {
      super.inc();
    }
    return this;
  }

  override dec() {
    if (this.value() > 0) {
      super.dec();
    }
    return this;
  }
}

//Composition Class
class CompositionBoundedCounter {
  private cinitial: ParentCounter;
  private max: number;
  constructor(max: number, initial: number = 0) {
    this.cinitial = new ParentCounter(initial);
    this.max = max;
  }

  inc() {
    if (this.cinitial.value() < this.max) {
      this.cinitial.inc();
    }
    return this;
  }

  dec() {
    if (this.cinitial.value() > 0) {
      this.cinitial.dec();
    }
    return this;
  }
  value() {
    return this.cinitial.value();
  }
}

const ibc = new InheritanceBoundedCounter(3);
ibc.inc().inc().inc().inc().inc();
console.log(ibc.value());

const cbc = new CompositionBoundedCounter(3);
cbc.inc().inc().inc().inc().inc();
console.log(cbc.value());
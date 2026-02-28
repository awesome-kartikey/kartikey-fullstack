// 7) Generic Classes & Invariants¶
// Make Store<T> generic; ensure get returns T | undefined.
// Add an open/close lifecycle; guard public methods via a private requireOpen() that throws if closed.

interface IStore<T> {
  get(key: string): T | undefined;
  set(key: string, value: T): void;
  has(key: string): boolean;
}

class GuardedStore<T> implements IStore<T> {
  private map = new Map<string, T>();
  private _open = true;

  private requireOpen(): void {
    if (!this._open) throw new Error("Store is closed");
  }

  get(key: string): T | undefined {
    this.requireOpen();
    return this.map.get(key);
  }

  set(key: string, value: T): void {
    this.requireOpen();
    this.map.set(key, value);
  }

  has(key: string): boolean {
    this.requireOpen();
    return this.map.has(key);
  }

  open() {
    this._open = true;
  }
  close() {
    this._open = false;
  }
}

const store = new GuardedStore<number>();
store.open();
store.set("x", 42);
store.get("x");
console.log(store.get("x"));
store.close();

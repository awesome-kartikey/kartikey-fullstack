// 6) Abstract Contracts¶
// Define abstract class Store<T> with get, set, has.
// Implement MemoryStore<T> using a Map.
// Re-express the contract as an interface Store<T> and compare ergonomics.

// Abstract class version
abstract class AbstractStore<T> {
  abstract get(key: string): T | undefined;
  abstract set(key: string, value: T): void;
  abstract has(key: string): boolean;

  someExtraMethod() {
    return this.get("key");
  }
}

class MemoryStore<T> extends AbstractStore<T> {
  private map = new Map<string, T>();

  get(key: string) {
    return this.map.get(key);
  }
  set(key: string, value: T) {
    this.map.set(key, value);
  }
  has(key: string) {
    return this.map.has(key);
  }
  override someExtraMethod(): T | undefined {
    return this.get("key");
  }
}

// Interface version
interface IStore<T> {
  get(key: string): T | undefined;
  set(key: string, value: T): void;
  has(key: string): boolean;
}

class MemoryStoreImpl<T> implements IStore<T> {
  private map = new Map<string, T>();

  get(key: string) {
    return this.map.get(key);
  }
  set(key: string, value: T) {
    this.map.set(key, value);
  }
  has(key: string) {
    return this.map.has(key);
  }
}

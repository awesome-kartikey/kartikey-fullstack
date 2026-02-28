// Define function lengthOf<T extends { length: number }>(x: T): number.
// Call with string, array, and object with length.
// Try number—see the error.
// Extend with multiple constraints (T extends HasId & HasName).

import { log } from "node:console";

function lengthOf<T extends { length: number }>(x: T): number {
  console.log(x);
  return x.length;
}

console.log(lengthOf("hello"));
console.log(lengthOf([1, 2, 3]));
console.log(lengthOf({ length: 10 }));
console.log(lengthOf({ length: 10, name: "John" }));
// console.log(lengthOf(42));

interface HasId {
  id: number;
}

interface HasName {
  name: string;
}

function lengthOf2<T extends HasId & HasName>(x: T) {
  console.log(x.id);
  console.log(x.name);
  console.log(x);
  return x.id + x.name.length;
}
lengthOf2({ id: 1, name: "John" });

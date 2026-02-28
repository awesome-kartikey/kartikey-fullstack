// Write function first<T>(arr: T[]): T | undefined.
// Call with number[] and string[].
// Try first([1, "two"])—see union type inference.

function first<T>(arr: T[]): T | undefined {
  return arr[1];
}

console.log(first([])); // undefined
console.log(first([1, 2, 4])); // type number
first(["a", "b", "c"]);

console.log(first([1, "two"]));

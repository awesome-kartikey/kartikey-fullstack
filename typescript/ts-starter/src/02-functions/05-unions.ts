// 5) Unions in Functions¶
// Write a function format(input: string | number).
// Use typeof to return input.toUpperCase() if string.
// Return input.toFixed(2) if number.
// Extend it to handle boolean.
// Observe how unions encourage explicit handling.

function format(input: string | number | boolean): string | number | boolean {
  if (typeof input === "string") {
    return input.toUpperCase();
  }
  if (typeof input === "number") {
    return input.toFixed(2);
  }
  return input;
}

console.log(format("hello"));
console.log(format(42));
console.log(format(true));

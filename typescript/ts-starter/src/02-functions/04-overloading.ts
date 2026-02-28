// 4) Function Overloading
// Declare a function toArray(x: string): string[].Hmmmmmmmm
// Add an overload toArray(x: number): number[].Hmmmmmmmm
// Implement a single function body handling both.
// Call with "hello" and 42.
// Try calling with true—see the error.

function toArray(x: string): string[];
function toArray(x: number): number[];

function toArray(x: string | number): string[] | number[] {
  if (typeof x === "string") {
    return x.split("");
  }
  return [x];
}

console.log(toArray("hello"));
console.log(toArray(42));
// toArray(true);

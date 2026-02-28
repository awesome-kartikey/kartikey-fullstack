// Write a function that takes string | number.
// Use typeof to handle each case separately.
// Add null to the union and handle it.

function multi_input_fn(input: string | number | null): string {
  if (typeof input === "string") {
    return input.toUpperCase();
  }
  if (typeof input === "number") {
    return input.toFixed(2);
  }
  return "Hello, Guest!";
}

console.log(multi_input_fn("hello")); // HELLO
console.log(multi_input_fn(42.567)); // 42.57
console.log(multi_input_fn(null)); // HELLO, GUEST!

/*---------------------------------------*/
// Use instanceof to check if an input is a Date.

function processDate(input: Date | string): string {
  if (input instanceof Date) {
    return input.toISOString();
  }
  return `I am a String: ${input}`;
}

console.log(processDate(new Date()));
console.log(processDate("2025-12-25"));

/*---------------------------------------*/
// Try narrowing arrays using Array.isArray.

function printValues(input: string | string[]): void {
  if (Array.isArray(input)) {
    console.log(`Array length: ${input.length}`);
  } else {
    console.log(`I am String: ${input}`);
  }
}

printValues("Stringggggg");
printValues(["First", "Second", "Third"]);

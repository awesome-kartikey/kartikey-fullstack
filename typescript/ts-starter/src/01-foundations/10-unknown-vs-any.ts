// Unknown vs Any Practice
// Create variables with any and unknown types.
// Try to perform operations on each without type checks.
// Add proper type guards to safely use the unknown variable.
// Compare the type safety difference.

let anyValue: any = "hello";

console.log("Initial:", anyValue);
anyValue = 123;
anyValue = true;

// console.log(anyValue.toUpperCase());
// console.log(anyValue.length);

/******************************************************************************/

let unknownValue: unknown = "hello";

console.log("Initial:", unknownValue);
unknownValue = 123;
unknownValue = true;
// console.log(unknownValue.toUpperCase());
// console.log(unknownValue.length);
// console.log(unknownValue + 1);

/******************************************************************************/

function processUnknownValue(value: unknown): string {
  if (typeof value === "string") {
    return `String: ${value.toUpperCase()}`;
  }
  if (typeof value === "number") {
    return `Number: ${value.toFixed(2)}`;
  }
  if (typeof value === "boolean") {
    return `Boolean: ${value}`;
  }
  return "Unknown type";
}

console.log(processUnknownValue("hello"));
console.log(processUnknownValue(42.567));
console.log(processUnknownValue(true));
console.log(processUnknownValue(null));

/******************************************************************************/

function processAny(value: any): void {
  console.log("Processing any:");
  console.log(value.toUpperCase());
  console.log(value.length);
  console.log(value + 10);
}

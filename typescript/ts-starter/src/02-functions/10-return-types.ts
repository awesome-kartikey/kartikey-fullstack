// 10) Return Type Practice¶
// Write functions where TypeScript inference might be unclear:
// ```
// function processData(data: unknown) {
//   // Add explicit return type annotation
//   // Handle different data types
// }
// ```
// Practice with void return types.
// Practice with never return types for functions that throw errors.

function processData(data: unknown): string | number | boolean | null {
  if (typeof data === "string") {
    return data.toUpperCase();
  }

  if (typeof data === "number") {
    return data * 2;
  }

  if (typeof data === "boolean") {
    return !data;
  }

  return null;
}

console.log("processData('hello'):", processData("hello"));
console.log("processData(10):", processData(10));
console.log("processData(true):", processData(true));
console.log("processData({}):", processData(null));

/******************************************************************************/

function logMessage(message: string): void {
  console.log(`LOG --------------------------- ${message}`);
}
logMessage("Application started");

/******************************************************************************/

function thatThrowErrors(message: string): never {
  throw new Error(message);
}

try {
  thatThrowErrors("Something went wrong");
} catch (error) {
  console.log("Error:", error);
}

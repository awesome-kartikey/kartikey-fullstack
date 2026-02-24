// Write a function that accepts string | number and returns different outputs:
// ```
// function processId(id: string | number): string {
//   // Use typeof to narrow the type
//   // Return formatted string based on type
// }
// ```
// Test with both string and number inputs.
// Add a third type (boolean) and handle it.

function processId(id: string | number | boolean): string {
  if (typeof id === "string") {
    return `ID-${id.toUpperCase()}`;
  } else if (typeof id === "number") {
    return `ID-${id.toString().padStart(6, "0")}`;
  }
  return id ? "ID-ACTIVE" : "ID-INACTIVE";
}

console.log(processId("abc123"));
console.log(processId(42));
console.log(processId(true));
console.log(processId(false));

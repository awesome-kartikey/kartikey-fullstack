// Create arrays with explicit type annotations:
// ```
// const numbers: number[] = [1, 2, 3];
// const names: Array<string> = ["Alice", "Bob"];
// ```
// Create a mixed array using union types.
// Write a function that safely accesses array elements and handles undefined.

const numbers: number[] = [1, 2, 3, 4, 5];
const names: Array<string> = ["Alice", "Bob", "Charlie"];

// Array that can hold strings OR numbers
const mixed: (string | number)[] = [1, "two", 3, "four", 5];

/******************************************************************************/
// Write a function that safely accesses array elements and handles undefined.

function getFirstElement(arr: number[]): number | undefined {
  if (arr.length > 0) {
    return arr[0];
  }
  return undefined;
}

console.log(getFirstElement([10, 20])); // 10
console.log(getFirstElement([]));

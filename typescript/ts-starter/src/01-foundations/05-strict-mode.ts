// Set "strict": true in tsconfig.json.
// Declare a variable without initializing: let age: number;. Try to use it.

let age_value: number;
// console.log(age_value + 10);
age_value = 25;
console.log(age_value + 10);

/*---------------------------------------*/
// Write a function without a return type. See what TypeScript infers.
// Add an explicit return type and compare.
// Disable strict mode, repeat, and compare results.

// function greet(name) {
//   return `Hello, ${name}`;
// }

function greet_func(name: string): string {
  return `Hello, ${name}`;
}

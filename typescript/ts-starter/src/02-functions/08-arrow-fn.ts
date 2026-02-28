// 8) Arrow Functions¶
// Convert a regular function to an arrow function.
// Write const square = (n: number): number => n * n.
// Use arrow functions inside map, filter, reduce.
// Compare inferred vs explicit types in arrow functions

function addNumbers(a: number, b: number): number {
  return a + b;
}

const arrowFnadd = (a: number, b: number): number => a + b;

/******************************************************************************/

const square = (n: number): number => n * n;

console.log(square(5));

/******************************************************************************/

const numbers_array = [1, 2, 3, 4, 5];

const doubled = numbers_array.map((n) => n * 2);
console.log(doubled);

const evens = numbers_array.filter((n) => n % 2 === 0);
console.log(evens);

const sum = numbers_array.reduce((acc, n) => acc + n, 0);
console.log(sum);

/******************************************************************************/
// Inferred vs explicit types in arrow functions

const squared = (n: number) => n * n;
const squared2 = (n: number): number => n * n;

// 9) Function Type Annotations¶
// Create function types using type aliases:
// ```
// type Calculator = (a: number, b: number) => number;
// type Validator = (input: string) => boolean;
// ```
// Create functions that match these types.
// Create a function that accepts another function as a parameter.

type Calculator = (a: number, b: number) => number;
type Validator = (input: string) => boolean;

function calculator(a: number, b: number): number {
  return a + b;
}

function validator(input: string): boolean {
  return input.length > 0;
}

console.log(calculator(5,2));
console.log(validator("cat"))
/******************************************************************************/
// Create a function that accepts another function as a parameter.

function applyOperation(a: number, b: number, operation: Calculator): number {
  return operation(a, b);
}

const calc_add: Calculator = (a, b) => a + b;
console.log("Applied add:", applyOperation(10, 5, calc_add));

const calc_multiply: Calculator = (a, b) => a * b;
console.log("Applied multiply:", applyOperation(10, 5, calc_multiply));

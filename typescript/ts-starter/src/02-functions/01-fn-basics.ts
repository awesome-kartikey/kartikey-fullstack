// 1) Function Basics¶
// Write a function add that takes two number parameters and returns their sum.
// Add a return type annotation explicitly.
// Remove the annotation—see if TypeScript infers it.

function addBasicNumbers(a: number, b: number): number {
  return a + b;
}
console.log(addBasicNumbers(1, 2));
/******************************************************************************/
// Create a function that doesn’t return anything—use void.
// Try returning a value from a void function—observe the error.

function sayHello(): void {
  console.log("Hello!");
  // return "Hello!";
}

sayHello();

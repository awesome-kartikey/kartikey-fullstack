// 1. Create let value: unknown = "hello".

let value: unknown = "hello world";
// console.log(value.toUpperCase());

/*---------------------------------------*/
// 2. Use value as string to get its length.

// Option 1: Type assertion with 'as'
let length = (value as string).length;
console.log(length);

// Option 2: Angle bracket syntax
let length2 = <string>value;
console.log(length2.length);

/*---------------------------------------*/
// 3. Force value as number and see what happens at runtime.

let someValue: unknown = "hello";
let numberValue = someValue as number;
console.log("numberValue:", numberValue);
console.log("Type of numberValue:", typeof numberValue); //Why it is string not number?

// The problem: TypeScript trusts you
// Type assertions bypass safety checks

/*---------------------------------------*/
// 4. Write a function that takes unknown and uses type assertion inside.

function processInput(input: unknown) {
  // Bad: Blind assertion
  // const str = input as string;
  // return str.toUpperCase();  // Might crash!

  // Good: Check first, then assert
  if (typeof input === "string") {
    const str = input as string;
    return str.toUpperCase();
  }
  throw new Error("Input must be a string");
}

console.log(processInput("hello"));
// console.log(processInput(42));

/*---------------------------------------*/
// 5. Discuss: why are type assertions potentially unsafe?

// Common use case: DOM manipulation
// TypeScript doesn't know specific element types from querySelector

// Without assertion
// const input = document.querySelector("#username");  // Type: Element | null
// input.value = "Alice";  // ❌ Error: Property 'value' does not exist on type 'Element'

// With assertion
// const input = document.querySelector("#username") as HTMLInputElement;
// if (input) {
//   input.value = "Alice"; // ✅ Works
// }

// 1. Declare let x = 42 without a type and check what TypeScript infers.

let x = 42; //Inferred type: number
console.log(typeof x);

/*---------------------------------------*/
// 2. Try assigning a string to x. What happens?

// x = "hello";
x = 100;
console.log(x);

/*---------------------------------------*/
// 3. Declare let y; without a type. Assign y = "hello", then y = 42.

let y;
y = "hello";
console.log(y);
y = 42;
console.log(y);

/*---------------------------------------*/
// 4. Compare the above with let z: number = 42.

let z: number = 42;
// z = "hello";
console.log(z);

/*---------------------------------------*/
// 5. Observe differences in type safety.

// Explicit type annotation
let explicitAge: number = 30;

// Inferred type
let inferredAge = 30;

console.log(typeof explicitAge, typeof inferredAge);

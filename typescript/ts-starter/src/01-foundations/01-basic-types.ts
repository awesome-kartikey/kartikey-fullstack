// 1.Declare variables with string, number, boolean.

let userName: string = "John Doe";
let age: number = 25;
let isActive: boolean = true;

//userName = 123;

/*---------------------------------------*/
// 2. Declare a variable with type any and assign it multiple kinds of values.

let any_value: any;
any_value = 42;
any_value = true;
any_value = "text";

/*---------------------------------------*/
//3. Switch to unknown instead of any and handle it safely.

let userInput: unknown;

userInput = "Santa hohohohoho";
if (typeof userInput === "string") {
  console.log(userInput.toUpperCase());
}

userInput = 42;

if (typeof userInput === "number") {
  console.log(userInput.toFixed(2));
}

/*---------------------------------------*/
// 4. Try assigning null or undefined to a string variable and observe the error.

// (tsconfig "strict": false)

let the_text: string;
// the_text = null;
// the_text = undefined;

// 5. Enable strictNullChecks and retry.

let nullableText: string | null;
nullableText = null;
nullableText = "I have a value";
console.log("nullableText:", nullableText);

//undefined
let optionalValue: number | undefined;
console.log("optionalValue: ", optionalValue);
optionalValue = 100;
console.log("optionalValue", optionalValue);

/*---------------------------------------*/
// 6. Declare a const variable and check how its type is inferred.
const pi = 3.14159;
// pi = 3.14;

let radius = 5;
radius = 10;

const user4 = {
  name: "Alice",
  age: 25,
};

user4.age = 26;
// user4 = {name: "Bob", age: 26};

console.log(user4);

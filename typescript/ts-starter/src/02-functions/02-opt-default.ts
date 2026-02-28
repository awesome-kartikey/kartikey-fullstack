// 2) Optional & Default Parameters¶
// Write a function greet(name: string, age?: number).
// Call it with and without the age argument.
// Provide a default parameter value for age = 18.
// Observe how the function behaves with omitted arguments.

function greeting(name: string, age?: number) {
  if (age) {
    // age is number or undefined
    console.log(`Hello, ${name}. You are ${age} years old.`);
  } else {
    console.log(`Hi ${name}`);
  }
}

function greetWithDefault(name: string, age: number = 18) {
  console.log(`Hello, ${name}. You are ${age} years old.`);
}

greeting("Kartikey");
greeting("Kartikey", 25);
greetWithDefault("Kartikey");
greetWithDefault("Kartikey", 25);

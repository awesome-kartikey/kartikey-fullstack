// Create a file hello.ts that prints "Hello, TypeScript".
// Compile with tsc and run with node.
// Run directly with tsx.
// Add a name: string parameter.
// Add an optional age?: number parameter.
// Try calling the function with wrong types.

function sayHelloToUser() {
  console.log("Hello, TypeScript!");
}
sayHelloToUser();

/*---------------------------------------*/

function greetUser(name: string, age?: number): void {
  if (age !== undefined) {
    console.log(`Hello, ${name}! You are ${age} years old.`);
  } else {
    console.log(`Hello, ${name}!`);
  }
}

greetUser("Alice", 25);
greetUser("Bob");
// greetUser(42);
// greetUser("Alice", "twenty-five");

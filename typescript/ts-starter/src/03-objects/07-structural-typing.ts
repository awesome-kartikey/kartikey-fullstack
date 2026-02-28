// 7) Structural Typing¶
// Create a function that accepts Person.
// Pass in an object literal with name, age, and extra properties.
// Observe how TypeScript allows compatible shapes.

interface Person6 {
  name: string;
  age: number;
}

function greet(person: Person6) {
  console.log(`Hello, ${person.name}. You are ${person.age} years old.`);
}

greet({
  name: "John",
  age: 30,
  // hobby: "coding",
});

let someone: Person6 = {
  name: "Henry",
  age: 45,
  // city: "Boston",
};

greet(someone);

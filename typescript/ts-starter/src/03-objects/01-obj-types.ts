// 1) Object Types¶
// Create an object type Person with name: string and age: number.
// Declare a variable of type Person and assign values.
// Try assigning a wrong type—observe the error.
// Add a readonly id: string field.
// Attempt to reassign id—see the compiler error.

type Person = {
  name: string;
  age: number;
};

const person: Person = {
  name: "John Doe",
  age: 30,
  // age: "thirty",
  // id: "123",
};

/********************************************************************************************/

type Person2 = {
  readonly id: string;
  name: string;
  age: number;
};

let employee: Person2 = {
  id: "123",
  name: "John Doe",
  age: 30,
};

// employee.id = "456";
employee.age = 31;

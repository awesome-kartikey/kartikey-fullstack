// Create objects with type annotations:
// ```
// const user: { name: string; age: number; active: boolean } = {
//   name: "John",
//   age: 30,
//   active: true
// };
// ```
// Try to modify the object with wrong types.
// Create another object with optional properties using ?.

const user: { name: string; age: number; active: boolean } = {
  name: "John",
  age: 30,
  active: true,
};

// user.name = 123;
// user.age = "30";
// user.active = "yes";

/******************************************************************************/
// Create another object with optional properties using ?.

const basicUser: {
  name: string;
  age: number;
  email?: string;
  phone?: string;
} = {
  name: "Alice",
  age: 28,
};

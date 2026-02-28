// 6) Extending Interfaces¶
// Create Employee extending Person with role: string.
// Assign an object with all required fields.
// Try omitting a Person field—observe error.
// Add a department?: string and see optional usage.

interface Person5 {
  name: string;
  age: number;
}

interface Employee extends Person5 {
  role: string;
  department?: string;
}

let worker: Employee = {
  name: "John",
  age: 30,
  role: "Developer",
  // department: "Engineering",
};

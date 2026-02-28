// 3) Optional Properties¶
// Add middleName?: string to Person.
// Create a Person object without middleName.
// Access middleName safely with optional chaining. 
// Try to force its use without checking—observe the error. 

type Person3 = {
  name: string;
  age: number;
  middleName?: string;
};

const bob: Person3 = {
  name: "Bob",
  age: 30,
};

console.log(bob.middleName?.toUpperCase());
// console.log(bob.middleName.toUpperCase());

// Create type Readonly<T> = { readonly [K in keyof T]: T[K] }.
// Apply to User.
// Try modifying—observe error.
// Add optional modifier Partial<T> and test.

type ReadonlyType<T> = { readonly [K in keyof T]: T[K] };

interface mappedUser {
  id: string;
  name: string;
  age: number;
}

type ReadonlyUser = ReadonlyType<mappedUser>;

let user11: ReadonlyUser = {
  id: "123",
  name: "John Doe",
  age: 30,
};

// user11.id = "456";

type ReadonlyUser1 = Partial<mappedUser>;

let mapuser: ReadonlyUser1 = {
  id: "123",
  name: "j",
  age: 31,
};


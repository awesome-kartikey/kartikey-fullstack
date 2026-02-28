// 5) Utility Types¶
// Use Partial<Person> to make all fields optional.
// Use Pick<Person, "name"> to select only the name.
// Use Omit<Person, "age"> to exclude a field.
// Combine utility types for flexible modeling.

type Person4 = {
  name: string;
  age: number;
  email: string;
  phone: string;
  id: string;
  city: string;
};

const newPerson: Partial<Person4> = {
  name: "John",
  age: 30,
  email: "john@example.com",
  // address: "123 Main St",
};

const personName: Pick<Person4, "name"> = {
  name: "John",
};

const personwithoutAge: Omit<Person4, "age"> = {
  name: "John",
  email: "john@example.com",
  phone: "123-456-7890",
  id: "123",
  city: "New York",
};

const combinePerson: Partial<Person4> & Pick<Person4, "name"> = {
  name: "John",
  city: "New York",
};

const partialPick: Partial<Pick<Person4, "name" | "email">> = {
  name: "John",
  email: "john@example.com",
};

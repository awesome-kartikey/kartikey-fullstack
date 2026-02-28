// Define type User = { id: string; profile: { name: string; address: { city: string } } }.
// Write type City = User["profile"]["address"]["city"].
// Try creating a recursive JsonValue type that covers string | number | boolean | null | JsonValue[] | { [k: string]: JsonValue }.

type IndexedUser = {
  id: string;
  profile: {
    name: string;
    address: {
      city: string;
    };
  };
};

type City = IndexedUser["profile"]["address"]["city"];

type JsonValue = string | number | boolean | null | JsonValue[] | { [k: string]: JsonValue };

//Example
const recursiveUser: JsonValue = {
  id: "123",
  profile: {
    name: "John Doe",
    address: {
      city: "New York",
    },
  },
};

//Another Example
const website : JsonValue = {
  text: "abc",
  arrayofelements: [1,3, "avc", true],
  live: true,  
}
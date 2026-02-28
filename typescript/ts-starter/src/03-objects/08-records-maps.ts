// 8) Records and Maps¶
// Use Record<string, number> to map product names to prices.
// Create a Map<string, Person> and add entries.
// Compare differences between Record and Map.

type ProductPrices = Record<string, number>;

interface Person7 {
  name: string;
  age: number;
}

const prices: ProductPrices = {
  iPhone: 999,
  "MacBook Pro": 1999,
  "Apple Watch": 499,
};

let personMap = new Map<string, Person7>();

personMap.set("user1", {
  name: "John",
  age: 30,
});

personMap.set("user2", {
  name: "Alice",
  age: 25,
});

console.log(personMap.get("user1")?.name);

//A Record is a simple data structure for static lookups, Runs at compile time only.
// while a Map is a powerful built-in object for dynamic data management and complex keys. Runs at runtime

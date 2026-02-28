// 8) Records and Maps¶
// Use Record<string, number> to map product names to prices.
// Create a Map<string, Person> and add entries.
// Compare differences between Record and Map.
var _a;
var prices = {
    iPhone: 999,
    "MacBook Pro": 1999,
    "Apple Watch": 499,
};
var personMap = new Map();
personMap.set("user1", {
    name: "John",
    age: 30,
});
personMap.set("user2", {
    name: "Alice",
    age: 25,
});
console.log((_a = personMap.get("user1")) === null || _a === void 0 ? void 0 : _a.name);
//A Record is a simple data structure for static lookups, Runs at compile time only.
// while a Map is a powerful built-in object for dynamic data management and complex keys. Runs at runtime

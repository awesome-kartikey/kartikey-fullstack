function wrapInObject<T>(value: T): { data: T } {
  return { data: value };
}

// Test it
const wrappedString = wrapInObject("hello"); 
const wrappedNumber = wrapInObject(123);

console.log(wrappedString.data.toUpperCase()); // Should work
// console.log(wrappedNumber.data.toUpperCase()); // Should be a type error

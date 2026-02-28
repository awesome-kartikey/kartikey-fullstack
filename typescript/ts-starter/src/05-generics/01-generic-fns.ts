// Write function identity<T>(arg: T): T { return arg; }.
// Call with numbers, strings, and objects.
// Let TS infer T vs passing <string> explicitly.
// Try returning any instead—observe loss of safety.

function identity<T>(arg: T): T {
  return arg;
}

identity(42);
identity("hello");
identity({ name: "John" });

const explicitly = identity<string>("hello");

function identityAny<T>(arg: T): any {
  return arg;
}

let anyname = identityAny("hello");
// anyname = identityAny(42);
console.log(anyname.toUpperCase());

// Create type Keys<T> = keyof T.
// Given interface User { id: string; age: number }, see Keys<User>.
// Write function getProp<T, K extends keyof T>(obj: T, key: K): T[K].
// Call getProp(user, "id") vs getProp(user, "missing").

type Keys<T> = keyof T;

interface KeyUser {
  id: string;
  age: number;
}

type KeysUser = Keys<KeyUser>;

function getProp<T, K extends keyof T>(obj: T, key: K): T[K] {
  console.log(obj[key]);
  return obj[key];
}

let user9: KeyUser = { id: "555", age: 30 };

getProp(user9, "id");
// getProp(user9, "missing");

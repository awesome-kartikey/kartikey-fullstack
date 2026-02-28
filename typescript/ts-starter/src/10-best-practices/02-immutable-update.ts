// Immutable update: Start with a function that mutates an array of users. Rewrite it to use spreads and readonly arrays. Demonstrate that consumers of the function cannot accidentally modify shared state.

function updateUsers(users: User[], newUser: User) {
  users.push(newUser);
  return users;
}

/*******************************************************************************/

function updateUsers2(users: readonly User[], newUser: User): User[] {
  return [...users, newUser];
}

const users: readonly User[] = [
  {
    id: "1",
    name: "Alice",
    age: 30,
  },
];

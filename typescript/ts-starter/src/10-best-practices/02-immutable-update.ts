// Immutable update: Start with a function that mutates an array of immutable_users. Rewrite it to use spreads and readonly arrays. Demonstrate that consumers of the function cannot accidentally modify shared state.

type User20 = {
  id: number;
  name: string;
  age: number;
};
function updateUsers(immutable_users: User20[], newUser: User20) {
  immutable_users.push(newUser);
  return immutable_users;
}

/*******************************************************************************/

function updateUsers2(immutable_users: readonly User20[], newUser: User20): User20[] {
  return [...immutable_users, newUser];
}

const immutable_users: readonly User20[] = [
  {
    id: 1,
    name: "Alice",
    age: 30,
  },
];

// Write async function fetchUser(id: string): Promise<User> that returns a mocked user after a setTimeout.
// Call it from another async function and await the result.
// Remove the await accidentally and observe how the type becomes Promise<User>.

type AsyncUser = {
  id: string;
  name: string;
};

async function fetchUser(id: string): Promise<AsyncUser> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ id, name: "John" });
    }, 1000);
  });
}

async function showUser() {
  const user1 = await fetchUser("123"); // Type is user1 : AsyncUser
  const user2 = fetchUser("123"); // Type is Promise<AsyncUser>
  console.log(user1, user2);
}

showUser();

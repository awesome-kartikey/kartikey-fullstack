// Wrap awaited calls in try/catch and return typed results: Result<T> = { ok: true; value: T } | { ok: false; error: string }.
// Compare with throwing exceptions—when to use each.
// Ensure unhandled rejections are avoided (always await or return the promise).

const sleep6 = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

type User = {
  id: number;
  name: string;
};

type Result2<T> = { ok: true; value: T } | { ok: false; error: string };

const sampleUser: User[] = [
  { id: 1, name: "user1" },
  { id: 2, name: "user2" },
];

async function fetchUser(id: string): Promise<Result2<User>> {
  await sleep6(1000);
  const user = sampleUser.find((u) => u.id === Number(id));
  if (user) return { ok: true, value: user };
  return { ok: false, error: "User not found" };
}

async function main() {
  const result = await fetchUser("1");
  if (result.ok) {
    console.log(result.value);
  } else {
    console.log(result.error);
  }
}

main();

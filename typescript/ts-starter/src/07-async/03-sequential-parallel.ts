// Call fetchUser(id1), fetchUser(id2) sequentially and measure time.
// Call them in parallel with const [a,b] = await Promise.all([fetchUser(id1), fetchUser(id2)]) and compare.
// Use Promise.allSettled to collect partial success.

async function fetchUser1(id: string): Promise<object> {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return { id };
}

async function loadSequentially() {
  const start = Date.now();
  const user1 = await fetchUser1("123");
  const user2 = await fetchUser1("456");
  console.log("Sequential:", Date.now() - start, "ms");
  console.log(user1, user2);
}

async function loadingParallel() {
  const start = Date.now();
  const user1 = fetchUser1("123");
  const user2 = fetchUser1("456");
  const [a, b] = await Promise.all([user1, user2]);
  console.log("Parallel:", Date.now() - start, "ms");
  console.log(a, b);
}

loadSequentially();
loadingParallel();

/******************************************************************************/

async function loadingAllSettled() {
  const promises = [fetchUser1("123"), fetchUser1("456")];

  const results = await Promise.allSettled(promises);
  console.log(results);
}

// Ensure function signatures use Promise<T> and not just T.
// Model an API: type ApiResponse<T> = { status: number; data: T } and return Promise<ApiResponse<User>>.
// Create a tiny wrapper typedFetch<T>(input: RequestInfo, init?: RequestInit): Promise<T> with zod parsing.

import { z } from "zod";

type User = {
  id: number;
  name: string;
};

type ApiResponse<T> = { status: number; data: T | null };

const sampleUser: User[] = [
  { id: 1, name: "user1" },
  { id: 2, name: "user2" },
];

async function fetchUserApi(id: string): Promise<ApiResponse<User>> {
  const user = sampleUser.find((u) => u.id === Number(id));
  if (user) return { status: 200, data: user };
  return { status: 404, data: null };
}

fetchUserApi("1").then((res) => console.log(res));
fetchUserApi("99").then((res) => console.log(res));

const UserSchema = z.object({
  id: z.number(),
  name: z.string(),
});

async function typedFetch<T>(schema: z.ZodType<T>, url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, init);
  const json = await response.json();
  return schema.parse(json);
}

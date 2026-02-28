// Use Record<string, T> for a dictionary.
// Use Pick<User, "id"> and Omit<User, "age">.
// Combine with generics in functions: function pluck<T, K extends keyof T>(objs: T[], key: K): T[K][].

const scores: Record<string, number> = {
  Maths: 60,
  Science: 65,
};

interface UtilityUser {
  id: number;
  name: string;
  age: number;
}

type UserId = Pick<UtilityUser, "id">;
type UserWithoutAge = Omit<UtilityUser, "age">;

function pluck<T, K extends keyof T>(objs: T[], key: K): T[K][] {
  return [];
}
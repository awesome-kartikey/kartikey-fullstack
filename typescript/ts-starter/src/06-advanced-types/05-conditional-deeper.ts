// Define type PromiseType<T> = T extends Promise<infer U> ? U : T.
// Apply to Promise<string>, Promise<number>, and boolean.

type PromiseType<T> = T extends Promise<infer U> ? U : T;

type A = PromiseType<Promise<string>>;
type B = PromiseType<Promise<number>>;
type C = PromiseType<boolean>;

// Define type Nullable<T> = T | null.
// Define type NonNullable<T> = T extends null | undefined ? never : T.
// Apply NonNullable<string | null | undefined>.

type Nullable<T> = T | null;

type ConditionalNonNullable<T> = T extends null | undefined ? never : T;

type NonNullableString = ConditionalNonNullable<string | null | undefined>;

// When T is a union, conditional types automatically apply to each member separately. 
// This is called distributive conditional types.

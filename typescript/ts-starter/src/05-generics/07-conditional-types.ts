// Define type IsString<T> = T extends string ? true : false.
// Test with IsString<string> and IsString<number>.
// Define ElementType<T> = T extends (infer U)[] ? U : T.
// Apply to string[], number[], boolean.

type IsString<T> = T extends string ? true : false;

type C1 = IsString<string>;
type C2 = IsString<number>;

type ElementType<T> = T extends (infer U)[] ? U : T;

type StrArray = ElementType<string[]>;
type NumArray = ElementType<number[]>;
type NotArray = ElementType<boolean>;

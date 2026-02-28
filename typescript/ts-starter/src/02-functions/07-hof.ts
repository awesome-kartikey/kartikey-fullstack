// Higher-Order Functions¶
// Write a function applyTwice(fn: (x: number) => number, val: number).
// Pass a lambda (n) => n * 2.
// Try passing a function with wrong signature—see error.
// Modify applyTwice to be generic: <T>(fn: (x: T) => T, val: T).

/******************************************************************************/
function applyTwice(fn: (x: number) => number, val: number): number {
  const once = fn(val);
  return fn(once);
}
function applyTenPercentDiscount(price: number): number {
  return price * 0.9;
}

const priceAfterTwoDiscounts: number = applyTwice(applyTenPercentDiscount, 1000);

console.log("priceAfterTwoDiscounts: ", priceAfterTwoDiscounts); // 810

/******************************************************************************/
//Pass a lambda (n) => n * 2.
const lambdaResult = applyTwice((n) => n * 2, 5);
console.log("lambdaResult: ",lambdaResult); // 20 (5 * 2 = 10, 10 * 2 = 20)

/******************************************************************************/
// wrong function signature

// const result3 = applyTwice((s: string) => s.toUpperCase(), 5);

/******************************************************************************/
// Modify applyTwice to be generic: <T>(fn: (x: T) => T, val: T).

function genericApplyTwice<T>(fn: (x: T) => T, val: T): T {
  return fn(fn(val));
}

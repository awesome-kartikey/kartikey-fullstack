function calculateTotal(prices: number[]): number {
  let total = 0;

  for (const price of prices) {
    total += price;
  }
  return total;
}

const items = [10, 20, 30, 40];
const items_result = calculateTotal(items);
console.log(`Total price: ${items_result}`);

setTimeout(() => {
  console.log("Debug demo complete.");
}, 1000);

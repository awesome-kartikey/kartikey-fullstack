// 3) Rest Parameters
// Write a function sumAll(...nums: number[]) that adds all numbers.
// Call it with varying numbers of arguments.
// Try using string arguments—see the error.

function sumAll(...nums: number[]): number {
  let sum = 0;
  for (let num of nums) {
    sum += num;
  }
  return sum;
}

console.log(sumAll(1, 2, 3, 4, 5));
// sumAll(1, 2, "a", "b", "c");

/******************************************************************************/
// Change the parameter type to (string | number)[] and handle both.
function shopingCart(...items: (string | number)[]) {
  items.forEach((item) => {
    //item name
    if (typeof item === "string") {
      console.log(`${item.toUpperCase()}`);
      
    }
    // items quantity 
    else {
      console.log(`You bought ${item}`);
    }
  });
}

shopingCart(2, "apple", 3, "banana", 5, "orange");

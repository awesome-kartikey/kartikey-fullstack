// 11) Callback Function Typing¶
// Write a function that accepts a callback with specific signature.
// Create different callback functions that match the signature.
// Test with arrays of different types using proper function typing.



function callbackFunction<T>(arr: T[], callback: (item: T) => void) {
    arr.forEach(callback);
}

const logString = (item: string) => console.log(item);
const logNumber = (item: number) => console.log(item);

callbackFunction(["a", "b", "c"], logString);
callbackFunction([1, 2, 3], logNumber);
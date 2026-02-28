// 4) Index Signatures¶
// Create an interface Dictionary with [key: string]: string.
// Add entries like { en: "Hello", fr: "Bonjour" }.
// Try adding a number—see error.
// Change value type to string | number and retry.

interface Dictionary {
  [key: string]: string;
}

const dictionary: Dictionary = {
  en: "Hello",
  fr: "Bonjour",
};

dictionary.sp = "Hola";
// dictionary.number = 123;

interface Dictionary2 {
  [key: string]: string | number;
}

const dictionary2: Dictionary2 = {
  en: "Hello",
  number: 123,
};

dictionary2.sp = "Hola";
dictionary2.count = 5;

// 1. Define:
// ```
// type Shape =
//   | { kind: "circle"; radius: number }
//   | { kind: "square"; size: number }
//   | { kind: "rectangle"; width: number; height: number };
// ```
// 2. Write function area(shape: Shape): number.
// 3. Use switch (shape.kind) to handle each case.
// 4. Add a never check to ensure all kinds are covered.

type Shape =
  | { kind: "circle"; radius: number }
  | { kind: "square"; size: number }
  | { kind: "rectangle"; width: number; height: number };

function unionArea(shape: Shape): number {
  switch (shape.kind) {
    case "circle":
      return Math.PI * shape.radius ** 2;
    case "square":
      return shape.size ** 2;
    case "rectangle":
      return shape.width * shape.height;
    default:
      const exhaustiveCheck: never = shape;
      throw new Error(`Unhandled shape: ${exhaustiveCheck}`);
  }
}

unionArea({ kind: "circle", radius: 5 });
unionArea({ kind: "square", size: 10 });
unionArea({ kind: "rectangle", width: 5, height: 10 });

// Exhaustive union: Define a discriminated union Shape = Circle | Square | Triangle. Add a new variant Polygon and make the compiler guide you to all the switch sites that need updating. Verify using a never branch.

type Shape3 =
  | { kind: "circle"; radius: number }
  | { kind: "square"; size: number }
  | { kind: "rectangle"; width: number; height: number };
// | { kind: "triangle"; base: number; height: number };

function area(shape: Shape3): number {
  switch (shape.kind) {
    case "circle":
      return Math.PI * shape.radius ** 2;
    case "square":
      return shape.size ** 2;
    case "rectangle":
      return shape.width * shape.height;
    default:
      const _exhaustiveCheck: never = shape;
      throw new Error(`Unhandled shape: ${_exhaustiveCheck}`);
  }
}

area({ kind: "circle", radius: 5 });
area({ kind: "square", size: 10 });
area({ kind: "rectangle", width: 5, height: 10 });

// Write function isCircle(s: Shape): s is { kind: "circle"; radius: number }.
// Use it in area function instead of switch.
// Try narrowing it manually using `in` operator. ????

type Shape2 = { kind: "circle"; radius: number } | { kind: "square"; size: number };

function isCircle(s: Shape2): s is { kind: "circle"; radius: number } {
  return s.kind === "circle";
}

function isSquare(s: Shape2): s is { kind: "square"; size: number } {
  return s.kind === "square";
}

function area2(shape: Shape2): number {
  if (isCircle(shape)) {
    return Math.PI * shape.radius ** 2;
  }
  if (isSquare(shape)) {
    return shape.size ** 2;
  }
  const _exhaustiveCheck: never = shape;
  throw new Error(`Unhandled shape: ${_exhaustiveCheck}`);
}

area2({ kind: "circle", radius: 5 });
area2({ kind: "square", size: 10 });

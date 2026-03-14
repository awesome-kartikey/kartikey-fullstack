function level3() {
  throw new Error("Something went wrong in level3!");
}

function level2() {
  level3();
}

function level1() {
  level2();
}

level1();
